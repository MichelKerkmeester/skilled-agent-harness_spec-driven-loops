---
id: MB-H01
category: intra-routing-recall
stage: holdout
title: 'Blind holdout: real-app pattern evidence'
expected_intent: SCREENS
expected_resources:
  - references/tool-surface.md
blindToRouterKeywords: true
blindExceptions:
  - "first open"
version: 1.0.0.0
---
# MB-H01: Blind holdout: real-app pattern evidence
## SCENARIO CONTRACT
- Expected intent: `SCREENS`

## Route Binding

Bound to `SCREENS` by the keyword "first open" (added during routing remediation; the first-open/empty-state moment is core screens vocabulary). The holdout stays blind to provider aliases and the literal "screen"/"empty state" phrases, but is no longer blind for "first open" — recorded in `blindExceptions` above.
**Exact prompt**:
```text
I want to see how shipped iOS products present the moment a user first opens the app with nothing saved yet.
```
