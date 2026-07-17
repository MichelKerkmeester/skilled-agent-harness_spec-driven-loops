---
id: MB-H02
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: recovery path evidence'
expected_intent: FLOWS
expected_resources:
  - references/tool-surface.md
blindToRouterKeywords: true
blindExceptions:
  - "start to finish"
version: 1.1.0.0
---
# MB-H02: Blind holdout: recovery path evidence
## SCENARIO CONTRACT
- Expected intent: `FLOWS`

## Route Binding

Bound to `FLOWS` by the keyword "start to finish" (added during routing remediation; end-to-end progression is core flows vocabulary). The holdout stays blind to provider aliases and the literal "flow"/"journey" phrases, but is no longer blind for "start to finish" — recorded in `blindExceptions` above.
**Exact prompt**:
```text
Show me how real products take someone who lost their account credential back into a working session, start to finish.
```
