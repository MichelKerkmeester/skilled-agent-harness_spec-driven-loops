---
title: "RV-069 -- Divergent convergence mode"
description: "Verify eligible clean-review pivots preserve synthesis-only verdict derivation, security gates, and target read-only authority."
version: 1.11.0.1
---

# RV-069 -- Divergent convergence mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RV-069`.

---

## 1. OVERVIEW

This scenario validates divergent review convergence. The objective is to prove that an eligible `all_dimensions_clean` STOP can select a new review direction without entering synthesis, changing verdict rules, bypassing security gates, authorizing a fix, or making the target writable.

### WHY THIS MATTERS

Exploratory breadth is acceptable only if review authority remains exactly as restrictive as the ordinary loop and verdict derivation remains isolated from pivot selection.

---

## 2. SCENARIO CONTRACT

Operators should run this as a deterministic control-flow and boundary inspection against shipped files. The scenario is complete only when the pivot branch, synthesis boundary, verdict mapping, legal-stop gates, and read-only candidate enforcement are all captured.

- Objective: Verify only `all_dimensions_clean` enters the divergent review pivot, a successful pivot continues with a new dimension direction, verdict and security gates are unaffected, and the target remains read-only.
- Real user request: Check that divergent review can explore another in-scope dimension without changing the verdict, fixing code, or writing to the reviewed target.
- Prompt: `Validate the shipped deep-review divergent pivot, synthesis-only verdict mapping, security-gate preservation, and read-only target boundary.`
- Expected execution process: Inspect the review legal-stop tree and exact divergent predicate, trace the successful branch away from synthesis, inspect `phase_synthesis` verdict derivation, then inspect candidate and seat-prompt read-only enforcement.
- Desired user-visible outcome: The user gets a PASS only when `all_dimensions_clean` restores a new read-only direction and loops, while verdict derivation remains reachable only through `phase_synthesis` and mutation-shaped candidates are rejected.
- Expected signals: Exact eligible reason `all_dimensions_clean`; nine gates run before the pivot branch; successful pivot binds `next_dimension` and proceeds to `step_normalize_pause_events`; `step_derive_verdict` exists only under `phase_synthesis`; PASS/CONDITIONAL/FAIL depends only on active P0/P1 counts; candidate generation rejects fix, mutation, write, and target-expansion language; every seat prompt declares the target read-only.
- Pass/fail posture: PASS if all control-flow and boundary signals agree. FAIL if pivot handling can derive a verdict, bypass a failed gate, authorize a fix, expand the target, or mutate reviewed files.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the verdict and read-only guarantees before inspecting implementation details.
2. Capture the legal-stop and divergent blocks with enough context to prove their order.
3. Capture the successful pivot destination and separately capture the synthesis-only verdict algorithm.
4. Capture both candidate filtering and seat-prompt prohibitions before assigning PASS.

### Prompt

Validate the shipped deep-review divergent pivot, synthesis-only verdict mapping, security-gate preservation, and read-only target boundary.

### Commands

1. `bash: rg -n -C 12 "LEGAL-STOP DECISION TREE|fixCompletenessReplayGate|if_divergent_eligible|eligible_reasons|excluded_reasons" .opencode/commands/deep/assets/deep-review-auto.yaml`
2. `bash: rg -n -C 10 "step_apply_divergent_pivot_result|next_dimension|proceed_to: step_normalize_pause_events|skip_to: phase_synthesis" .opencode/commands/deep/assets/deep-review-auto.yaml`
3. `bash: rg -n -C 12 "phase_synthesis:|step_derive_verdict|if p0_count > 0|elif p1_count > 0|verdict = \"PASS\"" .opencode/commands/deep/assets/deep-review-auto.yaml`
4. `bash: rg -n -C 5 "seedViolatesReadOnlyBoundary|implement|apply (?:a )?fix|modify|expand (?:the )?(?:scope|target)|Review target is READ-ONLY|Do not implement fixes" .opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts`

### Expected

The nine legal-stop gates precede a predicate requiring divergent mode and `all_dimensions_clean`. A successful pivot restores `next_dimension` and returns to loop processing rather than entering `phase_synthesis`. Verdict derivation appears inside `phase_synthesis` and maps active P0 to FAIL, active P1 without P0 to CONDITIONAL, and no active P0/P1 to PASS. Candidate filtering and all three native seat prompts reject mutation, fixes, writes, and target expansion.

### Evidence

Capture the gate ordering, eligibility contract, successful branch destination, synthesis/derivation indentation block, verdict algorithm, mutation-pattern list, boundary verdict text, and seat-prompt prohibitions.

### Pass/Fail

PASS if the evidence proves pivot continuation cannot reach verdict derivation and every candidate/seat boundary remains read-only. FAIL if the verdict algorithm appears in the pivot branch, a failed gate can pivot, or any candidate path permits a fix or reviewed-file mutation.

### Failure Triage

Privilege YAML indentation and branch destinations for reachability. `phase_synthesis.step_derive_verdict` is the verdict authority; the pivot adapter is mechanics-only. Privilege `seedViolatesReadOnlyBoundary` and `renderReviewPivotSeatPrompt` for target authority.

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `../../feature-catalog/severity-system/divergent-convergence-mode.md` | Feature-catalog source describing the shipped review modifier |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | Nine-gate order, exact pivot eligibility, continuation path, and synthesis-only verdict derivation |
| `.opencode/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Read-only candidate sources, mutation rejection, and seat-prompt prohibitions |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | Mechanics-only three-seat transaction and continuation lifecycle |
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Four-value convergence-mode enum without verdict ownership |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: RV-069
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `convergence-and-recovery/divergent-convergence-mode.md`
- Feature catalog: `../../feature-catalog/severity-system/divergent-convergence-mode.md`
