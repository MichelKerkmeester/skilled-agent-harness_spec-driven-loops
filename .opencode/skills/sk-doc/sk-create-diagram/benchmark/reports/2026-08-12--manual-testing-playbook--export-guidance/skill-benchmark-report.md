# Skill Benchmark Report — sk-create-diagram

> Rendered from report.json (do not hand-edit). Scoring: `not-applicable-manual-outcome` · trace mode: `doc`.

**Verdict: SKIP**

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
| Skill root (repo-relative) | `—` |
| Captured at | — |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | deepseek-v4-flash / deepseek/deepseek-v4-flash (export-guidance) |
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
| IMP-003 | manual | import-export | — | SKIP: SVG half completed for real: extracted the sole <svg> node from docs/checkout-architecture.html to docs/checkout-architecture.svg (6708 bytes), independently confirmed well-formed via xml.dom.minidom.parse. PNG half blocked: python3 -c 'import playwright' -> ModuleNotFoundError (confirmed independently in this environment) -- no fake PNG produced. Source file confirmed byte-unchanged by mtime (still 14:59, matches original creation), byte-count (8376, matches dispatch-1's own report), and content (all 3 node labels intact) -- independently verified checksum 8b3579818080df322fb12a5c727502a030e5ebd7. SKIP is the correct overall verdict per the playbook's own documented Playwright-missing blocker. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
