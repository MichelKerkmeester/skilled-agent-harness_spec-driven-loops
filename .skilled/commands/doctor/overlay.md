---
description: "Check whether a vendored Skilled tree still carries its overlays, and put them back after one yes."
argument-hint: "[status|apply] [--json] [--root <dir>] [--capture <path>] | list | ?"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-skilled-doctor -->

# /doctor:overlay Router

This command is a thin router. It binds the read-only `status` target or the writing `apply` target from `_routes.yaml`, then loads that target's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command. Do not copy an overlay byte or touch the overlay lock by hand. The overlay engine owns every classification and every write.

Load the presentation contract before showing anything the operator reads. That contract owns every visible line, from the menu to the closing status.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` |
| Overlay engine | `.skilled/commands/doctor/scripts/overlay-engine.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest, and this command owns the routes whose `command` is `/doctor:overlay`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `status`, the route marked `default_target` because it only reads, so `/doctor:overlay` and `/doctor:overlay status` both run it. A bare `/doctor:overlay` never reaches `apply`, which writes. A menu word from the argument table shows the presentation contract's startup menu instead of binding a target.
- `--json` and `--root <dir>` belong to `status`. `--root <dir>` and `--capture <path>` belong to `apply`.
- The engine has no plan mode, so `apply` shows the engine's own `status` report as its plan. The workflow never runs `apply` before the operator has read that report, and never runs a writing target without its yes.
- `--capture <path>` is part of `apply`: it moves one live edit into its overlay source, and it is asked the same way.
- An argument failure stops the run before YAML load, with the presentation contract's wording for each case:
  - an unknown target or an unknown flag
  - a flag another target owns
  - a value flag without its value
  - a second positional
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior. The presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `status` | `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` |
| `apply` | `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` |

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--json` | `status` | Print the engine's JSON report and nothing else |
| `--root <dir>` | `status`, `apply` | Read or write that vendored tree instead of the one this command ships in |
| `--capture <path>` | `apply` | Move the live edit at that path into its overlay source, instead of applying every overlay |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

1. Read `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:overlay` routes.
3. If the bound target is unknown, render the presentation contract's unknown-target failure and stop.
4. Resolve the route's fields from `_routes.yaml`. Reject a flag outside its `allowed_flags`, including a flag another target owns.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`, never inline in this router:

- The argument failure wording and the startup menu.
- The status report and the plan each writing target shows.
- The question each writing target asks.
- The result templates and next-step text.

---

## 6. WORKFLOW SUMMARY

1. Bind the target from the first positional token, `status` when there is none, then resolve its route from `_routes.yaml`.
2. `status` runs `overlay-engine.cjs status` once, adding `--root <dir>` and `--json` only when the operator passed them. It prints one line per destination that is not in sync, then the state counts and the full check, and it writes nothing.
3. `apply` first runs `overlay-engine.cjs status` with the same `--root`, and that report is the plan. A tree already in sync ends the run as unchanged, and nothing is asked.
4. A live edit or a conflict state stops the run before the question, because the engine would refuse to apply. The run names the engine's own fix for each such line and writes nothing.
5. `apply` asks the apply question once, against the report the operator has just read. Any answer other than yes is a no, so the run ends as cancelled and nothing is written.
6. After the yes, `apply` runs `overlay-engine.cjs apply` with the same `--root`. The engine takes its own lock and classifies every destination again. When a conflict appeared since the report it refuses rather than writes. Otherwise it writes the overlays, then runs the manifest's regenerate and verify steps.
7. With `--capture <path>`, the plan is the one report line for that path. The run asks the capture question only when that line is `live-edited`, and only after its yes runs `overlay-engine.cjs apply --capture <path>`.
8. Either write is re-read through `overlay-engine.cjs status`, and that verdict is shown beside the engine's own result lines.
9. Render the result through the presentation contract, name the next command for the operator, and end with the result template's status line. The route stages nothing and commits nothing, so whoever ran it commits the change themselves.
