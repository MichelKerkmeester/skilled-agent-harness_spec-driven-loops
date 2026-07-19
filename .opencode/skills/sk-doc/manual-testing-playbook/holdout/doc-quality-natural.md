---
id: SD-H02
category: holdout
title: 'Holdout — DOC_QUALITY via natural phrasing'
expected_intent: create-quality-control
expected_resources:
  - shared/references/validation.md
  - create-quality-control/references/workflows.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
expected_workflow_mode: create-quality-control
expected_leaf_resources:
  - workflow_mode: create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H02: DOC_QUALITY Held-Out (decontaminated phrasing)

## Purpose

Generalization probe for the doc-review intent. Same correct answer as the fitted
DOC_QUALITY scenario, but asked in plain reviewer language with none of the
router's trigger phrases ("documentation quality", "validate documentation",
"validation rules", "fail sk-doc standards").

## Scenario Contract

- Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`
- Expected intent: `DOC_QUALITY`
- Stage: holdout (excluded from the fitted aggregate; scored only for the generalization gap)
