RETURN: PASS | escalation=NONE | confidence=MEDIUM

SUMMARY: Landed keyed series ownership, local `READOUT`, and declared `CURVE` contracts across the relevant standalone chart forms and deliveries. Updated checker, references, packet docs, metadata, and regenerated the gallery. `sk-code` resolved WEBFLOW/standalone HTML with implementation and verification intents.

FILES CHANGED:

- `scripts/check-corpus.cjs` — added the three contract checks.
- 19 relevant files under `assets/templates/` — added series, readout, and curve declarations.
- 4 tooltip/path files under `assets/examples/` — added applicable declarations.
- `references/template-contract.md` — documented all contracts.
- `references/catalog.md` — recorded radar/pie omissions with research citation.
- `references/color-system.md` — recorded palette measurements with research citation.
- Packet `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` — closed with evidence.
- Packet `description.json`, `graph-metadata.json` — regenerated twice.
- Packet `scratch/inventory.md`, `scratch/mutations.md`, and three isolated mutation copies — added evidence.

ASSERTIONS ADDED:

- `series-mapping` keyed ownership — errors on missing/duplicate tokens and mismatched paints. Mutation: `FAIL [series-mapping] assets/templates/bar-line-composed.html: series key "orders" has no palette token. Each key resolves to exactly one --chart-series-N token`
- `number-format` `READOUT` contract — errors when tooltip forms lack the block or required usage. Mutation: `FAIL [number-format] assets/templates/box-plot.html: the file carries a hover card and defines no READOUT block. Tooltip label, value and key alias belong beside CHART_DATA`
- `curve-contract` — errors on undeclared, unused, or out-of-set curves including `natural`. Mutation: `FAIL [curve-contract] assets/templates/daily-line.html: CURVE "natural" is outside {linear, step, monotone}. Natural interpolation is not a declared intent`

VERIFICATION: `check-corpus.cjs` ended with `Summary: errors: 0` and `RESULT: PASSED`; `no-external`, `number-format`, `series-mapping`, and `curve-contract` all reported zero failures. Strict packet validation ended with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`. Grep counts: 18/18 tooltip templates and 4/4 tooltip deliveries have `READOUT`; 3 template paths and 1 delivery have `CURVE`. Render status: UNKNOWN — `--render` exited 1 because Chrome returned no document; direct Chrome invocation aborted with exit 134.

UNKNOWNS AND DEVIATIONS: Render-dependent visual/card/pointer checks remain unknown. Two deliveries were intentionally unchanged because they have no tooltip, named multi-series stream, or time path. Mutation controls were captured after consumer migration, though assertions were authored first; all final mutations fail closed and remain isolated under `scratch/`.