---
title: "Fan-Out Write Containment and Per-Lineage Worktrees"
description: "How a fan-out keeps a dispatched lane's writes inside its own directory, why the remedy is preservation rather than reversion, and how a per-lineage worktree removes the attribution question instead of answering it."
trigger_phrases:
  - "fan-out write containment"
  - "preserve rather than revert out-of-scope writes"
  - "per-lineage worktree isolation"
  - "shared checkout churn detection"
version: 1.0.0.0
---

# Fan-Out Write Containment and Per-Lineage Worktrees (system-deep-loop)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A dispatched leaf is told to write only inside its lineage directory, but that boundary is carried
in its prompt, not enforced by its sandbox. Containment makes the boundary structural: after a
dispatch it diffs the working tree and reports what landed outside.

## 2. HOW IT WORKS

The guard compares the tree before and after a dispatch, subtracting paths that were already dirty
so unrelated in-flight work is never counted against the lane.

What it does with a finding is the part worth understanding. The tree records that a file changed,
never who changed it, and on a shared checkout the honest answer is frequently a second session.
Undoing an unattributable change therefore destroys a neighbour's work while the run reports
success, which is why preservation is the default: the bytes stay, a copy is quarantined under the
lineage directory, and the lane settles as completed with an advisory rather than failed. Restoring
is opt-in per run and safe only where one operator owns the checkout; it returns a path to its
pre-dispatch bytes rather than to HEAD, so work already in flight survives either way.

A churn detector watches for a burst of newly dirty paths between heartbeats. One writer's ordinary
edits come and go; a burst is a second writer, and once that is proven the run latches preservation
even if restore was requested.

Per-lineage worktrees remove the question rather than answering it more carefully. Each lane runs in
its own detached checkout, so a write outside its lineage directory really is that lane's write, and
the main checkout is never touched. Finished artifacts are published back by staged atomic rename
under a run-keyed name, and the tree is removed. A tree whose lane can still be resumed is kept on
purpose; one whose owner is gone and whose lease has expired well past its term is reclaimed by a
later run's sweep.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `runtime/lib/deep-loop/write-containment.ts` | Detection, the preserve and restore remedies, and the quarantine writer |
| `runtime/lib/deep-loop/worktree-lifecycle.ts` | Creating, seeding and removing a lineage's tree |
| `runtime/lib/deep-loop/worktree-publish.ts` | Staged atomic publication and staging-residue sweep |
| `runtime/lib/deep-loop/worktree-reclaim.ts` | Deciding which abandoned trees may be removed |
| `runtime/lib/deep-loop/worktree-lease.ts` | Ownership lease and the liveness proof a reclaim requires |
| `runtime/scripts/fanout-run.cjs` | Wiring, the churn detector and the per-run flags |

## 4. SOURCE METADATA

Automated coverage lives in `runtime/tests/unit/write-containment.vitest.ts`,
`runtime/tests/unit/fanout-run.vitest.ts` and `runtime/tests/unit/worktree-lifecycle.vitest.ts`.
The two behaviours that only appear outside a fixture, a genuinely concurrent second writer and the
cost of a real multi-lane run, are covered by the `WC-001` and `WC-002` playbook scenarios.
