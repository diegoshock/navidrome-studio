import { useGetOne } from 'react-admin'
import { makeStyles } from '@material-ui/core/styles'
import subsonic from '../subsonic'
import { useImageUrl } from '../common/useImageUrl'

const useStyles = makeStyles({
  backdrop: {
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
    background: '#101012',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 35%',
      filter: 'blur(36px) saturate(.65)',
      transform: 'scale(1.15)',
      opacity: 0.38,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, #08080922, #080809c9 80%, #080809)',
    },
  },
})

// Images stay on the authenticated Navidrome artwork endpoint. Its existing
// provider/local-upload pipeline handles artist discovery and caching.
const BackdropImage = ({ record, fallbackRecord }) => {
  const classes = useStyles()
  const url = record?.id ? subsonic.getCoverArtUrl(record, 600) : ''
  const { imgUrl, error } = useImageUrl(url)
  const fallback = useImageUrl(
    error && fallbackRecord?.id
      ? subsonic.getCoverArtUrl(fallbackRecord, 600)
      : '',
  )
  const image = imgUrl || fallback.imgUrl
  return (
    <div
      className={classes.backdrop}
      aria-hidden="true"
      data-testid="studio-backdrop"
    >
      {image && <img src={image} alt="" />}
    </div>
  )
}

const ArtistBackdrop = ({ record, artistId }) => {
  const { data: artist } = useGetOne('artist', artistId)
  const artistWithImage =
    artist?.imageHash || artist?.uploadedImage || artist?.largeImageUrl
  return (
    <BackdropImage
      record={artistWithImage ? artist : record}
      fallbackRecord={record}
    />
  )
}

export const StudioBackdrop = ({ record, artistId }) =>
  artistId ? (
    <ArtistBackdrop record={record} artistId={artistId} />
  ) : (
    <BackdropImage record={record} />
  )
