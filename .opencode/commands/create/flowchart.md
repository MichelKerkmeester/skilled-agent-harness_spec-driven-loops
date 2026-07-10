---
description: Create an ASCII flowchart markdown file with pattern selection and validation. Modes :auto, :confirm.
argument-hint: "<target-flowchart.md> [source/process description] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:flowchart Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. PURPOSE

Route /create:flowchart to its presentation contract and workflow YAML for creating an ASCII flowchart markdown file with pattern selection and validation.

## 2. Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_flowchart_presentation.txt` | Startup questions, setup dashboard, and completion display |
| Auto workflow | `.opencode/commands/create/assets/create_flowchart_auto.yaml` | Autonomous workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_flowchart_confirm.yaml` | Interactive checkpointed workflow execution |

## 3. INSTRUCTIONS

1. Read `.opencode/commands/create/assets/create_flowchart_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_flowchart_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_flowchart_confirm.yaml`
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. Routing Rules

- Do not dispatch workflow behavior from this router.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 5. Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_flowchart_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

User request: $ARGUMENTS
