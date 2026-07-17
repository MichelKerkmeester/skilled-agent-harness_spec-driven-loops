---
id: SD-H09
category: holdout
title: 'Independent holdout — CHANGELOG (keyword-blind)'
expected_intent: create-changelog
expected_resources:
  - shared/assets/changelog_template.md
expected_workflow_mode: create-changelog
expected_leaf_resources:
  - workflow_mode: create-changelog
    leaf_resource_id: assets/changelog_template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H09: CHANGELOG Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `We're about to tag 3.2 — can you go through everything that's changed since the last version and write up a clean summary I can drop into the announcement so people know what's new and what got fixed?`
- Expected intent: `CHANGELOG`
- Stage: holdout
