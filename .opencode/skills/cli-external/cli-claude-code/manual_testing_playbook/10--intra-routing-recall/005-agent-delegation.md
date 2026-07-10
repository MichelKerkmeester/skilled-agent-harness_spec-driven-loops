---
id: CC-R05
category: 10--intra-routing-recall
title: 'Agent delegation routing'
expected_intent: AGENT_DELEGATION
expected_resources:
  - references/agent_delegation.md
  - references/integration_patterns.md
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
