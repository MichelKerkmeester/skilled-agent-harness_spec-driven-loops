---
id: CD-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout: session drop'
expected_intent: TROUBLESHOOT
expected_resources:
  - references/troubleshooting.md
blindToRouterKeywords: true
blindExceptions:
  - "keeps dropping"
  - "work out the cause"
version: 1.1.0.0
---
# CD-H01: Blind holdout: session drop
## SCENARIO CONTRACT
- Expected intent: `TROUBLESHOOT`
**Exact prompt**:
```text
The headless page-debugging session keeps dropping halfway through a run and I cannot work out the cause.
```

## Route Binding

Bound to `TROUBLESHOOT` by the keywords "keeps dropping" and "work out the cause" ("work out the cause" added during routing remediation so the diagnostic signal outranks the near-tied `CLI` hit on "headless"). The holdout stays blind to the literal intent key, skill id, and resource basenames, but is no longer blind for the two bound phrases — recorded in `blindExceptions` above.
