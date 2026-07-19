---
title: "062 -- Progressive validation for spec documents (PI-B2)"
description: "This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior."
version: 3.6.0.15
id: tooling-and-scripts-progressive-validation-for-spec-documents-pi-b2
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: references/validation/validation-rules.md
---

# 062 -- Progressive validation for spec documents (PI-B2)

## 1. OVERVIEW

This scenario validates Progressive validation for spec documents (PI-B2) for `062`. It focuses on Confirm level 1-4 behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm level 1-4 behavior.
- Real user request: `Please validate Progressive validation for spec documents (PI-B2) against the documented validation surface and tell me whether the expected signals are present: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels.`
- Prompt: `Validate Progressive validation for spec documents (PI-B2) against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if levels 1-4 produce progressively stricter validation and exit codes match severity

---

## 3. TEST EXECUTION

### Prompt

```
Validate Progressive validation for spec documents (PI-B2) against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. run level1..4
2. inspect fixes/diffs
3. verify exit/report behavior

### Expected

Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels

### Evidence

Preconditions: no explicit `### Preconditions` section is present in this scenario file.

Documented validation surface resolved from the referenced feature catalog:

```text
Progressive validation runs a 4-level pipeline (detect, auto-fix, suggest, report) on top of `validate.sh` for spec documents.
Flags include `--level N`, `--dry-run`, `--json`, `--strict`, `--quiet` and `--verbose`. Exit code behavior matches `validate.sh`: **0 = pass, 1 = warnings, 2 = errors** (with `--strict`, warnings are promoted to exit 2).
```

Initial exit-code capture mistake and resolution:

```text
zsh:1: read-only variable: status
```

Re-run used `rc=$?` and captured the real command exit code.

Level 1 command:

```bash
bash ".opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --level 1; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
```

Level 1 observed output:

```text
Progressive Validation Pipeline v1.0.0
  Folder:   .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Levels:   1-1

  Level 1: Detect — Running validate.sh
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0
  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Level:  phase
x SPEC_DOC_SUFFICIENCY: 1 spec_doc_sufficiency issue(s) found
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
! EVIDENCE_CITED: Found 15 completed item(s) without evidence
! PHASE_LINKS: 1 phase link issue(s) found
! PHASE_PARENT_CONTENT: Phase parent spec.md contains migration-history token(s)
! AI_PROTOCOL: AI protocol incomplete (1/4 components)
Summary: Errors: 2  Warnings: 4
RESULT: FAILED

Spec Folder Validation v3.0.0
  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/001-findings-remediation
  Level:  2
x FILE_EXISTS: Missing 1 required file(s) for Level 2
x TEMPLATE_SOURCE: Template source header missing
x TEMPLATE_HEADERS: 11 template headers issue(s) found
x ANCHORS_VALID: 13 template anchors issue(s) found
x FRONTMATTER_MEMORY_BLOCK: 4 frontmatter_memory_block issue(s) found
x SPEC_DOC_SUFFICIENCY: 3 spec_doc_sufficiency issue(s) found
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x LEVEL_MATCH: Level consistency errors
Summary: Errors: 8  Warnings: 4
RESULT: FAILED

EXIT_CODE=2
```

Level 2 command used dry-run because the only allowed write path for this scenario execution is this scenario file:

```bash
bash ".opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --level 2 --dry-run; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
```

Level 2 observed output:

```text
Progressive Validation Pipeline v1.0.0
  Folder:   .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Levels:   1-2
  Mode:     DRY RUN

  Level 1: Detect — Running validate.sh
Summary: Errors: 2  Warnings: 4
RESULT: FAILED
Summary: Errors: 8  Warnings: 4
RESULT: FAILED

  Level 2: Auto-fix — DRY RUN (no changes will be applied)
[DRY-RUN] HEADING_LEVELS: spec.md — normalized heading hierarchy

  Dry-run: 1 fix(es) would be applied.

EXIT_CODE=2
```

Level 3 command used dry-run because the only allowed write path for this scenario execution is this scenario file:

