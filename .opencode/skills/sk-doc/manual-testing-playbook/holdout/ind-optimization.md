---
id: SD-H11
title: 'Independent holdout — OPTIMIZATION (keyword-blind)'
description: "Routing-gold scenario SD-H11: Independent holdout — OPTIMIZATION (keyword-blind)."
expected_intent: sk-create-quality-control
expected_resources:
  - sk-create-quality-control/references/optimization.md
  - shared/assets/llmstxt-templates.md
expected_workflow_mode: sk-create-quality-control
expected_leaf_resources:
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: references/optimization.md
  - workflow_mode: sk-create-quality-control
    leaf_resource_id: assets/llmstxt-templates.md
stage: holdout
version: 1.0.0.0
---

# SD-H11: OPTIMIZATION Independent Holdout

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H11`.

---

## 1. OVERVIEW

Authored blind to the router keyword list.

### Why This Matters

`SD-H11` guards the router decision for the Holdout category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router selects `sk-create-quality-control` for a keyword-blind phrasing
- Prompt: `Our main setup guide has ballooned into this huge wall of repetitive text and it's eating way too much of the model's budget every time — can you trim it down hard so it's tight and skimmable? Also drop a slim little index at the top level that lists what lives where, so an assistant can jump to the right section instead of reading the whole thing.`
- Expected signals: intent resolves to `sk-create-quality-control`; expected resources load
- Desired user-visible outcome: the router trace names the expected intent and resources
- Pass/fail: PASS when the routed intent matches `sk-create-quality-control`; FAIL on a wrong intent

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Our main setup guide has ballooned into this huge wall of repetitive text and it's eating way too much of the model's budget every time — can you trim it down hard so it's tight and skimmable? Also drop a slim little index at the top level that lists what lives where, so an assistant can jump to the right section instead of reading the whole thing.`

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
- Playbook ID: SD-H11
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/ind-optimization.md`

