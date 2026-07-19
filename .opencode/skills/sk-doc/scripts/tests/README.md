---
title: "sk doc scripts tests: Code README"
description: "Code-facing README for .opencode/skills/sk-doc/scripts/tests."
trigger_phrases:
  - "sk-doc scripts/tests"
  - "code README"
---

# sk doc scripts tests

Test code and validation helpers for this skill area.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/sk-doc/scripts/tests` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 8 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/sk-doc/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/sk-doc/scripts/tests
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run the owning package test command from the nearest package boundary.

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `scripts/tests`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `test_changelog_validator.py` | Regression tests for changelog document-type detection and validation. |
| `test_extract_structure_regressions.py` | Regression tests for `extract_structure.py`. |
| `test_feature_catalog_validation.py` | Unit test for the feature-catalog validation-table check. |
| `test-flowchart-validator.sh` | Tests for `validate-flowchart.sh` (box alignment + labels). |
| `test-frontmatter-version.mjs` | Unit/integration tests for `frontmatter-version.mjs`. |
| `test_package_skill_regressions.py` | Regression tests for `package_skill.py`. |
| `test_quick_validate_086.py` | Tests for `quick_validate.py`. |
| `test_validator.py` | Tests for `validate_document.py`. |
| `valid_*.md`, `missing_*.md`, `single-dash-anchors.md`, `command/`, `specs/` | Test fixtures and expected-shape sample documents (data, not code). |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/sk-doc/scripts/tests for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings list current README template alignment and freshness drift.
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun `python3 .opencode/skills/sk-doc/scripts/audit_readmes.py --repo-root .`. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:related-documents -->
## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`sk-doc/SKILL.md`](../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |

<!-- /ANCHOR:related-documents -->
