import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { MemoryRouter } from 'react-router-dom'
import StudioLibraryHeader from './StudioLibraryHeader'
import { createStudioTheme } from '../themes/studio'
import { getStudioLabels } from './useStudioLabels'

const { dispatch, list } = vi.hoisted(() => ({
  dispatch: vi.fn(),
  list: { total: 17, loaded: true },
}))

vi.mock('react-redux', () => ({ useDispatch: () => dispatch }))
vi.mock('react-admin', () => ({
  useListContext: () => list,
  useLocale: () => 'es',
  useTranslate: () => (key, options) => options?._ || key,
}))

const renderHeader = (theme = createStudioTheme(), type = 'recentlyAdded') =>
  render(
    <ThemeProvider theme={createMuiTheme(theme)}>
      <MemoryRouter>
        <StudioLibraryHeader albumListType={type} />
      </MemoryRouter>
    </ThemeProvider>,
  )

beforeEach(() => {
  dispatch.mockClear()
  list.loaded = true
})

describe('Studio library navigation', () => {
  it('links to real album filters and identifies the current view', () => {
    renderHeader()
    expect(
      screen.getByRole('link', { name: 'Favoritos' }).getAttribute('href'),
    ).toContain('filter={"starred":true}')
    expect(
      screen.getByRole('link', { name: 'Recién añadidos' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('17 álbumes en esta vista')).toBeInTheDocument()
  })

  it('does not show a stale result count during loading', () => {
    list.loaded = false
    renderHeader()
    expect(screen.queryByText(/17 álbumes/)).not.toBeInTheDocument()
  })

  it('keeps album filters available with other saved themes', () => {
    renderHeader({ palette: { type: 'light' } })
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(7)
  })

  it('supports regional Spanish and falls back for other languages', () => {
    expect(getStudioLabels('es-CL').all).toBe('Álbumes')
    expect(getStudioLabels('fr').all).toBe('Albums')
  })
})
