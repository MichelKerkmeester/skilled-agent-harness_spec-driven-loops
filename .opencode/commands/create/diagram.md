---
description: Create an HTML/SVG diagram (27 types), ASCII/markdown flowchart, or draw.io/Mermaid redraw. :auto/:confirm.
argument-hint: "<target.html|target.md> [description|--import <src>] [--output-format html-svg|ascii-markdown] [--type <t>] [--format <f>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /create:diagram Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:diagram to its presentation contract and workflow YAML for producing an HTML/SVG technical diagram, an ASCII/markdown flowchart, or a redraw of an existing draw.io/Mermaid source at a chosen format, size, detail level, and audience.

- Do not dispatch workflow behavior from this router.
- Do not edit workflow YAML while executing this command.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation contract | `.opencode/commands/create/assets/create-diagram-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-diagram-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-diagram-confirm.yaml` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation Markdown owns user-visible wording and layout.

1. Read `.opencode/commands/create/assets/create-diagram-presentation.txt`.
2. Run the presentation contract's Phase 0 verification and setup resolution.
3. Treat the following as workflow inputs rather than execution modes: the positional target path (`.html` for a diagram, `.md` for a flowchart), the remaining positional text as the description, `--import <src>` to redraw an existing draw.io or Mermaid source instead of describing one, `--type <t>` to name one of the 27 diagram types, `--format <f>` to choose the export format (`png`, `svg`, or `html+png`), and `--output-format` to choose the artifact family. Under `:auto`, a `PRE-BOUND SETUP ANSWERS:` block in the prompt body supplies the setup answers non-interactively.
4. Resolve output format before selecting a diagram type or ASCII pattern: `html-svg` is the default; `ascii-markdown` is selected by `--output-format ascii-markdown`, a markdown target, or ASCII/flowchart request signals. Preserve `--format` for export formats. If the output format is ambiguous, use the presentation contract's `UNKNOWN_FALLBACK` path rather than guessing.
5. Resolve execution mode from `$ARGUMENTS` or the setup answer: `:auto` or `:confirm`.
6. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
7. Execute the selected YAML step by step.
8. Use the presentation contract, not this router, for user prompts, setup/status dashboards, and final result display.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/create/assets/create-diagram-auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/create/assets/create-diagram-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/create/assets/create-diagram-presentation.txt`:

- Startup questions, Phase 0 verification, setup dashboard, confirmation prompts, status display, completion display, and next-step text.

The router must not invent visible wording for those surfaces; it only selects the workflow YAML and execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-diagram-auto.yaml` for `:auto`, `create-diagram-confirm.yaml` for `:confirm` or an omitted mode) runs the workflow step by step after Phase 0 verification and setup resolution: resolve `html-svg` versus `ascii-markdown`, detect the request shape for `html-svg`, load the style guide and matching type/import/export reference or the ASCII pattern-selection/pattern asset, create or redraw the requested artifact, and run the applicable taste gate or `validate-flowchart.sh` check before delivery. `:auto` executes autonomously; `:confirm` runs the same steps as an interactive checkpointed workflow. All user-facing prompts, setup/status dashboards, and result display come from the presentation contract, not this router.

