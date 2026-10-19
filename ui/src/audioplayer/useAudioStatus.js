import { useCallback, useEffect, useState } from 'react'

// Native events also cover hotkeys, media-session controls and queue changes.
// Keep the clock local to the bar instead of updating the whole app every tick.
export const useAudioStatus = (audio) => {
  const [status, setStatus] = useState({
    paused: true,
    time: 0,
    duration: 0,
    loading: false,
  })
  const refresh = useCallback(() => {
    if (audio)
      setStatus({
        paused: audio.paused,
        time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        duration: Number.isFinite(audio.duration) ? audio.duration : 0,
        loading: !audio.paused && audio.readyState < 3,
      })
  }, [audio])
  useEffect(() => {
    if (!audio) return undefined
    const events = [
      'timeupdate',
      'durationchange',
      'loadedmetadata',
      'play',
      'playing',
      'pause',
      'ended',
      'emptied',
      'waiting',
      'seeked',
      'error',
    ]
    events.forEach((event) => audio.addEventListener(event, refresh))
    refresh()
    return () =>
      events.forEach((event) => audio.removeEventListener(event, refresh))
  }, [audio, refresh])
  return { ...status, refresh }
}
