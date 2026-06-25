# Playbook Findings Remediation Registry

Remediation of the real product findings surfaced by the daemon-skills playbook validation (packet 011) and the core memory-search-intelligence re-run. Fixes are implemented by gpt-5.5-fast high in an isolated worktree, each verified by vitest plus the alignment-drift and comment-hygiene gates, then committed. Isolation artifacts are excluded.

## Status legend
`todo` pending, `wip` dispatched, `fixed` implemented + verified, `deferred` out of this packet.

## Cluster A. Schema drift (P0) — FIXED
- A1 F11 `source_kind` SELECT in `lib/storage/lineage-state.ts` failed when `memory_index` lacks the column. Guarded the select to emit `NULL AS source_kind` on narrow/legacy schemas via a `PRAGMA table_info` probe. Reconsolidation merge contract test added. Status: fixed.
- A2 F12 adaptive-ranking consumption insert wrote `query_text`; `consumption_log` has only `query_hash`. Aligned the adaptive insert to hash the query and write `query_hash`. Schema contract test added. Status: fixed.
- Verification: `npx vitest run tests/adaptive-ranking-e2e.vitest.ts tests/adaptive-ranking.vitest.ts tests/reconsolidation.vitest.ts` = 3 files, 80 passed. Mutation checks confirm both contract tests fail when the bad column is reintroduced. Real-repo typecheck exit 0. Comment hygiene clean.

## Cluster B. Wiring gaps (P1, dominant theme) — FIXED
- B1 F8 scoring-observability now invoked from the live scoring path (`lib/scoring/composite-scoring.ts`, `handlers/memory-search.ts`). Dedicated invocation test `memory-search-scoring-observability.vitest.ts`. Status: fixed.
- B2 F10 LLM backfill registered at bootstrap (`lib/search/graph-lifecycle.ts`). Structural test `llm-backfill-bootstrap.vitest.ts` fails if registration is dropped. Status: fixed.
- B3 llm-reformulation wired into the deep pipeline (`lib/search/pipeline/stage1-candidate-gen.ts`, `hybrid-search.ts`). Trace test `stage1-llm-reformulation-trace.vitest.ts`. Status: fixed.
- B4 query-surrogates wiring landed in `stage1-candidate-gen.ts`; existing `query-surrogates.vitest.ts` green. Dedicated index-time invocation test still to add. Status: fixed (test follow-up).
- B5 contextual-tree header wired via `applyContextualTreeHeader` + call site in `formatters/search-results.ts`. Dedicated header-by-mode test still to add. Status: fixed (test follow-up).
- Verification: full blast-radius sweep (memory-search, search-results, hybrid-search, stage1, graph-lifecycle, scoring, composite, surrogates, reconsolidation, adaptive) = 47 files, 1165 passed, 0 failed. Comment hygiene clean. Alignment drift 0 errors. gpt-5.5 dispatch was cut at the cap mid-B5 but all five call sites landed; worktree node_modules workspace resolution had to be repaired to run the integration suites.

## Cluster C. retrievalLevel not honored (P1) — FIXED
- C1 `retrievalLevel: local|global|auto` is now honored end to end. Handler/pipeline branch on it (`handlers/memory-search.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`, `types.ts`, `search-utils.ts`); cache keys include retrievalLevel so levels cannot cross-contaminate; omitted defaults to auto. The strict public input schema (`schemas/tool-input-schemas.ts`) was missing the param so strict validation rejected it pre-handler — added the zod field + allow-list entry (closed directly rather than re-dispatching for a two-line mirror gpt-5.5 had correctly flagged as out of its granted scope). Covers dual-level-retrieval and search-pipeline-safety. Status: fixed.
- Verification: retrieval-level + handler + tool-input-schema + memory-search suites = 6 files, 155 passed. Mutation check confirmed the distinguishing test fails when the global branch is disabled. typecheck exit 0. Comment hygiene clean. Follow-up: add an explicit strict-schema-accepts-retrievalLevel assertion.

