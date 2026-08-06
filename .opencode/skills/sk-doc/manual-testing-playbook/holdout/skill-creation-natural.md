---
id: SD-H01
title: 'Holdout — SKILL_CREATION via natural phrasing'
description: "Routing-gold scenario SD-H01: Holdout — SKILL_CREATION via natural phrasing."
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

# SD-H01: SKILL_CREATION Held-Out (decontaminated phrasing)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H01`.

---

## 1. OVERVIEW

Generalization probe. The correct answer is identical to the fitted SKILL_CREATION
scenario, but the request is phrased the way a real user would ask WITHOUT the
router's keyword vocabulary (no "sk-skill", no "SKILL.md scaffold", no "create
sk-"). It measures whether intent detection survives unseen phrasing instead of
memorized triggers.

### Why This Matters

`SD-H01` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-skill` for a keyword-blind phrasing
- Prompt: `I'm packaging a new reusable capability for the assistant and need its main definition file plus the starter support docs laid out.`
- Expected signals: intent resolves to `sk-create-skill`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-skill`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I'm packaging a new reusable capability for the assistant and need its main definition file plus the starter support docs laid out.`

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
- Playbook ID: SD-H01
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/skill-creation-natural.md`

