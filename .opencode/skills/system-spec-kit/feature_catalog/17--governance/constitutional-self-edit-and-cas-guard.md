---
title: "Constitutional self-edit and compare-and-swap guard"
description: "Tracks the memory_update guard that rejects edits removing a constitutional row's own protection and rejects stale-read overwrites via an optional expectedHash compare-and-swap."
trigger_phrases:
  - "constitutional self edit guard"
  - "constitutional cas guard"
  - "expectedHash compare and swap"
  - "E_CONSTITUTIONAL_SELF_EDIT"
  - "E_STALE_CONSTITUTIONAL_UPDATE"
version: 3.6.0.1
---

# Constitutional self-edit and compare-and-swap guard

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the `memory_update` guard that rejects edits removing a constitutional row's own protection and rejects stale-read overwrites via an optional `expectedHash` compare-and-swap.

A constitutional memory cannot quietly strip its own protection or be overwritten from a stale read. Non-constitutional updates are unaffected.

---

## 2. HOW IT WORKS

`validateConstitutionalEditPreconditions` runs on the `memory_update` path when the existing row is constitutional (by tier or by constitutional path). An unconditional assertion rejects any edit that sets `importanceTier` to a non-constitutional value on that row and returns `E_CONSTITUTIONAL_SELF_EDIT`.

The optional `expectedHash` tool parameter adds a compare-and-swap precondition: when supplied, it must match the row's current `content_hash` or the update is rejected with `E_STALE_CONSTITUTIONAL_UPDATE`. The non-constitutional update path stays byte-identical and `expectedHash` is an additive optional schema field, so existing callers are unchanged. Both refusals carry a recovery hint pointing at a reviewed source row or an explicit repair workflow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Self-edit assertion and `expectedHash` compare-and-swap precondition |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | Update args type carrying `expectedHash` |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Additive optional `expectedHash` field on `memory_update` |
| `mcp_server/tools/types.ts` | Tool | Tool surface type for the new optional parameter |
| `mcp_server/tool-schemas.ts` | Tool | Public tool schema re-export |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Automated test | Self-edit refusal, stale-hash refusal, and matching-hash safe-update cases |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/constitutional-self-edit-and-cas-guard.md`
Related references:
- [automated-writers-never-overwrite-manual-constitutional-rule.md](automated-writers-never-overwrite-manual-constitutional-rule.md) — Automated writers never overwrite manual constitutional rule
