import { Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import MusicNoteRoundedIcon from '@material-ui/icons/MusicNoteRounded'
import { useStudioLabels } from './useStudioLabels'
import albumLists from '../album/albumLists'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '24px 22px 28px',
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  icon: {
    width: 33,
    height: 33,
    borderRadius: 9,
    display: 'grid',
    placeItems: 'center',
    background: '#d92e4c',
    color: '#fff',
    boxShadow: '0 3px 9px #d92e4c20',
  },
  name: {
    display: 'block',
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: '-0.04em',
    lineHeight: 1.15,
  },
  subtitle: {
    display: 'block',
    fontSize: 10,
    color: theme.palette.text.secondary,
    marginTop: 4,
    letterSpacing: '0.02em',
  },
}))

const StudioBrand = ({ open }) => {
  const theme = useTheme()
  const classes = useStyles()
  const labels = useStudioLabels()
  if (!theme.studio || !open) return null
  return (
    <Link
      to={`/album/recentlyAdded?${albumLists.recentlyAdded.params}`}
      className={classes.root}
      aria-label="Navidrome"
    >
      <span className={classes.icon}>
        <MusicNoteRoundedIcon />
      </span>
      <span>
        <span className={classes.name}>{labels.music}</span>
        <span className={classes.subtitle}>Navidrome · Studio</span>
      </span>
    </Link>
  )
}

export default StudioBrand
