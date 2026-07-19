---
id: CC-R05
category: intra_routing_recall
stage: routing
title: 'Agent delegation routing'
expected_intent: AGENT_DELEGATION
expected_resources:
  - references/agent-delegation.md
  - references/integration-patterns.md
version: 1.0.0.0
---
# CC-R05: Agent delegation routing

## SCENARIO CONTRACT
- Expected intent: `AGENT_DELEGATION`
- Tier: T1 (in-skill recall — prompt carries the intent's router keywords)

**Exact prompt**:
```text
Delegate this long-running indexing job to a Claude background agent and let it run in parallel while I keep coding.
```
