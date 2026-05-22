---
title: "query.cjs"
description: "Reads session-scoped coverage graph views through a direct JSON stdout script interface."
---

# query.cjs

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Reads session-scoped coverage graph views through a direct JSON stdout script interface.

This feature belongs to the script entry points group and is catalogued as F016 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

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
- Feature file path: `07--script-entry-points/03-query-script.md`
- Primary sources: `scripts/query.cjs`, `tests/integration/query-script.vitest.ts`

