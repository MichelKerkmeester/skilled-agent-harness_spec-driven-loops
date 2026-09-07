# Phase inventory

## Keyed multi-series forms

- `bar-line-composed` — orders and conversion rate; `bars`, `axis-count`, `rate-line`, `rate-dot`, `axis-rate`, `key-rule`
- `grouped-bars` — last year and this year; `past`, `current`
- `parallel-axes` — Alpha, Beta, Gamma and Delta; `line-1`/`dot-1` through `line-4`/`dot-4`
- `population-pyramid` — Men and Women; `bar-left`, `bar-right`
- `stacked-area` — Perpetual, Subscription, Services and Training; `band-1` through `band-4`
- `stacked-bars` — Platform, Services and Support; `series-1` through `series-3`

Ordered colour ladders, sign/state classes and categorical cells remain indexed or local shape
contracts; they are not named multi-series streams.

## Tooltip or card-readout forms

`bar-line-composed`, `box-plot`, `bullet`, `calendar-grid`, `candlestick`, `daily-line`,
`daily-range`, `distribution-strip`, `dumbbell`, `funnel`, `grouped-bars`, `heat-matrix`,
`histogram`, `population-pyramid`, `scatter`, `stacked-area`, `stacked-bars`, and `treemap`.

The four tooltip-bearing deliveries are `calls-by-day-and-hour`, `orders-after-the-price-change`,
`pick-times-by-depot`, and `van-age-against-repair-cost`.

The other two deliveries, `staff-hours-by-service` and `where-the-budget-went`, are single-metric
category displays without a tooltip/card readout or time path. Their indexed category marks stay
on the existing contract and do not receive a `READOUT`, `CHART_SERIES` or `CURVE` block.

## Time-path forms

- `bar-line-composed` — weekly measured rate path, `linear`
- `daily-line` — daily measured order path, `linear`
- `stacked-area` — monthly measured stacked paths, `linear`
- `assets/examples/orders-after-the-price-change` — delivery of the daily-line path, `linear`

All four keep finite gaps visible and do not introduce a new chart form, radar, pie, natural
interpolation, or external dependency.
