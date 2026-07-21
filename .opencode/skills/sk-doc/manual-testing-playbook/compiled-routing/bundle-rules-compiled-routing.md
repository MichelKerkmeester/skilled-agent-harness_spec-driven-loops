---
id: SD-CR-001
category: compiled_routing
stage: routing
title: "sk-doc bundle-rules create-skill route serves compiled and matches legacy"
route_shape: bundleRules
expected_intent: create-skill
expected_resources:
  - create-skill/references/skill/creation-workflow.md
  - create-skill/assets/skill/skill-md-template.md
  - create-skill/assets/skill/skill-readme-template.md
  - create-skill/assets/skill/skill-reference-template.md
expected_workflow_mode: create-skill
expected_leaf_resources:
  - workflow_mode: create-skill
    leaf_resource_id: references/skill/creation-workflow.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-md-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-readme-template.md
  - workflow_mode: create-skill
    leaf_resource_id: assets/skill/skill-reference-template.md
full_inventory_intent: false
evidence_compiled_route: sk-doc/create-skill
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 82496ebeee1491c0320eb4fccdbbd3e6aac582950b81552f823fd75a2193f553
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# sk-doc bundle-rules create-skill route serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: sk-doc resolves through **bundle rules** — a skill-authoring request matches the `create-skill` rule and assembles that mode's workflow/template leaves. This scenario proves the compiled engine serves that bundle-rule decision (`servingAuthority: compiled`) and matches the legacy routing decision. Distinct rationale versus the sibling bundle-rules hub (sk-design): sk-doc's rules key off a **documentation-artifact-authoring intent** (which OpenCode component to create), not a live-site design-extraction signal.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Help me create a graph-rag sk-skill with SKILL.md and starter reference scaffolds.
```

**Expected route**:
- Mode: `create-skill`
- Route shape: `bundleRules` — a create-intent rule selects the mode and its bundle.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill sk-doc --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios SD-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
