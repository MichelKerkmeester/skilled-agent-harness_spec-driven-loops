---
title: "runtime query CLI five modes return prompt-safe context"
description: "Verify all 5 documented runtime query CLI modes return prompt-safe bounded context."
trigger_phrases:
  - "runtime query cli five modes return prompt-safe context"
  - "query.cjs per-mode dispatch"
  - "council graph query modes"
  - "five query views council graph"
  - "prompt-safe bounded context query"
---

# runtime query CLI five modes return prompt-safe context

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify all 5 documented runtime query CLI modes return prompt-safe bounded context.

The query surface is the council synthesis caller's primary handle into derived graph state.

Operators use this feature when the real request is: Show me each query view the council graph supports against a fully-populated session.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `runtime upsert CLI`, `runtime query CLI`, `deep-ai-council`. The playbook scenario `08--council-graph-integration/022-council-graph-query-five-modes-prompt-safe-context.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-022.

Current behavior is grounded in `.opencode/skills/deep-loop-runtime/scripts/query.cjs`, which the scenario identifies as runtime CLI script: per-mode dispatch. Validation is anchored by `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts`, covering test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support".

The user-visible contract is concrete: Verify all 5 documented runtime query CLI modes return prompt-safe bounded context. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Handler | runtime CLI script: per-mode dispatch |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Library | Per-mode query helpers |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Runtime CLI | Query-type dispatch for all five council modes |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md` | Reference | Documents the five query modes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/08--council-graph-integration/022-council-graph-query-five-modes-prompt-safe-context.md` | Automated test | Manual scenario contract |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Automated test | Test: "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |

---

## 4. SOURCE METADATA
- Group: Council Graph Integration
- Feature ID: DAC-022
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/08--council-graph-integration/022-council-graph-query-five-modes-prompt-safe-context.md`
- Playbook scenario: `manual_testing_playbook/08--council-graph-integration/022-council-graph-query-five-modes-prompt-safe-context.md`
Related references:
- [021-council-graph-query-hostile-metadata-redaction.md](021-council-graph-query-hostile-metadata-redaction.md) — runtime query CLI hostile metadata redaction
- [023-council-graph-convergence-three-state-decision-matrix.md](023-council-graph-convergence-three-state-decision-matrix.md) — runtime convergence CLI three-state decision matrix
