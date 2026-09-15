# Findings And Recommendations

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live and hermetic · cli-pi orchestrator on llmgateway/deepseek-v4.1-flash (--thinking high) · sessions on glm-5.3-flash · phase-008-third-pass

This pass was the first to run every scenario in one sitting, and it earned its keep: it found one structural defect in the plugin, two false claims in the packet's own documentation, and two scenarios that could not fail honestly.

## 1. Advisories must be computed where the result is final (fixed)

Three advisories — sk-git, MCP route guard and sk-vision — were computed in `pre_tool_call` and stashed in a module-level dict keyed by an exact string, then popped in `transform_tool_result`. The pair works when both halves run in one process and fails in a live session, silently. The post-edit-quality core had already been moved to the transform hook for the same reason earlier in the packet; the other three had not. All three now compute in the transform, the staging dict is gone, and `pre_tool_call` keeps only its blocking duties.

Recommendation, already applied: treat any advisory that must reach a tool result as transform-hook work. A pre-hook may block, but it may not leave state behind for another bounded hook to find.

## 2. The vision core does not belong on a fail-closed hook (fixed)

`pre_tool_call` is the one hook Hermes fails closed on timeout: a callback that overruns blocks the tool. The sk-vision core makes a model call and needs about 12.5 s, against a 15-second budget. That is a latent hazard well beyond the lost advisory, because a slower day would have blocked image analysis outright. It now runs on the fail-open transform hook with its own 25-second budget.

## 3. Two documented claims were false (corrected)

`hermes skills list` does enumerate the project skills, 61 of 68 as `local` rows, and a quarantined copy is not reachable through `-s`. Both claims dated from the symlink design and survived into the manifest, the tools reference, `SKILL.md` and the packet records. All corrected, and the scenario was rewritten and renamed.

## 4. Two scenarios could not fail honestly (corrected)

`HERMES-022` depended on a control that self-heals: the superseded toolset still logs its deferred-tool errors and costs several times the latency, but recovers and returns the right answer, so it cannot discriminate. The gate now proves itself against a known-empty capture and the control is advisory. `HERMES-014` asserted an advisory without creating the condition the rule needs; it now creates its own probe file.

Recommendation: a scenario that depends on a failure it does not cause is not a test. Where a guard reports on repository state, the scenario should create that state.

## 5. Concurrency is a real confound for this playbook

Three parallel Pi workers each dispatching Hermes sessions produced one stalled post-cap summary stream that a serial rerun did not reproduce. The earlier finding that `--run-budget` does not bound a stalled provider stream is the same family. Run timing-sensitive scenarios serially, and treat a lone stall under parallel load as environmental until a serial run confirms it.

## 6. The orchestrated-child marker suppresses guards by design

Running the playbook from inside an orchestrated child dispatch makes every guard that keys on `AI_SESSION_CHILD` stay silent, which reads as a failure and is not one. Worth stating once in the root playbook's preconditions rather than rediscovering per scenario.
