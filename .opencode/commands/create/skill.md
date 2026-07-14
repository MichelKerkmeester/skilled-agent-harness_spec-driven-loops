---
description: Create or update OpenCode skills via one unified command with operation routing. :auto/:confirm.
argument-hint: "<skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__mk_code_index__code_graph_query, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_save
---

# /create:skill Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:skill to its presentation contract and workflow YAML for creating or updating OpenCode skills through the unified skill command.

- Do not split behavior across legacy command definitions.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_skill_presentation.txt` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_skill_auto.yaml` | Autonomous unified skill workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_skill_confirm.yaml` | Interactive checkpointed unified skill workflow execution |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 4. EXECUTION TARGETS

1. Read `.opencode/commands/create/assets/create_skill_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve operation from setup: `full-create`, `full-update`, `reference-only`, or `asset-only`.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_skill_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_skill_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create_skill_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create_skill_auto.yaml` for `:auto`, `create_skill_confirm.yaml` for `:confirm` or an omitted mode) runs the unified skill workflow step by step after Phase 0 verification and setup resolution, then routes to the resolved `full-create`, `full-update`, `reference-only`, or `asset-only` operation branch to create or update OpenCode skills. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
