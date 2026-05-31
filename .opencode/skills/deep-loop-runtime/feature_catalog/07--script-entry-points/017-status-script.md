---
title: "status.cjs"
description: "Reports session-scoped coverage graph health, counts, schema version, and current signals."
trigger_phrases:
  - "status.cjs"
  - "deep_loop_graph_status"
  - "report graph health"
  - "coverage graph schema version"
  - "graph counts and signals"
---

# status.cjs

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Reports session-scoped coverage graph health, counts, schema version, and current signals.

This feature belongs to the script entry points group and is catalogued as F017 in the `deep-loop-runtime` inventory.

---

## 2. HOW IT WORKS

Direct replacement for `deep_loop_graph_status`; reports counts, schema, DB size, and signals.

The implementation is source-backed and covered by runtime-owned tests under `.opencode/skills/deep-loop-runtime/tests/`. Treat this as shipped behavior, not a roadmap claim.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/status.cjs` | Runtime | Direct replacement for `deep_loop_graph_status`; reports counts, schema, DB size, and signals. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `tests/integration/status-script.vitest.ts` | Test | Primary regression coverage for status.cjs. |
| `tests/lifecycle/db-open-close.vitest.ts` | Lifecycle | DB close behavior after script calls. |

---

## 4. SOURCE METADATA

- Group: Script entry points
- Canonical catalog source: `feature_catalog.md`
- Feature ID: F017
- Feature file path: `07--script-entry-points/017-status-script.md`
- Primary sources: `scripts/status.cjs`, `tests/integration/status-script.vitest.ts`
Related references:
- [016-query-script.md](016-query-script.md) — query.cjs
