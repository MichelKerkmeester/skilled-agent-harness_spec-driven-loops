---
id: SD-H03
title: 'Holdout — README_CREATION via natural phrasing'
description: "Routing-gold scenario SD-H03: Holdout — README_CREATION via natural phrasing."
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

# SD-H03: README_CREATION Held-Out (decontaminated phrasing)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H03`.

---

## 1. OVERVIEW

Generalization probe for the front-page-doc intent. Same correct answer as the
fitted README_CREATION scenario, but phrased as a real onboarding request with
none of the trigger phrases ("create a readme", "readme for", "a readme").

### Why This Matters

`SD-H03` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-readme` for a keyword-blind phrasing
- Prompt: `Draft the front-page overview for this project so a newcomer understands what it does and how to get started.`
- Expected signals: intent resolves to `sk-create-readme`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-readme`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Draft the front-page overview for this project so a newcomer understands what it does and how to get started.`

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
- Playbook ID: SD-H03
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/readme-natural.md`

