# Skill Benchmark Report — system-deep-loop

> Rendered from report.json (do not hand-edit). Scoring: `undefined` · trace mode: `live`.

**Verdict: PASS**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | — |
| D1 intra (router) | — | — |
| D2 discovery | — | — |
| D3 efficiency | — | — |
| D4 usefulness | — | — |
| D5 connectivity | — | — |

## Compiled routing parity

- Sub-verdict: **undefined** · child flag forced on: **no** · parent flag: `unset` · parity mode: `undefined`
- Scored: **0** · match: **0** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **0** · drift rows: **0** · breakages: **0**

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| LUNA-DL-R | system-deep-loop | PASS | — | routed-to-gold (research) |  |
| LUNA-DL-H | system-deep-loop | PASS | — | routed-to-gold (research) |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/system-deep-loop` |
| Captured at | 2026-07-21T07:46:04.819Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/system-deep-loop/manifest.json` · digest `73072d8eeb2cbcea92439a04af26480ca2bc81b29a4ec4f7178bbb59994d6f50` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `404a9510a0b449ba6ed3fb55cd866f4d212387d95762b71f006ca417f14406c6` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 665a3116c0 |
| Scenario IDs | LUNA-DL-R, LUNA-DL-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-DL-R | — | routing | — | passed |
| LUNA-DL-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
