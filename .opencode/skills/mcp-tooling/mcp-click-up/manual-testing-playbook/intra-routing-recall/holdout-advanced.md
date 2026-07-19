---
id: CU-H02
category: intra_routing_recall
stage: holdout
title: 'Blind holdout — advanced feature'
expected_intent: MCP_ADVANCED
expected_resources:
  - references/mcp-tools.md
blindExceptions:
  - "quarterly objective"
  - "objective"
  - "write-up page"
version: 1.1.0.0
---
# CU-H02: Blind holdout — advanced feature
## SCENARIO CONTRACT
- Expected intent: `MCP_ADVANCED` (semantic belief; prompt was authored keyword-blind)
- Holdout honesty anchor: the prompt describes a documents/objectives task in natural words, authored with NO router keyword, intent-key name, skill id, or resource basename. During routing remediation the natural OKR/documents vocabulary "quarterly objective" / "objective" / "write-up page" was bound into `MCP_ADVANCED` so semantic recall works without gold leakage; the prompt is no longer blind for those phrases — recorded in `blindExceptions` above.
**Exact prompt**:
```text
Set up a new quarterly objective for the team and spin up a shared write-up page in ClickUp where we can draft the plan.
```
