---
title: "DOC-361 -- Doctor update record base"
description: "Manual scenario validating that /doctor:update record-base on the shared update fixture previews every scoped unit, refuses an unchecked offline record until the operator approves --trust-release, asks once before writing .skilled/release/base.json, and records the base in one approved write that the fixture then resets."
version: 1.1.0.0
id: doctor-commands-doctor-update-record-base
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-361 -- Doctor update record base

## 1. OVERVIEW

This scenario validates the base-recording action of `/doctor:update` against the shared doctor update fixture at `.worktrees/.doctor-update-test-environment`. Record-base records the release the tree was installed from. It first shows every unit the engine would record and whether the nearest-release check ran, asks once before writing, and writes `.skilled/release/base.json` under the apply lock.

Offline, the engine cannot list release tags, so it refuses before any nearest-release comparison and names `--trust-release`. The scenario runs the preview, exercises that refusal and the explicit trust-release retry, declines the write once, then approves it and confirms the single recorded base for the scoped fixture units, the result block and the state of the scoped check afterward. The fixture's committed base file is restored with `git checkout` at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove record-base shows every scoped unit and the nearest-release check state before asking, requires the explicit trust-release approval when offline mode cannot check nearer releases, writes the base in one approved write rather than one per unit, and reports the recorded release.
- Playbook ID: DOC-361.
- Real user request: `Record the release this checkout was copied from so updates have a starting point.`
- Prompt: `Record the release this checkout was copied from so updates have a starting point.`
- Preconditions: The `/doctor:update` fixture at `.worktrees/.doctor-update-test-environment` with its committed `.skilled/release/base.json` and committed fixture units, an empty `git status --porcelain`, no run directory under `.skilled/release/runs/`, plus a runtime that can execute `/doctor:update` with Bash access. Node and git available.
- Expected execution process: Move into the fixture, confirm the committed base and the scoped units, record the baseline, run the scoped dry-run preview, capture the offline refusal and the approved trust-release retry, decline the write once, approve it, capture the recorded base and the state log, re-run the scoped check, then restore `.skilled/release/base.json` with `git checkout`.
- Expected signals: Phase 1 confirms the current directory is inside the fixture repository and the engine exists, and it asks which release the tree was installed from only when no release was supplied. The preview command is `node .skilled/commands/doctor/scripts/release-update.cjs record-base --repo . --json --dry-run --release <tag> [--remote <value>] [--scope <value>] [--offline] [--include-prerelease] [--trust-release]` and the presentation shows `Release Base Preview` with `Release`, `Remote`, `Nearest-release check: [verified|not verified]` and one row per unit with its key, status and base source. `--dry-run` stops with `STATUS=DRY_RUN` and writes no state log. Offline, the engine cannot list release tags, so it refuses before any nearest-release comparison and exits 1 with an error that names `--trust-release`. When the engine can compare releases and another release is nearer, it refuses and names the nearest release for the units, and when every listed unit names the same nearest release the command offers to retry with that release. To keep the named release, the command asks `The selected release may not match the files in this tree. Approve recording [release] anyway with --trust-release?` and retries only after an unambiguous yes, with `--trust-release` passed only after that approval. When `.skilled/release/base.json` has uncommitted changes, the run shows the commit instruction and stops. When the engine reports a lock, the run shows the lock template and stops. The write approval is `Record release [release] as the base for these units?` with `Reply yes to write .skilled/release/base.json, or no to leave it unchanged.` A `no` reports `STATUS=DECLINED` and makes no write. On approval the engine runs the same command without `--dry-run`, writes `.skilled/release/base.json` under the apply lock, and returns the release, remote, unit list, `verified` and error fields. The fixture records `v4.0.0.2` for `skill:sk-code/sk-code-webflow` and `skill:sk-git`, which the scoped `v4.0.0.2` check reports as `customized` and `conflict`, so the approved run records `verified` false because the trust-release retry is unchecked. The result block is `Doctor Update Record Base` with `Release`, `Remote`, `Units recorded`, `Nearest-release check`, the state log path and a terminal status of `STATUS=RECORDED`, `STATUS=DRY_RUN`, `STATUS=DECLINED`, `STATUS=CANCELLED` or `STATUS=FAILED`, followed by `Commit .skilled/release/base.json, then run /doctor:update again.` The state log `.skilled/release/runs/.doctor-update-record-base.last-run.json` records `release`, `remote`, `units`, `verified` and `final_status`, and is written only when `git check-ignore` matches the runs root. A verified record that covers every unit clears the check's `baseRecording.needed` flag. A trusted retry records `verified` false. On the fixture the retry still writes a tree fingerprint for each scoped unit, so the scoped check reports both units with `baseSource: recorded` and `baseRelease: v4.0.0.2` and leaves `baseRecording.needed` false until the committed base file is restored. Only `.skilled/release/base.json`, the engine lock and the optional state log change, and the base is written once per approved run rather than once per unit.
- Desired user-visible outcome: A preview that names the release and every scoped unit, the offline refusal resolved only through the approved trust-release retry, one approval that writes the base once, and a clear result with the commit instruction and a restored fixture.
- Pass/fail: PASS if the preview lists every scoped unit and the nearest-release check state, the offline refusal is resolved only through the approved `--trust-release` retry, the write happens only after an unambiguous yes, `.skilled/release/base.json` names `v4.0.0.2` for `skill:sk-code/sk-code-webflow` and `skill:sk-git` in one write, the result block reports the terminal status, the scoped check reflects the record, and the committed base file is restored at the end.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Record the release this checkout was copied from so updates have a starting point.
```

### Commands

1. `cd .worktrees/.doctor-update-test-environment`, then confirm `git status --porcelain` prints nothing, no run directory exists under `.skilled/release/runs/`, and `git status --porcelain -- .skilled/release/base.json` prints nothing.
2. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --release v4.0.0.2 --offline --json --scope skill:sk-code/sk-code-webflow,skill:sk-git` and record `skill:sk-code/sk-code-webflow` as `customized` and `skill:sk-git` as `conflict`, each with `baseSource: recorded`, and `baseRecording.needed` false for the committed base.
3. Record the baseline: `shasum -a 256 .skilled/release/base.json`, `git status --porcelain`, and the list of directories under `.skilled/release/runs`.
4. Run `/doctor:update record-base --release=v4.0.0.2 --offline --scope=skill:sk-code/sk-code-webflow,skill:sk-git --dry-run` and capture the refusal. The engine cannot list release tags offline, so it exits 1 and its error names `--trust-release`.
5. Approve the risk statement and retry the preview with `--trust-release`. Capture `Release Base Preview` with `Release: v4.0.0.2`, `Nearest-release check: not verified` and one row for each scoped unit, and note that the dry run writes no state log and no base file.
6. Run `/doctor:update record-base --release=v4.0.0.2 --offline --trust-release --scope=skill:sk-code/sk-code-webflow,skill:sk-git` and answer `no` at the write approval. Capture `STATUS=DECLINED` and confirm the base checksum matches the baseline.
7. Run the same command again and approve with `yes`. Capture the result block and `STATUS=RECORDED`.
8. Read `.skilled/release/base.json` and confirm one entry per scoped unit for `v4.0.0.2` with a tree fingerprint, with no duplicate and no second write for a unit already recorded.
9. Run the scoped check again and confirm both units report `baseSource: recorded` with `baseRelease: v4.0.0.2` and that `baseRecording.needed` stays false.
10. Confirm `git check-ignore .skilled/release/runs` matches, that the state log exists at `.skilled/release/runs/.doctor-update-record-base.last-run.json` and carries `release`, `units`, `verified` and `final_status`, and that `.skilled/release/.apply.lock` is absent.
11. Reset the fixture: `git checkout -- .skilled/release/base.json`, then confirm the checksum matches the baseline and `git status --porcelain` prints nothing.

