---
id: SD-H06
title: 'Independent holdout — SKILL_CREATION (keyword-blind)'
description: "Routing-gold scenario SD-H06: Independent holdout — SKILL_CREATION (keyword-blind)."
expected_intent: sk-create-skill
expected_resources:
  - sk-create-skill/references/skill/creation-workflow.md
  - sk-create-skill/assets/skill/skill-md-template.md
  - sk-create-skill/assets/skill/skill-readme-template.md
  - sk-create-skill/assets/skill/skill-reference-template.md
expected_workflow_mode: sk-create-skill
expected_leaf_resources:
  - workflow_mode: sk-create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: sk-create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
stage: holdout
version: 1.0.0.0
---

# SD-H06: SKILL_CREATION Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H06`.

---

## 1. OVERVIEW

Authored by an agent blind to the router keyword list — a fair generalization probe.

### Why This Matters

`SD-H06` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-skill` for a keyword-blind phrasing
- Prompt: `I keep re-explaining the same steps every time I want you to help draft our release notes — can you set up a reusable helper so you just know how to do this going forward, with a main how-to guide plus a couple of starter reference docs?`
- Expected signals: intent resolves to `sk-create-skill`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-skill`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I keep re-explaining the same steps every time I want you to help draft our release notes — can you set up a reusable helper so you just know how to do this going forward, with a main how-to guide plus a couple of starter reference docs?`

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
- Playbook ID: SD-H06
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-skill-creation.md`

