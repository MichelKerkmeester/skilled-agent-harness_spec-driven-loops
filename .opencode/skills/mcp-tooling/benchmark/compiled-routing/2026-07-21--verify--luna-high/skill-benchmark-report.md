# Skill Benchmark Report — mcp-tooling

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
| LUNA-MT-R | mcp-tooling | PASS | — | routed-to-gold (mcp-refero) |  |
| LUNA-MT-H | mcp-tooling | PASS | — | routed-to-gold (mcp-refero) |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/mcp-tooling` |
| Captured at | 2026-07-21T12:04:06.713Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/mcp-tooling/manifest.json` · digest `de0c9bfc3337cb03ec60fa39832ec8aa53e36a773c2dad7a822d743614f64e05` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `5d7bca96fe883c6afcc68f4ffff2a6a77e8d2984725ea89e61f0b07d54de3d2c` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 7dfffa0c93 |
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
