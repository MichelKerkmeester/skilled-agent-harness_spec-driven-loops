---
iteration: 034
rq: RQ-N5
phase_target: 006-write-path-reconciliation
newInfoRatio: 0.72
verdict: ADAPT
---

# Iteration 034 — RQ-N5: 012 Causal Routing Impact on Phase 006 Statediff Scope

## Research Question

What did commit d232da4ee (012-causal-graph-channel-routing) ship that is relevant to statediff reconciliation? Specifically: (A) which new handler branches or routing paths were added? (B) Are there new scattered post-mutation hooks that phase 006 should absorb? (C) How does the new causal channel routing model interact with the desired/prior statediff approach? Produce a revised scope for phase 006.

---

## Evidence Gathered

### A. What the 012 Commit Shipped

The 012 packet (spec at `002-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp/`) was **purely additive** at the handler level. The changelog at `001-deliver-causal-graph-channel-routing-mvp/changelog.md` (section "Fixed") states: "No fixes recorded — this packet is purely additive."

The four concrete additions are:

**1. `shouldPreserveGraph` routing override in `query-router.ts`**
`lib/search/query-router.ts:228–254` — new function `shouldPreserveGraph(query, db, precomputedIntent)` returning `GraphPreservationDecision`. Called from `routeQuery()` at `query-router.ts:406–416` to inject `graph` and `degree` channels for simple/moderate tiers when intent is `find_spec`/`find_decision` or entity-density fires.

**2. `entity-density.ts` module — new post-mutation cache hook target**
`lib/search/entity-density.ts:159–163` — exports `invalidateEntityDensityCache()`. The module docstring at line 9 explicitly lists "via `invalidateEntityDensityCache()`" as the manual invalidation path alongside a 60s TTL. This cache is populated from `causal_edges` (rows with ≥3 outgoing edges) and drives the `graph-preserved-by-entity-density` routing reason.

**3. `routing-telemetry.ts` — new module, no post-mutation hooks**
`lib/search/routing-telemetry.ts` — rolling 200-decision ring buffer. Purely read-path (consumed by `memory_health`). No write-side hooks.

**4. P1-C-001 fix (002-remediation phase)** — `invalidateEntityDensityCache()` was wired into two handler post-commit paths as part of the deep-review remediation (002 phase, closed 2026-05-11):
- `handlers/memory-save.ts:181–192` — `invalidateEntityDensityCacheAfterSave()` wrapper, called at `memory-save.ts:2637` after `runPostInsertEnrichmentIfEnabled`.
- `handlers/memory-bulk-delete.ts:30–32` — `invalidateEntityDensityCacheAfterBulkDelete()`, called at lines 151 and 258.

These are **inline post-commit calls**, not wired through `runPostMutationHooks`. They are therefore invisible to the `MutationHookResult` contract and to `buildMutationHookFeedback`.

### B. New Scattered Post-Mutation Hooks That Phase 006 Should Absorb

Before 012, `mutation-hooks.ts` had four cache-clear branches: `triggerMatcher.clearCache()`, `toolCache.invalidateOnWrite()`, `clearConstitutionalCache()`, and `clearGraphSignalsCache()` + `clearDegreeCache()`.

After 012 + remediation, two new scattered invalidation sites were added **outside** `runPostMutationHooks`:

**B1. Entity-density cache — `memory-save.ts:2637`**
`handlers/memory-save.ts:2637` — `invalidateEntityDensityCacheAfterSave()` is called inline after post-insert enrichment. It is gated only on successful insert (lines 2631–2637), not on the `shouldEmitPostMutationFeedback` flag at line 3358. This means it fires on every non-duplicate save, independently of whether post-mutation feedback is reported.

**B2. Entity-density cache — `memory-bulk-delete.ts:151,258`**
`handlers/memory-bulk-delete.ts:151,258` — two separate callsites, one inside the `deleteSingle` path and one at the end of the handler. Both call `invalidateEntityDensityCacheAfterBulkDelete()` at line 32.

**B3. Co-activation cache — `mutation-hooks.ts:83–95`**
`handlers/mutation-hooks.ts:83–95` — `clearRelatedCache()` from `lib/cognitive/co-activation.js` was added (imported at line 8). The `MutationHookResult` type at `memory-crud-types.ts:100` gained `coactivationCacheCleared: boolean` to report it.

**B4. Degree cache — `mutation-hooks.ts:71`**
`handlers/mutation-hooks.ts:71` — `clearDegreeCache()` from `lib/search/graph-search-fn.js` was added alongside `clearGraphSignalsCache()` (line 70). Both are called in the same try block.

**B5. `mutation-feedback.ts` surface area expanded**
`hooks/mutation-feedback.ts:13,26,36,53` — `buildMutationHookFeedback` now surfaces `coactivationCacheCleared` in its output shape. This is the feedback payload path attached to `memory_save` response at `memory-save.ts:3377,3413`.

