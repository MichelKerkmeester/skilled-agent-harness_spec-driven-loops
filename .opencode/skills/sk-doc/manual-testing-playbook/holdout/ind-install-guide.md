---
id: SD-H12
category: holdout
title: 'Independent holdout — INSTALL_GUIDE (keyword-blind)'
expected_intent: create-readme
expected_resources:
  - create-readme/assets/install-guide-template.md
  - create-readme/references/README.md
expected_workflow_mode: create-readme
expected_leaf_resources:
  - workflow_mode: create-readme
    leaf_resource_id: assets/install-guide-template.md
  - workflow_mode: create-readme
    leaf_resource_id: references/README.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H12: INSTALL_GUIDE Independent Holdout

Authored blind to the router keyword list.

## Scenario Contract

- Prompt: `Can you write up clear step-by-step instructions for getting our project running from scratch on a new laptop — cloning it down, installing what it needs, and getting it to start up the first time?`
- Expected intent: `INSTALL_GUIDE`
- Stage: holdout
