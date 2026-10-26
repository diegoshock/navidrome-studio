import animated from '../icons/studio-animated.svg'
import still from '../icons/studio.svg'
import badgeAnimated from '../icons/studio-badge-animated.svg'
import badgeStill from '../icons/studio-badge.svg'

// External SVG images do not inherit reduced-motion in every browser.
// Select the static file at the host document level as well.
const StudioIcon = ({ badge = false, ...props }) => (
  <picture>
    <source
      media="(prefers-reduced-motion: reduce)"
      srcSet={badge ? badgeStill : still}
    />
    <img src={badge ? badgeAnimated : animated} alt="" {...props} />
  </picture>
)

export default StudioIcon
