---
id: SD-H09
title: 'Independent holdout — CHANGELOG (keyword-blind)'
description: "Routing-gold scenario SD-H09: Independent holdout — CHANGELOG (keyword-blind)."
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

# SD-H09: CHANGELOG Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H09`.

---

## 1. OVERVIEW

Authored blind to the router keyword list.

### Why This Matters

`SD-H09` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-changelog` for a keyword-blind phrasing
- Prompt: `We're about to tag 3.2 — can you go through everything that's changed since the last version and write up a clean summary I can drop into the announcement so people know what's new and what got fixed?`
- Expected signals: intent resolves to `sk-create-changelog`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-changelog`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `We're about to tag 3.2 — can you go through everything that's changed since the last version and write up a clean summary I can drop into the announcement so people know what's new and what got fixed?`

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
- Playbook ID: SD-H09
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-changelog.md`

