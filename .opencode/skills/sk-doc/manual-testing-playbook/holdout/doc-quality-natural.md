---
id: SD-H02
title: 'Holdout — DOC_QUALITY via natural phrasing'
description: "Routing-gold scenario SD-H02: Holdout — DOC_QUALITY via natural phrasing."
expected_intent: sk-create-quality-control
expected_resources:
  - shared/references/validation.md
  - sk-create-quality-control/references/workflows.md
  - shared/references/core-standards.md
  - shared/references/evergreen-packet-id-rule.md
expected_workflow_mode: sk-create-quality-control
expected_leaf_resources:
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/validation.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/workflows.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/core-standards.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/evergreen-packet-id-rule.md
stage: holdout
version: 1.0.0.0
---

# SD-H02: DOC_QUALITY Held-Out (decontaminated phrasing)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H02`.

---

## 1. OVERVIEW

Generalization probe for the doc-review intent. Same correct answer as the fitted
DOC_QUALITY scenario, but asked in plain reviewer language with none of the
router's trigger phrases ("documentation quality", "validate documentation",
"validation rules", "fail sk-doc standards").

### Why This Matters

`SD-H02` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-quality-control` for a keyword-blind phrasing
- Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`
- Expected signals: intent resolves to `sk-create-quality-control`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-quality-control`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`

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
- Playbook ID: SD-H02
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/doc-quality-natural.md`

