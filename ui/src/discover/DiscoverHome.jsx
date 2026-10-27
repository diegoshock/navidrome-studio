import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { useDataProvider } from 'react-admin'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Artwork } from '../common/Artwork'
import { AlbumContextMenu } from '../common/ContextMenus'
import { SongContextMenu } from '../common'
import { setTrack, shuffleTracks } from '../actions'
import { useStudioLabels } from '../studio/useStudioLabels'

const useStyles = makeStyles((theme) => ({
  root: { minWidth: 0, paddingBottom: 24 },
  hero: {
    minHeight: 126,
    borderRadius: 10,
    padding: '24px 28px',
    marginBottom: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    background: 'linear-gradient(110deg, #211d16, #171512 55%, #211b13)',
    border: `1px solid ${theme.palette.divider}`,
    '& h1': { margin: '6px 0 4px', fontSize: 34, letterSpacing: '-.04em' },
    '& p': { margin: 0, color: theme.palette.text.secondary, fontSize: 13 },
    '@media(max-width:599px)': {
      padding: 20,
      alignItems: 'flex-start',
      flexDirection: 'column',
      '& h1': { fontSize: 27 },
    },
  },
  eyebrow: {
    color: '#c7ac78',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '.14em',
    textTransform: 'uppercase',
  },
  heroActions: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  action: {
    borderRadius: 22,
    padding: '9px 16px',
    background: '#ffffff0a',
    border: '1px solid #ffffff12',
    color: theme.palette.text.primary,
  },
  section: { marginBottom: 30 },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 650 },
  seeAll: {
    color: theme.palette.text.secondary,
    fontSize: 11,
    textDecoration: 'none',
    '&:hover': { color: '#c7ac78' },
  },
  shelf: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(132px, 176px)',
    gap: 16,
    overflowX: 'auto',
    paddingBottom: 8,
    scrollbarWidth: 'thin',
  },
  card: { minWidth: 0, position: 'relative' },
  coverLink: {
    display: 'block',
    position: 'relative',
    aspectRatio: '1',
    borderRadius: 5,
    overflow: 'hidden',
    background: '#151517',
  },
  cover: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    opacity: 0,
    transition: 'opacity .15s',
    '$card:hover &,$card:focus-within &': { opacity: 1 },
    '& button': { color: '#fff', background: '#090909a8' },
  },
  cardTitle: {
    color: theme.palette.text.primary,
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    textDecoration: 'none',
    marginTop: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    color: theme.palette.text.secondary,
    fontSize: 10,
    marginTop: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  songs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: '2px 22px',
    '@media(max-width:750px)': { gridTemplateColumns: '1fr' },
  },
  song: {
    display: 'grid',
    gridTemplateColumns: '42px minmax(0,1fr) auto',
    gap: 10,
    alignItems: 'center',
    minHeight: 54,
    padding: '5px 4px',
    borderRadius: 5,
    cursor: 'pointer',
    '&:hover': { background: theme.palette.action.hover },
    '&:focus-visible': { outline: '2px solid #c7ac78' },
  },
  songCover: { width: 42, height: 42, borderRadius: 3 },
  songTitle: {
    fontSize: 12,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  loading: { minHeight: 300, display: 'grid', placeItems: 'center' },
}))

const todaySeed = () => {
  const date = new Date()
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
}
const listParams = (field, filter = {}) => ({
  pagination: { page: 1, perPage: 8 },
  sort: { field, order: 'DESC' },
  filter,
})

