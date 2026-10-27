import { useEffect, useRef } from 'react'
import { Backdrop, Drawer, useMediaQuery, makeStyles } from '@material-ui/core'
import TrapFocus from '@material-ui/core/Unstable_TrapFocus'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarVisibility } from 'react-admin'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: { width: ({ narrow }) => (narrow ? 52 : 220), flexShrink: 0 },
  paper: {
    width: ({ open }) => (open ? 220 : 52),
    top: 0,
    bottom: ({ playing }) =>
      playing ? 'calc(78px + env(safe-area-inset-bottom, 0px))' : 0,
    '@media (max-width:809px)': {
      bottom: ({ playing }) =>
        playing ? 'calc(132px + env(safe-area-inset-bottom, 0px))' : 0,
    },
    height: 'auto',
    background: theme.palette.background.default,
    borderRight: 'none',
    overflow: 'hidden',
  },
  backdrop: { zIndex: theme.zIndex.drawer - 1 },
}))

const Sidebar = ({ children }) => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const open = useSelector((state) => state.admin.ui.sidebarOpen)
  const playing = useSelector((state) => state.player?.queue?.length > 0)
  const dispatch = useDispatch()
  const location = useLocation()
  const classes = useStyles({ open, playing, narrow: mobile || !open })
  const lastPath = useRef(location.pathname)
  useEffect(() => {
    dispatch(setSidebarVisibility(!mobile))
  }, [mobile, dispatch])
  useEffect(() => {
    if (mobile && location.pathname !== lastPath.current)
      dispatch(setSidebarVisibility(false))
    lastPath.current = location.pathname
  }, [mobile, location.pathname, dispatch])
  const close = () => dispatch(setSidebarVisibility(false))
  return (
    <>
      <Backdrop
        open={mobile && open}
        onClick={close}
        className={classes.backdrop}
      />
      <Drawer
        variant="permanent"
        className={classes.root}
        classes={{ paper: classes.paper }}
      >
        <TrapFocus
          open={mobile && open}
          getDoc={() => document}
          // Settings, activity and library menus have their own MUI focus trap.
          // Let the active modal own focus instead of trapping it in both places.
          isEnabled={() =>
            !document.querySelector(
              '.MuiPopover-root:not([aria-hidden="true"]), .MuiDialog-root:not([aria-hidden="true"])',
            )
          }
        >
          <div
            style={{ height: '100%', outline: 'none' }}
            tabIndex={-1}
            onKeyDown={(event) => {
              if (mobile && open && event.key === 'Escape') {
                event.stopPropagation()
                close()
              }
            }}
          >
            {children}
          </div>
        </TrapFocus>
      </Drawer>
    </>
  )
}
export default Sidebar
