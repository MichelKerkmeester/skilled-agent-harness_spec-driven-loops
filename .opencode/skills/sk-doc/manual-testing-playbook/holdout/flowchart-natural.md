---
id: SD-H05
category: holdout
title: 'Holdout — FLOWCHART via natural phrasing'
expected_intent: create-flowchart
expected_resources:
  - create-flowchart/assets/simple-workflow.md
  - create-flowchart/assets/decision-tree-flow.md
expected_workflow_mode: create-flowchart
expected_leaf_resources:
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: create-flowchart
    leaf_resource_id: assets/decision-tree-flow.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H05: FLOWCHART Held-Out (decontaminated phrasing)

## Purpose

Generalization probe for the diagram intent. The fitted FLOWCHART scenario matches
on the literal "flowchart"/"ascii" tokens; this one asks for the same artifact as
a real user would ("text diagram", "decision branch"), so it measures whether the
intent survives without its keyword present.

## Scenario Contract

- Prompt: `Sketch the approval process as a text diagram that shows each decision branch and where it loops back.`
- Expected intent: `FLOWCHART`
- Stage: holdout (excluded from the fitted aggregate; scored only for the generalization gap)
