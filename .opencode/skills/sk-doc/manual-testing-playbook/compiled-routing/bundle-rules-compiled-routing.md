---
id: SD-CR-001
stage: routing
title: "sk-doc bundle-rules create-skill route serves compiled and matches legacy"
description: "Routing-gold scenario SD-CR-001: sk-doc bundle-rules create-skill route serves compiled and matches legacy."
route_shape: bundleRules
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
full_inventory_intent: false
evidence_compiled_route: sk-doc/sk-create-skill
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 82496ebeee1491c0320eb4fccdbbd3e6aac582950b81552f823fd75a2193f553
evidence_model: router-replay
evidence_reasoning_effort: n/a
version: 1.0.0.0
---

# sk-doc bundle-rules create-skill route serves compiled and matches legacy

This document captures the routing-gold contract, current behavior, execution notes, source anchors, and metadata for `SD-CR-001`.

---

## 1. OVERVIEW

Serving-authority focus: sk-doc resolves through **bundle rules** — a skill-authoring request matches the `create-skill` rule and assembles that mode's workflow/template leaves. This scenario proves the compiled engine serves that bundle-rule decision (`servingAuthority: compiled`) and matches the legacy routing decision. Distinct rationale versus the sibling bundle-rules hub (sk-design): sk-doc's rules key off a **documentation-artifact-authoring intent** (which OpenCode component to create), not a live-site design-extraction signal.

### Why This Matters

`SD-CR-001` guards the router decision for the Compiled Routing category. A regression here silently degrades routing without failing a build.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.
```

**Expected route**:
- Mode: `create-skill`
- Route shape: `bundleRules` — a create-intent rule selects the mode and its bundle.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.`

### Commands

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill sk-doc --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios SD-CR-001 --trace-mode router
```

### Pass / Fail

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

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

- Group: Compiled Routing
- Playbook ID: SD-CR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/bundle-rules-compiled-routing.md`

