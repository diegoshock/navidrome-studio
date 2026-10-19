# Validación de Navidrome Studio 0.64.2-studio.2

Base: Navidrome v0.64.2, commit `101145742f4762164202cb4858c9126258bdc463`.

- `npm run lint`: correcto, sin errores ni advertencias.
- `npm run type-check`: correcto.
- `npm test`: **90 archivos, 789 pruebas correctas**. Incluye gestos de selección, cancelación por movimiento/scroll, teclado, navegación y preferencias de inicio.
- `npm run build`: correcto. Vite conserva las advertencias del paquete de esquemas sobre módulos Node externos y tamaño de bundle; no se añadieron dependencias ni se modificó el lockfile.
- Navegador Chromium, bundle de producción contra Navidrome 0.64.2 real con datos aislados: navegación inicial a canciones, ausencia de barra superior y casillas, búsqueda y reproducción de audio confirmadas.
- Pulsación de ratón y toque nativo mediante CDP: mantener 500 ms selecciona sin cargar/reproducir audio; otro clic/toque alterna la selección; × y Esc cancelan. Un desplazamiento táctil no selecciona ni reproduce.
- Espacio selecciona y Enter reproduce fuera del modo de selección; selección de toda la página y acciones múltiples verificadas.
- Playlist creada desde el diálogo, canciones añadidas, reordenación y eliminación de una entrada comprobadas. También se comprobó selección en un álbum.
- Barra lateral compacta/expandida, engranaje, menú de cuenta y acceso a ajustes personales comprobados en móvil. El foco de menús y diálogos tiene prioridad sobre el del lateral expandido.
- Canciones, artistas, detalle de artista, álbumes, detalle de álbum, playlists, detalle de playlist y ajustes: 390 px sin desbordamiento horizontal.
- Sin errores JavaScript no controlados en los recorridos de producción, incluidos los gestos táctiles y los ajustes del lateral expandido.

Las capturas usan diez canciones sintéticas y carátulas originales de prueba; no se utilizó la biblioteca del usuario. El frontend se probó con un backend Navidrome real. El workflow de GHCR compila el binario y publica la imagen con el código correspondiente incluido; su ejecución concreta queda registrada en [Actions](https://github.com/diegoshock/navidrome-studio/actions/workflows/publish.yml).

No se ha probado en el Unraid del usuario ni en un dispositivo físico iOS/Android. La emulación táctil utiliza Chromium. El servidor no tiene cambios funcionales de código Go; no se ejecutó la suite completa de integración de upstream. La imagen se publica para `linux/amd64`, como la distribución anterior.

## Imagen publicada comprobada

- Versión: `0.64.2-studio.2`, revisión `fd9f6785b842df64c760d075e8e364c574f58479`.
- Digest: `sha256:396dd8567e0815a60cc15ebeef5c32382c4aac9039abc2298926fc8e30e556d3`.
- Disponible públicamente como `ghcr.io/diegoshock/navidrome-studio:latest` y `:sha-fd9f6785b842df64c760d075e8e364c574f58479`.
- Descarga con Docker y `--version` correctos. Contenedor arrancado con UID/GID 1000, sin capacidades y con `no-new-privileges`, usando una copia consistente de la base de prueba.
- Navegador contra ese contenedor: diez canciones, orden del lateral, ausencia de barra superior/casillas, pulsación prolongada sin reproducción, teclado y reproducción de audio confirmados, sin errores JavaScript.
- El código de selección incluido en `/usr/share/navidrome-studio/source.tar.gz` coincide por SHA-256 con el commit publicado.

El tag `latest` puede avanzar; el tag con SHA y el digest identifican esta entrega.
