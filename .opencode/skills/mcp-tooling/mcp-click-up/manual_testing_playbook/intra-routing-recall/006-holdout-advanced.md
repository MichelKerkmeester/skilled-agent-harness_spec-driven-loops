---
id: CU-H02
category: intra-routing-recall
title: 'Blind holdout — advanced feature'
expected_intent: MCP_ADVANCED
expected_resources:
  - references/mcp_tools.md
version: 1.0.0.0
---
# CU-H02: Blind holdout — advanced feature
## SCENARIO CONTRACT
- Expected intent: `MCP_ADVANCED` (semantic belief; prompt is keyword-blind)
- Holdout honesty anchor: the prompt describes a documents/objectives/bulk-creation task in natural words only, with NO router keyword, intent-key name, skill id, or resource basename. Under-routing here is the honest outcome for a keyword-only router.
**Exact prompt**:
```text
Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.
```
