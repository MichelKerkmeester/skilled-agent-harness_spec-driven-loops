---
id: CB-CR-004
category: compiled_routing
stage: routing
title: "sk-code review with no surface routes the review mode alone"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-review`."
route_shape: single
expected_intent: sk-code-review
expected_bundle: [sk-code-review]
expected_resources:
  - sk-code-review/references/review-core.md
  - sk-code-review/references/quick-reference.md
expected_workflow_mode: sk-code-review
expected_leaf_resources:
  - workflow_mode: sk-code-review
    leaf_resource_id: references/review-core.md
  - workflow_mode: sk-code-review
    leaf_resource_id: references/quick-reference.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-review
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: efa54f648388fd15d1e2faf3149af2c7200c88627c1c25daa9f8d321482814af
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-25
version: 1.0.0.0
---

# sk-code review with no surface routes the review mode alone

## 1. OVERVIEW

A review request with no stack or CI vocabulary scores the review mode and no surface, so the hub routes `sk-code-review` alone and bundles nothing after it. The scenario proves the compiled engine serves `single` with exactly `[sk-code-review]` for this prompt.

### Why This Matters

The hub contract says a surface is bundled after the primary mode when a mode scores, and is routed alone when no mode scores. This replay pins one side of that contract to a real prompt, so a routing change that bundles or defers here shows up as a failed scenario.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
review my diff
```

**Expected route**:
- Bundle: `[sk-code-review]`, one workflow mode and nothing after it.
- Route shape: `single`.

---

## 3. COMMAND SEQUENCE

Capture the serving status and the compiled decision with the live front door:
```
node .skilled/bin/compiled-route-status.cjs --hub sk-code
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review my diff"
```

## Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-review`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `surfaceBundle`, a `defer` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
