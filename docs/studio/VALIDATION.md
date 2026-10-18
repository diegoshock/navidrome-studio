# Validación de Navidrome Studio

Base: Navidrome v0.64.2, commit `101145742f4762164202cb4858c9126258bdc463`.

- `npm ci`: correcto, sin cambios en el lockfile.
- Suite completa de frontend: **87 archivos, 773 pruebas correctas**, incluidas 6 pruebas nuevas de navegación Studio.
- El repositorio independiente conserva el código probado: se compararon 2194 archivos del commit con los originales, excluyendo los cambios intencionados de documentación, configuración Git y automatización.
- `npm run lint`, `npm run type-check` y build de producción: correctos.
- Imagen nativa `linux/amd64`: compilada y arrancada como usuario sin privilegios, con `no-new-privileges` y `cap-drop=ALL`, binario `0.64.2-studio.1`.
- Código fuente incluido en la imagen verificado contra los archivos finales.
- Navegador Chromium: login, diez álbumes escaneados, búsqueda, favoritos, orden aleatorio, apertura de álbum y reproducción de audio verificados.
- Tema claro/oscuro: cambio y persistencia al recargar verificados.
- Móvil: ancho de 390 px sin desbordamiento horizontal.
- Sin errores JavaScript no controlados en el recorrido probado.

Las carátulas geométricas y los diez fragmentos de audio se generaron exclusivamente para esta validación; no se utilizó una biblioteca del usuario. No se ha probado en el Unraid del usuario. La primera publicación en GHCR pasó las pruebas de GitHub Actions; su imagen se descargó sin credenciales y ejecutó `--version` correctamente. La plantilla no implica publicación en Community Applications.

El servidor de Navidrome no tiene cambios de código Go. Esta validación cubre el frontend y el arranque/reproducción de la imagen; no sustituye la suite completa de integración del proyecto upstream.

Primera imagen comprobada: `ghcr.io/diegoshock/navidrome-studio@sha256:fdf4dec4639b79239413b65c19328894b9b96c7c19e469acf53362ce24213039`, revisión `87f522c235f92ca6f90c2960971dc61bead0d164`. El tag `latest` puede avanzar con publicaciones posteriores.
