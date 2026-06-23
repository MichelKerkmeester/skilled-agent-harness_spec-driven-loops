---
title: "Entity co-occurrence is not causal constitutional rule"
description: "Advisory constitutional memory that separates entity/co-occurrence recall evidence from causal truth in generated graph behavior."
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

This constitutional rule states that entity overlap and co-occurrence are recall evidence, not causal truth.

It protects the causal graph from promoting similarity or entity co-location into causation unless the edge comes from explicit authored lineage or a validated causal promoter.

---

## 2. HOW IT WORKS

The rule file lives in the constitutional memory pack and surfaces with the rest of the always-surface governance rules. It tells agents to treat entity and co-occurrence signals as evidence for retrieval, triage, or candidate generation only.

The rule complements generated-edge provenance: frontmatter-derived edges carry explicit extraction method and confidence, while similarity-derived support edges remain opt-in and should not be reported as causal lineage without that provenance.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md` | Constitutional memory | Advisory rule file |
| `mcp_server/lib/causal/frontmatter-promoter.ts` | Shared | Validated metadata-derived edge promoter |
| `mcp_server/lib/storage/causal-edges.ts` | Shared | Generated-edge provenance storage |
| `mcp_server/lib/causal/sweep.ts` | Shared | Tombstone restore metadata with provenance |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/frontmatter-promoter.vitest.ts` | Automated test | Generated edge provenance and manual preservation |
| `mcp_server/tests/causal-edges-write-safety.vitest.ts` | Automated test | Causal edge write safety coverage |
| `mcp_server/tests/causal-edge-tombstones.vitest.ts` | Automated test | Tombstone provenance coverage |

---

## 4. SOURCE METADATA

- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/entity-cooccurrence-is-not-causal-constitutional-rule.md`

Related references:
- [automated-writers-never-overwrite-manual-constitutional-rule.md](automated-writers-never-overwrite-manual-constitutional-rule.md) - Companion constitutional rule
- [constitutional-gate-enforcement-rule-pack.md](constitutional-gate-enforcement-rule-pack.md) - Constitutional memory rule pack
