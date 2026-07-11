---
id: CU-H01
category: intra-routing-recall
title: 'Blind holdout — daily task op'
expected_intent: CUPT_DAILY
expected_resources:
  - references/cupt_commands.md
version: 1.0.0.0
---
# CU-H01: Blind holdout — daily task op
## SCENARIO CONTRACT
- Expected intent: `CUPT_DAILY` (semantic belief; prompt is keyword-blind)
- Holdout honesty anchor: the prompt carries NO router keyword, intent-key name, skill id, or resource basename. A keyword-only router is expected to under-route here; a high score would signal gold leakage rather than real routing.
**Exact prompt**:
```text
I finished the ticket I was working on this morning - please close it out and jot down a quick comment that the client approved it.
```
