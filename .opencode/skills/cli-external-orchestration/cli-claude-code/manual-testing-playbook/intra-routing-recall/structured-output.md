---
id: CC-R03
category: intra_routing_recall
stage: routing
title: 'Structured output routing'
expected_intent: STRUCTURED_OUTPUT
expected_resources:
  - references/cli-reference.md
  - references/claude-tools.md
version: 1.0.0.0
---
# CC-R03: Structured output routing

## SCENARIO CONTRACT
- Expected intent: `STRUCTURED_OUTPUT`
- Tier: T1 (in-skill recall — prompt carries the intent's router keywords)

**Exact prompt**:
```text
Have Claude extract the function signatures and return them as schema-validated JSON a downstream parser can consume.
```
