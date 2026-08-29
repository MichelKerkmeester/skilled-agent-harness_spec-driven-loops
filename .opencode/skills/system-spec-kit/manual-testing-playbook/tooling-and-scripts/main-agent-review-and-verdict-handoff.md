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
- Operator prompt: `As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against @review, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: severity-ranked findings and final verdict
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: deterministic verdict issued with rationale.

---

## 3. TEST EXECUTION

### Prompt

`As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Commands

1. Dispatch the operator prompt above to `@review` against the change set under test.
2. Capture the returned findings list in full, including each finding's severity label.
3. Capture the final verdict line and the rationale the reviewer gives for it.
4. Confirm the findings are ordered by severity and that the verdict is one of PASS or FAIL.

### Expected

Severity-ranked findings and a final verdict, each finding carrying an explicit severity label and the verdict carrying a stated rationale.
### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass/Fail

- **Pass**: Deterministic verdict issued with rationale.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

collect missing evidence and rerun review.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/main-agent-review-and-verdict-handoff.md`
