---
title: "237 -- Spec Lifecycle Automation"
description: "This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints."
version: 3.6.0.12
id: tooling-and-scripts-spec-lifecycle-automation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 237 -- Spec Lifecycle Automation

## 1. OVERVIEW

This scenario validates spec lifecycle automation for `237`. It focuses on confirming the lifecycle toolchain exposes recommendation, upgrade, completeness, completion, and archival entrypoints.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm lifecycle tool availability across recommendation, upgrade, completeness, completion, and archival surfaces.
- Real user request: `Please validate Spec Lifecycle Automation against bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --help and tell me whether the expected signals are present: help output available for lifecycle entrypoints; upgrade regression suite passes; completeness JSON is emitted; completion gate returns a stable status.`
- Prompt: `Validate Spec Lifecycle Automation against bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --help and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: help output available for lifecycle entrypoints; upgrade regression suite passes; completeness JSON is emitted; completion gate returns a stable status
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the lifecycle scripts collectively expose the documented workflow and the known-good fixture behaves consistently

---

## 3. TEST EXECUTION

### Prompt

```
Validate Spec Lifecycle Automation against bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --help and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --help`
2. `bash .opencode/skills/system-spec-kit/scripts/tests/test-upgrade-level.sh`
3. `bash .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
4. `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
5. `bash .opencode/skills/system-spec-kit/scripts/spec/archive.sh --help`

### Expected

Recommendation and archive help text is available; upgrade-level regression suite passes; completeness JSON emits percentage-style data; completion status is returned for the fixture

### Evidence

Command 1: `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --help`

```text
SpecKit Level Recommendation Algorithm

Analyzes task complexity factors and recommends the appropriate SpecKit level.

USAGE:
  recommend-level.sh [OPTIONS]

OPTIONS:
  --loc <number>       Lines of code estimate (required)
  --files <number>     Number of files to modify (required)
  --auth               Task involves authentication/authorization changes
  --api                Task involves API changes
  --db                 Task involves database changes
  --architectural      Task involves architectural changes
  --recommend-phases   Include phase scoring in output (default)
  --no-recommend-phases Disable phase scoring output
  --phase-threshold <N> Override phase score threshold (default 25)
  --json, -j           Output in JSON format
  --help, -h           Show this help message

EXAMPLES:
  # Simple task
  recommend-level.sh --loc 50 --files 2

  # Medium complexity with API
  recommend-level.sh --loc 200 --files 5 --api

  # Complex full-stack feature
  recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural

  # With phase recommendation (default behavior)
  recommend-level.sh --loc 1000 --files 20 --architectural --api --db --recommend-phases

  # Disable phase recommendation fields
  recommend-level.sh --loc 1000 --files 20 --architectural --no-recommend-phases

  # JSON output for scripting
  recommend-level.sh --loc 100 --files 3 --json

LEVELS:
  Level 0 (Quick):        <25 points  - Trivial changes, no formal spec needed
  Level 1 (Baseline):     25-44       - Standard tasks, basic documentation
  Level 2 (Verification): 45-69       - Complex tasks, full verification needed
  Level 3 (Full):         70+         - Critical/architectural, comprehensive docs
```

Command 2: `bash .opencode/skills/system-spec-kit/scripts/tests/test-upgrade-level.sh`

```text

────────────────────────────────────────────────────
  upgrade-level.sh Test Suite
────────────────────────────────────────────────────

── Shell-Common Guard ──
  PASS: Missing helper exits with exact code 1 and clear message

── Invalid Input ──
  PASS: No args produces usage error (exit=1)
  PASS: Missing --to flag produces error (exit=1)
  PASS: Invalid --to value rejected (exit=1)

── Missing spec.md ──
  PASS: Empty dir (no spec.md) produces graceful error (exit=1)
  PASS: Non-existent directory produces error (exit=1)

── Level Detection ──
  PASS: Detects Level 2 from table format '| **Level** | 2 |' (exit=1)
  PASS: Detects Level 3 from SPECKIT_LEVEL marker (exit=1)

── Already At Target ──
  PASS: Already at target level = no-op with error (exit=1)

── Dry-Run Mode ──
  PASS: Dry-run exits 0 (exit=0)
  PASS: Dry-run did not create checklist.md
  PASS: Dry-run left existing files unchanged
  PASS: Dry-run did not create backup directory
  PASS: Dry-run output mentions DRY RUN

────────────────────────────────────────────────────
────────────────────────────────────────────────────

  Results: 14 passed, 0 failed, 0 skipped (of 14)
```

Command 3: `bash .opencode/skills/system-spec-kit/scripts/spec/calculate-completeness.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`

```json
{
  "spec_folder": ".opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3",
  "files_analyzed": 4,
  "overall_completion": 100,
  "total_placeholders": 0,
  "total_lines": 527,
  "files": {},
  "quality": {
    "enabled": false
  }
}
```

Command 4: `bash .opencode/skills/system-spec-kit/scripts/spec/check-completion.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`

```json
{
  "folder": ".opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3",
  "status": "EVIDENCE_MISSING",
  "passed": false,
  "strict": false,
  "summary": {
    "total": 36,
    "completed": 36,
    "percentage": 100
  },
  "priorities": {
    "p0": { "total": 12, "completed": 12 },
    "p1": { "total": 20, "completed": 20 },
    "p2": { "total": 4, "completed": 4 },
    "untagged": { "total": 0, "completed": 0 }
  },
  "qualityGates": {
    "priorityContextMissing": 0,
    "p0MissingEvidence": 12,
    "p1MissingEvidence": 20
  }
}
```

Command 5: `bash .opencode/skills/system-spec-kit/scripts/spec/archive.sh --help`

```text
archive-spec.sh - Archive completed spec folders

USAGE:
    archive-spec.sh <spec-folder>
    archive-spec.sh --list
    archive-spec.sh --restore <archived-folder>

OPTIONS:
    --list, -l          List all archived specs
    --restore, -r       Restore an archived spec folder
    --force, -f         Skip completeness check (archive anyway)
    --help, -h          Show this help message

EXAMPLES:
    archive-spec.sh specs/051-feature-name/
    archive-spec.sh --force specs/051-feature-name/
    archive-spec.sh --list
    archive-spec.sh --restore specs/z_archive/051-feature-name/

NOTES:
    - Specs with <90% completeness will prompt for confirmation
    - Use --force to skip the completeness check
    - Archived specs are moved to specs/z_archive/
```

### Pass / Fail

- **PASS**: Recommendation and archive help text is available; upgrade-level regression suite reports `Results: 14 passed, 0 failed, 0 skipped (of 14)`; completeness JSON reports `"overall_completion": 100`; completion JSON returns stable fixture status `"status": "EVIDENCE_MISSING"` with `"summary": { "total": 36, "completed": 36, "percentage": 100 }`.

### Failure Triage

Inspect `scripts/spec/recommend-level.sh`, `scripts/tests/test-upgrade-level.sh`, `scripts/spec/calculate-completeness.sh`, and `scripts/spec/archive.sh` if a lifecycle stage is missing or inconsistent

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/spec_lifecycle_automation.md](../../feature_catalog/tooling_and_scripts/spec_lifecycle_automation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 237
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/spec_lifecycle_automation.md`
