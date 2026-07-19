---
title: "Atomic Lifecycle Rollback"
description: "Atomic rollback of lifecycle metadata mutations (supersession, archive status, schema version) that leaves no partial state observable."
trigger_phrases:
  - "lifecycle rollback"
  - "atomic rollback lifecycle"
  - "supersession rollback"
  - "lifecycle revert"
version: 0.8.0.14
---

# Atomic Lifecycle Rollback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Keep lifecycle mutations reversible so operators can experiment with supersession, archival and schema changes without fear of leaving the routing surface in a half-applied state.

## 2. HOW IT WORKS

`lib/lifecycle/rollback.ts` reverts lifecycle metadata changes atomically. It coordinates with `lib/lifecycle/supersession.ts` and `lib/lifecycle/archive-handling.ts` so that redirect metadata, derived entries and archive classification all snap back together. Readers never observe a partial rollback. Either the rollback commits fully or the prior state remains in effect.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/rollback.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/supersession.ts` | Library | Source reference |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/archive-handling.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp-server/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | rollback invariants |
| `Playbook scenario [LC-005](../../manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md).` | Manual playbook | Source reference |

## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lifecycle-routing/rollback.md`

Related references:

- [04-schema-migration.md](../../feature-catalog/lifecycle-routing/schema-migration.md).
- [02-supersession.md](./supersession.md).
