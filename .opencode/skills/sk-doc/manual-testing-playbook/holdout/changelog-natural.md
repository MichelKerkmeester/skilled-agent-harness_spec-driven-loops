---
id: SD-H04
title: 'Holdout — CHANGELOG via natural phrasing'
description: "Routing-gold scenario SD-H04: Holdout — CHANGELOG via natural phrasing."
expected_intent: sk-create-changelog
expected_resources:
  - shared/assets/changelog-template.md
expected_workflow_mode: sk-create-changelog
expected_leaf_resources:
  - workflow_mode: sk-create-changelog
    leaf_resource_id: assets/changelog-template.md
stage: holdout
version: 1.0.0.0
---

# SD-H04: CHANGELOG Held-Out (decontaminated phrasing)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H04`.

---

## 1. OVERVIEW

Generalization probe for the release-notes intent. The fitted CHANGELOG scenarios
all contain the literal token "changelog"; this one asks for the same artifact in
the words a real user would use ("release notes", "what changed"), so it measures
whether the single-keyword trigger generalizes at all.

### Why This Matters

`SD-H04` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-changelog` for a keyword-blind phrasing
- Prompt: `Turn the merged work for v0.4.0 into release notes grouped by what changed.`
- Expected signals: intent resolves to `sk-create-changelog`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-changelog`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Turn the merged work for v0.4.0 into release notes grouped by what changed.`

### Note

This is a prompt-only holdout scenario. It carries no command sequence or captured evidence. It is scored by the routing-gold and skill-benchmark gates from the prompt above and the frontmatter contract, not from a manual command run.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | The sk-doc router under test |
| `../../sk-create-skill/scripts/validate-playbook-topology.cjs` | Routing-gold contract gate |

---

## 5. SOURCE METADATA

- Group: Holdout
- Playbook ID: SD-H04
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/changelog-natural.md`

