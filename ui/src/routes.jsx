import React from 'react'
import { Route } from 'react-router-dom'
import { ResourceContextProvider } from 'react-admin'
import SongList from './song/SongList'
import Personal from './personal/Personal'
import DiscoverHome from './discover/DiscoverHome'
import NowPlayingPage from './discover/NowPlayingPage'

const routes = [
  <Route
    exact
    path="/discover"
    key="discover"
    render={() => <DiscoverHome />}
  />,
  <Route
    exact
    path="/now-playing"
    key="now-playing"
    render={() => <NowPlayingPage />}
  />,
  <Route
    exact
    path="/favorites"
    key="favorites"
    render={() => (
      <ResourceContextProvider value="song">
        <SongList
          resource="song"
          basePath="/song"
          listFilter={{ starred: true }}
          listSort={{ field: 'starred_at', order: 'DESC' }}
          listTitle="Favoritos"
        />
      </ResourceContextProvider>
    )}
  />,
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
