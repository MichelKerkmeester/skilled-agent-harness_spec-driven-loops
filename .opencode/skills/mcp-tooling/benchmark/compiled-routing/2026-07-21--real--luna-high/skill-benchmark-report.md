# Skill Benchmark Report — mcp-tooling

> Rendered from report.json (do not hand-edit). Scoring: `undefined` · trace mode: `live`.

**Verdict: FAIL**

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
| LUNA-MT-R | mcp-tooling | PASS | — | routed-to-gold (mcp-refero) |  |
| LUNA-MT-H | mcp-tooling | FAIL | — | stated-route-missed-gold |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/mcp-tooling` |
| Captured at | 2026-07-21T07:44:16.353Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/mcp-tooling/manifest.json` · digest `9fe2ef64d5c9c89bac195af5016f80fb1b027fdb5a2065019eea3e211579f0b5` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `8c3791b414590542491b278221ae163d0e31cf3e589816225ab25a7dfc854e3a` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 665a3116c0 |
| Scenario IDs | LUNA-MT-R, LUNA-MT-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-MT-R | — | routing | — | passed |
| LUNA-MT-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
