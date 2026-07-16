# Iteration 003 — correctness / A2 (memory-write & async enrichment)

## Dispatcher
- **Run:** 3 of 20
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness | **Angle:** A2 (memory-write & async enrichment)
- **Budget profile:** verify (target 11-13 tool calls; used 10)
- **Review target:** git range `a9e9bdb0a5^..HEAD`, A2 surface in `system-spec-kit/mcp_server`
- **Session:** `2026-06-05T11:16:17Z` (generation 1, lineageMode new)
- **Parallel-safety:** wrote ONLY `iterations/iteration-003.md` + `deltas/iter-003.jsonl`. Did NOT touch state.jsonl, strategy.md, findings-registry.json, or config.json.

## Files Reviewed
- `mcp_server/handlers/memory-save.ts` — read 2780-2980 + 2535-2712; transaction boundary, `scheduleBackgroundEnrichment` (2860-2897), `markEnrichmentPending` call site (2633), cache-invalidation call sites (198-200, 2704, 2882).
- `mcp_server/handlers/save/enrichment-state.ts` — full read; `markEnrichmentPending` (159-172), `recordEnrichmentResult`/`mapExecutionStatus` (77-95, 174-195), `repairEnrichmentOnReplay` (205-233), `repairIncompleteMarkers` (235-264).
- `mcp_server/handlers/save/post-insert.ts` — read 420-519 + full range diff; `buildExecutionStatus` (435-499), `buildDeferredEnrichmentResult` (new), summaries-step collapse fix.
- `mcp_server/handlers/save/response-builder.ts` — read 488-577 + range diff; `classifySaveErrorCode` (495-533), `extractSaveErrorDetails` (541-552).
- `mcp_server/handlers/mutation-hooks.ts` — cache-invalidation call site (105-113).
- Cross-ref: `lib/storage/lineage-state.ts` (1361-1380, `markMemorySuperseded`/`retirePredecessorForActiveReindex`), `lib/storage/reconsolidation.ts` (518), `lib/search/vector-index-schema.ts` (509), `lib/search/vector-index-mutations.ts` (699-702, 856-859), `lib/search/hybrid-search.ts` (2061), `lib/cognitive/tier-classifier.ts` (494-536), `lib/search/entity-density.ts` (155-164).

## Findings — New

### P0 Findings
None. All A2 P0-candidate hypotheses (partial-write/crash-loss, pre-commit content mutation, exec-status collapse to `complete`) were tested and **refuted by reading the actual transaction boundary and the post-insert.ts hardening** (see Ruled Out).

### P1 Findings
None promoted this iteration. The strongest A2 hypothesis (archived/deprecated skip-gap) downgraded to P2 after counterevidence showed no writer currently persists `importance_tier='archived'` (latent, not live).

### P2 Findings

1. **Background-enrichment inactive-row skip omits the `archived` tier** — `handlers/memory-save.ts:2877` — The deferred-enrichment skip guard tests ONLY `row.importance_tier === 'deprecated'`, but the search layer treats `archived` as an equally-inactive tier: `lib/search/hybrid-search.ts:2061` filters `importance_tier NOT IN ('deprecated', 'archived')` and `lib/cognitive/attention-decay.ts:308` excludes `deprecated` from decay. The skip comment at 2855-2856/2878 explicitly promises it "never repopulates purged entity/graph data for an inactive row," yet an `archived` row would pass the guard and run full `runPostInsertEnrichment` (entity extraction + summary embedding + graph lifecycle), repopulating graph/entity data the search layer deliberately hides. This is a divergence between the *search-active* contract (`('deprecated','archived')` both inactive) and the *enrichment-active* contract (only `deprecated` inactive).
   - Finding class: latent-correctness / contract-divergence
   - Scope proof: declared A2 target file `handlers/memory-save.ts` line 2877; counterevidence in declared cross-ref search layer.
   - Affected surface hints: `handlers/memory-save.ts:2877` (skip guard); ripple to `lib/search/hybrid-search.ts:2061`, `lib/cognitive/attention-decay.ts:308`, `runPostInsertEnrichment` graph/entity writers.
   - Severity rationale (why P2 not P1): No writer in the server currently sets `importance_tier='archived'` (grep across `mcp_server/**` found zero `= 'archived'` writers; `tier-classifier.shouldArchive` returns a boolean only and is not wired to a persisting UPDATE). The defect is dormant until an archiver or migration writes the tier; at that moment it becomes a live data-pollution bug. Recorded as P2 latent with a clear activation trigger.

