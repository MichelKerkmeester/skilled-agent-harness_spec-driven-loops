---
title: "Tasks: Manual Playbook Sweep Findings Remediation [template:level_2/tasks.md]"
description: "One task per confirmed FAIL finding; Phase 1 (plan) done per-finding as discovered, Phase 2 (fix) deferred to a future implementation session."
trigger_phrases:
  - "playbook sweep findings remediation tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Manual Playbook Sweep Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description (scenario id / file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Plan (done incrementally as the sweep confirms findings)

- [x] T001 Scaffold this remediation packet (spec.md, plan.md, tasks.md, checklist.md)
- [x] T002 Draft root-cause hypothesis + fix direction for the 26 findings confirmed as of manifest 170/485 done
- [ ] T003 [P] Append new finding entries as the sweep confirms more FAILs (recurring, not a one-time task)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix (deferred — one task per finding, not yet started)

> **Process note (2026-07-02)**: 0030 and 0033 both self-reported `VERDICT: FIXED` with an empty `git diff`. Root cause was NOT dispatcher/edit-persistence failure (independently ruled out via a controlled diagnostic dispatch on an untracked scratch file, which persisted correctly). Both findings' underlying bugs were already fixed by unrelated prior packets (029, 030) that landed in this repo before the fix dispatcher ran — the dispatch contract's OUTPUT CONTRACT lacked an `ALREADY_CORRECT` verdict tag distinct from `FIXED` (implying a change was made), so the model reused the closest label. **Going forward**: an empty `git diff` on a `FIXED` verdict is not automatically a failure — read the dispatch's own reasoning log before reclassifying; if it cites specific existing code matching the fix, treat as `ALREADY_CORRECT` (done, evidence-backed) rather than `[B]` blocked/retry.

