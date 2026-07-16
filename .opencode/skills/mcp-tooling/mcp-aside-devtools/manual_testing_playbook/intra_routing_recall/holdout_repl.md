---
id: AD-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: scripted evidence'
expected_intent: REPL
expected_resources:
  - references/aside_cli_reference.md
  - references/session_management.md
blindToRouterKeywords: true
version: 1.0.0.0
---
# AD-H01: Blind holdout: scripted evidence
## SCENARIO CONTRACT
- Expected intent: `REPL`
**Exact prompt**:
```text
Step through the page in exact scripted order and snapshot every state so the run can be replayed identically as proof.
```
