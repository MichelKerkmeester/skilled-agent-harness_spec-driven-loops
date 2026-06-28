# Iteration 40: S6-01 Persisted Wait Crash-Resume Synthesis

## Focus

[S6-01] What would it take to port loop-cli's persisted-remaining-delay crash-resume into our loop, specifically the state schema, persist point, resume classification in `step_classify_session`, and migration risk for in-flight sessions?

## Actions Taken

- Checked prior S1-01 and S3-11 outputs to avoid repeating the raw `remainingDelayMs` mechanism.
- Re-read loop-cli's wait-state schema, wait loop, event-driven persistence, and daemon restart path.
- Mapped the mechanism onto OUR deep-research workflow state creation/classification, phase loop, fan-out spawn, and fan-out status ledger.
- Identified the migration boundary for existing packets that predate any persisted wait fields.

## Findings

1. Ranked backlog item: add a nullable wait checkpoint object to the research session schema before adding behavior.
   - Reference mechanism: loop-cli carries `nextRunAt` and `remainingDelayMs` in controller state and public loop metadata [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:22`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/types.ts:81`]. The constructor restores both from persisted state [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:77`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, where `state_paths` define config/state outputs and `step_create_config` currently initializes status and lineage without a wait checkpoint [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:94`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:284`]. Support file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`, whose locked fields currently stop at lineage/reducer/file protection [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json:22`].
   - Why it helps: a schema-first port lets resume logic distinguish "ordinary active session" from "session crashed while intentionally waiting."
   - Port-difficulty: med.
   - Tag: quick-win.

2. Ranked backlog item: create an explicit pre-dispatch wait persist point; the current auto loop has no durable wait boundary to resume.
   - Reference mechanism: loop-cli sets `remainingDelayMs`, announces `waiting` with `nextRunAt`, sleeps in chunks, and refreshes remaining time after each chunk [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:228`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:266`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:273`]. The daemon persists on the `waiting` event and skips writes when serialized state has not changed [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:257`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:279`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, which already owns fan-out orchestration paths, lineage process lifetime, progress heartbeats, and stopped summaries but not a mutable wait checkpoint [TARGET: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:518`] [TARGET: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:666`]. Support file: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, whose `appendStatusLedger()` is append-only and not enough for a decreasing `remainingDelayMs` snapshot [TARGET: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:548`].
   - Why it helps: the checkpoint should be a small atomic JSON snapshot beside the ledger, while ledger rows explain lifecycle events.
   - Port-difficulty: med.
   - Tag: quick-win.

3. Ranked backlog item: add a `resume-waiting` classifier branch instead of folding persisted waits into ordinary resume.
   - Reference mechanism: loop-cli daemon startup reloads `nextRunAt` and `remainingDelayMs` into a new controller, restarts eligible non-idle loops, then first-run delay reconstructs from `nextRunAt - now` [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:69`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:87`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:311`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, where `step_classify_session` currently classifies only `fresh`, `resume`, `completed-session`, and `invalid-state`, and ordinary resume jumps straight to `phase_loop` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:243`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:256`]. The loop then reads state and checks pause/convergence before dispatch, with no resume-wait branch [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:422`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:448`].
   - Why it helps: `resume-waiting` can sleep only the remaining wall-clock delay, clear the checkpoint when expired, and avoid immediate duplicate dispatch after a crash.
   - Port-difficulty: hard.
   - Tag: deep-rewrite.

4. Ranked backlog item: make migration nullable and conservative; old packets must remain ordinary resumes.
   - Reference mechanism: loop-cli's controller restore accepts optional state fields and defaults absent `nextRunAt`/`remainingDelayMs` to null [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:13`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:77`]. It also migrates older storage formats without requiring every loop record to carry new fields first [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/loop-cli-main/src/daemon/state.ts:45`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, where canonical path migration is already dual-read/single-write and invalid-state currently means partial or contradictory artifacts [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:213`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:249`]. Support file: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json`, which already declares a migration window and immutable config protection [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json:60`] [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json:61`].
   - Why it helps: absent wait fields should not turn existing in-flight sessions into invalid packets; only a valid `status: waiting` checkpoint with parseable timestamps should activate delay resume.
   - Port-difficulty: easy.
   - Tag: quick-win.

## Questions Answered

- S6-01 is answered as a port plan: add a nullable wait checkpoint schema, write it at an explicit wait boundary with atomic overwrite semantics, classify `resume-waiting` before ordinary resume, and migrate existing sessions by treating missing wait fields as null.
- The highest migration risk is behavioral, not storage: if wait fields are introduced without a distinct classifier branch, a crashed waiting session may dispatch immediately; if missing fields are treated as required, older packets may become invalid.

## Questions Remaining

- The auto research workflow currently dispatches back-to-back iterations rather than sleeping between iterations. A product decision is needed on whether persisted delay is for a new cadence/backoff feature, fan-out retry scheduling, or both.
- Confirm-mode parity remains unverified; this iteration mapped only `.opencode/commands/deep/assets/deep_research_auto.yaml`.

## Next Focus

S6-02: rank which crash-resume primitive should be implemented first: single-loop wait checkpoint, fan-out lineage checkpoint, or run-now sentinel integration.
