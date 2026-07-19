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
2. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --recursive specs/<phase-parent>`
3. Inspect output for per-phase validation results
4. Verify JSON output contains `phases` array with one entry per child folder
5. Verify combined exit code matches highest severity across children
6. Introduce a deliberate error in one child spec.md and re-run; verify aggregated exit code is 2 (error)

### Expected

Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works

### Evidence

BLOCKED before running `validate.sh --recursive`: the required phase parent from PHASE-002 is not available in the current repo state, and the fallback creation command plus the deliberate child `spec.md` error injection would both write outside this run's only allowed write path.

Observed PHASE-002 state:

```text
49: ### Evidence
50: 
51: BLOCKED before command execution by the scenario invocation's required writes outside the allowed path.
52: 
53: Documented command not run:
54: 
55: ```bash
56: bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"
57: ```
58: 
59: Reason: the command is documented to create `specs/NNN-phase-test/` plus child folders `001-design/`, `002-implement/`, and `003-verify/`, but this run's allowed write paths are limited to:
60: 
61: ```text
62: .opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/phase-folder-creation.md
63: ```
64: 
65: No `ls -R` transcript or generated `spec.md` excerpts exist for this run because executing the creation command would modify/create files outside the allowed write path.
66: 
67: ### Pass / Fail
68: 
69: - **BLOCKED**: The documented creation command would create files under `specs/NNN-phase-test/`, which is outside the only allowed write path for this run.
```

Search for the scenario's fallback `Validate Test` folder:

```text
Glob pattern: **/*Validate*Test*
Result: No files found
```

Search for `Validate Test` references:

```text
Found 5 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:
  Line 3308: Prompt: `Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.`

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/recursive-phase-validation.md:
  Line 19: - Real user request: `` Please validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and tell me whether the expected signals are present: Per-phase pass/fail in output; JSON `phases` array; combined exit code reflects worst child; error propagation works. ``

  Line 20: - Prompt: `Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.`

  Line 33: Validate Recursive phase validation against create.sh "Validate Test" --phase --level 2 --phases 2 and report cited pass/fail evidence.

  Line 38: 1. Use the phase folder created in PHASE-002 (or create one via `create.sh "Validate Test" --phase --level 2 --phases 2`)
```

Blocked commands not run because they would violate the allowed write path constraint:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Validate Test" --phase --level 2 --phases 2
```

```text
Introduce a deliberate error in one child spec.md and re-run; verify aggregated exit code is 2 (error)
```

### Pass / Fail

- **BLOCKED**: The required PHASE-002 phase parent is missing because PHASE-002 was itself blocked before creation, and this run's constraints allow writes only to this scenario file, preventing both fallback phase-parent creation and deliberate child `spec.md` error injection.

### Failure Triage

Verify parent folder contains child folders matching `[0-9][0-9][0-9]-*/` pattern; check validate.sh supports --recursive flag; inspect exit code handling logic

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/recursive-phase-validation.md`
