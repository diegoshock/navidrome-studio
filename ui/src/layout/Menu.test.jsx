import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import Menu from './Menu'
import config from '../config'

const resources = ['album', 'radio', 'share', 'song', 'artist', 'playlist'].map(
  (name) => ({ name, hasList: true }),
)
vi.mock('react-admin', () => ({
  useTranslate: () => (key) => key,
  useLocale: () => 'en',
  getResources: () => resources,
  usePermissions: () => ({ permissions: 'admin' }),
  useRefresh: () => vi.fn(),
  toggleSidebar: () => ({ type: 'toggle' }),
  MenuItemLink: ({ to, primaryText }) => <a href={to}>{primaryText}</a>,
}))
vi.mock('./AppBar', () => ({ SettingsMenu: () => <button>Settings</button> }))
vi.mock('../common/LibrarySelector', () => ({ default: () => null }))
vi.mock('./PlaylistsSubMenu', () => ({
  default: () => <div>Saved playlists</div>,
}))
vi.mock('./NowPlayingPanel', () => ({
  default: () => <button>Now playing</button>,
}))
vi.mock('./ActivityPanel', () => ({ default: () => <button>Activity</button> }))
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

it('orders the four music destinations and omits Radio and Shares even when registered', () => {
  renderMenu()
  const links = screen.getByRole('navigation').querySelectorAll('a')
  expect([...links].map((a) => a.getAttribute('href'))).toEqual([
    '/song',
    '/artist',
    '/album/all',
    '/playlist',
    '/recently-added',
  ])
  expect(screen.getByRole('link', { name: 'Recently added' })).toHaveAttribute(
    'href',
    '/recently-added',
  )
  expect(screen.getByText('Saved playlists')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
})
it('keeps refresh, activity and now-playing access in the sidebar', () => {
  config.devActivityPanel = true
  config.enableNowPlaying = true
  renderMenu()
  expect(
    screen.getByRole('button', { name: 'ra.action.refresh' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', { name: 'Now playing' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Activity' })).toBeInTheDocument()
})
