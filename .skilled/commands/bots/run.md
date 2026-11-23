---
description: Start a bot run, queue or drain bot run requests, or answer a needs-you item. :auto/:confirm.
argument-hint: "<bot-id|drain|enqueue <bot-id> --source <name> --key <key>|answer <item-id> <text>> [--repo <path>] [:auto|:confirm]"
allowed-tools: Read, Bash, Grep, Glob
---

# /bots:run Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 0. REQUIRED INPUT

`/bots:run` needs a verb and its arguments. When `$ARGUMENTS` does not carry them, stop and ask for them. Never infer a bot id or an item id from context or conversation history.

---

## 1. ROUTER CONTRACT

Route /bots:run to its presentation contract and workflow YAML. Start one bots CLI verb that starts or continues a run, then report its exit code with its meaning.

Do not run any bots CLI verb from this document. The `bots-run` packet of `system-skilled-bots` owns the run workflow, and the workflow YAML owns setup, execution mode and every command it runs.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/bots/assets/bots-run-presentation.txt` |
| Auto workflow | `.skilled/commands/bots/assets/bots-run-auto.yaml` |
| Confirm workflow | `.skilled/commands/bots/assets/bots-run-confirm.yaml` |
| Mode contract | `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation contract owns user-visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, and no suffix uses the confirm workflow.
2. Treat the remaining tokens and flags as workflow inputs rather than execution modes.
3. Read `.skilled/commands/bots/assets/bots-run-presentation.txt` and run its setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, the setup display and result display.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.skilled/commands/bots/assets/bots-run-auto.yaml` |
| `:confirm` or omitted mode | `.skilled/commands/bots/assets/bots-run-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the setup display, checkpoint display, success and failure output, and next-step text live only in `.skilled/commands/bots/assets/bots-run-presentation.txt`.

The router must not invent visible wording for those surfaces. It selects the workflow YAML and the execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`bots-run-auto.yaml` for `:auto`, `bots-run-confirm.yaml` for `:confirm` or an omitted mode) loads the `bots-run` mode contract and runs exactly one verb step by step.
`:auto` executes autonomously.
`:confirm` runs the same steps and stops once, after the verb and its arguments are resolved and before the verb runs.
All prompts, displays and result wording come from the presentation contract, not this router.
