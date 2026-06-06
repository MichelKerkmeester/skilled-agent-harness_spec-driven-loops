---
title: "DRV-025 -- Review report synthesis has all 9 sections"
description: "Verify that review-report.md contains all 9 required sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix."
---

# DRV-025 -- Review report synthesis has all 9 sections

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-025`.

---

## 1. OVERVIEW

This scenario validates review report synthesis has all 9 sections for `DRV-025`. The objective is to verify that the final `review-report.md` produced during synthesis contains all 9 required sections with their expected content.

### WHY THIS MATTERS

The review report is the primary deliverable of the entire deep review loop. If any section is missing, the report cannot serve its purpose as a complete audit record, remediation guide, and planning input. The 9-section structure ensures that findings, evidence, verdicts, and next steps are all captured in a single canonical document.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify review-report.md has all 9 sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix.
- Real user request: When the review finishes, what exactly does it produce and what sections does the report contain?
- Prompt: `Validate deep-review report synthesis and confirm review-report.md contains all 9 required sections.`
- Expected execution process: Inspect the quick reference review-report sections table, then the YAML synthesis step, then the SKILL.md and README for report section documentation.
- Desired user-facing outcome: The user is told exactly what the review report contains and can verify completeness by checking for all 9 section headers.
- Expected signals: All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, and Audit Appendix includes convergence data.
- Pass/fail posture: PASS if all 9 sections are documented and enforced by the synthesis step. FAIL if any section is missing from the template or synthesis contract.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate deep-review report synthesis and confirm review-report.md contains all 9 required sections.
### Commands
1. `bash: rg -n 'Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix|review-report' .opencode/skills/deep-review/references/protocol/quick_reference.md`
2. `bash: rg -n 'review-report|synthesis|9.*section|Executive Summary|Planning Trigger|Active Finding|Remediation|Spec Seed|Plan Seed|Traceability|Deferred|Audit Appendix' .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml .opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml`
3. `bash: rg -n 'review-report|synthesis|9.*section|report.*section|Executive Summary|verdict|hasAdvisories' .opencode/skills/deep-review/SKILL.md .opencode/skills/deep-review/README.md .opencode/commands/deep/start-review-loop.md`
### Expected
All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings, Audit Appendix includes convergence data.
### Evidence
Capture the 9-section table from quick reference, the YAML synthesis step, and the report structure documentation from SKILL.md.
### Pass/Fail
PASS if all 9 sections are documented and enforced by the synthesis step. FAIL if any section is missing from the template or synthesis contract.
### Failure Triage
Privilege the quick reference section table as the canonical list and verify the YAML synthesis step produces all 9 sections.
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
| `.opencode/skills/deep-review/references/protocol/quick_reference.md` | Canonical 9-section table, use `ANCHOR:review-report-sections` |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Synthesis step producing review-report.md |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Synthesis step producing review-report.md |
| `.opencode/commands/deep/start-review-loop.md` | Command entrypoint, output format documentation |
| `.opencode/skills/deep-review/SKILL.md` | Review report structure and verdict rules, use `ANCHOR:how-it-works` |
| `.opencode/skills/deep-review/README.md` | Feature summary for review report synthesis |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/review-report-synthesis-has-all-9-sections.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skills/deep-review/` as of 2026-03-28.
