# Studio for Navidrome 0.64.2-studio.8

- Nueva navegación compacta inspirada en la distribución de Hermitage: grupos **Discover**, **Library** y **Playlists**, accesos a favoritos y Now Playing, búsqueda global y usuario/ajustes en la esquina superior derecha.
- Discover Home reúne álbumes añadidos y reproducidos recientemente, los más reproducidos y una selección diaria de álbumes y canciones. Incluye elección aleatoria de álbum y reproducción aleatoria de canciones mediante el motor existente.
- Now Playing dispone de vista amplia con portada, metadatos, favorito y cola interactiva. La barra inferior conserva progreso y transporte, y añade calidad/bitrate, pantalla completa, cola y volumen.
- Menús contextuales de canciones con favorito, filas sin separadores, cuadrícula y lateral más densos, y fondos de artista sin desenfoque. Se conservan el scroll incremental, playlists, búsqueda y selección existentes.
- Lint, comprobación de tipos, compilación y **94 archivos / 805 pruebas** correctos. Vite conserva únicamente su advertencia conocida por tamaño del bundle.
- Chromium con backend real y cuatro canciones sintéticas: inicio Discover, estantes, reproducción aleatoria, cola, Now Playing, calidad, controles y adaptación a 1440 × 900 y 390 × 844 comprobados.

## Publicación comprobada

