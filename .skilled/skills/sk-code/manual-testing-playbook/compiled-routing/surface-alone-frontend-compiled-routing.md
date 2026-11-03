---
id: CB-CR-009
category: compiled_routing
stage: routing
title: "sk-code keyboard focus fix in a web form routes the frontend surface alone"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-frontend`."
route_shape: single
expected_intent: sk-code-frontend
expected_bundle: [sk-code-frontend]
expected_resources:
  - sk-code-frontend/references/frontend-practice.md
  - sk-code-frontend/references/web-markup-and-css.md
  - sk-code-frontend/references/web-accessibility-patterns.md
expected_workflow_mode: sk-code-frontend
expected_leaf_resources:
  - workflow_mode: sk-code-frontend
    leaf_resource_id: references/frontend-practice.md
  - workflow_mode: sk-code-frontend
    leaf_resource_id: references/web-markup-and-css.md
  - workflow_mode: sk-code-frontend
    leaf_resource_id: references/web-accessibility-patterns.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-frontend
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 2c0ead68dfa8f79e7b17f59c92b1dc99598351f422514b43e1f780b60b37cb88
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-11-03
version: 1.0.1.0
---

# sk-code keyboard focus fix in a web form routes the frontend surface alone

## 1. OVERVIEW

A fix request names keyboard focus in a web form but no workflow or review verb, so no workflow mode scores. The phrase is frontend surface vocabulary, so the hub routes the `sk-code-frontend` surface alone, and the acting agent applies the accessibility reference directly. The scenario also pins the leaf set the surface loads for that intent. The scenario proves the compiled engine serves `single` with exactly `[sk-code-frontend]` for this prompt.

### Why This Matters

The hub contract says a surface is bundled after the primary mode when a mode scores, and is routed alone when no mode scores. This replay pins the frontend side of that contract to a real prompt, so a routing change that bundles, defers or picks another surface here shows up as a failed scenario. It also pins the intent's leaf set, so a resource-map change that drops one of those leaves fails the assertion instead of loading less evidence without a signal.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
fix the keyboard focus order in this web form
```

**Expected route**:
- Bundle: `[sk-code-frontend]`, one surface and nothing after it.
- Route shape: `single`.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. Capture the serving status:
   ```
   node .skilled/bin/compiled-route-status.cjs --hub sk-code
   ```
2. Capture the compiled decision:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix the keyboard focus order in this web form"
   ```

### Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-frontend`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `surfaceBundle`, a `defer` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

---

## 4. SOURCE FILES

- `manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-frontend/SKILL.md` - Frontend surface contract and its accessibility reference.
- `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` - Frontend intent signals and the resource map this scenario asserts.
- `.skilled/bin/compiled-route.cjs` - Compiled route front door.

---

## 5. SOURCE METADATA

- Group: Compiled Routing
- Playbook ID: CB-CR-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/surface-alone-frontend-compiled-routing.md`
- **Created**: 2026-11-03
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: not needed
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
