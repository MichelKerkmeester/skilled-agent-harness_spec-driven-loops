---
title: "Feature Specification: CI repository profile for sk-code-ci and doctor ci"
description: "The /doctor:ci report, toggle and scaffold hard-code this repository's switch names, branch, twins, README and setup action, so another repository is flagged everywhere, and here the toggle switches off three protected guards after one yes. A per-repository CI profile fixes both."
trigger_phrases:
  - "ci repo profile"
  - "ci repository profile for sk code ci"
  - "sk-code ci.json profile"
  - "doctor ci toggle second confirmation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: CI repository profile for sk-code-ci and doctor ci

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/241-ci-repo-profile` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`ci-report.cjs` reads switches only through the `SKILLED_CI` name pattern, lists runs on `main`, exempts `dependabot-auto-merge.yml` by name, skips commits by the `Trigger-Index-Rebuild: ci` trailer and flags `switch-missing` and `readme-row-missing` in every repository, so a repository with `ACME_CI` switches gets a wrong switch state and a flag on every workflow. The toggle accepts only the six `SKILLED_CI*` names, and the scaffold templates force `main`, `skilled/**`, `SKILLED_CI`, the `.opencode/` twin, README rows and `./.github/actions/setup`. In this repository the toggle lists `protected-set.md` as an input but never reads it, so `SKILLED_CI_FRESHNESS=off` stops `gate-inputs.yml`, `naming-standard-guard.yml` and `dispatch-enforcement-guard.yml` after one plain yes, against `sk-code-ci/SKILL.md:91`.

### Purpose
The CI report, toggle and scaffold read each repository's conventions from a CI profile, a repository without one gets a default that forces nothing, and this repository commits a profile that keeps every Skilled protection and adds the second named confirmation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/ci-report.cjs   (main at 48f6a5392d)
variables: none
STATUS=OK workflows=32 on=32 off=0 partial=0 missing=0 unknown=0

# The new report and toggle suites run against the HEAD scripts in a scratch copy:
$ node --test ci-report ci-profile ci-toggle ci-scaffold doctor-ci-contract tests
ℹ tests 60
ℹ pass 32
ℹ fail 28
✖ a foreign repository with no profile reads its own switch state and raises no flag
✖ here SKILLED_CI_FRESHNESS off asks for a second named confirmation for the guards it skips
✖ the variable behind the status check the live ruleset requires is refused, and so is the switch above it

$ gh api 'repos/{owner}/{repo}/rules/branches/main'   (the required_status_checks rule)
"required_status_checks":[{"context":"Commit messages, branch names and PR description follow the templates","integration_id":15368}]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the profile loader `lib/ci-profile.cjs`: `--profile`, then `git config skcode.ciProfile`, then `.sk-code/ci.json`, then a generic default, with strict unknown-key rejection and `schemaVersion: 1`, plus a template beside the quality config template.
- Make `ci-report.cjs` read switches by shape, take the branch, the required switch, the exemptions, the README and the trailer from the profile, and add a top-level `profile` field.
- Commit this repository's profile `.sk-code/ci.json` with today's values and a contract test that fails when it goes missing or loses a protected entry.
- Render the scaffold templates from profile slots with `ci-scaffold.cjs`, printing today's files byte for byte here.
- Plan the toggle with `ci-toggle.cjs`: allowlist from the profile or the workflows, refusals from the live ruleset, `neverOff` and the README sentence, a no-op refusal and the second named confirmation for a protected workflow, and update the toggle rows in `command-contract.json` and the root `README.md`.
- Rewrite the three sk-code-ci references as universal guidance with labelled Skilled examples, and turn `protected-set.md` into the repository CI profile doc with a labelled Skilled section.

### Out of Scope
- The count claim at `job-shape-rules.md:79` - the drift-flag lane owns it.
- Any edit under `.github/workflows/` or `.github/scripts/` - forbidden for this lane.
- The manual-testing playbooks, feature catalogs and the sk-code-ci README - the docs-alignment lane owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Create | Profile discovery, validation and normalization |
| `.skilled/commands/doctor/scripts/ci-report.cjs` | Modify | Switch shape, profile-driven checks, `profile` field, exports for the toggle |
| `.skilled/commands/doctor/scripts/ci-toggle.cjs` | Create | Toggle planner with every refusal in code |
| `.skilled/commands/doctor/scripts/ci-scaffold.cjs` | Create | Template renderer and `--protected` list |
| `.skilled/commands/doctor/scripts/tests/ci-profile.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs` | Create | New suites |
| `.skilled/commands/doctor/scripts/tests/ci-report.test.cjs`, `doctor-ci-contract.test.cjs` | Modify | Profile cases and the profile contract |
| `.sk-code/ci.json` | Create | This repository's Skilled profile |
| `.skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json` | Create | Profile template |
| `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`, `job-block-template.yml` | Modify | Profile slots |
| `.skilled/commands/doctor/assets/doctor-ci-*.yaml`, `doctor-ci-presentation.txt`, `ci.md`, `_routes.yaml` | Modify | Routes read the profile and run the scripts |
| `.skilled/skills/sk-code/sk-code-ci/references/*.md` (four files) | Modify | Universal guidance, labelled Skilled examples |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `README.md` | Modify | Toggle rows |
| `.skilled/commands/doctor/scripts/README.markdown`, `tests/README.markdown` | Modify | Script and suite rows |
| sk-code-ci and sk-create-command `changelog/`, `SKILL.md`, `.hermes/` copies | Create, Modify | Changelog entries, version carriers, Hermes sync |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `ci-report.cjs --json` on this repository equals the HEAD script's output apart from the added `profile` key, both live and with `--no-gh`. |
| REQ-002 | A foreign fixture with `ACME_CI` switches, three workflows and no profile reports its real switch state and no drift flag. |
| REQ-003 | The toggle refuses the variable behind a status context the live ruleset requires, keeps the exact `SKILLED_CI_MESSAGES` and `SKILLED_CI` refusal strings here and accepts `ACME_CI_TESTS` in the foreign fixture. |
| REQ-004 | Here, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_REPORTS` off plan a second named confirmation listing the protected workflows they stop, with gh mocked and no write call. |
| REQ-005 | A missing named profile and an unknown key exit 3 and name the cause. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The scaffold renderer prints today's two template files byte for byte here and no Skilled name in a foreign repository. |
| REQ-007 | The toggle refuses a no-op change, refuses from `neverOff` when the ruleset is unreadable and from a README `must stay unset` sentence. |
| REQ-008 | A contract test fails when `.sk-code/ci.json` goes missing or loses a protected entry. |
| REQ-009 | The three universal references carry `SKILLED_CI`, `.opencode` and `skilled/**` only on lines labelled Skilled example, and `protected-set.md` documents the profile with a labelled Skilled section. |
| REQ-010 | `ci-report.test.cjs` plus `doctor-ci-contract.test.cjs` keep their 26 cases green, the doctor `run-all.sh` passes, gate-inputs prints `RESULT: PASSED` and the trigger-index workflow vitest passes. |
| REQ-011 | sk-code-ci and sk-create-command each get a changelog entry with 0 validator issues, a stepped `SKILL.md` version and a Hermes copy in sync. |
| REQ-012 | A toggle plan to switch a variable off when the branch ruleset cannot be read prints `Required checks: not read (<reason>); the ruleset refusal was not applied`, and the presentation contract and the toggle workflow show it before the approval prompt. |
| REQ-013 | `/doctor:ci report`, `scaffold` and `toggle` each accept `--profile=<path>`, the router documents it and each workflow passes it to its script. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 60 cases across the five CI suites pass, and 28 of them fail against the HEAD scripts.
- **SC-002**: `ci-toggle.cjs --variable=SKILLED_CI_FRESHNESS --state=off` here prints `Second confirmation: Type SKILLED_CI_FRESHNESS to confirm a second time`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `gh api repos/{owner}/{repo}/rules/branches/<branch>` | Without it the ruleset refusal cannot be read | `neverOff` always applies and the README sentence is a third source, so this repository keeps both refusals offline |
| Risk | Deleting `.sk-code/ci.json` would apply the generic default here | High | Two contract tests pin the file and every protected entry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The report adds one file read for the profile and, with no `defaultBranch`, one `gh repo view` call.

### Security
- **NFR-S01**: Every gh call goes through `spawnSync` with an argument array, the planner never writes a variable and a value is never printed.
- **NFR-S02**: A git config value set by a `-c` flag is ignored, so one invocation cannot swap the committed profile.

### Reliability
- **NFR-R01**: A named profile path that does not exist is an error, never a fall back to the default.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no profile gives the generic default, which requires no switch, checks no README and protects nothing.
- Maximum input: a ruleset with several required contexts refuses every variable behind any of them and words the master refusal as "a check the ruleset requires".
- Failure path: a missing named profile or an unknown key exits 3 with the field named, and a workflow that does not parse makes the toggle exit 3.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Four scripts, five suites, two templates, four references, five route assets |
| Risk | 12/25 | The toggle guards repository variables and the required check |
| Research | 6/20 | Live ruleset shape and the template wrap widths |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
