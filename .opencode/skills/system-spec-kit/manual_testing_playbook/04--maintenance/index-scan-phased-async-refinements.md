---
title: "EX-039 -- index_scan phased-async refinements (move reconciliation, active-row uniqueness, repair counts)"
description: "This scenario validates the index_scan phased-async refinements for `EX-039`. It focuses on the walk -> commit-lexical -> async vector drain phasing, packet_id move reconciliation, active-row logical-key uniqueness (mig 28), and the repair counts surfaced in the response."
version: 3.6.0.3
---

# EX-039 -- index_scan phased-async refinements (move reconciliation, active-row uniqueness, repair counts)

## 1. OVERVIEW

This scenario validates the phased-async refinements of `memory_index_scan` for `EX-039`, extending the basic `EX-014` coverage. The scan walks the workspace, commits lexical (BM25/FTS) rows first so documents are searchable immediately, then drains vectors asynchronously; a completed scan can therefore return `status: complete_with_pending_vectors` with a non-zero `pendingVectors` count while embeddings finish.

The scan also reconciles a sibling spec-folder rename in place rather than delete-then-reindex — matching by packet_id only under a narrow guard (unchanged basename, same grandparent directory, and exactly one live old row) — enforces the migration-28 active-row logical-key uniqueness guard (at most one non-deprecated, non-constitutional row per logical key), and surfaces repair counts (`moveReconciled`, `staleDeleted`, orphan-sweep counts, `checkpointRepair`) in the response. The user-observable value is fast lexical availability plus a self-correcting index that does not duplicate or orphan rows when files move.

---

## 2. SCENARIO CONTRACT

- Objective: Verify phased-async indexing, move reconciliation, active-row uniqueness, and repair counts.
- Real user request: `I renamed a spec folder and re-ran the index. Are my docs still searchable immediately, and did the index avoid duplicating rows?`
- Prompt: `Validate the index_scan phased-async refinements: confirm lexical rows are searchable before vectors drain (complete_with_pending_vectors with pendingVectors), a sibling folder rename is reconciled in place under the narrow packet_id guard (moveReconciled), the migration-28 active-row uniqueness guard holds, and the response surfaces repair counts. Return a concise pass/fail verdict with cited field names.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `status: complete_with_pending_vectors` with a non-zero `pendingVectors` when vectors still drain; lexical/BM25 rows searchable before vectors finish; `moveReconciled` > 0 when a tracked file moved; no duplicate active logical-key rows (mig 28); response carries `moveReconciled`, `staleDeleted`, orphan-sweep, and `checkpointRepair` counts.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if lexical-first availability, move reconciliation, active-row uniqueness, and repair counts all hold.

---

## 3. TEST EXECUTION

### Prompt

```
As a maintenance validation operator, validate phased-async indexing against memory_index_scan while embeddings are still draining. Verify a completed scan can report status complete_with_pending_vectors with a non-zero pendingVectors and that BM25/FTS rows are searchable before the vectors finish. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_index_scan(force:false) after saving documents whose vectors are still draining.
2. memory_search against a just-saved document to confirm lexical hits return before vector drain completes.

### Expected

The scan commits lexical rows first; when vectors are still draining the scan returns `status: complete_with_pending_vectors` with a non-zero `pendingVectors` count, and the just-saved document is already returned by lexical/BM25 search.

### Evidence

Scan response showing `complete_with_pending_vectors` and `pendingVectors`; a search transcript proving lexical availability during drain.

### Pass / Fail

- **Pass**: lexical rows are searchable while `pendingVectors` is non-zero and status is `complete_with_pending_vectors`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect the `deferred`/`pendingVectors` handling and the `complete_with_pending_vectors` status in `mcp_server/handlers/memory-index.ts` if lexical rows are not searchable until vectors finish.

---

### Prompt

