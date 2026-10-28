---
title: "DOC-394 -- Doctor CI toggle"
description: "Manual scenario validating that /doctor:ci toggle prints the SKILLED_CI switch plan and approval prompt, changes nothing on a no answer, sets and clears the variable on a yes, and refuses an undocumented variable name."
version: 1.0.1.0
id: doctor-commands-doctor-ci-toggle
expected_workflow_mode: sk-code-ci
expected_leaf_resources: []
---

# DOC-394 -- Doctor CI toggle

## 1. OVERVIEW

This scenario validates `/doctor:ci toggle`, the route that turns one switch variable the repository CI profile lists off, or back on (here the six `SKILLED_CI*` variables), in the repository's Actions variables. The route prints a plan with the exact `gh variable` command and changes the variable only after the operator answers yes.

The scenario checks the plan and the approval prompt, the no answer that changes nothing, the refusal of a variable that is not a switch of the profile, and, where `gh` is authenticated, the round trip: a yes with `--state=off` sets the variable, the report shows it, and a yes with `--state=on` deletes it. A variable change reaches the whole repository and is not recorded in git, so the round trip restores the starting state before the scenario ends.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:ci toggle` prints the plan and approval prompt, treats a no answer as a cancellation that changes nothing, refuses a variable that is not a switch of the profile, and, with `gh` authenticated, sets then clears `SKILLED_CI_REPORTS` and shows the state in a report run without `--no-gh`.
- Playbook ID: DOC-394.
- Real user request: `Turn the SKILLED_CI_REPORTS CI switch off for now, show me the command first, then turn it back on.`
- Prompt: `Turn the SKILLED_CI_REPORTS CI switch off for now, show me the command first, then turn it back on.`
- Preconditions: The shared current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`. The refusal and no-answer steps need no GitHub login. The yes round trip needs `gh auth status` to succeed with rights to edit the repository's Actions variables, and `SKILLED_CI_REPORTS` must start unset. Record `SKIP` for the round trip when `gh` is not authenticated or the variable starts set.
- Expected execution process: Run the route with `--state=off` and answer no, run it with a name that is not a switch, then, where `gh` is authenticated, run the off and on changes with yes answers and a report run between them, and confirm the tree is unchanged after every step.
- Expected signals: The off run prints `SWITCH CHANGE PLAN` with `Variable: SKILLED_CI_REPORTS`, `Change: off`, `Command: gh variable set SKILLED_CI_REPORTS --body off` and `Run this command? [yes/no]`, and the plan names the workflows the variable covers, lists the protected workflow it switches off, the trigger index rebuild, with the role the profile records for it, and asks for a second confirmation that accepts only the variable name. The no answer ends with `STATUS=CANCELLED ACTION=cancelled` and `Changed: none`. The bad name prints `REFUSE: SKILLED_CI_BOGUS is not a documented switch` and `STATUS=FAIL ERROR="refused"` without a plan. After a yes, `gh variable list` shows the variable set to off and the report shows the switch as off. After the `--state=on` yes, the command is `gh variable delete SKILLED_CI_REPORTS`, the variable is absent from the list and the report no longer shows it off.
- Desired user-visible outcome: The operator sees the exact command and what it affects before anything changes, a no or a refusal leaves the repository variables as they were, and the variable ends the scenario in its starting state.
- Pass/fail: PASS if the plan and prompt print, the no answer changes nothing, the undocumented name is refused without a plan, and (when `gh` is authenticated) the yes round trip sets then clears the variable with the report agreeing at each point and the variable unset at the end. Record `SKIP` for the round trip alone when `gh` is unauthenticated.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Turn the SKILLED_CI_REPORTS CI switch off for now, show me the command first, then turn it back on.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Run `gh auth status` and, if it succeeds, run `gh variable list` and confirm `SKILLED_CI_REPORTS` is not listed. Run every step below inside the environment.
2. Run `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off` in the AI runtime, read the plan and answer `no`. Capture the output.
3. Run `/doctor:ci toggle --variable=SKILLED_CI_BOGUS --state=off` and capture the output.
4. Confirm `git status --porcelain` prints nothing and, where `gh` is authenticated, that `gh variable list` still does not list `SKILLED_CI_REPORTS`.
5. Only where `gh` is authenticated: run `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=off` again, answer `yes`, then type `SKILLED_CI_REPORTS` at the second confirmation. Capture the output, then run `gh variable list` and capture it.
6. Only where `gh` is authenticated: run `/doctor:ci report` without `--no-gh` and capture the row for the `SKILLED_CI_REPORTS` switch.
7. Only where `gh` is authenticated: run `/doctor:ci toggle --variable=SKILLED_CI_REPORTS --state=on`, read the plan and answer `yes`. Capture the output, then run `gh variable list` and `/doctor:ci report` and capture both.
8. Confirm `git status --porcelain` prints nothing and, where `gh` is authenticated, that `SKILLED_CI_REPORTS` is not in `gh variable list`. If a failed step left it set, run `gh variable delete SKILLED_CI_REPORTS`.