2. **Stale line-number doc comment for cache-invalidation entry points** — `lib/search/entity-density.ts:156-157` — The doc comment states "Current mutation entry points are memory-save.ts:2583 and memory-bulk-delete.ts:149,256." The actual save-path invalidation call sites are `memory-save.ts:2704` and `:2882` (the `:2583` anchor no longer matches; post-churn drift of 307 lines in memory-save.ts). It also omits the `mutation-hooks.ts:105`, `relation-backfill.ts:581`, and `vector-index-mutations.ts:702,859` entry points that DO call `invalidateEntityDensityCache()`. Misleading maintenance breadcrumb; no runtime effect.
   - Finding class: maintainability / stale-doc-drift
   - Scope proof: declared A2 cache-invalidation surface; line cited in `lib/search/entity-density.ts`.
   - Affected surface hints: `lib/search/entity-density.ts:156-157` comment only; actual callers at memory-save.ts:2704/2882, mutation-hooks.ts:105, relation-backfill.ts:581, vector-index-mutations.ts:702/859.

3. **`classifySaveErrorCode` over-broad substring routing for path-safety errors** — `handlers/save/response-builder.ts:526-528` — The E089 (VALIDATION) branch now matches `lower.includes('access denied') || lower.includes('path must not contain') || lower.includes('traversal')`. `access denied` is a generic substring that can appear in OS-level permission errors (e.g. an EACCES on the DB file, a filesystem ACL message) that are NOT validation failures — those would be misclassified E089 (validation) instead of E081 (catch-all) or a DB code, sending callers down the wrong recovery path ("verify the path/validation" vs "fix permissions"). The DB branch above (511-520) is correctly ordered before this so `sqlite`/`database` errors win, but a bare `EACCES: permission denied, open '<db>'` message containing "denied" but not "access denied" is unaffected, while any message containing the literal "access denied" is captured. Low-frequency, message-shape dependent.
   - Finding class: correctness / error-classification over-broad-match
   - Scope proof: declared A2 target file `handlers/save/response-builder.ts` lines 526-528.
   - Affected surface hints: `response-builder.ts:495-533` classifier ordering; consumers pattern-matching on E089 vs E081/E088 codes; `memory-save.ts:2928,3285,3449,3492` call sites.

## Traceability Checks
- **Iteration number:** JSONL has 2 `type:"iteration"` lines → derived iteration = 3. Matches dispatch. No mismatch.
- **Transaction boundary verified:** `markEnrichmentPending(database, memoryId, ...)` is called at `memory-save.ts:2633` INSIDE the `database.transaction(...)` body (opened 2535, executed via `.immediate()` at 2640). `scheduleBackgroundEnrichment` is called at 2692, AFTER the commit (2640) returns `id`. Confirms charter's core question: **async enrichment defers AFTER commit; it does NOT mutate pre-commit.** Pending-marker is durable in the committed row before any background work begins.
- **Error-code constants verified:** E081 (catch-all), E085 (governance), E086 (embedding), E087 (sqlite_busy), E088 (DB+save-flow), E089 (validation+path-safety) — exact constants read at response-builder.ts:497-532.
- **Cache-invalidation call-site census:** save (memory-save.ts:2704,2882), bulk-delete (memory-bulk-delete.ts:151,258), mutation-hooks (105), relation-backfill (581), vector-index-mutations (702,859). All four declared mutation paths (save/enrichment/backfill/delete) DO invalidate. Charter "incompleteness" hypothesis REFUTED for runtime behavior (the only gap is the stale doc comment, F-A2-02).

## Integration Evidence
- None requiring an external-surface naming claim. All evidence is intra-target code reads within the declared A2 file set + same-module cross-refs (lineage-state, search, cognitive). No command/workflow/skill/MCP-tool/mirror coverage asserted this pass.

