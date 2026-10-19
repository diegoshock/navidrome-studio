import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import StudioPlayerBar from './StudioPlayerBar'

const { dispatch } = vi.hoisted(() => ({ dispatch: vi.fn() }))
vi.mock('react-redux', () => ({ useDispatch: () => dispatch }))
vi.mock('react-admin', () => ({
  useTranslate: () => (key) => key,
  useLocale: () => 'en',
}))
vi.mock('../common/Artwork', () => ({ Artwork: () => null }))
vi.mock('./AudioTitle', () => ({
  default: ({ audioInfo }) => <span>{audioInfo.song?.title}</span>,
}))
vi.mock('./PlayerToolbar', () => ({ default: () => null }))

describe('Studio playback bar', () => {
  let audio, engine, state
  const draw = () => (
    <MemoryRouter>
      <ThemeProvider theme={createTheme()}>
        <StudioPlayerBar audio={audio} engine={engine} playerState={state} />
      </ThemeProvider>
    </MemoryRouter>
  )
  beforeEach(() => {
    vi.clearAllMocks()
    audio = Object.assign(new EventTarget(), {
      paused: true,
      currentTime: 12,
      duration: 240,
      readyState: 4,
      togglePlay: vi.fn(),
      playPrev: vi.fn(),
      playNext: vi.fn(),
    })
    engine = {
      current: {
        openAudioListsPanel: vi.fn(),
        onAudioSeeked: vi.fn(),
        onAudioSoundChange: vi.fn(),
      },
    }
    state = {
      current: { song: { id: 'a', title: 'A song', artist: 'An artist' } },
      queue: [{ id: 'a' }],
      volume: 0.6,
      mode: 'order',
    }
  })
  it('uses the existing playback and queue controls', () => {
    render(draw())
    fireEvent.click(screen.getByLabelText('player.clickToPlayText'))
    fireEvent.click(screen.getByLabelText('player.nextTrackText'))
    fireEvent.click(screen.getByLabelText('player.previousTrackText'))
    fireEvent.click(screen.getByLabelText('Play queue (1)'))
    expect(audio.togglePlay).toHaveBeenCalledOnce()
    expect(audio.playNext).toHaveBeenCalledOnce()
    expect(audio.playPrev).toHaveBeenCalledOnce()
    expect(engine.current.openAudioListsPanel).toHaveBeenCalledOnce()
  })
  it('tracks pause/play and progress when playback changes outside the bar', () => {
    render(draw())
    act(() => {
      audio.paused = false
      audio.currentTime = 42
      audio.dispatchEvent(new Event('playing'))
    })
    expect(screen.getByLabelText('player.clickToPauseText')).toBeInTheDocument()
    expect(screen.getByText('0:42')).toBeInTheDocument()
    act(() => {
      audio.paused = true
      audio.dispatchEvent(new Event('pause'))
    })
    expect(screen.getByLabelText('player.clickToPlayText')).toBeInTheDocument()
  })
  it('supports keyboard seeking through the engine, including paused lyrics', () => {
    render(draw())
    fireEvent.keyDown(
      screen.getByRole('slider', { name: 'Playback progress' }),
      { key: 'ArrowRight' },
    )
    expect(engine.current.onAudioSeeked).toHaveBeenCalledWith(12.1)
  })
  it('handles repeated seek keys immediately without invoking global shortcuts', () => {
    engine.current.onAudioSeeked.mockImplementation((value) => {
      audio.currentTime = value
    })
    const globalKey = vi.fn()
    render(<div onKeyDown={globalKey}>{draw()}</div>)
    const slider = screen.getByRole('slider', { name: 'Playback progress' })
    for (let i = 0; i < 20; i++)
      fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(audio.currentTime).toBeCloseTo(14)
    expect(globalKey).not.toHaveBeenCalled()
  })
  it('mutes and restores the last perceptual volume', () => {
    const { rerender } = render(draw())
    fireEvent.click(screen.getByLabelText('Mute'))
    expect(engine.current.onAudioSoundChange).toHaveBeenLastCalledWith(0)
    expect(dispatch.mock.calls.at(-1)[0].data.volume).toBe(0)
    state = { ...state, volume: 0 }
    rerender(draw())
    fireEvent.click(screen.getByLabelText('Unmute'))
    expect(engine.current.onAudioSoundChange).toHaveBeenLastCalledWith(0.6)
    expect(dispatch.mock.calls.at(-1)[0].data.volume).toBe(0.6)
  })
  it('keeps shuffle and repeat modes synchronized with the existing engine', () => {
    const { rerender } = render(draw())
    fireEvent.click(screen.getByLabelText('player.playModeText.shufflePlay'))
    expect(dispatch.mock.calls[0][0].data.mode).toBe('shufflePlay')
    state = { ...state, mode: 'singleLoop' }
    rerender(draw())
    expect(
      screen.getByLabelText('Repeat: player.playModeText.singleLoop'),
    ).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(
      screen.getByLabelText('Repeat: player.playModeText.singleLoop'),
    )
    expect(dispatch.mock.calls[1][0].data.mode).toBe('order')
  })
  it('disables seeking on radio streams and removes native listeners on unmount', () => {
    state.current.isRadio = true
    const remove = vi.spyOn(audio, 'removeEventListener')
    const { unmount } = render(draw())
    expect(
      screen.getByRole('slider', { name: 'Playback progress' }),
    ).not.toHaveAttribute('tabindex')
    unmount()
    expect(remove).toHaveBeenCalledWith('timeupdate', expect.any(Function))
  })
})