- Revisión `a19e034fae588d2e9b47a4294cf3dd4b75f7a62e`, versión `0.64.2-studio.8`.
- Digest `sha256:1b8a53af7389a4e33832114f0d51050bb46e453c942c49d46ab972bdd2ea0009`.
- Imagen pública `ghcr.io/diegoshock/navidrome-studio:latest`, también disponible como `:sha-a19e034fae588d2e9b47a4294cf3dd4b75f7a62e`.
- [Workflow](https://github.com/diegoshock/navidrome-studio/actions/runs/40513657195): pruebas y publicación correctas.
- Consulta anónima, descarga y ejecución de la imagen correctas; `--version` devuelve la versión y revisión esperadas.

Las secciones basadas en reproducciones permanecen vacías hasta que Navidrome registre historial. La selección diaria usa la fecha local del navegador. No se ha probado en el Unraid ni con la biblioteca del usuario.

---

# Studio for Navidrome 0.64.2-studio.7

- Icono original (reproducción + niveles de audio), sin reutilizar el logo de Navidrome: SVG negro animado, variantes blanca/negra estáticas, insignia sobre blanco y PNG/ICO para lanzadores. Assets originales bajo Apache-2.0; la aplicación conserva GPLv3.
- Integrado en lateral, inicio de sesión, favicon, iconos Apple/Windows/PWA, imagen de recurso predeterminada, README y template Unraid. Nombre visible Studio for Navidrome; se conservan los identificadores de repositorio e imagen para las instalaciones existentes.
- SVG XML validado sin scripts, referencias externas ni imágenes raster. Movimiento comprobado en Chromium mediante diferencias de imagen entre fotogramas. La vista directa respeta `prefers-reduced-motion`; la aplicación selecciona el SVG estático mediante `<picture>` para cubrir navegadores que no transmiten esa preferencia a imágenes SVG externas.
- Lint, comprobación de tipos, compilación y **94 archivos / 808 pruebas** correctos. Manifest PWA, referencias a iconos, XML Unraid y archivo ZIP comprobados.
- ZIP de envío con SVG, PNG, licencia y guía. Dashboard Icons exige sesión en su formulario y aprobación de sus administradores: no se ha enviado ni se afirma aceptación en ese catálogo.

## Publicación comprobada

- Revisión `e713d8bbd044957b4de6927b397470562b10deca`, versión `0.64.2-studio.7`.
- Digest `sha256:f1ad9e7a268d776449678768662208e6bd0a75f1fabc58c3a1c8fd6f821bdfe1`.
- [Workflow](https://github.com/diegoshock/navidrome-studio/actions/runs/40375056115): pruebas y publicación correctas.
- SVG y ZIP públicos comprobados con HTTP 200, MIME correcto y contenido idéntico al repositorio.
- Descarga pública y arranque de la imagen correctos. Alta de administrador en datos aislados y navegador contra el contenedor publicado: iconos animados en acceso/lateral, selección del archivo estático con reducción de movimiento, identidad PWA y anchura móvil comprobadas, sin errores JavaScript.
- SVG incluido en el archivo de fuentes idéntico al repositorio: SHA-256 `2eee3c5a83eb9deac0646a17792670478b6cca96ab85170925cfb570107260fa`.

La política de marca consultada está enlazada en [la guía de iconos](icons/README.md). No se ha probado en el Unraid del usuario.

---

# Navidrome Studio 0.64.2-studio.6

- Nuevo acceso lateral **Agregadas recientemente**, ruta `/recently-added`, reutilizando el listado de canciones y sus acciones. Usa el orden nativo `recently_added DESC` de Navidrome (respeta su configuración `RecentlyAddedByModTime`).
- Parámetros locales en esta vista: buscar u ordenar aquí no modifica los filtros guardados de Canciones. Volver a entrar restaura el orden de incorporación descendente.
- Lint, comprobación de tipos, compilación y **94 archivos / 808 pruebas** correctos.
- Chromium con bundle de producción: acceso desde el lateral y por URL, encabezado, orden enviado al servidor, filtros independientes al alternar entre vistas, reproducción real y cola de diez canciones comprobados.
- 120 canciones simuladas: carga 50 → 100 → 120 al desplazarse, sin paginador; selección de una fila añadida y cancelación por teclado correctas. Vista móvil a 390 px sin desbordamiento. Sin errores JavaScript.
- Archivos principales: `layout/Menu.jsx`, `routes.jsx`, `song/SongList.jsx` y `studio/useStudioLabels.js`. No hay cambios de dependencias ni del backend.

## Imagen studio.6 publicada y comprobada

- Revisión: `58f6890b80dbc3c8061d1365fc707b62163b4131`.
- Digest: `sha256:5e5764fa9b1863e029a117e4a5bbdf52f0930c6657f02b53dcb247fcf056ece1`.
- Imagen pública `ghcr.io/diegoshock/navidrome-studio:latest`, también disponible como `:sha-58f6890b80dbc3c8061d1365fc707b62163b4131`.
- [Pruebas y publicación en GitHub](https://github.com/diegoshock/navidrome-studio/actions/runs/39622279116): ambos trabajos correctos; publicación iniciada mediante `workflow_dispatch`.
- Consulta anónima del registro, descarga y arranque correctos. `--version` devuelve `0.64.2-studio.6` y la revisión esperada.
- Chromium contra esa imagen: sección nueva, orden por incorporación, búsquedas independientes, reproducción real, recarga, scroll 50 → 100 → 120, selección por teclado y adaptación móvil comprobados sin errores JavaScript.
- El archivo `song/SongList.jsx` incluido en el archivo de fuentes coincide con el repositorio: SHA-256 `e6073ab4864952b0e7b4d6d974530137337d77589f8471ddea7f4a64f4b082ce`.

No se ha probado en el Unraid del usuario; se usaron datos de prueba aislados.

---

# Navidrome Studio 0.64.2-studio.5

- Se comparte `common/ScrollPagination.jsx` entre Canciones, Artistas, Álbumes y Playlists. Cada lista comienza con 50 registros y crece al desplazarse cerca del final; no presenta selectores de páginas ni de cantidad de filas.
- También se aplica a los álbumes de un artista y a las pistas de una playlist. El cambio de colección reinicia la ventana mediante su ID, además del reinicio existente por búsqueda, orden o biblioteca.
- Se conserva la paginación de las pantallas administrativas. Las pistas de un álbum siguen cargándose completas, sin paginación, para mantener las acciones sobre el álbum completo.
- Se conserva la estrategia de ventana creciente de studio.4: los registros anteriores vuelven a transferirse y la lista no está virtualizada.

- Lint, comprobación de tipos y compilación correctos. **94 archivos y 808 pruebas correctas**, incluida la nueva comprobación de reinicio al cambiar de colección.
- Chromium en escritorio y a 390 px: Artistas, Álbumes, Playlists, álbumes de un artista y pistas de una playlist cargan 50 → 100 → 120 registros simulados, sin carga anticipada ni paginadores; se detienen al completar la colección. Las filas añadidas permiten selección por teclado.
- Bundle de producción: mismo recorrido sin errores JavaScript. Las pistas de álbum se mantienen completas, sin selector de páginas.
- Backend real con datos de prueba aislados: crear playlist, añadir dos canciones, eliminar una entrada, selección múltiple, búsqueda y reproducción comprobadas. Vista móvil sin desbordamiento horizontal.

## Imagen studio.5 publicada y comprobada

- Revisión: `707e4db6fb1bef3565c22df4f321b865d9a39c2a`.
- Digest: `sha256:2b03243452374aeaafeb826bfd7964a71d812bd23fa9efba253efc9b058b9e96`.
- Imagen pública `ghcr.io/diegoshock/navidrome-studio:latest`, también disponible como `:sha-707e4db6fb1bef3565c22df4f321b865d9a39c2a`.
- [Workflow de pruebas y publicación](https://github.com/diegoshock/navidrome-studio/actions/runs/39436209055): correcto.
- Consulta anónima del registro, descarga y arranque correctos; `--version` devuelve `0.64.2-studio.5` y la revisión esperada.
- Navegador contra la imagen publicada: scroll 50 → 100 → 120 en Artistas, Álbumes, Playlists, álbumes de artista y canciones de playlist; ausencia de paginadores y selección en las filas añadidas comprobadas. Sin errores JavaScript.
- `common/ScrollPagination.jsx` incluido en el archivo de fuentes coincide byte a byte con el repositorio: SHA-256 `81e741fa329ed970086e35fea9ed2c91bbc731a604e506fc8fed54203189df57`.

No se ha probado en el Unraid del usuario. No hay cambios en dependencias ni en el backend Go.

---

# Validación de Navidrome Studio 0.64.2-studio.4

## Scroll de canciones y menú de cuenta

- Canciones muestra inicialmente 50 registros y amplía la lista al desplazarse cerca del final. No muestra selector de páginas ni de cantidad de filas.
- Se conserva el contexto de react-admin para reproducción, selección y acciones múltiples: se solicita una ventana creciente desde el primer registro. Esto vuelve a transferir los registros anteriores; no es una lista virtualizada ni paginación incremental del servidor.
- Búsqueda, orden y cambio de biblioteca reinician la ventana. El reinicio espera a que react-admin termine su actualización de URL para evitar perder el cambio de tamaño.
- El encabezado del menú usa espacio propio, sin tarjeta de fondo ni márgenes negativos. Los nombres largos se truncan con el nombre completo disponible como tooltip.

- Lint, comprobación de tipos y compilación de producción correctos. **94 archivos y 807 pruebas correctas**, incluyendo límites de carga, bloqueo de peticiones repetidas, reinicio de filtros/orden/biblioteca y recuperación de errores.
- Chromium con 800 canciones simuladas: carga únicamente al desplazarse, sin IDs duplicados ni selector de páginas; se detiene al completar la colección. Búsqueda/restablecimiento y selección por teclado correctos. El menú se midió después de su transición: el encabezado termina exactamente antes del separador, sin superposición.
- Chromium móvil a 390 px: carga por scroll, búsqueda y orden descendente comprobados.
- Reproductor real con el bundle de producción: reproducción, cola completa/filtrada, volumen, avance, teclado y adaptación móvil correctos; sin errores JavaScript.

## Imagen studio.4 publicada y comprobada

- Revisión: `f822221533a733e333e96fb1986f942cbb456ddc`.
- Digest: `sha256:448aedb459e7c8eee718777187d2f9c520a831c2a140a3b90c2a86e8612e06ab`.
- Imagen pública: `ghcr.io/diegoshock/navidrome-studio:latest`; tag inmutable `:sha-f822221533a733e333e96fb1986f942cbb456ddc`.
- [Workflow de pruebas y publicación](https://github.com/diegoshock/navidrome-studio/actions/runs/39356265979): completado correctamente.
- Consulta anónima del registro, descarga y arranque verificados. `--version` devuelve `0.64.2-studio.4` y la revisión esperada.
- Chromium contra la imagen publicada: reproducción, búsqueda/cola filtrada, volumen, avance, controles de teclado y adaptación móvil correctos, sin errores JavaScript. Menú de ajustes sin superposición.
- El archivo `SongScrollPagination.jsx` incluido en el archivo de fuentes de la imagen coincide byte a byte con el repositorio; SHA-256 `ddb8e262dfd9afea19ed5341e340379f86095a949bf15c6fc94d81c41fd79378`.
- [Captura del menú corregido](screenshots/studio-settings-menu.png).

No se ha probado en el Unraid del usuario. Los datos de prueba son sintéticos y no se accedió a su biblioteca.

---

# Validación de Navidrome Studio 0.64.2-studio.3

Base: Navidrome v0.64.2, commit `101145742f4762164202cb4858c9126258bdc463`.

- `npm run lint`: correcto, sin errores ni advertencias.
- `npm run type-check`: correcto.
- `npm test`: **93 archivos, 804 pruebas correctas**. Incluye gestos de selección, cancelación por movimiento/scroll, teclado, navegación y preferencias de inicio.
- `npm run build`: correcto. Vite conserva las advertencias del paquete de esquemas sobre módulos Node externos y tamaño de bundle; no se añadieron dependencias ni se modificó el lockfile.
- Navegador Chromium, bundle de producción contra Navidrome 0.64.2 real con datos aislados: navegación inicial a canciones, ausencia de barra superior y casillas, búsqueda y reproducción de audio confirmadas.
- Pulsación de ratón y toque nativo mediante CDP: mantener 500 ms selecciona sin cargar/reproducir audio; otro clic/toque alterna la selección; × y Esc cancelan. Un desplazamiento táctil no selecciona ni reproduce.
- Espacio selecciona y Enter reproduce fuera del modo de selección; selección de toda la página y acciones múltiples verificadas.
- Playlist creada desde el diálogo, canciones añadidas, reordenación y eliminación de una entrada comprobadas. También se comprobó selección en un álbum.
- Barra lateral compacta/expandida, engranaje, menú de cuenta y acceso a ajustes personales comprobados en móvil. El foco de menús y diálogos tiene prioridad sobre el del lateral expandido.
- Canciones, artistas, detalle de artista, álbumes, detalle de álbum, playlists, detalle de playlist y ajustes: 390 px sin desbordamiento horizontal.
- Sin errores JavaScript no controlados en los recorridos de producción, incluidos los gestos táctiles y los ajustes del lateral expandido.

## Comprobaciones específicas del reproductor y los fondos

- Reproducir todo carga la colección completa con búsqueda, filtros y orden; una respuesta vacía o fallida conserva la cola. Se mantiene el límite previo de 500 canciones para Aleatorio.
- Reproductor real: reproducción/pausa, anterior/siguiente, modo aleatorio, repetición, cola, cierre con Escape y diálogo para guardar la cola verificados. Los controles conservan las rutas del motor para transcodificación, ReplayGain, letras y notificaciones de reproducción.
- Teclado en volumen/progreso sin activar atajos globales; veinte pulsaciones avanzan dos segundos. Volumen perceptual de 30% comprobado como 0,09 en el elemento de audio; silenciar/restaurar y los extremos 0/1 permanecen sincronizados.
- Barra inferior a 390, 810, 960, 1100 y 1440 px: sin desbordamiento; la cola móvil se cierra completamente y no cubre la barra al abrirse.
- Imagen de artista subida a la biblioteca de prueba y recuperada desde el endpoint real de Navidrome a 600 px para el fondo del álbum. Pruebas de fallback a portada cuando no hay foto o falla su carga. Los fondos son decorativos y no interceptan clics.
- Navegación lateral desplazable sin barra blanca. No se añadieron dependencias.

Las capturas usan diez canciones sintéticas y carátulas originales de prueba; no se utilizó la biblioteca del usuario. El frontend se probó con un backend Navidrome real. El workflow de GHCR compila el binario y publica la imagen con el código correspondiente incluido; su ejecución concreta queda registrada en [Actions](https://github.com/diegoshock/navidrome-studio/actions/workflows/publish.yml).

No se ha probado en el Unraid del usuario ni en un dispositivo físico iOS/Android. La emulación táctil utiliza Chromium. El servidor no tiene cambios funcionales de código Go; no se ejecutó la suite completa de integración de upstream. La imagen se publica para `linux/amd64`, como la distribución anterior.

## Imagen publicada comprobada

- Versión: `0.64.2-studio.3`, revisión `ce43d4ee8a844c6b0b60524fd2cd900dbbfd00da`.
- Digest: `sha256:a44eca97ebfe06e2b87ac710b930ae14ebf84821d591013ca091ad0c160d1ef2`.
- Disponible públicamente como `ghcr.io/diegoshock/navidrome-studio:latest` y `:sha-ce43d4ee8a844c6b0b60524fd2cd900dbbfd00da`.
- [Workflow de pruebas y publicación](https://github.com/diegoshock/navidrome-studio/actions/runs/39323846704): completado correctamente.
- Consulta anónima del registro, descarga con Docker y `--version` correctos. Contenedor arrancado con UID/GID 1000, sin capacidades y con `no-new-privileges`, usando una copia consistente de la base de prueba y la música en solo lectura.
- Navegador contra ese contenedor: Reproducir todo, búsqueda y cola filtrada, reproducción/pausa con teclado, anterior/siguiente, volumen/silenciar/restaurar, avance, aleatorio/repetición, cola y cierre con Escape, guardar cola como playlist, fondo de artista y adaptación móvil confirmados sin errores JavaScript.
- El archivo `StudioPlayerBar.jsx` incluido en `/usr/share/navidrome-studio/source.tar.gz` coincide con el código publicado: SHA-256 `685bc1a8d0e7941604e1cdfd79af11c3da919540da5d465f7464f031fa6f77f6`.

El tag `latest` puede avanzar; el tag con SHA y el digest identifican esta entrega. El template de Unraid mantiene la misma imagen y los mismos puertos y volúmenes; basta con actualizar el contenedor y recargar el navegador.
