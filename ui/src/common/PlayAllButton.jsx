import { useState } from 'react'
import { useDataProvider, useNotify } from 'react-admin'
import { useDispatch } from 'react-redux'
import { CircularProgress } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import { playTracks } from '../actions'
import { PlaybackButton } from './PlaybackButton'
import { useStudioLabels } from '../studio/useStudioLabels'

export const PlayAllButton = ({
  filters = {},
  sort = { field: 'title', order: 'ASC' },
  shuffle = false,
  disabled,
}) => {
  const dataProvider = useDataProvider()
  const dispatch = useDispatch()
  const notify = useNotify()
  const labels = useStudioLabels()
  const [loading, setLoading] = useState(false)
  const play = async () => {
    setLoading(true)
    try {
      const result = await dataProvider.getList('song', {
        pagination: { page: 1, perPage: shuffle ? 500 : 0 },
        sort: shuffle ? { field: 'random', order: 'ASC' } : sort,
        filter: { ...filters, missing: false },
      })
      const ids = result.data.map((song) => song.id)
      if (ids.length) {
        dispatch(
          playTracks(
            Object.fromEntries(result.data.map((song) => [song.id, song])),
            ids,
          ),
        )
      }
    } catch {
      notify('ra.page.error', 'warning')
    } finally {
      setLoading(false)
    }
  }
  return (
    <PlaybackButton
      label={shuffle ? labels.shuffle : labels.playAll}
      secondary={shuffle}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={play}
    >
      {loading ? (
        <CircularProgress size={18} color="inherit" />
      ) : shuffle ? (
        <ShuffleIcon />
      ) : (
        <PlayArrowIcon />
      )}
    </PlaybackButton>
  )
}
