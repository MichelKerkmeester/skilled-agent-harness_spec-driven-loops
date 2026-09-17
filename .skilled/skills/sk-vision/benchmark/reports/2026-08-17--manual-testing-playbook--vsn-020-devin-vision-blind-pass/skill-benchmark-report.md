# Skill Benchmark Report — sk-vision

> Rendered from report.json (do not hand-edit). Scoring: `not-applicable-manual-outcome` · trace mode: `doc`.

**Verdict: PASS**

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
| Captured at | 2026-08-17T16:36:35.513Z |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | cli-devin / glm-5-2 (vsn-020-devin-vision-blind) |
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
| VSN-020 | manual | host-adapters | — | PASS: GLM-5.2-High via cli-devin (dangerous) called mcp__sk-vision__sk_vision_ocr on the fixture (server on moondream3-preview) and returned 'CODE 4 4218' — ground-truth CODE and 4218 recovered, no hallucination; minor spacing artifact. Supersedes prior SKIP (vsn-020-devin-ocr-md3.log). |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
