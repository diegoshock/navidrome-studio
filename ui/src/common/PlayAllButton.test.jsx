import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PlayAllButton } from './PlayAllButton'

const { getList, dispatch, notify } = vi.hoisted(() => ({
  getList: vi.fn(),
  dispatch: vi.fn(),
  notify: vi.fn(),
}))
vi.mock('react-admin', () => ({
  useDataProvider: () => ({ getList }),
  useNotify: () => notify,
  useLocale: () => 'es',
}))
vi.mock('react-redux', () => ({ useDispatch: () => dispatch }))
vi.mock('../actions', () => ({
  playTracks: (data, ids) => ({ type: 'PLAY', data, ids }),
}))

describe('Play all', () => {
  beforeEach(() => vi.clearAllMocks())
  it('plays the entire filtered collection in the chosen order, including numeric IDs', async () => {
    getList.mockResolvedValue({
      data: [
        { id: 9, title: 'Z' },
        { id: 2, title: 'A' },
      ],
    })
    render(
      <PlayAllButton
        filters={{ title: 'mix', library_id: 2, missing: true }}
        sort={{ field: 'title', order: 'DESC' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Reproducir todo' }))
    await waitFor(() => expect(dispatch).toHaveBeenCalled())
    expect(getList).toHaveBeenCalledWith('song', {
      pagination: { page: 1, perPage: 0 },
      sort: { field: 'title', order: 'DESC' },
      filter: { title: 'mix', library_id: 2, missing: false },
    })
    expect(dispatch.mock.calls[0][0].ids).toEqual([9, 2])
  })
  it('keeps the existing queue on an empty result', async () => {
    getList.mockResolvedValue({ data: [] })
    render(<PlayAllButton />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled())
    expect(dispatch).not.toHaveBeenCalled()
  })
  it('reports errors and permits retry without clearing the queue', async () => {
    getList.mockRejectedValue(new Error('offline'))
    render(<PlayAllButton />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith('ra.page.error', 'warning'),
    )
    expect(dispatch).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).not.toBeDisabled()
  })
  it('loads the complete shuffled collection and retains active filters', async () => {
    getList.mockResolvedValue({ data: [{ id: 'a' }] })
    render(<PlayAllButton shuffle filters={{ artist_id: 'ar1' }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Aleatorio' }))
    await waitFor(() => expect(dispatch).toHaveBeenCalled())
    expect(getList).toHaveBeenCalledWith('song', {
      pagination: { page: 1, perPage: 0 },
      sort: { field: 'random', order: 'ASC' },
      filter: { artist_id: 'ar1', missing: false },
    })
  })
  it('allows Discover to keep its contextual shuffle label', () => {
    render(<PlayAllButton shuffle label="Canciones al azar" />)
    expect(
      screen.getByRole('button', { name: 'Canciones al azar' }),
    ).toBeInTheDocument()
  })
})
