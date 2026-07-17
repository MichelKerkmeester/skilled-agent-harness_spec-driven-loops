---
description: Create and manage constitutional rules — always-surface entries that appear at the top of every search result.
argument-hint: "[rule-description] | list | edit <filename> | remove <filename> | budget"
allowed-tools: Read, Write, Edit, Glob, Bash, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_list, mcp__mk_spec_memory__memory_delete, mcp__mk_spec_memory__memory_index_scan
---

# /memory:learn

Thin router for constitutional rule management.

## 1. ROUTER CONTRACT

Destination: `.opencode/skills/system-spec-kit/constitutional/`.

Outputs:
- `STATUS=OK ACTION=<overview|created|listed|edited|removed|budget>`
- `STATUS=CANCELLED ACTION=<action>`
- `STATUS=FAIL ERROR="<message>"`

Guardrails:
- Do not infer rule content from screenshots, open files, or prior conversation context.
- Show generated constitutional rule content and wait for approval before writing a new rule.
- For removal, validate filename is basename-only and wait for explicit confirmation.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/memory/assets/learn_presentation.txt` |

This is a direct-dispatch command: it routes straight to the memory MCP tools and constitutional-rule filesystem writes and owns no workflow YAML by design.

Before rendering any dashboard, approval prompt, or result block, read the presentation asset and use it as the display source of truth.

## 3. MODE ROUTING

Inputs:
- Empty arguments route to overview.
- `list` routes to constitutional rule list.
- `budget` routes to token budget dashboard.
- `edit <filename>` edits an existing constitutional rule.
- `remove <filename>` removes an existing constitutional rule after confirmation.
- Any other text is treated as a proposed new constitutional rule.

## 4. EXECUTION TARGETS

This command dispatches to the constitutional-rule directory and the memory MCP tools declared in `allowed-tools` (`memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan`). Routing procedure:

1. Parse `$ARGUMENTS` and choose one route.
2. For `edit` or `remove` without a filename, list available files and ask one targeted selection question.
3. For create, verify the rule qualifies as constitutional; suggest `/memory:save` for scoped/session context.
4. For create/edit/remove, preserve ANCHOR tags and frontmatter shape.
5. Index changes through `memory_save` or `memory_index_scan` as appropriate.
6. Verify constitutional visibility with `memory_search` when a new rule is created.
7. Render all displays from the presentation asset.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/learn_presentation.txt`:

- Overview, list, budget, create, edit, remove, confirmation, and result displays.
- Constitutional-rule qualification prompts, approval wording, cancellation wording, and error displays.
- Visibility verification, token-budget, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves the operation and required safety gates.

## 6. WORKFLOW SUMMARY

The router parses `$ARGUMENTS` into one route (overview, list, budget, create, edit, or remove), applies the constitutional-rule safety gates, dispatches to the memory MCP tools and constitutional-directory writes, indexes the change, verifies visibility, and renders every user-facing string through the presentation asset. It is a direct-dispatch command with no workflow YAML by design.

Related commands: `/memory:search` (intent-aware context retrieval and analysis tools); `/memory:save` (save conversation context); `/memory:manage` (database management, checkpoints, ingest, retention, and health); `/speckit:resume` (session recovery and continuation).
