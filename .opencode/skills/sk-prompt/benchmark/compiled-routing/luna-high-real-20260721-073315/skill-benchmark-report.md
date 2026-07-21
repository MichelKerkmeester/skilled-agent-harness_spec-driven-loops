# Skill Benchmark Report — sk-prompt

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
| LUNA-SP-R | sk-prompt | PASS | — | routed-to-gold (prompt-improve) |  |
| LUNA-SP-H | sk-prompt | PASS | — | routed-to-gold (prompt-improve) |  |

## Provenance & execution context

_Repo-relative provenance — this archived report carries no absolute checkout path and stays valid when copied elsewhere._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/sk-prompt` |
| Captured at | 2026-07-21T07:42:15.440Z |
| Active manifest | `.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-prompt/manifest.json` · digest `33584dd320a7ab488cd813f07892b3930d33f8a51693043bfe9a73fd676fe6c1` |
| Engine resolver | `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` |
| Source report digest | `8d8c45ba6c1374ef99ff73783b64e818c5e8fd9cadd45cdcd35805ff567f0b3d` |
| Executor / model | codex / openai/gpt-5.6-luna (high) |
| CLI version | v22.23.1 |
| Flag state | `unset` |
| Runtime digest | `3d869dc47be0ae15dd19959c9853036790db2359b43447cc79d214e8edfed708` |
| Run revision | 665a3116c0 |
| Scenario IDs | LUNA-SP-R, LUNA-SP-H |

## Funnel


## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| LUNA-SP-R | — | routing | — | passed |
| LUNA-SP-H | — | holdout | — | passed |

## Methodology / caveats

- Mode A deterministic router-replay.
- Scenario count: 2.
