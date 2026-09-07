# Mutation evidence

Each negative control ran against a copied chart package under this directory. The copies were removed before the commit because they weighed twelve megabytes; the recorded command, mutation and exact failure line below are the evidence, and each control is reproduced by copying `.opencode/skills/sk-design/sk-design-chart/` here, applying the described edit, and running `node scripts/check-corpus.cjs` from inside the copy. An independent Sonnet review reproduced the decorative-alias control in a temporary copy on 2026-09-07 and observed the same failure line.

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

Mutation: removed the `READOUT` sentinel block from `box-plot.html` in the earlier control run.

The mutation-readout copy was refreshed for the semantic key-wiring control below; the earlier
failure line remains as historical evidence for the block-presence assertion.

## Readout key wiring

Command: `node scripts/check-corpus.cjs` from `scratch/mutation-readout/`.

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
