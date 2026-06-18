---
description: Create global or packet-local changelog. Topology-aware, optional GitHub release. :auto/:confirm.
argument-hint: "<spec-folder-or-component> [--nested] [--bump <major|minor|patch|build>] [--release] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:changelog Router

This command is a thin router. It separates execution routing from user-facing presentation.

## Routing Assets

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_changelog_presentation.txt` | Startup questions, setup dashboard, release prompt layout, and completion display |
| Auto workflow | `.opencode/commands/create/assets/create_changelog_auto.yaml` | Autonomous changelog workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_changelog_confirm.yaml` | Interactive checkpointed changelog workflow execution |

## Execution Order

1. Read `.opencode/commands/create/assets/create_changelog_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_changelog_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_changelog_confirm.yaml`
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, release-option display, and final result display.

## Routing Rules

- Do not dispatch agents from this router.
- Do not edit workflow YAML while executing this command.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## Presentation Boundary

The following content lives only in `.opencode/commands/create/assets/create_changelog_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, release prompt layout, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

User request: $ARGUMENTS
