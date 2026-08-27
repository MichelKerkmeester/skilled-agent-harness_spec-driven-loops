---
title: "Automated writers never overwrite manual constitutional rule"
description: "Kept unindexed reference doc that reminds automated writers not to overwrite protected manual or rule content, backed by write-ingress provenance guards."
trigger_phrases:
  - "automated writers never overwrite manual constitutional rule"
  - "automated-writers-never-overwrite-manual"
  - "protected manual overwrite guard"
  - "constitutional automated writer rule"
version: 3.6.0.1
---

# Automated writers never overwrite manual constitutional rule

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This kept reference rule states that automated writers must not overwrite protected manual or rule material.

It is an advisory reference, but it is paired with executable write-ingress behavior: source kind is derived server-side and automated updates skip protected fields before mutation.

---

## 2. HOW IT WORKS

The rule file is kept as a plain unindexed reference doc under the system-spec-kit constitutional reference directory. It gives agents and operators a durable reminder that human-authored or rule truth requires explicit human authority to replace.

The runtime guard derives provenance from server context and rejects forged provenance fields. Automated updates can still write safe fields, but protected manual or rule fields are skipped and surfaced as a guarded-write hint instead of being silently overwritten.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| (rule file removed) | Retired with the constitutional layer | Guidance now lives in the root instruction docs |
| `mcp-server/handlers/memory-crud-update.ts` | Handler | Guarded update parameters and forged-provenance rejection |
| `mcp-server/handlers/save/create-record.ts` | Handler | Server-derived source kind persistence |
| `mcp-server/lib/search/vector-index-schema.ts` | Shared | source_kind storage and backfill |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Automated test | Protected field skip and human-write allowance coverage |
| `mcp-server/tests/gate-d-regression-constitutional-memory.vitest.ts` | Automated test | Constitutional loader regression coverage |
| `mcp-server/tests/create-record-identity.vitest.ts` | Automated test | Create-path identity/provenance coverage |

---

## 4. SOURCE METADATA

- Group: Governance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `governance/automated-writers-never-overwrite-manual-constitutional-rule.md`

Related references:
- [constitutional-gate-enforcement-rule-pack.md](../../feature-catalog/governance/constitutional-gate-enforcement-rule-pack.md) - Retained rule-pack history
- [hierarchical-scope-governance-governed-ingest-retention-and-audit.md](../../feature-catalog/governance/hierarchical-scope-governance-governed-ingest-retention-and-audit.md) - Governed ingest and audit
