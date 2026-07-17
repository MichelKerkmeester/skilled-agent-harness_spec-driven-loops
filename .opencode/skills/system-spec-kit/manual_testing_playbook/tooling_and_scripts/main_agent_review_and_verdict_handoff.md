---
title: "M-004 -- Main-Agent Review and Verdict Handoff"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`."
version: 3.6.0.14
id: tooling-and-scripts-main-agent-review-and-verdict-handoff
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-004 -- Main-Agent Review and Verdict Handoff

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`.
- Real user request: `Please validate Main-Agent Review and Verdict Handoff against @review and tell me whether the expected signals are present: severity-ranked findings and final verdict.`
- RCAF Prompt: `As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against @review, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: severity-ranked findings and final verdict
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: deterministic verdict issued with rationale.

---

## 3. TEST EXECUTION

### Prompt

`As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Expected

severity-ranked findings and final verdict.
### Evidence

BLOCKED: the scenario file does not contain the required `Preconditions` or `Commands` sections, so there were no documented preconditions to verify and no documented commands to execute exactly as written.

Actual file read output for the executable scenario area:

```text
28: ## 3. TEST EXECUTION
29: 
30: ### Prompt
31: 
32: `As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
33: ### Expected
34: 
35: severity-ranked findings and final verdict.
36: ### Evidence
37: 
38: review output with file:line findings.
39: ### Pass/Fail
40: 
41: deterministic verdict issued with rationale.
42: ### Failure Triage
43: 
44: collect missing evidence and rerun review.
```
### Pass/Fail

BLOCKED -- Missing scenario `Preconditions` and `Commands` sections prevent exact real execution; the Expected outcome was not evaluated because the required executable instructions are absent.
### Failure Triage

collect missing evidence and rerun review.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/progressive_validation_for_spec_documents.md](../../feature_catalog/tooling_and_scripts/progressive_validation_for_spec_documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/main_agent_review_and_verdict_handoff.md`
