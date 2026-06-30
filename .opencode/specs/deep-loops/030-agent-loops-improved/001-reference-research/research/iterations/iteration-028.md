# Iteration 28: S4-04 Single-Loop Telemetry Heartbeat

## Focus

Dimension D2 target-mapping. Investigated how to add a single-loop telemetry heartbeat to `.opencode/commands/deep/assets/deep_research_auto.yaml` so a non-fan-out run emits the same observable `orchestration-status.log` JSONL lifecycle as fan-out.

## Actions Taken

- Checked prior research for `S4-04`, heartbeat, status-ledger, and fan-out duplication; nearby prior work covered lock heartbeat, cadence, and fan-out stall recovery, but not the single-executor YAML telemetry gap.
- Read OUR fan-out ledger and progress heartbeat paths: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, and `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`.
- Read OUR single-executor loop path in `.opencode/commands/deep/assets/deep_research_auto.yaml`, especially `phase_loop`, `step_dispatch_iteration`, `post_dispatch_validate`, and error handling.
- Mined loop-cli-main for event-wired state persistence and run metadata, plus kasper for append-only structured logging and configurable polling/progress logging.

## Findings

1. Add single-executor `started` and terminal `completed`/`failed` ledger rows around `step_dispatch_iteration`.
   - Reference mechanism: loop-cli-main turns runtime state transitions into persisted daemon state by wiring `run:start`, `run:end`, `paused`, `resumed`, `triggered`, `waiting`, and `stopped` to `persist()` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:257`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:263`]. The controller marks a run `running`, increments `runCount`, emits `run:start`, and later completes the matching run-history record [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:333`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:342`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:372`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. The insertion points are before executor dispatch at `step_dispatch_iteration` and after `post_dispatch_validate` / `on_missing_outputs` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:582`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:756`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:824`].
   - Why it helps: fan-out already emits `started`, `completed`, and `failed` events per lineage through `runCappedPool()` [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:245`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:253`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:269`]. A single-executor run should use the same event names with `label: "single"` or `label: "main"` and `index: 0`.
   - Port difficulty: med. Tag: quick-win.

2. Add a dispatch-duration `progress` heartbeat while a lone executor is running.
   - Reference mechanism: loop-cli-main exposes live wait/run state through `status`, `nextRunAt`, `remainingDelayMs`, `runHistory`, and `skippedCount` in `getMeta()` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:189`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:201`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:74`]. Waiting transitions emit and persist a status update before the long sleep continues [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:266`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:269`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. The heartbeat belongs inside `step_dispatch_iteration`, starting after prompt render / pre-dispatch audit and stopping in every dispatch terminal branch [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:587`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:614`] [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:756`].
   - Why it helps: OUR fan-out path already writes periodic `progress` rows with duration and gauges via `startLineageProgressHeartbeat()` [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:299`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:305`]. The single loop can mirror that with gauges like `{lag: 0, pending: 0, failed: 0}` while the one executor is active, giving dashboards and external watchers one status stream for both modes.
   - Port difficulty: med. Tag: quick-win.

3. Gate heartbeat writes by cadence and serialized snapshot, not by every loop-state read.
   - Reference mechanism: loop-cli-main keeps `lastSerialized` per loop and returns without writing when the serialized meta is unchanged [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:23`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:279`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:281`]. Kasper separately uses configurable polling intervals, clamped in config, instead of a hard-coded tight loop [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:40`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:233`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/index.ts:421`].
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, with support from `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` if the implementation extracts a reusable helper. The workflow already reads state every iteration [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:422`], and the atomic writer already provides safe temp/fsync/rename semantics for helper-owned state [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:42`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:58`].
   - Why it helps: this prevents a single-loop heartbeat from turning every convergence/state step into noisy ledger churn. Persist only state changes plus cadence heartbeat ticks, matching the reference diff-persistence intent while preserving fan-out-compatible observability.
   - Port difficulty: med. Tag: quick-win.

4. Add parity tests that assert single-loop telemetry uses the fan-out ledger vocabulary.
   - Reference mechanism: kasper's logger appends one structured JSON object per line and treats logging failure as non-fatal [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:27`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:33`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:36`]. Kasper also logs batch progress and completion events with counts [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1185`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1192`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:1258`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts`, or a sibling workflow telemetry test if the helper lands outside `fanout-pool.cjs`. The existing tests already assert `started` + `completed`/`failed`, gauges, retry counts, orphan detection, and raw JSONL append behavior [TARGET: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:201`] [TARGET: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:217`] [TARGET: `.opencode/skills/deep-loop-runtime/tests/unit/fanout-pool.vitest.ts:515`].
   - Why it helps: the backlog item is not just "write more events"; it is parity. Tests should prove a single run produces `started -> progress* -> completed|failed|stopped` rows that existing consumers can parse with the same `orchestration-status.log` assumptions used for fan-out.
   - Port difficulty: easy. Tag: quick-win.

## Questions Answered

- S4-04: Add the single-loop heartbeat at the YAML iteration-dispatch boundary, not inside the reducer. Mirror fan-out's `orchestration-status.log` vocabulary with `started`, periodic `progress`, terminal `completed`/`failed`/`stopped`, and fan-out-shaped gauges. Use loop-cli-main's event-wired, serialize-diff persistence as the guardrail so heartbeat rows are cadence/state-change events rather than state-read noise.

## Questions Remaining

- Decide the implementation surface: inline YAML `append_to_jsonl` steps versus a small runtime helper that `deep_research_auto.yaml` invokes for `start`, `progress`, and `finish`.
- Decide the single-run label contract. `label: "single"` is clearer for dashboards; `label: "main"` may better match future non-fan-out primary-lineage terminology.
- Decide whether confirm mode should receive the same telemetry in `.opencode/commands/deep/assets/deep_research_confirm.yaml` during the same backlog item or a follow-up parity patch.

## Next Focus

S4-05: Should `reduce-state.cjs` stamp injected vs analyst-authored questions with kasper-style begin/end provenance + `injectedAtIteration` so the dashboard attributes coverage to the angle bank?
