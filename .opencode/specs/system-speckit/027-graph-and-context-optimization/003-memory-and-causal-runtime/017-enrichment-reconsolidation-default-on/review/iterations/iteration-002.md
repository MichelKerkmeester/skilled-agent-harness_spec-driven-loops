# Iteration 2 — correctness — async-enrichment

Dispatch: `gpt-5.5-fast` (variant high) via cli-opencode. Real verdict returned (dispatchOk=true).

Scope: async/deferred post-insert enrichment (commit `0060a097b3`) — `setImmediate` after commit, crash safety, error catching, deferred result shape, request-scoped state, entity-density cache invalidation timing.

**Verdict: CONDITIONAL**

Reviewer-asked checks (a)–(e) outcomes from the evidence:
- (a) Crash safety — PASS: `markEnrichmentPending(database, memoryId, ...)` is inside the write transaction (`memory-save.ts:2632`); a crash before the background run leaves the row pending for replay/backfill.
- (b) Error handling — PASS: the `setImmediate` callback chains `.catch()` and logs via `console.warn` (`memory-save.ts:2699-2701`); no unhandled throw.
- (c) Deferred result shape — see P2 below; structurally valid but lane reasons mislabeled.
- (d) Use-after-return of request-scoped state — captured into `backgroundId`/`backgroundParsed` locals before the callback (`memory-save.ts:2691-2692`); no obvious use-after-return.
- (e) Cache invalidation timing — `invalidateEntityDensityCacheAfterSave()` runs inside the background `.then()` after `recordEnrichmentResult` (`memory-save.ts:2696-2697`), plus a synchronous call at `2714`; sound for the async lane.

## Findings

- **[P1] Async enrichment can mutate a row after it has been superseded** — `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2694`
  - Evidence: The deferred bundle is queued via `const backgroundId = id; const backgroundParsed = routedParsed; setImmediate(() => { runPostInsertEnrichment(database, backgroundId, backgroundParsed) ... })` (2691-2694). It runs outside the save lock and does not re-check that `backgroundId` is still the active/current row before creating entities, causal edges, summaries, or graph lifecycle edges. The surrounding code explicitly purges a predecessor's auto-entity rows on supersede (2662-2664), so a concurrent supersede racing the deferred run can repopulate stale graph/entity data for an already-superseded row.
  - Recommendation: Before background enrichment mutates state, re-read the row and verify it is still the current active row for the logical identity/content hash, or run the background job under the same spec-folder serialization. If the row has been superseded/deprecated, skip enrichment and record a repairable terminal state rather than repopulating stale data.

- **[P2] Async deferred lane reasons are mislabeled as planner-first deferral** — `.opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts:607`
  - Evidence: `buildDeferredEnrichmentResult(reason: PostInsertExecutionReason = 'async-background')` (601-616) sets `executionStatus.reason = 'async-background'`, but populates every lane in `enrichmentStatus` via `makeDeferred()`, and `makeDeferred()` hard-codes `return { status: 'deferred', reason: normalizeEnrichmentSkipReason('planner_first_mode') }` (184-185). So per-lane reasons report `planner_first_mode` while the execution reason is `async-background`.
  - Recommendation: Give async-background deferral its own lane-level reason, or let `buildDeferredEnrichmentResult` pass a lane reason matching the execution reason, so clients inspecting `persistedState`/`enrichmentStatus` do not confuse queued background work with planner-first skipped enrichment.
