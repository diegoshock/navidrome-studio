# Navidrome Studio

Versión no oficial de **Navidrome 0.64.2** con una interfaz inspirada en Apple Music: superficies claras, acento rosado, carátulas grandes, navegación sencilla y reproductor discreto. Incluye **Studio** y **Studio Dark**, accesos a novedades, álbumes, favoritos y descubrimiento aleatorio, y diseño adaptable a móvil.

![Studio claro con biblioteca ficticia](docs/studio/screenshots/studio-light.png)

[Ver apariencia oscura](docs/studio/screenshots/studio-dark.png) · [Ver móvil](docs/studio/screenshots/studio-mobile.png)

Las capturas muestran una biblioteca sintética de prueba. Studio conserva el servidor, autenticación, escáner, reproducción y API Subsonic/OpenSubsonic de Navidrome. No incorpora el clasificador de géneros de Playlistr: Playlistr sigue siendo una aplicación independiente que se puede conectar a este servidor.

## Estado y publicación en GHCR

La imagen se ha compilado y ejecutado localmente en **linux/amd64**. El workflow está preparado; esto **no significa que el paquete ya esté publicado ni disponible para descargar**.

Cada push a `main` activa el workflow **Test and publish Navidrome Studio** prueba el frontend y publica:

```text
ghcr.io/diegoshock/navidrome-studio:latest
```

También crea `sha-<commit>` para fijar una versión. Puedes ejecutarlo manualmente desde **Actions → Test and publish Navidrome Studio → Run workflow**, seleccionando `main`. Usa el `GITHUB_TOKEN` automático; no necesita un PAT adicional. La primera vez, establece el paquete en **Public** desde sus ajustes para descargarlo en Unraid sin iniciar sesión. Una ejecución fallida no genera una nueva imagen.

## Probar en Unraid, sin Docker Compose

Prueba Studio en paralelo, con datos nuevos. No apuntes dos servidores activos a la misma base de datos. La carpeta de música sí se puede compartir en **solo lectura**.

1. Prepara los datos desde la terminal de Unraid:

   ```bash
   mkdir -p /mnt/user/appdata/navidrome-studio
   chown 99:100 /mnt/user/appdata/navidrome-studio
   chmod 700 /mnt/user/appdata/navidrome-studio
   ```

2. En **Docker → Add Container**, configura:

   | Campo | Valor |
   | --- | --- |
   | Name | `navidrome-studio` |
   | Repository | `ghcr.io/diegoshock/navidrome-studio:latest` |
   | Network Type | `bridge` |
   | Puerto TCP | **Contenedor `4533` → host `4534`** |
   | Datos, lectura/escritura | `/mnt/user/appdata/navidrome-studio` → `/data` |
   | Música, solo lectura | Tu carpeta de música → `/music` |
   | `ND_DEFAULTTHEME` | `Studio` |
   | `ND_DEFAULTLANGUAGE` | `es` |
   | `ND_ENABLECOVERANIMATION` | `false` |
   | Extra Parameters | `--user 99:100 --security-opt=no-new-privileges --cap-drop=ALL` |
   | WebUI | `http://[IP]:[PORT:4533]/` |

   Mantén **Privileged** desactivado. Adapta UID/GID si tu servidor usa otros permisos. Si el puerto host `4534` está ocupado, cambia únicamente el puerto **host**.

3. Pulsa **Apply** y abre `http://IP-DE-UNRAID:4534`. Crea el administrador de esta nueva instancia y espera el escaneo.
4. Si aparece el tema anterior, entra en **Ajustes → Personal → Tema → Studio**. El botón de sol/luna de la biblioteca alterna entre Studio y Studio Dark.

La [plantilla XML](unraid/navidrome-studio.xml) contiene estos campos. Guárdala como `/boot/config/plugins/dockerMan/templates-user/my-navidrome-studio.xml` y selecciónala en **Add Container**. No requiere instalar Docker Compose ni está publicada en Community Applications.

Tus usuarios, favoritos y playlists actuales no aparecen automáticamente en esta instalación de prueba. Esta versión de Studio usa la misma base que **Navidrome 0.64.2**. Para una migración posterior, detén el original y respalda sus datos completos antes de copiar o cambiar su carpeta de datos. Evita abrir una base de datos de una versión más reciente con una versión anterior. Para volver al original durante la prueba, basta con detener Studio y usar el servidor que ya tenías.

Para conectar Playlistr a la instancia de prueba, usa `http://IP-DE-UNRAID:4534` y las credenciales de Studio. Los clientes Subsonic pueden usar esa misma dirección.

## Código y compilación

Este repositorio contiene el código completo de Studio. La base es [Navidrome v0.64.2](https://github.com/navidrome/navidrome/tree/101145742f4762164202cb4858c9126258bdc463), commit `101145742f4762164202cb4858c9126258bdc463`. Se conservan sus licencias y atribuciones. La documentación original está en [UPSTREAM-README.md](docs/studio/UPSTREAM-README.md).

```bash
git clone https://github.com/diegoshock/navidrome-studio.git
cd navidrome-studio
docker build -f Dockerfile.studio -t navidrome-studio:local .
```

El build usa Node 24, Go 1.27 y la imagen de ejecución `deluan/navidrome:0.64.2`. Compila un binario con el frontend incorporado. No basta con montar una carpeta web sobre el contenedor oficial. `Dockerfile.studio` es el Dockerfile de esta distribución; `Dockerfile` conserva el original de upstream.

Para entornos con una CA corporativa, el Dockerfile admite `--secret id=build_ca,src=/ruta/al/bundle.pem`. Mantiene la validación TLS.

Para desarrollar y verificar el frontend:

```bash
cd ui
npm ci
npm run lint
npm run type-check
npm test -- --maxWorkers=2
npm run build
```

El frontend de desarrollo usa el puerto 4533 y espera el backend en 4633. Para iniciarlo con un backend de prueba ya configurado, ejecuta `npm start`. Usa datos aislados durante el desarrollo. Los resultados de las pruebas están en [VALIDATION.md](docs/studio/VALIDATION.md).

Las modificaciones de interfaz están en `ui/src/studio/`, `ui/src/themes/studio*.js`, el registro de temas y las vistas de biblioteca. Se mantienen los servicios y API de Navidrome sin cambios de código Go.

## Licencia y mantenimiento

Navidrome y esta modificación se distribuyen bajo **GPLv3**; consulta [LICENSE](LICENSE). Studio es independiente de los proyectos Navidrome y Apple y no utiliza logotipos ni recursos gráficos de Apple. La imagen incluye el código correspondiente en `/usr/share/navidrome-studio/source.tar.gz`:

```bash
docker cp navidrome-studio:/usr/share/navidrome-studio/source.tar.gz ./navidrome-studio-source.tar.gz
```

La base está fijada: las actualizaciones de Navidrome no se aplican automáticamente. Para actualizarla hay que integrar los cambios de upstream, revisar las modificaciones de Studio, ejecutar las pruebas y publicar una imagen nueva. Las dependencias y capas de contenedor pueden variar aunque la revisión del código esté fijada; no se garantiza igualdad binaria entre compilaciones.