### Expected

The fixture check reports `baseRecording.needed` false before the scenario because the committed base covers the units, and the units rest on a recorded base. The preview names the release, the remote, whether the nearest-release check ran and every unit the engine would record, here `skill:sk-code/sk-code-webflow` and `skill:sk-git`.

Offline, the engine refuses before any nearest-release comparison and names `--trust-release`. The command asks for explicit approval to record the named release unchecked after stating that the tag may not match the files in this tree. No write happens on a refusal, on a declined approval or on cancellation.

On approval the engine writes `.skilled/release/base.json` once for the whole unit list, under the apply lock. The result names the release, the remote and the recorded units, ends with the commit instruction and records `verified` false for the unchecked retry. The scoped check then reports both units with `baseSource: recorded` and `baseRelease: v4.0.0.2`. The state log appears only when the runs root is ignored. Resetting the fixture with `git checkout -- .skilled/release/base.json` returns the committed base and an empty `git status --porcelain`.

### Evidence

- The scoped check before the scenario with the unit statuses `customized` and `conflict`, their `baseSource: recorded` and `baseRecording.needed` false.
- The preview refusal with the error that names `--trust-release`.
- The trust-release risk statement and the approved retry preview with the release, the remote, `Nearest-release check: not verified` and every unit row.
- The declined approval result with `STATUS=DECLINED` and the still matching base checksum.
- The result block with `Units recorded` for `v4.0.0.2` and `STATUS=RECORDED`.
- The `.skilled/release/base.json` content with its two unit entries and tree fingerprints.
- The scoped check after the record with `baseSource: recorded` and `baseRelease: v4.0.0.2`.
- The state log at `.skilled/release/runs/.doctor-update-record-base.last-run.json` and the lock check.
- The `git checkout -- .skilled/release/base.json` reset with the matching checksum and the empty `git status --porcelain`.

