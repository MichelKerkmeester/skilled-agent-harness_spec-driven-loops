---
description: Create or update manual testing playbook packages via one unified command. Modes :auto, :confirm.
argument-hint: "<skill-name> [create|update] [--path <dir>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:manual-testing-playbook Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:manual-testing-playbook to its presentation contract and workflow YAML for creating or updating manual testing playbook packages.

- Do not split behavior across legacy or sidecar-doc playbook commands.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create_manual_testing_playbook_presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create_manual_testing_playbook_auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create_manual_testing_playbook_confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create_manual_testing_playbook_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve operation from setup: `create` or `update`.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
6. Execute the selected YAML step by step and route to the resolved operation branch.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create_manual_testing_playbook_auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create_manual_testing_playbook_confirm.yaml` |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create_manual_testing_playbook_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, operation display, status display, completion template, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create_manual_testing_playbook_auto.yaml` for `:auto`, `create_manual_testing_playbook_confirm.yaml` for `:confirm` or an omitted mode) runs the testing-playbook workflow step by step after Phase 0 verification and setup resolution, then routes to the resolved `create` or `update` operation branch to create or update manual testing playbook packages. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
