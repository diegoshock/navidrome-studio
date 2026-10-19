import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useListContext, useTranslate } from 'react-admin'
import { Link } from 'react-router-dom'
import albumLists from '../album/albumLists'
import { useStudioLabels } from './useStudioLabels'
const useStyles = makeStyles((theme) => ({
  root: { padding: '0 0 16px' },
  navigation: { display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 },
  tab: {
    color: theme.palette.text.secondary,
    padding: '7px 12px',
    fontSize: 13,
  },
  active: { color: '#c7ac78', background: theme.palette.action.selected },
  count: { fontSize: 12, color: theme.palette.text.secondary },
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
      </nav>
      {loaded && (
        <Typography className={classes.count}>
          {total} {total === 1 ? labels.countOne : labels.count}
        </Typography>
      )}
    </section>
  )
}
export default StudioLibraryHeader
