---
description: Save current conversation context into canonical spec-doc continuity surfaces with semantic indexing
argument-hint: "<spec-folder>"
allowed-tools: Read, Edit, Bash, Task, mcp__mk_spec_memory__memory_save, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_update
---

# /memory:save

Thin router for canonical continuity saves.

## 1. OWNED ASSETS

| Asset | Path | Status | Purpose |
| --- | --- | --- | --- |
| Workflow | _No memory workflow YAML exists in this checkout_ | Missing upstream asset | Keep routing in this file until a workflow YAML is introduced by a separate workflow-asset change. Do not invent or edit YAML from this command. |
| Presentation | `.opencode/commands/memory/assets/save_presentation.txt` | Required | Startup questions, save dashboards, result envelopes, trigger-edit display, and error rendering. |

Before rendering any prompt, dashboard, or result block, read the presentation asset and follow it as the display source of truth.

## 2. ROUTER CONTRACT

Inputs:
- `$ARGUMENTS` may contain an explicit spec folder.
- If `$ARGUMENTS` is empty, resolve the active spec folder using Gate 3 carry-over first, session file evidence second, and a targeted user question only when ambiguous.

Outputs:
- Default response is a save plan: target route, proposed edits, blockers, advisories, and follow-up actions.
- Explicit apply/full-auto may run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` with AI-authored JSON.
- Immediate retrieval freshness may use `memory_index_scan({ specFolder, includeSpecDocs: true, force: false })` after the save.

## 3. EXECUTION TARGETS

1. Resolve and validate `target_folder`.
2. Check topic/folder alignment and stop for confirmation on mismatch.
3. Extract session summary, key decisions, modified files, trigger phrases, technical context, tool calls, and notable exchanges.
4. Choose route category: `narrative_progress`, `narrative_delivery`, `decision`, `handover_state`, `research_finding`, `task_update`, `metadata_only`, or `drop`.
5. In default mode, return the save plan without mutating.
6. In explicit apply/full-auto mode, execute the metadata/description/graph-metadata refresh and index handoff script, inspect the post-save quality review, patch HIGH metadata issues when practical, then refresh index visibility through MCP. Canonical spec-doc content is owned by the MCP content-router save path.
7. Render the result using the presentation asset.

## 4. HARD RULES

- Do not use standalone `memory/*.md` files as save destinations.
- Do not claim an automatic hook save unless current hook evidence proves it.
- Do not open raw SQLite or edit memory DB files.
- Do not create or modify workflow YAML from this command.
- Use `/memory:manage retention-sweep` for retention cleanup.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/save_presentation.txt`:

- Startup questions and active spec-folder resolution prompts.
- Save plan, dashboard, approval, result-envelope, and error displays.
- Trigger-edit display, quality-review guidance, follow-up actions, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves routing and tooling.

## 6. TOOL MAP

| Need | Tool or Script |
| --- | --- |
| Metadata refresh and index handoff | `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` |
| Immediate index refresh | `mcp__mk_spec_memory__memory_index_scan` |
| Single-file indexing fallback | `mcp__mk_spec_memory__memory_save` |
| Trigger phrase correction | `mcp__mk_spec_memory__memory_update` |

## 7. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools.
- `/memory:manage`: Database management, checkpoints, ingest, retention, and health.
- `/memory:learn`: Constitutional rules.
- `/speckit:resume`: Session recovery and continuation.
