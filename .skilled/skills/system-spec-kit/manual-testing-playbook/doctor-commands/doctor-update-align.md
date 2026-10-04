---
title: "DOC-358 -- Doctor update align"
description: "Manual scenario validating that /doctor:update align reviews customized, conflict and removed units, records one decision for every presented file inside an ignored run directory, and writes nothing to the checkout."
version: 1.1.0.0
id: doctor-commands-doctor-update-align
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-358 -- Doctor update align

## 1. OVERVIEW

This scenario validates the decision-recording action of `/doctor:update`. Align reviews the units whose status is `customized`, `conflict` or `removed`, shows one consolidated decision batch per unit with complete evidence cards, and records every operator answer through the engine `decide` command in a run directory below the ignored `.skilled/release/runs` root. It never writes a skill file, command file or other checkout path.

The scenario runs the dry-run preview first, which creates no run directory at all, then records a decision for each presented file in a materialized run and confirms that the run directory, `decisions.json` and the state log agree with the recorded answers. A second reviewed unit is deferred to exercise the whole-unit answer. The copy is restored at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove align records one decision for each presented file, keeps every write inside the ignored run directory, and leaves the checkout untouched.
- Playbook ID: DOC-358.
- Real user request: `Review the release changes I customized and record what to do with each file.`
- Prompt: `Review the release changes I customized and record what to do with each file.`
- Preconditions: A disposable copy of the repository with an ignored `.skilled/release/runs` root and at least two units the check reports as `customized`, `conflict` or `removed`, one to decide and one to defer. When fewer exist, edit a release-managed file in another unit that also differs from its recorded base and the selected release, then confirm both unit statuses with the check. A runtime that can execute `/doctor:update` with Bash access.
- Expected execution process: Create the copy, confirm the run root is ignored, record a unit that needs review, run the scoped dry-run align, run the real align, record one answer per presented file through the decide command, capture the state log and the summary, then restore the edited files.
- Expected signals: Phase 1 confirms the current directory is inside a git repository, the engine exists and `git check-ignore` matches the run root. A run root that is not ignored shows the run-root template and stops. With `--dry-run` the engine returns `dryRun` true, creates no run directory, evidence, proposals or decisions, and offers no apply handoff, and the run ends `STATUS=DRY_RUN`. The real run executes `node .skilled/commands/doctor/scripts/release-update.cjs align --repo . --json [--release <tag>] [--scope <value>] [--remote <value>] [--offline] [--dry-run] [--include-prerelease]` and returns a `runDir` that is canonical, new, non-symlinked and gitignored, together with `units`, `files`, `evidenceFiles`, `proposalFiles`, `release`, `releaseCommit`, `head`, `upstream`, `checkout` and `status`. Only `customized`, `conflict` and `removed` units get a batch. Each batch shows one complete evidence card per non-same file with its path, class, conflict type, base, local and release blob and mode, rename, merge summary, changelog rationale, recommended decision and accepted answers, and offers `adopt-release`, `keep-local`, `merge`, `use-proposal` and `defer`. Every file answer is recorded with `node .skilled/commands/doctor/scripts/release-update.cjs decide --repo . --run <runDir> --path <planned-file-path> --decision <accepted-answer> --json`, including an answer that matches the engine suggestion, and a whole-unit defer is recorded with the same command using `--unit <unit-key> --defer`. The state log `<runDir>/.doctor-update.last-run.json` carries `decisions_recorded`, `deferred_units`, `run_dir`, `release` and a `final_status` of `aligned`, `deferred`, `dry_run` or `failed`. The summary shows `Alignment decisions recorded` with the decision count, every deferred unit and every unresolved file, and offers `/doctor:update apply --decisions=<runDir>/decisions.json` only when no file is unresolved. Terminal statuses are `STATUS=ALIGNED`, `STATUS=DEFERRED`, `STATUS=DRY_RUN` and `STATUS=FAILED`. No skill file, command file, prompt, runtime mirror or other checkout file changes, and `git status --porcelain` matches the baseline.
- Desired user-visible outcome: One reviewed batch per unit with complete evidence, one recorded decision per presented file, a run directory that holds the whole record, and an unchanged checkout.
- Pass/fail: PASS if the dry run writes nothing, the real run records one decision for every presented file, `decisions.json` and the state log agree with the answers, a deferred unit stays unapplied, and no checkout file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Review the release changes I customized and record what to do with each file.
```

### Commands

1. Create a disposable copy of the repository.
2. Confirm the run root is ignored: `git check-ignore .skilled/release/runs` prints the run root. When it prints nothing, add the ignore lines the presentation's run-root template names and commit them before continuing.
3. Prepare two review units. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --json --release <tag>` and pick two units whose status is `customized`, `conflict` or `removed`. Record both `kind:name` keys, the first to decide in steps 5 to 9 and the second to defer in step 10. When fewer than two qualify, edit a release-managed file in another unit that differs from both its recorded base and the selected release, then re-run the check until both qualify.
4. Record the baseline: `git status --porcelain`, the sha256 of every reviewed file, and the list of directories under `.skilled/release/runs`.
5. Run `/doctor:update align --release=<tag> --scope=<unit-key> --dry-run` and capture the preview. Confirm `STATUS=DRY_RUN`, no new run directory, no evidence, proposal or decisions file, and no apply handoff.
6. Run `/doctor:update align --release=<tag> --scope=<unit-key>` and capture the run directory and the consolidated decision batch.
7. For each presented file, answer the batch with the accepted decision. The answer line uses `[file path] = [decision]` with one entry per file.
8. Capture the decide reply for every file, then the state log at `<runDir>/.doctor-update.last-run.json` and the summary block.
9. Read `<runDir>/decisions.json` and confirm every presented path carries its recorded decision and that `deferredUnits` is empty.
10. For the second reviewed unit, repeat steps 6 to 8 for that unit and answer `defer` for the whole batch. Confirm the state log lists that unit's `kind:name` key under `deferred_units`, that its file decisions stay unrecorded, and that the terminal status is `STATUS=DEFERRED`.
11. Restore the edited files in the copy with `git checkout -- <path>`, confirm `git status --porcelain` matches the baseline, then discard the copy and confirm the live working copy is unchanged.

