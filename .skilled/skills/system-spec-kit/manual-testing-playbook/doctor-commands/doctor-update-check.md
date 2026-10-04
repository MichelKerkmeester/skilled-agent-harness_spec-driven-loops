---
title: "DOC-357 -- Doctor update check"
description: "Manual scenario validating that /doctor:update check on the shared update fixture reports the release position, upstream latest and per-unit status, keeps unavailable upstream data visible as UNKNOWN, and writes no checkout file or state log."
version: 1.1.0.0
id: doctor-commands-doctor-update-check
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-357 -- Doctor update check

## 1. OVERVIEW

This scenario validates the default action of `/doctor:update` against the shared doctor update fixture at `.worktrees/.doctor-update-test-environment`. A `/doctor:update` invocation with no action token runs `check`, which reports where the fixture stands against a named release: the release position, the ahead and behind counts, the upstream latest release or UNKNOWN, and every unit status. Check is read-only for the checkout. The only network write it may perform is a release-commit fetch into the git object store, which creates no ref, and `--offline` prevents every fetch.

The scenario also confirms that unavailable upstream data stays visible as UNKNOWN, that a `--json` run returns one JSON report with no prose around it, that check writes no state-log file, and that the fixture keeps its baseline files, refs and empty run root after the runs.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the check reports the fixture release position and per-unit status, keeps unknown upstream data visible as UNKNOWN, and leaves the checkout, its refs and the state-log paths untouched.
- Playbook ID: DOC-357.
- Real user request: `Check where this checkout stands against the latest spec-kit release.`
- Prompt: `Check where this checkout stands against the latest spec-kit release.`
- Preconditions: The `/doctor:update` fixture at `.worktrees/.doctor-update-test-environment` with its committed fixture units, an empty `git status --porcelain` and no run directory under `.skilled/release/runs/`, plus a runtime that can execute `/doctor:update` with Bash access. Node and git available. The offline runs need no network reachability.
- Expected execution process: Move into the fixture, record the baseline, run the scoped check with no action token, run the second scoped check for the removed unit, run the `--json` form and the engine directly, capture the dashboards and the report fields, then compare the fixture with the baseline.
- Expected signals: Preflight confirms the current directory is inside the fixture repository and the engine exists. `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --json` exits 0 when a report is produced and exit 2 is usage failure, and the report carries `schemaVersion`, `command`, `repo`, `head`, `release`, `releaseCommit`, `localLatest`, `upstream.status`, `upstream.latest`, `upstream.error`, `checkout.position`, `checkout.aheadBy`, `checkout.behindBy`, `checkout.dirty`, `status`, `baseRecording`, `units`, `files` and `counts`. The `v4.0.0.2` check reports `skill:sk-code/sk-code-webflow` as `customized`, `skill:sk-code/sk-code-web-dev` as `local` and `skill:sk-git` as `conflict`, and the `v4.0.0.3-fixture` check with `--include-prerelease` reports `skill:sk-code/sk-code-obsidian` as `removed`. Unit statuses stay inside `current`, `local`, `update`, `new`, `customized`, `conflict`, `removed`, `blocked`, `downgrade` and `unknown`, and the report status stays inside `current`, `updates-available`, `blocked` and `unknown`. An offline run reports `upstream.status` unknown with `upstream.error` naming offline mode, so the report status reads `unknown` as well. The dashboard shows `Spec-kit Release Check`, the release position, `Upstream latest`, the checkout line with ahead, behind and dirty values, `Report status`, one quiet line combining the `current` and `local` counts, and a row for every other unit grouped by status. A `--json` run returns the parsed report as one JSON document and omits the prose dashboard and next steps. `current` and `updates-available` map to `STATUS=OK`, `blocked` maps to `STATUS=UNKNOWN` and names the blocked units, and `unknown` maps to `STATUS=UNKNOWN`. A check whose `baseRecording.needed` is true names `/doctor:update record-base --release=<installed-release> [--remote=<framework-remote>]` in its next steps, while the fixture's committed base leaves `baseRecording.needed` false. Check writes no state-log file, the checkout files and refs match the baseline, and the result block is `Doctor Update Check` with `STATUS=[OK|UNKNOWN|FAILED]`.
- Desired user-visible outcome: A dashboard that names the fixture release position, upstream latest or UNKNOWN, and the per-unit statuses, recommends a next step, and leaves no trace on the checkout.
- Pass/fail: PASS if the dashboard and the direct engine report carry the release position and the fixture unit statuses `customized`, `local`, `conflict` and `removed`, the offline run keeps upstream UNKNOWN and names offline mode, the JSON run adds no prose, a terminal status is reported, and no checkout file, ref or state-log file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check where this checkout stands against the latest spec-kit release.
```

### Commands

1. `cd .worktrees/.doctor-update-test-environment`, then confirm `git status --porcelain` prints nothing and no run directory exists under `.skilled/release/runs/`. Confirm `git rev-parse --show-toplevel` names the fixture checkout and `.skilled/commands/doctor/scripts/release-update.cjs` exists.
2. Record the baseline: `git status --porcelain`, `git rev-parse HEAD` and `shasum -a 256 .skilled/release/base.json`.
3. Run `/doctor:update --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-code/sk-code-web-dev,skill:sk-git` through the real runtime. The missing action token selects `check`. Capture the complete `v4.0.0.2` dashboard.
4. Run `/doctor:update check --release=v4.0.0.3-fixture --include-prerelease --offline --scope=skill:sk-code/sk-code-obsidian` and capture the dashboard for the removed unit.
5. Run `/doctor:update check --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-code/sk-code-web-dev,skill:sk-git --json`. Confirm the reply is one JSON report with no prose dashboard and no next steps.
6. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --release v4.0.0.2 --offline --json --scope skill:sk-code/sk-code-webflow,skill:sk-code/sk-code-web-dev,skill:sk-git` directly and record the exit code, each unit's key and status, `upstream.status`, `upstream.error`, `status`, `baseRecording` and every other field listed in the contract.
7. Confirm no state log appeared under `.skilled/release/runs/` and that the run root still holds no run directory.
8. Compare `git status --porcelain` and HEAD with step 2 and confirm the fixture is unchanged.

