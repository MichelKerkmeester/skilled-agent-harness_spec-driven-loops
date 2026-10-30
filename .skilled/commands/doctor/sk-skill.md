---
description: "Check a skill against the Skilled format, or convert one to it, plan first."
argument-hint: "[check|convert] [<name-or-path>] [--json] [--into-hub <hub>] [--dry-run]"
allowed-tools: Read, Bash
---
<!-- skill_agent: sk-doc -->

# /doctor:sk-skill Router

This command is a thin router. It binds the read-only `check` target or the mutating `convert` target from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the menu, a plan, a result table, a failure summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` |
| Check engine | `.skilled/commands/doctor/scripts/sk-skill-check.cjs` |
| Convert engine | `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:sk-skill`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `check`, the route marked `default_target` because it only reads, so `/doctor:sk-skill` and `/doctor:sk-skill check` both run it. A bare `/doctor:sk-skill` never reaches `convert`, which writes. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- The next positional token is a skill name or path, and the workflow passes it to the engine unchanged. For `check` no name checks the whole fleet and prints one row per skill root. For `convert` the name is required: ask for it once, rich enough to resolve to one skill folder, and never infer it from the conversation, an open file or the previous target.
- `--json` belongs to `check` and prints the engine's JSON report and nothing else. `--dry-run` belongs to `convert`: it prints the plan with the field values the engine proposes — or, when the first plan refused with a follow-up message, that message as the pending follow-up — then ends as a dry run without asking a question. `--into-hub <hub>` belongs to `check` too.
- `--into-hub <hub>` prints the hub gap report instead of the format rows: the eleven surfaces a skill or mode must land on under that hub, each with the probe it ran. It reads and never writes, and mode-into-hub conversion stays refused.
- `--into-hub` takes the next token as its value, so the hub is never a second skill argument; `--into-hub=<hub>` names it inline.
- An unknown target, an unknown flag, a flag from the other target, a second skill argument, or `--into-hub` without a hub fails before YAML load with the presentation contract's wording.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `check` | `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` |
| `convert` | `.skilled/commands/doctor/assets/doctor-sk-skill-convert.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `<name-or-path>` | `check` | Check one skill instead of the fleet: a name under `.skilled/skills`, or a path to a skill root |
| `<name-or-path>` | `convert` | Convert that one skill after a printed plan and an explicit yes: an older Skilled skill is rewritten where it sits, and a plain skill is staged as a copy under `.skilled/skills/<name>` with its source folder left as it was |
| `--json` | `check` | Print the engine's JSON report and nothing else |
| `--into-hub <hub>` | `check` | Report the eleven hub integration surfaces for the skill or mode named, or for the hub alone, instead of the format rows |
| `--dry-run` | `convert` | Print the plan and the follow-ups it names, or the first plan's follow-up refusal as the pending follow-up when nothing printed, then end as a dry run, asking nothing and writing nothing |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:sk-skill` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`, including a flag the other target owns.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the startup menu, the fleet and deep result tables, the JSON passthrough note, the conversion plan and follow-up layout, the refusal table, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `check` when there is none, then resolve its route from `_routes.yaml`.
2. `check` runs `sk-skill-check.cjs` once, adding the skill name or path, `--json` and `--into-hub <hub>` only when the operator passed them. The engine reports rows C1 to C13, or the eleven hub gap rows, and writes nothing. A skill inside another repository's `.skilled/skills` is judged against that repository, and each of its rows names the repository it read, so a tool that repository does not ship is named as borrowed from the checker's copy.
3. `convert` runs `sk-skill-convert.cjs plan` once. The plan call writes nothing. A refusal stops the run with its own code and reason; `INTENT_SIGNALS_BELOW_FLOOR` and `DESCRIPTION_TOO_LONG` are not refusals, they are follow-up questions of the next step, and a skill that declares no `allowed-tools` prints the plan's own `allowed-tools: approval required; propose [...]` line, which is the third question.
4. `convert` asks each follow-up with its own yes, in the order the plan raises it: the intent phrases first, which a plain skill needs before any plan can print — at least eight distinct phrases of three or more words each, shown from the engine's own suggestion and editable — then the trimmed description, then the allowed-tools list, which is the one the plan printed and which the operator may edit. A no at any question ends the run as cancelled, names what was declined, and writes nothing.
5. `convert` reruns the plan as `sk-skill-convert.cjs apply <name-or-path> <flags>` with no `--apply`, carrying `--approved-phrase` repeated per approved phrase, `--description-trim`, `--allowed-tools` and, for a plain skill, `--agent-output`: that form prints the plan and writes nothing. For a plain skill it first has the workflow agent reshape the SKILL.md prose into `<scratch>/agent-output.md` under `.skilled/skills/.state/doctor-sk-skill/<name>/scratch/`, and proves the body survived with `sk-skill-convert.cjs preserve --snapshot <scratch>/snapshot <scratch>/staging`; a preservation failure stops the run. The plan it prints is the one the conversion question asks about. With `--dry-run`, the run ended before any question and asked nothing.
6. `convert` asks the conversion question against that plan. A no ends the run as cancelled, naming the declined conversion, and writes nothing.
7. `convert` runs `sk-skill-convert.cjs apply --apply` with the same flags on yes, and re-reads the converted root — `.skilled/skills/<name>` for a plain skill, never the outside source — through `sk-skill-check.cjs`. The workflow never edits a SKILL.md field itself.
8. `convert` prints the undo block the engine printed, exactly as printed, and never composes or runs one of its own. The advisor graph was rebuilt by the run's own scan rather than backed up, so the operator rescans it after an undo.
9. Render the fleet table, the deep report or the conversion result through the presentation contract, and name the repair or the next command for the operator.
10. Close with the result template's status line and the next command the operator can run.
