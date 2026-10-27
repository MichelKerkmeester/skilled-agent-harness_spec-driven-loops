---
title: "CI Workflow Doctor And Switches"
description: "/doctor:ci reports every GitHub Actions workflow with its switch state, scaffolds a new workflow from the standards templates and toggles one documented CI switch after approval."
trigger_phrases:
  - "ci workflow doctor and switches"
  - "/doctor:ci"
  - "ci switch"
  - "turn off the ci"
version: 1.0.0.0
---

# CI Workflow Doctor And Switches (/doctor:ci)

## 1. OVERVIEW

/doctor:ci reports every GitHub Actions workflow with its switch state, scaffolds a new workflow from the standards templates and toggles one documented CI switch after approval.

The command is a thin router over three targets. `report` is the default and writes nothing. `scaffold` and `toggle` change the tree or a repository variable only after the workflow prints its plan and the operator answers yes, and any other answer changes nothing.

---

## 2. HOW IT WORKS

### Report

`report` lists every workflow with its switch state, triggers, path filters, purpose and drift flags, and the newest commit on main that is not a trigger-index rebuild. The repository variable values come from `gh variable list` and are reduced to a state, so a value is never printed. `--json` prints the script's JSON alone, `--sha=<sha>` reports a named 40-hex commit and `--no-gh` makes no gh call, so every switch reads unknown.

### Scaffold

`scaffold` creates one new file under `.github/workflows/` from the workflow standards templates. It refuses a path that exists and a protected workflow name, prints the whole file and writes it only after a yes. It never edits an existing workflow and never stages or commits. `--name=<file>` names the file and `--dry-run` stops before the write.

### Toggle And The Switches

The switches are six repository variables: the master switch `SKILLED_CI` and the group switches `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`. A job carries a switch when its `if:` names one of them. `toggle` takes `--variable=<name>` and `--state=<on|off>`: `off` sets the variable to off and `on` deletes it. It prints the exact `gh variable` command and the current state, runs it only after a yes and reads the state back. It refuses the message-contract variable and the master switch while the workflows README forbids switching them off, because either one skips the only check the ruleset requires, and a skipped job reports Success.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/ci.md` | Handler | The command router, its targets and flags |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Script | The read-only report and the switch variable list |
| `.skilled/commands/doctor/assets/doctor-ci-report.yaml` | Shared | The report workflow |
| `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` | Shared | The scaffold workflow and its approval step |
| `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` | Shared | The toggle workflow and its refusals |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | Node test | The report rows, switch states and flags |
| `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | Node test | The router, route and workflow contract |

---

## 4. SOURCE METADATA

- Group: Doctor Commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/ci-workflow-doctor-and-switches.md`

Related references:
- [sk-code-setup-and-quality-doctor.md](sk-code-setup-and-quality-doctor.md) for the sk-code doctor.
