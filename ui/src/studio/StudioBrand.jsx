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
  },
}))
const StudioBrand = ({ open }) => {
  const classes = useStyles()
  return open ? (
    <Link to="/song" className={classes.root} aria-label="Navidrome Studio">
      STUDIO
    </Link>
  ) : null
}
export default StudioBrand