### Pass / Fail

- **Pass**: The preview lists every scoped unit and the nearest-release check state, the offline refusal is resolved only through the approved `--trust-release` retry, the write happens only after an unambiguous yes, `.skilled/release/base.json` names `v4.0.0.2` for `skill:sk-code/sk-code-webflow` and `skill:sk-git` in one write, the result block reports the terminal status, the scoped check reflects the record, and the committed base file is restored at the end.
- **Fail**: The base is written without the approval, the offline refusal is bypassed without the trust approval, a unit is written more than once in a run, the recorded release differs from the approved one, the check ignores the new record, or the committed base file is not restored.

### Failure Triage

If the preview names no unit, inspect the release tag and the remote resolution in `doctor-update-record-base.yaml`. If the engine refuses with the offline listing error, approve the risk statement and retry with `--trust-release`, and never pass the flag silently. If the engine refuses with a nearer release, capture the nearest release per unit and either retry with that release or approve `--trust-release` after the risk statement. If the write is refused, inspect the uncommitted-base rule and commit the existing `.skilled/release/base.json` changes first. If the state log is missing, confirm `git check-ignore` matches the runs root, because the log is written only for an ignored run root. If the base checksum still differs after the reset, inspect the changed `.skilled/release/base.json` and run `git checkout` again.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-record-base.yaml](../../../../commands/doctor/assets/doctor-update-record-base.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Environment guide: [doctor-commands README](README.md)

Provenance: manual only - /doctor:update record-base

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-361
- Feature name: Doctor update record base
- Command mode: `/doctor:update record-base`
- YAML asset: `doctor-update-record-base.yaml`
- Mutation boundary: `.skilled/release/base.json` through the engine, the engine-owned `.skilled/release/.apply.lock`, and `.skilled/release/runs/.doctor-update-record-base.last-run.json` when the runs root is ignored. The run records the `customized` `skill:sk-code/sk-code-webflow` and `conflict` `skill:sk-git` units at `v4.0.0.2` and touches no other checkout path. Every other checkout file stays read-only, and the committed base file is restored with `git checkout` at the end.
- Feature file path: `doctor-commands/doctor-update-record-base.md`
