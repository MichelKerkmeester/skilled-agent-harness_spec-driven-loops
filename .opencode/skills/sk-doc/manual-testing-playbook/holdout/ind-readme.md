---
id: SD-H08
title: 'Independent holdout — README_CREATION (keyword-blind)'
description: "Routing-gold scenario SD-H08: Independent holdout — README_CREATION (keyword-blind)."
expected_intent: sk-create-readme
expected_resources:
  - sk-create-readme/references/README.md
  - sk-create-readme/assets/readme-template.md
expected_workflow_mode: sk-create-readme
expected_leaf_resources:
  - workflow_mode: sk-create-readme
    leaf_resource_id: references/README.md
  - workflow_mode: sk-create-readme
    leaf_resource_id: assets/readme-template.md
stage: holdout
version: 1.0.0.0
---

# SD-H08: README_CREATION Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H08`.

---

## 1. OVERVIEW

Authored blind to the router keyword list.

### Why This Matters

`SD-H08` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-readme` for a keyword-blind phrasing
- Prompt: `Can you write up a clear front-page overview for this project that explains what it actually does and how a brand-new person would get set up and start using it? Right now someone landing here has no idea where to begin.`
- Expected signals: intent resolves to `sk-create-readme`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-readme`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can you write up a clear front-page overview for this project that explains what it actually does and how a brand-new person would get set up and start using it? Right now someone landing here has no idea where to begin.`

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
- Playbook ID: SD-H08
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-readme.md`

