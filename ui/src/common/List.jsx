import React from 'react'
import { List as RAList } from 'react-admin'
import config from '../config'
import { Pagination } from './Pagination'
import { defaultRowsPerPageOptions, getStoredPerPage } from './perPageStore'
import { ScrollPagination, SCROLL_BATCH_SIZE } from './ScrollPagination'
import { Title } from './index'

export const List = (props) => {
  const { resource } = props
  const infinite = ['song', 'artist', 'album', 'playlist'].includes(resource)
  return (
    <RAList
      title={
        <Title
          subTitle={`resources.${resource}.name`}
          args={{ smart_count: 2 }}
        />
      }
      debounce={config.uiSearchDebounceMs}
      perPage={
        infinite
          ? SCROLL_BATCH_SIZE
          : getStoredPerPage(resource, defaultRowsPerPageOptions)
      }
      pagination={infinite ? <ScrollPagination /> : <Pagination />}
      {...props}
    />
  )
}
