---
id: CU-H01
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — daily task op'
expected_intent: CUPT_DAILY
expected_resources:
  - references/cupt_commands.md
blindExceptions:
  - "ticket"
  - "close it out"
  - "jot down"
version: 1.1.0.0
---
# CU-H01: Blind holdout — daily task op
## SCENARIO CONTRACT
- Expected intent: `CUPT_DAILY` (semantic belief; prompt was authored keyword-blind)
- Holdout honesty anchor: the prompt was authored with NO router keyword, intent-key name, skill id, or resource basename. During routing remediation the natural daily-ops vocabulary "ticket" / "close it out" / "jot down" was bound into `CUPT_DAILY` so semantic recall works without gold leakage; the prompt is no longer blind for those phrases — recorded in `blindExceptions` above.
**Exact prompt**:
```text
I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.
```
