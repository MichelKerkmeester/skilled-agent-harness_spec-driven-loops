---
title: Doctor Update Runtime State
description: Holds the release updater's base record, divergence log, alignment runs and apply lock for this checkout.
trigger_phrases:
  - "doctor update runtime state"
  - "release base record"
  - "doctor update divergence log"
version: 1.0.0.0
---

# Doctor Update Runtime State

> Local records the `/doctor:update` release updater keeps about this checkout.

---

## 1. OVERVIEW

This folder belongs to the release updater, [`release-update.cjs`](../../../commands/doctor/scripts/release-update.cjs), which every `/doctor:update` route calls. The updater records which release this checkout was last aligned to, which local differences you chose to keep, and the run folders behind each alignment and apply.

The records describe one checkout, not the framework, so they never ship and never count as framework content. The updater leaves this folder out when it compares your files with a release.

Raw data is git-ignored. Only this `README.md` is tracked, so the folder and its purpose stay visible without shipping anyone's records.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `base.json` | Formatted JSON object | The base record: for each unit, keyed `kind:name`, the release it was last aligned to and that release's tree fingerprint. `record-base` writes it and `apply` updates it. |
| `divergence.json` | Formatted JSON object | The divergence log: one entry for each file where an apply kept the local copy, merged or used a proposal, with the unit, path, release and both blob ids. |
| `runs/<release>-<utc-stamp>/` | Folder | One alignment run: its `plan.json` and `decisions.json`, plus `rollback.json` once the run was applied. |
| `runs/.doctor-update.last-run.json` | JSON object | The state log of the last apply: start, end, release, dry-run flag, written paths and battery results. |
| `.apply.lock` | JSON object | Present only while an apply runs, naming the owner process, its start time, command and run folder. `unlock` removes one whose owner process has exited. |

---

## 3. CLEANUP

Deleting `base.json` leaves the next check unable to tell a local edit from a release change, so every file that differs shows as a conflict. Run `record-base` again afterwards. Deleting `divergence.json` drops the record of local copies you chose to keep. A run folder can be deleted once you no longer need to roll it back, because `rollback.json` inside it is what `rollback` reads.

An older checkout kept these records in `.skilled/release/`. The updater still reads them there when this folder has none, and writes here from then on.
