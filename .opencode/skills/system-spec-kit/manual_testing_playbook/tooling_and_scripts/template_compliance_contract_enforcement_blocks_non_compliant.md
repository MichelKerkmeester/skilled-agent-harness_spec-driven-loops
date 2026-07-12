---
title: "208 -- Template Compliance Contract Enforcement"
description: "This scenario validates Template Compliance Contract Enforcement for `208`. It focuses on confirming the 3-layer contract prevents non-compliant spec documents from passing strict validation."
version: 3.6.0.12
---

# 208 -- Template Compliance Contract Enforcement

## 1. OVERVIEW

This scenario validates Template Compliance Contract Enforcement for `208`. It focuses on confirming the 3-layer contract prevents non-compliant spec documents from passing strict validation.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the 3-layer template compliance contract blocks non-compliant spec documents.
- Real user request: `` Please validate Template Compliance Contract Enforcement against references/validation/template_compliance_contract.md and tell me whether the expected signals are present: the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass `validate.sh --strict`; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface. ``
- Prompt: `Validate Template Compliance Contract Enforcement against references/validation/template_compliance_contract.md and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass `validate.sh --strict`; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if contract presence is confirmed, compliant fixtures pass strict validation, and non-compliant fixtures fail for the expected structural reasons

---

## 3. TEST EXECUTION

### Prompt

```
Validate Template Compliance Contract Enforcement against references/validation/template_compliance_contract.md and report cited pass/fail evidence.
```

### Commands

1. inspect `references/validation/template_compliance_contract.md` and the five CLI `distributed-governance spec authoring` agent definitions to confirm the compact contract is embedded
2. run strict validation on the compliant fixture path and capture exit code 0
3. run strict validation on the extra-header fixture and confirm warning-only drift is promoted to failure in strict mode
4. run strict validation on the missing-header and reordered-anchor fixtures and capture the targeted failure output
5. run the extended validation coverage and confirm SECTION_COUNTS remains part of the validator surface

### Expected

the canonical contract exists in the shared reference and embedded spec-authoring runtime definitions; compliant fixtures pass `validate.sh --strict`; warning-only template drift fails in strict mode; missing or reordered required sections fail with targeted validator output; section-count minimum checks are present in the enforcement surface

### Evidence

Command 1, contract + five CLI agent-definition inspection:

```text
FOUND .opencode/skills/system-spec-kit/references/validation/template_compliance_contract.md
22:### Core Principle
29:- **Applies to:** `distributed-governance spec authoring` agent definitions across all CLIs
107:Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.
215:## 7. CONTENT MINIMUMS
275:3. Update any distributed-governance spec-authoring flow definitions that embed compact contracts
MISSING .claude/agents/speckit.md
MISSING .opencode/agents/speckit.md
MISSING .opencode/agents/speckit.toml
MISSING .codex/agents/speckit.md
MISSING .agents/agents/speckit.md
```

Command 2, strict validation on compliant fixture:

```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2
  Level:  2

+ FILE_EXISTS: All required files present for Level 2
+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
+ SECTION_COUNTS: Section counts appropriate for Level 2

Summary: Errors: 0  Warnings: 0

RESULT: PASSED
EXIT_CODE=0
```

Command 3, strict validation on extra-header warning fixture:

```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/test-fixtures/054-template-extra-header
  Level:  2

+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
+ ANCHORS_VALID: Template anchors match in 5 file(s)
! FRONTMATTER_VALID: 5 frontmatter continuity warning(s)
! FRONTMATTER_MEMORY_BLOCK: 1 frontmatter_memory_block issue(s) found
! GRAPH_METADATA_PRESENT: Graph metadata checked
! SECTION_COUNTS: Section counts below expectations for Level 2

Summary: Errors: 0  Warnings: 4

RESULT: FAILED
EXIT_CODE=2
```

Command 4, strict validation on missing-header fixture:

```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/test-fixtures/055-template-missing-header
  Level:  2

x TEMPLATE_HEADERS: 1 template headers issue(s) found
x ANCHORS_VALID: 10 template anchors issue(s) found
! SECTION_COUNTS: Section counts below expectations for Level 2

Summary: Errors: 2  Warnings: 4

RESULT: FAILED
EXIT_CODE=2
```

Command 4, strict validation on reordered-anchor fixture:

```text
Spec Folder Validation v3.0.0

  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor
  Level:  2

+ TEMPLATE_HEADERS: Template headers match in 5 file(s)
x ANCHORS_VALID: 10 template anchors issue(s) found
! SECTION_COUNTS: Section counts below expectations for Level 2

Summary: Errors: 1  Warnings: 4

RESULT: FAILED
EXIT_CODE=2
```

Command 5, extended validation coverage:

```text
SpecKit Extended Validation Test Suite v1.0
  Filter: rule matching "SECTION_COUNTS"

Individual Rule: SECTION_COUNTS (check-section-counts.sh):
─────────────────────────────────────────────────────────────────
✓ L1 section counts (warn) [139ms]
✓ L2 section counts (warn) [141ms]
✓ L3 section counts (warn) [143ms]

By Category:
─────────────────────────────────────────────────────────────────
  ● Individual Rule: SECTION_COUNTS (check-section-counts.sh): 3/3 passed (423ms)

Totals:
─────────────────────────────────────────────────────────────────
  Passed:  112
  Skipped: 0
  ─────────────
  Total:   112
  Time:    38.514s

RESULT: PASSED

EXIT_CODE=0
  Failed:  0
```

### Pass / Fail

- **BLOCKED**: The canonical contract exists and the validator fixtures produced the expected strict-validation behavior, but the scenario cannot confirm embedded spec-authoring runtime definitions because all five inspected CLI agent definition files are missing: `.claude/agents/speckit.md`, `.opencode/agents/speckit.md`, `.opencode/agents/speckit.toml`, `.codex/agents/speckit.md`, and `.agents/agents/speckit.md`.

### Failure Triage

Inspect `references/validation/template_compliance_contract.md`, `.opencode/agents/speckit.toml`, `scripts/spec/validate.sh`, and `scripts/tests/test-validation-extended.sh` if strict validation passes broken fixtures or misses contract drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/template_compliance_contract_enforcement.md](../../feature_catalog/tooling_and_scripts/template_compliance_contract_enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 208
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/template_compliance_contract_enforcement_blocks_non_compliant.md`
