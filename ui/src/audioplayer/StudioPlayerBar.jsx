import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslate } from 'react-admin'
import { Link } from 'react-router-dom'
import {
  CircularProgress,
  IconButton,
  Slider,
  Tooltip,
  makeStyles,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import RepeatIcon from '@material-ui/icons/Repeat'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined'
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined'
import { Artwork } from '../common/Artwork'
import { setPlayMode, setVolume as setPlayerVolume } from '../actions'
import { useStudioLabels } from '../studio/useStudioLabels'
import { useAudioStatus } from './useAudioStatus'
import AudioTitle from './AudioTitle'
import PlayerToolbar from './PlayerToolbar'

const useStyles = makeStyles((theme) => ({
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 1,
    height: 'calc(96px + env(safe-area-inset-bottom, 0px))',
    padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))',
    boxSizing: 'border-box',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 1.4fr) minmax(0, 1fr)',
    alignItems: 'center',
    gap: 24,
    background: '#18181b',
    color: '#f5f5f5',
    borderTop: '1px solid #ffffff12',
    '& button': { color: '#b2b2ba', width: 36, height: 36, padding: 8 },
    '& button:hover': { color: '#fff', background: '#ffffff0a' },
    '& button[aria-pressed="true"]': { color: '#fff', background: '#ffffff0d' },
    '& button:disabled': { color: '#777' },
    '@media (max-width:1100px)': { gap: 16, paddingLeft: 12, paddingRight: 12 },
    '@media (max-width:809px)': {
      height: 'calc(152px + env(safe-area-inset-bottom, 0px))',
      padding: '10px 12px calc(8px + env(safe-area-inset-bottom, 0px))',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gridTemplateRows: '44px 76px',
      gap: '6px 8px',
    },
  },
  track: { display: 'flex', gap: 12, alignItems: 'center', minWidth: 0 },
  coverLink: { flexShrink: 0, lineHeight: 0 },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 3,
    '@media (max-width:809px)': { width: 40, height: 40 },
  },
  title: { minWidth: 0, flex: 1, overflow: 'hidden' },
  center: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    '@media (max-width:809px)': { gridColumn: '1 / -1', gridRow: 2 },
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  play: {
    '&&': { width: 44, height: 44, color: '#fff' },
    '& svg': { fontSize: 30 },
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    height: 24,
    minWidth: 0,
  },
  time: {
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    color: '#9999a2',
    minWidth: 32,
    textAlign: 'center',
  },
  slider: {
    color: '#e9e9ed',
    height: 3,
    padding: '11px 0',
    '& .MuiSlider-rail': { opacity: 1, background: '#45454c' },
    '& .MuiSlider-thumb': {
      width: 9,
      height: 9,
      marginTop: -3,
      marginLeft: -4,
      boxShadow: 'none',
    },
  },
  tools: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    '@media (max-width:809px)': { gridColumn: 2, gridRow: 1, gap: 0 },
  },
  volume: {
    width: 88,
    marginLeft: 2,
    '@media (max-width:1100px)': { width: 64 },
    '@media (max-width:809px)': { width: 48 },
  },
}))

const formatPlayerTime = (seconds) => {
  const value = Math.max(0, Math.floor(seconds || 0))
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  return `${hours ? `${hours}:` : ''}${hours ? String(minutes).padStart(2, '0') : minutes}:${String(value % 60).padStart(2, '0')}`
}

const Control = ({ label, children, ...props }) => (
  <Tooltip title={label}>
    <IconButton aria-label={label} {...props}>
      {children}
    </IconButton>
  </Tooltip>
)

