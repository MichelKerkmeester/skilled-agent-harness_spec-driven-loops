# Iteration 17: S3-01 Loop Lock Heartbeat Mapping

## Focus

S3-01 asked whether OUR `loop-lock.ts` should adopt a loop-cli-style pause-aware heartbeat cadence so a live but slow deep-loop run is not judged stale by `isStaleLoopLock` after `2 * ttlMs`.

The precise finding: loop-cli-main does not expose a literal lock heartbeat. The portable mechanism is its event-driven lifecycle cadence: the controller emits `waiting`, `paused`, `resumed`, `run:start`, `run:end`, and `stopped`, and the manager persists state on those events. OUR lock already has `lastHeartbeatIso`, `ttlMs`, `isStaleLoopLock`, and `refreshLoopLock`, but current deep command YAML appears to acquire and release the lock without a refresh call during long dispatch.

## Actions Taken

- Inspected loop-cli-main lifecycle state, wait, pause, resume, and persistence paths.
- Inspected OUR `loop-lock.ts` stale check and refresh API.
- Searched OUR non-test workflow surfaces for `refreshLoopLock` or `loop-lock.cjs refresh` callers.
- Checked deep-research/deep-review YAML lock acquisition and release steps to map the missing refresh cadence.

## Findings

1. Event-driven lifecycle persistence is the reference pattern to port, not a literal lock heartbeat.
   Reference mechanism: loop-cli-main emits `waiting` after computing `nextRunAt` in `waitForDelay` and persists lifecycle events through `wireEvents` for `run:start`, `run:end`, `paused`, `resumed`, `triggered`, `waiting`, and `stopped` [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:266] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:257].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Why it helps: add a reusable owner-scoped heartbeat driver beside `refreshLoopLock` so workflow hosts can refresh the lock at lifecycle boundaries and on a timer while dispatch is live.
   Port difficulty: med.
   Tag: quick-win.

2. OUR stale decision is time-only once the owner PID remains alive, so a long dispatch can cross the reclaim threshold unless the heartbeat is refreshed.
   Reference mechanism: loop-cli-main treats command execution as a live `running` state from `run:start` until `run:end`, with no state transition to stale merely because the command takes time [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:333] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:451].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Why it helps: `isStaleLoopLock` currently expires on `now - lastHeartbeatIso > ttlMs * 2`; a cadence helper makes live-but-slow dispatches keep the existing safety invariant without inflating TTL globally.
   Port difficulty: easy.
   Tag: quick-win.

3. Pause-aware refresh should distinguish paused ownership from dead ownership.
   Reference mechanism: loop-cli-main preserves `remainingDelayMs`, moves paused loops through `resumeResolve`, recalculates `nextRunAt` on resume, and emits `paused`/`resumed` so persisted state reflects a deliberate pause rather than a dead loop [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:127] [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:248].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`.
   Why it helps: optional lock metadata such as `phase` or `lastActivityIso` would let status output distinguish `paused`, `waiting`, and `running` holders while still reclaiming genuinely stale holders through the existing heartbeat rule.
   Port difficulty: med.
   Tag: deep-rewrite.

4. The refresh capability exists but is not wired into the active deep-research loop path.
   Reference mechanism: loop-cli-main centralizes persistence in the manager and suppresses duplicate writes by serializing the latest meta snapshot before saving [SOURCE: .opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:273].
   Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs`.
   Why it helps: the CLI already exposes `refresh --lock-path P --owner-pid PID`, but the deep command YAML only shows acquire/release steps; a host-facing heartbeat wrapper can call the existing refresh command periodically without changing every workflow step by hand.
   Port difficulty: easy.
   Tag: quick-win.

## Questions Answered

- Who calls `refreshLoopLock` during a long iteration? In the inspected non-test paths, nobody in the deep command workflows. The search found `refreshLoopLock` in the library, the CLI adapter, and tests, while `deep_research_auto.yaml` acquires the lock before classification and releases it after save/exit.
- Should OUR loop system adopt the reference mechanism? Yes, but as a runtime lock-owner heartbeat cadence inspired by loop-cli-main lifecycle persistence, not by copying a nonexistent reference lock heartbeat.

## Questions Remaining

- The implementation plan still needs to choose where the timer is owned: `loop-lock.ts` helper, `loop-lock.cjs` long-running wrapper, or executor-audit dispatch wrapper.
- If lock metadata grows a `phase`, the migration rules for existing lock files need to stay backward-compatible because stale lock cleanup may read old records.

## Next Focus

S3-02: map the nearest single-flight/process-management mechanism onto OUR lock/process layer, with special attention to whether lock refresh should remain advisory or become daemon/lease managed.
