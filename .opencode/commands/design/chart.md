---
description: Author a standalone HTML chart from a catalog of 26 forms, one per reader question. :auto/:confirm.
argument-hint: "<target-chart.html> <what the reader compares> [--form <catalog-id>] [--system neutral|ordered|categorical] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:chart Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /design:chart to its presentation contract and workflow YAML for producing a standalone HTML chart: one file, one card, one question a reader can answer by looking at it.

Do not author the chart from this document. The catalog that turns a question into a form, the template contract every form file holds, and the three colour systems are owned by `sk-design-chart`. The workflow YAML owns setup, execution mode and artifact writes.

> **The question picks the form, not the chart name.** A request arriving as "make me a bar chart" still needs the comparison behind it. When no catalog row answers that comparison, the run reports the gap rather than improvising a form.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/chart-presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/chart-auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/chart-confirm.yaml` |
| Mode contract | `.opencode/skills/sk-design/sk-design-chart/SKILL.md` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation contract owns user-visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, no suffix sets `ASK`.
2. Treat the positional `.html` path, the remaining positional text, `--form` and `--system` as workflow inputs rather than execution modes. `colour_system` defaults to `neutral`.
3. Read `.opencode/commands/design/assets/chart-presentation.txt` and run its Phase 0 verification and setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, setup and status dashboards, and result display.

> **A chart cannot be built from a described dataset.** Every value a form displays is typed into its data block, so the run stops for the literal values rather than inferring them from context, a screenshot or conversation history.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.opencode/commands/design/assets/chart-auto.yaml` |
| `:confirm` or omitted mode | `.opencode/commands/design/assets/chart-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, Phase 0 verification, the setup dashboard, the catalog resolution report, checkpoint display, gap wording, success and failure output, and next-step text live only in `.opencode/commands/design/assets/chart-presentation.txt`.

The router must not invent visible wording for those surfaces. It selects the workflow YAML and the execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-chart-auto.yaml` for `:auto`, `create-chart-confirm.yaml` for `:confirm` or an omitted mode) runs the chart workflow step by step after Phase 0 verification and setup resolution. It names the comparison the reader needs, resolves it to exactly one catalog row across the index and the reader-name table, copies that form file whole, replaces only the region between the data sentinels, applies one colour system and writes the headline as a conclusion, then runs `check-corpus.cjs` and reads its `RESULT:` line before reporting. `:auto` executes autonomously. `:confirm` runs the same steps as an interactive checkpointed workflow. A reported gap ends either mode and is a successful run. All prompts, dashboards and result display come from the presentation contract, not this router.
