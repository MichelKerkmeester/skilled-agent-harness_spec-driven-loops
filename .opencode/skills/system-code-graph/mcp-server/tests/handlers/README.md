---
title: "system code graph mcp server tests handlers: Code README"
description: "Code-facing README for .opencode/skills/system-code-graph/mcp-server/tests/handlers."
trigger_phrases:
  - "system-code-graph mcp-server/tests/handlers"
  - "code README"
---

# system code graph mcp server tests handlers

Test code and validation helpers for this skill area.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/system-code-graph/mcp-server/tests/handlers` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 1 |
| README scope | Direct files in this folder |
| Test focus | `code_graph_classify_query_intent` dispatch on the 8-tool surface |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/system-code-graph/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/system-code-graph/mcp-server/tests/handlers
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Run the owning package test command from the nearest package boundary.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `mcp-server/tests/handlers`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling and type-discipline checks. |
| Verification handoff | Points reviewers at the owning package test command for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `classify-query-intent.vitest.ts` | TS source file in this folder. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Validate this folder**

```text
User request: Check .opencode/skills/system-code-graph/mcp-server/tests/handlers for current handler test coverage.
Skill routing: sk-code plus sk-doc.
Expected output: Current `code_graph_classify_query_intent` dispatch coverage for the 8-tool surface is verified with the owning package tests.
```

---

## 7. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| README appears stale | Source files changed after this README was refreshed | Refresh the structure table and rerun the owning package tests. |
| Verification command is unclear | Folder is a helper boundary | Use the nearest package or skill-level verification command. |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`system-code-graph/SKILL.md`](../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../../../sk-doc/create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
