---
title: "Entity co-occurrence is not causal constitutional rule"
description: "Kept unindexed reference doc that separates entity/co-occurrence recall evidence from causal truth in generated graph behavior."
trigger_phrases:
  - "entity co-occurrence is not causal constitutional rule"
  - "entity-cooccurrence-is-not-causal"
  - "cooccurrence is not causation"
  - "causal graph provenance rule"
version: 3.6.0.1
---

# Entity co-occurrence is not causal constitutional rule

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This kept reference rule states that entity overlap and co-occurrence are recall evidence, not causal truth.

It protects the causal graph from promoting similarity or entity co-location into causation unless the edge comes from explicit authored lineage or a validated causal promoter.

---

## 2. HOW IT WORKS

The rule file is kept as a plain unindexed reference doc in the constitutional reference directory. It tells agents to treat entity and co-occurrence signals as evidence for retrieval, triage, or candidate generation only.

The rule complements generated-edge provenance: frontmatter-derived edges carry explicit extraction method and confidence, while similarity-derived support edges remain opt-in and should not be reported as causal lineage without that provenance.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| (rule file removed) | Retired with the constitutional layer | Guidance now lives in the root instruction docs |
| `mcp-server/lib/causal/frontmatter-promoter.ts` | Shared | Validated metadata-derived edge promoter |
| `mcp-server/lib/storage/causal-edges.ts` | Shared | Generated-edge provenance storage |
| `mcp-server/lib/causal/sweep.ts` | Shared | Tombstone restore metadata with provenance |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/frontmatter-promoter.vitest.ts` | Automated test | Generated edge provenance and manual preservation |
| `mcp-server/tests/causal-edges-write-safety.vitest.ts` | Automated test | Causal edge write safety coverage |
| `mcp-server/tests/causal-edge-tombstones.vitest.ts` | Automated test | Tombstone provenance coverage |

---

## 4. SOURCE METADATA

- Group: Governance
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `governance/entity-cooccurrence-is-not-causal-constitutional-rule.md`

Related references:
- [automated-writers-never-overwrite-manual-constitutional-rule.md](../../feature-catalog/governance/automated-writers-never-overwrite-manual-constitutional-rule.md) - Companion retained reference rule
- [constitutional-gate-enforcement-rule-pack.md](../../feature-catalog/governance/constitutional-gate-enforcement-rule-pack.md) - Retained rule-pack history
