---
description: Create and manage constitutional rules — always-surface entries that appear at the top of every search result.
argument-hint: "[rule-description] | list | edit <filename> | remove <filename> | budget"
allowed-tools: Read, Write, Edit, Glob, Bash, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_list, mcp__mk_spec_memory__memory_delete, mcp__mk_spec_memory__memory_index_scan
---

# /memory:learn

Thin router for constitutional rule management.

## 1. ROUTING ASSETS

| Asset | Path | Status | Purpose |
| --- | --- | --- | --- |
| Workflow | _No memory workflow YAML exists in this checkout_ | Missing upstream asset | Keep constitutional-rule routing in this file until a workflow YAML is introduced by a separate workflow-asset change. Do not invent or edit YAML from this command. |
| Presentation | `.opencode/commands/memory/assets/learn_presentation.txt` | Required | Overview, list, budget, create, edit, remove, confirmation, and result displays. |

Before rendering any dashboard, approval prompt, or result block, read the presentation asset and use it as the display source of truth.

## 2. ROUTER CONTRACT

Destination: `.opencode/skills/system-spec-kit/constitutional/`.

Inputs:
- Empty arguments route to overview.
- `list` routes to constitutional rule list.
- `budget` routes to token budget dashboard.
- `edit <filename>` edits an existing constitutional rule.
- `remove <filename>` removes an existing constitutional rule after confirmation.
- Any other text is treated as a proposed new constitutional rule.

Outputs:
- `STATUS=OK ACTION=<overview|created|listed|edited|removed|budget>`
- `STATUS=CANCELLED ACTION=<action>`
- `STATUS=FAIL ERROR="<message>"`

## 3. WORKFLOW ROUTING

1. Parse `$ARGUMENTS` and choose one route.
2. For `edit` or `remove` without a filename, list available files and ask one targeted selection question.
3. For create, verify the rule qualifies as constitutional; suggest `/memory:save` for scoped/session context.
4. For create/edit/remove, preserve ANCHOR tags and frontmatter shape.
5. Index changes through `memory_save` or `memory_index_scan` as appropriate.
6. Verify constitutional visibility with `memory_search` when a new rule is created.
7. Render all displays from the presentation asset.

## 4. HARD RULES

- Do not infer rule content from screenshots, open files, or prior conversation context.
- Show generated constitutional rule content and wait for approval before writing a new rule.
- For removal, validate filename is basename-only and wait for explicit confirmation.
- Do not create or modify workflow YAML from this command.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/learn_presentation.txt`:

- Overview, list, budget, create, edit, remove, confirmation, and result displays.
- Constitutional-rule qualification prompts, approval wording, cancellation wording, and error displays.
- Visibility verification, token-budget, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves the operation and required safety gates.

## 6. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools.
- `/memory:save`: Save conversation context.
- `/memory:manage`: Database management, checkpoints, ingest, retention, and health.
- `/speckit:resume`: Session recovery and continuation.
