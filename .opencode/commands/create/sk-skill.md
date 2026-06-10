---
description: Create or update OpenCode skills via one unified command with operation routing. :auto/:confirm.
argument-hint: "<skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:sk-skill Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_sk_skill_presentation.md` | Startup questions, setup dashboard, operation/status display, and completion template |
| Auto workflow | `.opencode/commands/create/assets/create_sk_skill_auto.yaml` | Autonomous unified skill workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_sk_skill_confirm.yaml` | Interactive checkpointed unified skill workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_sk_skill_presentation.md`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve operation from setup: `full-create`, `full-update`, `reference-only`, or `asset-only`.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_sk_skill_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_sk_skill_confirm.yaml`
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## Routing Rules

- Do not split behavior across legacy command definitions.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

User request: {{args}}
