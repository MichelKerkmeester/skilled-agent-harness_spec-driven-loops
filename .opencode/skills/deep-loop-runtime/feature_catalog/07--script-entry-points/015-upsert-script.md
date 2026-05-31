---
title: "upsert.cjs"
description: "Stores coverage graph nodes and edges from JSON arrays or iteration graph event files."
trigger_phrases:
  - "upsert.cjs"
  - "deep_loop_graph_upsert"
  - "upsert graph nodes edges"
  - "iteration graph event file"
  - "store coverage graph records"
---

# upsert.cjs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Stores coverage graph nodes and edges from JSON arrays or iteration graph event files.

This feature belongs to the script entry points group and is catalogued as F015 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/upsert.cjs` | Runtime | Direct replacement for `deep_loop_graph_upsert`; validates kinds, relations, and self-loops. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/upsert-script.vitest.ts` | Test | Primary regression coverage for upsert.cjs. |
| `tests/integration/review-depth-graph.vitest.ts` | Integration | Graph event fixture coverage. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F015
- Feature file path: `07--script-entry-points/015-upsert-script.md`
- Primary sources: `scripts/upsert.cjs`, `tests/integration/upsert-script.vitest.ts`
Related references:
- [014-convergence-script.md](014-convergence-script.md) — convergence.cjs
- [016-query-script.md](016-query-script.md) — query.cjs