### Expected

The preflight passes and the engine returns a report. The dashboard renders the release position, upstream latest or UNKNOWN, the ahead and behind counts, the dirty flag, the report status, the combined quiet line and one row per remaining unit. The `v4.0.0.2` run shows `customized`, `local` and `conflict` for the three fixture units. The `v4.0.0.3-fixture` run shows the removed `skill:sk-code/sk-code-obsidian` unit. The offline runs never present unknown upstream data as current, so upstream latest and the report status read UNKNOWN and the offline mode error is visible. The JSON run omits the prose dashboard and the next steps.

Next steps follow the report. A customized or conflict unit offers `/doctor:update align` with the same release and scope. An update or new unit offers `/doctor:update apply`. A removed, blocked or unknown unit gets its status explanation and no automatic-apply recommendation. A downgrade unit explains that apply never writes it. A report with nothing to do says the selected units are current or local, and a report whose base recording is needed names the record-base action with the installed release.

Check writes only an in-memory result, so no state-log file appears and the checkout files and refs keep their baseline content. The fixture ends with an empty `git status --porcelain` and no run directory under `.skilled/release/runs/`.

### Evidence

- The preflight observations for the fixture git repository, the engine path and the empty run root.
- The complete `v4.0.0.2` dashboard from the no-action run, with `skill:sk-code/sk-code-webflow` as `customized`, `skill:sk-code/sk-code-web-dev` as `local` and `skill:sk-git` as `conflict`.
- The `v4.0.0.3-fixture` dashboard with `skill:sk-code/sk-code-obsidian` reported as `removed`.
- The offline upstream block with `upstream.status`, `upstream.error` and the terminal status.
- The `--json` reply and the observation that no prose was added around it.
- The direct engine run with its exit code and parsed report fields, including each unit's status.
- The listing of `.skilled/release/runs/` showing no new state log.
- The comparison of `git status --porcelain` and HEAD from steps 2 and 8.

### Pass / Fail

- **Pass**: The dashboard and the engine report carry the release position and the fixture unit statuses `customized`, `local`, `conflict` and `removed`, the offline runs keep upstream UNKNOWN and name offline mode, the JSON run adds no prose, a terminal status is reported, and no checkout file, ref or state-log file changes.
- **Fail**: Unknown upstream data is presented as current, a state log appears, a checkout file or ref changes, the JSON reply carries prose, a fixture unit reports another status, or a required report field or dashboard section is missing.

### Failure Triage

If the preflight stops, inspect the git repository check and the engine path in `doctor-update-check.yaml`. If a fixture unit reports another status, compare its files across `v4.0.0.0`, the fixture and the release with `git diff --name-status`, because each status comes from the three-way classification in `release-update.cjs`. If the offline run still reaches the network, inspect the offline flag handling and its engine mapping. If a unit status falls outside the listed values, preserve it visibly as unknown and inspect the engine status mapping. If a checkout file or ref changes, the check crossed its mutation boundary, which is a failure of the read-only invariant.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-check.yaml](../../../../commands/doctor/assets/doctor-update-check.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:update check

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-357
- Feature name: Doctor update check
- Command mode: `/doctor:update check`
- YAML asset: `doctor-update-check.yaml`
- Mutation boundary: The fixture checkout and its refs stay read-only. The engine may fetch a release commit it lacks into the git object store and `FETCH_HEAD`, which creates no ref, and `--offline` prevents every fetch. The scenario reports the `customized`, `local`, `conflict` and `removed` fixture units and writes none of their files. Check writes no state-log file.
- Feature file path: `doctor-commands/doctor-update-check.md`
