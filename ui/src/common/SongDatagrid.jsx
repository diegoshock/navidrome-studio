import React, {
  isValidElement,
  useMemo,
  useCallback,
  useState,
  forwardRef,
} from 'react'
import { useDispatch } from 'react-redux'
import {
  Datagrid,
  PureDatagridBody,
  PureDatagridRow,
  useTranslate,
  useListContext,
} from 'react-admin'
import {
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AlbumIcon from '@material-ui/icons/Album'
import clsx from 'clsx'
import { useDrag } from 'react-dnd'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { playTracks } from '../actions'
import subsonic from '../subsonic'
import { AlbumContextMenu } from '../common'
import { DraggableTypes } from '../consts'
import { formatFullDate } from '../utils'
import { SongSelectionHint } from './SongSelectionHint'
import { useSongSelection } from './useSongSelection'
import { useStudioLabels } from '../studio/useStudioLabels'

const useStyles = makeStyles({
  subtitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle',
    display: 'flex',
    alignItems: 'center',
  },
  discIcon: {
    marginRight: '14px',
  },
  discCoverArt: {
    width: '48px',
    height: '48px',
    marginRight: '14px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
    cursor: 'pointer',
  },
  row: {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'pan-y',
    '&[aria-selected="true"]': {
      backgroundColor: '#262629',
      boxShadow: 'inset 2px 0 #c9c9ce',
    },
    '&[aria-selected="true"]:hover': { backgroundColor: '#303034' },
    '&:focus-visible': { outline: '2px solid #d4d4d8', outlineOffset: -2 },
    '&:focus-within $contextMenu': { visibility: 'visible' },
    '&:hover': {
      '& $contextMenu': {
        visibility: 'visible',
      },
    },
  },
  missingRow: {
    cursor: 'inherit',
    opacity: 0.3,
  },
  headerStyle: {
    width: '100%',
    overflowX: 'auto',
    '@media (max-width:599px)': {
      tableLayout: 'fixed',
      '& th:last-child, & td:last-child': { width: 64 },
      '& th:nth-last-child(2), & td:nth-last-child(2)': { width: 60 },
      '& th': { fontSize: 10, paddingLeft: 3, paddingRight: 3 },
      '& td': { paddingLeft: 4, paddingRight: 4 },
    },
    '& th': {
      fontWeight: 'bold',
      padding: '12px 8px',
    },
  },
  contextMenu: {
    visibility: (props) => (props.isDesktop ? 'hidden' : 'visible'),
  },
})

export const DiscSubtitleRow = forwardRef(
  ({ record, onClick, colSpan, contextAlwaysVisible }, ref) => {
    const translate = useTranslate()
    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
    const classes = useStyles({ isDesktop })
    const [imageError, setImageError] = useState(false)
    const [isLightboxOpen, setLightboxOpen] = useState(false)
    const lightboxClosedAt = React.useRef(0)
    const handlePlaySubset = (discNumber) => () => {
      // Ignore clicks shortly after the lightbox was closed to prevent
      // mobile touch events from "falling through" the overlay and
      // triggering playback.
      if (Date.now() - lightboxClosedAt.current < 400) {
        return
      }
      onClick(discNumber)
    }

    const coverArtUrl = subsonic.getDiscCoverArtUrl(
      record.albumId,
      record.discNumber,
      record.updatedAt,
      96,
    )

    const fullImageUrl = subsonic.getDiscCoverArtUrl(
      record.albumId,
      record.discNumber,
      record.updatedAt,
    )

    const handleOpenLightbox = useCallback(
      (e) => {
        if (!imageError) {
          e.stopPropagation()
          setLightboxOpen(true)
        }
      },
      [imageError],
    )

    const handleCloseLightbox = useCallback(() => {
      lightboxClosedAt.current = Date.now()
      setLightboxOpen(false)
    }, [])

    const subtitle = record.discSubtitle
      ? record.discSubtitle
      : translate('resources.song.fields.disc', {
          discNumber: record.discNumber,
        })

    return (
      <TableRow
        hover
        ref={ref}
        onClick={handlePlaySubset(record.discNumber)}
        className={classes.row}
      >
        <TableCell colSpan={colSpan}>
          <Typography variant="h6" className={classes.subtitle}>
            {!imageError ? (
              <img
                src={coverArtUrl}
                className={classes.discCoverArt}
                alt=""
                onClick={handleOpenLightbox}
                onError={() => setImageError(true)}
              />
            ) : (
              <AlbumIcon className={classes.discIcon} fontSize={'small'} />
            )}
            {subtitle}
          </Typography>
          {isLightboxOpen && !imageError && (
            // Lightbox portals out of the row, but React still bubbles its
            // events up this tree, where the row's onClick would play the disc.
            <span onClick={(e) => e.stopPropagation()}>
              <Lightbox
                imagePadding={50}
                animationDuration={200}
                imageTitle={record.album + ' - ' + subtitle}
                mainSrc={fullImageUrl}
                onCloseRequest={handleCloseLightbox}
              />
            </span>
          )}
        </TableCell>
        <TableCell>
          <AlbumContextMenu
            record={{ id: record.albumId }}
            discNumber={record.discNumber}
            showLove={false}
            className={classes.contextMenu}
            hideShare={true}
            hideInfo={true}
            visible={contextAlwaysVisible}
          />
        </TableCell>
      </TableRow>
    )
  },
)

