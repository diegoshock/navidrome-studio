import { useLocale } from 'react-admin'

const labels = {
  en: {
    library: 'YOUR LIBRARY',
    navigation: 'Music library',
    selectionHint:
      'Hold a song to select. Keyboard: Space to select, Escape to cancel.',
    selectPage: 'Select page',
    music: 'Music',
    title: 'Your music. Beautifully together.',
    description: 'The albums you love. The ones you are about to rediscover.',
    recentlyAdded: 'Recently added',
    all: 'Albums',
    starred: 'Favorites',
    random: 'Rediscover',
    count: 'albums in this view',
    countOne: 'album in this view',
    dark: 'Switch to dark appearance',
    light: 'Switch to light appearance',
    shortcuts: 'Browse your library',
  },
  es: {
    library: 'TU BIBLIOTECA',
    navigation: 'Biblioteca musical',
    selectionHint:
      'Mantén pulsada una canción para seleccionar. Teclado: Espacio para seleccionar, Esc para cancelar.',
    selectPage: 'Seleccionar página',
    music: 'Música',
    title: 'Toda tu música. Muy tuya.',
    description: 'Los discos que te encantan. Los que vas a redescubrir.',
    recentlyAdded: 'Recién añadidos',
    all: 'Álbumes',
    starred: 'Favoritos',
    random: 'Redescubrir',
    count: 'álbumes en esta vista',
    countOne: 'álbum en esta vista',
    dark: 'Cambiar a apariencia oscura',
    light: 'Cambiar a apariencia clara',
    shortcuts: 'Explorar tu biblioteca',
  },
}

export const getStudioLabels = (locale) =>
  labels[locale?.split('-')[0]] || labels.en

export const useStudioLabels = () => getStudioLabels(useLocale())
