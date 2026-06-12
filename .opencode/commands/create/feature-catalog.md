---
description: Create or update feature catalog packages via one unified command. Modes :auto, :confirm.
argument-hint: "<skill-name> [create|update] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:feature-catalog Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_feature_catalog_presentation.md` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_feature_catalog_auto.yaml` | Autonomous feature catalog workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml` | Interactive checkpointed feature catalog workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_feature_catalog_presentation.md`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Resolve operation from setup: `create` or `update`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_feature_catalog_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_feature_catalog_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## Routing Rules

- Do not split behavior across legacy or ad-hoc catalog commands.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_feature_catalog_presentation.md`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

User request: {{args}}
