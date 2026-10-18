export const studioPlayerStyles = ({
  background,
  surface,
  foreground,
  muted,
  border,
  accent,
}) => `
.react-jinke-music-player .music-player-controller,
.react-jinke-music-player .music-player-controller svg,
.react-jinke-music-player .destroy-btn,
.react-jinke-music-player .destroy-btn svg { color: ${accent}; }
.react-jinke-music-player .music-player-controller .music-player-controller-setting { background: ${accent}55; }
.react-jinke-music-player .audio-circle-process-bar circle[class=stroke] { stroke: ${accent}; }
.react-jinke-music-player-main .music-player-panel {
  background: ${background}f5;
  color: ${foreground};
  border-top: 1px solid ${border};
  box-shadow: 0 -6px 30px #00000008;
  backdrop-filter: blur(24px);
}
.react-jinke-music-player-main .music-player-panel svg { color: ${foreground}; }
.react-jinke-music-player-main .react-jinke-music-player-mobile svg { color: ${foreground}; }
.react-jinke-music-player-main .react-jinke-music-player-mobile .play-btn svg,
.react-jinke-music-player-main .react-jinke-music-player-mobile-header-right svg { color: ${accent}; }
.react-jinke-music-player-main .react-jinke-music-player-mobile-play-model-tip { background-color: ${accent}; }
.react-jinke-music-player-main .music-player-panel button:disabled svg { opacity: .35; }
.react-jinke-music-player-main .music-player-panel .panel-content .img-rotate,
.react-jinke-music-player-mobile-cover,
.react-jinke-music-player-mobile .react-jinke-music-player-mobile-cover img.cover {
  animation: none !important;
  border-radius: 8px !important;
}
.react-jinke-music-player-main .music-player-panel .img-content { box-shadow: none; }
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-track,
.react-jinke-music-player-main .music-player-panel .panel-content .rc-slider-handle,
.react-jinke-music-player-mobile .rc-slider-track,
.react-jinke-music-player-mobile .rc-slider-handle { background-color: ${accent}; }
.react-jinke-music-player-main .music-player-panel .rc-slider-rail { background: ${border} !important; }
.react-jinke-music-player-main .music-player-panel .panel-content .audio-main,
.react-jinke-music-player-main .music-player-panel .panel-content .audio-current-time,
.react-jinke-music-player-main .music-player-panel .panel-content .audio-duration { color: ${muted}; }
.react-jinke-music-player-main .audio-lists-panel,
.react-jinke-music-player-main .audio-lists-panel .audio-item,
.react-jinke-music-player-main .react-jinke-music-player-mobile { background: ${background}; color: ${foreground}; }
.react-jinke-music-player-main .audio-lists-panel { border: 1px solid ${border}; border-radius: 12px 12px 0 0; }
.react-jinke-music-player-main .audio-lists-panel .audio-item:nth-child(odd) { background: ${surface} !important; }
.react-jinke-music-player-main .audio-lists-panel .audio-item.playing,
.react-jinke-music-player-main .audio-lists-panel .audio-item.playing svg,
.react-jinke-music-player-main .audio-item.playing .player-singer,
.react-jinke-music-player-main .lyric-btn-active svg { color: ${accent} !important; }
.react-jinke-music-player-main button:focus-visible,
.react-jinke-music-player-main [tabindex]:focus-visible { outline: 2px solid ${accent}; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .react-jinke-music-player-main * { transition: none !important; animation: none !important; }
}
`
