---
title: "Checkpoint delete confirmName safety"
description: "Checkpoint delete confirmName safety requires a matching `confirmName` parameter before destructive checkpoint deletion proceeds."
trigger_phrases:
  - "checkpoint delete confirmname safety"
  - "confirmName"
  - "destructive checkpoint deletion"
  - "checkpoint deletion safety"
  - "delete confirmation guard"
version: 3.6.0.16
---

# Checkpoint delete confirmName safety

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Checkpoint delete confirmName safety requires a matching `confirmName` parameter before destructive checkpoint deletion proceeds.

Deleting a saved checkpoint is permanent, so this feature adds a safety step: you must type the exact name of the checkpoint you want to delete before the system will proceed. It works like those confirmation dialogs that ask you to type "DELETE" before erasing something important, preventing accidental data loss from a careless click.

---

## 2. HOW IT WORKS

Checkpoint deletion now requires a matching `confirmName` safety parameter before destructive action proceeds. The finalized follow-up pass enforced that requirement across handler, schema, tool-schema and tool-type layers so callers cannot bypass it through a looser boundary. Successful deletion responses also report the confirmation outcome through `safetyConfirmationUsed=true` plus deletion metadata.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/handlers/checkpoints.ts` | Handler | Checkpoint handler enforcing required `confirmName` and delete safety semantics |
| `mcp-server/schemas/tool-input-schemas.ts` | Schema | Zod schemas requiring `confirmName` for checkpoint deletion |
| `mcp-server/tool-schemas.ts` | Core | Published tool schema shape for checkpoint delete inputs |
| `mcp-server/lib/storage/checkpoints.ts` | Lib | Checkpoint storage layer executing the deletion |
| `mcp-server/handlers/types.ts` | Handler | Type definitions including checkpoint handler contracts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/handler-checkpoints.vitest.ts` | Automated test | `confirmName` validation and checkpoint-delete contract coverage |
| `mcp-server/tests/checkpoints-extended.vitest.ts` | Automated test | Checkpoint extended scenarios including delete safety |
| `mcp-server/tests/checkpoints-storage.vitest.ts` | Automated test | Checkpoint storage layer tests |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/checkpoint-delete-confirmname-safety.md`
Related references:
- [memory-health-autorepair-metadata.md](../../feature-catalog/ux-hooks/memory-health-autorepair-metadata.md) — Memory health autoRepair metadata
- [schema-and-type-contract-synchronization.md](../../feature-catalog/ux-hooks/schema-and-type-contract-synchronization.md) — Schema and type contract synchronization
