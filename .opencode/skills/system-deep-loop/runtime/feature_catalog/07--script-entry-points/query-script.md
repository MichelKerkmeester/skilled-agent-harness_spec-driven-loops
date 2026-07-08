---
title: "query.cjs"
description: "Reads session-scoped coverage graph views through a direct JSON stdout script interface."
trigger_phrases:
  - "query.cjs"
  - "deep_loop_graph_query"
  - "read coverage graph views"
  - "session-scoped graph query"
  - "gaps claims contradictions provenance"
version: 1.4.0.4
---

# query.cjs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Reads session-scoped coverage graph views through a direct JSON stdout script interface.

This feature belongs to the script entry points group and is catalogued as F016 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Direct replacement for `deep_loop_graph_query`; serves gaps, claims, contradictions, provenance, and hot nodes.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/query.cjs` | Runtime | Direct replacement for `deep_loop_graph_query`; serves gaps, claims, contradictions, provenance, and hot nodes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/query-script.vitest.ts` | Test | Primary regression coverage for query.cjs. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F016
- Feature file path: `07--script-entry-points/query-script.md`
- Primary sources: `scripts/query.cjs`, `tests/integration/query-script.vitest.ts`
Related references:
- [upsert-script.md](upsert-script.md) — upsert.cjs
- [status-script.md](status-script.md) — status.cjs
