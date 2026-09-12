---
id: WC-001
category: write_containment
stage: runtime
title: "WC-001: Shared-Checkout Run Preserves a Neighbour's Work"
description: "Verify a fan-out on a shared checkout leaves every out-of-scope file byte-identical and reports the finding instead of undoing it."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.0.0.0"
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

**Preconditions**: A checkout with at least one dirty file outside the run's spec folder. No
worktree flag.

**Expected outcome**: The run completes. Every dirty file outside the lineage directory keeps its
bytes. The lane settles as completed with a containment advisory rather than failed, and the
orchestration summary counts it separately.

---

## 3. TEST EXECUTION

1. Note the content hash of a dirty file outside the run's spec folder.
2. Run the fan-out against the spec folder, leaving the containment mode at its default.
3. While it runs, edit another file outside the spec folder from a second shell.
4. When the run settles, re-hash both files.

**Pass**: both files are byte-identical to what the neighbour wrote. The status ledger carries a
containment finding naming them, and no file was reverted.

**Fail**: any file differs, or the run reports a clean pass having changed one.

---

## 4. SOURCE FILES

- `runtime/lib/deep-loop/write-containment.ts`
- `runtime/scripts/fanout-run.cjs`

---

## 5. SOURCE METADATA

Automated coverage lives in `runtime/tests/unit/write-containment.vitest.ts`. This scenario exists
because the failure it guards against only appears when a second writer is genuinely concurrent,
which a single-process test cannot stage.
