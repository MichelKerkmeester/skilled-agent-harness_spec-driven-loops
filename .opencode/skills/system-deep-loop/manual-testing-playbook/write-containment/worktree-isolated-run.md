---
id: WC-002
category: write_containment
stage: runtime
title: "WC-002: Worktree Run Isolates a Lane and Cleans Up After Itself"
description: "Verify a fan-out with worktrees seeds an uncommitted packet into each lane's own tree, publishes results into the main checkout, and leaves no worktree behind."
expected_intent: research
expected_workflow_mode: research
expected_leaf_resources: []
version: "1.0.0.0"
---

# WC-002: Worktree Run Isolates a Lane and Cleans Up After Itself

## 1. OVERVIEW

With worktrees enabled each lane runs in its own checkout, so attribution stops being a guess. The
two things that can go wrong are invisible: a lane reading the main checkout's code rather than its
own, and a tree surviving the run that created it.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator runs a fan-out with the worktree option against a packet
that is not yet committed.

**Preconditions**: A packet with uncommitted content, since HEAD carries nothing and only a seed can
put those bytes in a tree created from it.

**Expected outcome**: Every lineage directory is published into the main checkout under its
run-keyed name. The uncommitted packet content is present inside each lane's tree. No worktree of
this run remains afterwards.

---

## 3. TEST EXECUTION

1. Count the registered worktrees before starting.
2. Run the fan-out with the worktree option against the uncommitted packet.
3. When it settles, count the registered worktrees again and list the published lineage directories.
4. Confirm the uncommitted packet content reached the lane by reading it back from the published
   artifacts.

**Pass**: the worktree count is unchanged, every lineage published, and the packet content arrived.

**Fail**: any worktree survives, a lineage is missing, or the packet content is absent, which means
the lane read a tree without the seed.

---

## 4. SOURCE FILES

- `runtime/lib/deep-loop/worktree-lifecycle.ts`
- `runtime/lib/deep-loop/worktree-publish.ts`
- `runtime/lib/deep-loop/worktree-reclaim.ts`

---

## 5. SOURCE METADATA

Automated coverage lives in `runtime/tests/unit/fanout-run.vitest.ts` and
`runtime/tests/unit/worktree-lifecycle.vitest.ts`. This scenario exists because the cost and the
disk footprint of a real multi-lane run are only visible outside a fixture.
