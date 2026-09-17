# Skill Benchmark Report — system-spec-kit

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
| Skill root (repo-relative) | `—` |
| Captured at | — |
| Active manifest | `—` · digest `—` |
| Engine resolver | `—` |
| Source report digest | `—` |
| Executor / model | cursor / composer-2.5 (ux-hooks) |
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
| ux-hooks-directive-lifecycle-dedup | manual | documentation | — | FAIL: Dedup engine cadence passes via the compiled claude target (turn1 full, repeat route-only, shrink re-deliver, kill-switch, fail-open) but the runtime hook surface is non-functional: hooks.json registers dist/hooks/cursor/user-prompt-submit.js which the build does not produce (dist has only claude/lib/pi), and the .cursor/hooks/user-prompt-submit.js shim imports ./shared.js which never existed at HEAD (ERR_MODULE_NOT_FOUND). Runtime fails open with the registration's own diagnostic; the advisor brief never reaches cursor. |

## Methodology / caveats

- Manual playbook outcome; no Lane C dimension scoring applies.
- Scenario count: 1.
