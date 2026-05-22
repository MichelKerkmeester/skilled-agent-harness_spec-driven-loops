---
title: "Coverage graph DB"
description: "Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle."
---

# Coverage graph DB

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Owns the SQLite schema, namespace scoping, node and edge mutations, snapshots, and connection lifecycle.

This feature belongs to the coverage graph group and is catalogued as F011 in the `deep-loop-runtime` inventory.

---

## 2. CURRENT REALITY

Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `lib/coverage-graph/coverage-graph-db.ts` | Runtime | Schema v2, node and edge CRUD, snapshots, stats, composite namespace keys, and DB lifecycle. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/lifecycle/db-open-close.vitest.ts` | Test | Primary regression coverage for Coverage graph DB. |
| `tests/integration/upsert-script.vitest.ts` | Integration | Storage behavior through public script. |
| `tests/integration/review-depth-graph.vitest.ts` | Integration | Review graph fixture coverage. |

---

## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F011
- Feature file path: `06--coverage-graph/01-coverage-graph-db.md`
- Primary sources: `lib/coverage-graph/coverage-graph-db.ts`, `tests/lifecycle/db-open-close.vitest.ts`

