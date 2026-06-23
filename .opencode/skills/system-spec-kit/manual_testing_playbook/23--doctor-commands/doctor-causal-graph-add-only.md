---
title: "DOC-330 -- Doctor causal graph add-only"
description: "This scenario validates /doctor causal-graph add-only enforcement for DOC-330. It focuses on proving existing causal edges are never deleted or weight-modified."
version: 3.6.0.10
---

# DOC-330 -- Doctor causal graph add-only

## 1. OVERVIEW

This scenario validates the mutation boundary for `/doctor causal-graph`. The command is allowed to add new causal edges, but it must never delete existing edges or rewrite established weights.

The test treats existing edges as historical evidence. Even if the command finds better links, mutation flow must preserve previous `sourceId`, `targetId`, `relation`, and weight data byte-for-byte and add only new rows through the causal-link tool.

---

## 2. SCENARIO CONTRACT

- Objective: Add-only enforcement for causal graph mutation flow.
- Playbook ID: DOC-330.
- Real user request: `Run causal-graph apply. Verify no existing edges are deleted or weight-modified, only new edges are added.`
- Prompt: `Run causal-graph apply. Verify no existing edges are deleted or weight-modified, only new edges are added.`
- Preconditions: A sandbox or target active resolved profile Memory MCP database has existing `causal_edges` rows with established weights and at least one eligible new candidate edge.
- Expected execution process: Dump existing causal edges before apply, run `/doctor causal-graph`, dump edges again, and compare pre/post state so the diff shows only additions.
- Expected signals: existing edges are byte-identical before and after; new edges are appended; edge count increases by the number of inserted candidates; no delete or update operation is observed.
- Desired user-visible outcome: A pass/fail verdict proving mutation flow preserved all existing causal evidence.
- Pass/fail: PASS if pre-existing causal edges are unchanged and all differences are additive new rows.
- Classification: Manual scenario; valid verdicts are `PASS`, `FAIL`, `SKIP`, or `UNAUTOMATABLE`.

---

## 3. TEST EXECUTION

### Prompt

```
Run causal-graph apply. Verify no existing edges are deleted or weight-modified, only new edges are added.
```

### Commands

1. Record baseline `memory_causal_stats({})` totals and the pre-run edge count.
2. Dump existing `causal_edges` rows before apply, including stable identifiers, relation, strength or weight fields, evidence, and timestamps available in this schema.
3. Run `/doctor causal-graph --confidence-threshold=0.7`.
4. Capture the snapshot path, candidate-existing-edge check, link results, and final state log.
5. Dump `causal_edges` rows again after apply using the same ordering and selected columns as the pre-run dump.
6. Diff the pre-run and post-run dumps.
7. Verify every pre-existing row is byte-identical and every diff hunk is an added row.

### Expected

The apply workflow snapshots the database, validates mutation boundaries, filters eligible candidates, and calls `memory_causal_link` only for new source/target/relation combinations. The post-run edge dump contains every pre-run row unchanged.

If `N` new edges are inserted, the post-run edge count is exactly baseline plus `N`. Existing edge weights, strengths, evidence text, and timestamps are not rewritten. Any attempt to delete, update, upsert an existing edge, or lower an existing weight is outside the command contract.

### Evidence

- Pre-run causal edge dump.
- Snapshot path from Phase 2.
- Phase 3 validation output showing add-only operation set and candidate existing-edge checks.
- Link results and inserted count.
- Post-run causal edge dump.
- Diff showing only added rows and no removed or modified existing rows.

### Pass / Fail

- **PASS**: existing edges are byte-identical pre/post, the diff contains only additions, and edge count delta equals inserted new edges.
- **FAIL**: any existing edge weight changes, any existing row is deleted, any existing row is updated, or the command uses a forbidden delete/update path.
- **SKIP**: no sandbox or target dataset has both established existing edges and eligible new candidate edges.
- **UNAUTOMATABLE**: the runtime cannot execute `/doctor causal-graph` or produce comparable pre/post causal edge dumps.

### Failure Triage

If any existing edge weight changed or any edge was deleted, fail with `mutation-boundary-violation`. Inspect `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` Phase 3 validation, `candidate_existing_edge_check`, and any observed operation list. Roll back from the emitted snapshot if the command did not already restore the database.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Command entrypoint: [.opencode/commands/doctor/speckit.md](../../../../commands/doctor/speckit.md)
- Matching YAML asset: [.opencode/commands/doctor/assets/doctor_causal-graph.yaml](../../../../commands/doctor/assets/doctor_causal-graph.yaml)
- Design context: local doctor command contract
- Decision context: local doctor command ADRs

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-330
- Feature name: Doctor causal graph add-only
- Command mode: `/doctor causal-graph --confidence-threshold=0.7`
- YAML asset: `doctor_causal-graph.yaml`
- Mutation boundary: add-only; never delete or update existing `causal_edges`
- Failure code: `mutation-boundary-violation`
- Feature file path: `23--doctor-commands/doctor-causal-graph-add-only.md`
