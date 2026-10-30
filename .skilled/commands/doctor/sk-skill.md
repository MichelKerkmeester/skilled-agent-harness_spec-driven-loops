---
description: "Check how far a skill, or the whole fleet, is from the Skilled format, row by row."
argument-hint: "[check] [<name-or-path>] [--json]"
allowed-tools: Read, Bash
---
<!-- skill_agent: sk-doc -->

# /doctor:sk-skill Router

This command is a thin router. It binds the read-only `check` target from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the menu, a result table, a failure summary or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt` |
| Check engine | `.skilled/commands/doctor/scripts/sk-skill-check.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the route whose `command` is `/doctor:sk-skill`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `check`, which only reads, so `/doctor:sk-skill` and `/doctor:sk-skill check` both run it. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- The next positional token is a skill name or path, and the workflow passes it to the engine unchanged. With no token the engine checks the whole fleet and prints one row per skill root.
- `--json` prints the engine's JSON report and nothing else.
- An unknown target, an unknown flag, or a second skill argument fails before YAML load with the presentation contract's wording.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `check` | `.skilled/commands/doctor/assets/doctor-sk-skill-check.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `<name-or-path>` | `check` | Check one skill instead of the fleet: a name under `.skilled/skills`, or a path to a skill root |
| `--json` | `check` | Print the engine's JSON report and nothing else |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:sk-skill` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and script invocations from the route, and reject a flag outside its `allowed_flags`.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The argument failure wording, the startup menu, the fleet and deep result tables, the JSON passthrough note, result templates and next-step text live only in `.skilled/commands/doctor/assets/doctor-sk-skill-presentation.txt`.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `check` when there is none, then resolve its route from `_routes.yaml`.
2. `check` runs `doctor-sk-skill-check.cjs` once, adding the skill name or path and `--json` only when the operator passed them. The engine reports rows C1 to C13 and writes nothing.
3. Render the fleet table or the deep report through the presentation contract, and name the repair for each finding.
4. Close with the result template's status line and the next command the operator can run.
