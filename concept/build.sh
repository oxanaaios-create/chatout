#!/bin/sh
cd "$(dirname "$0")"
{ cat src/1-head.html src/1b-extra.html src/2-body.html; echo '<script>'; cat src/3-data.js src/4-pages.js src/5-engine.js; echo '</script>'; } > chatout-canvas.html
wc -c chatout-canvas.html
