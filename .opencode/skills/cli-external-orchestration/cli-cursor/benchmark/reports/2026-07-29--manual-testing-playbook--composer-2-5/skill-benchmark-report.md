# Skill Benchmark Report — cli-cursor

> Hand-authored render styled after the Lane C report shape; not produced by `build-report.cjs` — this run has no Lane C D1-D5 scoring pass, it is a manual-testing-playbook live-validation capture. Derived after the fact from this run's stored record, not written at run time. Scoring: `not recorded` · trace mode: `live`.

**Verdict: PASS (recorded-evidence tier)**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | not recorded |
| D1 intra (router) | — | not recorded |
| D2 discovery | — | not recorded |
| D3 efficiency | — | not recorded |
| D4 usefulness | — | not recorded |
| D5 connectivity | — | not recorded |

D1-D5 do not apply to this run — it validates whether the goal-hook `sessionStart` adapter fires and whether its injection reaches the model-visible transcript, not skill routing, discovery, or usefulness. The normative rubric lives in `.opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md`; this run does not use it.

## Provenance & execution context

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/cli-external-orchestration/cli-cursor` |
| Spec packet | `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation` |
| Playbook scenario | `CU-027` at `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md` |
| Captured | 2026-07-29 |
| Executor / model | claude / composer-2.5 (paid) |
| Canary | `GOALCANARY-CU-349522064` |
| Command shape | `MK_GOAL_STATE_DIR=<iso> MK_GOAL_RUNTIME_LABEL=Cursor cursor-agent -p "<prompt>" --output-format text --model composer-2.5 --auto-review --sandbox enabled </dev/null` |

## Funnel

_Not applicable — no Lane C funnel was computed for this manual capture._

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| CU-027 | not recorded | sessionstart-injection | not-recorded | passed |

## Methodology / caveats

- This is a manual-testing-playbook live-validation capture, not a Lane C router-replay or model-dispatch scoring pass.
- Proof method: a canary token was seeded into the active-goal objective; a real `cursor-agent -p` session was dispatched under an isolated `MK_GOAL_STATE_DIR`, `turns_used` was confirmed to move `0` -> `1` (proving the `sessionStart` hook fired and called `recordTurn`), and the real Cursor agent-transcript JSONL was grepped for the canary and the `[active_goal` marker.
- **The PASS condition is deliberately two-part and inverted from a naive reading**: PASS requires BOTH the hook firing (adapter-level evidence) AND the injected content being absent from the model-visible transcript (`0`/`0` grep counts). Cursor's `sessionStart` `agent_message` channel is confirmed non-delivering to the model (n=3 across this run and prior phase-004 capability probes); `preToolUse` `agent_message` is also non-delivering and `stop` never fires, so `sessionStart` is the only adapter this runtime gets. A transcript match would indicate an undocumented behavior change requiring escalation, not this run's expected result.
- Scenario count: 1.
- The model reply itself was cut off by the harness command cap before completion; this does not affect the verdict since the turn-counter increment and the transcript-absence grep are the load-bearing, independently-confirmed signals.
