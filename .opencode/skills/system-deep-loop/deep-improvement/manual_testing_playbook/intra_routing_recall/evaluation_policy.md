---
id: DI-R03
category: intra_routing_recall
stage: routing
title: 'Deep improvement evaluation policy routing'
expected_intent: EVALUATION_POLICY
expected_resources:
  - references/shared/quick_reference.md
  - references/model_benchmark/evaluator_contract.md
  - references/shared/promotion_rules.md
  - references/shared/heldout_and_gold_sets.md
  - references/agent_improvement/score_dimensions.md
  - assets/agent_improvement/improvement_config_reference.md
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
