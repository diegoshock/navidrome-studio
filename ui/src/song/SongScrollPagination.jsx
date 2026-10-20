import { useEffect, useRef } from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { useListContext, useTranslate } from 'react-admin'
import { useSelector } from 'react-redux'

export const SONG_BATCH_SIZE = 50

// Keep the complete visible prefix in react-admin's list context so playback,
// bulk actions and refreshed records all use the same ordered collection.
export const SongScrollPagination = () => {
  const {
    ids,
    total,
    loading,
    error,
    perPage,
    setPerPage,
    setPage,
    filterValues,
    currentSort,
    refetch,
  } = useListContext()
  const libraries = useSelector((state) => state.library?.selectedLibraries)
  const translate = useTranslate()
  const sentinel = useRef(null)
  const requested = useRef(null)
  const previousQuery = useRef(null)
  const query = JSON.stringify([filterValues, currentSort, libraries])

  useEffect(() => {
    if (previousQuery.current === query) return
    // react-admin batches URL updates in a timer. Wait until that batch has
    // completed before resetting its window, otherwise it drops this update.
    const timer = setTimeout(() => {
      previousQuery.current = query
      requested.current = null
      setPage(1)
      setPerPage(SONG_BATCH_SIZE)
    }, 0)
    return () => clearTimeout(timer)
  }, [query, setPage, setPerPage])

  useEffect(() => {
    const onScroll = () => {
      if (
        loading ||
        error ||
        ids.length >= total ||
        ids.length < perPage ||
        requested.current === perPage
      )
        return
      const rect = sentinel.current?.getBoundingClientRect()
      if (rect && rect.top <= window.innerHeight + 300 && rect.bottom >= 0) {
        requested.current = perPage
        setPerPage(perPage + SONG_BATCH_SIZE)
      }
    }
    // Capture also handles scrolling inside the application layout. Loading is
    // triggered by scrolling, never by a sentinel that stays visible on mount.
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  }, [ids.length, total, loading, error, perPage, setPerPage])

  return (
    <div
      ref={sentinel}
      style={{ minHeight: 48, padding: 16 }}
      aria-live="polite"
    >
      {loading && (
        <CircularProgress
          size={20}
          aria-label={translate('ra.message.loading')}
        />
      )}
      {error && (
        <Button
          onClick={() => {
            requested.current = null
            refetch()
          }}
        >
          {translate('ra.action.refresh')}
        </Button>
      )}
    </div>
  )
}
