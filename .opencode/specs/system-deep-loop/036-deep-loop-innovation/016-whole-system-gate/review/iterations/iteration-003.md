# Iteration 003 — correctness

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:02:24.401Z
- New findings: 4 (of 4 reported; prior total 6)
- Coverage: {"filesExamined":18,"keyPaths":[".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",".opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs",".opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts",".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts",".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts",".opencode/commands/deep/assets/deep-research-auto.yaml",".opencode/commands/deep/assets/deep-review-auto.yaml",".opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts"]}

## Summary
I traced convergence scoring and stop decisions, delta reducers, graph snapshot writes, leaf artifact publication, and loop-lock lifecycle. The decision logic handles explicit blockers, but state durability and lock fencing have concrete gaps. Lock release is not race-safe, leaf outputs are not atomically committed, and malformed delta rows bypass strict corruption handling. Auto research convergence also never persists the snapshots its step declares. No known findings were re-evaluated in these paths.

## Findings
- [P1] F-003-01 Lock release can unlink a successor owner's lock after a reclaim race @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:705
  - evidence: releaseLoopLock reads and identity-checks the lock at lines 706-708, then unconditionally unlinks the pathname at line 711. Unlike refreshLoopLock, it does not atomically claim the inode before removal. A stale reclaimer can replace the lock between the read and unlink, causing release to delete the successor owner's lock or throw ENOENT.
  - recommendation: Release through the same atomic claim-and-verify protocol as refresh, removing only the claimed inode and preserving any successor lock; handle ENOENT as a failed release.
- [P1] F-003-02 Leaf artifact publication can leave an orphaned delta without a canonical state record @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts:246
  - evidence: The writer creates the iteration directory, writes iteration markdown at line 253, writes the delta at line 254, and appends the state record last at line 255. The catch only returns an error and performs no rollback. A crash or write failure after either first write leaves artifacts that the orchestrator cannot see through the state log, while the write-once delta check at line 250 blocks a clean retry.
  - recommendation: Publish via staged temporary files plus an atomic commit marker/recovery protocol, or implement rollback and reconciliation so narrative, delta, and state record become one recoverable transaction.
- [P1] F-003-03 Malformed delta rows bypass strict corruption handling @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:154
  - evidence: loadDeltaPayloads parses delta corruption warnings, logs them, and converts them to null placeholders at lines 163-170. The caller then filters those placeholders at lines 2095-2098. Strict failure at lines 2069 and 2116 only uses corruptionWarnings from the main state log, so a malformed delta row can silently remove a finding from the registry and dashboard. reduce-alignment-state.cjs has the same issue at lines 145-150.
  - recommendation: Aggregate corruption warnings from every delta file into the reducer's authoritative corruption set and fail closed unless an explicit lenient mode is selected; also surface invalid structured records rather than silently dropping them.
- [P2] F-003-04 Auto research convergence never persists graph snapshots @ .opencode/commands/deep/assets/deep-research-auto.yaml:610
  - evidence: The step action at line 609 says to persist the graph decision snapshot, but the command at line 610 omits both --persist-snapshot and --iteration. convergence.cjs only writes a snapshot when both conditions are true at lines 807-821, so normal auto research runs always report snapshotPersistence as not_requested and accumulate no score-delta or sliding-window baseline.
  - recommendation: Pass --persist-snapshot and the validated current iteration from the workflow, then verify snapshot persistence is included in the loop's durability contract.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 3,
  "dimension": "correctness",
  "summary": "I traced convergence scoring and stop decisions, delta reducers, graph snapshot writes, leaf artifact publication, and loop-lock lifecycle. The decision logic handles explicit blockers, but state durability and lock fencing have concrete gaps. Lock release is not race-safe, leaf outputs are not atomically committed, and malformed delta rows bypass strict corruption handling. Auto research convergence also never persists the snapshots its step declares. No known findings were re-evaluated in these paths.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Lock release can unlink a successor owner's lock after a reclaim race",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
      "line": 705,
      "evidence": "releaseLoopLock reads and identity-checks the lock at lines 706-708, then unconditionally unlinks the pathname at line 711. Unlike refreshLoopLock, it does not atomically claim the inode before removal. A stale reclaimer can replace the lock between the read and unlink, causing release to delete the successor owner's lock or throw ENOENT.",
      "recommendation": "Release through the same atomic claim-and-verify protocol as refresh, removing only the claimed inode and preserving any successor lock; handle ENOENT as a failed release."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Leaf artifact publication can leave an orphaned delta without a canonical state record",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      "line": 246,
      "evidence": "The writer creates the iteration directory, writes iteration markdown at line 253, writes the delta at line 254, and appends the state record last at line 255. The catch only returns an error and performs no rollback. A crash or write failure after either first write leaves artifacts that the orchestrator cannot see through the state log, while the write-once delta check at line 250 blocks a clean retry.",
      "recommendation": "Publish via staged temporary files plus an atomic commit marker/recovery protocol, or implement rollback and reconciliation so narrative, delta, and state record become one recoverable transaction."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Malformed delta rows bypass strict corruption handling",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      "line": 154,
      "evidence": "loadDeltaPayloads parses delta corruption warnings, logs them, and converts them to null placeholders at lines 163-170. The caller then filters those placeholders at lines 2095-2098. Strict failure at lines 2069 and 2116 only uses corruptionWarnings from the main state log, so a malformed delta row can silently remove a finding from the registry and dashboard. reduce-alignment-state.cjs has the same issue at lines 145-150.",
      "recommendation": "Aggregate corruption warnings from every delta file into the reducer's authoritative corruption set and fail closed unless an explicit lenient mode is selected; also surface invalid structured records rather than silently dropping them."
    },
    {
      "severity": "P2",
      "dimension": "correctness",
      "title": "Auto research convergence never persists graph snapshots",
      "file": ".opencode/commands/deep/assets/deep-research-auto.yaml",
      "line": 610,
      "evidence": "The step action at line 609 says to persist the graph decision snapshot, but the command at line 610 omits both --persist-snapshot and --iteration. convergence.cjs only writes a snapshot when both conditions are true at lines 807-821, so normal auto research runs always report snapshotPersistence as not_requested and accumulate no score-delta or sliding-window baseline.",
      "recommendation": "Pass --persist-snapshot and the validated current iteration from the workflow, then verify snapshot persistence is included in the loop's durability contract."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 18,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts",
      ".opencode/commands/deep/assets/deep-research-auto.yaml",
      ".opencode/commands/deep/assets/deep-review-auto.yaml",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts"
    ]
  }
}
```