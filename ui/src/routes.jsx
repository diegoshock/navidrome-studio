import React from 'react'
import { Route } from 'react-router-dom'
import { ResourceContextProvider } from 'react-admin'
import SongList from './song/SongList'
import Personal from './personal/Personal'

const routes = [
  <Route
    exact
    path="/recently-added"
    key="recently-added"
    render={() => (
      <ResourceContextProvider value="song">
        <SongList resource="song" basePath="/song" recentlyAdded />
      </ResourceContextProvider>
    )}
  />,
  <Route exact path="/personal" render={() => <Personal />} key={'personal'} />,
]

export default routes
