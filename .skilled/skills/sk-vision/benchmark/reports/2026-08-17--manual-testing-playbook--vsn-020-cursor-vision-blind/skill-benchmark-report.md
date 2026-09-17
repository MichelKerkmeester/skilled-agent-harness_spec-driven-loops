# Skill Benchmark Report — sk-vision

> Rendered from report.json (do not hand-edit). Scoring: `not-applicable-manual-outcome` · trace mode: `doc`.

**Verdict: FAIL**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | _not-applicable-manual-outcome_ |
| D1 intra (router) | — | _not-applicable-manual-outcome_ |
| D2 discovery | — | _not-applicable-manual-outcome_ |
| D3 efficiency | — | _not-applicable-manual-outcome_ |
| D4 usefulness | — | _not-applicable-manual-outcome_ |
| D5 connectivity | — | _not-applicable-manual-outcome_ |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-vision` |
| Captured at | 2026-08-17T16:28:03.252Z |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | — / — (vsn-020-cursor-vision-blind) |
| CLI version | — |
| Flag state | `—` |
| Runtime digest | `—` |
| Run revision | — |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| VSN-020 | manual | host-adapters | — | FAIL: GLM-5.2-High via cli-cursor called sk_vision_inspect and sk_vision_ocr (no hallucination) and recovered the unguessable ground-truth tokens CODE and 4218 via inspect ('CODE DE DE 4218'); but exact-quote match to 'CODE 4218' failed — ocr returned only 'CO' and inspect carried a model repetition artifact. Root cause: default moondream2 truncates text reads and OCR is moondream3-only; moondream3 reads content but with a token-doubling artifact (vsn-020-cursor-ocr.log). |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
