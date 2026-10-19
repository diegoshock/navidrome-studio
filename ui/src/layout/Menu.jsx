import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, IconButton, Tooltip, makeStyles } from '@material-ui/core'
import {
  useTranslate,
  MenuItemLink,
  getResources,
  usePermissions,
  useRefresh,
  toggleSidebar,
} from 'react-admin'
import MusicNoteOutlinedIcon from '@material-ui/icons/MusicNoteOutlined'
import AlbumOutlinedIcon from '@material-ui/icons/AlbumOutlined'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import MenuIcon from '@material-ui/icons/Menu'
import RefreshIcon from '@material-ui/icons/Refresh'
import PlaylistsSubMenu from './PlaylistsSubMenu'
import LibrarySelector from '../common/LibrarySelector'
import config from '../config'
import { useStudioLabels } from '../studio/useStudioLabels'
import StudioBrand from '../studio/StudioBrand'
import { SettingsMenu } from './AppBar'
import ActivityPanel from './ActivityPanel'
import NowPlayingPanel from './NowPlayingPanel'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 0 8px',
  },
  brand: { display: 'flex', alignItems: 'center', padding: '0 8px 16px' },
  scroll: { flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 },
  primary: { paddingBottom: 20 },
  active: {
    color: '#c7ac78',
    background: theme.palette.action.selected,
    fontWeight: 600,
  },
  item: {
    margin: '3px 8px',
    padding: '12px',
    fontSize: ({ open }) => (open ? 14 : 0),
    borderRadius: 5,
    minWidth: 0,
    '& .MuiListItemIcon-root': {
      minWidth: 32,
      color: theme.palette.text.secondary,
    },
    '& .MuiTypography-root': { fontSize: 14 },
  },
  footer: {
    flexShrink: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: '8px 8px 0',
    paddingTop: 8,
  },
  tools: { display: 'flex', flexWrap: 'wrap', alignItems: 'center' },
  settings: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    fontSize: 13,
  },
}))

const primaryNavigation = [
  { name: 'song', icon: MusicNoteOutlinedIcon, to: '/song' },
  { name: 'artist', icon: PeopleOutlineIcon, to: '/artist' },
  { name: 'album', icon: AlbumOutlinedIcon, to: '/album/all' },
  { name: 'playlist', icon: QueueMusicIcon, to: '/playlist' },
]

const Menu = ({ logout }) => {
  const open = useSelector((state) => state.admin.ui.sidebarOpen)
  const resources = useSelector(getResources)
  const translate = useTranslate()
  const labels = useStudioLabels()
  const dispatch = useDispatch()
  const refresh = useRefresh()
  const { permissions } = usePermissions()
  const classes = useStyles({ open })
  const [state, setState] = useState({
    menuPlaylists: true,
    menuSharedPlaylists: true,
  })
  return (
    <div className={classes.root}>
      <div className={classes.brand}>
        <Tooltip
          title={translate(
            open ? 'ra.action.close_menu' : 'ra.action.open_menu',
          )}
        >
          <IconButton
            aria-label={translate(
              open ? 'ra.action.close_menu' : 'ra.action.open_menu',
            )}
            aria-expanded={open}
            onClick={() => dispatch(toggleSidebar())}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
        <StudioBrand open={open} />
      </div>
      <div className={classes.scroll}>
        <nav aria-label={labels.navigation} className={classes.primary}>
          {primaryNavigation
            .filter(({ name }) => resources.some((r) => r.name === name))
            .map(({ name, icon: Icon, to }) => (
              <MenuItemLink
                key={name}
                to={to}
                role="link"
                aria-label={
                  name === 'playlist'
                    ? 'Playlists'
                    : translate(`resources.${name}.name`, { smart_count: 2 })
                }
                isActive={(_, location) =>
                  location.pathname.startsWith(`/${name}`)
                }
                primaryText={
                  name === 'playlist'
                    ? 'Playlists'
                    : translate(`resources.${name}.name`, { smart_count: 2 })
                }
                leftIcon={<Icon />}
                sidebarIsOpen={open}
                className={classes.item}
                activeClassName={classes.active}
              />
            ))}
        </nav>
        {open && <LibrarySelector />}
        {config.devSidebarPlaylists && open && (
          <>
            <Divider />
            <PlaylistsSubMenu
              state={state}
              setState={setState}
              sidebarIsOpen={open}
            />
          </>
        )}
      </div>
      <div className={classes.footer}>
        <div className={classes.tools}>
          <Tooltip title={translate('ra.action.refresh')}>
            <IconButton
              aria-label={translate('ra.action.refresh')}
              onClick={() => refresh()}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {config.devActivityPanel &&
            permissions === 'admin' &&
            config.enableNowPlaying && <NowPlayingPanel />}
          {config.devActivityPanel && permissions === 'admin' && (
            <ActivityPanel />
          )}
        </div>
        <div className={classes.settings}>
          <SettingsMenu logout={logout} />
          {open && <span aria-hidden="true">{translate('menu.settings')}</span>}
        </div>
      </div>
    </div>
  )
}
export default Menu
