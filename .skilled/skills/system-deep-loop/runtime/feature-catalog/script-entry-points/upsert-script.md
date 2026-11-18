---
title: "upsert.cjs"
description: "Stores coverage graph nodes and edges from JSON arrays or iteration graph event files, and derives review finding evidence from an iteration's state log and delta."
trigger_phrases:
  - "upsert.cjs"
  - "deep_loop_graph_upsert"
  - "upsert graph nodes edges"
  - "iteration graph event file"
  - "store coverage graph records"
version: 1.4.2.0
---

# upsert.cjs

---

## 1. OVERVIEW

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files, and derives review finding evidence from an iteration's state log and delta.

This feature belongs to the script entry points group and is catalogued as F015 in the `runtime/` inventory.

---

## 2. HOW IT WORKS

Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops.

### Review Finding Evidence

A review upsert can take `--state-log`, `--delta-dir` and `--iteration`. `readReviewIterationFindings` reads the iteration's `finding` rows from `{delta-dir}/iter-NNN.jsonl` and the `findingDetails` of that iteration's record in the state log, one entry per finding id. A missing delta file reads as no rows. A missing or unreadable state log is an input error.

`deriveReviewFindingEvidence` turns each finding into one FINDING node. When the finding's `file` parses as a `path:line` ref through `parseFindingRef`, it also adds a FILE node for that path and an EVIDENCE_FOR edge from the finding to the file. A bare path with no line adds no edge, and a trailing column or range is dropped. A derived node never overwrites a node the leaf sent or the graph already stores.

Finding ids are unique only per source. When an earlier iteration stored the same id for a finding with a different file and a different title, the new node is keyed `finding:{id}#{iteration}`, so the two findings stay apart.

With `--state-log` or `--delta-dir` set, `resolveReviewFindingId` folds a leaf-sent FINDING node id onto the node the finding is stored under. It accepts the bare id and prefixed forms such as `finding-`, `FIND-` and `node:finding:`, in any case. Edge endpoints that name a known finding fold the same way. The iteration's own findings register before the stored ones, so when a reused id was split to `finding:{id}#{iteration}`, the leaf's FINDING node and every edge that names that id land on the new split node, not on the earlier finding. A leaf finding node that folds onto a finding this iteration derived keeps its own metadata keys and gains the derived `finding_id`, `file` and `line` it left out, so a later reused-id check can still compare files.

### Input Guards

The three flags are review-only. Each guard throws an INPUT_VALIDATION error, which exits 3: the flags on another loop type, `--state-log` or `--delta-dir` without a path, `--iteration` without `--state-log` or `--delta-dir`, and an `--iteration` that is not a positive integer.

### Orphan Edges

On every upsert, an edge whose source or target is declared neither in the batch nor in the stored graph is dropped before the write, because it would fail the foreign key and roll back the batch. The output lists the dropped edge ids in `rejectedOrphanEdges` when there are any, and stderr names them.

The research SOURCE `quality_class` derivation is described in [source-quality-class.md](../coverage-graph/source-quality-class.md).

The implementation is source-backed and covered by runtime-owned tests under `.skilled/skills/system-deep-loop/runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/upsert.cjs` | Runtime | Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops. Review finding evidence via `readReviewIterationFindings`, `deriveReviewFindingEvidence`, `parseFindingRef` and `resolveReviewFindingId`; orphan-edge skip into `rejectedOrphanEdges`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/upsert-script.vitest.ts` | Automated test | Primary regression coverage for upsert.cjs. |
| `tests/integration/review-depth-graph.vitest.ts` | Integration | Graph event fixture coverage. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `script-entry-points/upsert-script.md`
- Primary sources: `scripts/upsert.cjs`, `tests/integration/upsert-script.vitest.ts`
Related references:
- [convergence-script.md](../../feature-catalog/script-entry-points/convergence-script.md) — convergence.cjs
- [query-script.md](../../feature-catalog/script-entry-points/query-script.md) — query.cjs
