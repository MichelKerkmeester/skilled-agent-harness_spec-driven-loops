---
description: Create a self-contained HTML/SVG technical diagram across 27 types, or redraw an existing draw.io/Mermaid source. Modes :auto, :confirm.
argument-hint: "<target-diagram.html> [description | --import source-file] [--type <diagram-type>] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:diagram Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:diagram to its presentation contract and workflow YAML for producing a self-contained HTML/SVG technical diagram, or for redrawing an existing draw.io/Mermaid source at a chosen format, size, detail level, and audience.

- Do not dispatch workflow behavior from this router.
- Do not edit workflow YAML while executing this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create-diagram-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-diagram-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-diagram-confirm.yaml` |

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create-diagram-presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create-diagram-auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create-diagram-confirm.yaml` |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create-diagram-presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-diagram-auto.yaml` for `:auto`, `create-diagram-confirm.yaml` for `:confirm` or an omitted mode) runs the diagram workflow step by step after Phase 0 verification and setup resolution: detect generate/import/export request shape, load the style guide and the matching `references/types/type-*.md` or import/export reference, draw or redraw the diagram against the shared design system and complexity budget, and validate the accessible-SVG contract before delivery. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

User request: $ARGUMENTS
