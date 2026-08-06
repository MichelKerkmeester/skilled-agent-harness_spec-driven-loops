---
id: SD-H05
title: 'Holdout — FLOWCHART via natural phrasing'
description: "Routing-gold scenario SD-H05: Holdout — FLOWCHART via natural phrasing."
expected_intent: sk-create-flowchart
expected_resources:
  - sk-create-flowchart/assets/simple-workflow.md
  - sk-create-flowchart/assets/decision-tree-flow.md
expected_workflow_mode: sk-create-flowchart
expected_leaf_resources:
  - workflow_mode: sk-create-flowchart
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: sk-create-flowchart
    leaf_resource_id: assets/decision-tree-flow.md
stage: holdout
version: 1.0.0.0
---

# SD-H05: FLOWCHART Held-Out (decontaminated phrasing)

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H05`.

---

## 1. OVERVIEW

Generalization probe for the diagram intent. The fitted FLOWCHART scenario matches
on the literal "flowchart"/"ascii" tokens; this one asks for the same artifact as
a real user would ("text diagram", "decision branch"), so it measures whether the
intent survives without its keyword present.

### Why This Matters

`SD-H05` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-flowchart` for a keyword-blind phrasing
- Prompt: `Sketch the approval process as a text diagram that shows each decision branch and where it loops back.`
- Expected signals: intent resolves to `sk-create-flowchart`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-flowchart`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Sketch the approval process as a text diagram that shows each decision branch and where it loops back.`

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
- Playbook ID: SD-H05
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/flowchart-natural.md`

