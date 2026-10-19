import { makeStyles } from '@material-ui/core/styles'

export const useBackdropLayout = makeStyles({
  root: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    padding: '32px 24px !important',
    marginBottom: 24,
    borderRadius: 8,
    '@media (max-width:599px)': {
      padding: '20px 16px !important',
      marginBottom: 16,
    },
  },
})
