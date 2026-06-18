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
| Code files | 5 |
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
| `test_changelog_validator.py` | PY source file in this folder. |
| `test_extract_structure_regressions.py` | PY source file in this folder. |
| `test_package_skill_regressions.py` | PY source file in this folder. |
| `test_quick_validate_086.py` | PY source file in this folder. |
| `test_validator.py` | PY source file in this folder. |

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
| [`sk-doc skill_readme_template.md`](../../assets/skill/skill_readme_template.md) | README structure used for this code README. |

<!-- /ANCHOR:related-documents -->