### Expected

Phase 1 passes only when the run root is ignored. The dry run shows the plan and writes nothing, so no run directory exists after it and no apply handoff is offered. The real run creates one run directory below `.skilled/release/runs` that holds `plan.json`, `decisions.json` and the evidence subtree, plus a proposals subtree when a unit has a merge result.

Each reviewed unit gets one consolidated batch. Every non-same file appears with a complete evidence card before its answer is requested. Each answer, including one that matches the recommendation, is recorded through the decide command and the returned JSON is read before the next answer. A deferred unit is recorded as deferred and none of its files is written.

The state log and `decisions.json` agree with the recorded answers. The summary lists the decisions, the deferred units and any unresolved file, and offers apply only when nothing is unresolved. No checkout file changes because the whole record lives inside the ignored run directory.

### Evidence

- The `git check-ignore` result for the run root.
- The chosen unit and its status as reported by the check.
- The dry-run preview with `STATUS=DRY_RUN`, the absence of a new run directory and the absence of an apply handoff.
- The run directory path and the full decision batch, including each evidence card.
- The decide reply for every presented file.
- The `decisions.json` content and the state log with `decisions_recorded`, `deferred_units` and `final_status`.
- The deferred unit's `kind:name` key and the `STATUS=DEFERRED` result.
- The baseline comparison showing no checkout file changed.

### Pass / Fail

- **Pass**: The dry run writes nothing, the real run records one decision per presented file, `decisions.json` and the state log agree with the answers, a deferred unit stays unapplied, and the copy's reviewed files are restored.
- **Fail**: A decision is inferred without an explicit answer, a file answer is missing from `decisions.json`, a write lands outside the run directory, the state log disagrees with the answers, or a checkout file changes.

### Failure Triage

If the preflight stops on the run root, inspect the ignore lines in `.skilled/release/.gitignore` or the repository ignore file. If no unit qualifies for review, inspect the candidate unit's check status and make its file differ from both its base and the selected release. If a write lands outside the run directory, that violates the align invariant in `doctor-update-align.yaml`. If `decisions_recorded` disagrees with the number of recorded answers, inspect how each decide call was issued and whether the reply was read before the next answer.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-align.yaml](../../../../commands/doctor/assets/doctor-update-align.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:update align

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-358
- Feature name: Doctor update align
- Command mode: `/doctor:update align`
- YAML asset: `doctor-update-align.yaml`
- Mutation boundary: one run directory below the ignored `.skilled/release/runs` root, its proposals subtree when a merge result exists, its `decisions.json` and its `.doctor-update.last-run.json` state log. No skill file, command file, prompt, runtime mirror or other checkout path is written, and the edited files in the copy are restored at the end.
- Feature file path: `doctor-commands/doctor-update-align.md`
