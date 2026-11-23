---
description: Write or edit a bot's BOT.md from the template, then hand the check to /doctor:bots. :auto/:confirm.
argument-hint: "<bot-id> [--repo <path>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Grep, Glob
---

# /bots:author Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 0. REQUIRED INPUT

`/bots:author` needs bot-id. When `$ARGUMENTS` does not carry it, stop and ask for it. Never infer it from context or conversation history.

---

## 1. ROUTER CONTRACT

Route /bots:author to its presentation contract and workflow YAML. Write or edit one bots/<id>/BOT.md from the shipped template.

Do not run a shell command or the bots CLI from this document. This command grants no Bash, so the definition check is not run here: `/doctor:bots` runs it read-only. The `bots-author` packet of `system-skilled-bots` owns the author workflow, and the workflow YAML owns setup, execution mode and every step it runs.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/bots/assets/bots-author-presentation.txt` |
| Auto workflow | `.skilled/commands/bots/assets/bots-author-auto.yaml` |
| Confirm workflow | `.skilled/commands/bots/assets/bots-author-confirm.yaml` |
| Mode contract | `.skilled/skills/system-skilled-bots/bots-author/SKILL.md` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation contract owns user-visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, and no suffix uses the confirm workflow.
2. Treat the remaining tokens and flags as workflow inputs rather than execution modes.
3. Read `.skilled/commands/bots/assets/bots-author-presentation.txt` and run its setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for user prompts, the setup display and result display.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|--------|
| `:auto` | `.skilled/commands/bots/assets/bots-author-auto.yaml` |
| `:confirm` or omitted mode | `.skilled/commands/bots/assets/bots-author-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the setup display, checkpoint display, success and failure output, and next-step text live only in `.skilled/commands/bots/assets/bots-author-presentation.txt`.

The router must not invent visible wording for those surfaces. It selects the workflow YAML and the execution mode.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`bots-author-auto.yaml` for `:auto`, `bots-author-confirm.yaml` for `:confirm` or an omitted mode) loads the `bots-author` mode contract and runs its workflow step by step.
`:auto` executes autonomously.
`:confirm` runs the same steps and stops once, after the BOT.md draft is written and before the handoff to `/doctor:bots`.
All prompts, displays and result wording come from the presentation contract, not this router.
