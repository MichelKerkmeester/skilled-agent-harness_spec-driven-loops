---
title: "Fan-Out Write Containment"
description: "How a fan-out keeps a dispatched lane's writes inside its own directory, and why the remedy is preservation rather than reversion."
trigger_phrases:
  - "fan-out write containment"
  - "preserve rather than revert out-of-scope writes"
  - "unattributed out-of-scope writes"
  - "shared checkout churn detection"
version: 1.0.0.0
---

# Fan-Out Write Containment (system-deep-loop)

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

## 3. SOURCE FILES

| File | Role |
|------|------|
| `runtime/lib/deep-loop/write-containment.ts` | Detection, the preserve and restore remedies, and the quarantine writer |
| `runtime/scripts/fanout-run.cjs` | Wiring, the churn detector and the per-run flags |

## 4. SOURCE METADATA

Automated coverage lives in `runtime/tests/unit/write-containment.vitest.ts` and
`runtime/tests/unit/fanout-run.vitest.ts`. The behaviour that only appears outside a fixture, a
genuinely concurrent second writer, is covered by the `WC-001` playbook scenario.
