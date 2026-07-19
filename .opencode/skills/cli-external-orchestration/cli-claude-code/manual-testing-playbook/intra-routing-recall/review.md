---
id: CC-R04
category: intra_routing_recall
stage: routing
title: 'Review routing'
expected_intent: REVIEW
expected_resources:
  - references/integration-patterns.md
  - references/agent-delegation.md
version: 1.0.0.0
---
# CC-R04: Review routing

## SCENARIO CONTRACT
- Expected intent: `REVIEW`
- Tier: T1 (in-skill recall — prompt carries the intent's router keywords)

**Exact prompt**:
```text
Get a second opinion from Claude: audit this login handler for security holes and give a quality verdict.
```
