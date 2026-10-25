---
id: CB-CR-002
category: compiled_routing
stage: routing
title: "sk-code lookup routes the skilled surface alone"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-skilled`."
route_shape: single
expected_intent: sk-code-skilled
expected_bundle: [sk-code-skilled]
expected_resources:
  - sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md
  - sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md
expected_workflow_mode: sk-code-skilled
expected_leaf_resources:
  - workflow_mode: sk-code-skilled
    leaf_resource_id: references/typescript/style-guide/overview-strict-and-naming.md
  - workflow_mode: sk-code-skilled
    leaf_resource_id: references/typescript/quality-standards/overview-and-type-system.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-skilled
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: efa54f648388fd15d1e2faf3149af2c7200c88627c1c25daa9f8d321482814af
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-25
version: 1.0.0.0
---

# sk-code lookup routes the skilled surface alone

## 1. OVERVIEW

A conventions lookup names a language but no workflow verb, so no workflow mode scores. The hub then routes the `sk-code-skilled` surface alone, and the acting agent reads its evidence directly. The scenario proves the compiled engine serves `single` with exactly `[sk-code-skilled]` for this prompt.

### Why This Matters

The hub contract says a surface is bundled after the primary mode when a mode scores, and is routed alone when no mode scores. This replay pins one side of that contract to a real prompt, so a routing change that bundles or defers here shows up as a failed scenario.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
what are the conventions for TypeScript in this repo
```

**Expected route**:
- Bundle: `[sk-code-skilled]`, one surface and nothing after it.
- Route shape: `single`.

---

## 3. COMMAND SEQUENCE

Capture the serving status and the compiled decision with the live front door:
```
node .skilled/bin/compiled-route-status.cjs --hub sk-code
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "what are the conventions for TypeScript in this repo"
```

## Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-skilled`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `surfaceBundle`, a `defer` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
