import { studioPlayerStyles } from './studioPlayer'

// Both saved Studio appearances now use the same restrained, dark palette.
export const createStudioTheme = (dark = false) => {
  const background = '#080809'
  const surface = '#141416'
  const foreground = '#f1f1f3'
  const muted = '#a2a2aa'
  const border = '#ffffff14'
  const selection = '#242427'
  return {
    themeName: dark ? 'Studio Dark' : 'Studio',
    studio: true,
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      fontSize: 14,
      h6: { fontSize: '1rem', fontWeight: 600 },
      h5: { fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.035em' },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    palette: {
      type: 'dark',
      primary: { main: '#e8e8eb', contrastText: '#111113' },
      secondary: { main: '#c4c4ca', contrastText: '#111113' },
      background: { default: background, paper: background },
      text: { primary: foreground, secondary: muted },
      action: { active: muted, hover: '#ffffff08', selected: selection },
      divider: border,
    },
    shape: { borderRadius: 6 },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '*:focus-visible': {
            outline: `2px solid ${foreground}`,
            outlineOffset: 2,
          },
          'html, body': { backgroundColor: background },
        },
      },
      RaLayout: {
        root: { minWidth: 0, color: foreground },
        content: {
          minWidth: 0,
          padding: '18px 24px 24px',
          '@media (min-width:0px)': { paddingLeft: 24 },
          '@media (max-width:959px)': { padding: '18px 16px' },
          '@media (max-width:599px)': { padding: '20px 12px 24px' },
        },
      },
      RaMenuItemLink: {
        root: {
          margin: '2px 8px',
          padding: '9px 12px',
          borderRadius: 5,
          color: muted,
          fontSize: 13,
          '&:hover': { backgroundColor: surface },
          '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 32 },
          '& svg': { width: 22, height: 22 },
        },
        active: { color: '#c7ac78', backgroundColor: surface, fontWeight: 600 },
      },
      NDSubMenu: {
        sidebarIsOpen: { '& a': { paddingLeft: 20 } },
        menuHeader: { padding: '16px 20px 8px', minHeight: 38 },
        headerText: {
          color: muted,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
        },
        icon: { color: muted, minWidth: 30 },
      },
      RaList: {
        main: { minWidth: 0 },
        content: {
          minWidth: 0,
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        actions: {
          padding: '0 0 12px',
          minHeight: 48,
          justifyContent: 'flex-start',
        },
        bulkActionsDisplayed: { marginTop: 0 },
      },
      RaListToolbar: {
        toolbar: {
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: 0,
          '&&': { padding: 0 },
          '@media (min-width:0px)': { padding: 0 },
          '@media (max-width:599.95px)': { padding: 0 },
        },
      },
      RaTopToolbar: {
        root: {
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          padding: '8px 0',
          gap: 4,
          '@media (max-width:599.95px)': { backgroundColor: 'transparent' },
        },
      },
      RaFilterForm: {
        form: { flex: '0 1 auto', minWidth: 0, marginTop: 0 },
        input: { marginBottom: 0 },
      },
      RaBulkActionsToolbar: {
        toolbar: {
          height: 'auto',
          minHeight: 56,
          backgroundColor: selection,
          color: foreground,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          gap: 8,
          padding: '8px 12px',
          marginBottom: 8,
          borderRadius: 6,
        },
        collapsed: { display: 'none' },
        topToolbar: { padding: 0, minHeight: 0 },
        buttons: { display: 'flex', flexWrap: 'wrap', gap: 4 },
        title: { alignItems: 'center' },
      },
      MuiPaper: { elevation1: { boxShadow: 'none' } },
      MuiPopover: {
        paper: { backgroundColor: surface, border: `1px solid ${border}` },
      },
      MuiDialog: { paper: { backgroundColor: surface } },
      MuiButton: {
        root: { borderRadius: 5, textTransform: 'none' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        containedPrimary: { '&:hover': { backgroundColor: '#ffffff' } },
      },
      MuiIconButton: { root: { color: muted } },
      MuiOutlinedInput: {
        root: { backgroundColor: surface, borderRadius: 5, fontSize: 14 },
        notchedOutline: { borderColor: border },
      },
      MuiFilledInput: { root: { backgroundColor: surface } },
      MuiChip: { root: { backgroundColor: surface, borderRadius: 4 } },
      MuiTableCell: {
        root: {
          borderBottom: 'none',
          padding: '9px 10px',
          fontSize: 12,
          '@media(max-width:599px)': { padding: '8px 5px' },
        },
        head: {
          color: muted,
          fontSize: 11,
          backgroundColor: background,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
      MuiTableRow: { root: { '&$hover:hover': { backgroundColor: surface } } },
      RaDatagrid: {
        table: { tableLayout: 'auto' },
        rowCell: { '&:first-child': { paddingLeft: 0 } },
      },
      NDAlbumGridView: {
        root: { margin: '16px 0' },
        link: { borderRadius: 4, overflow: 'hidden', boxShadow: 'none' },
        albumName: {
          fontSize: 12,
          fontWeight: 500,
          color: foreground,
          marginTop: 10,
        },
        albumSubtitle: { fontSize: 10, color: muted, marginTop: 2 },
        albumVersion: { color: muted },
        tileBar: { padding: 6 },
        tileBarMobile: { padding: 4 },
        albumPlayButton: {
          backgroundColor: '#fffffff0',
          color: '#111113',
          borderRadius: '50%',
          '&:hover': { backgroundColor: '#fff' },
        },
      },
      NDDesktopArtistDetails: {
        artistName: {
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: '-0.035em',
        },
      },
      NDMobileArtistDetails: {
        artistName: { fontSize: '1.8rem', fontWeight: 700 },
      },
      NDAudioPlayer: {
        audioTitle: { color: foreground },
        songTitle: { fontWeight: 600 },
        songAlbum: { fontStyle: 'normal', color: muted },
      },
      NDLogin: {
        main: { background, justifyContent: 'center', padding: '30px 16px' },
        card: {
          width: 'min(380px, 100%)',
          minWidth: 0,
          marginTop: 0,
          padding: '16px 12px',
          border: `1px solid ${border}`,
          borderRadius: 10,
          backgroundColor: background,
          boxShadow: 'none',
        },
        systemNameLink: { color: foreground },
        button: { boxShadow: 'none', borderRadius: 5 },
      },
    },
    player: {
      theme: 'dark',
      stylesheet: studioPlayerStyles({
        background,
        surface,
        foreground,
        muted,
        border,
        accent: foreground,
      }),
    },
  }
}
export default createStudioTheme()
