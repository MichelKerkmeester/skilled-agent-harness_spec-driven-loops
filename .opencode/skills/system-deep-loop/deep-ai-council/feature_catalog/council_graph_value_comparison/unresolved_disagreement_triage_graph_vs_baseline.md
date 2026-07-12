---
title: "Unresolved disagreement triage: graph vs baseline"
description: "Demonstrate measurable effort reduction between no-graph baseline and graph-driven workflow for finding unresolved critical disagreements."
trigger_phrases:
  - "unresolved disagreement triage graph vs baseline"
  - "getUnresolvedDisagreements"
  - "find critical disagreements council"
  - "graph-driven disagreement triage"
  - "unresolved council disagreements after rounds"
version: 2.3.0.10
---

# Unresolved disagreement triage: graph vs baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate measurable effort reduction between no-graph baseline and graph-driven workflow for finding unresolved critical disagreements.

Council deliberation produces 5+ artifacts per seat per round.

Operators use this feature when the real request is: After this 3-round council finishes, give me the critical disagreements that never got resolved.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-027.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script for `runtime query CLI`. Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts`, covering "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Demonstrate measurable effort reduction between no-graph baseline and graph-driven workflow for finding unresolved critical disagreements. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Handler | runtime CLI script for `runtime query CLI` |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts` | Library | `getUnresolvedDisagreements` helper |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md 3` | Reference | Documents the RESOLVES edge contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-027 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-027
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md`
- Playbook scenario: `manual_testing_playbook/council_graph_value_comparison/unresolved_disagreement_triage_graph_vs_baseline.md`
Related references:
- [decision-provenance-audit-graph-vs-baseline.md](../council_graph_value_comparison/decision_provenance_audit_graph_vs_baseline.md) — Decision provenance audit: graph vs baseline
