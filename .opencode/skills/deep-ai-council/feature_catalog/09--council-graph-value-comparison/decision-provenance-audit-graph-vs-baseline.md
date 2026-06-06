---
title: "Decision provenance audit: graph vs baseline"
description: "Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision."
trigger_phrases:
  - "decision provenance audit graph vs baseline"
  - "getDecisionSupport"
  - "trace council decision evidence"
  - "decision provenance graph"
  - "why did council recommend plan"
---

# Decision provenance audit: graph vs baseline

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision.

When a stakeholder, reviewer, or post-mortem asks "why did the council recommend Plan B?", the answer must be traceable to specific evidence and seat claims.

Operators use this feature when the real request is: Tell me exactly what evidence supported choosing Plan B in this council session.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-028.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`, covering automated test name: dac-028 graph beats no-graph baseline.

The user-visible contract is concrete: Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Handler | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | `getDecisionSupport` helper |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md 3` | Reference | Documents SUPPORTS / PROPOSES / RECOMMENDS edges |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Automated test | Automated test name: DAC-028 graph beats no-graph baseline |

---

## 4. SOURCE METADATA
- Group: Council Graph Value Comparison
- Feature ID: DAC-028
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md`
- Playbook scenario: `manual_testing_playbook/09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md`
Related references:
- [unresolved-disagreement-triage-graph-vs-baseline.md](unresolved-disagreement-triage-graph-vs-baseline.md) — Unresolved disagreement triage: graph vs baseline
- [convergence-safety-under-critical-disagreement-graph-vs-baseline.md](convergence-safety-under-critical-disagreement-graph-vs-baseline.md) — Convergence safety under critical disagreement
