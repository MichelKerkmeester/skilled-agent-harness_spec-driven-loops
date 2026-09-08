#!/bin/bash
# Captures public chart galleries in both colour schemes for the reference library.
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$1"; mkdir -p "$OUT"
shot() { # name url schemes(light|dark|both)
  local name="$1" url="$2" schemes="$3"
  for sch in light dark; do
    [ "$schemes" = "both" ] || [ "$schemes" = "$sch" ] || continue
    local flag="--blink-settings=preferredColorScheme=1"; [ "$sch" = "dark" ] && flag="--blink-settings=preferredColorScheme=0"
    "$CH" --headless=new --disable-gpu --no-sandbox --hide-scrollbars $flag --window-size=1440,1000 --virtual-time-budget=12000 --timeout=45000 --screenshot="$OUT/$name-$sch.png" "$url" >/dev/null 2>&1
    echo "$name-$sch $( [ -s "$OUT/$name-$sch.png" ] && stat -f%z "$OUT/$name-$sch.png" || echo FAILED )"
  done
}
shot shadcn-area https://ui.shadcn.com/charts/area both
shot shadcn-bar https://ui.shadcn.com/charts/bar both
shot shadcn-line https://ui.shadcn.com/charts/line both
shot shadcn-tooltip https://ui.shadcn.com/charts/tooltip both
shot tremor-area https://tremor.so/docs/visualizations/area-chart both
shot tremor-bar-list https://tremor.so/docs/visualizations/bar-list both
shot tremor-tracker https://tremor.so/docs/visualizations/tracker both
shot tremor-spark https://tremor.so/docs/visualizations/spark-chart both
shot tremor-donut https://tremor.so/docs/visualizations/donut-chart both
shot carbon-simple https://carbondesignsystem.com/data-visualization/simple-charts/ light
shot carbon-complex https://carbondesignsystem.com/data-visualization/complex-charts/ light
shot observable-plot https://observablehq.com/plot/ both
shot d3-gallery https://observablehq.com/@d3/gallery light
shot vegalite-examples https://vega.github.io/vega-lite/examples/ light
shot echarts-examples https://echarts.apache.org/examples/en/index.html light
shot nivo-line https://nivo.rocks/line/ both
shot nivo-bar https://nivo.rocks/bar/ both
shot visx-gallery https://airbnb.io/visx/gallery light
shot mantine-area https://mantine.dev/charts/area-chart/ both
shot mantine-bar https://mantine.dev/charts/bar-chart/ both
shot recharts-area https://recharts.org/en-US/examples/SimpleAreaChart light
shot tanstack-charts https://tanstack.com/charts/latest both
shot layerchart https://layerchart.com/ both
shot unovis-gallery https://unovis.dev/gallery both
shot plotly-line https://plotly.com/javascript/line-charts/ light
shot highcharts-line https://www.highcharts.com/demo/highcharts/line-chart light
shot apex-line https://apexcharts.com/javascript-chart-demos/line-charts/ light
shot chartjs-line https://www.chartjs.org/docs/latest/samples/line/line.html both
shot datawrapper-blog https://www.datawrapper.de/blog light
shot urban-styleguide https://urbaninstitute.github.io/graphics-styleguide/ light
shot apple-hig-charts https://developer.apple.com/design/human-interface-guidelines/charts both
shot grafana-play https://play.grafana.org/ dark
shot vercel-analytics https://vercel.com/analytics both
shot posthog-analytics https://posthog.com/product-analytics both
shot amcharts-demos https://www.amcharts.com/demos/ light
shot frappe-charts https://frappe.io/charts light
