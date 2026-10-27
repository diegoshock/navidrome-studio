import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useListContext, useTranslate } from 'react-admin'
import { Link } from 'react-router-dom'
import albumLists from '../album/albumLists'
import { useStudioLabels } from './useStudioLabels'
const useStyles = makeStyles((theme) => ({
  root: {
    flex: '0 0 156px',
    width: 156,
    padding: '0 16px 0 0',
    boxSizing: 'border-box',
    '@media (max-width:700px)': {
      flexBasis: 128,
      width: 128,
      paddingRight: 8,
    },
  },
  navigation: {
    position: 'sticky',
    top: 68,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 2,
  },
  tab: {
    justifyContent: 'flex-start',
    color: theme.palette.text.secondary,
    padding: '8px 10px',
    minWidth: 0,
    fontSize: 12,
    lineHeight: 1.25,
    textAlign: 'left',
    whiteSpace: 'normal',
  },
  active: { color: '#c7ac78', background: theme.palette.action.selected },
  count: {
    display: 'block',
    margin: '14px 10px 0',
    fontSize: 11,
    lineHeight: 1.4,
    color: theme.palette.text.secondary,
  },
}))
const StudioLibraryHeader = ({ albumListType }) => {
  const classes = useStyles()
  const labels = useStudioLabels()
  const { total, loaded } = useListContext()
  const translate = useTranslate()
  return (
    <section className={classes.root} aria-label={labels.library}>
      <nav className={classes.navigation} aria-label={labels.shortcuts}>
        {Object.keys(albumLists).map((key) => (
          <Button
            key={key}
            component={Link}
            role="link"
            to={`/album/${key}?${albumLists[key].params}`}
            className={`${classes.tab} ${albumListType === key ? classes.active : ''}`}
            aria-current={albumListType === key ? 'page' : undefined}
          >
            {translate(`resources.album.lists.${key}`, {
              _: labels[key] || key,
            })}
          </Button>
        ))}
        {loaded && (
          <Typography className={classes.count}>
            {total} {total === 1 ? labels.countOne : labels.count}
          </Typography>
        )}
      </nav>
    </section>
  )
}
export default StudioLibraryHeader
