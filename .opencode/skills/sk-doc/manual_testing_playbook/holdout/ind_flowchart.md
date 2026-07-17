---
id: SD-H10
category: holdout
title: 'Independent holdout — FLOWCHART (keyword-blind)'
expected_intent: FLOWCHART
expected_resources:
  - assets/simple_workflow.md
  - assets/decision_tree_flow.md
expected_workflow_mode: create-flowchart
expected_leaf_resources:
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/simple_workflow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/decision_tree_flow.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H10: FLOWCHART Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Can you lay out our support ticket escalation steps using just text characters — the kind I can paste straight into a code comment — including the branches for whether the issue is urgent and whether a manager is actually available?`
- Expected intent: `FLOWCHART`
- Stage: holdout
