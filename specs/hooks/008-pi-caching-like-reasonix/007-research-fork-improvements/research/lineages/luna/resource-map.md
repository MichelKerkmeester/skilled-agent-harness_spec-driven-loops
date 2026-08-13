# Resource Map — Luna Lineage

## Local runtime source

| Resource | Lines/shape | Used for | Confidence |
|---|---|---|---|
| `.pi/extensions/deep-pi/extensions/deeppi/telemetry.ts` | 4-186 | Usage schema, cache-write omission, numeric validation gap, retry filter gap, report fields | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi.ts` | 1-83 | Module composition, session reset, report wiring, status/notify transport | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts` | 1-26 | Exact provider/model ownership boundary | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi/stormbreaker.ts` | 19-164 | Guard, abort, and error-enhancement counters | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi/stability.ts` | 36-207 | Thinking/pruning counters and churn state | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi/hashlines.ts` | 1-476 | Atomic edit behavior and tool boundary | Confirmed source |
| `.pi/extensions/deep-pi/extensions/deeppi/utils.ts` | 1-199 | Error normalization and stale naming surface | Confirmed source |
| `.pi/extensions/pi-cache-optimizer/index.ts` | 1-8390 | Ownership guard, adapters, normalizers, persistence, lifecycle, stats, diagnostics | Confirmed source |
| `.pi/extensions/deep-pi/package.json` | 1-60 | Test/typecheck/verify scripts and missing benchmark entry point | Confirmed manifest |
| `.pi/extensions/pi-cache-optimizer/package.json` | 1-49 | Test/check scripts and package boundary | Confirmed manifest |

## Test evidence

| Resource | Lines/shape | Used for | Confidence |
|---|---|---|---|
| `.pi/extensions/deep-pi/tests/telemetry.test.ts` | 20-226 | Existing happy-path and cost-error fixtures; missing cold-write/retry matrix | Confirmed test inventory |
| `.pi/extensions/deep-pi/tests/deeppi.integration.test.ts` | 1-102 | FakePi integration, provider/model activation, UI report assertion | Confirmed test inventory |
| `.pi/extensions/deep-pi/tests/fake-pi.ts` | 5-61 | Host harness capabilities and missing RPC/stdout channel | Confirmed test harness |
| `.pi/extensions/deep-pi/tests/hashlines.test.ts` | 18-179 | Existing atomic/race/collision coverage | Confirmed test inventory |
| `.pi/extensions/deep-pi/tests/review2.test.ts` | 51-217 | Existing snapshot and mixed-message coverage | Confirmed test inventory |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | 10-887 | Optimizer suite inventory and missing production lifecycle tests | Confirmed test inventory |

## Sibling packet evidence

| Resource | Lines/shape | Used for | Confidence |
|---|---|---|---|
| `.../003-fork-and-guard-cache-optimizer/implementation-summary.md` | 82-143 | Current guard acceptance, live baselines, vendored drift limitation | Prior packet receipt |
| `.../006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/implementation-summary.md` | 82-110 | DeepPi fix/test acceptance and negative controls | Prior packet receipt |
| `.../006-fork-and-improve-deep-pi/002-vendor-and-repoint/implementation-summary.md` | 48-65 | DeepPi vendoring and source-copy provenance | Prior packet receipt |
| `.../006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md` | 99-125 | Live report/RPC/credential limitations and regression receipts | Prior packet receipt |

## Commands and derived artifacts

| Evidence | Result | Used for |
|---|---|---|
| `npm run typecheck` in `.pi/extensions/deep-pi/` | Exit 0 | Local source remains type-valid during research |
| `npm run typecheck` in `.pi/extensions/pi-cache-optimizer/` | Exit 0 | Local source remains type-valid during research |
| `test -e .pi/extensions/deep-pi/scripts/live-benchmark.mjs` | Exit 1 | Declared benchmark entry point is absent |
| `deep-research-state.jsonl` | 7 iteration records, valid JSONL | Loop receipt and route proof |
| `findings-registry.json` | 28 findings, 0 open questions | Derived finding inventory |
| `deltas/iter-001.jsonl` … `deltas/iter-007.jsonl` | Valid JSONL delta records | Per-iteration graph and negative knowledge |

## Evidence limits

- No live provider claim was made from this detached lineage.
- The supplied missing `opencode` credential and incomplete RPC report body remain blocked external checks.
- No target code or tests were edited; recommendations are research outputs only.
