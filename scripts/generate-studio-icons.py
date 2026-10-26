#!/usr/bin/env python3
"""Generate Studio's original vector identity and browser/launcher fallbacks.
Requires Python Pillow, Playwright and Chromium (CHROMIUM_PATH overrides path).
"""
from pathlib import Path
import io
import os
import zipfile
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'ui/public'
ICONS = PUBLIC / 'icons'
ICONS.mkdir(exist_ok=True)
NOTICE = '<!-- Original Studio artwork. Copyright 2026 Studio contributors. SPDX-License-Identifier: Apache-2.0 -->'
SHAPES = '''<path d="M6 21Q0 17 0 24V104Q0 111 6 107L56 69Q62 64 56 59Z"/>
<rect class="bar b1" x="66" y="36" width="14" height="56" rx="7"/>
<rect class="bar b2" x="88" y="0" width="14" height="128" rx="7"/>
<rect class="bar b3" x="110" y="24" width="14" height="80" rx="7"/>'''
STYLE = '''<style>
.bar{transform-origin:64px 64px;animation:studio-level 1.2s ease-in-out infinite alternate}
.b2{animation-delay:-.8s}.b3{animation-delay:-.4s}
@keyframes studio-level{from{transform:scaleY(.45)}to{transform:scaleY(1)}}
@media(prefers-reduced-motion:reduce){.bar{animation:none}}
</style>'''
def svg(color='#000', animated=False, badge=False):
    extent = 160 if badge else 128
    art = f'<g fill="{color}">{SHAPES}</g>'
    if badge:
        art = '<rect width="160" height="160" rx="32" fill="#fff"/>' + '<g transform="translate(18 16)">' + art + '</g>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {extent} {extent}" width="512" height="512" role="img" aria-labelledby="title">
{NOTICE}
<title id="title">Studio for Navidrome</title>
<desc>Original play symbol and three audio level bars. Independent project, not the Navidrome logo.</desc>
{STYLE if animated else ''}
{art}
</svg>\n'''

variants = {
    'studio-for-navidrome.svg': svg(),
    'studio-for-navidrome-dark.svg': svg(),
    'studio-for-navidrome-light.svg': svg('#fff'),
    'studio-for-navidrome-animated.svg': svg(animated=True),
    'studio-for-navidrome-light-animated.svg': svg('#fff', animated=True),
    'studio-for-navidrome-badge.svg': svg(badge=True),
    'studio-for-navidrome-badge-animated.svg': svg(badge=True, animated=True),
}
for name, content in variants.items():
    (ICONS/name).write_text(content)
(ROOT/'ui/src/icons/studio.svg').write_text(svg())
(ROOT/'ui/src/icons/studio-badge.svg').write_text(svg(badge=True))
(ROOT/'ui/src/icons/studio-animated.svg').write_text(svg(animated=True))
(ROOT/'ui/src/icons/studio-badge-animated.svg').write_text(svg(animated=True,badge=True))
(PUBLIC/'safari-pinned-tab.svg').write_text(svg())

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':512,'height':512},device_scale_factor=1)
    page.set_content('<style>html,body{margin:0;background:transparent}</style>'+svg(badge=True))
    source = Image.open(io.BytesIO(page.screenshot(omit_background=True))).convert('RGBA')
    browser.close()
source.save(ICONS/'studio-for-navidrome.png')
for file in PUBLIC.glob('*.png'):
    with Image.open(file) as old:
        w,h=old.size
    canvas=Image.new('RGBA',(w,h))
    size=min(w,h)
    tile=source.resize((size,size),Image.Resampling.LANCZOS)
    canvas.paste(tile,((w-size)//2,(h-size)//2))
    canvas.save(file)
source.save(PUBLIC/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
for file in [ROOT/'ui/src/icons/android-icon-192x192.png',ROOT/'resources/logo-192x192.png']:
    source.resize((192,192),Image.Resampling.LANCZOS).save(file)
with zipfile.ZipFile(ROOT/'docs/studio/icons/studio-for-navidrome-icons.zip','w',compression=zipfile.ZIP_DEFLATED) as archive:
    files=list(ICONS.glob('*'))+[ROOT/'docs/studio/icons/LICENSE-APACHE-2.0.txt',ROOT/'docs/studio/icons/README.md']
    for file in sorted(files):
        info=zipfile.ZipInfo(file.name,date_time=(2026,10,26,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        archive.writestr(info,file.read_bytes())
print('Generated SVG, PNG, ICO and submission ZIP')
