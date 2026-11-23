---
description: Read installed bots, last runs, deliveries and the needs-you inbox. Read-only. :auto/:confirm.
argument-hint: "[status|inbox] [--json] [--all] [--repo <path>] [:auto|:confirm]"
allowed-tools: Read, Bash, Grep, Glob
---

# /bots:status Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 0. REQUIRED INPUT

`/bots:status` needs no positional input. With no view it reads the status, and with `inbox` it reads the needs-you inbox. It never needs a bot id.

---

## 1. ROUTER CONTRACT

Route /bots:status to its presentation contract and workflow YAML. Read the status or the inbox through the two read verbs of the bots CLI, and report the rows as printed.

This command is read-only. Its Bash grant covers only `bots status` and `bots inbox`. It has no write or edit tool, so `--rebuild` and `--unregister` are never run from here: the result names them as the operator's next step. The `bots-status` packet of `system-skilled-bots` owns the status workflow, and the workflow YAML owns setup, execution mode and every command it runs.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/bots/assets/bots-status-presentation.txt` |
| Auto workflow | `.skilled/commands/bots/assets/bots-status-auto.yaml` |
| Confirm workflow | `.skilled/commands/bots/assets/bots-status-confirm.yaml` |
| Mode contract | `.skilled/skills/system-skilled-bots/bots-status/SKILL.md` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation contract owns user-visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, and no suffix uses the confirm workflow.
2. Treat the remaining tokens and flags as workflow inputs rather than execution modes.
3. Read `.skilled/commands/bots/assets/bots-status-presentation.txt` and run its setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, the setup display and result display.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.skilled/commands/bots/assets/bots-status-auto.yaml` |
| `:confirm` or omitted mode | `.skilled/commands/bots/assets/bots-status-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the setup display, checkpoint display, success and failure output, and next-step text live only in `.skilled/commands/bots/assets/bots-status-presentation.txt`.

The router must not invent visible wording for those surfaces. It selects the workflow YAML and the execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`bots-status-auto.yaml` for `:auto`, `bots-status-confirm.yaml` for `:confirm` or an omitted mode) loads the `bots-status` mode contract and runs one read verb step by step.
`:auto` executes autonomously.
`:confirm` runs the same steps and stops once, after the view is resolved and before the read runs.
All prompts, displays and result wording come from the presentation contract, not this router.
