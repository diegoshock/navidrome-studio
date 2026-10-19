import { Redirect } from 'react-router-dom'
import albumLists from '../album/albumLists'
import {
  getStoredDefaultView,
  isResourceDefaultView,
} from '../personal/defaultViews'

// Songs is the initial view; explicit personal landing-page preferences still work.
const HomeRedirect = () => {
  const view = getStoredDefaultView()
  return (
    <Redirect
      to={
        isResourceDefaultView(view)
          ? `/${view}`
          : `/album/${view}?${albumLists[view].params}`
      }
    />
  )
}
export default HomeRedirect
