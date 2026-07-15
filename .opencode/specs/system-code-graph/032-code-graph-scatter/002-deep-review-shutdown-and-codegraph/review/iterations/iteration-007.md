# Iteration 007 — Correctness

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=1 P2=2 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] CORR-01 — cross-file edge prune correctness  (confidence 0.82)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:552-561]** · finding_class: `cross-consumer`
- **Evidence:**
```
for (const result of results) {
      try {
        persistIndexedFileResult(result);
        persistedDetectorProvenance ??= result.detectorProvenance;
```
- **Why:** indexWithTimeout (used by ensureCodeGraphReady's full_scan AND selective_reindex paths, lines 704/737) persists every parsed result with persistIndexedFileResult(result) and NO deferDanglingTargetPrune. Each call therefore runs replaceEdges' inline GLOBAL prune (code-graph-db.ts:767-772 `DELETE FROM code_edges WHERE source_id NOT IN (...) OR target_id NOT IN (...)`). On a MULTI-file selective_reindex (state.staleFiles, ensure-ready.ts:737 passes an array), file A is persisted first; its forward-referenced cross-file IMPORTS/EXPORTS/TYPE_OF edge whose target lives in not-yet-persisted file B is deleted because B's node row does not exist yet, and it is never restored (the post-persist resolveCrossFileCallEdges only reconciles CALLS edges per the BUG-03 comment at code-graph-db.ts:719-726). This is exactly the data-loss class the scan handler fixes via deferDanglingTargetPrune:true + a single post-loop pruneDanglingEdges() (scan.ts:600,715), but that fix was NOT mirrored onto the ensure-ready selective/auto-index path.
- **Fix:** In ensure-ready.ts indexWithTimeout, persist with persistIndexedFileResult(result, { deferDanglingTargetPrune: true }) and call graphDb.pruneDanglingEdges() once after the loop (mirroring scan.ts:600/715), at least when results.length > 1.

### [P2] CORR-02 — lock-file resource lifecycle  (confidence 0.74)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:108-120]** · finding_class: `instance-only`
- **Evidence:**
```
fd = openSync(lockPath, 'wx', 0o600);
      writeFileSync(fd, `${process.pid}\n`, { encoding: 'utf8' });
      fsyncSync(fd);
      return { fd, lockPath };
    } catch (error: unknown) {
      if (typeof fd === 'number') {
        closeSync(fd);
      }
      ...
      if (code !== 'EEXIST') {
        throw error;
      }
```
- **Why:** If openSync('wx') succeeds but the subsequent writeFileSync(fd,...) or fsyncSync(fd) throws (e.g. ENOSPC/EIO), the catch closes the fd and rethrows, but the just-created lock FILE is left on disk with NO pid content. Every later acquirer then hits EEXIST, readOwnerLeaseMutationLockPid returns null (empty file), so the dead-lock reclaim branch (line 123, requires lockPid !== null) never fires and tryAcquireOwnerLeaseMutationLock returns null forever — acquire/refresh/release of the owner lease are wedged until the orphan lock is manually removed. Low probability (write to a freshly-opened local fd rarely fails) but a hard self-inflicted deadlock when it does.
- **Fix:** On the non-EEXIST failure path after a successful openSync, unlink the lock file before rethrowing (e.g. try { unlinkSync(lockPath) } catch {} inside the `code !== 'EEXIST'` branch) so a partial-write orphan cannot permanently block lease mutation.

### [P2] CORR-03 — abort granularity / wasted work  (confidence 0.7)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2137-2160]** · finding_class: `instance-only`
- **Evidence:**
```
for (const file of candidateFiles) {
        if (options.signal?.aborted) {
          throw new Error(`parse-candidates aborted (deadline signal) after ${results.length} parsed`);
        }
        ...
        const content = readFileSync(file, 'utf-8');
          const result = await parseFile(file, content, language, config.edgeWeights);
```
- **Why:** Cooperative cancellation is checked only at the top of each file iteration. After controller.abort() fires (ensure-ready.ts:537 timeout), the currently in-flight `await parseFile(...)` — which itself does async tree-sitter WASM work — runs to completion before the next loop check throws. For a single very large file this means the deadline can be overrun by one full file parse. Correctness is preserved (Promise.race already rejected; the abandoned indexFiles rejection is consumed by Promise.race's internal reaction so no unhandledRejection fires and index.ts:67-72 does not process.exit), but it is wasted CPU past the deadline. Flagged as a lifecycle nicety, not a data-integrity bug.
- **Fix:** Accept current one-file granularity (documented intent at lines 2138-2141) or thread the AbortSignal into parseFile/getParser for finer-grained abort; no action strictly required for correctness.

## Coverage
Covered all four scoped files plus the two real production consumers (handlers/scan.ts persist loop, lib/ensure-ready.ts indexWithTimeout/persistIndexedFileResult) and index.ts global rejection handlers, since the in-file logic only makes sense against its callers. VERIFIED OK (no finding): (1) owner-lease reclaim TOCTOU is correctly closed — acquire re-reads under the mutation lock and bails via isSameOwnerLease when a successor wrote a different lease (owner-lease.ts:395-422); writeOwnerLeaseAtomic uses unique temp+rename, writeOwnerLeaseExclusive relies on O_EXCL `wx`; release/refresh take the same lock (DR-001-03/DR-002-03 comments). (2) tryAcquireOwnerLeaseMutationLock fd is closed on every catch branch; unbound `process.kill` reference works (tested in-env). (3) better-sqlite3 nested transactions: persistIndexedFileResult wraps upsert+replaceNodes+replaceEdges in one tx while replaceNodes/replaceEdges each open their own d.transaction() — better-sqlite3 nests these via SAVEPOINTs, so this is sound; full-scan post-loop pruneDanglingEdges is guarded by filesIndexed>0 so it cannot wipe all edges on an empty code_nodes. (4) phase-runner runPhases checks signal.aborted at each phase boundary (line 280) and the DAG validation rejects cycles/dupes/missing deps. (5) indexWithTimeout clears its setTimeout in finally (ensure-ready.ts:566-568) and the abort listener lives on a local controller (GC'd), so no timer/handle leak. COULD NOT VERIFY: did not exercise better-sqlite3 nested-savepoint behavior at runtime (relied on documented library semantics, confidence ~0.9); did not read resolveCrossFileCallEdges to confirm it only reconciles CALLS (relied on BUG-03 comment at code-graph-db.ts:719-726) — CORR-01 severity hinges on that; if that resolver also restores IMPORTS edges, CORR-01 would drop to P2.

Review verdict: CONDITIONAL
