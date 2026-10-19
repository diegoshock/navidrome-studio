import { Typography, makeStyles } from '@material-ui/core'
import { useStudioLabels } from '../studio/useStudioLabels'
const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    margin: '0 0 16px',
    maxWidth: 560,
    lineHeight: 1.6,
  },
}))
export const SongSelectionHint = () => {
  const labels = useStudioLabels()
  const classes = useStyles()
  return (
    <Typography component="p" className={classes.root}>
      {labels.selectionHint}
    </Typography>
  )
}
