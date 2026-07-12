---
title: "244 -- Template Composition System"
description: "This scenario validates Level-based packet generation and vocabulary invariance for the current template flow."
version: 3.6.0.13
---

# 244 -- Template Composition System

## 1. OVERVIEW

This scenario validates template composition system for `244`. It focuses on confirming that the current Level-based generation path creates valid packets and that public surfaces keep Level vocabulary.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm Level 1, Level 2, Level 3, Level 3+, and phase-parent packet generation plus strict validation.
- Real user request: `Please validate the Template Composition System by scaffolding one packet for each supported Level, validating each packet strictly, and running the workflow-invariance test. Tell me whether every generated packet is valid and whether public docs stayed on Level vocabulary.`
- Prompt: `Scaffold one packet for each supported Level, validate each packet with strict mode, run the workflow-invariance test, and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: every scaffold command exits 0, every strict validation exits 0, and the workflow-invariance test exits 0
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all generated packets validate and the vocabulary-invariance test is green.

---

## 3. TEST EXECUTION

### Prompt

```
Scaffold one packet for each supported Level, validate each packet with strict mode, run the workflow-invariance test, and report cited pass/fail evidence.
```

### Commands

1. `TMPDIR=$(mktemp -d)`
2. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 1 --path "$TMPDIR/test-1" --name "test-1"`
3. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-1" --strict`
4. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 2 --path "$TMPDIR/test-2" --name "test-2"`
5. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-2" --strict`
6. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 3 --path "$TMPDIR/test-3" --name "test-3"`
7. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3" --strict`
8. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 3+ --path "$TMPDIR/test-3-plus" --name "test-3-plus"`
9. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3-plus" --strict`
10. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level phase-parent --path "$TMPDIR/test-phase-parent" --name "test-phase-parent"`
11. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-phase-parent" --strict`
12. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/workflow-invariance.vitest.ts`
13. `rm -rf "$TMPDIR"`

### Expected

Every create and validate command exits 0, and the workflow-invariance test exits 0.

### Evidence

Command transcript for each scaffold, strict validation, and invariance run:

1. `TMPDIR=$(mktemp -d)`

```text
(no output)
```

2. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 1 --path "$TMPDIR/test-1" --name "test-1"`

```text
description.json created in /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-1
(node:65363) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

───────────────────────────────────────────────────────────────────
  SpecKit: Spec Folder Created Successfully
───────────────────────────────────────────────────────────────────

  BRANCH_NAME:  test-1
  FEATURE_NUM:  000
  DOC_LEVEL:    Level 1
  SPEC_FOLDER:  /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-1
```

3. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-1" --strict`

```text
Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-1
  Level:  1

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
```

4. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 2 --path "$TMPDIR/test-2" --name "test-2"`

```text
description.json created in /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-2
(node:66435) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

───────────────────────────────────────────────────────────────────
  SpecKit: Spec Folder Created Successfully
───────────────────────────────────────────────────────────────────

  BRANCH_NAME:  test-2
  FEATURE_NUM:  000
  DOC_LEVEL:    Level 2
  SPEC_FOLDER:  /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-2
```

5. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-2" --strict`

```text
Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-2
  Level:  2

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
```

6. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 3 --path "$TMPDIR/test-3" --name "test-3"`

```text
description.json created in /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3
(node:67439) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

───────────────────────────────────────────────────────────────────
  SpecKit: Spec Folder Created Successfully
───────────────────────────────────────────────────────────────────

  BRANCH_NAME:  test-3
  FEATURE_NUM:  000
  DOC_LEVEL:    Level 3
  SPEC_FOLDER:  /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3
```

7. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3" --strict`

```text
Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3
  Level:  3

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
```

8. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 3+ --path "$TMPDIR/test-3-plus" --name "test-3-plus"`

```text
description.json created in /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3-plus
(node:68447) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

───────────────────────────────────────────────────────────────────
  SpecKit: Spec Folder Created Successfully
───────────────────────────────────────────────────────────────────

  BRANCH_NAME:  test-3-plus
  FEATURE_NUM:  000
  DOC_LEVEL:    Level 3+
  SPEC_FOLDER:  /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3-plus
```

9. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-3-plus" --strict`

```text
Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-3-plus
  Level:  3+

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
```

10. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level phase-parent --path "$TMPDIR/test-phase-parent" --name "test-phase-parent"`

```text
description.json created in /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-phase-parent
(node:69349) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[speckit] Warning: scaffolding validation child with placeholder name '001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG'. Replace via --phase-names <literal-slug> for production use.

───────────────────────────────────────────────────────────────────
  SpecKit: Spec Folder Created Successfully
───────────────────────────────────────────────────────────────────

  BRANCH_NAME:  test-phase-parent
  FEATURE_NUM:  000
  DOC_LEVEL:    Level phase
  SPEC_FOLDER:  /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-phase-parent
```

11. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$TMPDIR/test-phase-parent" --strict`

```text
Auto-enabled recursive validation: phase child folders detected.

Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-phase-parent
  Level:  phase

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
! COMPLEXITY_MATCH: Content metrics may not match declared Level 2
x LEVEL_MATCH: Level consistency errors
! SECTION_COUNTS: Section counts below expectations for Level phase

Summary: Errors: 2  Warnings: 2

RESULT: FAILED

Spec Folder Validation v3.0.0

  Folder: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/test-phase-parent/001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG
  Level:  1

x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 2 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 2 drifted field(s) (enforced)

Summary: Errors: 2  Warnings: 0

RESULT: FAILED
```

12. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/workflow-invariance.vitest.ts`

```text
Not re-run in the original transcript; the documented command now uses the npm workspace path for the scripts package.
```

13. `rm -rf "$TMPDIR"`

```text
rm: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//com.apple.ImageIOXPCService: Operation not permitted
rm: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//com.apple.ThreadCommissionerService: Operation not permitted
rm: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//com.apple.avconferenced: Operation not permitted
rm: /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/: Operation not permitted
```

### Pass / Fail

- **FAIL**: Strict validation failed for generated Level 1, Level 2, Level 3, Level 3+, and phase-parent packets; the workflow-invariance command must be re-run with the npm workspace command above; cleanup also failed with `Operation not permitted` errors.

### Failure Triage

Inspect the Level contract resolver, inline gate renderer, scaffolder output, and the first failing validator message.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/template_composition_system.md](../../feature_catalog/tooling_and_scripts/template_composition_system.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 244
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/template_composition_system.md`
