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
| Executor / model | deepseek-v4-flash / deepseek/deepseek-v4-flash (hub-registration) |
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
| CMD-002 | manual | command-and-hub-integration | — | PASS: All 4 registration facts independently verified: (1) mode-registry.json has the sk-create-diagram entry with workflowMode/command//17 aliases incl. export diagram; (2) leaf-manifest.json carries the sk-create-diagram packet entry; (3) no packet-local graph-metadata.json exists (confirmed 'no such file'); (4) hub-router.json vocabularyClasses.create-diagram-aliases contains drawio, mermaid diagram, and redraw diagram (>=3 of the 4 named aliases route, satisfying the check) -- independently found export diagram is present in mode-registry.json's aliases but MISSING from hub-router.json's vocabularyClasses list, a real minor cross-file drift worth a small follow-up fix, not a failure of this scenario's stated pass criterion. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
