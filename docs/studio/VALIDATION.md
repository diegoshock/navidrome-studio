# Navidrome Studio 0.64.2-studio.5

- Se comparte `common/ScrollPagination.jsx` entre Canciones, Artistas, Álbumes y Playlists. Cada lista comienza con 50 registros y crece al desplazarse cerca del final; no presenta selectores de páginas ni de cantidad de filas.
- También se aplica a los álbumes de un artista y a las pistas de una playlist. El cambio de colección reinicia la ventana mediante su ID, además del reinicio existente por búsqueda, orden o biblioteca.
- Se conserva la paginación de las pantallas administrativas. Las pistas de un álbum siguen cargándose completas, sin paginación, para mantener las acciones sobre el álbum completo.
- Se conserva la estrategia de ventana creciente de studio.4: los registros anteriores vuelven a transferirse y la lista no está virtualizada.

- Lint, comprobación de tipos y compilación correctos. **94 archivos y 808 pruebas correctas**, incluida la nueva comprobación de reinicio al cambiar de colección.
- Chromium en escritorio y a 390 px: Artistas, Álbumes, Playlists, álbumes de un artista y pistas de una playlist cargan 50 → 100 → 120 registros simulados, sin carga anticipada ni paginadores; se detienen al completar la colección. Las filas añadidas permiten selección por teclado.
- Bundle de producción: mismo recorrido sin errores JavaScript. Las pistas de álbum se mantienen completas, sin selector de páginas.
- Backend real con datos de prueba aislados: crear playlist, añadir dos canciones, eliminar una entrada, selección múltiple, búsqueda y reproducción comprobadas. Vista móvil sin desbordamiento horizontal.

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
