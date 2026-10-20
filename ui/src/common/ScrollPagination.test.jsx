import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { ScrollPagination } from './ScrollPagination'

let context
let libraries
vi.mock('react-admin', () => ({
  useListContext: () => context,
  useTranslate: () => (key) => key,
}))
vi.mock('react-redux', () => ({
  useSelector: (select) =>
    select({ library: { selectedLibraries: libraries } }),
}))

beforeEach(() => {
  libraries = [1]
  context = {
    ids: Array.from({ length: 50 }, (_, i) => i),
    total: 800,
    perPage: 50,
    loading: false,
    filterValues: {},
    currentSort: { field: 'title', order: 'ASC' },
    setPage: vi.fn(),
    setPerPage: vi.fn(),
    refetch: vi.fn(),
  }
})
it('loads only on scroll, once per batch, until all songs are visible', async () => {
  const view = render(<ScrollPagination />)
  await waitFor(() => expect(context.setPage).toHaveBeenCalledWith(1))
  context.setPerPage.mockClear()
  expect(context.setPerPage).not.toHaveBeenCalled()
  fireEvent.scroll(document)
  fireEvent.scroll(document)
  expect(context.setPerPage).toHaveBeenCalledExactlyOnceWith(100)
  context = { ...context, perPage: 100, setPerPage: vi.fn() }
  view.rerender(<ScrollPagination />)
  fireEvent.scroll(document)
  expect(context.setPerPage).not.toHaveBeenCalled()
  context.ids = Array.from({ length: 100 }, (_, i) => i)
  view.rerender(<ScrollPagination />)
  fireEvent.scroll(document)
  expect(context.setPerPage).toHaveBeenCalledWith(150)
  context.ids = Array.from({ length: 800 }, (_, i) => i)
  context.perPage = 800
  context.setPerPage.mockClear()
  view.rerender(<ScrollPagination />)
  fireEvent.scroll(document)
  expect(context.setPerPage).not.toHaveBeenCalled()
})
it('resets the visible window when search, sort or library changes', async () => {
  const view = render(<ScrollPagination />)
  for (const update of [
    () => {
      context.filterValues = { title: 'Lunar' }
    },
    () => {
      context.currentSort = { field: 'title', order: 'DESC' }
    },
    () => {
      libraries = [2]
    },
  ]) {
    context.setPerPage.mockClear()
    update()
    view.rerender(<ScrollPagination />)
    await waitFor(() =>
      expect(context.setPerPage).toHaveBeenCalledExactlyOnceWith(50),
    )
  }
})
it('does not load away from the bottom or while loading, and allows retry', () => {
  const view = render(<ScrollPagination />)
  const sentinel = view.container.firstChild
  sentinel.getBoundingClientRect = () => ({ top: 5000, bottom: 5050 })
  context.setPerPage.mockClear()
  fireEvent.scroll(document)
  expect(context.setPerPage).not.toHaveBeenCalled()
  sentinel.getBoundingClientRect = () => ({ top: 100, bottom: 150 })
  context.loading = true
  view.rerender(<ScrollPagination />)
  fireEvent.scroll(document)
  expect(context.setPerPage).not.toHaveBeenCalled()
  context.loading = false
  context.error = new Error('offline')
  view.rerender(<ScrollPagination />)
  fireEvent.scroll(document)
  expect(context.setPerPage).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'ra.action.refresh' }))
  expect(context.refetch).toHaveBeenCalledOnce()
})

it('resets when navigating to another collection of the same resource', async () => {
  const view = render(<ScrollPagination resetKey="playlist-a" />)
  await waitFor(() => expect(context.setPage).toHaveBeenCalledWith(1))
  context.setPerPage.mockClear()
  view.rerender(<ScrollPagination resetKey="playlist-b" />)
  await waitFor(() =>
    expect(context.setPerPage).toHaveBeenCalledExactlyOnceWith(50),
  )
})
