# cli-hermes Skill Benchmark Report

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live and hermetic · cli-pi orchestrator on llmgateway/deepseek-v4.1-flash (--thinking high) · sessions on glm-5.3-flash · phase-008-third-pass

**Verdict: PASS** — 43 of 44, with the single FAIL a model-disagreement signal rather than a product defect.

---

## 1. TALLY

| Tier | Total | PASS | FAIL | SKIP |
|---|---|---|---|---|
| Live | 30 | 29 | 1 | 0 |
| Hermetic | 14 | 14 | 0 | 0 |
| **All** | **44** | **43** | **1** | **0** |

The hermetic suite reported 18 of 18 tests, the fourteen matrix cells plus three support checks and the opt-in live transport probe enabled with `DEEP_LOOP_CLI_HERMES_LIVE=1`.

---

## 2. LIVE SCENARIOS

| ID | Category | Verdict | Exit | Elapsed | Evidence |
|---|---|---|---|---|---|
| HERMES-001 | cli-invocation | **PASS** | 0 | 14 | sanctioned shape answered ALIVE on -t file,todo |
| HERMES-002 | cli-invocation | **PASS** | 0 | 9 | --query-file - delivered quotes, $(...), backticks and $HOME verbatim |
| HERMES-003 | cli-invocation | **PASS** | 1 | 7 | off-roster id exited 1 with the gateway HTTP 400 on stdout |
| HERMES-021 | cli-invocation | **PASS** | 0 | 0 | hermes config get printed the gateway base_url; hermes status still hides custom providers |
| HERMES-004 | permission-modes | **PASS** | 0 | 29 | flagged rm -rf refused without --yolo; scratch directory survived |
| HERMES-005 | permission-modes | **PASS** | 0 | 18 | same command with --yolo ran; directory gone, no refusal text |
| HERMES-006 | permission-modes | **PASS** | 0 | 19 | ordinary write without --yolo produced the file and FINISHED |
| HERMES-007 | permission-modes | **PASS** | 0 | 137 | read succeeded; write_file returned the read-only refusal and the target stayed absent |
| HERMES-008 | agent-routing | **PASS** | 0 | - | agent-router template returned ROUTER_OK and the canonical command path |
| HERMES-023 | agent-routing | **PASS** | 0 | - | PERSONA=markdown with the agent's H1 quoted from the preloaded agent skill |
| HERMES-009 | prompt-templates | **PASS** | 0 | 14 | template round trip returned TEMPLATE_OK and the canonical path |
| HERMES-022 | prompt-templates | **PASS** | 0 | 22 | gate passed the 65-byte capture and tripped on a known-empty one; self-healing control demoted to advisory |
| HERMES-011 | session-continuity | **PASS** | 0 | 13 | --resume recalled the prior turn and re-emitted the same session id |
| HERMES-012 | cost-and-background | **PASS** | 0 | 179 | run-budget wrap-up notice logged; answer carried a budget-acknowledging caveat |
| HERMES-013 | cost-and-background | **PASS** | 0 | 48 | serial rerun: cap fired and max_iterations_reached(1/1) logged; first attempt stalled under three-way gateway concurrency |
| HERMES-014 | git-preflight-advisory | **PASS** | 0 | 52 | sk-git advisory naming commit-scope-drops-untracked appended to the terminal result after the advisories moved to the transform hook |
| HERMES-015 | goal-hook | **PASS** | 0 | - | session quoted the frozen repo-guards-session-context section |
| HERMES-020 | goal-hook | **PASS** | 0 | - | bound packet path and objective quoted from the goal section |
| HERMES-028 | goal-hook | **PASS** | 0 | - | write-intent first turn carried ADVISOR and GATE; a read-only-worded probe correctly carried no gate |
| HERMES-030 | goal-hook | **PASS** | 0 | - | shared goal core reported the packet goal under the Hermes session id |
| HERMES-010 | integration-patterns | **FAIL** | 0 | - | pair disagreed: deepseek-v4.1-flash answered --yolo, glm-5.3-flash answered --dangerously-skip-permissions; transport healthy on both, so this is the model signal the scenario exists to surface |
| HERMES-019 | integration-patterns | **PASS** | 0 | - | code_mode search_tools returned ten tools; control without the server named NO_CODE_MODE |
| HERMES-016 | skills-and-plugins | **PASS** | 0 | 22 | -s cli-hermes quoted the skill; control without it reported the skill absent |
| HERMES-017 | skills-and-plugins | **PASS** | 0 | 1 | listing enumerates 61 of 68 copies as local rows, the seven absences each carrying a quarantine line; contract corrected from the superseded no-project-rows reading |
| HERMES-018 | skills-and-plugins | **PASS** | 0 | 171 | nested hermes chat refused with the plugin's self-invocation message |
| HERMES-024 | skills-and-plugins | **PASS** | 0 | 32 | COMMENT HYGIENE WARNING appended to the write_file result |
| HERMES-025 | skills-and-plugins | **PASS** | 0 | - | delegate_task refused with the Deep Route mode mismatch under the guard's reject switch |
| HERMES-026 | skills-and-plugins | **PASS** | 0 | - | TOOLS=10 with NO_ADVISORY: the guard stays silent for the Code Mode server |
| HERMES-027 | skills-and-plugins | **PASS** | 0 | 24 | advisories section carried the worktree-guard line; the guards correctly self-suppress under an orchestrated-child marker |
| HERMES-029 | skills-and-plugins | **PASS** | 0 | 56 | vision evidence appended after the core moved off the fail-closed hook onto a 25-second budget |

