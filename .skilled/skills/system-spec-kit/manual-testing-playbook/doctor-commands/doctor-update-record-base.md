---
title: "DOC-361 -- Doctor update record base"
description: "Manual scenario validating that /doctor:update record-base previews every unit, reviews the nearest release, asks once before writing .skilled/release/base.json, and records the starting release of a copied tree in one approved write."
version: 1.0.0.0
id: doctor-commands-doctor-update-record-base
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-361 -- Doctor update record base

## 1. OVERVIEW

This scenario validates the base-recording action of `/doctor:update`. A tree that was copied or installed without a recorded base reports `baseRecording.needed` on the check, and its units rest on an inferred, absent or unverified base. Record-base records the release the tree was installed from. It first shows every unit the engine would record and whether the nearest-release check ran, asks once before writing, and writes `.skilled/release/base.json` under the apply lock.

The scenario emulates a copied tree in a disposable copy, runs the preview, exercises the nearest-release refusal and its trust-release retry, declines the write once, then approves it and confirms the single recorded base, the result block and the state of the check afterward. The copy is restored at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove record-base shows every unit and the nearest-release check before asking, writes the base in one approved write rather than one per unit, and reports the recorded release.
- Playbook ID: DOC-361.
- Real user request: `Record the release this checkout was copied from so updates have a starting point.`
- Prompt: `Record the release this checkout was copied from so updates have a starting point.`
- Preconditions: A disposable copy of the repository whose check reports `baseRecording.needed` true, with the engine present, an ignored `.skilled/release/runs` root and a runtime that can execute `/doctor:update` with Bash access. In a copy that still carries release tags in its ancestry and a recorded base, remove `.skilled/release/base.json` and the local release tags to emulate a freshly installed tree.
- Expected execution process: Create the copy, emulate the copied tree, confirm the base recording need, record the baseline, run the dry-run preview, capture the nearest-release refusal and any retry, decline the write once, approve it, capture the recorded base and the state log, then re-run the check.
- Expected signals: Phase 1 confirms the current directory is inside the repository and the engine exists, and it asks which release the tree was installed from only when no release was supplied. The preview command is `node .skilled/commands/doctor/scripts/release-update.cjs record-base --repo . --json --dry-run --release <tag> [--remote <value>] [--scope <value>] [--offline] [--include-prerelease] [--trust-release]` and the presentation shows `Release Base Preview` with `Release`, `Remote`, `Nearest-release check: [verified|not verified]` and one row per unit with its key, status and base source. `--dry-run` stops with `STATUS=DRY_RUN` and writes no state log. When another release is nearer, the engine refuses and names the nearest release for the units. When every listed unit names the same nearest release, the command offers to retry with that release. To keep the named release, the command asks `The selected release may not match the files in this tree. Approve recording [release] anyway with --trust-release?` and retries only after an unambiguous yes, with `--trust-release` passed only after that approval. When `.skilled/release/base.json` has uncommitted changes, the run shows the commit instruction and stops. When the engine reports a lock, the run shows the lock template and stops. The write approval is `Record release [release] as the base for these units?` with `Reply yes to write .skilled/release/base.json, or no to leave it unchanged.` A `no` reports `STATUS=DECLINED` and makes no write. On approval the engine runs the same command without `--dry-run`, writes `.skilled/release/base.json` under the apply lock, and returns the release, remote, unit list, `verified` and error fields. The result block is `Doctor Update Record Base` with `Release`, `Remote`, `Units recorded`, `Nearest-release check`, the state log path and a terminal status of `STATUS=RECORDED`, `STATUS=DRY_RUN`, `STATUS=DECLINED`, `STATUS=CANCELLED` or `STATUS=FAILED`, followed by `Commit .skilled/release/base.json, then run /doctor:update again.` The state log `.skilled/release/runs/.doctor-update-record-base.last-run.json` records `release`, `remote`, `units`, `verified` and `final_status`, and is written only when `git check-ignore` matches the runs root. A verified record that covers every unit clears the check's `baseRecording.needed` flag, while a trusted retry records `verified` false and leaves the affected units reported as recorded and unverified. Only `.skilled/release/base.json`, the engine lock and the optional state log change, and the base is written once per approved run rather than once per unit.
- Desired user-visible outcome: A preview that names the release and every unit, a nearest-release review before the write, one approval that writes the base once, and a clear result with the commit instruction.
- Pass/fail: PASS if the preview lists every unit and the nearest-release check, the write happens only after an unambiguous yes, `.skilled/release/base.json` names the release and the recorded units in one write, the result block reports the terminal status, and the check's base recording state reflects the verified or trusted outcome.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Record the release this checkout was copied from so updates have a starting point.
```

### Commands

1. Create a disposable copy of the repository.
2. Emulate a copied tree in the copy: remove `.skilled/release/base.json` and delete the local release tags with `git tag -d $(git tag -l 'v*')`. Confirm the tags are gone and that the removal is visible in `git status --porcelain`.
3. Run `node .skilled/commands/doctor/scripts/release-update.cjs check --repo . --json --offline` and confirm `baseRecording.needed` is true, that `baseRecording.action` names the record-base command, and that the affected units are `blocked` or rest on a base that is not recorded and verified.
4. Record the baseline: the absence of `.skilled/release/base.json`, `git status --porcelain`, and the list of directories under `.skilled/release/runs`.
5. Run `/doctor:update record-base --release=<installed-release> --dry-run` and capture the preview: release, remote, the nearest-release check result and every unit row.
6. When the engine refuses with a nearer release, capture the unit keys and the nearest release. When every listed unit names the same nearest release, approve the offered retry with that release. To keep the named release instead, approve the `--trust-release` retry after the risk statement.
7. Run `/doctor:update record-base --release=<installed-release>` and answer `no` at the write approval. Capture `STATUS=DECLINED` and confirm `.skilled/release/base.json` is still absent.
8. Run the same command again and approve with `yes`. Capture the result block and `STATUS=RECORDED`.
9. Read `.skilled/release/base.json` and confirm one recorded entry per unit for the selected release, with no duplicate and no second write for a unit already recorded.
10. Run the check again and confirm `baseRecording.needed` is false when the record is verified, or that the affected units stay reported as recorded and unverified after a trusted retry.
11. Confirm the state log exists when the runs root is ignored and carries `release`, `units`, `verified` and `final_status`, and that the lock is absent.
12. Restore the pre-scenario state in the copy by removing `.skilled/release/base.json`, then discard the copy and confirm the live working copy keeps its release tags and unchanged files.

### Expected

The copied tree reports `baseRecording.needed` true before the scenario and the units rest on a base that is not recorded and verified. The preview names the release, the remote, whether the nearest-release check ran and every unit the engine would record.

When another release is nearer, the engine refuses and names it. The command either offers the single nearest release that every unit names, or asks for explicit approval to keep the named release with `--trust-release` after stating that the tag may not match the files in this tree. No write happens on a refusal, on a declined approval or on cancellation.

On approval the engine writes `.skilled/release/base.json` once for the whole unit list, under the apply lock. The result names the release, the remote and the recorded units, and ends with the commit instruction. A verified record clears the check's base recording need, while a trusted retry records `verified` false and the check keeps those units visible as recorded and unverified. The state log appears only when the runs root is ignored.

### Evidence

- The `baseRecording` block from the check before the scenario with `needed`, its units and its action.
- The preview with the release, remote, nearest-release check and every unit row.
- The nearest-release refusal, the nearest release it names, and either offered retry or the trust-release approval with the risk statement.
- The declined approval result with `STATUS=DECLINED` and the still absent base file.
- The result block with `Units recorded` and `STATUS=RECORDED`.
- The `.skilled/release/base.json` content with its unit entries for the selected release.
- The check's `baseRecording` block after the record.
- The state log at `.skilled/release/runs/.doctor-update-record-base.last-run.json` and the lock check.

### Pass / Fail

- **Pass**: The preview lists every unit and the nearest-release check, the write happens only after an unambiguous yes, `.skilled/release/base.json` names the release and the recorded units in one write, the result block reports the terminal status, and the check's base recording state reflects the verified or trusted outcome.
- **Fail**: The base is written without the approval, the nearest-release refusal is bypassed without the trust approval, a unit is written more than once in a run, the recorded release differs from the approved one, or the check ignores the new record.

### Failure Triage

If the preview names no unit, inspect the release tag and the remote resolution in `doctor-update-record-base.yaml`. If the nearest-release refusal blocks the run, capture the nearest release per unit and either retry with that release or approve `--trust-release` after the risk statement, and never pass the flag silently. If the write is refused, inspect the uncommitted-base rule and commit the existing `.skilled/release/base.json` changes first. If the state log is missing, confirm `git check-ignore` matches the runs root, because the log is written only for an ignored run root.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/update.md](../../../../commands/doctor/update.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-update-record-base.yaml](../../../../commands/doctor/assets/doctor-update-record-base.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-update-presentation.txt](../../../../commands/doctor/assets/doctor-update-presentation.txt)
- Engine: [.skilled/commands/doctor/scripts/release-update.cjs](../../../../commands/doctor/scripts/release-update.cjs)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:update record-base

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-361
- Feature name: Doctor update record base
- Command mode: `/doctor:update record-base`
- YAML asset: `doctor-update-record-base.yaml`
- Mutation boundary: `.skilled/release/base.json` through the engine, the engine-owned `.skilled/release/.apply.lock`, and `.skilled/release/runs/.doctor-update-record-base.last-run.json` when the runs root is ignored. Every other checkout file stays read-only, and the disposable copy is restored and discarded at the end.
- Feature file path: `doctor-commands/doctor-update-record-base.md`
