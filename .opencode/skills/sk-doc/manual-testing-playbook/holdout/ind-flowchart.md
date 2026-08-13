---
id: SD-H10
title: 'Independent holdout — FLOWCHART (keyword-blind)'
description: "Routing-gold scenario SD-H10: Independent holdout — FLOWCHART (keyword-blind)."
expected_intent: sk-create-diagram
expected_resources:
  - sk-create-diagram/assets/ascii-patterns/simple-workflow.md
  - sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md
expected_workflow_mode: sk-create-diagram
expected_leaf_resources:
  - workflow_mode: sk-create-diagram
    leaf_resource_id: assets/simple-workflow.md
  - workflow_mode: sk-create-diagram
    leaf_resource_id: assets/decision-tree-flow.md
stage: holdout
version: 1.0.0.0
---

# SD-H10: FLOWCHART Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H10`.

---

## 1. OVERVIEW

Authored blind to the router keyword list.

### Why This Matters

`SD-H10` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-diagram` for a keyword-blind phrasing
- Prompt: `Can you lay out our support ticket escalation steps using just text characters — the kind I can paste straight into a code comment — including the branches for whether the issue is urgent and whether a manager is actually available?`
- Expected signals: intent resolves to `sk-create-diagram`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-diagram`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Can you lay out our support ticket escalation steps using just text characters — the kind I can paste straight into a code comment — including the branches for whether the issue is urgent and whether a manager is actually available?`

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
- Playbook ID: SD-H10
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-flowchart.md`

