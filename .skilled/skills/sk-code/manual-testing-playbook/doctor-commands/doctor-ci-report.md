---
title: "DOC-392 -- Doctor CI report"
description: "Manual scenario validating that /doctor:ci report lists every GitHub Actions workflow file, returns an empty error list on a clean tree, reads every switch variable as unknown offline, rejects a bad argument with exit 2 and writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-ci-report
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-392 -- Doctor CI report

## 1. OVERVIEW

This scenario validates `/doctor:ci report`, the read-only route that lists every GitHub Actions workflow under `.github/workflows/` with its switch state, trigger events, path filters, purpose and drift flags. The route runs `ci-report.cjs` once and renders the result through the presentation contract.

The scenario checks the script's JSON contract, the workflow count against the files on disk, the offline mode that makes no GitHub call and the exit code for a bad argument. A report that leaves an error in the `errors` list, or that counts a different number of workflows than the tree holds, fails the scenario.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:ci report` returns one entry per workflow file, leaves the `errors` list empty on a clean tree, reads every switch variable as unknown when run with `--no-gh`, rejects a bad argument with exit 2 and writes nothing.
- Playbook ID: DOC-392.
- Real user request: `Run the doctor CI report and tell me which GitHub Actions workflows have a switch off.`
- Prompt: `Run the doctor CI report and tell me which GitHub Actions workflows have a switch off.`
- Preconditions: The shared current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, so the workflow files are the ones that ship. No GitHub login is needed, because every run uses `--no-gh`.
- Expected execution process: Count the workflow files, run the report script with `--no-gh --json`, run it with a bad argument, run the route with `--no-gh`, and confirm the tree is unchanged after every step.
- Expected signals: The JSON run exits 0 and carries the keys `repoRoot`, `workflowCount`, `variables`, `newestNonRebuildSha`, `newestNonRebuildReason`, `notChecked`, `errors` and `workflows`. `workflowCount` equals the file count, `workflows` holds one entry per file and `errors` is empty. All six names under `variables` read `unknown`, `newestNonRebuildSha` is `null` and `newestNonRebuildReason` reads `gh disabled by --no-gh`. The bad-argument run prints `ERROR: unknown argument: --bogus` with the usage line and exits 2.
- Desired user-visible outcome: A workflow table through the presentation contract, a workflow count that matches the tree, and a named switch state for each workflow. Offline, the switch states that need GitHub are reported as unknown rather than guessed.
- Pass/fail: PASS if the JSON run exits 0 with an empty `errors` list and a `workflowCount` equal to the file count, the six variables read `unknown` offline, the bad argument exits 2 with the usage line, the route reports the same count and no step writes a file.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the doctor CI report and tell me which GitHub Actions workflows have a switch off.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Run every step below inside the environment.
2. Count the workflow files with `find .github/workflows -maxdepth 1 -name '*.yml' | wc -l` and keep the number. The report script reads only `*.yml` files, so this count is the one its `workflowCount` must equal.
3. Run `node .skilled/commands/doctor/scripts/ci-report.cjs --no-gh --json` and capture the JSON, the stderr and the exit code.
4. Run `node .skilled/commands/doctor/scripts/ci-report.cjs --bogus` and capture the stderr and the exit code.
5. Run `/doctor:ci report --no-gh` in the AI runtime and capture the route output.
6. Confirm `git status --porcelain` prints nothing after every step.

### Expected

Step 3 exits 0. Its JSON carries `repoRoot`, `workflowCount`, `variables`, `newestNonRebuildSha`, `newestNonRebuildReason`, `notChecked`, `errors` and `workflows`. `workflowCount` equals the count from step 2, `workflows` holds one entry per workflow file and `errors` is an empty list. Offline, the six names under `variables` read `unknown`, `newestNonRebuildSha` is `null` and `newestNonRebuildReason` reads `gh disabled by --no-gh`.

Step 4 exits 2 and prints `ERROR: unknown argument: --bogus`, followed by the usage line `Usage: node .skilled/commands/doctor/scripts/ci-report.cjs [--json] [--sha=<40 hex>] [--no-gh]`.

Step 5 reports the same workflow count as step 3 and renders the workflows through the presentation contract. The route writes nothing, and step 6 confirms it.

### Evidence

- The step 2 count.
- The step 3 JSON, its stderr and its exit code.
- The step 4 stderr and exit code.
- The step 5 route output.
- The `git status --porcelain` output after every step.

### Pass / Fail

- **Pass**: The step 3 run exits 0 with an empty `errors` list and a `workflowCount` equal to the step 2 count, the six variables read `unknown` offline, step 4 exits 2 with the usage line, step 5 reports the same count and no step writes a file.
- **Fail**: A workflow fails to parse and the run exits 1, `errors` is not empty, the count differs from the file count, a variable reads any state other than `unknown` offline, the bad argument exits with any other code, or any step writes a file.

### Failure Triage

If `errors` is not empty, the named workflow failed to parse. Fix that file, then rerun step 3. If the count differs from the file count, compare the `workflows` file names with the directory listing. If the route output differs from the script output, read the route's presentation contract before changing the script.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/ci.md](../../../../commands/doctor/ci.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-ci-report.yaml](../../../../commands/doctor/assets/doctor-ci-report.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-ci-presentation.txt](../../../../commands/doctor/assets/doctor-ci-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Report script: [.skilled/commands/doctor/scripts/ci-report.cjs](../../../../commands/doctor/scripts/ci-report.cjs)
- Script tests: [.skilled/commands/doctor/scripts/tests/ci-report.test.cjs](../../../../commands/doctor/scripts/tests/ci-report.test.cjs)
- Category notes: [doctor-commands README](README.md)

Provenance: manual only - /doctor:ci report

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-392
- Feature name: Doctor CI report
- Command mode: `/doctor:ci report`
- YAML asset: `doctor-ci-report.yaml`
- Mutation boundary: none. The route is read-only, and `--no-gh` keeps every GitHub call out of the run.
- Feature file path: `doctor-commands/doctor-ci-report.md`
