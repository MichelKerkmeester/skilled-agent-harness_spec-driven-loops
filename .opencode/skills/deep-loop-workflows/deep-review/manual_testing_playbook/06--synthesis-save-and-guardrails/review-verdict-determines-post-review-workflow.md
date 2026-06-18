---
title: "DRV-026 -- Review verdict determines post-review workflow"
description: "Verify that FAIL routes to /speckit:plan, CONDITIONAL routes to /speckit:plan, and PASS routes to /create:changelog with hasAdvisories metadata."
---

# DRV-026 -- Review verdict determines post-review workflow

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-026`.

---

## 1. OVERVIEW

This scenario validates review verdict determines post-review workflow for `DRV-026`. The objective is to verify that the three review verdicts (FAIL, CONDITIONAL, PASS) each route to the correct follow-up command, with `hasAdvisories` metadata set when P2 findings remain.

### WHY THIS MATTERS

The verdict is the actionable outcome of the review loop. If it routes incorrectly, operators may ship code that should be fixed (FAIL routing to changelog) or waste time on unnecessary planning (PASS routing to plan). The `hasAdvisories` flag ensures P2 items are tracked even when the code passes.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify FAIL->plan, CONDITIONAL->plan, PASS->changelog routing with hasAdvisories metadata.
- Real user request: After the review finishes, what happens next depending on the verdict?
- Prompt: `Validate deep-review verdict routing for FAIL, CONDITIONAL, and PASS post-review workflows.`
- Expected execution process: Inspect the quick reference verdict table, then the YAML synthesis step for routing logic, then the SKILL.md and command entrypoint for verdict documentation.
- Desired user-facing outcome: The user knows exactly which follow-up command to run based on the review verdict and understands what `hasAdvisories` means.
- Expected signals: Three distinct verdicts, each with a documented next command, `hasAdvisories` flag on PASS with P2 findings, verdict appears in Executive Summary, and routing rationale appears in Planning Trigger.
- Pass/fail posture: PASS if all three verdict-to-command routing paths are documented and consistent. FAIL if any verdict routes to the wrong command or `hasAdvisories` is missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review verdict routing for FAIL, CONDITIONAL, and PASS post-review workflows.
### Commands
1. `bash: rg -n 'FAIL|CONDITIONAL|PASS|verdict|hasAdvisories|spec_kit:plan|create:changelog|Next Command|routing' .opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md`
2. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS|hasAdvisories|routing|next_command|post_review|planning_trigger' .opencode/commands/deep/assets/deep_review_auto.yaml .opencode/commands/deep/assets/deep_review_confirm.yaml`
3. `bash: rg -n 'verdict|FAIL|CONDITIONAL|PASS|hasAdvisories|routing|post.review|Planning Trigger|Executive Summary' .opencode/skills/deep-loop-workflows/deep-review/SKILL.md .opencode/skills/deep-loop-workflows/deep-review/README.md .opencode/commands/deep/review.md`
### Expected
Three distinct verdicts with documented next commands, `hasAdvisories` flag on PASS with P2 findings, verdict in Executive Summary, routing rationale in Planning Trigger.
### Evidence
Capture the verdict table from quick reference, the YAML routing logic, and the report section documentation showing where verdict and routing appear.
### Pass/Fail
PASS if all three verdict-to-command routing paths are documented and consistent. FAIL if any verdict routes to the wrong command or `hasAdvisories` is missing.
### Failure Triage
Privilege the quick reference verdict table as the canonical routing contract and verify YAML synthesis step mirrors it exactly.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `deep-review`, use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/quick_reference.md` | Canonical verdict table, use `ANCHOR:verdicts` |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Synthesis step with verdict routing logic |
| `.opencode/commands/deep/assets/deep_review_confirm.yaml` | Synthesis step with verdict routing logic |
| `.opencode/commands/deep/review.md` | Command entrypoint, verdict and output format documentation |
| `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md` | Verdict definitions and severity classification, use `ANCHOR:how-it-works` |
| `.opencode/skills/deep-loop-workflows/deep-review/README.md` | Feature summary for verdicts and post-review workflow |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/review-verdict-determines-post-review-workflow.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-loop-workflows/deep-review/` as of 2026-03-28.
