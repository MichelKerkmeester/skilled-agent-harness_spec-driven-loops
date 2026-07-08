---
title: "deep ai council scripts: Code README"
description: "Code-facing README for .opencode/skills/system-deep-loop/deep-ai-council/scripts."
trigger_phrases:
  - "deep-ai-council scripts"
  - "code README"
---

# deep ai council scripts

Operator and maintenance scripts for this skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/system-deep-loop/deep-ai-council/scripts` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 5 direct `.cjs` files |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/system-deep-loop/deep-ai-council/scripts
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
| `advise-council-completion.cjs` | CJS source file in this folder. |
| `orchestrate-session.cjs` | CJS source file in this folder. |
| `orchestrate-topic.cjs` | CJS source file in this folder. |
| `persist-artifacts.cjs` | CJS source file in this folder. |
| `replay-graph-from-artifacts.cjs` | CJS source file in this folder. |

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
User request: Check .opencode/skills/system-deep-loop/deep-ai-council/scripts for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the 026 audit report.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the 026 audit check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`deep-ai-council/SKILL.md`](../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../sk-doc/create-skill/assets/skill/skill_readme_template.md) | README structure used for this code README. |
