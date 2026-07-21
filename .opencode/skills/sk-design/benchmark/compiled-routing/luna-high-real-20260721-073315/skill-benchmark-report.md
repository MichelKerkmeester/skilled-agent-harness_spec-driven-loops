# Skill Benchmark Report — sk-design

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
| LUNA-SDG-R | sk-design | PASS | — | routed-to-gold (md-generator) |  |
| LUNA-SDG-H | sk-design | PASS | — | routed-to-gold (md-generator) |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-design` |
| Captured at | 2026-07-21T07:38:00.834Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-design/manifest.json` · digest `175b37bca692e2e987479a2c7950fa21b6082d305d7680c92934956358a8c1bd` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `aa0ff42a418152d0b2ad5badf6d1e098e32499919c83ee2459bff674a23a4406` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 665a3116c0 |
| Scenario IDs | LUNA-SDG-R, LUNA-SDG-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-SDG-R | — | routing | — | passed |
| LUNA-SDG-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
