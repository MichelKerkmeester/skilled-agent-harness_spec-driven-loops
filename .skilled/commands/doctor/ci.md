---
description: "List every GitHub Actions workflow with its switch state, scaffold a compliant new workflow, or turn one documented CI switch on or off."
argument-hint: "[report|scaffold|toggle] [--json] [--sha=<sha>] [--no-gh] [--dry-run] [--name=<file>] [--variable=<name>] [--state=<on|off>]"
allowed-tools: Read, Bash, Grep, Glob, Write
---
<!-- skill_agent: sk-code -->

# /doctor:ci Router

This command is a thin router. It binds one of three CI actions from `_routes.yaml`, then loads that action's workflow YAML and the presentation contract.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing the menu, a table, a plan, an approval prompt, a result summary, or next-step text.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Route manifest | `.skilled/commands/doctor/_routes.yaml` |
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-ci-presentation.txt` |
| Report script | `.skilled/commands/doctor/scripts/ci-report.cjs` |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:ci`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `report`, which is read-only. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
- `report` accepts `--json`, `--sha=<sha>` and `--no-gh`. `scaffold` accepts `--dry-run` and `--name=<file>`. `toggle` accepts `--variable=<name>` and `--state=<on|off>`.
- An unknown target, an unknown flag or a flag that belongs to another target fails before YAML load with the presentation contract's wording.
- `scaffold` and `toggle` change the tree or a repository variable only after the workflow prints its plan and the operator answers yes. A no, or any answer other than yes, changes nothing.
- If any referenced asset is missing, stop and report the missing path.
- The YAML owns workflow behavior; the presentation text owns visible wording and layout.

---

## 4. EXECUTION TARGETS

| Target | Workflow |
|--------|----------|
| `report` | `.skilled/commands/doctor/assets/doctor-ci-report.yaml` |
| `scaffold` | `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` |
| `toggle` | `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` |

1. Read `.skilled/commands/doctor/assets/doctor-ci-presentation.txt`.
2. Read `.skilled/commands/doctor/_routes.yaml` and keep the `/doctor:ci` routes.
3. If the bound target or a flag is not valid, render the presentation contract's argument failure and stop.
4. Resolve `yaml`, `setup_vars`, `allowed_flags`, `mutating` and the script invocations from the route.
5. Load the resolved workflow YAML from `.skilled/commands/doctor/assets/<yaml>` and execute it step by step.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.skilled/commands/doctor/assets/doctor-ci-presentation.txt`:

- The startup menu, accepted answers and the argument failure wording.
- The report summary, the scaffold plan, the toggle plan and their approval prompts.
- Success, cancelled and failure result templates, the troubleshooting table and the next-step suggestions.

---

## 6. WORKFLOW SUMMARY

1. `report` runs the read-only report once: every workflow with its switch state, triggers, path filters, purpose and drift flags, and the newest commit on main that is not a trigger-index rebuild. It writes nothing.
2. `scaffold` creates one new file under `.github/workflows/` from the workflow standards templates. It refuses a path that already exists and refuses a protected workflow name, prints the whole file, and writes it only after a yes. It never edits an existing workflow and never stages or commits.
3. `toggle` turns one of the six documented switch variables off, or back on, in the repository's Actions variables. It prints the exact `gh variable` command and the current state, refuses the message-contract variable and the master switch while the workflows README forbids switching them off, runs the command only after a yes, and reads the state back.
4. Render the result and next step from the presentation contract.