---

## 3. HERMETIC CELLS

| ID | Category | Verdict | Exit | Elapsed | Evidence |
|---|---|---|---|---|---|
| cli-hermes-EC-001 | stress | **PASS** | 0 | - | hermetic cell auth-failure passed in the runtime stress suite |
| cli-hermes-EC-002 | stress | **PASS** | 0 | - | hermetic cell model-or-balance passed in the runtime stress suite |
| cli-hermes-EC-003 | stress | **PASS** | 0 | - | hermetic cell rate-limit passed in the runtime stress suite |
| cli-hermes-EC-004 | stress | **PASS** | 0 | - | hermetic cell timeout passed in the runtime stress suite |
| cli-hermes-EC-005 | stress | **PASS** | 0 | - | hermetic cell stdin-hang passed in the runtime stress suite |
| cli-hermes-EC-006 | stress | **PASS** | 0 | - | hermetic cell child-spec-gate passed in the runtime stress suite |
| cli-hermes-EC-007 | stress | **PASS** | 0 | - | hermetic cell sandbox-permission passed in the runtime stress suite |
| cli-hermes-EC-008 | stress | **PASS** | 0 | - | hermetic cell transport-missing passed in the runtime stress suite |
| cli-hermes-EC-009 | stress | **PASS** | 0 | - | hermetic cell budget-rejection passed in the runtime stress suite |
| cli-hermes-EC-010 | stress | **PASS** | 0 | - | hermetic cell partial-lineage-death passed in the runtime stress suite |
| cli-hermes-EC-011 | stress | **PASS** | 0 | - | hermetic cell orphan-cleanup passed in the runtime stress suite |
| cli-hermes-EC-012 | stress | **PASS** | 0 | - | hermetic cell worktree-collision passed in the runtime stress suite |
| cli-hermes-EC-013 | stress | **PASS** | 0 | - | hermetic cell node-modules-integrity passed in the runtime stress suite |
| cli-hermes-EC-014 | stress | **PASS** | 0 | - | hermetic cell self-invocation passed in the runtime stress suite |

---

## 4. WHAT THIS PASS CHANGED

Two product defects, both in the Hermes project plugin and both fixed and re-verified live in this pass:

- Three advisories were computed in `pre_tool_call` and stashed under an exact string key for `transform_tool_result` to pop. The hand-off does not survive a live session, so the sk-git advisory never reached the terminal result. All three now compute inside the transform hook and the staging dict is gone.
- The sk-vision core ran on `pre_tool_call`, the one hook Hermes fails closed on timeout, while needing about 12.5 s against a 15-second budget. It now runs on the fail-open transform hook with its own 25-second budget.

Two documentation claims were false and are corrected: `hermes skills list` does enumerate the project skills, and a quarantined copy is not reachable through `-s`. Two scenarios could not fail honestly and were rewritten: `HERMES-022`'s control self-heals, and `HERMES-014` never created the condition its rule reports on.

Full reasoning in [`findings-and-recommendations.md`](./findings-and-recommendations.md); the one FAIL and the four first-attempt failures are in [`failed-runs.md`](./failed-runs.md).
