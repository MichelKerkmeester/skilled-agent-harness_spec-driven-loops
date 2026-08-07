## DELIVERABLE 1

Schema name: `progress_record`; JSONL discriminator: `"type":"progress"` plus `"event":"progress_record"`.

```json
{
  "schema_version": "1.3",
  "protocol": "deep-loop",
  "type": "progress",
  "event": "progress_record",
  "mode": "ai-council|context|review|improvement",
  "run": "round-001|iter-003|candidate-001",
  "phase": "Phase 2: SEAT",
  "step": "Run independent proposals",
  "unit_id": "round-001/seat-001",
  "status": "started|completed",
  "timestamp": "2026-07-03T09:00:00.000Z",
  "artifact_path": "ai-council/seats/round-001/seat-001.md"
}
```

Rules:

- Append one `started` record immediately before any step expected to run `>60s` without another state-log append or artifact write.
- Append one `completed` record only after that step actually transitions or settles.
- Do not emit timer-only heartbeats; every record must correspond to a real step transition.
- `artifact_path` is optional and only present when the transition produced or settled a concrete artifact.
- This remains additive to the append-only JSONL model (`ai-council-state.jsonl` is append-only, one state event per line) and follows the additive-only evolution policy where old readers ignore compatible additions `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/state_format.md:16`, `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/state_format.md:116-122`.

## DELIVERABLE 2

Council insertion points:

- Seat step: `Phase 2: SEAT`; append `started/completed` around each distinct seat proposal because seats are distinct mandates and must produce recommendation/tradeoffs/risks/evidence `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/loop_protocol.md:53-73`.
- Critique step: `PHASE 3: CRITIQUE AND CONVERGE`; append around `Run cross-seat critique before declaring agreement` `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/loop_protocol.md:77-80`.
- Adjudication step: append around convergence adjudication, i.e. `Apply two-of-three convergence or emit non-converged status` `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:302-305`.

Council representative before/after:

```text
Before:
STEP 2: Deliberate And Converge
       |-- Run independent proposals
       |-- Run adversarial cross-seat critique
       |-- Apply two-of-three convergence or emit non-converged status
```

```text
After:
STEP 2: Deliberate And Converge
       |-- Run independent proposals
       |-- append {"type":"progress","event":"progress_record","mode":"ai-council","run":"round-001","phase":"STEP 2: Deliberate And Converge","step":"Run adversarial cross-seat critique","unit_id":"round-001/critique","status":"started","timestamp":"..."}
       |-- Run adversarial cross-seat critique
       |-- append {"type":"progress","event":"progress_record","mode":"ai-council","run":"round-001","phase":"STEP 2: Deliberate And Converge","step":"Run adversarial cross-seat critique","unit_id":"round-001/critique","status":"completed","timestamp":"...","artifact_path":"ai-council/deliberations/round-001.md"}
       |-- Apply two-of-three convergence or emit non-converged status
```

Context insertion points:

- Sweep launch: before `step_parallel_sweep`, append one `started` record for `unit_id:"iter-{current_iteration}/sweep"` because the step dispatches the whole pool concurrently and barrier-joins `.opencode/commands/deep/assets/deep_context_auto.yaml:408-416`.
- Native per-seat settle: after the host writes each native return to `{state_paths.seat_dir}/iter-{current_iteration}/{seat.label}.json`, append `completed` for that seat `.opencode/commands/deep/assets/deep_context_auto.yaml:418-435`.
- CLI per-seat settle: after the host writes each CLI return to the same seat JSON path, append `completed` for that seat `.opencode/commands/deep/assets/deep_context_auto.yaml:437-461`.
- Sweep aggregate settle remains the existing `sweep_settled` event in `step_collect_seat_findings`; do not replace it `.opencode/commands/deep/assets/deep_context_auto.yaml:496-504`.

Context representative before/after:

```yaml
Before:
step_sweep_cli_pool:
  description: "Dispatch ALL CLI seats as ONE-SHOT analysis seats over the SHARED focus, in parallel"
  ...
  dispatch_seat: |
    ...
    The host then writes each seat's returned findings JSON to {state_paths.seat_dir}/iter-{current_iteration}/{seat.label}.json.
```

```yaml
After:
step_sweep_cli_pool:
  description: "Dispatch ALL CLI seats as ONE-SHOT analysis seats over the SHARED focus, in parallel"
  append_progress_started_per_seat:
    record: '{"type":"progress","event":"progress_record","mode":"context","run":"iter-{current_iteration}","phase":"step_parallel_sweep","step":"step_sweep_cli_pool","unit_id":"iter-{current_iteration}/{seat.label}","status":"started","timestamp":"{ISO_8601_NOW}"}'
  dispatch_seat: |
    ...
    The host then writes each seat's returned findings JSON to {state_paths.seat_dir}/iter-{current_iteration}/{seat.label}.json.
  append_progress_completed_per_seat:
    record: '{"type":"progress","event":"progress_record","mode":"context","run":"iter-{current_iteration}","phase":"step_parallel_sweep","step":"step_sweep_cli_pool","unit_id":"iter-{current_iteration}/{seat.label}","status":"completed","timestamp":"{ISO_8601_NOW}","artifact_path":"{state_paths.seat_dir}/iter-{current_iteration}/{seat.label}.json"}'
```

## DELIVERABLE 3

Reducer safety rule: completion reducers must use an explicit allowlist for completion-bearing records and ignore `type:"progress"` / `event:"progress_record"` for completion math; this matches review’s existing rule that only `type === "iteration"` counts and all other types are silently ignored `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:79`, and council’s compatibility rule that v1 readers ignore added non-core events without error `.opencode/skills/deep-loop-workflows/deep-ai-council/references/structure/state_format.md:167`.

## DELIVERABLE 4

The watchdog resets because each progress append changes the state-log artifact mtime, matching the benchmark runner’s no-progress condition: no new event and no artifact mtime change `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/001-framework-and-harness/spec.md:73`.

It does not mask real stalls because records are transition-bound, not timer-bound:

- `started` only fires before a real long step launch.
- `completed` only fires after an actual seat/unit settle.
- A hung seat with no settle produces no further records and still trips the watchdog window.
- Partial evidence can still score D1-D3 while D4 remains failed when the terminal completion is missing, matching the benchmark edge-case rule `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/001-framework-and-harness/spec.md:157`.

033 verification cells:

- `ACB-004` and `ACB-005` verify council liveness because they are the demanding multi-seat cells with observed `stuck_no_progress` on GPT legs `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement/scorecard.md:18-20`, `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement/scorecard.md:50`.
- `CXB-004` verifies context liveness because both GPT legs produced initial output then went silent past the watchdog `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context/scorecard.md:26`, `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context/scorecard.md:66`.
- `IMB-001-high` verifies partial credit because it produced candidate plus evaluator score but exceeded the budget before natural completion `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement/scorecard.md:20`, `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement/scorecard.md:52`.
