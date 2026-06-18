---
title: "sk code assets webflow integrations: Code README"
description: "Code-facing README for .opencode/skills/sk-code/assets/webflow/integrations."
trigger_phrases:
  - "sk-code assets/webflow/integrations"
  - "code README"
---

# sk code assets webflow integrations

Executable asset scripts shipped with the skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/sk-code/assets/webflow/integrations` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 2 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/sk-code/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/sk-code/assets/webflow/integrations
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `assets/webflow/integrations`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `hls_patterns.js` | JS source file in this folder. |
| `lenis_patterns.js` | JS source file in this folder. |

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
User request: Check .opencode/skills/sk-code/assets/webflow/integrations for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the current refinement and release-alignment review, with 026 retained as the completed predecessor.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this audit | Refresh the structure table and rerun the current release-alignment README remediation check; use 026 only as predecessor context. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`sk-code/SKILL.md`](../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README. |