const StudioPlayerBar = ({
  audio,
  engine,
  playerState,
  gainInfo,
  queueOpen = false,
}) => {
  const classes = useStyles()
  const translate = useTranslate()
  const labels = useStudioLabels()
  const dispatch = useDispatch()
  const status = useAudioStatus(audio)
  const [seeking, setSeeking] = useState(null)
  const previousVolume = useRef(0.5)
  const current =
    playerState.current ||
    playerState.queue[playerState.savedPlayIndex || 0] ||
    {}
  const song = current.song
  const volume = playerState.volume ?? 0.5
  const duration = status.duration || song?.duration || 0
  const time = Math.min(seeking ?? status.time, duration)
  const repeat = ['orderLoop', 'singleLoop'].includes(playerState.mode)
  const repeatLabel = translate(
    `player.playModeText.${repeat ? playerState.mode : 'order'}`,
  )
  const setVolume = (value) => {
    engine.current?.onAudioSoundChange(value)
    // The engine omits its volume callback at exactly 0 and 1. Keep the
    // controlled slider and persisted setting in sync at both endpoints too.
    dispatch(setPlayerVolume(value))
  }
  const toggleMute = () => {
    if (volume > 0) previousVolume.current = volume
    setVolume(volume > 0 ? 0 : previousVolume.current)
  }

  return (
    <section
      aria-label={labels.nowPlaying}
      className={classes.bar}
      data-testid="studio-player"
      onKeyDown={(event) => {
        // Sliders own arrow/Home/End keys; focused buttons own Space/Enter.
        // Do not also send these gestures to the global playback shortcuts.
        if (
          event.target.closest('[role="slider"]') ||
          (event.target.closest('button') && [' ', 'Enter'].includes(event.key))
        ) {
          event.stopPropagation()
        }
        if (event.key === 'Escape' && queueOpen)
          engine.current?.closeAudioListsPanel(event)
      }}
    >
      <div className={classes.track}>
        <Link
          to={song?.albumId ? `/album/${song.albumId}/show` : '/song'}
          className={classes.coverLink}
          aria-label={song?.album || labels.nowPlaying}
        >
          <Artwork
            record={song}
            size={120}
            className={classes.cover}
            title={song?.album || ''}
          />
        </Link>
        <div className={classes.title}>
          <AudioTitle audioInfo={current} gainInfo={gainInfo} compact />
        </div>
        <PlayerToolbar
          compact
          gainInfo={gainInfo}
          id={current.trackId}
          isRadio={current.isRadio}
          onLyrics={() => engine.current?.toggleAudioLyric()}
          onClear={() => audio?.destroy()}
        />
      </div>
      <div className={classes.center}>
        <div className={classes.controls}>
          <Control
            label={translate('player.playModeText.shufflePlay')}
            aria-pressed={playerState.mode === 'shufflePlay'}
            onClick={() =>
              dispatch(
                setPlayMode(
                  playerState.mode === 'shufflePlay' ? 'order' : 'shufflePlay',
                ),
              )
            }
          >
            <ShuffleIcon fontSize="small" />
          </Control>
          <Control
            label={translate('player.previousTrackText')}
            onClick={() => audio?.playPrev()}
          >
            <SkipPreviousIcon />
          </Control>
          <Control
            label={translate(
              status.paused
                ? 'player.clickToPlayText'
                : 'player.clickToPauseText',
            )}
            className={classes.play}
            onClick={() => audio?.togglePlay()}
          >
            {status.loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : status.paused ? (
              <PlayArrowIcon />
            ) : (
              <PauseIcon />
            )}
          </Control>
          <Control
            label={translate('player.nextTrackText')}
            onClick={() => audio?.playNext()}
          >
            <SkipNextIcon />
          </Control>
          <Control
            label={`${labels.repeat}: ${repeatLabel}`}
            aria-pressed={repeat}
            onClick={() =>
              dispatch(
                setPlayMode(
                  playerState.mode === 'orderLoop'
                    ? 'singleLoop'
                    : playerState.mode === 'singleLoop'
                      ? 'order'
                      : 'orderLoop',
                ),
              )
            }
          >
            {playerState.mode === 'singleLoop' ? (
              <RepeatOneIcon fontSize="small" />
            ) : (
              <RepeatIcon fontSize="small" />
            )}
          </Control>
        </div>
        <div className={classes.progress}>
          <span className={classes.time}>{formatPlayerTime(time)}</span>
          <Slider
            className={classes.slider}
            aria-label={labels.progress}
            getAriaValueText={formatPlayerTime}
            min={0}
            max={duration || 1}
            step={0.1}
            value={time}
            disabled={!duration || current.isRadio}
            onChange={(_, value) => setSeeking(value)}
            onChangeCommitted={(_, value) => {
              // Use the engine's seek path to keep paused lyrics and playback reports in sync.
              engine.current?.onAudioSeeked(value)
              status.refresh()
              setSeeking(null)
            }}
          />
          <span className={classes.time}>{formatPlayerTime(duration)}</span>
        </div>
      </div>
      <div className={classes.tools}>
        <Control
          label={`${labels.queue} (${playerState.queue.length})`}
          aria-expanded={queueOpen}
          onClick={() => engine.current?.openAudioListsPanel()}
        >
          <QueueMusicIcon fontSize="small" />
        </Control>
        <Control
          label={volume > 0 ? labels.mute : labels.unmute}
          onClick={toggleMute}
        >
          {volume > 0 ? (
            <VolumeUpOutlinedIcon fontSize="small" />
          ) : (
            <VolumeOffOutlinedIcon fontSize="small" />
          )}
        </Control>
        <Slider
          className={`${classes.slider} ${classes.volume}`}
          aria-label={translate('player.volumeText')}
          min={0}
          max={1}
          step={0.01}
          value={volume}
          getAriaValueText={(value) => `${Math.round(value * 100)}%`}
          onChange={(_, value) => setVolume(value)}
        />
      </div>
    </section>
  )
}

export default StudioPlayerBar
