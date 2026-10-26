# Studio for Navidrome — original icon

Original artwork: a play symbol and three animated audio level bars. It does not use or trace the Navidrome logo. Copyright 2026 Studio contributors. These icon files are licensed under **Apache-2.0**; see [LICENSE-APACHE-2.0.txt](LICENSE-APACHE-2.0.txt). The application remains GPLv3.

The black animated SVG is `studio-for-navidrome-animated.svg`. It has a transparent background, no JavaScript, no external resources and no embedded raster images. The SVG declares a `prefers-reduced-motion` fallback for direct viewing. Some browsers do not propagate that preference into SVG images embedded with `<img>`; Studio therefore uses `<picture>` to select a separate static SVG when reduced motion is requested. Other dashboards should choose the static variant when needed. Black/static (`-dark`), white/static (`-light`), white/animated and a white-backed launcher badge are included. PNG and ICO fallbacks are intentionally static; favicons and installed-app launchers do not reliably animate SVG.

## Why this is not a recolored Navidrome logo

[Navidrome's brand guidelines](https://www.navidrome.org/brand/) explicitly prohibit recoloring the logo, making a similar logo or using it as a fork's application icon without written permission. They also distinguish GPL code rights from brand rights. Studio is an independent modified version, not an official or endorsed Navidrome release. The display name is **Studio for Navidrome**. Existing repository names and image URLs remain stable for installed systems.

## Dashboard Icons submission

[Contribution instructions](https://github.com/homarr-labs/dashboard-icons/blob/main/CONTRIBUTING.md) require SVG, kebab-case filenames and light/dark variants for monochrome artwork. Submit through **https://dashboardicons.com/submit**, signing in with your own account. The maintainers review and publish submissions; uploading here does not mean Dashboard Icons has accepted them.

Suggested name: **Studio for Navidrome**. Description: **Independent music server interface based on Navidrome. Original play/equalizer icon, Apache-2.0.** Website: https://github.com/diegoshock/navidrome-studio

Upload `studio-for-navidrome-dark.svg` and `studio-for-navidrome-light.svg` for static variants. Include `studio-for-navidrome-animated.svg` as the animated black variant if the submission form accepts it. PNG/WEBP conversions will be static. The ZIP includes all files and the license.

Canonical assets live in [`ui/public/icons`](../../../ui/public/icons). Regenerate with `python3 scripts/generate-studio-icons.py` using Pillow, Playwright and system Chromium; override the executable with `CHROMIUM_PATH` if needed. These are artwork-generation tools, not application runtime dependencies.
