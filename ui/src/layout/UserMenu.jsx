import * as React from 'react'
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { useTranslate, useGetIdentity } from 'react-admin'
import {
  Tooltip,
  IconButton,
  Popover,
  MenuList,
  Avatar,
  Divider,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import config from '../config'
import authProvider from '../authProvider'
import { startEventStream } from '../eventStream'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  user: {},
  button: {
    color: 'inherit',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  username: {
    maxWidth: '11em',
    padding: theme.spacing(1, 2, 2),
    listStyle: 'none',
  },
  usernameWrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}))

const UserMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const translate = useTranslate()
  const { loaded, identity } = useGetIdentity()
  const classes = useStyles(props)
  const dispatch = useDispatch()

  const { children, label, icon, logout, showAvatar = true } = props

  useEffect(() => {
    if (config.devActivityPanel) {
      authProvider
        .checkAuth()
        .then(() => startEventStream(dispatch))
        .catch(() => {})
    }
  }, [dispatch])

  if (!logout && !children) return null
  const open = Boolean(anchorEl)

  const handleMenu = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <div className={classes.user}>
      <Tooltip title={label && translate(label, { _: label })}>
        <IconButton
          className={classes.button}
          aria-label={label && translate(label, { _: label })}
          aria-owns={open ? 'menu-appbar' : null}
          aria-haspopup={true}
          aria-expanded={open}
          onClick={handleMenu}
        >
          {showAvatar && loaded && identity.avatar ? (
            <Avatar
              className={classes.avatar}
              src={identity.avatar}
              alt={identity.fullName}
            />
          ) : (
            icon
          )}
        </IconButton>
      </Tooltip>
      <Popover
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          {loaded && (
            <li role="presentation" className={classes.username}>
              <Typography
                className={classes.usernameWrap}
                variant="button"
                component="div"
                title={identity.fullName}
              >
                {identity.fullName}
              </Typography>
            </li>
          )}
          <Divider />
          {Children.map(children, (menuItem) =>
            isValidElement(menuItem)
              ? cloneElement(menuItem, {
                  onClick: handleClose,
                })
              : null,
          )}
          {(!config.auth || !!config.extAuthLogoutURL) && logout}
        </MenuList>
      </Popover>
    </div>
  )
}

UserMenu.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  logout: PropTypes.element,
}

UserMenu.defaultProps = {
  label: 'menu.settings',
  icon: <AccountCircle />,
}

export default UserMenu