```
As a maintenance validation operator, validate move reconciliation against memory_index_scan after a sibling spec-folder rename (only the immediate folder name changes within the same parent). Verify the scan matches the vanished path to the new path when both delete and index candidate sets exist, the new graph-metadata.json carries a packet_id, the basename is unchanged, the grandparent directory is the same, and exactly one live old row matches — then updates the row in place (moveReconciled > 0) without delete-then-reindex. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Rename a tracked spec folder in place (e.g. `012-old` -> `012-new`) so its docs keep the same basename and grandparent and the new graph-metadata.json keeps the same packet_id; this produces both a vanished old path and a new path in one scan.
2. memory_index_scan(force:false) and capture `moveReconciled`.
3. Confirm the single live old row was updated in place (not re-embedded from scratch).

### Expected

The scan reconciles the move before any delete+reindex cycle, but only under the narrow guard: both the delete and index candidate sets are non-empty, the new graph-metadata.json carries a `packet_id`, the old and new paths share the same basename and the same grandparent directory (a sibling folder rename), and exactly one live (non-failed) old row matches. When all hold, the row is updated in place, `moveReconciled` is non-zero, and the content is not re-embedded.

### Evidence

Scan response `moveReconciled` count and confirmation the row kept its identity.

### Pass / Fail

- **Pass**: the moved file is reconciled in place with `moveReconciled` > 0 and no re-embedding
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `reconcileMoves` usage in `mcp_server/handlers/memory-index.ts` (move reconciliation before delete+reindex) if a moved file is deleted and re-embedded instead of reconciled.

---

### Prompt

```
As a maintenance validation operator, validate the migration-28 active-row uniqueness guard against a reindex. Verify at most one non-deprecated, non-constitutional row exists per logical key (spec_folder + canonical path + anchor + scope), and that the scan response surfaces repair counts (moveReconciled, staleDeleted, orphan-sweep, checkpointRepair). Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. memory_index_scan(force:true) on a sandbox workspace.
2. Confirm no duplicate active logical-key rows exist (the unique index `idx_memory_logical_key_active_unique`).
3. Capture the repair counts in the scan response.

### Expected

The migration-28 partial unique index keeps at most one active (non-deprecated, non-constitutional) row per logical key; deprecated predecessors are retired by tier, not deleted; constitutional rows are exempt. The scan response carries `moveReconciled`, `staleDeleted`, orphan-sweep counts, and the `checkpointRepair` report.

### Evidence

The active-row uniqueness check plus the scan response repair counts.

### Pass / Fail

- **Pass**: no duplicate active logical-key rows and the response surfaces the repair counts
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect migration v28 (`idx_memory_logical_key_active_unique`) in `mcp_server/lib/search/vector-index-schema.ts` if duplicate active rows appear, and the results assembly in `mcp_server/handlers/memory-index.ts` if the repair counts are missing.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- index_scan handler: `mcp_server/handlers/memory-index.ts` (phased-async `deferred`/`pendingVectors`/`complete_with_pending_vectors`, `reconcileMoves`, repair counts)
- Active-row uniqueness: `mcp_server/lib/search/vector-index-schema.ts` (migration v28 `idx_memory_logical_key_active_unique`)
- Move reconciliation: `mcp_server/lib/storage/incremental-index.ts` (`reconcileMoves`)

---

## 5. SOURCE METADATA

- Group: Maintenance
- Playbook ID: EX-039
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--maintenance/index-scan-phased-async-refinements.md`
- Source anchors read: `mcp_server/handlers/memory-index.ts` (move reconciliation ~L664-672, `moveReconciled` field ~L142, `complete_with_pending_vectors`/`pendingVectors` ~L987-988, `checkpointRepair`/`staleDeleted`/orphan-sweep counts ~L135-161/L383); `mcp_server/lib/search/vector-index-schema.ts` (migration v28 `idx_memory_logical_key_active_unique` ~L1336-1365)
- Destructive: No — sandbox workspace reindex.
- Runtime policy: Real execution only; no mocked scan.
