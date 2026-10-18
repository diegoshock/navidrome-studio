import { Button, IconButton, Tooltip, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined'
import Brightness7OutlinedIcon from '@material-ui/icons/Brightness7Outlined'
import { useListContext, useTranslate } from 'react-admin'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { changeTheme } from '../actions/themes'
import albumLists from '../album/albumLists'
import { useStudioLabels } from './useStudioLabels'

const useStyles = makeStyles((theme) => ({
  root: { padding: '26px 0 0' },
  heading: { display: 'flex', justifyContent: 'space-between', gap: 16 },
  eyebrow: {
    color: theme.palette.secondary.main,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.14em',
  },
  title: {
    fontSize: 34,
    fontWeight: 750,
    letterSpacing: '-0.045em',
    lineHeight: 1.15,
    margin: '12px 0',
  },
  description: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    lineHeight: 1.7,
  },
  toggle: {
    alignSelf: 'flex-start',
    border: `1px solid ${theme.palette.divider}`,
  },
  navigation: { display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 28 },
  tab: {
    color: theme.palette.text.secondary,
    padding: '7px 14px',
    fontSize: 13,
    fontWeight: 500,
  },
  active: {
    color: theme.palette.text.primary,
    background: theme.palette.action.selected,
    fontWeight: 600,
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'baseline',
    paddingTop: 28,
    marginTop: 20,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  sectionTitle: { fontSize: 21, fontWeight: 700, letterSpacing: '-0.025em' },
  count: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    textAlign: 'right',
  },
  '@media (max-width:599px)': {
    root: { paddingTop: 16 },
    title: { fontSize: 28 },
    description: { fontSize: 13 },
    tab: { padding: '7px 10px', fontSize: 12 },
    count: { maxWidth: 110 },
  },
}))

const StudioLibraryHeader = ({ albumListType }) => {
  const theme = useTheme()
  const classes = useStyles()
  const labels = useStudioLabels()
  const { total, loaded } = useListContext()
  const translate = useTranslate()
  const dispatch = useDispatch()
  if (!theme.studio) return null
  const dark = theme.palette.type === 'dark'
  const title = translate(`resources.album.lists.${albumListType || 'all'}`, {
    _: labels[albumListType] || labels.all,
  })
  const themeLabel = dark ? labels.light : labels.dark

  return (
    <section className={classes.root} aria-label={labels.library}>
      <div className={classes.heading}>
        <div>
          <Typography component="p" className={classes.eyebrow}>
            {labels.library}
          </Typography>
          <Typography component="h1" className={classes.title}>
            {labels.title}
          </Typography>
          <Typography component="p" className={classes.description}>
            {labels.description}
          </Typography>
        </div>
        <Tooltip title={themeLabel}>
          <IconButton
            className={classes.toggle}
            aria-label={themeLabel}
            onClick={() =>
              dispatch(changeTheme(dark ? 'StudioTheme' : 'StudioDarkTheme'))
            }
          >
            {dark ? (
              <Brightness7OutlinedIcon fontSize="small" />
            ) : (
              <Brightness4OutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </div>
      <nav className={classes.navigation} aria-label={labels.shortcuts}>
        {['recentlyAdded', 'all', 'starred', 'random']
          .filter((key) => albumLists[key])
          .map((key) => (
            <Button
              key={key}
              component={Link}
              role="link"
              to={`/album/${key}?${albumLists[key].params}`}
              className={`${classes.tab} ${albumListType === key ? classes.active : ''}`}
              aria-current={albumListType === key ? 'page' : undefined}
            >
              {labels[key]}
            </Button>
          ))}
      </nav>
      <div className={classes.section}>
        <Typography component="h2" className={classes.sectionTitle}>
          {title}
        </Typography>
        {loaded && Number.isFinite(total) && (
          <Typography component="span" className={classes.count}>
            {total.toLocaleString()}{' '}
            {total === 1 ? labels.countOne : labels.count}
          </Typography>
        )}
      </div>
    </section>
  )
}

export default StudioLibraryHeader
