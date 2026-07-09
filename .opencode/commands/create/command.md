---
description: Create or update OpenCode slash command sets with :auto/:confirm workflow assets.
argument-hint: "<command_invocation> [command_request] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__mk_spec_memory__memory_save
---

# /create:command Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. PURPOSE

Route /create:command to its presentation contract and workflow YAML for creating or updating OpenCode slash command sets.

## 2. Owned Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_command_presentation.txt` | Startup questions, setup dashboard, and completion display |
| Auto workflow | `.opencode/commands/create/assets/create_command_auto.yaml` | Autonomous workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_command_confirm.yaml` | Interactive checkpointed workflow execution |

## 3. INSTRUCTIONS

1. Read `.opencode/commands/create/assets/create_command_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_command_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_command_confirm.yaml`
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. Routing Rules

- Do not author command workflow logic from this router.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_command_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

User request: $ARGUMENTS
