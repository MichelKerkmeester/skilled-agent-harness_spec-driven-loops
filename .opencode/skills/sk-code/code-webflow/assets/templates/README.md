---
title: "sk code assets webflow templates: Code README"
description: "Code-facing README for .opencode/skills/sk-code/assets/webflow/templates."
trigger_phrases:
  - "sk-code assets/webflow/templates"
  - "code README"
version: 3.5.0.5
---

# sk code assets webflow templates

Executable asset scripts shipped with the skill.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/sk-code/assets/webflow/templates` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Template files | 5 |
| README scope | Direct files in this folder |
| Review context | Current refinement and release-alignment review. The 026 audit is completed predecessor context. |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/sk-code/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/sk-code/assets/webflow/templates
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `assets/webflow/templates`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and current refinement context for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `component_template.js` | JS source file in this folder. |
| `component_template.css` | CSS source template in this folder. |
| `form_scaffold_template.html` | HTML form scaffold template in this folder. |
| `embed_template.html` | HTML embed template in this folder. |
| `head_footer_code_template.html` | HTML head/footer code template in this folder. |

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
User request: Check .opencode/skills/sk-code/assets/webflow/templates for sk-code and README coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Findings recorded in the current refinement and release-alignment review. Use the completed 026 audit only as predecessor context.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after the predecessor audit | Refresh the structure table and rerun the current release-alignment review check. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`sk-code/SKILL.md`](../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../../sk-doc/assets/skill/skill_readme_template.md) | README structure used for this code README. |
