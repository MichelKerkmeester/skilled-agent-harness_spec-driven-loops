---
title: "Derived projection rebuilds from artifacts"
description: "Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts."
---

# Derived projection rebuilds from artifacts

## 1. OVERVIEW

Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts.

ADR-001 explicitly chose a derived projection over deep-loop graph reuse precisely so council audit history (in ai-council-state.jsonl and packet artifacts) stays append-only and trustworthy.

Operators use this feature when the real request is: Wipe the council graph for one session and rebuild it from the council artifacts; confirm artifacts are untouched.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `runtime upsert CLI`, `runtime status CLI`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-025.

Current behavior is grounded in internal design notes for adr-001 derived-projection contract. Validation is anchored by `manual_testing_playbook/08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify deleting derived graph rows for one session and replaying from artifacts restores graph state without modifying artifacts. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| Internal design notes | Spec | ADR-001 derived-projection contract |
| `.opencode/skills/deep-ai-council/references/graph_support.md 5` | Reference | Recovery and rollback contract |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Library | Namespace-scoped delete + upsert |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md` | Manual scenario contract |
| Internal design notes | CHK-028 rollback path |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-025
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/07-council-graph-derived-projection-rebuilds-from-artifacts.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/007-council-graph-derived-projection-rebuilds-from-artifacts.md`
