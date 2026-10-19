import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetOne, useTranslate } from 'react-admin'
import { GlobalHotKeys } from 'react-hotkeys'
import IconButton from '@material-ui/core/IconButton'
import { useMediaQuery, Menu, MenuItem } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { RiSaveLine } from 'react-icons/ri'
import { LoveButton, QualityInfo, useToggleLove } from '../common'
import { useStudioLabels } from '../studio/useStudioLabels'
import { decisionService } from '../transcode'
import { openSaveQueueDialog } from '../actions'
import { keyMap } from '../hotkeys'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end',
    gap: '0.5rem',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  mobileListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    height: 24,
  },
  button: {
    width: '2.5rem',
    height: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  mobileButton: {
    width: 24,
    height: 24,
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  mobileIcon: {
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
  },
  compact: { display: 'flex', flexShrink: 0 },
  favorite: { '@media (max-width:1100px)': { display: 'none' } },
  quality: { padding: '8px 16px' },
}))

const PlayerToolbar = ({
  id,
  isRadio,
  compact,
  onLyrics,
  onClear,
  gainInfo,
}) => {
  const dispatch = useDispatch()
  const { data, loading } = useGetOne('song', id, { enabled: !!id && !isRadio })
  const [toggleLove, toggling] = useToggleLove('song', data)
  const isDesktop = useMediaQuery('(min-width:810px)')
  const classes = useStyles()
  const labels = useStudioLabels()
  const translate = useTranslate()
  const [anchor, setAnchor] = useState(null)

  const handlers = {
    TOGGLE_LOVE: useCallback(() => toggleLove(), [toggleLove]),
  }

  const handleSaveQueue = useCallback(
    (e) => {
      dispatch(openSaveQueueDialog())
      e.stopPropagation()
    },
    [dispatch],
  )

  const buttonClass = isDesktop ? classes.button : classes.mobileButton
  const listItemClass = isDesktop ? classes.toolbar : classes.mobileListItem

  const saveQueueButton = (
    <IconButton
      size={isDesktop ? 'small' : undefined}
      onClick={handleSaveQueue}
      disabled={isRadio}
      data-testid="save-queue-button"
      className={buttonClass}
    >
      <RiSaveLine className={!isDesktop ? classes.mobileIcon : undefined} />
    </IconButton>
  )

  const loveButton = (
    <LoveButton
      record={data}
      resource={'song'}
      size={isDesktop ? undefined : 'inherit'}
      disabled={loading || toggling || !id || isRadio}
      className={buttonClass}
    />
  )

  if (compact) {
    const decision = decisionService.getCachedDecision(id)
    const closeAndRun = (action) => (event) => {
      setAnchor(null)
      action(event)
    }
    return (
      <div className={classes.compact}>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges />
        <div className={classes.favorite}>{loveButton}</div>
        <IconButton
          aria-label={labels.playerOptions}
          aria-haspopup="menu"
          aria-expanded={!!anchor}
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
          <MenuItem
            onClick={closeAndRun(toggleLove)}
            disabled={loading || toggling || !id || isRadio}
          >
            {data?.starred ? labels.removeFavorite : labels.addFavorite}
          </MenuItem>
          <MenuItem onClick={closeAndRun(handleSaveQueue)} disabled={isRadio}>
            {labels.saveQueue}
          </MenuItem>
          <MenuItem onClick={closeAndRun(onLyrics)}>
            {translate('player.toggleLyricText')}
          </MenuItem>
          <MenuItem onClick={closeAndRun(onClear)}>
            {translate('player.destroyText')}
          </MenuItem>
          {data && (
            <div className={classes.quality}>
              <QualityInfo
                record={data}
                {...gainInfo}
                transcodeStream={decision?.transcodeStream}
                isDirectPlay={decision?.canDirectPlay}
              />
            </div>
          )}
        </Menu>
      </div>
    )
  }

  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges />
      {isDesktop ? (
        <li className={`${listItemClass} item`}>
          {saveQueueButton}
          {loveButton}
        </li>
      ) : (
        <>
          <li className={`${listItemClass} item`}>{saveQueueButton}</li>
          <li className={`${listItemClass} item`}>{loveButton}</li>
        </>
      )}
    </>
  )
}

export default PlayerToolbar
