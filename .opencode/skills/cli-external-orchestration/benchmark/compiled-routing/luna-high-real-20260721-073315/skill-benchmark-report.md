# Skill Benchmark Report — cli-external-orchestration

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
| LUNA-CE-R | cli-external-orchestration | PASS | — | routed-to-gold (cli-opencode) |  |
| LUNA-CE-H | cli-external-orchestration | PASS | — | routed-to-gold (cli-opencode) |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/cli-external-orchestration` |
| Captured at | 2026-07-21T07:49:00.975Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/cli-external-orchestration/manifest.json` · digest `3b74958fb892f092622efbfb7693cfb1f4386e3576063cc9abc813a418933f79` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `3c5f823698403a31ade9b9addbafffb325a0344e8c8778fb6864cb3dc43fa17f` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 665a3116c0 |
| Scenario IDs | LUNA-CE-R, LUNA-CE-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-CE-R | — | routing | — | passed |
| LUNA-CE-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
