---
description: Check a repository's bots/ folder with the bot definition checker, read-only, naming each failed invariant. :auto/:confirm.
argument-hint: "[--root <dir>] [--strict] [:auto|:confirm]"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: system-skilled-bots -->

# /doctor:bots Router

This command is a thin router. It runs the bot definition checker once over a repository's `bots/` folder, then loads its workflow YAML and the presentation contract.

## 0. OPTIONAL INPUT

`/doctor:bots` takes no positional target. `--root <dir>` names the repository whose `bots/` folder is checked, and the current working directory is used without it. `--strict` turns advisory findings into failures.

---

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command. Do not edit a `BOT.md`: this route only reads, and the `bots-author` mode of `system-skilled-bots` owns every edit.

Load the presentation contract before showing the setup display, the check report, a result summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-bots-presentation.txt` |
| Auto workflow | `.skilled/commands/doctor/assets/doctor-bots-auto.yaml` |
| Confirm workflow | `.skilled/commands/doctor/assets/doctor-bots-confirm.yaml` |
| Definition checker | `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` |

---

## 3. MODE ROUTING

- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation text owns visible wording and layout.

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, and no suffix uses the confirm workflow.
2. Parse `--root` and `--strict`, and reject any other argument before the YAML loads, with the argument failure wording from the presentation contract.
3. Read `.skilled/commands/doctor/assets/doctor-bots-presentation.txt` and run its setup resolution.
4. Load the workflow YAML bound to the resolved mode from the EXECUTION TARGETS table below.
5. Execute the selected YAML step by step.
6. Use the presentation contract, not this router, for prompts, the check report and result display.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `bots-check` | `.skilled/commands/doctor/assets/doctor-bots-auto.yaml` |

The `:confirm` workflow, `.skilled/commands/doctor/assets/doctor-bots-confirm.yaml`, runs the same `bots-check` route with one checkpoint. Section 3 names when it is chosen.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the setup dashboard, the check report, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-bots-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML runs `bot-check.cjs` once on the repository, shows every finding line as printed with its invariant id, and maps the exit status to a result: 0 passes, 1 names the failed invariants, 2 means the audit could not finish.
`:auto` executes autonomously.
`:confirm` stops once, before the checker runs.
The route writes nothing.
