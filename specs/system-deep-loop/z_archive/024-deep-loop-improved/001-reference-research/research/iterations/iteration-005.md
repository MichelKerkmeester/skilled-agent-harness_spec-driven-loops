# Iteration 5: S1-05 Fixed-Rate Overrun and Skipped Iterations

## Focus

Dimension: D1 source-mining.

Focus area: [S1-05] How does `loop-cli-main` detect interval overrun and account for skipped iterations (`skippedCount`) under fixed-rate scheduling? Target mapping: deep-loop-runtime iteration cadence.

## Actions Taken

- Read the deep-research skill quick reference and state output contracts for iteration artifact and JSONL expectations.
- Confirmed S1-05 was still open in the registry/strategy and checked iterations 3-4 to avoid duplicating run-now and lifecycle findings.
- Source-mined `loop-cli-main/src/core/loop-controller.ts`, `src/types.ts`, `src/daemon/manager.ts`, architecture notes, and cadence-adjacent tests.
- Mapped the mechanism onto OUR cadence surfaces in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `.opencode/commands/deep/assets/deep_research_auto.yaml`, and `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`.

## Findings

### Finding S1-05A: Fixed-Rate Scheduling Uses Run Start Time, Not Finish Time

Reference mechanism: `loop-cli-main` captures `runStartedAtMs` immediately before command execution, then after the command finishes computes `nextSlotMs = runStartedAtMs + interval` and `overrunMs = Date.now() - nextSlotMs` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:337`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:484`]. If the run overran the slot, it computes `missed = floor(overrunMs / interval) + 1`, increments `skippedCount`, and waits `interval - (overrunMs % interval)` to realign with the next fixed-rate slot [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:486`].

Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`. This helps because the runtime already has a cadence-like heartbeat via `startLineageProgressHeartbeat()` [TARGET: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:299`], but that timer only emits progress and does not expose a reusable fixed-rate iteration cadence primitive with overrun accounting.

Port difficulty: med.

Tag: quick-win.

### Finding S1-05B: Skipped Iterations Are Persisted As Loop Metadata

Reference mechanism: `skippedCount` is part of the controller's recoverable state shape, private runtime state, constructor restore path, `getMeta()` output, and public `LoopMeta` contract [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:25`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:55`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:84`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:203`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:86`]. The daemon manager forwards `controller.getMeta()` into persisted loop metadata, so the count survives manager-level serialization rather than living only in logs [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:297`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because `step_read_state` currently extracts iteration count, ratios, focus, and question coverage [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:429`], while `step_update_tracking` only advances `current_iteration` and `stuck_count` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:841`]. A portable backlog item is to add cadence fields such as `scheduledIteration`, `skippedIterationCount`, and `lastScheduledSlotAt` to canonical iteration/event records.

Port difficulty: med.

Tag: quick-win.

### Finding S1-05C: Overruns Are Counted, Not Replayed As A Backlog

Reference mechanism: `loop-cli-main` awaits the active command before any next scheduling decision, so executions cannot overlap [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:362`]. Its own architecture note states that the controller awaits command completion before scheduling the next interval to prevent pile-ups [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/ARCHITECTURE.md:438`]. The overrun branch then records missed slots and waits until the next aligned slot instead of launching missed iterations immediately [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:486`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because the deep-research loop currently returns directly to `step_read_state` after tracking updates [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:848`]. For scheduled unattended loops, the backlog item is a no-backlog catch-up policy: if an iteration exceeds the configured cadence, append a skipped-slot event and wait for the next aligned slot rather than dispatching back-to-back recovery iterations.

Port difficulty: hard.

Tag: deep-rewrite.

### Finding S1-05D: Porting Needs Explicit Overrun Tests

Reference mechanism: `loop-cli-main` exposes `skippedCount` in metadata, but test evidence found in this pass only asserts the default `skippedCount: 0` shape in project fixtures [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/projects.test.ts:149`]. Its controller tests cover interval waits, pause/resume, trigger-now, and active-run rejection [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:87`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:101`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:134`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:162`], but no dedicated overrun/skipped-slot assertion surfaced.

Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`. This helps because OUR fanout tests already cover progress heartbeat cadence on/off behavior [TARGET: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:603`], so the quick win is to add fake-clock tests for fixed-rate overrun math, multi-slot skips, and no-backlog replay before wiring cadence into workflow YAML.

Port difficulty: easy.

Tag: quick-win.

## Questions Answered

- Answered S1-05. `loop-cli-main` detects overrun by comparing the current time after a run to `runStartedAtMs + interval`; it increments `skippedCount` by the number of missed fixed-rate slots and waits only until the next aligned interval boundary.
- Answered the scheduling policy implication. The reference repo counts missed intervals rather than queueing them, preserving single-flight/no-overlap behavior while still making cadence loss observable.

## Questions Remaining

- S1-06 remains open: byte-offset log regions via `log-parser.ts` and `runHistory[].logOffset`.
- S1-07 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

[S1-06] Mine how `loop-cli-main` slices one append-only log into per-run regions via byte offsets (`log-parser.ts`, `runHistory[].logOffset`) and map it to deep-loop-workflows iteration logging.
