import { cloneElement, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'
import {
  useListContext,
  useRefresh,
  useTranslate,
  useVersion,
} from 'react-admin'
import { withWidth } from '@material-ui/core'
import {
  List,
  Title,
  useResourceRefresh,
  useScrollRestoration,
  useSetToggleableFields,
} from '../common'
import AlbumListActions from './AlbumListActions'
import AlbumTableView from './AlbumTableView'
import AlbumGridView from './AlbumGridView'
import { useRollChanged } from './useRollChanged'
import albumLists from './albumLists'
import {
  getStoredDefaultView,
  isResourceDefaultView,
} from '../personal/defaultViews'
import AlbumInfo from './AlbumInfo'
import ExpandInfoDialog from '../dialogs/ExpandInfoDialog'
import { ScrollPagination, SCROLL_BATCH_SIZE } from '../common/ScrollPagination'

// Waits for rows: restoring into an unrendered list leaves the page too short to hold the offset.
const ScrollRestorer = ({ children, ...rest }) => {
  const { loaded, total } = useListContext()
  useScrollRestoration(loaded && total > 0)
  return cloneElement(children, rest)
}

const AlbumListTitle = ({ albumListType }) => {
  const translate = useTranslate()
  let title = translate('resources.album.name', { smart_count: 2 })
  if (albumListType) {
    let listTitle = translate(`resources.album.lists.${albumListType}`, {
      smart_count: 2,
    })
    title = `${title} - ${listTitle}`
  }
  return <Title subTitle={title} args={{ smart_count: 2 }} />
}

const AlbumListPagination = ({ albumListType, seed, shownSeed, ...rest }) => {
  const { loading } = useListContext()
  const rerolling = useRollChanged(shownSeed, seed, loading)
  if (rerolling && albumListType === 'random') {
    return null
  }
  return <ScrollPagination resetKey={albumListType} {...rest} />
}

const randomStartingSeed = Math.random().toString()

const AlbumListContent = ({ grid, ...props }) =>
  grid ? <AlbumGridView {...props} /> : <AlbumTableView {...props} />

const AlbumList = (props) => {
  const shownSeed = useRef(null)
  const albumView = useSelector((state) => state.albumView)
  const location = useLocation()
  const version = useVersion()
  const refresh = useRefresh()
  useResourceRefresh('album')

  const seed = `${randomStartingSeed}-${version}`

  const albumListType = location.pathname
    .replace(/^\/album/, '')
    .replace(/^\//, '')

  // Workaround to force album columns to appear the first time.
  // See https://github.com/navidrome/navidrome/pull/923#issuecomment-833004842
  // TODO: Find a better solution
  useSetToggleableFields(
    'album',
    [
      'artist',
      'songCount',
      'playCount',
      'year',
      'mood',
      'duration',
      'rating',
      'size',
      'createdAt',
    ],
    ['createdAt', 'size'],
  )

  // If it does not have filter/sort params (usually coming from Menu),
  // reload with correct filter/sort params
  if (!location.search) {
    const type = albumListType || getStoredDefaultView()
    if (isResourceDefaultView(type)) {
      return <Redirect to={`/${type}`} />
    }
    const listParams = albumLists[type]
    if (type === 'random') {
      refresh()
    }
    if (listParams) {
      return <Redirect to={`/album/${type}?${listParams.params}`} />
    }
  }

  return (
    <>
      <List
        {...props}
        exporter={false}
        bulkActionButtons={false}
        filter={{ seed }}
        actions={<AlbumListActions />}
        perPage={SCROLL_BATCH_SIZE}
        pagination={
          <AlbumListPagination
            albumListType={albumListType}
            seed={seed}
            shownSeed={shownSeed}
          />
        }
        title={<AlbumListTitle albumListType={albumListType} />}
      >
        <ScrollRestorer>
          <AlbumListContent
            grid={albumView.grid}
            albumListType={albumListType}
            seed={seed}
            shownSeed={shownSeed}
            {...props}
          />
        </ScrollRestorer>
      </List>
      <ExpandInfoDialog content={<AlbumInfo />} />
    </>
  )
}

const AlbumListWithWidth = withWidth()(AlbumList)

export default AlbumListWithWidth