### C. Interaction with the Desired/Prior Statediff Model

The 006 spec at `006-write-path-reconciliation/spec.md:83` states: "Cache invalidation, alias feedback, retention sweep, and graph cache clearing become subscribers to the applied action batch; they are not themselves statediff targets."

The 012 commit strengthened the case for this boundary in two ways:

**C1. Entity-density cache is a new subscriber candidate**
`entity-density.ts:9` documents the cache as "Refreshes lazily on a 60s TTL or via `invalidateEntityDensityCache()`." It is currently called inline at two scattered sites (`memory-save.ts:2637`, `memory-bulk-delete.ts:151,258`). Under the statediff model these would become subscribers to the `insert`/`delete` action batch, receiving the applied action set after the storage write completes. This removes the current asymmetry where entity-density invalidation fires on save but not on scan-triggered deletes (see `memory-index.ts` — `runScanInvalidationHooks` at line 361 calls `runPostMutationHooks` but does not call `invalidateEntityDensityCache`).

**C2. `clearDegreeCache` and `clearRelatedCache` are new degree/graph-channel subscribers**
`mutation-hooks.ts:70–71` — `clearGraphSignalsCache()` + `clearDegreeCache()` are bundled. The degree cache at `graph-search-fn.ts:332–348` is invalidated on causal edge mutations. Under statediff, the graph-edge target sink (`lib/storage/causal-edges.ts`) should trigger both clears when an edge `DiffAction` is applied, rather than having the caller bundle them in the hook.

**C3. Co-activation cache needs the same treatment**
`mutation-hooks.ts:85` — `clearRelatedCache()` fires on every mutation regardless of what changed. Under statediff it should subscribe to `insert`/`upsert`/`delete` actions on `memory_index` rows, not to arbitrary `scan` or `atomic-save` operations.

**C4. Entity-density scan gap is a correctness issue**
The 012 remediation wired `invalidateEntityDensityCache()` into `memory-save` and `memory-bulk-delete` but NOT into the scan path. `memory-index.ts:361–366` calls `runPostMutationHooks('scan', ...)` which does not call `invalidateEntityDensityCache`. If a scan deletes stale rows that had ≥3 causal edges, the entity-density cache remains stale for up to 60s. Phase 006's statediff subscriber model would fix this by having the `delete` action on a `memory_index` row always notify the entity-density subscriber, regardless of which handler triggered the delete.

---

## Revised Scope for Phase 006

The original `006-write-path-reconciliation/spec.md` scope at lines 147–157 lists `mutation-hooks.ts` as a "Modify" target (convert hook bundle into action-batch subscribers). The 012 additions expand this in the following concrete ways:

**Additions to "Files to Change":**

| File | Change Type | Added Scope from 012 |
|------|-------------|----------------------|
| `handlers/memory-save.ts` | Modify (already in scope) | Remove `invalidateEntityDensityCacheAfterSave()` call at line 2637; entity-density invalidation becomes a statediff subscriber. |
| `handlers/memory-bulk-delete.ts` | **Add to scope** | Remove `invalidateEntityDensityCacheAfterBulkDelete()` calls at lines 151 and 258; subscribe via action batch. |
| `handlers/mutation-hooks.ts` | Modify (already in scope) | `clearDegreeCache()`, `clearRelatedCache()`, and `clearGraphSignalsCache()` become typed subscribers to specific action kinds rather than blanket post-call clears. |
| `hooks/mutation-feedback.ts` | **Add to scope** | Update feedback shape to reflect subscriber-based reporting rather than direct hook enumeration. |

**No change to existing out-of-scope items.** The 012 commit did not introduce changes to `memory_causal_link`, manual unlink, or schema redesign — those exclusions stand.

**Key correctness gap to close:** the entity-density cache scan-path gap (C4 above) is a new correctness argument for phase 006. The statediff model should ensure that every `delete` action applied via a target sink notifies the entity-density subscriber, closing the 60s-lag window that currently only applies to scan-triggered deletes.

---

## Summary

The 012 causal-routing commit added five new scattered invalidation callsites and one new cache module (`entity-density.ts`) relevant to phase 006. The two inline `invalidateEntityDensityCache` calls in `memory-save.ts` and `memory-bulk-delete.ts` are the most important new scope additions: they are post-mutation cache clears that belong to the statediff subscriber model but are currently wired outside `runPostMutationHooks`. Phase 006 should add `handlers/memory-bulk-delete.ts` and `hooks/mutation-feedback.ts` to its Files to Change table, and explicitly list entity-density cache subscription as a subscriber target alongside the existing alias conflict, divergence, retention sweep, and cache invalidation subscribers.

**Verdict: ADAPT** — the original 006 scope is directionally correct but misses two handler files (`memory-bulk-delete.ts`, `mutation-feedback.ts`) and one subscriber type (entity-density cache) that the 012 commit introduced.
