# Baseline

Captured before the shadcn visual upgrade edits.

## Static corpus check

Command: `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs`

Observed exit code: `0`

Observed result: `RESULT: PASSED`

| Family | Assertions | Failures |
| --- | ---: | ---: |
| accessibility | 70 | 0 |
| card-parts | 140 | 0 |
| catalog | 53 | 0 |
| catalog-system | 27 | 0 |
| colour-literals | 1226 | 0 |
| curve-contract | 16 | 0 |
| data-block | 35 | 0 |
| determinism | 35 | 0 |
| document-shape | 175 | 0 |
| empty-notice | 96 | 0 |
| gallery | 27 | 0 |
| geometry-block | 29 | 0 |
| gradient-sweep | 38 | 0 |
| identity | 70 | 0 |
| interaction-hygiene | 140 | 0 |
| interaction-state | 70 | 0 |
| motion | 191 | 0 |
| narrow-viewport | 105 | 0 |
| no-external | 210 | 0 |
| number-format | 320 | 0 |
| palette-block | 140 | 0 |
| palette-source | 38 | 0 |
| palette-source-dark | 34 | 0 |
| pointer-contract-coverage | 52 | 0 |
| radius | 70 | 0 |
| script-parses | 35 | 0 |
| series-mapping | 128 | 0 |
| type-scale | 393 | 0 |
| unique-ids | 182 | 0 |

Corpus summary: 35 files scanned, 26 chart forms, 3 colour systems, 0 errors.

## Render corpus check

Command: `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render`

Observed exit code: `1`.

Observed result: `RESULT: FAILED`.

Chrome was found at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, but every
render open exited before returning a document in this sandbox. The run reported 35 `render`
failures, 22 `card-readout` failures and 22 `pointer-reach` failures. The static families,
`dark-render` and `settled-render` completed without reported failures before the browser-open
failures. This is the pre-edit render baseline and is not treated as a corpus assertion regression.

