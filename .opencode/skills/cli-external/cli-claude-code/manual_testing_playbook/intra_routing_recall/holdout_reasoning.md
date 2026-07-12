---
id: CC-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — reasoning domain'
expected_intent: DEEP_REASONING
expected_resources:
  - references/cli_reference.md
  - references/claude_tools.md
version: 1.0.0.0
---
# CC-H01: Blind holdout — reasoning domain

## SCENARIO CONTRACT
- Expected intent: `DEEP_REASONING`
- Tier: T2 (blind holdout — prompt names no router keyword, intent key, skill id, or resource basename; tests generalization beyond keyword matching)

**Exact prompt**:
```text
I'm stuck choosing between two database layouts for a high-traffic service. Ask the other AI assistant to weigh the long-term maintainability implications and walk me through its rationale one step at a time.
```
