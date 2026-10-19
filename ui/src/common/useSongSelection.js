import { useCallback, useEffect, useRef } from 'react'

export const LONG_PRESS_MS = 500
const MOVE_TOLERANCE = 10
const interactive = (event) =>
  event.target !== event.currentTarget &&
  !!event.target.closest(
    'a, button, input, select, textarea, [role="button"], [role="slider"], [data-no-selection]',
  )

// Shared by library, album and playlist rows. Pointer movement and scrolling
// cancel the timer without blocking native scrolling. A consumed gesture must
// also consume its subsequent compatibility click, even after a React render.
export const useSongSelection = ({
  id,
  disabled,
  active,
  selected,
  onToggle,
  onCancel,
  onPlay,
}) => {
  const gesture = useRef({ timer: null, start: null, suppressClick: false })
  const latest = useRef()
  latest.current = {
    id,
    disabled,
    active,
    selected,
    onToggle,
    onCancel,
    onPlay,
  }
  const clear = useCallback(() => {
    clearTimeout(gesture.current.timer)
    gesture.current.timer = null
    gesture.current.start = null
  }, [])
  const cancelGesture = useCallback(() => {
    if (gesture.current.start) gesture.current.suppressClick = true
    clear()
  }, [clear])

  useEffect(() => {
    window.addEventListener('pointerup', clear)
    window.addEventListener('pointercancel', cancelGesture)
    window.addEventListener('scroll', cancelGesture, true)
    window.addEventListener('blur', cancelGesture)
    return () => {
      clear()
      window.removeEventListener('pointerup', clear)
      window.removeEventListener('pointercancel', cancelGesture)
      window.removeEventListener('scroll', cancelGesture, true)
      window.removeEventListener('blur', cancelGesture)
    }
  }, [clear, cancelGesture, id])

  useEffect(() => {
    if (disabled) clear()
  }, [disabled, clear])

  const consume = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return {
    onPointerDown: (event) => {
      clear()
      gesture.current.suppressClick = false
      if (
        disabled ||
        event.button !== 0 ||
        event.isPrimary === false ||
        interactive(event)
      )
        return
      gesture.current.start = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      }
      gesture.current.timer = setTimeout(() => {
        const current = latest.current
        if (current.disabled) return
        gesture.current.suppressClick = true
        if (!current.selected) current.onToggle(current.id)
      }, LONG_PRESS_MS)
    },
    onPointerMove: (event) => {
      const start = gesture.current.start
      if (
        start &&
        (event.pointerId !== start.pointerId ||
          Math.hypot(event.clientX - start.x, event.clientY - start.y) >
            MOVE_TOLERANCE)
      )
        cancelGesture()
    },
    onPointerCancel: cancelGesture,
    onLostPointerCapture: clear,
    onDragStart: cancelGesture,
    onContextMenu: (event) => {
      if (!disabled && !interactive(event)) event.preventDefault()
    },
    onClickCapture: (event) => {
      if (gesture.current.suppressClick) {
        consume(event)
        return
      }
      if (!disabled && active && !interactive(event)) {
        consume(event)
        onToggle(id)
      }
    },
    onKeyDown: (event) => {
      if (disabled || interactive(event)) return
      if (event.key === 'Escape' && active) {
        consume(event)
        onCancel()
        return
      }
      if (event.key === ' ' || (event.key === 'Enter' && active)) {
        consume(event)
        if (!event.repeat) onToggle(id)
      } else if (event.key === 'Enter') {
        consume(event)
        if (!event.repeat) onPlay?.()
      }
    },
  }
}
