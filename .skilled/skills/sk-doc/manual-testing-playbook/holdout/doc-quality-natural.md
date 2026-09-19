---
id: SD-H02
title: 'Fail-safe — keyword-blind DOC_QUALITY phrasing must defer'
description: "Routing-gold scenario SD-H02: keyword-blind DOC_QUALITY phrasing must not misroute; the defer is the recorded generalization gap."
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
stage: negative
version: 2.1.0.7
---

# SD-H02: DOC_QUALITY Held-Out (decontaminated phrasing)

> **Reclassified as a fail-safe negative.** The compiled router scores zero keyword hits on this
> decontaminated phrasing and defers, which is the designed result for a prompt that shares no
> vocabulary with any mode. The typed gold below still names `sk-create-quality-control` as the
> *intended* route and is retained as the reference; what the scenario now fails on is a misroute,
> and the missing semantic fallback stays recorded as a known gap rather than a red build.

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-H02`.

---

## 1. OVERVIEW

Generalization probe for the doc-review intent. Same correct answer as the fitted
DOC_QUALITY scenario, but asked in plain reviewer language with none of the
router's trigger phrases ("documentation quality", "validate documentation",
"validation rules", "fail sk-doc standards").

### Why This Matters

`SD-H02` is the fleet's only cleanly decontaminated phrasing probe: it shares no vocabulary with `sk-create-quality-control`. It now guards against a *misroute* of that phrasing, since a defer is the correct compiled outcome while no semantic scorer exists.

---

## 2. SCENARIO CONTRACT

- Objective: confirm the router emits no route for a keyword-blind phrasing (fail-safe), and record the generalization gap it measures
- Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`
- Expected signals: the decision is a non-route (defer); no mode's resources load
- Desired user-visible outcome: the router trace reports a defer instead of a wrong intent
- Pass/fail: PASS when no mode routes (defer or disambiguation); FAIL if any mode routes — a misroute is worse than a defer here

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`

### Note

This is a prompt-only fail-safe scenario, converted from a holdout: the typed gold names the intended route while the asserted outcome is a non-route. It carries no command sequence or captured evidence. It is checked by the routing-gold gates from the prompt above and the frontmatter contract, not from a manual command run.

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

- Group: Fail-safe negative (converted from Holdout)
- Playbook ID: SD-H02
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `holdout/doc-quality-natural.md`

