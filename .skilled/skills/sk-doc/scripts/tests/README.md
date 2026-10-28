---
title: "sk doc scripts tests: Code README"
description: "Code-facing README for .skilled/skills/sk-doc/scripts/tests."
trigger_phrases:
  - "sk-doc scripts/tests"
  - "code README"
---

# sk doc scripts tests

Test code and validation helpers for this skill area.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.skilled/skills/sk-doc/scripts/tests` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 51 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.skilled/skills/sk-doc/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .skilled/skills/sk-doc/scripts/tests
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run the owning package test command from the nearest package boundary.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `scripts/tests`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `test_audit_readmes_accuracy.py` | Regression tests for README audit reference resolution, git-ignored runtime paths and README discovery. |
| `test_benchmark_companion_typing.py` | Regression tests for the benchmark companion document type and the singular `-fixture` folder skip in `validate_document.py`. |
| `test_changelog_validator.py` | Regression tests for changelog document-type detection and validation. |
| `test_derived_readme_counts.py` | Regression tests for which numbers `check_derived_readme_counts.py` reads as count claims. |
| `test_readme_reference_checker.py` | Regression tests for the audit-aligned path rules in `check_readme_references.py`. |
| `test_extract_structure_regressions.py` | Regression tests for `extract_structure.py`. |
| `test_feature_catalog_validation.py` | Unit test for the feature-catalog validation-table check. |
| `test-flowchart-validator.sh` | Tests for sk-design-diagram's `validate-flowchart.sh` (box alignment + labels). |
| `test-frontmatter-version.mjs` | Unit/integration tests for `frontmatter-version.mjs`. |
| `test-cite-drift-scan.mjs` | Unit/integration tests for `cite-drift-scan.mjs` and its `classifier-cite-drift-scan.mjs` arm. |
| `test_cite_drift_advisory.py` | Tests for the citation drift advisory at the end of `validate_document.py`'s human report. |
| `test_package_skill_regressions.py` | Regression tests for `package_skill.py`. |
| `test_quick_validate_086.py` | Tests for `quick_validate.py`. |
| `test_validator.py` | Tests for `validate_document.py`. |
| `test_scaffold_template_typing.py` | Regression tests for how `validate_document.py` types skill scaffold templates versus asset guides. |
| `valid-readme.md`, `missing-sections.md`, `single-dash-anchors.md`, `command/`, `specs/` | Test fixtures and expected-shape sample documents (data, not code). A file prefixed `valid-` is a well-formed sample of its document type, and each `missing-` file drops one required section. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .skilled/skills/sk-doc/scripts/tests for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings list current README template alignment and freshness drift.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun `python3 .skilled/skills/sk-doc/scripts/audit_readmes.py --repo-root .`. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`sk-doc/SKILL.md`](../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../sk-create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |

