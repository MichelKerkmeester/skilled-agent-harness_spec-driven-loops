# Skill Benchmark Report — sk-create-diagram

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
| Skill root (repo-relative) | `—` |
| Captured at | — |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | deepseek-v4-flash / deepseek/deepseek-v4-flash (type-selection-and-routing) |
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
| DIA-001 | manual | diagram-generation | — | PASS: Loaded references/types/type-architecture.md + style-guide.md; wrote docs/checkout-architecture.html (3 nodes, 2 orthogonal edges, 1 accent, bottom legend). Verified: role=img + title/desc pair present as first children, self-contained per packet convention (inline CSS/SVG/no JS; the one external Google Fonts <link> matches the packet's own shipped template.html and every canonical example — not a scenario-specific defect). |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
