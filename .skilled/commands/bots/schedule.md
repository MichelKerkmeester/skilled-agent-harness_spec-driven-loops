---
description: Install or remove a cron bot's launchd schedule, or enable, disable, pause or resume a bot. :auto/:confirm.
argument-hint: "<install|uninstall|enable|disable|pause|resume> <bot-id> [--repo <path>] [:auto|:confirm]"
allowed-tools: Read, Bash, Grep, Glob
---

# /bots:schedule Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 0. REQUIRED INPUT

`/bots:schedule` needs an action and a bot id. When `$ARGUMENTS` does not carry them, stop and ask for them. Never infer a bot id from context or conversation history.

---

## 1. ROUTER CONTRACT

Route /bots:schedule to its presentation contract and workflow YAML. Run one schedule or posture verb of the bots CLI, then read the bot's status row.

Do not run any bots CLI verb from this document. The `bots-schedule` packet of `system-skilled-bots` owns the schedule workflow, and the workflow YAML owns setup, execution mode and every command it runs.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/bots/assets/bots-schedule-presentation.txt` |
| Auto workflow | `.skilled/commands/bots/assets/bots-schedule-auto.yaml` |
| Confirm workflow | `.skilled/commands/bots/assets/bots-schedule-confirm.yaml` |
| Mode contract | `.skilled/skills/system-skilled-bots/bots-schedule/SKILL.md` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation contract owns user-visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, and no suffix uses the confirm workflow.
2. Treat the remaining tokens and flags as workflow inputs rather than execution modes.
3. Read `.skilled/commands/bots/assets/bots-schedule-presentation.txt` and run its setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, the setup display and result display.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.skilled/commands/bots/assets/bots-schedule-auto.yaml` |
| `:confirm` or omitted mode | `.skilled/commands/bots/assets/bots-schedule-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the setup display, checkpoint display, success and failure output, and next-step text live only in `.skilled/commands/bots/assets/bots-schedule-presentation.txt`.

The router must not invent visible wording for those surfaces. It selects the workflow YAML and the execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`bots-schedule-auto.yaml` for `:auto`, `bots-schedule-confirm.yaml` for `:confirm` or an omitted mode) loads the `bots-schedule` mode contract and runs exactly one schedule or posture verb step by step.
`:auto` executes autonomously.
`:confirm` runs the same steps and stops once, before the verb runs, because an install writes and loads a launchd agent.
All prompts, displays and result wording come from the presentation contract, not this router.
