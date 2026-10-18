import { studioPlayerStyles } from './studioPlayer'

// A visual layer only: all library, playback and authentication APIs remain upstream.
export const createStudioTheme = (dark = false) => {
  const background = dark ? '#18181a' : '#ffffff'
  const surface = dark ? '#222225' : '#f6f6f8'
  const foreground = dark ? '#f5f5f7' : '#202023'
  const muted = dark ? '#aaaab2' : '#6d6d75'
  const border = dark ? '#ffffff16' : '#00000012'
  const accent = dark ? '#ff647c' : '#c92b47'
  const selection = dark ? '#ffffff12' : '#e9e9ed'

  return {
    themeName: dark ? 'Studio Dark' : 'Studio',
    studio: true,
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      fontSize: 14,
      h6: { fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em' },
      h5: { fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.04em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    palette: {
      type: dark ? 'dark' : 'light',
      primary: { main: accent, contrastText: dark ? '#18181a' : '#ffffff' },
      secondary: { main: accent, contrastText: dark ? '#18181a' : '#ffffff' },
      background: { default: background, paper: background },
      text: { primary: foreground, secondary: muted },
      divider: border,
    },
    shape: { borderRadius: 10 },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '*:focus-visible': {
            outline: `2px solid ${accent}`,
            outlineOffset: 3,
          },
        },
      },
      RaLayout: {
        root: { minWidth: 0, color: foreground },
        content: {
          minWidth: 0,
          padding: '20px 36px 28px',
          '@media (min-width: 0px)': { paddingLeft: 36 },
          '@media (max-width: 959px)': { padding: '12px 20px 24px' },
          '@media (max-width: 599px)': { padding: '8px 14px 24px' },
        },
      },
      MuiAppBar: {
        colorSecondary: { backgroundColor: background, color: muted },
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${border}`,
          backgroundColor: dark ? '#18181af2' : '#fffffff2',
          backdropFilter: 'blur(20px)',
        },
      },
      RaSidebar: {
        root: { backgroundColor: surface, borderRight: `1px solid ${border}` },
        drawerPaper: {
          backgroundColor: surface,
          '@media (max-width: 599px)': { backgroundColor: surface },
        },
      },
      RaMenuItemLink: {
        root: {
          margin: '2px 12px',
          padding: '9px 12px',
          borderRadius: 7,
          color: foreground,
          fontSize: 13,
          '&:hover': { backgroundColor: selection },
          '& .MuiListItemIcon-root': { color: accent, minWidth: 32 },
          '& svg': { width: 20, height: 20 },
        },
        active: { backgroundColor: selection, fontWeight: 600 },
      },
      NDSubMenu: {
        sidebarIsOpen: { '& a': { paddingLeft: 20 } },
        menuHeader: { padding: '12px 24px 6px', minHeight: 38 },
        headerText: {
          color: muted,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.025em',
        },
        icon: { color: muted, minWidth: 30 },
      },
      RaList: {
        content: { backgroundColor: 'transparent', boxShadow: 'none' },
        actions: { padding: '0 0 10px', minHeight: 48 },
      },
      MuiPaper: { elevation1: { boxShadow: 'none' } },
      MuiButton: {
        root: { borderRadius: 7, textTransform: 'none' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        containedPrimary: {
          '&:hover': { backgroundColor: dark ? '#ff7e92' : '#af233b' },
        },
      },
      MuiIconButton: { root: { color: muted } },
      MuiOutlinedInput: {
        root: { backgroundColor: surface, borderRadius: 8, fontSize: 13 },
        notchedOutline: { borderColor: border },
      },
      MuiFilledInput: { root: { backgroundColor: surface } },
      MuiChip: { root: { backgroundColor: surface, borderRadius: 6 } },
      MuiTableCell: {
        root: { borderBottom: `1px solid ${border}`, padding: '14px 16px' },
        head: { color: muted, fontSize: 12, backgroundColor: background },
      },
      MuiTableRow: { root: { '&$hover:hover': { backgroundColor: surface } } },
      NDAlbumGridView: {
        root: { margin: '24px 0' },
        link: {
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: dark ? '0 3px 14px #0005' : '0 3px 14px #00000012',
          transition: 'box-shadow 180ms ease',
          '&:hover': {
            boxShadow: dark ? '0 7px 24px #0008' : '0 7px 24px #00000024',
          },
        },
        albumName: {
          fontSize: 14,
          fontWeight: 500,
          color: foreground,
          marginTop: 10,
        },
        albumSubtitle: { fontSize: 12, color: muted, marginTop: 3 },
        albumVersion: { color: muted },
        tileBar: { padding: 6 },
        tileBarMobile: { padding: 4 },
        albumPlayButton: {
          backgroundColor: '#ffffffeb',
          color: '#c92b47',
          borderRadius: '50%',
          '&:hover': { backgroundColor: '#ffffff' },
        },
      },
      NDDesktopArtistDetails: {
        artistName: {
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: '-0.04em',
        },
      },
      NDMobileArtistDetails: {
        artistName: { fontSize: '2rem', fontWeight: 700 },
      },
      NDAudioPlayer: {
        audioTitle: { color: foreground },
        songTitle: { fontWeight: 600 },
        songAlbum: { fontStyle: 'normal', color: muted },
      },
      NDLogin: {
        main: {
          background: dark
            ? 'radial-gradient(ellipse at top, #46232d, #18181a 65%)'
            : 'radial-gradient(ellipse at top, #fbe6eb, #f6f6f8 65%)',
          justifyContent: 'center',
          padding: '30px 16px',
        },
        card: {
          width: 'min(380px, 100%)',
          minWidth: 0,
          marginTop: 0,
          padding: '16px 12px',
          border: `1px solid ${border}`,
          borderRadius: 20,
          backgroundColor: background,
          boxShadow: dark ? '0 20px 80px #0005' : '0 20px 80px #591b2d12',
        },
        systemNameLink: { color: accent },
        button: { boxShadow: 'none', borderRadius: 8 },
      },
    },
    player: {
      theme: dark ? 'dark' : 'light',
      stylesheet: studioPlayerStyles({
        background,
        surface,
        foreground,
        muted,
        border,
        accent,
      }),
    },
  }
}

export default createStudioTheme()
