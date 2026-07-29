# Skill Benchmark Report — cli-devin

> Hand-authored render styled after the Lane C report shape; not produced by `build-report.cjs` — this run has no Lane C D1-D5 scoring pass, it is a manual-testing-playbook live-validation capture. Derived after the fact from this run's stored record, not written at run time. Scoring: `not recorded` · trace mode: `live`.

**Verdict: PASS**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | not recorded |
| D1 intra (router) | — | not recorded |
| D2 discovery | — | not recorded |
| D3 efficiency | — | not recorded |
| D4 usefulness | — | not recorded |
| D5 connectivity | — | not recorded |

D1-D5 do not apply to this run — it validates whether the goal-hook injection reaches the model turn, not skill routing, discovery, or usefulness. The normative rubric lives in `.opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/scoring-contract.md`; this run does not use it.

## Provenance & execution context

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/cli-external-orchestration/cli-devin` |
| Spec packet | `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation` |
| Playbook scenario | `DV-022` at `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` |
| Captured | 2026-07-29 |
| Executor / model | claude / glm-5-2 (free) |
| Canary | `GOALCANARY-DV-1255523564` |
| Goal id | `goal-a95c0004-3560-4086-a3a6-65c9ca46c713` |
| Command shape | `MK_GOAL_STATE_DIR=<iso> MK_GOAL_RUNTIME_LABEL=Devin AI_SESSION_CHILD=1 devin -p --model glm-5-2 --permission-mode auto -- "<neutral prompt>" </dev/null` |

## Funnel

_Not applicable — no Lane C funnel was computed for this manual capture._

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| DV-022 | not recorded | live-injection | not-recorded | passed |

## Methodology / caveats

- This is a manual-testing-playbook live-validation capture, not a Lane C router-replay or model-dispatch scoring pass.
- Proof method: a canary token was seeded into the active-goal objective; the raw Devin transcript was grepped for the canary string and the `[active_goal]` marker, isolated via `MK_GOAL_STATE_DIR` so no run touched the real `.opencode/skills/.goal-state/` tree.
- Scenario count: 1.
- Scope: `DV-022`'s full playbook also exercises the manage-CLI envelope (model-free, validated separately via direct `bin/goal.cjs` invocation) and the `SessionStart` restore / `Stop` verify adapters (documented in the playbook, not live-exercised against a real model in this capture — Devin's real `Stop` payloads carry no transcript, leaving the verifier dormant in practice per the playbook's Supplemental Check 4). Only the live model-turn injection proof (Supplemental Check 7) is scored in this run folder.
