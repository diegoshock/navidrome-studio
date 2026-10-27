import { IconButton, Typography, makeStyles } from '@material-ui/core'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import { useDispatch, useSelector } from 'react-redux'
import { Artwork } from '../common/Artwork'
import { LoveButton } from '../common/LoveButton'
import { playTracks } from '../actions'
import { useStudioLabels } from '../studio/useStudioLabels'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'calc(100vh - 190px)',
    display: 'grid',
    gridTemplateColumns: 'minmax(300px,1fr) minmax(300px,440px)',
    margin: '0 -24px',
    '@media(max-width:900px)': { gridTemplateColumns: '1fr', margin: 0 },
  },
  stage: {
    minWidth: 0,
    padding: '42px clamp(24px,7vw,100px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'linear-gradient(145deg,#261f14,#0b0b0c 72%)',
  },
  cover: {
    width: 'min(56vh,560px)',
    maxWidth: '100%',
    aspectRatio: '1',
    alignSelf: 'center',
    borderRadius: 6,
    boxShadow: '0 24px 70px #0008',
  },
  trackMeta: {
    width: 'min(56vh,560px)',
    maxWidth: '100%',
    alignSelf: 'center',
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) auto',
    alignItems: 'center',
    marginTop: 18,
  },
  eyebrow: {
    color: '#c7ac78',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '.16em',
  },
  title: {
    fontSize: 25,
    fontWeight: 700,
    marginTop: 5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: { color: theme.palette.text.secondary, fontSize: 11, marginTop: 4 },
  actions: { display: 'flex' },
  queue: {
    minWidth: 0,
    background: '#0d0d0f',
    borderLeft: `1px solid ${theme.palette.divider}`,
    padding: '22px 18px',
    overflow: 'auto',
  },
  queueTitle: {
    fontSize: 11,
    color: theme.palette.text.secondary,
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  queueItem: {
    width: '100%',
    border: 0,
    color: theme.palette.text.primary,
    background: 'transparent',
    display: 'grid',
    gridTemplateColumns: '32px minmax(0,1fr) auto',
    gap: 10,
    textAlign: 'left',
    alignItems: 'center',
    padding: '8px 10px',
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover': { background: '#ffffff08' },
  },
  active: { background: '#c7ac7818', color: '#d8bd88' },
  queueIndex: {
    color: theme.palette.text.secondary,
    fontSize: 10,
    textAlign: 'center',
  },
  queueName: {
    fontSize: 11,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  queueMeta: { color: theme.palette.text.secondary, fontSize: 9, marginTop: 3 },
  duration: { color: theme.palette.text.secondary, fontSize: 9 },
  empty: {
    minHeight: 420,
    display: 'grid',
    placeItems: 'center',
    color: theme.palette.text.secondary,
  },
}))

const duration = (value = 0) =>
  `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`

const NowPlayingPage = () => {
  const classes = useStyles()
  const labels = useStudioLabels()
  const dispatch = useDispatch()
  const player = useSelector((state) => state.player)
  const current = player.current || player.queue[player.savedPlayIndex || 0]
  const song = current?.song
  if (!song) return <div className={classes.empty}>{labels.nothingPlaying}</div>
  const selectTrack = (selected) => {
    const songs = player.queue
      .filter((item) => item.song)
      .map((item) => item.song)
    dispatch(
      playTracks(
        Object.fromEntries(songs.map((item) => [item.id, item])),
        songs.map((item) => item.id),
        selected.id,
      ),
    )
  }
  const fullscreen = () => document.documentElement.requestFullscreen?.()
  return (
    <section className={classes.root} aria-label={labels.nowPlaying}>
      <div className={classes.stage}>
        <Artwork
          record={song}
          size={1000}
          square
          className={classes.cover}
          title={song.album}
        />
        <div className={classes.trackMeta}>
          <div>
            <div className={classes.eyebrow}>
              {labels.nowPlaying.toUpperCase()}
            </div>
            <div className={classes.title}>{song.title}</div>
            <div className={classes.meta}>
              {song.artist} · {song.album}
            </div>
          </div>
          <div className={classes.actions}>
            <LoveButton resource="song" record={song} component={IconButton} />
            <IconButton aria-label={labels.fullscreen} onClick={fullscreen}>
              <FullscreenIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <aside className={classes.queue}>
        <Typography className={classes.queueTitle}>
          {labels.queue} · {player.queue.length}
        </Typography>
        {player.queue.map((item, index) => (
          <button
            type="button"
            className={`${classes.queueItem} ${item.uuid === current.uuid ? classes.active : ''}`}
            key={item.uuid}
            onClick={() => item.song && selectTrack(item.song)}
          >
            <span className={classes.queueIndex}>{index + 1}</span>
            <span>
              <span className={classes.queueName}>
                {item.song?.title || item.name}
              </span>
              <span className={classes.queueMeta}>{item.song?.artist}</span>
            </span>
            <span className={classes.duration}>
              {duration(item.song?.duration)}
            </span>
          </button>
        ))}
      </aside>
    </section>
  )
}

export default NowPlayingPage
