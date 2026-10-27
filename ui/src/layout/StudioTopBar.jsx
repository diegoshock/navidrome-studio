import { useState } from 'react'
import {
  Avatar,
  IconButton,
  InputBase,
  Typography,
  makeStyles,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import { useGetIdentity } from 'react-admin'
import { useHistory } from 'react-router-dom'
import { SettingsMenu } from './AppBar'
import { useStudioLabels } from '../studio/useStudioLabels'

const useStyles = makeStyles((theme) => ({
  root: {
    height: 52,
    flexShrink: 0,
    display: 'grid',
    gridTemplateColumns: 'minmax(180px,370px) 1fr auto',
    alignItems: 'center',
    gap: 20,
    padding: '0 18px',
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: '#0b0b0cf5',
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  search: {
    height: 32,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 11px',
    borderRadius: 18,
    background: '#ffffff09',
    border: '1px solid #ffffff0b',
    color: theme.palette.text.secondary,
    '&:focus-within': { borderColor: '#c7ac7866' },
  },
  input: { color: theme.palette.text.primary, fontSize: 12, flex: 1 },
  account: { display: 'flex', alignItems: 'center', gap: 4 },
  identity: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '0 4px',
    color: theme.palette.text.secondary,
  },
  avatar: { width: 22, height: 22 },
  name: {
    fontSize: 10,
    maxWidth: 110,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '@media(max-width:599px)': { display: 'none' },
  },
  spacer: {},
  '@media(max-width:700px)': {
    root: { gridTemplateColumns: 'minmax(120px,1fr) auto', padding: '0 8px' },
    spacer: { display: 'none' },
  },
}))

const StudioTopBar = ({ logout }) => {
  const classes = useStyles()
  const labels = useStudioLabels()
  const history = useHistory()
  const { loaded, identity } = useGetIdentity()
  const [search, setSearch] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const value = search.trim()
    history.push(
      value
        ? `/song?filter=${encodeURIComponent(JSON.stringify({ title: value }))}`
        : '/song',
    )
  }
  return (
    <header className={classes.root}>
      <form className={classes.search} role="search" onSubmit={submit}>
        <SearchIcon fontSize="small" />
        <InputBase
          className={classes.input}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={labels.searchLibrary}
          inputProps={{ 'aria-label': labels.searchLibrary }}
        />
      </form>
      <span className={classes.spacer} />
      <div className={classes.account}>
        <SettingsMenu logout={logout} />
        <div className={classes.identity}>
          {loaded && identity?.avatar ? (
            <Avatar className={classes.avatar} src={identity.avatar} alt="" />
          ) : (
            <AccountCircleOutlinedIcon fontSize="small" />
          )}
          <Typography className={classes.name}>
            {identity?.fullName || localStorage.getItem('username') || ''}
          </Typography>
        </div>
      </div>
    </header>
  )
}

export default StudioTopBar
