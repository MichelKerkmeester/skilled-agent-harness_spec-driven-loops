# Iteration 19: S3-03 Atomic State Integrity Stamp

## Focus

D2 target-mapping for [S3-03]: whether `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` should adopt kasper's SHA-256 `_integrity` stamp so JSONL and registry tampering between iterations is detected on resume.

## Actions Taken

- Read the deep-research quick reference plus state-output and JSONL contracts to confirm the required iteration outputs.
- Mined kasper's state integrity implementation, schema, changelog, and regression tests.
- Inspected our `atomic-state.ts`, `jsonl-repair.ts`, `post-dispatch-validate.ts`, and `reduce-state.cjs` resume/reduction path.
- Checked iteration 16 so this pass did not duplicate the prior S2-08 lock-held merge and derived-state recompute findings.

## Findings

1. Rank 1: add a shared integrity primitive to `atomic-state.ts`, but keep it opt-in.
   - Reference mechanism: kasper computes a stable SHA-256 digest by destructuring `_integrity` out of the state and hashing `JSON.stringify(rest, null, 2)` at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:139-157`.
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. It currently only offers atomic JSON/text writes at `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42-43` and `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:58-64`, so a shared `computeIntegrityHash`/`stampIntegrity`/`verifyIntegrity` helper would prevent reducers and validators from inventing incompatible canonicalization.
   - Port-difficulty: easy.
   - Tag: quick-win.

2. Rank 2: verification should produce a resume warning/degraded signal by default, not hard fail.
   - Reference mechanism: kasper verifies `_integrity` in `init()`, logs `state_integrity_warn` on mismatch, then continues with the parsed on-disk state at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:159-177`; the changelog explicitly describes this as a warning that continues rather than throwing at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/CHANGELOG.md:62-66`. Regression coverage tampers with on-disk state and expects exactly one warning at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:297-340`.
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. A `verifyIntegrity()` result shape in this file can be consumed by resume/reducer code, while current reduction only rejects missing, empty, or structurally corrupt JSONL at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:170-186` and `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1028-1030`.
   - Port-difficulty: med.
   - Tag: quick-win.

3. Rank 3: stamp the post-hash object immediately before writing, and exclude only the integrity field.
   - Reference mechanism: kasper sets `_integrity` after rebuilding `_running` and immediately writes the post-hash object at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1048-1059`; its changelog documents a real bug where hashing the in-memory state but writing the pre-hash JSON meant `_integrity` was never persisted at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/CHANGELOG.md:34-35`. Tests assert `_integrity` is ignored while `_running` tampering changes the digest at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:372-421`.
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. If the helper writes registry-style JSON, it should stamp a cloned object and pass that exact stamped object into the existing atomic writer; it should not strip every underscore-prefixed field because derived caches can be tamper-relevant.
   - Port-difficulty: easy.
   - Tag: quick-win.

4. Rank 4: do not copy kasper's single-object `_integrity` field literally onto append-only JSONL.
   - Reference mechanism: kasper's state is one JSON object with optional `_integrity` at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/types.ts:185-195`, and every flush rewrites that whole object at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:1058-1059`.
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`. Our JSONL path appends independent records at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:105-106`, repairs only malformed trailing bytes at `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:77-96`, and rebuilds registry/dashboard from parsed JSONL at `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:984-986`. For JSONL, `atomic-state.ts` should provide record/content hash helpers that a sidecar manifest or per-record stamp can use; a single top-level `_integrity` would fight the append-only contract.
   - Port-difficulty: med.
   - Tag: deep-rewrite.

## Questions Answered

- [S3-03] Yes, `atomic-state.ts` should adopt kasper's SHA-256 integrity primitive, but not as a blind top-level `_integrity` drop-in for JSONL. The quick-win is a shared hash/stamp/verify API for canonical object state and registry-style JSON. The deeper backlog item is JSONL resume integrity via sidecar checkpoints or per-record stamps, with warning-first behavior unless a workflow explicitly requests fail-closed recovery.

## Questions Remaining

- Decide whether legacy iteration JSONL records may gain an `_integrity` field, or whether JSONL integrity must stay in a sidecar to preserve current output contracts.
- Map the exact callers that should consume `verifyIntegrity()`: reducer resume, post-dispatch validation, JSONL repair, and registry/dashboard writes have different failure semantics.
- Define whether registry tamper warnings should be advisory only or should block synthesis/complete gates.

## Next Focus

S3-04: map the concrete caller boundary for integrity verification across `jsonl-repair.ts`, `reduce-state.cjs`, and registry writes without changing reducer-owned strategy state.
