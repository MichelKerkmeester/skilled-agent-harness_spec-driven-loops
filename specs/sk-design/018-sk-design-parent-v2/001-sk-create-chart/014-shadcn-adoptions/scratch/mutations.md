# Mutation evidence

Each negative control ran against a copied chart package. The copies were removed before the
commit because they weighed twelve megabytes, recreated from the final corpus by the final
verification pass, and removed again once that pass had reproduced every control; the recorded
command, mutation and exact failure line below are the evidence. Each control was reproduced
against the final corpus on 2026-09-07 and produced exactly one failure, the recorded line, exit 1.
Each is reproduced by copying `.opencode/skills/sk-design/sk-design-chart/` here, applying the
described edit, and running `node scripts/check-corpus.cjs` from inside the copy. An independent
Sonnet review reproduced the decorative-alias control in a temporary copy on 2026-09-07 and
observed the same failure line, and the final verification pass reproduced it the same way against
the final checker.

## Series-key ownership

Command: `node scripts/check-corpus.cjs` from `scratch/mutation-series/`.

Exit code: `1`; output ended with `RESULT: FAILED`.

Exact assertion line:

`FAIL [series-mapping] assets/templates/bar-line-composed.html: series key "orders" has no palette token. Each key resolves to exactly one --chart-series-N token`

Mutation: removed the `token` property from the `orders` declaration.

## Local readout block

Command: `node scripts/check-corpus.cjs` from `scratch/mutation-readout/`.

Exit code: `1`; output ended with `RESULT: FAILED`.

Exact assertion line:

`FAIL [number-format] assets/templates/box-plot.html: the file carries a hover card and defines no READOUT block. Tooltip label, value and key alias belong beside CHART_DATA`

Mutation: removed the `READOUT` sentinel block from `box-plot.html`. This is the standing state of the recreated `scratch/mutation-readout/` copy, and it produced the line above, one failure, exit 1.

The post-fix pass had refreshed its own copy for the semantic key-wiring control below; that copy
was removed with the cleanup, so the final verification pass recreated this one for the
block-presence control and reproduced the wiring control in a temporary copy instead.

## Readout key wiring

Command: `node scripts/check-corpus.cjs` from a temporary copy of the chart package, not kept; the copy's `box-plot.html` registration restores the decorated pattern while the other 21 wired files stay as shipped.

Exit code: `1`; output ended with `RESULT: FAILED`.

Exact assertion line:

`FAIL [number-format] assets/templates/box-plot.html: tooltip readout code builds an object keyed by READOUT.key and immediately reads that alias back. The card must read READOUT.key from the registered datum`

Mutation: restored the decorative `{ [READOUT.key]: name }` and `source[READOUT.key]` pattern in the copied `box-plot.html` registration helper.

## Curve intent

Command: `node scripts/check-corpus.cjs` from `scratch/mutation-curve/`.

Exit code: `1`; output ended with `RESULT: FAILED`.

Exact assertion line:

`FAIL [curve-contract] assets/templates/daily-line.html: CURVE "natural" is outside {linear, step, monotone}. Natural interpolation is not a declared intent`

Mutation: changed the declared `CURVE` value from `linear` to `natural`.
