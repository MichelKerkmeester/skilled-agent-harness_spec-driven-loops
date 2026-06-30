# Iteration 30: S4-07 Run-Now Sentinel Target Mapping

## Focus

[S4-07] Could deep-research add a loop-cli-style force-trigger "run now" sentinel at `research/.deep-research-run-now` alongside the existing pause sentinel?

This pass treats the earlier S1-03 forced-run scheduling findings as prior art. The new target-mapping question is the file-sentinel UX: where it belongs in `.opencode/commands/deep/assets/deep_research_auto.yaml`, how it should interact with `research/.deep-research-pause`, and how to avoid repeated forced dispatch from one stale file.

## Actions Taken

- Read the deep-research quick reference and output reference to confirm the leaf iteration output contract and the canonical pause sentinel location.
- Searched the registry, prior iterations, and deltas for S4-07 and S1-03 to avoid duplicating the broader `triggerNow()` schedule-restoration findings.
- Mined `loop-cli-main` trigger control flow from typed IPC request to daemon admission guard, manager persistence, controller forced-run behavior, and trigger-focused tests.
- Inspected `.opencode/commands/deep/assets/deep_research_auto.yaml` state paths, `step_check_pause_sentinel`, dispatch validation, reducer, and loop-return steps to locate the exact insertion points.

## Findings

1. **Rank 1 - Add `run_now_sentinel` beside `pause_sentinel` in `state_paths`.**

   Reference mechanism: `loop-cli-main` models run-now as a first-class control-plane request, not as ordinary loop state; the request union includes `type: "trigger"` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:99`], the daemon handles it in its own branch [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:151`], and accepted triggers route through `manager.trigger()` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:213`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, specifically the state path block where `pause_sentinel` is already canonical [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:94`; `.opencode/commands/deep/assets/deep_research_auto.yaml:104`]. Add `run_now_sentinel: "{artifact_dir}/.deep-research-run-now"` there so every later step uses the shared packet-local path.

   Why it helps: deep-research currently has a packet-local pause control but no comparable operator-triggered immediate-run control. A sibling state path gives the YAML a daemon-free equivalent to loop-cli's trigger IPC.

   Port difficulty: easy. Tag: quick-win.

2. **Rank 2 - Make two-sentinel precedence explicit in `step_check_pause_sentinel`.**

   Reference mechanism: `LoopController.triggerNow()` refuses only an active `running` loop, snapshots the remaining delay, sets `_forceRun`, and resumes a paused loop if needed [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:161`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:165`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:173`]. Its wait loop checks `_forceRun` before the pause branch [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:233`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:248`], and tests show a trigger interrupts sleep immediately [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:134`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, specifically `step_check_pause_sentinel` [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:448`]. To match loop-cli semantics, insert a `step_check_run_now_sentinel` before the pause halt, or expand the pause step into a two-sentinel decision table: run-now present means accept one immediate dispatch; pause-only means emit `userPaused` and halt.

   Why it helps: if pause is checked first forever, `research/.deep-research-run-now` cannot force a run while paused, which is the central loop-cli behavior. If the team wants pause to remain a hard safety latch, encode the opposite rule deliberately and log a `run_now_rejected_pause` event rather than leaving precedence implicit.

   Port difficulty: med. Tag: quick-win.

3. **Rank 3 - Consume the run-now sentinel exactly once and persist the outcome.**

   Reference mechanism: after `controller.triggerNow()` accepts, the manager immediately persists the changed controller snapshot [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:216`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:218`], and manager event wiring persists `triggered` alongside run, pause, resume, waiting, and stop events [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:263`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/manager.ts:268`]. Tests also assert an active run rejects a second trigger [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/tests/loop-controller.test.ts:162`].

   Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`, specifically before `step_dispatch_iteration` and before post-dispatch validation [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:582`; `.opencode/commands/deep/assets/deep_research_auto.yaml:756`]. The workflow should append a canonical `runNowAccepted` or `runNowRejected` event, remove or rename the sentinel after acceptance, and then dispatch. Validation/reducer steps already provide the post-dispatch checkpoint [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:780`].

   Why it helps: a raw file sentinel is level-triggered. Without one-shot consumption, the loop can force every subsequent pass until the operator notices. Logging the accepted/rejected outcome gives dashboards and reducers the same explainability that loop-cli gets through persisted trigger events.

   Port difficulty: med. Tag: quick-win.

## Questions Answered

- S4-07: Yes, a `research/.deep-research-run-now` sentinel is feasible and maps cleanly to `.opencode/commands/deep/assets/deep_research_auto.yaml`. The minimal backlog item is a sibling `state_paths.run_now_sentinel`, a pre-pause run-now check, one-shot sentinel consumption, and canonical JSONL lifecycle events.
- S4-07 is not a full duplicate of S1-03: S1-03 covered forced-run scheduling, saved delay restoration, double-run guards, and event persistence. This iteration maps the operator-facing file sentinel and its pause-sentinel precedence.

## Questions Remaining

- Decide the product semantics when both sentinels exist. Loop-cli parity means run-now can override/resume pause; stricter safety means pause wins and run-now is rejected with an explicit event.
- Mirror scope is unresolved: this pass targeted `deep_research_auto.yaml` only, but confirm-mode parity would need a separate check if the same UX should exist under approval-gated research.

## Next Focus

[S4-08] How can the `advisorRouting` projection be kept from drifting from `mode-registry.json`, and should the drift-guard become a generator?
