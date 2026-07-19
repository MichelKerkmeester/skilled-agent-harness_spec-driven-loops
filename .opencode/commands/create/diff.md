---
description: Create a self-contained before/after document diff report via the create-diff engine. Modes :auto, :confirm.
argument-hint: "<target-document | --before old --after new> [--report out.html] [--view unified|side-by-side] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:diff Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:diff to its presentation contract and workflow YAML for producing a local, Git-free before/after document diff as a self-contained HTML report via the create-diff engine.

- Do not dispatch workflow behavior from this router.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create-diff-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-diff-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-diff-confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create-diff-presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create-diff-auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create-diff-confirm.yaml` |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create-diff-presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-diff-auto.yaml` for `:auto`, `create-diff-confirm.yaml` for `:confirm` or an omitted mode) runs the create-diff workflow step by step after Phase 0 verification and setup resolution, wrapping the `create_diff.py` engine to capture a baseline (or accept an explicit before/after pair), compare the versions, render a single self-contained HTML report, and validate it with `validate_report.py`. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
