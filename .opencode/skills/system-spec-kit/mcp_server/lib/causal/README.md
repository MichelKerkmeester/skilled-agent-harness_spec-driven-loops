---
title: "system spec kit mcp server lib causal: Code README"
description: "Code-facing README for .opencode/skills/system-spec-kit/mcp_server/lib/causal."
trigger_phrases:
  - "system-spec-kit mcp_server/lib/causal"
  - "code README"
---

# system spec kit mcp server lib causal

Internal library code for reusable skill behavior.

---

## 1. OVERVIEW

### Purpose

This README documents the code-bearing folder `.opencode/skills/system-spec-kit/mcp_server/lib/causal` so operators can understand its role without opening every source file first. It follows the sk-doc skill README structure while staying focused on code navigation.

### Usage

Use this file to identify the folder boundary, the likely verification path, and the local source files that need sk-code conventions. Keep behavior details in source comments and higher-level workflow details in the owning `SKILL.md`.

### Key Statistics

| Metric | Value |
|---|---:|
| Code files | 4 |
| README scope | Direct files in this folder |
| Audit context | Internal validation notes |

---

## 2. QUICK START

**Step 1: Confirm the owner.**

Start with `.opencode/skills/system-spec-kit/SKILL.md` for runtime routing and workflow boundaries.

**Step 2: Inspect the local code.**

```bash
rg --files .opencode/skills/system-spec-kit/mcp_server/lib/causal
```

Expected result: the command lists the source files summarized below.

**Step 3: Verify changes.**

Load this folder through the owning skill workflow or MCP server entrypoint.

---

## 3. FEATURES

| Feature | What It Does |
|---|---|
| Folder boundary | Documents direct code files under `mcp_server/lib/causal`. |
| sk-code alignment | Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks. |
| Verification handoff | Records the expected owner and audit packet for follow-up work. |

---

## 4. STRUCTURE

| Path | Purpose |
|---|---|
| `frontmatter-promoter.ts` | Promotes `graph-metadata.json` and `description.json` frontmatter relationships into generated causal edges, preserves manual edges, tombstones stale open generated edges, and skips generated edges that are already temporally closed (`invalid_at IS NOT NULL`) during cleanup. |
| `relation-coverage.ts` | Pure reporter for `memory_causal_stats` relation-coverage: per-relation share/status and the honest backfill-job hint. |
| `relation-backfill.ts` | Bounded, dryRun-default relation-inference backfill — infers typed `created_by='auto'` edges from existing deterministic signals (spec-document chains, lineage predecessor→successor) plus opt-in similarity (`supports`, from cached `related_memories`) and supersession (`contradicts`) collectors, both default-off, and invalidates the entity-density cache after commit. |
| `sweep.ts` | Shared causal-edge sweep helper that tombstones or deletes selected edges with restore metadata for cleanup and recovery paths. |

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
User request: Check .opencode/skills/system-spec-kit/mcp_server/lib/causal for sk-code and README coverage.
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
| [`system-spec-kit/SKILL.md`](../../../SKILL.md) | Runtime instructions for the owning skill. |
| [`sk-code/SKILL.md`](../../../../sk-code/SKILL.md) | OpenCode coding standards and verification routing. |
| [`sk-doc skill_readme_template.md`](../../../../sk-doc/create-skill/assets/skill/skill_readme_template.md) | README structure used for this code README. |
