---
title: "sk doc scripts: Code README"
description: "Code-facing README for .opencode/skills/sk-doc/scripts."
trigger_phrases:
  - "sk-doc scripts"
  - "code README"
---

# sk doc scripts

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/sk-doc/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 10 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/sk-doc/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/sk-doc/scripts
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run individual scripts from the repository root with the documented arguments.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `scripts`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `audit_readmes.py` | Audit README template alignment and freshness drift; reports missing/extra files. |
| `check-frontmatter-versions.sh` | Pre-commit gate: every in-scope skill doc must carry a 4-part `version`. |
| `extract_structure.py` | Extract a document's structure, checklist and DQI score to JSON. |
| `frontmatter-version.mjs` | Frontmatter versioning engine: compute / insert / verify the 4-part `version` field. |
| `init_skill.py` | Scaffold a new skill directory from the sk-doc templates. |
| `package_skill.py` | Validate and bundle a skill into a distributable package. |
| `quick_validate.py` | Fast naming and frontmatter checks for pre-commit speed. |
| `validate-doc-model-refs.js` | Detect docs that cite a non-canonical model name as default. |
| `validate_document.py` | Validate a markdown doc against its type's required sections and frontmatter. |
| `validate-flowchart.sh` | Validate ASCII flowchart box alignment and decision-branch labels. |
| `tests/` | Test suite and fixtures for these scripts (see `tests/README.md`). |

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
User request: Check .opencode/skills/sk-doc/scripts for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings list current README template alignment and freshness drift.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun `python3 .opencode/skills/sk-doc/scripts/audit_readmes.py --repo-root .`. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`sk-doc/SKILL.md`](../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
