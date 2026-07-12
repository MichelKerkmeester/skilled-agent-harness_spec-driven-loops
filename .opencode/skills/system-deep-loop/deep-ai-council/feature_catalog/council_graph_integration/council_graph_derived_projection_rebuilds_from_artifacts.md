---
title: "Derived projection rebuilds from artifacts"
description: "Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts."
trigger_phrases:
  - "derived projection rebuilds from artifacts"
  - "council-graph-db namespace delete"
  - "rebuild council graph from artifacts"
  - "derived projection replay"
  - "append-only council audit history"
version: 2.3.0.11
---

# Derived projection rebuilds from artifacts

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts.

ADR-001 explicitly chose a derived projection over deep-loop graph reuse precisely so council audit history (in ai-council-state.jsonl and packet artifacts) stays append-only and trustworthy.

Operators use this feature when the real request is: Wipe the council graph for one session and rebuild it from the council artifacts; confirm artifacts are untouched.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime status CLI`, `deep-ai-council`. The playbook scenario `council-graph-integration/council-graph-derived-projection-rebuilds-from-artifacts.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-025.

Current behavior is grounded in internal design notes for adr-001 derived-projection contract. Validation is anchored by `manual_testing_playbook/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| Internal design notes | Spec | ADR-001 derived-projection contract |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md 5` | Reference | Recovery and rollback contract |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-db.ts` | Library | Namespace-scoped delete + upsert |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md` | Automated test | Manual scenario contract |
| Internal design notes | Automated test | CHK-028 rollback path |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-025
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md`
- Playbook scenario: `manual_testing_playbook/council_graph_integration/council_graph_derived_projection_rebuilds_from_artifacts.md`
Related references:
- [council-graph-status-recovery-payload-and-readiness.md](../council_graph_integration/council_graph_status_recovery_payload_and_readiness.md) — runtime status CLI recovery payload and readiness
- [council-graph-tools-registered-separately-from-deep-loop.md](../council_graph_integration/council_graph_tools_registered_separately_from_deep_loop.md) — Council graph MCP surface retired
