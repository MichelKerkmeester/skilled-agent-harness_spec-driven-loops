# Iteration 014 - Retention + Governance

## Dimension

retention + governance (`memory-retention-sweep.ts`): post-delete FTS optimize, guarded `incremental_vacuum`, `wal_checkpoint(TRUNCATE)` ordering vs. the delete transaction, and transaction-boundary/data-loss edges.

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:52` - expired-row candidate selection.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:166` - candidate selection before transaction creation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:186` - sweep transaction boundary.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:188` - deletion by candidate id without revalidating `delete_after`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:232` - transaction execution.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:233` - post-commit maintenance gate.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:109` - FTS optimize.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:117` - `auto_vacuum` guard.
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:134` - WAL checkpoint.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:592` - delete helper transaction.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:627` - primary row delete by id.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:635` - best-effort BM25 cleanup after primary delete.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:37` - MCP handler invokes sweep directly on the live DB.
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:269` - startup scheduled sweep invocation.
- `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:277` - periodic scheduled sweep invocation.
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:173` - post-delete maintenance test.
- `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:262` - concurrent writer test only inserts a future row.

## Findings by Severity

### P0

None.

### P1

#### DR-014-P1-001 [P1] Retention sweep deletes stale candidates without revalidating `delete_after` inside the transaction

- File: `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:166`
- Evidence: `selectExpiredRows(database)` materializes all expired ids before the write transaction starts. The transaction created at `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:186` then loops those stale candidates and calls `vectorIndex.deleteMemory(candidate.id, database)` at `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:188`. The lower delete path deletes `memory_index` by id at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:627`, with no predicate tying the delete to the still-expired `delete_after` value. The MCP handler and scheduled session sweeps call this directly on the live DB at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts:37`, `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:269`, and `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:277`.
- Risk: a concurrent writer can extend or clear a row's retention deadline after candidate selection but before the sweep write transaction commits. The sweep still deletes that row by id, turning a valid governance retention update into destructive data loss.
- Finding class: cross-consumer.
- Scope proof: `rg -n "runMemoryRetentionSweep|memory_retention_sweep"` shows the same function is used by the MCP handler and scheduled session manager; `rg -n "delete_after|selectExpiredRows|deleteMemory"` in the sweep/delete path shows no transaction-local recheck. Existing concurrency coverage at `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:262` only proves a future row inserted by another connection survives; it does not cover an already-selected candidate whose `delete_after` is updated before deletion.
- Recommendation: perform the expiry predicate inside the same write transaction as the deletion. The minimal fix is to reselect or revalidate each candidate with `WHERE id = ? AND delete_after IS NOT NULL AND datetime(delete_after) < datetime('now')` inside `sweepTx` before calling `deleteMemory`, or make the primary delete conditional on that predicate so stale candidates are skipped.

Claim adjudication:

- Claim: retention candidates selected before the sweep transaction can become stale, but the transaction deletes by id without rechecking the governed retention deadline.
- Evidence refs: `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:166`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:186`, `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:188`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:627`, `.opencode/skills/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:262`.
- Counterevidence sought: checked whether candidate selection occurs inside `sweepTx`, whether `deleteMemory` accepts or enforces a `delete_after` predicate, whether handler/session callers serialize retention sweeps behind a visible single-writer guard, and whether tests cover an update/rescue race for an already-selected row.
- Alternative explanation: same-process JavaScript execution is synchronous, so an in-process Promise cannot interleave between selection and transaction start. That does not close the file-backed or multi-process writer window, and the test suite already models another file-backed writer for retention behavior.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: downgrade if all memory metadata updates and retention sweeps are proven to run under a process-wide exclusive writer lock, or if SQLite transaction mode is changed so candidate selection and deletion share the same immediate write transaction.

### P2

None.

## Traceability Checks

- `spec_code`: partial. The code implements post-delete FTS optimize, guarded incremental vacuum, and WAL checkpoint ordering, but the transaction-local expiry invariant is missing.
- `checklist_evidence`: partial. Existing tests prove maintenance runs outside the delete transaction and no-row sweeps skip maintenance, but they do not cover a selected candidate whose retention metadata changes before deletion.
- `skill_agent`: not applicable for this retention-only pass.
- `agent_cross_runtime`: not applicable for this retention-only pass.
- `feature_catalog_code`: partial. The governed retention feature exists in `memory-retention-sweep.ts`, handler, and session manager, with the new data-loss edge isolated to the stale-candidate delete boundary.
- `playbook_capability`: not applicable.

## Ruled Out

- Post-delete maintenance inside transaction: ruled out. `runPostDeleteMaintenance()` is invoked only after `sweepTx()` returns, and tests assert FTS optimize, `auto_vacuum`, and WAL checkpoint run with `db.inTransaction === false`.
- Unguarded `incremental_vacuum`: ruled out. The sweep checks `auto_vacuum` and only runs `incremental_vacuum` when the mode is incremental.
- WAL checkpoint before commit: ruled out. The `wal_checkpoint(TRUNCATE)` call is in post-delete maintenance after the sweep transaction completes.
- Nested delete helper partial-row corruption: ruled out for primary SQLite rows. The vector/cache/index deletes occur inside the delete helper transaction before `DELETE FROM memory_index`; BM25 cleanup is best-effort after a successful primary delete and does not roll back the committed primary delete.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. One new P1 data-loss edge remains in the retention/governance path; no new P0s found. The post-delete maintenance ordering itself is clean.

## Next Dimension

Continue line-level adversarial verification on remaining non-WAL P1 clusters, especially transaction boundaries where governance metadata changes race lifecycle cleanup.
