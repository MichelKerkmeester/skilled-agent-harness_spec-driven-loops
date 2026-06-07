---
title: "CONV-002 -- Relevance Gate"
description: "This scenario validates the Relevance Gate for `CONV-002`. It focuses on the combined host-saturation + graph-decision acceptance rule and the STOP_BLOCKED → CONTINUE override when blocking guards fail."
---

# CONV-002 -- Relevance Gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CONV-002`.

---

## 1. OVERVIEW

This scenario validates the Relevance Gate for `CONV-002`. It focuses on `step_check_convergence` in the auto YAML requiring BOTH `host_saturated` (low_progress_streak ≥ K consecutive iterations) AND `graph_decision == "STOP_ALLOWED"` before accepting STOP. When the graph returns `STOP_BLOCKED`, the workflow emits a `blocked_stop` event, records the blocker names, injects a recovery hint targeting the failing gate, and forces `decision = "CONTINUE"`. Blocking conditions: `sliceCoverage < 0.70`, `relevanceFloor < 0.50`, `agreementRate < 0.50`.

### Why This Matters

The dual-gate design prevents two failure modes: (1) the host stopping on raw iteration count when the collected context is tangential noise, and (2) the graph blocking a well-saturated loop because of a transient relevance dip from a single iteration. Both gates must agree before the loop exits, and the operator must be told exactly which gate failed when STOP is blocked.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CONV-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the dual-gate STOP acceptance rule and the STOP_BLOCKED → blocked_stop → CONTINUE path in the YAML and convergence reference docs.
- Real user request: `Verify that deep-context requires both saturation and graph agreement before stopping, and surfaces blocker names when the graph blocks a stop.`
- Prompt: `As a manual-testing orchestrator, validate the relevance gate and stop-acceptance contract for deep-context against the auto YAML step_check_convergence, convergence.md §4, and SKILL.md §6 quality gates. Verify STOP requires both host_saturated and graph_decision STOP_ALLOWED; STOP_BLOCKED records blocker names and forces CONTINUE; blocking conditions include sliceCoverage less than 0.70, relevanceFloor less than 0.50, and agreementRate less than 0.50. Return a concise verdict.`
- Expected execution process: Read auto YAML for `step_check_convergence`; read convergence.md §4 for STOP_BLOCKED conditions; read SKILL.md §6 for quality gate thresholds; check for `blocked_stop` event documentation.
- Expected signals: `step_check_convergence` combines host saturation and graph decision in the YAML; `convergence.md §4` shows three STOP_BLOCKED conditions with exact threshold values (0.70, 0.50, 0.50); SKILL.md §6 lists `relevanceFloor >= 0.50` as a quality gate; `blocked_stop` event and recovery hint are documented.
- Desired user-visible outcome: The loop continues when the collected context is noisy or tangentially relevant even when raw saturation math says stop, and the operator sees the exact gate name that blocked the stop.
- Pass/fail: PASS if the dual-gate acceptance rule is in the YAML and convergence.md §4 lists all three blocking conditions with exact thresholds; FAIL if either is absent or thresholds are wrong.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; grep YAML and convergence docs.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CONV-002 | Relevance Gate | Verify dual-gate STOP acceptance and STOP_BLOCKED → CONTINUE override | `Verify that deep-context requires both saturation and graph agreement before stopping, and surfaces blocker names when the graph blocks a stop.` | 1. `rg "step_check_convergence\|STOP_ALLOWED\|STOP_BLOCKED\|blocked_stop" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` -> 2. `rg "STOP_BLOCKED\|sliceCoverage.*0.70\|relevanceFloor.*0.50\|agreementRate.*0.50" .opencode/skills/deep-context/references/convergence/convergence.md` -> 3. `rg "relevanceFloor\|0\.50\|0\.70\|quality gate" .opencode/skills/deep-context/SKILL.md` -> 4. `rg "blocked_stop\|blockedStop\|recovery hint\|recovery_hint" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml .opencode/skills/deep-context/references/convergence/convergence.md` | Step 1: convergence step with both signals found; Step 2: all three STOP_BLOCKED conditions found; Step 3: quality gates in SKILL.md; Step 4: blocked_stop event and recovery hint found | Grep outputs from all four commands | PASS if steps 1-4 all return matches with correct thresholds; FAIL if dual-gate logic or any blocking threshold is absent | 1. Check convergence.md §2 specifically. 2. Search YAML for alternative step names (evaluate_convergence, check_stop). 3. Verify SKILL.md §6 section exists. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/04--convergence-detection/relevance-gate.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `step_check_convergence`: dual-gate acceptance and blocked_stop event |
| `.opencode/skills/deep-context/references/convergence/convergence.md` | §2: STOP contract, STOP_BLOCKED conditions with threshold values |
| `.opencode/skills/deep-context/SKILL.md` | §6 Success Criteria: quality gates including relevanceFloor and agreementRate |

---

## 5. SOURCE METADATA

- Group: Convergence Detection
- Playbook ID: CONV-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--convergence-detection/relevance-gate.md`
