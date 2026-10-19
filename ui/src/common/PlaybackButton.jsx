import { Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  button: {
    borderRadius: 999,
    minWidth: 160,
    height: 48,
    padding: '0 24px',
    marginRight: 8,
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    textTransform: 'none',
    backgroundColor: ({ secondary }) => (secondary ? '#202023' : '#fafafa'),
    color: ({ secondary }) => (secondary ? '#f5f5f5' : '#101012'),
    '&:hover': {
      backgroundColor: ({ secondary }) => (secondary ? '#303034' : '#e5e5e8'),
    },
    '&:disabled': { backgroundColor: '#26262a', color: '#85858e' },
    '& .MuiButton-startIcon': { marginRight: 8, marginLeft: -4 },
    '& svg': { fontSize: 22 },
    '@media (max-width:599px)': {
      minWidth: 128,
      padding: '0 16px',
      height: 44,
      fontSize: 13,
      marginRight: 4,
    },
  },
})

export const PlaybackButton = ({
  label,
  children,
  secondary = false,
  className = '',
  ...props
}) => {
  const classes = useStyles({ secondary })
  return (
    <Button
      className={`${classes.button} ${className}`}
      startIcon={children}
      {...props}
    >
      {label}
    </Button>
  )
}
