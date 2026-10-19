import React, { cloneElement } from 'react'
import { sanitizeListRestProps, TopToolbar } from 'react-admin'
import { useMediaQuery } from '@material-ui/core'
import { ShuffleAllButton, ToggleFieldsMenu } from '../common'
import { PlayAllButton } from '../common/PlayAllButton'

export const SongListActions = ({
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  filterValues,
  permanentFilter,
  exporter,
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  maxResults,
  total,
  ids,
  ...rest
}) => {
  const isNotSmall = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  return (
    <TopToolbar
      className={className}
      style={{
        order: -1,
        flexBasis: '100%',
        alignItems: 'center',
        padding: '8px 0',
        marginBottom: 12,
      }}
      {...sanitizeListRestProps(rest)}
    >
      <PlayAllButton
        filters={filterValues}
        sort={currentSort}
        disabled={total === 0}
      />
      <ShuffleAllButton filters={filterValues} disabled={total === 0} />
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
      {isNotSmall && <ToggleFieldsMenu resource="song" />}
    </TopToolbar>
  )
}

SongListActions.defaultProps = {
  selectedIds: [],
  onUnselectItems: () => null,
}
