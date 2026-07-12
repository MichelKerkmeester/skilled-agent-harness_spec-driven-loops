---
title: "runtime query CLI five modes return prompt-safe context"
description: "Verify all 5 documented runtime query CLI modes return prompt-safe bounded context."
trigger_phrases:
  - "runtime query cli five modes return prompt-safe context"
  - "query.cjs per-mode dispatch"
  - "council graph query modes"
  - "five query views council graph"
  - "prompt-safe bounded context query"
version: 2.3.0.10
---

# runtime query CLI five modes return prompt-safe context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify all 5 documented runtime query CLI modes return prompt-safe bounded context.

The query surface is the council synthesis caller's primary handle into derived graph state.

Operators use this feature when the real request is: Show me each query view the council graph supports against a fully-populated session.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-022.

Current behavior is grounded in `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script: per-mode dispatch. Validation is anchored by `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Verify all 5 documented runtime query CLI modes return prompt-safe bounded context. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Handler | runtime CLI script: per-mode dispatch |
| `.opencode/skills/system-deep-loop/runtime/lib/council/council-graph-query.ts` | Library | Per-mode query helpers |
| `.opencode/skills/system-deep-loop/runtime/scripts/query.cjs` | Runtime CLI | Query-type dispatch for all five council modes |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/graph_support.md` | Reference | Documents the five query modes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md` | Automated test | Manual scenario contract |
| `.opencode/skills/system-deep-loop/runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-022
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md`
- Playbook scenario: `manual_testing_playbook/council_graph_integration/council_graph_query_five_modes_prompt_safe_context.md`
Related references:
- [council-graph-query-hostile-metadata-redaction.md](../council_graph_integration/council_graph_query_hostile_metadata_redaction.md) — runtime query CLI hostile metadata redaction
- [council-graph-convergence-three-state-decision-matrix.md](../council_graph_integration/council_graph_convergence_three_state_decision_matrix.md) — runtime convergence CLI three-state decision matrix
