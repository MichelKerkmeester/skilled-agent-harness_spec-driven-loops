---
description: "List GitHub Actions workflows with their switch state, scaffold a new workflow, or toggle one CI switch."
argument-hint: "[report|scaffold|toggle] [flags] | list | ?"
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
| Scaffold renderer and toggle planner | `.skilled/commands/doctor/scripts/ci-scaffold.cjs`, `.skilled/commands/doctor/scripts/ci-toggle.cjs` |
| Repository CI profile | `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`, read by `.skilled/commands/doctor/scripts/lib/ci-profile.cjs`. A profile whose `repository` field names another repository is ignored, one left at `.sk-code/ci.json` is refused, and with no profile the generic default forces no convention |

---

## 3. MODE ROUTING

- `_routes.yaml` is the canonical routing and mutation-class manifest; this command owns the routes whose `command` is `/doctor:ci`.
- `execution_mode` is always `INTERACTIVE`. No `:auto` or `:confirm` suffix is supported.
- The first positional token of `$ARGUMENTS` is the target. With no token the target is `report`, which is read-only. `list`, `?` and `menu` show the presentation contract's startup menu instead of binding a target.
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

| Argument | Applies to | Effect |
|----------|------------|--------|
| `--json` | `report` | Print the script's JSON and nothing else |
| `--sha=<sha>` | `report` | Skip the commit search and report that 40-hex commit |
| `--no-gh` | `report` | Make no gh call, so every switch reads unknown |
| `--dry-run` | `scaffold` | Print the plan and the whole file, then stop before writing |
| `--name=<file>` | `scaffold` | Name the new workflow file, a bare hyphen-case name ending in `.yml` |
| `--variable=<name>` | `toggle` | Name one switch variable from the repository CI profile (here one of the six `SKILLED_CI*` names) |
| `--state=<on\|off>` | `toggle` | `off` sets the variable to off and `on` deletes it |
| `--profile=<path>` | `report`, `scaffold`, `toggle` | Read the CI profile from this file instead of `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` or git config `skcode.ciProfile` |
| `list`, `?`, `menu` | the command | Show the startup menu and the route manifest, and load no workflow |

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

1. `report` runs the read-only report once: every workflow with its switch state, triggers, path filters, purpose and drift flags, and the newest commit on the default branch that is not a trigger-index rebuild. It writes nothing.
2. `scaffold` creates one new file under `.github/workflows/` from the workflow standards templates, rendered with the repository CI profile. It refuses a path that already exists and refuses a protected workflow name, prints the whole file, and writes it only after a yes. It never edits an existing workflow and never stages or commits.
3. `toggle` turns one switch variable from the repository CI profile off, or back on, in the repository's Actions variables.
   It prints the exact `gh variable` command and the current state.
   It refuses a variable that skips a job whose status context the live branch ruleset requires, a variable in the profile's `neverOff` list and one the profile's workflows README says must stay unset, because a skipped job reports Success.
   Here that keeps `SKILLED_CI_MESSAGES` and `SKILLED_CI` unset for `message-contract.yml`.
   It refuses a change to the state the variable already has, and asks a second named confirmation before a change that switches off a protected workflow.
   It runs the command only after a yes, and reads the state back.
4. Render the result and next step from the presentation contract.
