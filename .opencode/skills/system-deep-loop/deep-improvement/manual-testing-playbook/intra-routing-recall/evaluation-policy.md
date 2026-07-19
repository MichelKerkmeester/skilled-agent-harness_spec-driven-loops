---
id: DI-R03
category: intra_routing_recall
stage: routing
title: 'Deep improvement evaluation policy routing'
expected_intent: EVALUATION_POLICY
expected_resources:
  - references/shared/quick-reference.md
  - references/model-benchmark/evaluator-contract.md
  - references/shared/promotion-rules.md
  - references/shared/heldout-and-gold-sets.md
  - references/agent-improvement/score-dimensions.md
  - assets/agent-improvement/improvement-config-reference.md
version: 1.0.0.0
---

# DI-R03: Deep improvement evaluation policy routing

## 2. SCENARIO CONTRACT

- Prompt: `Apply the evaluator rubric contract with repeatability checks and no-go policy before scoring.`
- Expected intent: `EVALUATION_POLICY`

**Exact prompt**:
```text
Apply the evaluator rubric contract with repeatability checks and no-go policy before scoring.
```
