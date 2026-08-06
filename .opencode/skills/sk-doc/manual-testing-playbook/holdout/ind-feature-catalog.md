---
id: SD-H13
title: 'Independent holdout — FEATURE_CATALOG (keyword-blind)'
description: "Routing-gold scenario SD-H13: Independent holdout — FEATURE_CATALOG (keyword-blind)."
expected_intent: sk-create-feature-catalog
expected_resources:
  - sk-create-feature-catalog/references/README.md
expected_workflow_mode: sk-create-feature-catalog
expected_leaf_resources:
  - workflow_mode: sk-create-feature-catalog
    leaf_resource_id: references/README.md
stage: holdout
version: 1.0.0.0
---

# SD-H13: FEATURE_CATALOG Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H13`.

---

## 1. OVERVIEW

Authored blind to the router keyword list.

### Why This Matters

`SD-H13` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-feature-catalog` for a keyword-blind phrasing
- Prompt: `Can you go through the payments service and write up everything it can actually do, grouped by area, so a new engineer has one place to understand all its capabilities? Right now that knowledge is scattered across the code and a few people's heads.`
- Expected signals: intent resolves to `sk-create-feature-catalog`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-feature-catalog`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can you go through the payments service and write up everything it can actually do, grouped by area, so a new engineer has one place to understand all its capabilities? Right now that knowledge is scattered across the code and a few people's heads.`

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
- Playbook ID: SD-H13
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-feature-catalog.md`

