---
description: Unified folder README and install guide creation with sk-doc quality standards. Modes :auto, :confirm.
argument-hint: "[readme|install] <target> [--type <project|component|feature|skill>] [--platforms <list>] [--output <path>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:folder_readme Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_folder_readme_presentation.txt` | Startup questions, setup dashboard, README/install display contracts, and completion templates |
| Auto workflow | `.opencode/commands/create/assets/create_folder_readme_auto.yaml` | Autonomous README/install workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_folder_readme_confirm.yaml` | Interactive checkpointed README/install workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_folder_readme_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve operation from `$ARGUMENTS` or setup: `readme` or `install`.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_folder_readme_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_folder_readme_confirm.yaml`
6. Execute the selected YAML step by step and skip to the resolved operation section.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## Routing Rules

- Do not dispatch agents from this router.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_folder_readme_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, README/install display contracts, status display, completion templates, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

User request: $ARGUMENTS
