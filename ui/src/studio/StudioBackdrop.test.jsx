import { render, screen } from '@testing-library/react'
import { StudioBackdrop } from './StudioBackdrop'

const { getArtist, useImage } = vi.hoisted(() => ({
  getArtist: vi.fn(),
  useImage: vi.fn(),
}))
vi.mock('react-admin', () => ({ useGetOne: getArtist }))
vi.mock('../common/useImageUrl', () => ({ useImageUrl: useImage }))
vi.mock('../subsonic', () => ({
  default: { getCoverArtUrl: (record) => `/art/${record.id}` },
}))

describe('Artist backdrop', () => {
  const album = { id: 'album' }
  beforeEach(() => {
    vi.clearAllMocks()
    useImage.mockImplementation((url) => ({ imgUrl: url }))
  })
  it('uses the artist image through Navidrome when available', () => {
    getArtist.mockReturnValue({ data: { id: 'artist', imageHash: 'version' } })
    render(<StudioBackdrop record={album} artistId="artist" />)
    expect(
      screen.getByTestId('studio-backdrop').querySelector('img'),
    ).toHaveAttribute('src', '/art/artist')
    expect(getArtist).toHaveBeenCalledWith('artist', 'artist')
  })
  it('falls back to the cover when the artist has no photo', () => {
    getArtist.mockReturnValue({ data: { id: 'artist' } })
    render(<StudioBackdrop record={album} artistId="artist" />)
    expect(
      screen.getByTestId('studio-backdrop').querySelector('img'),
    ).toHaveAttribute('src', '/art/album')
  })
  it('falls back on a failed artist image request', () => {
    getArtist.mockReturnValue({
      data: { id: 'artist', uploadedImage: 'local.jpg' },
    })
    useImage.mockImplementation((url) =>
      url === '/art/artist' ? { error: true } : { imgUrl: url },
    )
    render(<StudioBackdrop record={album} artistId="artist" />)
    expect(
      screen.getByTestId('studio-backdrop').querySelector('img'),
    ).toHaveAttribute('src', '/art/album')
  })
  it('does not query artists for playlists and keeps the background decorative', () => {
    render(<StudioBackdrop record={{ id: 'playlist' }} />)
    expect(getArtist).not.toHaveBeenCalled()
    expect(screen.getByTestId('studio-backdrop')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