### Expected

Step 2 prints the plan with `Variable: SKILLED_CI_REPORTS`, `Change: off`, the command `gh variable set SKILLED_CI_REPORTS --body off`, the covered workflows, the note that the change applies to runs that start afterwards and is not recorded in git, the `Protected workflows this switches off` list naming the trigger index rebuild with its role, and the second confirmation line. The `--state=on` plan has no protected list and asks for no second confirmation. After the answer no it prints `DOCTOR TARGET CANCELLED`, `Changed: none` and `STATUS=CANCELLED ACTION=cancelled`. Offline, the `Now:` line reads `unknown` and `not readable`.

Step 3 prints `REFUSE: SKILLED_CI_BOGUS is not a documented switch` and `STATUS=FAIL ERROR="refused"` and shows no plan.

Step 4 prints nothing from `git status --porcelain`, and the variable is still unlisted.

Step 5 ends with `DOCTOR MUTATING RESULT`, an approved change of `gh variable set SKILLED_CI_REPORTS --body off`, a verification that reads the variable back as off, the undo `gh variable delete SKILLED_CI_REPORTS` and `STATUS=OK`. The list shows `SKILLED_CI_REPORTS` and the report output never prints its value.

Step 6 shows the switch state for the workflows in the reports group as `off` or `partial`, not `unknown`.

Step 7 prints the plan with `Change: on` and the command `gh variable delete SKILLED_CI_REPORTS`, then ends with `STATUS=OK` and a verification that the variable is absent. The report afterwards no longer shows the reports group as off.

Step 8 prints nothing from `git status --porcelain`, and the variable is unset.

### Evidence

- The step 2 and step 3 output and the answer given at step 2.
- The `git status --porcelain` output after step 4 and step 8.
- Where `gh` is authenticated: the step 5 and step 7 output, the `gh variable list` output after each, the step 6 report row and the final `gh variable list`.
- For a `SKIP`, the `gh auth status` output that shows the missing login.

### Pass / Fail

- **Pass**: The plan and prompt print, the no answer ends in `STATUS=CANCELLED ACTION=cancelled`, the undocumented name is refused without a plan, no step changes a file, and, with `gh` authenticated, the variable is set by the first yes, reported as off, deleted by the second yes and unset at the end.
- **Fail**: A no answer changes the variable, an undocumented name produces a plan, the command run differs from the one printed, a value is printed, the report disagrees with `gh variable list`, the variable is still set at the end, or `git status --porcelain` prints anything.

### Failure Triage

If the no answer changed the variable, read `phase_3_refuse_or_plan` in the matching YAML asset for the rule that any answer other than yes counts as no. If the report shows `unknown` after a yes, run `gh auth status`, since an unreadable `gh` makes every switch read `unknown`. If the verification disagrees with `gh variable list`, do not retry the route; run `gh variable delete SKILLED_CI_REPORTS` to restore the starting state, then compare the switch table in `.github/workflows/README.md` with the report.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/ci.md](../../../../commands/doctor/ci.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-ci-toggle.yaml](../../../../commands/doctor/assets/doctor-ci-toggle.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-ci-presentation.txt](../../../../commands/doctor/assets/doctor-ci-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Report script: [.skilled/commands/doctor/scripts/ci-report.cjs](../../../../commands/doctor/scripts/ci-report.cjs)
- Switch documentation: [.github/workflows/README.md](../../../../../.github/workflows/README.md)
- Category notes: [doctor-commands README](README.md)

Provenance: manual only - /doctor:ci toggle

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-394
- Feature name: Doctor CI toggle
- Command mode: `/doctor:ci toggle`
- YAML asset: `doctor-ci-toggle.yaml`
- Mutation boundary: the route changes at most one repository Actions variable per run, only after a yes. The refusal and no-answer steps change nothing. The yes round trip sets and then deletes `SKILLED_CI_REPORTS`, which must start unset and end unset.
- Feature file path: `doctor-commands/doctor-ci-toggle.md`