## Edge Cases
1. **`deferred` marker is terminal-non-repairable, but the async path never records it** (verification, not a finding): `repairEnrichmentOnReplay` (enrichment-state.ts:213) early-returns for `status==='complete' || 'deferred'` — i.e. a `deferred` marker is treated as a final state and excluded from repair. This would be a crash-safety hole IF the async background path wrote a `deferred` marker. It does NOT: `buildDeferredEnrichmentResult` (post-insert.ts) returns an in-memory `executionStatus.status='deferred'` result that is only handed to `recordEnrichmentResult` in the SYNC branch (memory-save.ts:2701); the async branch (2692-2693) does NOT call `recordEnrichmentResult`, so the persisted marker stays `pending` (set at 2633). A crash during/before the `setImmediate` run leaves a `pending` row, which `repairIncompleteMarkers` (enrichment-state.ts:243 `IN ('pending','partial','failed')`) DOES pick up. Crash-safety chain is intact. Recorded as a near-miss worth re-verifying in adversarial iters if the sync/async branches ever converge on a shared recorder.
2. **`mapExecutionStatus` unknown-status defense** (enrichment-state.ts:88-93): an unrecognized execution status maps to `partial` (repairable), NOT `complete`. This is the explicit fix for the charter's "exec-status collapse" hypothesis and is correct. The summaries-step `summary_not_stored` → `makeFailed` change (post-insert.ts:359-365) closes the same class of collapse. Both are confirmed-clean, not findings.
3. **`access denied` substring risk** (F-A2-03) is message-shape dependent; could not enumerate every throw-site message string within budget. Severity held at P2 pending a message-corpus pass; flagged for traceability iter A7 (error-code contract honesty).

## Confirmed-Clean Surfaces
- **Transaction atomicity (memory-save.ts:2535-2640):** create/supersede/lineage/pending-marker are all inside one `database.transaction().immediate()`; a creation failure rolls back the supersede (comment F1.01 at 2617-2625, verified). Clean for the create+supersede+pending path.
- **Async-enrichment crash recovery:** pending-marker-in-tx (2633) + replay/backfill (`repairIncompleteMarkers`) covers crash-before-background-run. Clean.
- **Entity-density cache invalidation runtime completeness:** all four mutation classes invalidate (see census). Clean at runtime (doc comment stale only).
- **Exec-status collapse defenses:** `mapExecutionStatus` unknown→partial (enrichment-state.ts:88-93) and summaries-not-stored→failed (post-insert.ts:359-365). Clean.

## Ruled Out
- **A2 "async enrichment mutates pre-commit" (P0 candidate):** REFUTED — `markEnrichmentPending` is in-tx (2633); `scheduleBackgroundEnrichment` is post-commit (2692). No pre-commit content mutation of parsed.content by enrichment; quality auto-fix happens in `prepareParsedMemory` BEFORE the write tx, and causal-link resolution runs in the deferred bundle, so there is no "auto-fix mutating content before causal-link resolution" ordering bug in the save path.
- **A2 "exec-status collapse masks a failed step as complete/deferred" (P0 candidate):** REFUTED — `mapExecutionStatus` maps unknown→partial (repairable) and `buildExecutionStatus` rolls failed/partial steps up to failed/partial, never `ran`. The `summary_not_stored`→`makeFailed` diff is a direct fix for this exact collapse.
- **A2 "entity-density cache invalidation incomplete across mutation paths":** REFUTED for runtime — all four paths invalidate. Residual is doc-comment drift only (F-A2-02, P2).
- **A2 "superseded predecessor missed by enrichment skip":** REFUTED — `markMemorySuperseded`/`retirePredecessorForActiveReindex` set `importance_tier='deprecated'` (lineage-state.ts:1380, reconsolidation.ts:518, vector-index-schema.ts:509), which the 2877 skip-check DOES catch. Only `archived` (not currently written) escapes — captured as F-A2-01 (P2 latent).

## Next Focus
- **Dimension:** correctness | **Angle:** A3 (causal/relation-inference).
- **Focus area:** `lib/causal/relation-backfill.ts` (churn 748, largest hotspot) — conflict-guard edge-invalidation incl reciprocal + 3-node transitive contradiction cycles (~670-709), honest-count delta on re-run/upsert (~532-575), dryRun default safety, `causal_unlink` tombstones (`handlers/causal-graph.ts`, `lib/graph/contradiction-detection.ts`).
- **Reason:** Single largest source churn (brand-new 748-line file); A2 found no P0/P1, so risk concentration shifts to the inference engine. F-A2-01 archived-tier latent defect should be carried to A6 (test integrity — is there coverage for archived-row enrichment skip?).
- **Rotation status:** correctness A1 (iter 2) + A2 (iter 3) complete; A3 (iter 4), A4 (iter 5) remaining.
- **Blocked/productive carry-forward:** Productive — F-A2-03 (over-broad `access denied` E089 match) feeds A7 (iter 9, error-code contract honesty). F-A2-01 (archived-tier skip gap) feeds A6 (iter 12, test coverage). Edge case 1 (sync/async marker-recorder convergence) flagged for adversarial iters 14-20.
- **Required evidence (A3):** conflict-guard ordering vs reciprocal-edge invalidation; whether `dryRun` defaults true; honest-count on upsert re-run; tombstone semantics on `causal_unlink`.
