---
title: "system skill advisor mcp server lib scorer lanes: Code README"
description: "Code-facing README for .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes."
trigger_phrases:
  - "system-skill-advisor mcp-server/lib/scorer/lanes"
  - "code README"
---

# system skill advisor mcp server lib scorer lanes

Internal library code for reusable skill behavior.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 6 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/system-skill-advisor/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `mcp-server/lib/scorer/lanes`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `bm25.ts` | BM25F lexical shadow lane used by `lexical.ts` and registered as a shadow lane. |
| `derived.ts` | TS source file in this folder. |
| `explicit.ts` | TS source file in this folder. |
| `graph-causal.ts` | TS source file in this folder. |
| `lexical.ts` | TS source file in this folder. |
| `semantic-shadow.ts` | TS source file in this folder. |

---

## 5. CONFIGURATION

| Setting | Default | Purpose |
|---|---|---|
| sk-code surface | OPENCODE | Applies OpenCode TypeScript, JavaScript, Python, Shell and config conventions. |
| README scope | Direct folder | This file documents this folder, not sibling folders. |

---

## 6. USAGE EXAMPLES

**Audit this folder**

```text
User request: Check .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes for sk-code and README coverage.
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
| [`system-skill-advisor/SKILL.md`](../../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill-readme-template.md`](../../../../../sk-doc/create-skill/assets/skill/skill-readme-template.md) | README structure used for this code README. |
