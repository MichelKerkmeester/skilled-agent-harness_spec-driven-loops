---
description: Create or update MCP benchmark folders and reports. Modes :auto, :confirm.
argument-hint: "<skill-name> <spec-packet> [create|update] [--date YYYY-MM-DD] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:benchmark Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. PURPOSE

Route /create:benchmark to its presentation contract and workflow YAML for creating or updating MCP benchmark folders and reports.

## 2. Owned Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_benchmark_presentation.txt` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_benchmark_auto.yaml` | Autonomous benchmark promotion workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_benchmark_confirm.yaml` | Interactive checkpointed benchmark promotion workflow execution |

## 3. INSTRUCTIONS

1. Read `.opencode/commands/create/assets/create_benchmark_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Resolve operation from setup: `create` or `update`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_benchmark_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_benchmark_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. Routing Rules

- Do not split behavior across legacy or ad-hoc benchmark commands.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_benchmark_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

User request: $ARGUMENTS
