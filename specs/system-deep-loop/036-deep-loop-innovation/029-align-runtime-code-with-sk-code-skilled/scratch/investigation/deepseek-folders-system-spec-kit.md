| folder | code files | verdict | reason |
|---|---|---|---|
| `runtime/api/` | 2 (`index.ts`, `graph-refresh.ts`) | STAY | README: the supported `@spec-kit/runtime/api` import surface / package boundary. |
| `runtime/core/` | 1 (`config.ts`) | STAY | README: shared path/limit dependency root other layers import instead of recomputing. |
| `runtime/handlers/save/` | 1 (`spec-folder-mutex.ts`) | STAY | README: owns the save-path mutex, exposed via `api/index.ts`; distinct guard. |
| `runtime/lib/config/` | 2 (`capability-flags.ts`, `spec-doc-paths.ts`) | STAY | MODULE-MAP: dependency root (canonical spec-doc names, capability flags). |
| `runtime/lib/context/` | 1 (`shared-payload.ts`) | STAY | README: owns the typed shared-payload/provenance contract consumed by hooks. |
| `runtime/lib/continuity/` | 2 | STAY | MODULE-MAP: owns thin continuity record + authored snapshot. |
| `runtime/lib/discovery/` | 1 (`spec-document-finder.ts`) | STAY | README: deliberate lib seam so `lib/` imports inward instead of into `handlers/`. |
| `runtime/lib/extraction/` | 2 (`entity-extractor.ts`, `entity-denylist.ts`) | STAY | MODULE-MAP: owns rule-based entity extraction and its denylist. |
| `runtime/lib/hooks/` | 1 (`completion-evidence-sentinel.cjs`) | MERGE->`runtime/hooks/lib/` | Both are runtime-neutral hook policy cores; the `lib/hooks` vs `hooks/lib` split is reversed and confusing. |
| `runtime/lib/parsing/` | 1 (`content-normalizer.ts`) | STAY | MODULE-MAP: markdown normalizer dependency root; no domain imports. |
| `runtime/lib/resume/` | 1 (`resume-ladder.ts`) | STAY | MODULE-MAP: sole owner of the resume ladder. |
| `runtime/lib/search/` | 1 (`folder-discovery.ts`) | STAY | README: owns `description.json` discovery lifecycle; name is historical, not a retrieval engine. |
| `runtime/lib/spec/` | 1 (`is-phase-parent.ts`) | STAY | README: single-source-of-truth phase-parent detection rule. |
| `runtime/lib/templates/` | 1 (`level-contract-resolver.ts`) | STAY | MODULE-MAP: sole owner of level-contract resolution. |
| `runtime/lib/test-helpers/` | 1 (`env-snapshot.ts`) | STAY | README: test-only helper kept out of production modules. |
| `runtime/hooks/lib/spec-gate/` | 2 (`spec-gate-core.mjs`, `spec-gate-core.test.mjs`) | STAY | README: the runtime-neutral Gate-3 policy core every adapter calls; package boundary. |
| `runtime/hooks/lib/workspace/` | 1 (`repo-root.mjs`) | STAY | Exported package subpath (`./hooks/lib/workspace/repo-root.mjs` in `package.json`); package boundary. |
| `runtime/hooks/pi/lib/` | 1 (`claude-hook-adapter.ts`) | STAY | README: shared Pi→Claude dist proxy; resolved via `.pi/extensions/lib` symlink. |
| `runtime/hooks/opencode/` | 1 (`system-spec-gate.js`) | STAY | Runtime adapter matching sibling `hooks/claude|codex|cursor|devin|pi`; no README present. |
| `runtime/cli/config/` | 1 (`index.ts`) | STAY | README: documented dependency-breaking barrel (`extractors/loaders -> config -> core/config`). |
| `runtime/cli/graph/` | 2 (`backfill-graph-metadata.ts`, `migrate-generated-json.ts`) | STAY | README: CLI metadata backfill/migration entrypoints. |
| `runtime/cli/loaders/` | 2 (`data-loader.ts`, `index.ts`) | STAY | README: script-side ingestion layer for context generation. |
| `runtime/cli/metrics/` | 1 (`fable-metrics.cjs`) | STAY | README: read-only fable-5 behavioral efficiency reader consumed by `/doctor`. |
| `runtime/cli/pi/` | 2 (`sync-agents-pi.cjs`, `sync-prompts-pi.cjs`) | STAY | README: Pi mirror generators; siblings of `cli/codex`, `cli/hermes`. |
| `runtime/cli/resource-map/` | 1 (`extract-from-evidence.cjs`) | STAY | README: owns `emitResourceMap` ledger builder. |
| `runtime/cli/sweep/` | 1 (`strict-pass-freshness.ts`) | STAY | README: strict-pass freshness CI gate; distinct entrypoint. |
| `runtime/cli/templates/` | 2 (`inline-gate-renderer.ts`, `.sh`) | STAY | README: owns the inline gate renderer + shell wrapper. |
| `runtime/cli/hermes/tests/` | 1 (`sync-skills-hermes.test.mjs`) | MERGE->`runtime/cli/tests/` | cli has a central `tests/` root; a per-module single-test subfolder duplicates that layout. |
| `runtime/tests/__helpers__/` | 1 (`test-env.ts`) | STAY | Shared test helper folder for the runtime suite. |
| `runtime/tests/adversarial/` | 1 (`compact-prime-identity-race.vitest.ts`) | STAY | README: this folder owns security/race-sensitive adversarial tests. |
| `runtime/tests/deep-loop/` | 1 (`review-depth-reducer.vitest.ts`) | MERGE->`runtime/tests/` | Parent already hosts ~100 flat `*.vitest.ts` files; a single test adds inconsistent nesting. |
| `runtime/tests/graph/` | 1 (`graph-metadata-lineage.vitest.ts`) | MERGE->`runtime/tests/` | Same flat-suite convention as the parent. |
| `runtime/tests/_support/hooks/` | 1 (`replay-harness.ts`) | STAY | Support harness for `tests/_support`, not a production seam. |
| `runtime/tests/embedders/__fixtures__/` | 1 (`hf-model-server-shutdown-harness.cjs`) | STAY | `__fixtures__` convention; harness for the sibling embedders tests. |
| level-4/5 fixture trees (`runtime/cli/tests/fixtures/*`, `runtime/cli/test-fixtures/*`, `runtime/tests/*/fixtures`, `runtime/cli/optimizer/audit/promotion-reports`) | UNKNOWN | UNKNOWN | Not individually enumerated; sampled folders held only `.json`/`.md`/`.jsonl` fixtures or were empty. |

Overlapping sibling pairs:
- `runtime/data/` ↔ `runtime/database/` — both data holders; `database/` holds a single `access-telemetry.json`.
- `runtime/lib/search/` ↔ `runtime/lib/discovery/` — `search/README.md` states it "is a discovery module, not a retrieval engine."
- `runtime/lib/utils/` ↔ `runtime/lib/test-helpers/` — `utils` vs `helpers` naming overlap.
- `runtime/cli/runtime/` ↔ `runtime/cli/runtime-mirrors/` — both are generated mirror/dist trees.
- `runtime/lib/hooks/` ↔ `runtime/hooks/lib/` — identical words, swapped order; both are runtime-neutral hook-policy cores.
- `runtime/cli/config/` ↔ `runtime/cli/core/` — config barrel (`config/index.ts`) vs canonical `core/config.ts`.
- `runtime/shared/` ↔ `runtime/dist/` — `runtime/shared/` is a byte-for-byte duplicate of `system-spec-kit/shared/dist/` (verified by identical listings), i.e. build output nested in source.
