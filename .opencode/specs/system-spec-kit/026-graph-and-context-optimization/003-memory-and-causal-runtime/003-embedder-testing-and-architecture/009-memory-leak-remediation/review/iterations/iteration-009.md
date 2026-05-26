# Iteration 009 — correctness

## Metadata
- Iteration: 9 of 10
- Dimension: correctness
- Timestamp: 2026-05-22T17:40:16Z
- Findings this iter: 5

## Summary
This pass re-read the required arc 009 review state, all prior iteration reports, the findings registry, the 13 phase implementation summaries, and the correctness-sensitive lifecycle surfaces across CocoIndex, Code Graph, Spec Kit runtime helpers, and the rerank sidecar. I found five new correctness issues: three required lifecycle/identity bugs and two lower-severity contract/collision problems. All five fingerprints were checked against the existing registry and are novel.

## New Findings

### P0 — Blockers
None

### P1 — Required

#### Mismatched cancel identities can cancel the wrong index
- **Fingerprint:** `correctness:cocoindex-cancel:mismatched-dual-identity-matches-any`
- **File(s):** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/cancel_protocol.py:33`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/active_work_registry.py:77`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:421`
- **Evidence:** `server.py` documents `index_cancel` as cancelling "via exact identity", but `match_cancel_request()` returns true when either supplied identity matches:

```python
return (req.req_id is not None and req.req_id == active_row.req_id) or (
    req.index_id is not None and req.index_id == active_row.index_id
)
```

- **Reasoning:** When a caller supplies both `req_id` and `index_id`, those two values are supposed to identify the same active row. The current OR match means a stale or unrelated `req_id` can be paired with a live `index_id`, or the reverse, and the registry will still cancel the first row that matches either half. That violates the "exact identity" contract and can cancel the wrong in-flight index.
- **Suggested fix:** Treat dual-identity cancellation as an AND match against the same row. Keep OR semantics only when exactly one identity is supplied, and add tests for mixed-match pairs.

#### Concurrent sidecar spawns can lose ledger rows
- **Fingerprint:** `correctness:rerank-sidecar-ledger:read-append-replace-loses-concurrent-row`
- **File(s):** `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py:157`, `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:201`
- **Evidence:** `add_sidecar_row()` reads the whole ledger, appends one row, then atomically replaces the file:

```python
rows = [existing for existing in read_ledger(state_dir) if existing.pid != row.pid]
rows.append(row)
write_ledger_atomic(state_dir, rows)
```

- **Reasoning:** The final replace is atomic, but the update is still a read-modify-write with no lock or compare-and-swap. Two concurrent `ensure_rerank_sidecar.py` processes can both read the same old ledger, spawn different sidecars, and then whichever `os.replace()` runs last drops the other live process from lifecycle tracking. That leaves a resident sidecar that later cleanup code cannot see.
- **Suggested fix:** Guard ledger updates with an exclusive lock file, move to per-PID row files, or retry a merge when the ledger changes between read and replace. Add a concurrency test that starts two adders from the same empty ledger.

#### Child heartbeat silently fails after lease transfer misses
- **Fingerprint:** `correctness:code-graph-owner-lease:child-heartbeat-ignores-refresh-false`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/index.ts:41`, `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:247`, `.opencode/bin/mk-code-index-launcher.cjs:525`
- **Evidence:** The MCP server heartbeat ignores the boolean result of `refreshOwnerLease()`, while the launcher already has a path where lease transfer to the child can fail:

```ts
refreshOwnerLease(DATABASE_DIR, process.pid);
```

```js
if (!refreshed) {
  log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
}
```

- **Reasoning:** `refreshOwnerLease()` returns `false` when the recorded owner PID does not match the refreshing process. If launcher-to-child transfer fails, the child can keep running while every heartbeat is a no-op. Once the stale heartbeat threshold passes, another launcher can reclaim a lease for a live Code Graph server, breaking the single-owner contract.
- **Suggested fix:** Check the refresh result in the child. If the recorded owner is the launcher PID, repair/transfer once; otherwise log a health failure and exit or stop serving. Add a test that simulates a failed parent-to-child lease transfer.

### P2 — Suggestions

#### Relationship queries reject the documented file-path subject
- **Fingerprint:** `correctness:code-graph-query:relationship-file-path-subject-unresolved`
- **File(s):** `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:52`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:347`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1387`
- **Evidence:** The public schema describes `subject` as `File path, symbol name, or symbolId to query`, but relationship operations resolve only symbols:

```ts
const resolution = await resolveSubject(subject, db);
if (resolution.kind !== 'symbol') {
  return { ok: false, operation, subject, error: resolution.message };
}
```

- **Reasoning:** `resolveSubject()` checks symbol ID, fully-qualified name, and simple name. It does not resolve a file path, even though file-path resolution exists for other operations in the same handler. A documented `imports_to` or `imports_from` query using a file path therefore fails with "Could not resolve subject" instead of answering or giving a scoped unsupported-input error.
- **Suggested fix:** Either resolve file paths for relationship operations before symbol lookup, or narrow the schema/validation text so file paths are advertised only for operations that actually support them.

#### Audit rotation can overwrite a prior rotation in the same millisecond
- **Fingerprint:** `correctness:audit-rotation:timestamp-suffix-can-overwrite-rotation`
- **File(s):** `.opencode/skills/system-spec-kit/mcp_server/lib/memory/audit-rotation.ts:32`
- **Evidence:** The rotated filename is derived only from the provided timestamp:

```ts
const suffix = now.toISOString().replace(/[:.]/g, '-');
renameSync(auditPath, `${auditPath}.${suffix}.rotated`);
```

- **Reasoning:** Two rotations in the same millisecond, or two tests/operators passing the same `now`, produce the same target path. On POSIX, `renameSync()` replaces the existing target, so the second rotation can silently discard the first rotated audit file. The size gate makes this uncommon but not impossible under rapid retry or deterministic clocks.
- **Suggested fix:** Include a monotonic counter, PID, random suffix, or exclusive-create retry in the rotated filename. Add a test that calls rotation twice with the same timestamp and asserts both rotated files survive.

## Convergence Signal
- New findings this iter: 5
- Cumulative finding count after iter: 54
- New-findings ratio: 0.09
- Continue / converged signal: `continue`

## Files Touched (this iter)
- `iterations/iteration-009.md`
- `deltas/iter-009.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-state.jsonl`
- `deep-review-dashboard.md`
