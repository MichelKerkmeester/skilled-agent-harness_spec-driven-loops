# Skill Benchmark Report — sk-doc

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
| LUNA-SD-H | sk-doc | PASS | routed-to-gold (create-skill) |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-doc` |
| Captured at | 2026-07-21T01:20:53.240Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-doc/manifest.json` · digest `a97ebcb6365f403ce2ac1d622c9dc564110be61504c7f68b83fd053ff7358841` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `c55d3fe7828d9a2e70a0bc1440fa357be01d41964ed7faa331de794eb8754218` |
| Executor / model | codex / — |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 2a39ecb9a0 |
| Scenario IDs | LUNA-SD-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-SD-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 1.
