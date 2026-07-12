---
id: CU-N01
category: intra_routing_recall
stage: negative
title: 'Negative — out of domain'
expected_intent: none
expected_resources: []
version: 1.0.0.0
---
# CU-N01: Negative — out of domain
## SCENARIO CONTRACT
- Expected intent: `none` (prompt is outside the ClickUp task-management domain)
- Negative anchor: the router must not activate any intent or load any reference for an unrelated code task.
**Exact prompt**:
```text
Refactor this Python function to use async and await, then add unit tests for the database layer.
```
