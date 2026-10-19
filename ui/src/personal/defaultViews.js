import albumLists from '../album/albumLists'

export const resourceDefaultViews = ['song', 'artist', 'playlist']

export const isResourceDefaultView = (defaultView) =>
  resourceDefaultViews.includes(defaultView)

export const getDefaultViewChoices = (translate) => [
  ...Object.keys(albumLists).map((type) => ({
    id: type,
    name: translate(`resources.album.lists.${type}`),
  })),
  ...resourceDefaultViews.map((resource) => ({
    id: resource,
    name: translate(`resources.${resource}.name`, { smart_count: 2 }),
  })),
]

export const getStoredDefaultView = () =>
  isResourceDefaultView(localStorage.getItem('defaultView')) ||
  albumLists[localStorage.getItem('defaultView')]
    ? localStorage.getItem('defaultView')
    : 'song'
