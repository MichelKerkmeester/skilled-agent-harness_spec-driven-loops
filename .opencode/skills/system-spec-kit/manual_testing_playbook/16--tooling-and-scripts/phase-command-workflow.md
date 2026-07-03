---
title: "PHASE-005 -- Phase command workflow"
description: "This scenario validates Phase command workflow for `PHASE-005`. It focuses on Execute `/speckit:plan :with-phases` command in auto mode and verify 7-step workflow."
version: 3.6.0.18
---

# PHASE-005 -- Phase command workflow

## 1. OVERVIEW

This scenario validates Phase command workflow for `PHASE-005`. It focuses on Execute `/speckit:plan :with-phases` command in auto mode and verify 7-step workflow.

---

## 2. SCENARIO CONTRACT


- Objective: Execute `/speckit:plan :with-phases` command in auto mode and verify 7-step workflow.
- Real user request: `Please validate Phase command workflow against /speckit:plan :with-phases and tell me whether the expected signals are present: All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths.`
- Prompt: `Validate Phase command workflow against /speckit:plan :with-phases and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 7 workflow steps complete without error, created folders match expected structure, link validation reports no warnings, and recursive validation exits 0

---

## 3. TEST EXECUTION

### Prompt

```
Validate Phase command workflow against /speckit:plan :with-phases and report cited pass/fail evidence.
```

### Commands

1. Invoke `/speckit:plan :with-phases` in auto mode for a target spec folder
2. Verify Step 1: Phase scoring runs (recommend-level.sh --recommend-phases)
3. Verify Step 2: Phase count determination (from scoring or user input)
4. Verify Step 3: Phase naming (auto-generated or user-provided)
5. Verify Step 4: Phase folder creation (create.sh --phase)
6. Verify Step 5: Template population in all phase folders
7. Verify Step 6: Phase link validation (scripts/rules/check-phase-links.sh)
8. Verify Step 7: Recursive validation (validate.sh --recursive) passes
9. Verify final output reports success with folder paths

### Expected

All 7 steps execute in sequence; scoring output visible; folders created with correct structure; link validation passes; recursive validation passes; success summary with paths

### Evidence

2026-07-02 manual execution transcript:

```bash
$ bash ".opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh" --json --recommend-phases --phase-threshold 0.6 --loc 500 --files 8
ERROR: --phase-threshold must be a positive integer
```

```bash
$ bash ".opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh" --json --recommend-phases --phase-threshold 300 --loc 500 --files 8
{
  "recommended_level": 1,
  "level_name": "Baseline",
  "total_score": 39,
  "max_score": 100,
  "confidence": 80,
  "recommended_phases": false,
  "phase_score": 0,
  "phase_reason": "",
  "suggested_phase_count": 0,
  "inputs": {
    "loc": 500,
    "files": 8,
    "auth": false,
    "api": false,
    "db": false,
    "architectural": false
  },
  "breakdown": {
    "loc_score": 29,
    "files_score": 10,
    "risk_score": 0,
    "complexity_score": 0,
    "details": {
      "auth_points": 0,
      "api_points": 0,
      "db_points": 0,
      "architectural_points": 0
    }
  },
  "thresholds": {
    "level_0_max": 24,
    "level_1_max": 44,
    "level_2_max": 69
  }
}
```

Execution stopped before Step 4 because the scenario requires `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "{feature_description}" --phase --phases {phase_count} --phase-names "{phase_names}" --level {parent_level}`, which creates parent and child spec folders. The active manual-test constraints for this run explicitly allowed writes only to `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/phase-command-workflow.md` and banned modifying, creating, or deleting any other file. Therefore folders could not be created, template population could not be performed, and `check-phase-links.sh` / `validate.sh --recursive` could not be run against newly created workflow output.

### Pass / Fail

- **BLOCKED**: required Step 4 folder creation would write outside the only allowed write path for this run, so the full 7-step workflow could not be executed and the expected success signals could not be verified.

### Failure Triage

Run individual steps in isolation to identify failing step; verify script permissions; check for missing dependencies; inspect auto mode decision logic for phase count/naming

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/phase-command-workflow.md`
