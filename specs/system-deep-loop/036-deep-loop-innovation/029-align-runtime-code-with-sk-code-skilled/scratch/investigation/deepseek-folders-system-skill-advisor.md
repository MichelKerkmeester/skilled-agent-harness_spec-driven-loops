| folder | code files | verdict | reason |
|---|---|---|---|
| `compat/` | 1 | STAY | README declares it the package-level compatibility export surface, kept separate from `lib/compat/`. |
| `types/` | 1 | MERGE->`lib/skill-graph/` | No README; one ambient `better-sqlite3.d.ts` owned by its only SQLite consumer. |
| `lib/auth/` | 1 | MERGE->`lib/` | Single trusted-caller helper; README claims no package/import boundary. |
| `lib/context/` | 1 | MERGE->`lib/` | One caller-context helper; README is generic boilerplate with no boundary claim. |
| `lib/corpus/` | 1 | MERGE->`lib/` | Single df-idf helper; README separates it from scorer but declares no package boundary. |
| `lib/embedders/adapters/` | 1 | STAY | README: stable advisor import-path re-export shims. |
| `lib/ipc/` | 2 | STAY | README: owns the IPC socket/transport/idle-monitor subsystem with explicit boundaries. |
| `lib/routing/` | 1 | MERGE->`lib/` | No README; single route-exclusions module with no subfolder. |
| `lib/scorer/lanes/__tests__/` | 1 | MERGE->`lib/scorer/lanes/` | Single test file; README is generic boilerplate and tests belong beside the lanes. |
| `lib/shadow/` | 1 | STAY | README documents a named shadow-delta sink distinct from shadow-delivery in `../policy-plan.ts`. |
| `lib/shared/embeddings/adapters/` | 1 | STAY | README: canonical `@spec-kit/shared` adapter implementation (package boundary). |
| `lib/test-helpers/` | 1 | STAY | README: test-only helper; nothing in `lib/` may depend on it. |
| `scripts/command-bridges/` | 1 | STAY | README: declared source boundary mixing authored inputs and generated projection. |
| `stress-test/search-quality/` | 1 | MERGE->`stress-test/skill-advisor/` | Single harness; generic README, and the sibling already holds the stress suites. |
| `tests/__fixtures__/` | 1 | STAY | README: fixtures-only folder kept out of handler code. |
| `tests/cache/` | 2 | STAY | Thematic test folder mirroring the prompt-cache area (README documents cache-listener coverage). |
| `tests/fixtures/lifecycle/` | 1 | STAY | README: documented fixture group with named consumers. |
| `tests/python/` | 1 | STAY | README: distinct Python toolchain coverage for `scripts/`. |
| `tests/schemas/` | 1 | STAY | Thematic test folder for the `schemas/` contracts. |
| `tests/utils/` | 1 | MERGE->`tests/` | README states it is a regression test, not shared helper code, so the `utils` name misleads. |

Overlapping sibling pairs:
- `lib/utils/` ↔ `lib/shared/` (also `lib/test-helpers/`) — all generic "shared helper" buckets in the same parent.
- `tests/fixtures/` ↔ `tests/__fixtures__/` — two fixture stores under `tests/`.
- `bench/` ↔ `stress-test/` — both performance-testing suites under `runtime/`.
- `data/` ↔ `database/` — both runtime state storage under `runtime/`.
