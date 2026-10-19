import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout as RALayout, toggleSidebar } from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'
import { HotKeys } from 'react-hotkeys'
import Menu from './Menu'
import AppBar from './AppBar'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import Notification from './Notification'
import useCurrentTheme from '../themes/useCurrentTheme'
import { useSearchRefocus } from '../common'

const useStyles = makeStyles({
  root: {
    paddingBottom: ({ addPadding }) =>
      addPadding ? 'calc(104px + env(safe-area-inset-bottom, 0px))' : 0,
    '@media (max-width:809px)': {
      paddingBottom: ({ addPadding }) =>
        addPadding ? 'calc(160px + env(safe-area-inset-bottom, 0px))' : 0,
    },
  },
  appFrame: { marginTop: '0 !important' },
  heading: {
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: '-0.035em',
    margin: '8px 0 24px',
    '@media (max-width:599px)': { fontSize: 28, marginBottom: 16 },
  },
})

const Layout = (props) => {
  const theme = useCurrentTheme()
  const location = useLocation()
  const hasDetailHeading = /^\/(album|artist|playlist)\/[^/]+\/show/.test(
    location.pathname,
  )
  const queue = useSelector((state) => state.player?.queue)
  const classes = useStyles({ addPadding: queue.length > 0 })
  const dispatch = useDispatch()
  useSearchRefocus()

  const keyHandlers = {
    TOGGLE_MENU: useCallback(() => dispatch(toggleSidebar()), [dispatch]),
  }

  return (
    <HotKeys handlers={keyHandlers}>
      <RALayout
        {...props}
        className={classes.root}
        classes={{ appFrame: classes.appFrame }}
        menu={Menu}
        sidebar={Sidebar}
        appBar={AppBar}
        theme={theme}
        notification={Notification}
      >
        <Typography
          component={hasDetailHeading ? 'div' : 'h1'}
          hidden={hasDetailHeading}
          id="react-admin-title"
          className={classes.heading}
        />
        {props.children}
      </RALayout>
    </HotKeys>
  )
}

export default Layout
