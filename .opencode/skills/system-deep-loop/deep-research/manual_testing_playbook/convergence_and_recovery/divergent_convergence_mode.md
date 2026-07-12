---
title: "DR-064 -- Divergent convergence mode"
description: "Verify eligible research STOP pivots, hard terminal boundaries, and unchanged non-divergent mode routing."
version: 1.14.0.1
---

# DR-064 -- Divergent convergence mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-064`.

---

## 1. OVERVIEW

This scenario validates divergent research convergence. The objective is to prove that only eligible legal STOP reasons pivot into a new focus, while hard terminal boundaries and the three pre-existing modes retain their own paths.

### WHY THIS MATTERS

A convergence modifier must broaden a saturated research direction without weakening iteration ceilings or silently changing established convergence behavior.

---

## 2. SCENARIO CONTRACT

Operators should run this as a deterministic shipped-control-flow inspection. The scenario is complete only when the eligible branch, excluded reasons, native Council shape, continuation target, and non-divergent branches are all captured.

- Objective: Verify `composite_converged` and `all_questions_answered` can pivot in divergent mode, `maxIterationsReached` never pivots, and `off`, `default`, and `sliding-window` remain outside divergent translation.
- Real user request: Check that divergent research broadens a legally saturated direction without bypassing max iterations or changing the existing convergence modes.
- Prompt: `Validate the shipped deep-research divergent convergence branch, hard terminal boundary, and existing-mode isolation.`
- Expected execution process: Inspect the four-value runtime enum, then the research convergence decision order and divergent branch, then the adapter continuation and artifact contract.
- Desired user-visible outcome: The user gets a PASS only when an eligible STOP selects a new focus and returns to the loop, while max iterations still synthesizes and no non-divergent mode can enter the pivot branch.
- Expected signals: Exact eligible reasons `composite_converged` and `all_questions_answered`; excluded `maxIterationsReached`; branch predicate requires `convergence_mode == 'divergent'`; successful result binds `next_focus` and proceeds to the loop; adapter requires three native seats and writes pivot-local Council artifacts.
- Pass/fail posture: PASS if every signal is present and the existing modes have no route into divergent preparation. FAIL if max iterations can dispatch a pivot, an eligible pivot routes directly to synthesis after success, or any non-divergent mode enters the pivot branch.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the requested invariants before inspecting implementation details.
2. Run the commands in order and capture complete matching blocks, not isolated words.
3. Trace the successful pivot branch through focus restoration and loop continuation.
4. Return PASS or FAIL with the exact eligible and excluded reason strings.

### Prompt

Validate the shipped deep-research divergent convergence branch, hard terminal boundary, and existing-mode isolation.

### Commands

1. `bash: rg -n "VALID_CONVERGENCE_MODES|parseConvergenceModeValue|sliding-window|divergent" .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs`
2. `bash: rg -n -C 8 "if iteration_count >= max_iterations|convergence_mode == \"off\"|reason = \"composite_converged\"|if_divergent_eligible|eligible_reasons|excluded_reasons" .opencode/commands/deep/assets/deep_research_auto.yaml`
3. `bash: rg -n -C 10 "step_apply_divergent_pivot_result|next_focus|proceed_to: step_rejected_pattern_cache|skip_to: phase_synthesis" .opencode/commands/deep/assets/deep_research_auto.yaml`
4. `bash: rg -n "Exactly three Council seat mandates|round: 1|recursionAllowed: false|divergent.*pivots|pivot_completed|next: 'CONTINUE'" .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts`

### Expected

The enum contains `default`, `off`, `sliding-window`, and `divergent`. The YAML checks max iterations before convergence modes, skips convergence STOP candidates for `off`, and gates pivot preparation on divergent mode plus one of the two eligible reasons. A completed pivot restores `next_focus` and proceeds back toward dispatch; the adapter's completed lifecycle points to `CONTINUE` and its artifacts live below `divergent/pivots/<pivotId>/council`.

### Evidence

Capture the enum line, convergence decision-order excerpt, full eligibility contract, completed-result branch, and adapter invariant/path lines.

### Pass/Fail

PASS if the captured control flow proves eligible legal STOP continuation, `maxIterationsReached` exclusion, and non-divergent mode isolation. FAIL if any required predicate, exclusion, restoration, or continuation edge is absent or contradictory.

### Failure Triage

Privilege `step_handle_convergence` for eligibility and `step_check_convergence` for hard-stop precedence. Use the adapter only for transaction mechanics and continuation state; it does not own research STOP legality.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature_catalog/convergence/divergent_convergence_mode.md` | Feature-catalog source describing the shipped research modifier |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Four-value enum and unchanged shared convergence computation |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Hard-stop precedence, exact eligibility reasons, native seat dispatch, and continuation path |
| `.opencode/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | Research candidate sources and native seat mandates |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Three-seat transaction, event lifecycle, agreement, and artifact path |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-064
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `convergence-and-recovery/divergent-convergence-mode.md`
- Feature catalog: `../../feature_catalog/convergence/divergent_convergence_mode.md`
