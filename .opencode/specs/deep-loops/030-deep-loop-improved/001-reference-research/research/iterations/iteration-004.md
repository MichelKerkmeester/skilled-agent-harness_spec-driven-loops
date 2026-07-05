# Iteration 4: S1-04 Lifecycle State Machine and Resume Gate

## Focus

Dimension: D1 source-mining.

Focus area: [S1-04] What are the legal transitions in loop-cli-main's running/waiting/paused/idle/stopped state machine and how does `resumeResolve` gate the wait loop? Target mapping: deep-loop-runtime lifecycle.

## Actions Taken

- Read prior JSONL state and strategy to avoid repeating S1-01 remaining-delay persistence, S1-02 abortable chunked sleep, and S1-03 run-now scheduling.
- Mined `loop-cli-main/src/core/loop-controller.ts` for the status enum use, transition guards, pause/resume behavior, and `waitForResume()` promise gate.
- Checked `loop-cli-main/src/types.ts`, `tests/loop-controller.test.ts`, `tests/background-cli.test.ts`, and `src/daemon/manager.ts` for test-backed and persistence-backed lifecycle behavior.
- Mapped the mechanism onto current deep-loop-runtime/workflow files: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`, and `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`.

## Findings

- **Finding 1: Promote active loop statuses, not just terminal stop reasons.** `loop-cli-main` defines an explicit `LoopStatus = "running" | "paused" | "idle" | "stopped" | "waiting"` and persists it through `LoopMeta.status` plus `remainingDelayMs`/`nextRunAt` fields [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:46`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:74`]. OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`, because it currently centralizes terminal `STOP_REASONS`/`SESSION_OUTCOMES` but not active session states [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:22`]. Port difficulty: easy. Tag: quick-win.

- **Finding 2: Encode legal transition guards as a shared runtime contract.** The controller allows `pause()` only from `running|waiting`, `stopLoop()` from `running|waiting|paused`, `resume()` only when `paused && _paused && resumeResolve`, `playLoop()` only from `idle|stopped`, and `triggerNow()` refuses `running` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:102`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:113`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:127`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:140`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:161`]. OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs`, because a transition table/helper beside the enum would let `deep_research_auto.yaml`, fan-out, and validators share the same legal lifecycle vocabulary. Port difficulty: medium. Tag: quick-win.

- **Finding 3: `resumeResolve` is a one-shot gate that prevents paused waits from leaking forward.** `waitForResume()` captures a resolver, sets status to `paused` unless the saved state was `idle`, and `waitForDelay()` awaits it whenever `_paused` is true; after resume it clears the gate, resets waiting announcement, rechecks abort/reset, then resumes the countdown [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:220`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:248`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:253`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:255`]. OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, because the workflow has a pause sentinel check before dispatch but no runtime-level paused wait gate between delayed iterations [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:448`; `.opencode/commands/deep/assets/deep_research_auto.yaml:556`]. Port difficulty: medium. Tag: deep-rewrite.

- **Finding 4: Restart semantics distinguish paused from idle/stopped.** On daemon init, `loop-cli-main` reconstructs controllers with persisted status and remaining delay, auto-starts every saved state except `stopped|idle`, and the constructor marks `paused|idle` as `_paused`; tests prove a paused wait stays paused across daemon crash and only runs after `resume` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:38`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:69`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:87`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:79`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/background-cli.test.ts:292`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/background-cli.test.ts:307`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/background-cli.test.ts:321`]. OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`, because resume/reconstruction currently parses JSONL and iteration files but has no first-class active lifecycle state to distinguish "paused and resumable" from "terminally stopped" [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:170`]. Port difficulty: hard. Tag: deep-rewrite.

## Questions Answered

- [S1-04] Answered. The legal transition shape is explicit and guard-based: active work alternates between `waiting` and `running`; `pause` is admitted only from those active states; `resume` is only legal when a `resumeResolve` gate exists; `idle` behaves like a stopped-but-playable session; `stopped`/`idle` are excluded from daemon auto-start.

## Questions Remaining

- S1-05 remains open: fixed-rate overrun detection and `skippedCount`.
- S1-06 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

S1-05: interval overrun accounting and skipped-iteration cadence.
