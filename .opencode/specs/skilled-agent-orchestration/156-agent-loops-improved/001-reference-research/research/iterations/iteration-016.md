# Iteration 16: S2-08 Kasper Concurrent State Merge

## Focus

Investigated how kasper reconciles concurrent writers with a lock-held read-merge-write path so two plugin processes sharing the same state file do not overwrite each other's monotonic state.

## Actions Taken

- Read the deep-research output contract and prior iteration 15 to avoid duplicating the S2-07 debounced writer findings.
- Mined kasper's state flush path, lock helper, design notes, and review caveats around cross-instance behavior.
- Inspected our JSONL repair helper and the deep-research reducer call path to map the mechanism to the exact target file.
- Classified the portable pieces separately from kasper's non-portable limitation: merge repair is not cross-process admission control.

## Findings

1. Lock-held read-merge-write belongs in the JSONL safety layer, not only in reducers.
   - Reference mechanism: kasper acquires an exclusive stale-aware lock with open(lockPath, "wx") at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/lock.ts:19-31; the flush path then performs acquireLock() -> mergeExternalState() -> doFlush() while holding that lock at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:920-923; mergeExternalState() rereads current disk state before writing at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:958-965.
   - OUR target file: .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.
   - Why it helps: our helper currently repairs corrupt tails and appends records at .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:77-106, but it has no lock-held reread before append/repair paths that could rewrite or dedupe a log touched by another process.
   - Port difficulty: med.
   - Tag: quick-win.

2. Set-union merge needs stable record keys, not content-based duplicate detection.
   - Reference mechanism: kasper merges sessions by object key, evaluated sessions through evaluatedSet, improvements by durable id, and rejected patterns by exact membership at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:967-998; its design notes call out that switching improvement dedupe to ID-only avoided dropping legitimate sessions from multiple plugin instances at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/DESIGN.md:301.
   - OUR target file: .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.
   - Why it helps: deep-loop iteration, delta, and graph-event records already carry deterministic keys such as iteration number and graph event id; a JSONL merge helper can union by stable keys instead of trying to infer duplicates from similar JSON bodies.
   - Port difficulty: med.
   - Tag: quick-win.

3. Merge source records, then recompute derived state instead of merging generated outputs.
   - Reference mechanism: after merging newly discovered sessions, kasper increments aggregate inputs and recomputes aggregate state at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1000-1014; the final flush materializes evaluated sessions, running aggregate fields, integrity hash, and atomic write at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1048-1059.
   - OUR target file: .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.
   - Why it helps: our deep-research reducer already derives iteration records from the state log at .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:984-986; JSONL repair should produce a clean canonical raw event stream and leave registry/dashboard reconstruction to reducers.
   - Port difficulty: easy.
   - Tag: quick-win.

4. Merge-before-write prevents clobbering but does not stop duplicate work.
   - Reference mechanism: kasper's review notes say mergeExternalState() is active on every flush, but evaluation work is not deduplicated across instances and needs separate persisted admission metadata at .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/REVIEW.md:177-184.
   - OUR target file: .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.
   - Why it helps: a future JSONL merge API should be documented as durability plumbing; loop single-flight and claim/admission semantics still belong in runtime lock/lifecycle code, not in append repair.
   - Port difficulty: hard.
   - Tag: deep-rewrite.

## Questions Answered

- [S2-08] Kasper prevents clobbering by acquiring a cross-process lock, rereading the current on-disk state under that lock, unioning monotonic collections by stable identity, recomputing derived aggregate state from the merged source records, and only then performing the atomic write. The portable backlog item is a lock-scoped JSONL merge/append helper in .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.

## Questions Remaining

- The target design still needs a D2 pass to specify exact JSONL record identity keys for iteration records, graph events, findings, and observations.
- The loop runtime still needs a separate admission-control pass if the goal is to prevent duplicate in-flight iterations, not only preserve both writers' completed records.

## Next Focus

D2 mapping pass for S2-08: define the concrete API and caller boundaries for a lock-scoped JSONL merge helper in .opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts.
