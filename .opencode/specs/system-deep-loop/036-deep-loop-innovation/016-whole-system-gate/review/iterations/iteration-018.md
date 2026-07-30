# Iteration 018 — security

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:29:01.360Z
- New findings: 4 (of 4 reported; prior total 66)
- Coverage: {"filesExamined":15,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/durable-file.ts",".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/atomic-state.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts",".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"]}

## Summary
I examined loop-lock reclamation and release, fenced lease orchestration, atomic JSON/JSONL writers, and the authorized ledger boundary. Two loop-lock paths perform check-then-reclaim or check-then-delete without binding the claimed inode or nonce, allowing lock ownership loss. Branch leases fence ledger records after worker execution, but not the worker's actual side effects during lease expiry. JSONL deduplication also has a cross-process check-then-append race.

## Findings
- [P0] F-018-01 Stale lock reclamation can move a refreshed lock without identity verification @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:274
  - evidence: `acquireLoopLockFileOnly` reads the holder and evaluates staleness at lines 431-434, then `tryReclaimStaleLoopLock` unconditionally executes `renameSync(lockPath, reclaimPath)` at line 277 before writing the successor lock. It never compares the claimed file's acquire nonce, owner, or inode with the stale observation. A heartbeat can replace the stale file with a fresh lock between those operations, after which the reclaimer moves the fresh lock and installs a competing owner.
  - recommendation: Bind reclamation to the expected nonce and filesystem identity. After claiming, verify the nonce/inode and stale state; restore and retry when they differ.
- [P0] F-018-02 Lock release can delete a successor after a stale identity check @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:705
  - evidence: `releaseLoopLock` reads the current lock and validates `lockIdentityMatches` at lines 705-708, then performs an unconditional `unlinkSync(lockPath)` at line 711. A successor can reclaim and publish a new lock between the read and unlink, causing the old owner to remove the successor's lock and allowing a third owner to acquire while the successor is still active.
  - recommendation: Release by atomically renaming the expected lock to a private claim path, then verify its nonce/inode before deletion. Do not unlink the shared path after a separate identity read.
- [P0] F-018-03 Branch worker side effects are not fenced for the lease lifetime @ .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts:675
  - evidence: `runAuthorizedWave` acquires a branch lease with a caller-supplied TTL at lines 631-642, then invokes arbitrary `options.worker` at line 675. Only later ledger mutations are routed through `#appendRecord` and `withFences`; there is no lease renewal or side-effect gateway covering the worker execution. If the worker outlives the TTL, a successor can acquire the branch and run concurrently while the stale worker continues mutating state.
  - recommendation: Keep the lease renewed for the worker lifetime and require actual worker mutations to use a lease-bound fenced effect gateway. Abort or reject effects once the lease is lost; do not rely on post-worker ledger commits to fence earlier side effects.
- [P1] F-018-04 Cross-process diff-gated JSONL append is a check-then-append race @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts:337
  - evidence: `appendJsonlIfChangedAtomic` checks `readLastDiffFingerprint` at line 337, separately reads the current file at lines 344-346, and appends with `appendTextWithFsync` at line 347 without a cross-process lock or compare-and-swap. Two processes with fresh caches can observe the same absent fingerprint and both append the same event. `divergent-pivot.ts` passes a new `Map` cache for each append, so its in-memory deduplication does not close this race.
  - recommendation: Perform fingerprint check and append under a per-file lock or atomic idempotency claim. Enforce event-ID uniqueness within the same serialized critical section.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 18,
  "dimension": "security",
  "summary": "I examined loop-lock reclamation and release, fenced lease orchestration, atomic JSON/JSONL writers, and the authorized ledger boundary. Two loop-lock paths perform check-then-reclaim or check-then-delete without binding the claimed inode or nonce, allowing lock ownership loss. Branch leases fence ledger records after worker execution, but not the worker's actual side effects during lease expiry. JSONL deduplication also has a cross-process check-then-append race.",
  "findings": [
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Stale lock reclamation can move a refreshed lock without identity verification",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
      "line": 274,
      "evidence": "`acquireLoopLockFileOnly` reads the holder and evaluates staleness at lines 431-434, then `tryReclaimStaleLoopLock` unconditionally executes `renameSync(lockPath, reclaimPath)` at line 277 before writing the successor lock. It never compares the claimed file's acquire nonce, owner, or inode with the stale observation. A heartbeat can replace the stale file with a fresh lock between those operations, after which the reclaimer moves the fresh lock and installs a competing owner.",
      "recommendation": "Bind reclamation to the expected nonce and filesystem identity. After claiming, verify the nonce/inode and stale state; restore and retry when they differ."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Lock release can delete a successor after a stale identity check",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
      "line": 705,
      "evidence": "`releaseLoopLock` reads the current lock and validates `lockIdentityMatches` at lines 705-708, then performs an unconditional `unlinkSync(lockPath)` at line 711. A successor can reclaim and publish a new lock between the read and unlink, causing the old owner to remove the successor's lock and allowing a third owner to acquire while the successor is still active.",
      "recommendation": "Release by atomically renaming the expected lock to a private claim path, then verify its nonce/inode before deletion. Do not unlink the shared path after a separate identity read."
    },
    {
      "severity": "P0",
      "dimension": "security",
      "title": "Branch worker side effects are not fenced for the lease lifetime",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",
      "line": 675,
      "evidence": "`runAuthorizedWave` acquires a branch lease with a caller-supplied TTL at lines 631-642, then invokes arbitrary `options.worker` at line 675. Only later ledger mutations are routed through `#appendRecord` and `withFences`; there is no lease renewal or side-effect gateway covering the worker execution. If the worker outlives the TTL, a successor can acquire the branch and run concurrently while the stale worker continues mutating state.",
      "recommendation": "Keep the lease renewed for the worker lifetime and require actual worker mutations to use a lease-bound fenced effect gateway. Abort or reject effects once the lease is lost; do not rely on post-worker ledger commits to fence earlier side effects."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Cross-process diff-gated JSONL append is a check-then-append race",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",
      "line": 337,
      "evidence": "`appendJsonlIfChangedAtomic` checks `readLastDiffFingerprint` at line 337, separately reads the current file at lines 344-346, and appends with `appendTextWithFsync` at line 347 without a cross-process lock or compare-and-swap. Two processes with fresh caches can observe the same absent fingerprint and both append the same event. `divergent-pivot.ts` passes a new `Map` cache for each append, so its in-memory deduplication does not close this race.",
      "recommendation": "Perform fingerprint check and append under a per-file lock or atomic idempotency claim. Enforce event-ID uniqueness within the same serialized critical section."
    }
  ],
  "refutations": [
    {
      "id": "F-014-01",
      "verdict": "deepened",
      "reason": "`AppendOnlyLedger.appendAuthorized` remains directly callable and serializes only through `ImmutableFrameStore.withExclusiveLock`; the external fencing boundary exists only in the separate `FencedLedgerWriter` wrapper. The direct append path therefore still lacks coordinator fencing."
    }
  ],
  "coverage": {
    "filesExamined": 15,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-lease-coordinator.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-state-store.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/durable-file.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/ledger-fold.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/atomic-state.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/branch-leases-waves.vitest.ts",
      ".opencode/skills/system-deep-loop/runtime/tests/unit/locks-and-fencing.vitest.ts"
    ]
  }
}
```