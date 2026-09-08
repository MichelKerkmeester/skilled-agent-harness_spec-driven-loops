#!/bin/bash
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$1"; mkdir -p "$OUT"
shot() { local name="$1" url="$2" schemes="$3"; for sch in light dark; do [ "$schemes" = "both" ] || [ "$schemes" = "$sch" ] || continue; local flag="--blink-settings=preferredColorScheme=1"; [ "$sch" = "dark" ] && flag="--blink-settings=preferredColorScheme=0"; "$CH" --headless=new --disable-gpu --no-sandbox --hide-scrollbars $flag --window-size=1440,1000 --virtual-time-budget=15000 --timeout=60000 --screenshot="$OUT/$name-$sch.png" "$url" >/dev/null 2>&1; echo "$name-$sch $( [ -s "$OUT/$name-$sch.png" ] && stat -f%z "$OUT/$name-$sch.png" || echo FAILED )"; done; }
shot tremor-blocks https://blocks.tremor.so/ both
shot tremor-docs-area https://www.tremor.so/docs/visualizations/area-chart both
shot tremor-docs-tracker https://www.tremor.so/docs/visualizations/tracker both
shot tremor-docs-barlist https://www.tremor.so/docs/visualizations/bar-list both
shot owid-life-expectancy https://ourworldindata.org/grapher/life-expectancy light
shot owid-co2 https://ourworldindata.org/grapher/co-emissions-per-capita light
shot ft-visual-vocabulary https://ft-interactive.github.io/visual-vocabulary/ light
shot reuters-graphics https://www.reuters.com/graphics/ light
shot pudding https://pudding.cool/ light
shot flourish-examples https://flourish.studio/examples/ light
shot carbon-storybook-area "https://charts.carbondesignsystem.com/react/?path=/story/simple-charts-area--area" light
shot vega-editor-line "https://vega.github.io/editor/#/examples/vega-lite/line" light
shot plot-gallery https://observablehq.com/@observablehq/plot-gallery light
shot plot-area-docs https://observablehq.com/plot/marks/area both
shot linear-insights https://linear.app/features/insights both
shot grafana-dashboard "https://play.grafana.org/d/000000012/grafana-play-home" dark
shot economist-graphic-detail https://www.economist.com/graphic-detail light
shot datawrapper-academy https://www.datawrapper.de/academy light
shot shadcn-area-interactive https://ui.shadcn.com/charts/area#chart-area-interactive both
shot shadcn-radial https://ui.shadcn.com/charts/radial both
shot nivo-home https://nivo.rocks/ light
shot chartjs-samples https://www.chartjs.org/docs/latest/samples/ light
shot unovis-home https://unovis.dev/ both
