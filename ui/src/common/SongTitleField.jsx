import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { FunctionField } from 'react-admin'
import { useTheme } from '@material-ui/core/styles'
import { Artwork } from './Artwork'
import PlayingLight from '../icons/playing-light.gif'
import PlayingDark from '../icons/playing-dark.gif'
import PausedLight from '../icons/paused-light.png'
import PausedDark from '../icons/paused-dark.png'

const useStyles = makeStyles({
  row: { display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 },
  cover: {
    width: 44,
    height: 44,
    flexShrink: 0,
    borderRadius: 3,
    backgroundColor: '#202023',
    '@media (max-width:599px)': { width: 36, height: 36 },
  },
  name: { minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  artist: {
    color: '#a2a2aa',
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  icon: {
    width: '32px',
    height: '32px',
    verticalAlign: 'text-top',
    marginLeft: '-8px',
    marginTop: '-7px',
    paddingRight: '3px',
  },
  text: {
    verticalAlign: 'text-top',
    fontSize: 14,
    fontWeight: 500,
    overflowWrap: 'anywhere',
    '@media (max-width:599px)': {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
  subtitle: {
    opacity: 0.5,
  },
})

export const SongTitleField = ({
  showTrackNumbers,
  showArtwork = false,
  showArtist = false,
  ...props
}) => {
  const theme = useTheme()
  const classes = useStyles()
  const { record } = props
  const currentTrack = useSelector((state) => state?.player?.current || {})
  const currentId = currentTrack.trackId
  const paused = currentTrack.paused
  const isCurrent =
    currentId && (currentId === record.id || currentId === record.mediaFileId)

  const subtitle = record?.tags?.['subtitle']

  const trackName = (r) => {
    const name = r.title
    if (r.trackNumber && showTrackNumbers) {
      return r.trackNumber.toString().padStart(2, '0') + ' ' + name
    }
    if (subtitle) {
      return (
        <>
          {name}
          <span className={classes.subtitle}>{' (' + subtitle + ')'}</span>
        </>
      )
    }
    return name
  }

  const Icon = () => {
    let icon
    if (paused) {
      icon = theme.palette.type === 'light' ? PausedLight : PausedDark
    } else {
      icon = theme.palette.type === 'light' ? PlayingLight : PlayingDark
    }
    return (
      <img
        src={icon}
        className={classes.icon}
        alt={paused ? 'paused' : 'playing'}
      />
    )
  }

  return (
    <div className={classes.row}>
      {showArtwork && (
        <Artwork record={record} size={96} className={classes.cover} title="" />
      )}
      {isCurrent && <Icon />}
      <div className={classes.name}>
        <FunctionField
          {...props}
          source="title"
          render={trackName}
          className={classes.text}
        />
        {showArtist && <span className={classes.artist}>{record.artist}</span>}
      </div>
    </div>
  )
}

SongTitleField.propTypes = {
  record: PropTypes.object,
  showTrackNumbers: PropTypes.bool,
}

SongTitleField.defaultProps = {
  record: {},
  showTrackNumbers: false,
}