## Cluster D. Ordering (P1) — FIXED
- D1 F13 folder rank is now the primary sort key, individual score secondary within a folder (`lib/search/folder-relevance.ts`). Test `orders by folder rank before individual score`. Status: fixed.
- D2 channel min-representation now reserves a top-k slot for each active channel's best candidate even below the quality floor, without breaking the floor for the rest (`lib/search/channel-enforcement.ts`, `channel-representation.ts`). Test `reserves top-k slots for active channels even when their best result is below the floor`. Status: fixed.
- Verification: folder-relevance + channel-enforcement + channel-representation + query-router-channel-interaction + feature-eval-query-intelligence = 5 files, 98 passed. Mutation checks confirm both new assertions fail when the fix is reverted. typecheck exit 0. Comment hygiene clean.

## Cluster E. Advisor persistence (P0/P1) — FIXED
- E1 F1 routing re-mapped (deep-research/deep-review to leaf skills, :review:auto to the review leaf, null phrases handled) across `lib/scorer/lanes/*`, `fusion.ts`, `projection.ts`, `skill-graph-db.ts`. Measured top-1 accuracy now 0.92-0.95 (gate 0.92). Status: fixed.
- E2 F2 skill-metadata write path now sanitized by a new `lib/skill-graph/metadata-sanitizer.ts` (rejects traversal, strips instruction-shaped values, bounds paths), wired into `skill-graph-db.ts`. Sanitizer-boundary test added. Status: fixed.
- E3 F3 validate-scorer awaits outcome persistence, un-gates totals from the debug flag, and accepts outcomeEvents in the CLI manifest (`handlers/advisor-validate.ts`, `tools/advisor-validate.ts`, `skill-advisor-cli-manifest.ts`). Status: fixed.
- E4 F4 rollback transaction now also clears lifecycleStatus and redirectTo (`lib/lifecycle/rollback.ts`); test asserts lifecycle-field cleanup. Status: fixed.
- E5 F5 bench now exits non-zero when overall_pass is false (`lib/metrics.ts`); latency itself unchanged (not faked). Status: fixed.
- E6 F6 disabled-hook `--force-native` now errors native-unavailable with a non-zero exit (`scripts/skill_advisor.py`). Status: fixed.
- Verification: routing-parity-deep-skills, skill-graph-db, advisor-validate, lifecycle-derived-metadata, compat/shim, cli-help-aliases-errors = 7 files, 61 passed. tsc exit 0 (direct, tsconfig.build.json). Comment hygiene clean. Security + rollback mutation-checked.

## Cluster F. DB lifecycle (P2)
- F1c cross-process-db-hot-rebinding only reads `.db-updated`; add marker detection/reinit/stats/health. Status: todo.
- F2c db-path-extraction entry points diverge; unify DB-path resolution. Status: todo.
- F3c embedding-retry-orchestrator e2e suite not passing end-to-end. Status: todo.

## Cluster G/H. Code-graph + quality (P2)
- G1 graph-refresh-mode write-local refresh blocker. Status: todo.
- H1 F7 duplicate `normalizeScopeValue`; extract to one shared util. Status: todo.
- H2 F9 stale tests (causal-edges skippedManual, mutation-hooks semantic-trigger-cache). Status: todo.
- H3 F14 entity-extractor dedup uses `toLowerCase().trim()` not `normalizeEntityName()`. Status: todo.
- H4 7-layer-tool-architecture-metadata fails its documented validation surface. Status: todo.

## Excluded as isolation/harness artifacts (not bugs)
causal-stats-empty (clone DB seeded), causal-coverage-under-bulk-save (spec-folder gate), paraphrase-recall (clone embedding), code-intent / adversarial-near-miss (clone index state), trigger-phrase cognitive-null (documented identity-gating, working as intended).
