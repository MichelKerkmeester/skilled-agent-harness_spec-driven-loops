---
id: SD-H04
category: holdout
title: 'Holdout — CHANGELOG via natural phrasing'
expected_intent: CHANGELOG
expected_resources:
  - assets/changelog_template.md
expected_workflow_mode: create-changelog
expected_leaf_resources:
  - workflow_mode: create-changelog
    leaf_resource_id: assets/changelog_template.md
stage: holdout
created: 2026-07-16
version: 1.0.0.0
---

# SD-H04: CHANGELOG Held-Out (decontaminated phrasing)

## Purpose

Generalization probe for the release-notes intent. The fitted CHANGELOG scenarios
all contain the literal token "changelog"; this one asks for the same artifact in
the words a real user would use ("release notes", "what changed"), so it measures
whether the single-keyword trigger generalizes at all.

## Scenario Contract

- Prompt: `Turn the merged work for v0.4.0 into release notes grouped by what changed.`
- Expected intent: `CHANGELOG`
- Stage: holdout (excluded from the fitted aggregate; scored only for the generalization gap)
