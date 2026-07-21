---
id: SDG-CR-001
category: compiled_routing
stage: routing
title: "sk-design bundle-rules md-generator route serves compiled and matches legacy"
route_shape: bundleRules
expected_intent: md-generator
expected_resources:
  - design-md-generator/references/design-md-format.md
  - design-md-generator/references/writing-style-guide.md
  - design-md-generator/references/color-role-taxonomy.md
  - design-md-generator/references/component-taxonomy.md
  - design-md-generator/references/anti-patterns.md
  - design-md-generator/references/extraction-workflow.md
  - design-md-generator/references/troubleshooting.md
  - design-md-generator/references/quality-checklist.md
  - design-md-generator/references/authoring-boundary.md
  - design-md-generator/assets/design-md-prompt-template.md
  - design-md-generator/assets/cardinal-rules-card.md
  - design-md-generator/assets/source-of-truth-router-card.md
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design-md-format.md
  - workflow_mode: md-generator
    leaf_resource_id: references/writing-style-guide.md
  - workflow_mode: md-generator
    leaf_resource_id: references/color-role-taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/component-taxonomy.md
  - workflow_mode: md-generator
    leaf_resource_id: references/anti-patterns.md
  - workflow_mode: md-generator
    leaf_resource_id: references/extraction-workflow.md
  - workflow_mode: md-generator
    leaf_resource_id: references/troubleshooting.md
  - workflow_mode: md-generator
    leaf_resource_id: references/quality-checklist.md
  - workflow_mode: md-generator
    leaf_resource_id: references/authoring-boundary.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/design-md-prompt-template.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/cardinal-rules-card.md
  - workflow_mode: md-generator
    leaf_resource_id: assets/source-of-truth-router-card.md
full_inventory_intent: false
evidence_compiled_route: sk-design/md-generator
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 2bace44fdf4fc4e68c97873c63556db43600a3f02af5758fbf671f3b003938ed
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# sk-design bundle-rules md-generator route serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: sk-design resolves through **bundle rules** — a URL-to-DESIGN.md extraction request matches the `md-generator` rule and assembles that mode's format/style/taxonomy leaves. This scenario proves the compiled engine serves that bundle-rule decision (`servingAuthority: compiled`) and matches the legacy routing decision. Distinct rationale versus the sibling bundle-rules hub (sk-doc): sk-design's rules key off a **design extraction/pipeline signal** (a live-site source plus a DESIGN.md target), not a documentation-authoring intent.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Extract the design system from https://example.com into /tmp/skd-compiled-routing/DESIGN.md with tokens.json evidence.
```

**Expected route**:
- Mode: `md-generator`
- Route shape: `bundleRules` — a design-extraction rule selects the mode and its bundle.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill sk-design --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios SDG-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
