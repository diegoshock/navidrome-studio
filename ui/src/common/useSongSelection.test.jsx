import { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useSongSelection, LONG_PRESS_MS } from './useSongSelection'

// jsdom does not provide PointerEvent; retain the actual pointer coordinates.
class TestPointerEvent extends MouseEvent {
  constructor(type, options = {}) {
    super(type, options)
    this.pointerId = options.pointerId ?? 1
    this.isPrimary = options.isPrimary ?? true
  }
}
beforeAll(() => vi.stubGlobal('PointerEvent', TestPointerEvent))
afterAll(() => vi.unstubAllGlobals())

const play = vi.fn()
const control = vi.fn()
const SelectionRows = ({ disabled = false }) => {
  const [ids, setIds] = useState([])
  return (
    <>
      <output>{ids.join(',')}</output>
      {['one', 'two'].map((id) => (
        <Row
          key={id}
          id={id}
          disabled={disabled}
          active={ids.length > 0}
          selected={ids.includes(id)}
          onToggle={(id) =>
            setIds((previous) =>
              previous.includes(id)
                ? previous.filter((i) => i !== id)
                : [...previous, id],
            )
          }
          onCancel={() => setIds([])}
        />
      ))}
    </>
  )
}
const Row = (props) => {
  const handlers = useSongSelection({ ...props, onPlay: play })
  return (
    <div data-testid={props.id} tabIndex={0} {...handlers} onClick={play}>
      <span>{props.id}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          control()
        }}
      >
        Action {props.id}
      </button>
    </div>
  )
}
const down = (row, options = {}) =>
  fireEvent.pointerDown(row, {
    button: 0,
    isPrimary: true,
    pointerId: 1,
    clientX: 10,
    clientY: 10,
    ...options,
  })
const wait = () =>
  act(() => {
    vi.advanceTimersByTime(LONG_PRESS_MS + 1)
  })
const click = (row) => {
  fireEvent.pointerUp(row, { pointerId: 1 })
  fireEvent.click(row)
}
const selected = () => screen.getByRole('status').textContent

beforeEach(() => {
  vi.useFakeTimers()
  play.mockClear()
  control.mockClear()
})
afterEach(() => vi.useRealTimers())

it('preserves a short click for playback', () => {
  render(<SelectionRows />)
  const row = screen.getByTestId('one')
  down(row)
  act(() => {
    vi.advanceTimersByTime(100)
  })
  click(row)
  wait()
  expect(play).toHaveBeenCalledTimes(1)
  expect(selected()).toBe('')
})
it('selects the held song, suppresses playback after rerender, then toggles other rows', () => {
  render(<SelectionRows />)
  const one = screen.getByTestId('one'),
    two = screen.getByTestId('two')
  down(one)
  wait()
  click(one)
  expect(selected()).toBe('one')
  expect(play).not.toHaveBeenCalled()
  down(two)
  click(two)
  expect(selected()).toBe('one,two')
  down(one)
  click(one)
  expect(selected()).toBe('two')
  expect(play).not.toHaveBeenCalled()
})
it.each(['move', 'scroll', 'pointercancel', 'blur', 'drag'])(
  'cancels %s without selecting or playing',
  (kind) => {
    render(<SelectionRows />)
    const row = screen.getByTestId('one')
    down(row)
    if (kind === 'move')
      fireEvent.pointerMove(row, { pointerId: 1, clientX: 30, clientY: 30 })
    if (kind === 'scroll') fireEvent.scroll(window)
    if (kind === 'pointercancel') fireEvent.pointerCancel(row)
    if (kind === 'blur') fireEvent.blur(window)
    if (kind === 'drag') fireEvent.dragStart(row)
    wait()
    click(row)
    expect(selected()).toBe('')
    expect(play).not.toHaveBeenCalled()
    down(row)
    click(row)
    expect(play).toHaveBeenCalledTimes(1)
  },
)
it('does not select through a nested control or a secondary pointer', () => {
  render(<SelectionRows />)
  const button = screen.getByRole('button', { name: 'Action one' })
  down(button)
  wait()
  click(button)
  expect(control).toHaveBeenCalledTimes(1)
  down(screen.getByTestId('one'), { button: 2 })
  wait()
  expect(selected()).toBe('')
  expect(play).not.toHaveBeenCalled()
})
it('supports Space, Enter and Escape without triggering global shortcuts', () => {
  const global = vi.fn()
  render(
    <div onKeyDown={global}>
      <SelectionRows />
    </div>,
  )
  const one = screen.getByTestId('one'),
    two = screen.getByTestId('two')
  fireEvent.keyDown(one, { key: ' ' })
  fireEvent.keyDown(two, { key: 'Enter' })
  expect(selected()).toBe('one,two')
  expect(play).not.toHaveBeenCalled()
  fireEvent.keyDown(two, { key: 'Escape' })
  expect(selected()).toBe('')
  fireEvent.keyDown(one, { key: 'Enter' })
  expect(play).toHaveBeenCalledTimes(1)
  expect(global).not.toHaveBeenCalled()
})
it('ignores repeat keys and clears timers on unmount', () => {
  const { unmount } = render(<SelectionRows />)
  const row = screen.getByTestId('one')
  fireEvent.keyDown(row, { key: ' ', repeat: true })
  expect(selected()).toBe('')
  down(row)
  unmount()
  wait()
  expect(play).not.toHaveBeenCalled()
  expect(vi.getTimerCount()).toBe(0)
})
it('does not select missing or otherwise disabled songs', () => {
  render(<SelectionRows disabled />)
  const row = screen.getByTestId('one')
  down(row)
  wait()
  fireEvent.keyDown(row, { key: ' ' })
  expect(selected()).toBe('')
})
