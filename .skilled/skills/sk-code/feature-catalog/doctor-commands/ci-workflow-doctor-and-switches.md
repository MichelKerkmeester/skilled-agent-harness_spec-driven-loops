---
title: "CI Workflow Doctor And Switches"
description: "/doctor:ci reports every GitHub Actions workflow with its switch state, scaffolds a new workflow from the standards templates and toggles one CI switch after approval, all read against the repository's own CI profile."
trigger_phrases:
  - "ci workflow doctor and switches"
  - "/doctor:ci"
  - "ci switch"
  - "turn off the ci"
version: 1.0.1.0
---

# CI Workflow Doctor And Switches (/doctor:ci)

## 1. OVERVIEW

/doctor:ci reports every GitHub Actions workflow with its switch state, scaffolds a new workflow from the standards templates and toggles one CI switch after approval, all read against the repository's own CI profile.

The command is a thin router over three targets. `report` is the default and writes nothing. `scaffold` and `toggle` change the tree or a repository variable only after the workflow prints its plan and the operator answers yes, and any other answer changes nothing.

---

## 2. HOW IT WORKS

### The CI Profile

Branch names, switch variables, protected workflows, path twins, the workflows README and the setup action differ from one repository to the next, so the three scripts read them from a profile. The lookup order is `--profile=<path>`, the file-scoped git config value `skcode.ciProfile`, `.sk-code/ci.json`, then a generic default that forces nothing: it requires no switch, checks no README row, assumes no branch and protects no workflow. An unknown key in a profile is an error. This repository commits its profile, so its report, templates and switches are unchanged, and another repository with its own `ACME_CI` switches reads clean without one.

### Report

`report` lists every workflow with its switch state, triggers, path filters, purpose and drift flags, and the newest commit on main that is not a trigger-index rebuild. The repository variable values come from `gh variable list` and are reduced to a state, so a value is never printed. The report detects a switch by shape, so any variable a job compares against `off` counts, and its JSON names the profile source. `--json` prints the script's JSON alone, `--sha=<sha>` reports a named 40-hex commit and `--no-gh` makes no gh call, so every switch reads unknown.

### Scaffold

`scaffold` creates one new file under `.github/workflows/` from the workflow standards templates. It renders the templates with the profile, so a repository with no profile gets none of this repository's names, refuses a path that exists and a protected workflow name, prints the whole file and writes it only after a yes. It never edits an existing workflow and never stages or commits. `--name=<file>` names the file and `--dry-run` stops before the write.

### Toggle And The Switches

The switches are the repository variables a job's `if:` compares against `off`. Here they are six: the master switch `SKILLED_CI` and the group switches `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`. `toggle` takes `--variable=<name>` and `--state=<on|off>`: `off` sets the variable to off and `on` deletes it. It prints the exact `gh variable` command and the current state, runs it only after a yes and reads the state back. It refuses a variable that skips a job whose status context the live branch ruleset requires, a variable in the profile's `neverOff` list and one its workflows README says must stay unset, because a skipped job reports Success and the requirement would pass with nothing run. Here that keeps `SKILLED_CI_MESSAGES` and `SKILLED_CI` unset. A change to the state a variable already has is refused as a no-op, and a change that stops a protected workflow prints the workflow with its role and asks for the variable name a second time.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/doctor/ci.md` | Handler | The command router, its targets and flags |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Script | The read-only report and the switch detection |
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Script | Profile discovery, validation and the generic default |
| `.skilled/commands/doctor/scripts/ci-toggle.cjs` | Script | The toggle planner and its refusals |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | Script | The template renderer and the protected list |
| `.sk-code/ci.json` | Config | This repository's committed profile |
| `.skilled/commands/doctor/assets/doctor-ci-report.yaml` | Shared | The report workflow |
| `.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml` | Shared | The scaffold workflow and its approval step |
| `.skilled/commands/doctor/assets/doctor-ci-toggle.yaml` | Shared | The toggle workflow and its refusals |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs` | Node test | The report rows, switch states and flags |
| `.skilled/commands/doctor/scripts/tests/doctor-ci-contract.test.cjs` | Node test | The router, route and workflow contract |
| `.skilled/commands/doctor/scripts/tests/ci-profile.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs` | Node test | The profile loader, the toggle refusals and the render, each with a foreign repository |
| `.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/foreign-repository/foreign-repository-profile.md` | Manual playbook | A repository with `ACME_CI` switches reads clean, and the toggle refuses the required-check variable |

---

## 4. SOURCE METADATA

- Group: Doctor Commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/ci-workflow-doctor-and-switches.md`

Related references:
- [sk-code-setup-and-quality-doctor.md](sk-code-setup-and-quality-doctor.md) for the sk-code doctor.
