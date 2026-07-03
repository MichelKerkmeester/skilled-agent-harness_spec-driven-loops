---
title: "242 -- Spec-Folder Detection and Description Metadata"
description: "This scenario validates spec-folder detection and description metadata for `242`. It focuses on confirming folder detection, alignment validation, subfolder resolution, and description generation."
version: 3.6.0.15
---

# 242 -- Spec-Folder Detection and Description Metadata

## 1. OVERVIEW

This scenario validates spec-folder detection and description metadata for `242`. It focuses on confirming folder detection, alignment validation, subfolder resolution, and description generation.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm folder detection, alignment safety, subfolder resolution, and description generation.
- Real user request: `Please validate Spec-Folder Detection and Description Metadata against cd .opencode/skills/system-spec-kit/scripts && node tests/test-folder-detector-functional.js and tell me whether the expected signals are present: folder-detector and alignment tests pass; subfolder resolution test passes; description generation completes without path-safety errors.`
- Prompt: `Validate Spec-Folder Detection and Description Metadata against cd .opencode/skills/system-spec-kit/scripts && node tests/test-folder-detector-functional.js and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: folder-detector and alignment tests pass; subfolder resolution test passes; description generation completes without path-safety errors
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the detection, alignment, and description-refresh surfaces all behave as documented

---

## 3. TEST EXECUTION

### Prompt

```
Validate Spec-Folder Detection and Description Metadata against cd .opencode/skills/system-spec-kit/scripts && node tests/test-folder-detector-functional.js and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/scripts && node tests/test-folder-detector-functional.js`
2. `cd .opencode/skills/system-spec-kit/scripts && node tests/test-alignment-validator.js`
3. `cd .opencode/skills/system-spec-kit/scripts && node tests/test-subfolder-resolution.js`
4. `npx tsx .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts <spec-folder> .opencode/specs --description "Manual scenario description"`

### Expected

Functional tests pass; subfolder resolution stays green; description generation completes for the explicit spec path without traversal or alignment failure

### Evidence

Command 1: `cd .opencode/skills/system-spec-kit/scripts && node tests/test-folder-detector-functional.js`

```text
═══════════════════════════════════════════════════════════════
TEST: Folder Detector Functional Tests (Priority 2.5 Focus)
═══════════════════════════════════════════════════════════════

── Category 1: DB Query Correctness ──


🔬 DB QUERY: Returns most recent record within 24h
   ✅ T-FD01a: DB query returns recent record
      Evidence: spec_folder = "003-memory-and-spec-kit"

🔬 DB QUERY: Returns most recent when multiple records exist
   ✅ T-FD01b: Returns most recent of multiple records
      Evidence: spec_folder = "002-new-folder"

🔬 DB QUERY: Returns undefined when table is empty
   ✅ T-FD01c: Returns undefined for empty table
      Evidence: row === undefined

RESULTS: 33 passed, 0 failed, 2 skipped
```

Command 2: `cd .opencode/skills/system-spec-kit/scripts && node tests/test-alignment-validator.js`

```text
Running alignment-validator drift checks (ESM)...

   PASS T-AV00: module loads from TypeScript source
   PASS T-AV01: telemetry drift functions are exported
   PASS T-AV02: computeTelemetrySchemaDocsFieldDiffs returns field-level drift
   PASS T-AV03: formatTelemetrySchemaDocsDriftDiffs prints +/- per field
   PASS T-AV04: validateTelemetrySchemaDocsDrift fails with field-level diffs
   PASS T-AV05: validateTelemetrySchemaDocsDrift passes when schema/docs align

Summary:
   Passed: 6
   Failed: 0
```

Command 3: `cd .opencode/skills/system-spec-kit/scripts && node tests/test-subfolder-resolution.js`

```text
═══════════════════════════════════════════════════════════════
TEST: Subfolder Resolution (subfolder-utils + core/index)
═══════════════════════════════════════════════════════════════

── Category C: findChildFolderSync ──

🔬 findChildFolderSync: Finds existing unique child folder
   ✅ T-SF03a: Find existing child
      Evidence: Found: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/997-sync-parent-mr424gsa/996-sync-child-mr424gsa

── Category I: isValidSpecFolder Multi-Segment ──

🔬 isValidSpecFolder: Rejects symlink escape outside approved roots
   ✅ T-SF09b: Reject symlink escape
      Evidence: Spec folder must be under specs/ or .opencode/specs/: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/998-gc-symlink-mr424hpl/996-outside-child

RESULTS: 32 passed, 0 failed, 0 skipped
```

Command 4 was not executed: `npx tsx .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts <spec-folder> .opencode/specs --description "Manual scenario description"` would update `description.json` under the target spec folder, but this run's allowed write paths permit only `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/spec-folder-detection-and-description.md`. The required `description.json` output or timestamp under the target spec folder is therefore missing for this execution.

### Pass / Fail

- **BLOCKED**: all three test scripts pass, but the explicit description refresh could not be executed because it would write outside the single allowed scenario file.

### Failure Triage

Inspect `scripts/spec-folder/folder-detector.ts`, `alignment-validator.ts`, `directory-setup.ts`, and `generate-description.ts` if a path cannot be resolved or description generation fails

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/spec-folder-detection-and-description.md](../../feature_catalog/16--tooling-and-scripts/spec-folder-detection-and-description.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 242
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/spec-folder-detection-and-description.md`