const AlbumShelf = ({ title, albums, to }) => {
  const classes = useStyles()
  return (
    <section className={classes.section}>
      <div className={classes.sectionHead}>
        <Typography className={classes.sectionTitle}>{title}</Typography>
        {to && (
          <Link className={classes.seeAll} to={to}>
            Ver todo →
          </Link>
        )}
      </div>
      <div className={classes.shelf}>
        {albums.map((album) => (
          <article className={classes.card} key={album.id}>
            <Link className={classes.coverLink} to={`/album/${album.id}/show`}>
              <Artwork
                record={album}
                size={500}
                square
                className={classes.cover}
                title={album.name}
              />
            </Link>
            <span className={classes.overlay}>
              <AlbumContextMenu record={album} />
            </span>
            <Link className={classes.cardTitle} to={`/album/${album.id}/show`}>
              {album.name}
            </Link>
            <div className={classes.meta}>
              {album.artist}
              {album.year ? ` · ${album.year}` : ''}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

const DiscoverHome = () => {
  const classes = useStyles()
  const labels = useStudioLabels()
  const dataProvider = useDataProvider()
  const dispatch = useDispatch()
  const history = useHistory()
  const [content, setContent] = useState(null)
  const seed = useMemo(todaySeed, [])
  useEffect(() => {
    let active = true
    Promise.all([
      dataProvider.getList('album', listParams('random', { seed })),
      dataProvider.getList('song', listParams('random', { seed })),
      dataProvider.getList('album', listParams('recently_added')),
      dataProvider.getList(
        'album',
        listParams('play_date', { recently_played: true }),
      ),
      dataProvider.getList(
        'album',
        listParams('play_count', { recently_played: true }),
      ),
    ])
      .then(
        ([dailyAlbums, dailySongs, added, played, most]) =>
          active &&
          setContent({
            dailyAlbums: dailyAlbums.data,
            dailySongs: dailySongs.data,
            added: added.data,
            played: played.data,
            most: most.data,
          }),
      )
      .catch(
        () =>
          active &&
          setContent({
            dailyAlbums: [],
            dailySongs: [],
            added: [],
            played: [],
            most: [],
          }),
      )
    return () => {
      active = false
    }
  }, [dataProvider, seed])
  if (!content)
    return (
      <div className={classes.loading}>
        <CircularProgress size={28} />
      </div>
    )
  const shuffleDaily = () =>
    dispatch(
      shuffleTracks(
        Object.fromEntries(content.dailySongs.map((song) => [song.id, song])),
      ),
    )
  const surpriseAlbum = () =>
    content.dailyAlbums[0] &&
    history.push(`/album/${content.dailyAlbums[0].id}/show`)
  return (
    <main className={classes.root}>
      <section className={classes.hero}>
        <div>
          <span className={classes.eyebrow}>{labels.dailyMix}</span>
          <h1>{labels.discoverTitle}</h1>
          <p>{labels.discoverDescription}</p>
        </div>
        <div className={classes.heroActions}>
          <Button
            className={classes.action}
            startIcon={<ShuffleIcon />}
            onClick={surpriseAlbum}
          >
            {labels.pickAlbum}
          </Button>
          <Button
            className={classes.action}
            startIcon={<PlayArrowIcon />}
            onClick={shuffleDaily}
          >
            {labels.shuffleSongs}
          </Button>
        </div>
      </section>
      <AlbumShelf
        title={labels.dailyAlbums}
        albums={content.dailyAlbums}
        to="/album/random"
      />
      <section className={classes.section}>
        <div className={classes.sectionHead}>
          <Typography className={classes.sectionTitle}>
            {labels.dailySongs}
          </Typography>
          <button hidden aria-hidden="true" />
        </div>
        <div className={classes.songs}>
          {content.dailySongs.map((song) => (
            <div
              className={classes.song}
              key={song.id}
              role="button"
              tabIndex={0}
              onClick={() => dispatch(setTrack(song))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ')
                  dispatch(setTrack(song))
              }}
            >
              <Artwork
                record={song}
                size={120}
                square
                className={classes.songCover}
                title={song.album}
              />
              <div>
                <div className={classes.songTitle}>{song.title}</div>
                <div className={classes.meta}>
                  {song.artist} · {song.album}
                </div>
              </div>
              <SongContextMenu record={song} source="starred_at" />
            </div>
          ))}
        </div>
      </section>
      <AlbumShelf
        title={labels.recentlyAdded}
        albums={content.added}
        to="/album/recentlyAdded"
      />
      <AlbumShelf
        title={labels.recentlyPlayed}
        albums={content.played}
        to="/album/recentlyPlayed"
      />
      <AlbumShelf
        title={labels.mostPlayed}
        albums={content.most}
        to="/album/mostPlayed"
      />
    </main>
  )
}

export default DiscoverHome
