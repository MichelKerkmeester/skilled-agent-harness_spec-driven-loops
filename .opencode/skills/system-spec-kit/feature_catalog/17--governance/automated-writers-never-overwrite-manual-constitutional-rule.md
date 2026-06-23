---
title: "Automated writers never overwrite manual constitutional rule"
description: "Advisory constitutional memory that keeps automated writers from overwriting protected manual or constitutional content, backed by write-ingress provenance guards."
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

This constitutional rule states that automated writers must not overwrite protected manual or constitutional material.

It is advisory memory, but it is paired with executable write-ingress behavior: source kind is derived server-side and automated updates skip protected fields before mutation.

---

## 2. HOW IT WORKS

The rule file lives in the system-spec-kit constitutional memory pack and is indexed through the existing always-surface constitutional loader. It gives agents and operators a durable reminder that human-authored or constitutional truth requires explicit human authority to replace.

The runtime guard derives provenance from server context and rejects forged provenance fields. Automated updates can still write safe fields, but protected manual or constitutional fields are skipped and surfaced as a guarded-write hint instead of being silently overwritten.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/constitutional/automated-writers-never-overwrite-manual.md` | Constitutional memory | Advisory rule file |
| `mcp_server/handlers/memory-crud-update.ts` | Handler | Guarded update parameters and forged-provenance rejection |
| `mcp_server/handlers/save/create-record.ts` | Handler | Server-derived source kind persistence |
| `mcp_server/lib/search/vector-index-schema.ts` | Shared | source_kind storage and backfill |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | Automated test | Protected field skip and human-write allowance coverage |
| `mcp_server/tests/gate-d-regression-constitutional-memory.vitest.ts` | Automated test | Constitutional loader regression coverage |
| `mcp_server/tests/create-record-identity.vitest.ts` | Automated test | Create-path identity/provenance coverage |

---

## 4. SOURCE METADATA

- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/automated-writers-never-overwrite-manual-constitutional-rule.md`

Related references:
- [constitutional-gate-enforcement-rule-pack.md](constitutional-gate-enforcement-rule-pack.md) - Constitutional memory rule pack
- [hierarchical-scope-governance-governed-ingest-retention-and-audit.md](hierarchical-scope-governance-governed-ingest-retention-and-audit.md) - Governed ingest and audit
