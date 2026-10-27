import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import Menu from './Menu'

const resources = ['album', 'song', 'artist', 'playlist'].map((name) => ({
  name,
  hasList: true,
}))

vi.mock('react-admin', () => ({
  useTranslate: () => (key) => key,
  useLocale: () => 'en',
  getResources: () => resources,
  toggleSidebar: () => ({ type: 'toggle' }),
  MenuItemLink: ({ to, primaryText }) => <a href={to}>{primaryText}</a>,
}))
vi.mock('../common/LibrarySelector', () => ({ default: () => null }))
vi.mock('./PlaylistsSubMenu', () => ({
  default: () => <div>Saved playlists</div>,
}))

const renderMenu = () =>
  render(
    <Provider
      store={createStore(() => ({ admin: { ui: { sidebarOpen: true } } }))}
    >
      <ThemeProvider theme={createTheme()}>
        <MemoryRouter>
          <Menu />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )

it('groups Discover, Library, playlists and Now Playing in the sidebar', () => {
  renderMenu()
  const destinations = [...screen.getAllByRole('link')].map((link) =>
    link.getAttribute('href'),
  )
  expect(destinations).toEqual(
    expect.arrayContaining([
      '/discover',
      '/album/random',
      '/album/recentlyAdded',
      '/album/recentlyPlayed',
      '/album/mostPlayed',
      '/album/all',
      '/artist',
      '/song',
      '/favorites',
      '/playlist',
      '/now-playing',
    ]),
  )
  expect(destinations).not.toContain('/radio')
  expect(destinations).not.toContain('/share')
  expect(screen.getByText('Saved playlists')).toBeInTheDocument()
})
