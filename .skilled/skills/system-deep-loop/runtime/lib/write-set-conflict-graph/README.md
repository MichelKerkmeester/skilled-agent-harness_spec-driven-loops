---
title: "Write-Set Conflict Graph"
description: "Derives a deterministic conflict graph over the resources shipped deep-loop modes declare, then schedules non-conflicting work into ordered lanes."
---

# Write-Set Conflict Graph

---

## 1. OVERVIEW

Works out which parts of a run can safely happen at the same time. Each shipped mode declares the resources it reads or writes, such as files, state, locks or backends. Aliased identities are canonicalized to one resource id. The graph derivation turns overlapping declarations into conflict edges. A deterministic scheduler then groups the graph into ordered lanes so independent work can run in parallel while conflicting work stays ordered. The artifact builder enumerates every workstream pair and emits canonical JSON bytes with a trailing newline.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `artifact.ts` | Builds the complete pair-classification map and emits byte-canonical JSON |
| `canonicalize.ts` | Normalizes resource identities and resolves alias groups to one canonical id |
| `errors.ts` | Validation error codes for the conflict-graph builder |
| `graph.ts` | Derives the conflict graph and validates it for manifest reuse |
| `index.ts` | Public API surface |
| `scheduler.ts` | Turns the conflict graph into a deterministic multi-lane execution schedule |
| `shipped-census.ts` | Declared resource census for the shipped deep-loop modes |
| `stable-digest.ts` | Canonical stringify and sha256 digest helpers with stable key ordering |
| `types.ts` | Resource kind, edge, schedule and workstream type contracts |

`derivedConflictEdges` in `graph.ts` runs to about 210 lines. It was reviewed and kept whole: its edges decide the canonical artifact bytes, so a split risks changing that output with no defect to fix. The checklists set no length limit, and no defect was found in it.

---

## 3. CONSUMERS

No sibling `runtime/lib` domain imports this yet. It has no cross-domain dependencies beyond Node's `path` and `crypto` modules.

---

## 4. TESTS

- `../../tests/unit/write-set-conflict-graph.vitest.ts`

---

## 5. RELATED

- [`../../../SKILL.md`](../../../SKILL.md)