- [x] T-0003 Fix BM25 re-index gate trigger-mutation detection (0003) — FIXED: added getBm25EngineStatus() check so syncChangedRows/retry-manager only treat 0-synced-rows as a real problem when the in-memory engine was actually warm, not when it's a no-op. Verified via git diff (19 insertions/4 deletions across bm25-index.ts + retry-manager.ts)
- [x] T-0004 Restore bounded-graph trace fields in result envelope (0004) — FIXED: added maxDepth/depth/path/paths/seedIds/reachedIds/bounded to MemoryResultTrace + sanitizer helpers in search-results.ts (36 insertions), verified via git diff
- [x] T-0015 Fix trigger-phrase cache reload/index (0015) — FIXED: added `trigger_phrases IS NOT NULL AND != '[]' AND != ''` filter to TRIGGER_CACHE_LOADER_SQL in trigger-matcher.ts (3 insertions). Verified via git diff
- [x] T-0016 Fix `memory_context` specFolder/intent mismatch (0016) — FIXED: gated resume-mode inference behind `!explicitIntent` in resolveEffectiveMode() (memory-context.ts, 3 lines). Verified via git diff
- [x] T-0030 Fix `memory_list` filter/specFolder path (0030) — RECLASSIFIED, ALREADY CORRECT: dispatch's `git diff` was empty because `buildSpecFolderCandidates()` (memory-crud-list.ts:36-60) plus the `spec_folder = ? OR spec_folder LIKE ?candidate/%'` predicate (line 158-165) already implements the exact specs-root-relative-vs-`.opencode/specs/`-prefixed fallback the finding described. Landed in commit `caeb3f61e1` (packet 030, "land phase 011, deep-review remediation, and dist-freshness enforcement") — predates this session's fix dispatcher. Verified via direct read + `git blame`. No code change needed; original sweep FAIL was stale relative to already-shipped packet-030 work.
- [ ] T-0032 [B] Re-verify `session_health` with daemon warm before fixing (0032) — blocked on confirming this isn't the recurring env gap
- [x] T-0033 Fix `session_resume` phase-parent redirect ordering (0033) — RECLASSIFIED, ALREADY CORRECT: `synthesizeResult()` (resume-ladder.ts:804-818) already spreads `...(phaseParent ? { phaseParent } : {})` as the FIRST key in the result object, ahead of `source`/`summary`/child-continuity fields. Landed in commit `4913ddf6f9` (packet 029, "phase-parent resume redirect"). Verified via direct read + `git blame`. No code change needed; original sweep FAIL was stale relative to already-shipped packet-029 work.
- [x] T-0039 Fix `detectRuntimeMismatch` count/assertion drift (0039) — ALREADY_CORRECT: implementation (startup-checks.ts:47-55) and focused test (startup-checks.vitest.ts:53-63) already agree (checks only ABI/platform/arch, expects exactly `['platform','architecture']`). Verified via `npm test -- --run tests/startup-checks.vitest.ts -t detectRuntimeMismatch` (1 passed) + empty `git diff`. No change needed.
- [x] T-0040 Fix spec-doc exclusion under `qualityGateMode: 'warn-only'` (0040) — FIXED: memory-index.ts's `runIndexScan` now unions `specDocFiles`+`graphMetadataFiles` into `specDocKeySet`, collects unchanged spec docs into `returnedUnchangedSpecDocs`, and merges them into the returned `files` array instead of silently dropping them (30 insertions/1 deletion). Verified via git diff.
- [x] T-0048 Fix needs-rebuild sentinel not clearing on successful boot rebuild (0048) — FIXED: `repairNeedsRebuildSentinel()` (checkpoints.ts) now re-checks `hasNeedsRebuildSentinel()` after `clearNeedsRebuildSentinelForDatabase()` and returns an explicit error state if the sentinel is still present instead of trusting the clear call silently succeeded. `context-server.ts` needed no change (already consumes the repair result correctly). Verified via git diff (10 insertions).
- [ ] T-0056 [B] Add `scope` to `memory_causal_stats` accepted parameters, or correct scenario expectation (0056) — NEEDS_MORE_INFO: dispatch found the real rejecting schema lives outside its allowed write paths (`mcp_server/handlers/**/*.ts` was too narrow) and correctly stopped rather than making a speculative handler-only change. Needs a follow-up dispatch with the actual schema file in scope.
- [x] T-0059 Fix `memory_get_learning_history` over-filtering (0059) — ROOT_CAUSE_DIFFERENT, FIXED: real bug was raw `spec_folder = ?` exact-match over-filtering in session-learning.ts's `handleGetLearningHistory` (same class as 0030, different file). Added `buildSpecFolderCandidates()`/`buildSpecFolderWhereClause()` mirroring 0030's pattern, applied to both the history query and the summary aggregate query. Verified via git diff (43 insertions/4 deletions).
- [ ] T-0062 [B] Re-run scenario with stricter evidence requirement before proposing a fix (0062)
- [x] T-0064 Fix eval reporting dashboard 0-eval-runs issue (0064) — FIXED: `getDb()` in reporting-dashboard.ts was falling through to `initEvalDb()` with no dir override, defaulting to the empty compiled `dist/database/speckit-eval.db` shadow instead of the real `mcp_server/database/speckit-eval.db` (9 metric snapshots, 808 channel rows, 930 queries). Added `resolveDefaultEvalDbDir()` to detect dist-vs-source and point at the real package database dir. Verified: dispatch's own before/after query counts (0 runs from dist DB -> 2 runs/2 sprint groups from real DB), `npm run typecheck` passed, 58 vitest tests passed, git diff confirmed (16 insertions/1 deletion).
- [x] T-0074 Replace remaining unsafe `Math.max/min` spread call sites (0074) — FIXED: replaced remaining `Math.max(...arr)`/`Math.min(...arr)` spreads with reduce-based extrema across 6 production files (shadow-evaluation-runtime.ts, rank-metrics.ts, k-value-analysis.ts, composite-scoring.ts, graph-lifecycle.ts, intent-classifier.ts) + 11 test files. Verified via git diff (26 files touched total across the wave, cross-checked each against every dispatch's own self-reported file list to isolate this fix's real scope — see process note below), `npm run typecheck` passed, 336+3 targeted vitest passed, scoped ESLint passed.
- [x] T-0077 Fix sha-256 dedup lookup predicate (canonical-path resolution before dedup check) (0077) — FIXED: create-record.ts's `findSamePathExistingMemory` replaced the `(canonical_file_path = ? OR file_path = ?)` OR-shape with `COALESCE(NULLIF(canonical_file_path, ''), file_path) = ?` (single resolved path before comparing), refactored scope matching into `buildScopeWhereClauses`, and fixed an anchor_id NULL/empty-string comparison inconsistency. Added a divergent-alias regression test. Verified via git diff (59 lines changed).
- [x] T-0079 Fix inert/active logger-gate toggle default (0079) — FIXED: `isConsumptionLogEnabled()` in consumption-logger.ts now requires `SPECKIT_CONSUMPTION_LOG` to explicitly equal `'true'`/`'1'` before consulting `isFeatureEnabled()`, instead of defaulting to graduated-ON. Verified via git diff (8 lines changed) — legitimate, narrow fix.

> **Process note (2026-07-02, wave-1 rerun)**: cross-checking every file in this wave's combined diff against each dispatch's own self-reported file list surfaced 2 files with unattributed content — `mcp_server/tests/generated-metadata-integrity.vitest.ts` (32 insertions) and `mcp_server/tests/graph-metadata-schema.vitest.ts` (53 insertions). Neither appears in 0074/0077/0079's own claimed file lists; 0074's own dispatch log explicitly noted "I observed other dirty files under mcp_server that were not part of this patch; I'm leaving them untouched." Content matches the unrelated, still-unimplemented 011-create-sh-parent-corruption-fix/012-derive-status-explicit-bypass-fix packets (references "T2-P1-002", "gpt-followup-audit"). A genuinely separate concurrent session (PID 53528/53522, distinct session ID, working a `deep-loops` packet) was also confirmed running in this same repo — most likely origin. These 2 files were deliberately excluded from every commit in this batch; not ours to commit.
- [x] T-0085 Wire eval DB write path for `memory_search`/`memory_context` events (0085) — ALREADY_CORRECT: both handlers already call `logSearchQuery`/`logFinalResult`/`logChannelResult` (memory-search.ts:1073,1780,1790; memory-context.ts:1625,2055,2067), writing into `eval_queries`/`eval_channel_results`/`eval_final_results` via eval-logger.ts. Verified via `npx vitest run tests/memory-search-eval-channels.vitest.ts tests/memory-context-eval-channels.vitest.ts tests/eval-logger.vitest.ts` (34 passed) + empty git diff on allowed paths. No change needed.
- [ ] T-0087 [B] Re-run int8 quantization benchmark, update no-go decision record (0087) — NEEDS_MORE_INFO: dispatch found current data refutes a simple no-go reaffirmation, but the canonical decision record lives outside the allowed write paths (`.opencode/specs/**/*.md` was too broad/wrong target). Needs a follow-up dispatch with the exact decision-record path and the refuting data summarized in the brief.
- [x] T-0110 Fix `SPECKIT_GRAPH_UNIFIED` Stage-2 flag propagation/cache invalidation (0110) — ROOT_CAUSE_DIFFERENT, FIXED: real bug was `buildCacheArgs()` in search-utils.ts not including the flag's live state in the cache key, so a toggle didn't invalidate a cached computation. Added `graphUnifiedEnabled: isGraphUnifiedEnabled()` to the cache-key args. Verified via git diff (2 lines: import + key field) — matches the Group A shared flag-propagation pattern.
- [x] T-0113 Fix adaptive-ranking `adaptiveShadow` proposal emission gate (0113) — ROOT_CAUSE_DIFFERENT, FIXED: real bug was `buildAdaptiveShadowProposal` sometimes receiving result IDs as numeric strings, which silently missed the number-keyed signal-delta lookup, so recorded adaptive deltas never applied. Added `normalizeAdaptiveMemoryId()` to coerce/validate IDs before all downstream lookups. Verified via git diff (26 lines changed, single file).
- [x] T-0126 Correct scenario doc's stale Vitest baseline count (350 → current), confirm no real regression first (0126) — DOC_FIX: updated stale baseline 350->365 in scoring-and-fusion-corrections.md (test suite grew, no regression). Verified via git diff.
- [x] T-0129 Fix Stage-2 score sync for non-hybrid path / confirm routing (0129) — FIXED: requests weren't mis-routed (isHybrid correctly derives from config.searchType), but `syncScoreAliasesInPlace` in stage2-fusion.ts only synced rows with a finite `row.score`, leaving `intentAdjustedScore` unset for vector/non-hybrid rows whose score resolved via `similarity`/`rrfScore` instead. Now falls back through `resolveEffectiveScore`. Verified via git diff (single file, 6 lines) + typecheck/vitest/eslint passed per dispatch log.
- [x] T-0133 Apply `QUALITY_FLOOR` as a hard filter before min-representation selection (0133) — FIXED: `analyzeChannelRepresentation` in channel-representation.ts now pre-filters each channel's results to `score >= QUALITY_FLOOR` before determining under-represented channels and promotion candidates, so sub-floor results (0.004/0.001) can no longer force a representation slot. Updated matching doc comments in channel-enforcement.ts. Verified via git diff (both files).
- [x] T-0134 Wire `confidenceTruncation` trace metadata into real query execution path (0134) — ROOT_CAUSE_DIFFERENT, FIXED: real gap was `executePipeline` (orchestrator.ts) never calling `truncateByConfidence` at all on the real query path, only exercised in synthetic tests. Now calls it when `isConfidenceTruncationEnabled()`, builds `ConfidenceTruncationMetadata` (new type in types.ts), attaches it per-row via `traceMetadata`, records it in `PipelineResult.metadata.confidenceTruncation`, and adds a trace entry. Verified via git diff (orchestrator.ts + types.ts, both within 0134's own allowed paths).
- [x] T-0156 Gate `encoding_intent` writes behind first-time-index check in `indexMemoryDeferred` (0156) — FIXED: one-argument-order flip in vector-index-mutations.ts, `COALESCE(?, encoding_intent)` (incoming value always wins) -> `COALESCE(encoding_intent, ?)` (existing value wins, only fills when unset). Added regression test (encoding-intent.vitest.ts, 40 lines). Verified via git diff.
- [x] T-0174 Fix `E_SESSION_SCOPE` on `memory_context` folder-routing check (0174) — FIXED: `handleMemoryContext` was always setting `options.sessionId = effectiveSessionId` even when no session was actually requested, tripping session-scoped routing unintentionally. Now gated behind `requestedSessionId` truthiness. Verified via git diff (4 lines, memory-context.ts) + test update.
- [x] T-0175 [P0] Fix `vec_memories`/`vec_768` dual-write desync and blob-encoding mismatch (0175) — FIXED, verified by direct diff read (not just trusting the verdict): reindex.ts unified `writeVectors`/`writeVectorsToKnn` into one `writeVectorsToShardTables()` running BOTH inserts inside a single `db.transaction()`, using the same `to_embedding_buffer(embedding)` result for both `vec_<dim>` and `vec_memories` (previously two separate transactions, the root cause of the row-count desync). factory.ts's shard-fallback filename now uses `createProfileSlug(provider, manifest.name, dim)` — the same slug function real shard creation uses — instead of raw unsanitized name interpolation, fixing lookup failures for names with special characters (e.g. `nomic-embed-text:v1.5`). Dispatch ran typecheck + 5 targeted tests but did NOT re-run the original finding's KNN self-match distance check directly; compensated by reading the full diff myself given this is P0 data-integrity code.
- [x] T-0176 Fix quality-check retry loop not honoring `maxRetries` override (0176) — ROOT_CAUSE_DIFFERENT, FIXED: `runQualityLoop` (quality-loop.ts) had an early `break` that ended the retry loop after the first attempt where `fixResult.fixed.length === 0`, regardless of `maxRetries`. Removed the break so the loop runs the full configured retry count. Updated quality-loop.vitest.ts. Verified via git diff (4-line removal + test update).
- [x] T-0183 Fix DB hot-rebinding: invalid tier "scratch" + missing `.db-updated` marker + degraded health (0183) — ROOT_CAUSE_DIFFERENT, FIXED, both parts: (1) `scratch` was never a valid tier (confirmed against both CLI/MCP tier allowlists) — corrected the scenario doc to use the real tier `temporary`, code untouched. (2) The marker-detection/rebind path already existed correctly; the real gap was the standalone `bulk-delete` CLI command never writing `DB_UPDATED_FILE` after mutating. Added `notifyDatabaseUpdated()` to cli.ts, called after a successful delete. Verified via git diff (cli.ts + scenario doc) + typecheck/eslint/5 vitest tests passed per dispatch log.
- [x] T-0185 [P0] Audit/fix DB-path construction so all consumers use the shared resolver (0185) — ROOT_CAUSE_DIFFERENT, FIXED, verified by direct diff read (not just trusting the verdict): confirmed root cause was narrower than the brief — eval consumers derived their default DB *directory* independently instead of directly duplicating `context-index.sqlite` construction. eval-db.ts now resolves via `resolveDatabasePaths()` (core/config.ts, the canonical resolver) both at module load and per-call instead of independent env-var precedence logic; reporting-dashboard.ts's dist-vs-source workaround (0064's earlier narrower patch) was consolidated into this same fix and simplified back to a plain `initEvalDb()` call; memory-state-baseline.ts replaced `resolveActiveProfileDbPath()` + a duplicate MEMORY_DB_PATH check with the same canonical resolver. 33 targeted tests + typecheck + alignment drift passed per dispatch log.
- [x] T-0188 Confirm embedding model catalog change is intentional; fix scenario doc or revert (0188) — DOC_FIX: confirmed via grep of shared/embeddings/registry.ts that the model-default change (nomic-embed-text-v1.5 / nomic-ai/nomic-embed-text-v1.5) is intentional and current; corrected the scenario doc's stale expected IDs (unsloth/bge-base-en-v1.5-GGUF, onnx-community/bge-base-en-v1.5-ONNX) and flipped its verdict FAIL->PASS. Also resolves the recurring doc-model-refs drift advisory seen on every prior commit in this batch. Verified via git diff.
- [x] T-0190 Confirm shadow-period gate is working-as-designed or misconfigured for learned-trigger persistence (0190) — DOC_FIX: confirmed working-as-designed (intentional 7-day log-only shadow period before triggers apply). Corrected scenario doc's Expected/Pass-Fail sections to require `reason: "shadow_period"` as the correct outcome instead of immediate persistence; flipped verdict FAIL->PASS. Verified via git diff.
- [x] T-0192 Remove remaining V1 pipeline code path and `isPipelineV2Enabled()` flag check (0192) — ROOT_CAUSE_DIFFERENT, FIXED: the executable V1 path and `isPipelineV2Enabled()` were already fully removed; the scenario's "V1 references" hits were stale comments referencing the already-deleted code. Removed the dead comments from memory-search.ts and pipeline-v2.vitest.ts. Verified via git diff — comment-only change, no behavior change.
- [ ] T-0193 [B] Re-verify lineage backfill rollback drill with fuller evidence capture (0193)
- [ ] T-0194 [B] Re-verify lineage state asOf/projection coverage with fuller evidence capture (0194)
- [ ] T-0200 Fix `ENABLE_BM25` default-enabled inversion in `bm25-index.ts` (0200)
- [ ] T-0205 Fix `SPECKIT_STRICT_SCHEMAS=false` not relaxing strict validation in `tool-schemas.ts` (0205)
- [ ] T-0208 [B] Investigate tri-daemon respawn-lock/reap-divergence before fixing (0208) — needs careful multi-daemon lifecycle tracing first
- [ ] T-0211 Fix causal boost never applying despite default-on -- check shared Group A flag-reading root cause first (0211) — queued for next fix-dispatch round, not yet in the running batch
- [ ] T-0212 Fix community-search fallback never surfacing despite default-on -- check shared Group A flag-reading root cause first (0212) — queued for next fix-dispatch round, not yet in the running batch

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (deferred to Phase 2 completion)

- [ ] T900 Re-run each fixed scenario's own playbook file to confirm PASS
- [ ] T901 Run the affected subsystem's Vitest suite with each fix, confirm no regressions
- [ ] T902 Update this packet's `implementation-summary.md` with final fix outcomes

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1 findings have a Phase 2 fix task
- [ ] No `[B]` blocked tasks remaining (0032, 0062 currently blocked pending re-verification)
- [ ] All Phase 2 tasks either `[x]` fixed-and-verified or explicitly deferred with operator approval
- [ ] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent packet (sweep execution)**: See `../tasks.md`

<!-- /ANCHOR:cross-refs -->
