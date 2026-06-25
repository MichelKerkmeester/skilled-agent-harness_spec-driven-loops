# Playbook Findings Remediation Registry

Remediation of the real product findings surfaced by the daemon-skills playbook validation (packet 011) and the core memory-search-intelligence re-run. Fixes are implemented by gpt-5.5-fast high in an isolated worktree, each verified by vitest plus the alignment-drift and comment-hygiene gates, then committed. Isolation artifacts are excluded.

## Status legend
`todo` pending, `wip` dispatched, `fixed` implemented + verified, `deferred` out of this packet.

## Cluster A. Schema drift (P0) — FIXED
- A1 F11 `source_kind` SELECT in `lib/storage/lineage-state.ts` failed when `memory_index` lacks the column. Guarded the select to emit `NULL AS source_kind` on narrow/legacy schemas via a `PRAGMA table_info` probe. Reconsolidation merge contract test added. Status: fixed.
- A2 F12 adaptive-ranking consumption insert wrote `query_text`; `consumption_log` has only `query_hash`. Aligned the adaptive insert to hash the query and write `query_hash`. Schema contract test added. Status: fixed.
- Verification: `npx vitest run tests/adaptive-ranking-e2e.vitest.ts tests/adaptive-ranking.vitest.ts tests/reconsolidation.vitest.ts` = 3 files, 80 passed. Mutation checks confirm both contract tests fail when the bad column is reintroduced. Real-repo typecheck exit 0. Comment hygiene clean.

## Cluster B. Wiring gaps (P1, dominant theme)
- B1 F8 scoring-observability logger implemented + unit-tested but never invoked by the live `memory_search` pipeline. Wire it in. Status: todo.
- B2 F10 LLM backfill registrar defined + exported but never called at bootstrap. Register it in `context-server.ts` startup. Status: todo.
- B3 llm-reformulation `d2-llm-reformulation` channel not executing in `mode:"deep"`. Wire it into the deep pipeline. Status: todo.
- B4 query-surrogates generated but index-time storage not wired in production (`SPECKIT_QUERY_SURROGATES`). Wire index-time storage. Status: todo.
- B5 contextual-tree-injection enabled-mode `[parent > child — description]` header not emitted by live `memory_search`. Wire it. Status: todo.

## Cluster C. retrievalLevel not honored (P1)
- C1 `retrievalLevel: local|global|auto` documented in `tool-schemas.ts` but the runtime handler ignores it. Wire the handler to the enum. Covers dual-level-retrieval and search-pipeline-safety. Status: todo.

## Cluster D. Ordering (P1)
- D1 F13 `twoPhaseRetrieval()` sorts by individual score, not folder rank. Make folder rank the primary sort key. Status: todo.
- D2 channel-min-representation strict top-k per-channel representation not guaranteed (only `score >= QUALITY_FLOOR` promoted). Guarantee >=1 per active channel. Status: todo.

## Cluster E. Advisor persistence (P0/P1)
- E1 F1 routing accuracy 0.889 < 0.92 gate. Re-map deep-research/deep-review/:review:auto trigger phrases. Status: todo.
- E2 F2 input-sanitization gap on the skill-metadata write path (security). Reuse the edge sanitizer. Status: todo.
- E3 F3 validate-scorer regression (await persist, un-gate totals, accept outcomeEvents). Status: todo.
- E4 F4 rollback non-atomic (include lifecycleStatus/redirectTo in the transaction). Status: todo.
- E5 F5 warm p95 63 > 50ms; make the bench exit non-zero on overall_pass false. Status: todo.
- E6 F6 disabled force-native returns exit 0; should error native-unavailable. Status: todo.

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
