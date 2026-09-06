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
| Executor / model | deepseek-v4-flash / deepseek/deepseek-v4-flash (mermaid-import) |
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
| IMP-002 | manual | import-export | — | PASS: mermaid_extract.py on docs/onboarding.md -> digest of 5 nodes/5 edges (cycle=True, retry loop), flowchart type chosen; redrawn fresh without inheriting Mermaid's TD renderer layout/theme to docs/onboarding-flow.html; fidelity ledger reported nothing dropped. Independently verified: file exists (7160 bytes), source checksum byte-identical before/after (cf55ce110c...), accessible-SVG contract present. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