DiscSubtitleRow.displayName = 'DiscSubtitleRow'

export const SongDatagridRow = ({
  record,
  children,
  firstTracksOfDiscs = new Set(),
  selectionAllowed = true,
  contextAlwaysVisible,
  onClickSubset,
  className,
  ...rest
}) => {
  const classes = useStyles()
  const { selectedIds = [], onToggleItem, onUnselectItems } = useListContext()
  const active = selectedIds.length > 0
  const selected = selectedIds.includes(record?.id)
  const labels = useStudioLabels()
  const selection = useSongSelection({
    id: record?.id,
    disabled: !selectionAllowed || !record || record.missing,
    active,
    selected,
    onToggle: onToggleItem,
    onCancel: onUnselectItems,
    onPlay: () => rest.rowClick?.(record.id, rest.basePath, record),
  })
  const fields = React.Children.toArray(children).filter((c) =>
    isValidElement(c),
  )

  const [, dragDiscRef] = useDrag(
    () => ({
      type: DraggableTypes.DISC,
      item: {
        discs: [
          {
            albumId: record?.albumId,
            discNumber: record?.discNumber,
          },
        ],
      },
      options: { dropEffect: 'copy' },
    }),
    [record],
  )

  const [, dragSongRef] = useDrag(
    () => ({
      type: DraggableTypes.SONG,
      canDrag: !active && !record?.missing,
      item: { ids: [record?.mediaFileId || record?.id] },
      options: { dropEffect: 'copy' },
    }),
    [record, active],
  )

  if (!record || !record.title) {
    return null
  }

  const rowClick = record.missing ? undefined : rest.rowClick

  const computedClasses = clsx(
    className,
    classes.row,
    record.missing && classes.missingRow,
  )
  const childCount = fields.length
  return (
    <>
      {firstTracksOfDiscs.has(record.id) && (
        <DiscSubtitleRow
          ref={dragDiscRef}
          record={record}
          onClick={active ? () => {} : onClickSubset}
          contextAlwaysVisible={contextAlwaysVisible}
          colSpan={childCount + (rest.expand ? 1 : 0)}
        />
      )}
      <PureDatagridRow
        ref={dragSongRef}
        record={record}
        {...rest}
        rowClick={rowClick}
        {...selection}
        hasBulkActions={false}
        tabIndex={record.missing ? -1 : 0}
        aria-selected={selected}
        aria-label={record.title}
        aria-description={selectionAllowed ? labels.selectionHint : undefined}
        data-song-id={record.id}
        className={computedClasses}
      >
        {fields}
      </PureDatagridRow>
    </>
  )
}

SongDatagridRow.propTypes = {
  record: PropTypes.object,
  children: PropTypes.node,
  firstTracksOfDiscs: PropTypes.instanceOf(Set),
  contextAlwaysVisible: PropTypes.bool,
  onClickSubset: PropTypes.func,
}

SongDatagridRow.defaultProps = {
  onClickSubset: () => {},
}

const SongDatagridBody = ({
  contextAlwaysVisible,
  showDiscSubtitles,
  selectionAllowed,
  ...rest
}) => {
  const dispatch = useDispatch()
  const { ids, data } = rest

  const playSubset = useCallback(
    (discNumber) => {
      let idsToPlay = []
      if (discNumber !== undefined) {
        idsToPlay = ids.filter((id) => data[id].discNumber === discNumber)
      }
      dispatch(
        playTracks(
          data,
          idsToPlay?.filter((id) => !data[id].missing),
        ),
      )
    },
    [dispatch, data, ids],
  )

  const firstTracksOfDiscs = useMemo(() => {
    if (!ids) {
      return new Set()
    }
    let foundSubtitle = false
    const set = new Set(
      ids
        .filter((i) => data[i])
        .reduce((acc, id) => {
          const last = acc && acc[acc.length - 1]
          foundSubtitle = foundSubtitle || data[id].discSubtitle
          if (
            acc.length === 0 ||
            (last && data[id].discNumber !== data[last].discNumber)
          ) {
            acc.push(id)
          }
          return acc
        }, []),
    )
    if (!showDiscSubtitles || (set.size < 2 && !foundSubtitle)) {
      set.clear()
    }
    return set
  }, [ids, data, showDiscSubtitles])

  return (
    <PureDatagridBody
      {...rest}
      row={
        <SongDatagridRow
          selectionAllowed={selectionAllowed}
          firstTracksOfDiscs={firstTracksOfDiscs}
          contextAlwaysVisible={contextAlwaysVisible}
          onClickSubset={playSubset}
        />
      }
    />
  )
}

export const SongDatagrid = ({
  contextAlwaysVisible,
  showDiscSubtitles,
  hasBulkActions = true,
  ...rest
}) => {
  const classes = useStyles()
  return (
    <>
      {hasBulkActions && <SongSelectionHint />}
      <Datagrid
        className={classes.headerStyle}
        isRowSelectable={(r) => !r?.missing}
        {...rest}
        hasBulkActions={false}
        body={
          <SongDatagridBody
            selectionAllowed={hasBulkActions}
            contextAlwaysVisible={contextAlwaysVisible}
            showDiscSubtitles={showDiscSubtitles}
          />
        }
      />
    </>
  )
}

SongDatagrid.propTypes = {
  contextAlwaysVisible: PropTypes.bool,
  showDiscSubtitles: PropTypes.bool,
  classes: PropTypes.object,
}
