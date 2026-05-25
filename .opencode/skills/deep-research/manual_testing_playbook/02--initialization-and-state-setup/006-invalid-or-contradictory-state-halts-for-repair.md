---
title: "DR-006 -- Invalid or contradictory state halts for repair"
description: "Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path."
---

# DR-006 -- Invalid or contradictory state halts for repair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-006`.

---

## 1. OVERVIEW

This scenario validates invalid or contradictory state halts for repair for `DR-006`. The objective is to verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.

### WHY THIS MATTERS

Deep-research continuity depends on trustworthy state; silently guessing through contradictory artifacts would corrupt later synthesis.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.
- Real user request: My deep-research scratch folder looks half-broken. Will the workflow repair it automatically or stop?
- Prompt: `Validate invalid deep-research state halts for repair instead of guessing through partial or contradictory artifacts.`
- Expected execution process: Inspect the protocol rules, inspect YAML invalid-state handling, then compare the result against README troubleshooting language.
- Desired user-visible outcome: The user is warned clearly that broken state must be repaired or archived before continuing.
- Expected signals: Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state.
- Pass/fail posture: PASS if the contract consistently halts on contradictory state; FAIL if any source implies silent auto-repair for invalid-state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate invalid deep-research state halts for repair instead of guessing through partial or contradictory artifacts.
### Commands
1. `bash: rg -n 'invalid-state|halt for repair|contradictory|guessing' .opencode/skills/deep-research/references/protocol/loop_protocol.md .opencode/skills/deep-research/SKILL.md`
2. `bash: rg -n 'on_invalid_state|halt: true|incomplete or contradictory' .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml .opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml`
3. `bash: rg -n 'State file corrupt|repair|recover' .opencode/skills/deep-research/README.md`
### Expected
Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state.
### Evidence
Capture the invalid-state rules, the YAML halt messages, and the troubleshooting wording together.
### Pass/Fail
PASS if the contract consistently halts on contradictory state; FAIL if any source implies silent auto-repair for invalid-state.
### Failure Triage
Distinguish invalid-state from recoverable JSONL corruption and verify both YAML files stop rather than continue.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Invalid-state contract; use `ANCHOR:phase-initialization` |
| `.opencode/skills/deep-research/SKILL.md` | Rule-level guardrails; use `ANCHOR:rules` |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Halt behavior; inspect `step_classify_session` |
| `.opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml` | Halt behavior; inspect `step_classify_session` |
| `.opencode/skills/deep-research/README.md` | Troubleshooting boundary; use `ANCHOR:troubleshooting` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-research/` as of 2026-03-19.
