---
id: WC-001
category: write_containment
stage: runtime
title: "WC-001: Shared-Checkout Run Preserves a Neighbour's Work"
description: "Verify a fan-out on a shared checkout leaves every out-of-scope file byte-identical and reports the finding instead of undoing it."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.0.1.0"
---

# WC-001: Shared-Checkout Run Preserves a Neighbour's Work

## 1. OVERVIEW

A fan-out cannot tell its own lane's writes from a second session's. Its remedy used to be to undo
what it could not attribute, which meant a neighbour editing the same checkout lost work while the
run reported success. This scenario verifies the remedy is now preservation: the file stays, and the
finding is reported.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator runs a research fan-out while a second session is editing
files in the same checkout.

**Preconditions**: A checkout with one file outside the run's spec folder that is already dirty
when the run starts, and one tracked file outside it that is clean. The lane shares the checkout.

**Expected outcome**: The run completes. Every file outside the lineage directory keeps its bytes.
The file that was already dirty and changed again is reported as contested, not charged to the
lane. The file that was clean is still attributed to the lane, which settles as completed with a
containment advisory rather than failed, and the orchestration summary counts it separately.

---

## 3. TEST EXECUTION

### Preconditions

1. A spec folder the run may write into.
2. `<dirty-file>`: a file outside it with an uncommitted edit already on disk.
3. `<outside-file>`: a tracked file outside it with no uncommitted edit.
4. A second shell open on the same checkout, standing in for the neighbouring session.

### Prompt

- Prompt: `Run a one-lineage deep-research fan-out on <spec-folder> while I keep editing <outside-file> in this checkout, then tell me whether my edits survived.`

### Exact Command Sequence

1. **Record the before state**: `shasum -a 256 <dirty-file> > /tmp/dlw-WC-001/before.txt`.
2. **Start the run**: launch a one-lineage research fan-out on `<spec-folder>` through `/deep:research`, leaving the containment mode at its default of `preserve`.
3. **Edit as the neighbour**: while the lane runs, change both `<dirty-file>` and `<outside-file>` from the second shell.
4. **Record the after state**: when the run settles, `shasum -a 256 <dirty-file> <outside-file> > /tmp/dlw-WC-001/after.txt`.
5. **Read the run record**: copy `<artifact-dir>/orchestration-status.log` and the runner's JSON output to `/tmp/dlw-WC-001/`.

### Expected Signals

| Step | Signal |
|---|---|
| 2 | The runner exits 0 and the lane settles as completed, not failed. |
| 4 | `<dirty-file>` and `<outside-file>` both hold the neighbour's edits, and neither was reverted. |
| 5 | `orchestration-status.log` carries a `containment_contested` event with severity `warning` naming `<dirty-file>`, and the lineage's JSON output lists `<dirty-file>` under `containmentContested.paths` with its note, not under `containment.violations`. |
| 5 | `orchestration-status.log` carries a `containment_violation` event naming `<outside-file>`, and the lineage's JSON output lists `<outside-file>` alone under `containment.violations`. |

### Evidence

- Hashes before and after: `/tmp/dlw-WC-001/before.txt` and `/tmp/dlw-WC-001/after.txt`.
- The copied `orchestration-status.log` and runner JSON output, showing the contested path and the violation.

### Pass/Fail Criteria

- **PASS**: both files are byte-identical to what the neighbour wrote, no file was reverted, `<dirty-file>` is reported as contested, and `<outside-file>` is reported as a violation.
- **FAIL**: any file differs, the run reports a clean pass having changed one, or `<dirty-file>` appears under `containment.violations` or in no field at all.

### Failure Triage

1. A reverted file means the remedy ran as `restore`: check the fan-out configuration's `containment.mode` and any override passed to the runner.
2. A missing finding means the out-of-scope snapshot missed the file: inspect `snapshotOutOfScopeDirtyPaths` in `runtime/lib/deep-loop/write-containment.ts`.
3. `<dirty-file>` under `containment.violations` means the contested split did not run: check that the containment mode is `preserve` and that the lane had not quarantined that path on an earlier pass, then inspect `enforceWriteContainment`.
4. A failed lane with intact files means the advisory was counted as a failure: inspect the containment branch of `runtime/scripts/fanout-run.cjs`.

---

## 4. SOURCE FILES

- `runtime/lib/deep-loop/write-containment.ts`
- `runtime/scripts/fanout-run.cjs`
- [manual-testing-playbook.md](../manual-testing-playbook.md) - root directory page and scenario summary.

---

## 5. SOURCE METADATA

Automated coverage lives in `runtime/tests/unit/write-containment.vitest.ts`. This scenario exists
because the failure it guards against only appears when a second writer is genuinely concurrent,
which a single-process test cannot stage.
