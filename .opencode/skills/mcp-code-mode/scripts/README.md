---
title: "mcp code mode scripts: Code README"
description: "Code-facing README for .opencode/skills/mcp-code-mode/scripts."
trigger_phrases:
  - "mcp-code-mode scripts"
  - "code README"
---

# mcp code mode scripts

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/mcp-code-mode/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 4 |
| README scope | Direct files in this folder |
| Review context | Current source alignment notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/mcp-code-mode/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/mcp-code-mode/scripts
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
| Verification handoff | Records the expected owner and verification path for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `doctor.sh` | Shell health-check script for the live Code Mode setup. |
| `install.sh` | Shell installer for Code Mode prerequisites and local wiring. |
| `update.sh` | Shell updater for refreshing the local Code Mode installation. |
| `validate_config.py` | PY source file in this folder. |

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
User request: Check .opencode/skills/mcp-code-mode/scripts for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded against the current source alignment review.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this review | Refresh the structure table and rerun the current source alignment check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`mcp-code-mode/SKILL.md`](../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../sk-doc/create-skill/assets/skill/skill_readme_template.md) | README structure used for this code README. |
