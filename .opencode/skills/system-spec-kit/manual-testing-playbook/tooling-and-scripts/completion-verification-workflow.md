---
title: "233 -- Completion Verification Workflow"
description: "This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses."
version: 3.6.0.12
id: tooling-and-scripts-completion-verification-workflow
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/validation/validation-rules.md
---

# 233 -- Completion Verification Workflow

## 1. OVERVIEW

This scenario validates completion verification workflow for `233`. It focuses on confirming advisory handling for Level 1 specs, checklist gating for richer specs, and evidence-aware blocking statuses.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh`.
- Real user request: `Please validate Completion Verification Workflow against the documented validation surface and tell me whether the expected signals are present: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status.`
- Prompt: `Validate Completion Verification Workflow against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: missing checklist returns exit 0 advisory; compliant checklist returns COMPLETE; degraded checklist returns non-zero with evidence or blocking status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if advisory, COMPLETE, and blocking outcomes match the fixture state and exit codes remain consistent with the script contract

---

## 3. TEST EXECUTION

### Prompt

```
Validate Completion Verification Workflow against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/062-template-compliant-level1`
2. `bash .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/063-template-compliant-level3 --json`
3. `TMP_DIR="$(mktemp -d /tmp/speckit-completion-XXXXXX)"`
4. `cp -R .opencode/skills/system-spec-kit/runtime/cli/test-fixtures/063-template-compliant-level3 "$TMP_DIR/level3-missing-evidence"`
5. `perl -0pi -e 's/ \\[EVIDENCE:[^\\n]+\\]//' "$TMP_DIR/level3-missing-evidence/checklist.md"`
6. `bash .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --json || true`
7. `bash .opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --strict || true`

### Expected

Level 1 fixture returns advisory exit 0; compliant Level 3 fixture reports COMPLETE; degraded fixture reports blocking status such as EVIDENCE_MISSING or another non-pass status with non-zero exit

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Fail**: The lightweight fixture returned advisory exit 0, but the compliant Level 3 fixture returned `status: "EVIDENCE_MISSING"`, `passed: false`, and `EXIT_CODE=1` instead of reporting `COMPLETE`; the pass condition is not met.

### Failure Triage

Inspect `.opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh`, especially checklist parsing, inherited priority logic, and evidence marker detection

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/completion-verification-workflow.md](../../feature-catalog/tooling-and-scripts/completion-verification-workflow.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 233
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/completion-verification-workflow.md`
