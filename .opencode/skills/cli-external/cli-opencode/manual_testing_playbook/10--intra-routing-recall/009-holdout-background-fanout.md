---
id: CO-H02
category: 10--intra-routing-recall
title: 'Blind holdout: background fan-out sessions'
expected_intent: PARALLEL_DETACHED
expected_resources:
  - references/integration_patterns.md
  - assets/prompt_templates.md
blindToRouterKeywords: true
version: 1.0.0.0
---

# CO-H02: Blind holdout — background fan-out sessions

## SCENARIO CONTRACT

- Expected intent: `PARALLEL_DETACHED`

**Exact prompt**:
```text
Fire off three background coding jobs on a remote box so they each explore a different fix at the same time, and give me a link to watch every one of them.
```