```bash
bash ".opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --level 3 --dry-run; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
```

Level 3 observed output:

```text
Progressive Validation Pipeline v1.0.0
  Folder:   .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Levels:   1-3
  Mode:     DRY RUN

  Level 1: Detect — Running validate.sh
Summary: Errors: 2  Warnings: 4
RESULT: FAILED
Summary: Errors: 8  Warnings: 4
RESULT: FAILED

  Level 2: Auto-fix — DRY RUN (no changes will be applied)
[DRY-RUN] HEADING_LEVELS: spec.md — normalized heading hierarchy

  Dry-run: 1 fix(es) would be applied.

  Level 3: Suggest — Guided fix options for non-automatable issues
  Issues detected but could not be parsed. Run with --json for details.

EXIT_CODE=2
```

Level 4 verbose command used dry-run because the only allowed write path for this scenario execution is this scenario file:

```bash
bash ".opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --level 4 --dry-run --verbose; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
```

Level 4 observed report and diff output:

```text
Progressive Validation Pipeline v1.0.0
  Folder:   .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Levels:   1-4
  Mode:     DRY RUN

  Level 1: Detect — Running validate.sh
Summary: Errors: 2  Warnings: 4
RESULT: FAILED
Summary: Errors: 8  Warnings: 4
RESULT: FAILED

  Level 2: Auto-fix — DRY RUN (no changes will be applied)
[DRY-RUN] HEADING_LEVELS: spec.md — normalized heading hierarchy
  Heading fix applied to spec.md

  Dry-run: 1 fix(es) would be applied.

  Level 3: Suggest — Guided fix options for non-automatable issues
  Issues detected but could not be parsed. Run with --json for details.

  Level 4: Report — Progressive Validation Summary
  Folder:      .opencode/specs/system-speckit/031-manual-playbook-execution-sweep
  Pipeline:    Level 4
  Mode:        DRY RUN (no changes applied)
  Detect:      FAILED
  Auto-fixes:  1 applied
  Suggestions: 0 manual action(s)

  Auto-fix Diffs:
---DIFF:1---
--- a/spec.md
+++ b/spec.md
@@ -36,7 +36,7 @@
-## EXECUTIVE SUMMARY
+# EXECUTIVE SUMMARY
@@ -47,7 +47,7 @@
-## 1. METADATA
+# 1. METADATA

EXIT_CODE=2
```

Level 4 JSON report command:

```bash
bash ".opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh" ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep" --level 4 --dry-run --json; rc=$?; printf '\nEXIT_CODE=%s\n' "$rc"
```

Level 4 JSON observed output:

```json
{
  "version": "1.0.0",
  "pipelineLevel": 4,
  "dryRun": true,
  "folder": ".opencode/specs/system-speckit/031-manual-playbook-execution-sweep",
  "detectExitCode": 2,
  "passed": false,
  "strict": false,
  "autoFixes": {
    "count": 1,
    "applied": false,
    "items": [{"id":1,"file":"spec.md","type":"HEADING_LEVELS","description":"Normalized heading levels so minimum heading is H1"}],
    "diffs": "---DIFF:1---\n--- a/spec.md\n+++ b/spec.md\n@@ -36,7 +36,7 @@\n \n ---\n \n-## EXECUTIVE SUMMARY\n+# EXECUTIVE SUMMARY"
  },
  "suggestions": {
    "count": 0,
    "items": []
  }
}

EXIT_CODE=2
```

### Pass / Fail

- **BLOCKED**: Level progression, report generation, error severity mapping, and proposed auto-fix diffs were observed, but the scenario could not execute non-dry-run auto-fix application because the required write would modify `.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md`, which is outside the single allowed write path for this run. The JSON report therefore shows `"autoFixes":{"count":1,"applied":false,...}`.

### Failure Triage

Verify validation level definitions; check exit code mapping; inspect auto-fix application logic

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/progressive-validation-for-spec-documents.md](../../feature-catalog/tooling-and-scripts/progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 062
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/progressive-validation-for-spec-documents-pi-b2.md`
