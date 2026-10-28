---
title: Repository CI Profile and Protected Workflows
description: The repository CI profile the /doctor:ci routes read, the workflows protected by function and the rules that follow, with this repository's Skilled profile as a labelled section.
trigger_phrases:
  - "protected workflow"
  - "protected workflow set"
  - "required status check"
  - "never switch off workflow"
  - "repository ci profile"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# Repository CI Profile and Protected Workflows

Where a repository states its own CI conventions, and which workflows are never weakened, edited or switched off on a light confirmation.

---

## 1. OVERVIEW

### The Profile

Branch names, switch variables, path twins, README tables and the setup action differ from one repository to the next, so no rule in this packet hard-codes them. A repository states them in one file, `.sk-code/ci.json`, and `/doctor:ci report`, `scaffold` and `toggle` read it through `.skilled/commands/doctor/scripts/lib/ci-profile.cjs`.

The lookup order is `--profile <path>`, then the file-scoped git config value `skcode.ciProfile`, then `.sk-code/ci.json` at the repository root, then a generic default. A named path that does not exist is an error and never falls back, because a typo would otherwise drop every protection without a word. An unknown key is an error too.

The generic default forces nothing. It requires no switch, checks no README row, assumes no branch and protects no workflow. A repository without a profile gets the parser checks that hold everywhere and nothing that only this repository needs. To start one, copy `assets/ci-profile.template.json`, which reads as the default, and fill in the keys that differ.

### Profile Keys

| Key | What reads it | Default |
|---|---|---|
| `schemaVersion` | Every reader. It must be `1` | required |
| `defaultBranch` | The report's run list and the toggle's ruleset read. Without it the report asks GitHub, then falls back to `main` | `null` |
| `integrationBranches` | The scaffold's push `branches:` filter | `[]`, no filter |
| `workflowsReadme` | `{ path, rowTables }`. The report reads purposes from the README's `Workflow` and `Responsibility` table and flags a missing row. The scaffold prints one row per table. The toggle reads a `<NAME> must stay unset` sentence | `null`, no README check |
| `switch.master`, `switch.groups` | The switch variables, in the order the report lists them and the toggle accepts them. Without them the toggle accepts the names the workflows compare against `off` | `null`, `[]` |
| `switch.required` | Whether every job must carry a switch. Only then does the report flag `switch-missing` | `false` |
| `switch.exempt` | Workflow files that need no switch even when one is required | `[]` |
| `neverOff` | Variables the toggle never sets to `off`, whether or not the ruleset can be read | `[]` |
| `protected` | `{ file, role }` entries. The scaffold refuses the name and the toggle asks a second named confirmation before it switches one off | `[]` |
| `pathTwins` | `[root, twin]` pairs a path filter must name together | `[]`, no twin rule |
| `rebuildTrailer` | The commit trailer that marks a rebuild commit the report skips | `null`, nothing skipped |
| `setupAction` | `{ uses, with, note }` for the composite setup step the job template adds | `null`, no setup step |
| `timeoutFloorMinutes` | The timeout floor the templates start from | `10` |

---

## 2. PROTECTED BY FUNCTION

A workflow is protected because of what it does, so a new workflow that does the same job joins the set. Three classes qualify.

| Class | Test |
|---|---|
| (a) Sole enforcer | It is the only thing that enforces an invariant, and no local gate backs it up |
| (b) Token-eligibility split | It splits the work that runs repository code from the work that holds a write token |
| (c) Input guard | Its failure invalidates the inputs other workflows trust |

A workflow that holds a status context the branch ruleset requires is protected as well, because switching it off removes the requirement. The profile's `protected` list names the protected workflows with the role of each, and the toggle reads the required contexts from the live ruleset.

---

## 3. THE RULES

1. **Never switch off a job whose status context the branch ruleset requires.** A switched-off job is skipped, and a skipped job reports Success, so the required context stops blocking merges. A workflow-level path filter is the opposite case and leaves the context Pending (`references/trigger-and-filter-rules.md`). `/doctor:ci toggle` refuses such a variable from the live ruleset, from the profile's `neverOff` list and from a `must stay unset` sentence in the workflows README.
2. **A protected workflow is never edited or switched off without a second named confirmation that restates its role.** The first confirmation approves the change. The second names the workflow, says in one sentence what it protects and approves again. `/doctor:ci toggle` asks it whenever a variable would switch off a workflow in the profile's `protected` list, and only the variable name counts as the answer. A scaffold or a review that would weaken a protected workflow stops and asks.

---

## 4. HOW TO USE THE SET

- Before editing a workflow, search the profile's `protected` list for its file name and apply the class tests above.
- When a request reads "switch off", "skip" or "disable" a workflow, check rule 1 first.
- When two protected classes both fit, apply the stricter rule.
- When the list looks wrong for a workflow that was added or renamed, correct the profile and this file's Skilled section, and do not rely on memory.

---

## 5. SKILLED PROFILE

This repository commits its profile as `.sk-code/ci.json`. Everything in this section is the Skilled example, and none of it applies to another repository.

| Class | Workflows |
|---|---|
| (a) Sole enforcer | `gate-inputs.yml` |
| (b) Token-eligibility split | `trigger-index-rebuild.yml` |
| (c) Input guard | `dispatch-enforcement-guard.yml`, `naming-standard-guard.yml` |
| Required check | `message-contract.yml` |

`gate-inputs.yml` is the only enforcer of path parity between the profile's twin roots, `.skilled/` and `.opencode/` (Skilled example). Without it a moved source tree or a one-sided path filter passes unseen.

`trigger-index-rebuild.yml` keeps the job that runs repository code at `contents: read` and gives the write token only to a job that runs `gh` and `git`. Merging the two jobs would hand the token to repository code.

`dispatch-enforcement-guard.yml` and `naming-standard-guard.yml` check the rules that other workflows and tools assume. A failure here means those assumptions no longer hold.

`message-contract.yml` holds the only required status context in the branch ruleset, `Commit messages, branch names and PR description follow the templates`. The workflow also pushes on every branch as a recorded exception. See the intentional exceptions table in `references/trigger-and-filter-rules.md`.

The Skilled example switches are the master `SKILLED_CI` and the groups `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`. `SKILLED_CI` and `SKILLED_CI_MESSAGES` are in `neverOff` (Skilled example) because both skip `message-contract.yml`. `SKILLED_CI_FRESHNESS` reaches `gate-inputs.yml`, `dispatch-enforcement-guard.yml` and `naming-standard-guard.yml`, and `SKILLED_CI_REPORTS` reaches `trigger-index-rebuild.yml` (Skilled example), so the toggle asks the second confirmation for both. `dependabot-auto-merge.yml` is in `switch.exempt`, the rebuild trailer is `Trigger-Index-Rebuild: ci` and the setup action is `./.github/actions/setup`.

A contract test fails when `.sk-code/ci.json` goes missing or loses a protected entry, because without it this repository would read the generic default and a single yes could switch off a guard.
