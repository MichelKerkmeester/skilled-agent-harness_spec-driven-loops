---
title: "PHASE-003 -- Recursive phase validation"
description: "This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results."
version: 3.6.0.16
id: tooling-and-scripts-recursive-phase-validation
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/validation/phase-checklists.md
---

# PHASE-003 -- Recursive phase validation

## 1. OVERVIEW

This scenario validates Recursive phase validation for `PHASE-003`. It focuses on Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.

---

## 2. SCENARIO CONTRACT


- Objective: Run `validate.sh --recursive` on a phase parent folder and verify per-phase results.
- Real user request: `` Please validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and tell me whether the expected signals are present: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works. ``
- Prompt: `Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity

---

## 3. TEST EXECUTION

### Prompt

```
Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.
```

### Commands

1. Use the phase folder created in PHASE-002 (or create one via `create.sh "Validate Test" --phase --level 2 --phases 2`)
2. `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh --recursive specs/<phase-parent>`
3. Inspect output for per-phase validation results
4. Verify JSON output contains `phases` array with one entry per child folder
5. Verify combined exit code matches highest severity across children
6. Introduce a deliberate error in one child spec.md and re-run; verify aggregated exit code is 2 (error)

### Expected

Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: `--recursive` discovers all `[0-9][0-9][0-9]-*/` child folders, validates each independently, produces aggregated JSON with per-phase status, and combined exit code escalates to highest severity.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Verify parent folder contains child folders matching `[0-9][0-9][0-9]-*/` pattern; check validate.sh supports --recursive flag; inspect exit code handling logic

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/recursive-phase-validation.md`
