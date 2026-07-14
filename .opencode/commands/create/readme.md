---
description: Unified folder README and install guide creation with sk-doc quality standards. Modes :auto, :confirm.
argument-hint: "[readme|install] <target> [--type <project|component|feature|skill>] [--platforms <list>] [--output <path>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite
---

# /create:readme Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:readme to its presentation contract and workflow YAML for creating folder READMEs or install guides with sk-doc quality standards.

- Do not dispatch agents from this router.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Asset | Path | Purpose |
| --- | --- | --- |
| Presentation contract | `.opencode/commands/create/assets/create_readme_presentation.txt` | Startup questions, setup dashboard, README/install display contracts, and completion templates |
| Auto workflow | `.opencode/commands/create/assets/create_readme_auto.yaml` | Autonomous README/install workflow execution |
| Confirm workflow | `.opencode/commands/create/assets/create_readme_confirm.yaml` | Interactive checkpointed README/install workflow execution |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

## 4. EXECUTION TARGETS

1. Read `.opencode/commands/create/assets/create_readme_presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve operation from `$ARGUMENTS` or setup: `readme` or `install`.
4. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
5. Load exactly one workflow YAML:
   - `:auto` -> `.opencode/commands/create/assets/create_readme_auto.yaml`
   - `:confirm` or omitted mode -> `.opencode/commands/create/assets/create_readme_confirm.yaml`
6. Execute the selected YAML step by step and skip to the resolved operation section.
7. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create_readme_presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, README/install display contracts, status display, completion templates, and next-step text.

The router must not invent visible wording for those surfaces; it only resolves operation, execution mode, and workflow selection.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create_readme_auto.yaml` for `:auto`, `create_readme_confirm.yaml` for `:confirm` or an omitted mode) runs the README/install workflow step by step after Phase 0 verification and setup resolution, skipping to the resolved `readme` or `install` operation section to create folder READMEs or install guides with sk-doc quality standards. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
