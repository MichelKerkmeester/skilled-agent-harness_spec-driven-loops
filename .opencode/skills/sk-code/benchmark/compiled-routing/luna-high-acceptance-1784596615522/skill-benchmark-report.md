# Skill Benchmark Report — sk-code

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

- Sub-verdict: **undefined** · flag: `unset` · parity mode: `undefined`
- Scored: **0** · match: **0** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**

| Scenario | Hub | Status | Reason |
| -------- | --- | ------ | ------ |
| LUNA-CB-R | sk-code | PASS | routed-to-gold (code-webflow) |
| LUNA-CB-H | sk-code | PASS | routed-to-gold (code-webflow) |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-code` |
| Captured at | 2026-07-21T01:20:19.381Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-code/manifest.json` · digest `9e9a56dc2f92cb507074f4d61dc50067c9757416c6f0dc37d8a38489255a5ae8` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `c5031b082311d5d12f3fa2291b53ca2b52322658bc7b221da5ad770ef8ff9135` |
| Executor / model | codex / — |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 2a39ecb9a0 |
| Scenario IDs | LUNA-CB-R, LUNA-CB-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-CB-R | — | routing | — | passed |
| LUNA-CB-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
