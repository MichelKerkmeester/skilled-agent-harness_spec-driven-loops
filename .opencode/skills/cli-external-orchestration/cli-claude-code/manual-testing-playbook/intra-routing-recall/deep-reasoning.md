---
id: CC-R01
category: intra_routing_recall
stage: routing
title: 'Deep reasoning routing'
expected_intent: DEEP_REASONING
expected_resources:
  - references/cli-reference.md
  - references/claude-tools.md
version: 1.0.0.0
---
# CC-R01: Deep reasoning routing

## SCENARIO CONTRACT
- Expected intent: `DEEP_REASONING`
- Tier: T1 (in-skill recall — prompt carries the intent's router keywords)

**Exact prompt**:
```text
Have Claude reason through the trade-off between two caching strategies and analyze the architecture implications using extended thinking.
```
