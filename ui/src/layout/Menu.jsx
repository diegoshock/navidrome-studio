import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Tooltip, Typography, makeStyles } from '@material-ui/core'
import {
  MenuItemLink,
  getResources,
  toggleSidebar,
  useTranslate,
} from 'react-admin'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined'
import HistoryIcon from '@material-ui/icons/History'
import EqualizerIcon from '@material-ui/icons/Equalizer'
import AlbumOutlinedIcon from '@material-ui/icons/AlbumOutlined'
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline'
import MusicNoteOutlinedIcon from '@material-ui/icons/MusicNoteOutlined'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import MenuIcon from '@material-ui/icons/Menu'
import PlaylistsSubMenu from './PlaylistsSubMenu'
import LibrarySelector from '../common/LibrarySelector'
import config from '../config'
import { useStudioLabels } from '../studio/useStudioLabels'
import StudioBrand from '../studio/StudioBrand'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0 8px',
    boxSizing: 'border-box',
    minHeight: 0,
  },
  brand: {
    height: 42,
    display: 'flex',
    alignItems: 'center',
    padding: '0 7px 8px',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
  group: {
    margin: '14px 13px 7px',
    color: '#777780',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
  },
  active: {
    color: '#c7ac78',
    background: theme.palette.action.selected,
    fontWeight: 600,
  },
  item: {
    margin: '1px 7px',
    padding: '7px 9px',
    minHeight: 34,
    fontSize: ({ open }) => (open ? 12 : 0),
    borderRadius: 5,
    minWidth: 0,
    '& .MuiListItemIcon-root': { minWidth: 28, color: 'inherit' },
    '& .MuiTypography-root': { fontSize: 12 },
    '& svg': { width: 17, height: 17 },
  },
  playlists: {
    marginTop: 7,
    '& .MuiListItem-root': { minHeight: 30, paddingTop: 5, paddingBottom: 5 },
    '& .MuiTypography-root': { fontSize: 11 },
  },
  footer: { flexShrink: 0, paddingTop: 6 },
}))

const LinkItem = ({ item, open, classes }) => (
  <MenuItemLink
    to={item.to}
    role="link"
    aria-label={item.label}
    primaryText={item.label}
    leftIcon={<item.icon />}
    sidebarIsOpen={open}
    className={classes.item}
    activeClassName={classes.active}
    isActive={(_, location) =>
      item.exact
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to)
    }
  />
)

const Menu = () => {
  const open = useSelector((state) => state.admin.ui.sidebarOpen)
  const resources = useSelector(getResources)
  const translate = useTranslate()
  const labels = useStudioLabels()
  const dispatch = useDispatch()
  const classes = useStyles({ open })
  const [state, setState] = useState({
    menuPlaylists: true,
    menuSharedPlaylists: true,
  })
  const has = (name) => resources.some((resource) => resource.name === name)
  const discover = [
    {
      label: labels.home,
      icon: HomeOutlinedIcon,
      to: '/discover',
      exact: true,
    },
    { label: labels.random, icon: ShuffleIcon, to: '/album/random' },
    {
      label: labels.recentlyAdded,
      icon: LibraryAddOutlinedIcon,
      to: '/album/recentlyAdded',
    },
    {
      label: labels.recentlyPlayed,
      icon: HistoryIcon,
      to: '/album/recentlyPlayed',
    },
    { label: labels.mostPlayed, icon: EqualizerIcon, to: '/album/mostPlayed' },
  ]
  const library = [
    {
      name: 'album',
      label: translate('resources.album.name', { smart_count: 2 }),
      icon: AlbumOutlinedIcon,
      to: '/album/all',
    },
    {
      name: 'artist',
      label: translate('resources.artist.name', { smart_count: 2 }),
      icon: PeopleOutlineIcon,
      to: '/artist',
    },
    {
      name: 'song',
      label: translate('resources.song.name', { smart_count: 2 }),
      icon: MusicNoteOutlinedIcon,
      to: '/song',
    },
    {
      name: 'song',
      label: labels.favorites,
      icon: FavoriteBorderIcon,
      to: '/favorites',
      exact: true,
    },
  ]
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
            onClick={() => dispatch(toggleSidebar())}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Tooltip>
        <StudioBrand open={open} />
      </div>
      <div className={classes.scroll}>
        {open && <Typography className={classes.group}>Discover</Typography>}
        <nav aria-label="Discover">
          {discover.map((item) => (
            <LinkItem key={item.to} item={item} open={open} classes={classes} />
          ))}
        </nav>
        {open && (
          <Typography className={classes.group}>{labels.library}</Typography>
        )}
        <nav aria-label={labels.library}>
          {library
            .filter((item) => has(item.name))
            .map((item) => (
              <LinkItem
                key={item.to}
                item={item}
                open={open}
                classes={classes}
              />
            ))}
        </nav>
        {open && <LibrarySelector />}
        {has('playlist') && (
          <div className={classes.playlists}>
            {open && (
              <Typography className={classes.group}>
                {labels.playlists}
              </Typography>
            )}
            <LinkItem
              item={{
                label: labels.allPlaylists,
                icon: QueueMusicIcon,
                to: '/playlist',
                exact: true,
              }}
              open={open}
              classes={classes}
            />
            {config.devSidebarPlaylists && open && (
              <PlaylistsSubMenu
                state={state}
                setState={setState}
                sidebarIsOpen={open}
                dense
              />
            )}
          </div>
        )}
      </div>
      <div className={classes.footer}>
        <LinkItem
          item={{
            label: labels.nowPlaying,
            icon: GraphicEqIcon,
            to: '/now-playing',
            exact: true,
          }}
          open={open}
          classes={classes}
        />
      </div>
    </div>
  )
}

export default Menu
