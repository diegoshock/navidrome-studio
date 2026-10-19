import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Switch, useLocation } from 'react-router-dom'
import HomeRedirect from './HomeRedirect'
const Destination = () => {
  const location = useLocation()
  return <output>{location.pathname + location.search}</output>
}
const renderHome = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Switch>
        <Route exact path="/">
          <HomeRedirect />
        </Route>
        <Route>
          <Destination />
        </Route>
      </Switch>
    </MemoryRouter>,
  )
beforeEach(() => localStorage.clear())
it('lands in songs for new users', () => {
  renderHome()
  expect(screen.getByRole('status')).toHaveTextContent('/song')
})
it('keeps explicit personal landing-page preferences operational', () => {
  localStorage.setItem('defaultView', 'playlist')
  renderHome()
  expect(screen.getByRole('status')).toHaveTextContent('/playlist')
})
it('replaces a saved radio destination with songs', () => {
  localStorage.setItem('defaultView', 'radio')
  renderHome()
  expect(screen.getByRole('status')).toHaveTextContent('/song')
})
