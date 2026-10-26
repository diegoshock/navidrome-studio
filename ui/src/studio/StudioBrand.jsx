import StudioIcon from './StudioIcon'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: '0.13em',
    paddingLeft: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 28,
    height: 28,
    filter: theme.palette.type === 'dark' ? 'invert(1)' : 'none',
  },
}))
const StudioBrand = ({ open }) => {
  const classes = useStyles()
  return open ? (
    <Link to="/song" className={classes.root} aria-label="Studio for Navidrome">
      <StudioIcon className={classes.icon} alt="" aria-hidden="true" />
      STUDIO
    </Link>
  ) : null
}
export default StudioBrand
