# Seat opus-regression-code — iteration 2 (global #2)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-regression-code
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I have traced the complete delete/tombstone-sweep path and the rollback behavior. Here's my analysis.

## Analysis

**The remediation (commit `ef0eb88a4a`):** `deleteAncillaryMemoryRows` previously had a blanket `catch (_error) {}` that swallowed *all* sweep failures, letting a memory hard-delete commit without its causal-edge tombstone. It was narrowed to:

```ts
} catch (error: unknown) {                                  // vector-index-mutations.ts:193-201
  const message = error instanceof Error ? error.message : String(error);
  if (!/no such table/i.test(message)) {
    throw error;
  }
}
```

**Rollback path verification — both delete entrypoints are CORRECT and COMPLETE:**

1. **Single delete** `delete_memory_from_database` (`vector-index-mutations.ts:713-751`): `deleteAncillaryMemoryRows(database, id)` runs at line 734 *inside* `database.transaction(...)`, and `DELETE FROM memory_index` runs *after* it at line 745. A re-thrown sweep error propagates out of the transaction callback → better-sqlite3 rolls back → the `memory_index` delete (and the preceding ancillary deletes) never commit. ✓

2. **Bulk delete** `delete_memories` (`vector-index-mutations.ts:855-904`): the per-item `catch` at line 886 captures the re-thrown sweep error and pushes to `failed_ids`; after the loop, `failed_ids.length > 0` forces `throw new VectorIndexError(...)` at line 894, which unwinds the whole `database.transaction` → no memory is hard-deleted without its tombstone. ✓

3. **Sweep reentrancy** (`sweep.ts:234` → `transaction-manager.ts:146-167`): when called inside an active transaction, `runInTransaction` runs the sweep *inline* (no nested savepoint), so the tombstone inserts + edge deletes share the outer transaction and roll back atomically with it. Custom failures (`createIndex` "table missing after schema setup" at `sweep.ts:58`, SQLITE_BUSY/LOCKED, readonly-db) don't match `/no such table/` and correctly propagate. ✓

The other callers (`corrections.ts:618-678`, `checkpoints.ts`, `frontmatter-promoter.ts`) are not the memory hard-delete path; `corrections.ts` deliberately warn-and-continues on edge cleanup (the swept object *is* the edge, tombstone-backed, so no memory row is orphaned) — different semantics, out of this angle, not a defect.

**One real imperfection (P2):** The `/no such table/i` tolerance is both *broader than its stated intent* and *unreachable for the legitimate reason*. The "legacy DB predates causal-edge tables" case the comment cites is already short-circuited upstream by `sweep.ts:230-232` (`if (!tableExists(database, 'causal_edges')) return emptySweepResult()`) — that returns without throwing — and `causal_edge_tombstones` is created via `CREATE TABLE IF NOT EXISTS` (`sweep.ts:69-80`). So no current sweep path throws "no such table" for a legacy reason. The branch can only fire for an *unexpected* missing-table error from inside the sweep, which it would then silently swallow, committing the hard delete without the tombstone — re-introducing the very defect the remediation closed. Low probability today (no reachable trigger), so P2, but the tolerance should be removed or scoped to the specific causal tables.

```json
{"seat":"opus-regression-code","model":"claude-opus-4-8","angle":"REGRESSION: delete no longer commits after a failed tombstone sweep (blanket catch narrowed to legacy missing-table only; other failures roll back). Verify the rollback path is correct and complete.","verdict":"PASS","summary":"Rollback path is correct & complete: sweep failures re-throw inside both delete transactions before memory_index delete, rolling back atomically. One latent P2: over-broad 'no such table' tolerance.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts",".opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts",".opencode/skills/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts",".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts",".opencode/skills/system-spec-kit/mcp_server/lib/learning/corrections.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"'no such table' tolerance is broader than its intent and unreachable for the legacy reason it cites","file":".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:198","evidence":"catch re-throws unless /no such table/i matches, with comment 'Tolerate only legacy databases that predate causal-edge tables'. But sweep.ts:230-232 already early-returns emptySweepResult() when causal_edges is absent (no throw), and sweep.ts:69-80 creates causal_edge_tombstones via CREATE TABLE IF NOT EXISTS — so no real sweep path throws 'no such table' for the legacy reason. The regex also matches ANY missing-table message, not the causal tables specifically.","why":"The tolerance branch can only fire for an UNEXPECTED 'no such table: X' surfacing from inside the sweep (e.g. a future trigger/schema change or corrupted schema where causal_edges exists but a dependency is missing). It would then be silently swallowed and the surrounding delete transaction would commit a memory hard-delete without its tombstone audit row — re-introducing the exact defect this remediation fixed. No reachable trigger exists in current code, so impact is latent.","recommendation":"Drop the catch tolerance entirely (the sweep.ts:230 guard already handles legacy DBs, so any throw reaching here is genuinely unexpected and should roll back), or tighten the regex to the causal tables, e.g. /no such table:\\s*causal_edge/i, so unrelated missing-table errors still propagate and roll back."}]}
```
