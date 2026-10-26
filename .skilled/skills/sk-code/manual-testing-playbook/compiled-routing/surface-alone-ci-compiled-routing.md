---
id: CB-CR-003
category: compiled_routing
stage: routing
title: "sk-code CI edit routes the CI surface alone"
description: "This scenario validates that the compiled sk-code route for one prompt is a single route to `sk-code-ci`."
route_shape: single
expected_intent: sk-code-ci
expected_bundle: [sk-code-ci]
expected_resources:
  - sk-code-ci/references/ci-workflow-standards.md
  - sk-code-ci/references/job-shape-rules.md
expected_workflow_mode: sk-code-ci
expected_leaf_resources:
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/ci-workflow-standards.md
  - workflow_mode: sk-code-ci
    leaf_resource_id: references/job-shape-rules.md
full_inventory_intent: false
evidence_compiled_route: sk-code/sk-code-ci
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: efa54f648388fd15d1e2faf3149af2c7200c88627c1c25daa9f8d321482814af
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-10-25
version: 1.0.1.0
---

# sk-code CI edit routes the CI surface alone

## 1. OVERVIEW

A workflow edit names CI vocabulary but no review or quality verb, so no workflow mode scores. The hub then routes the `sk-code-ci` surface alone, and the acting agent applies the job-shape rules directly. The scenario proves the compiled engine serves `single` with exactly `[sk-code-ci]` for this prompt.

### Why This Matters

The hub contract says a surface is bundled after the primary mode when a mode scores, and is routed alone when no mode scores. This replay pins one side of that contract to a real prompt, so a routing change that bundles or defers here shows up as a failed scenario.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
add a timeout-minutes to the ci job
```

**Expected route**:
- Bundle: `[sk-code-ci]`, one surface and nothing after it.
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
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "add a timeout-minutes to the ci job"
   ```

### Pass/Fail Criteria

- **PASS** iff the status shows `servingAuthority: compiled` and the decision prints `"selectionKind":"single"` with one target whose `workflowMode` is `sk-code-ci`.
- **FAIL** iff the serving authority is not `compiled`, the decision is a `surfaceBundle`, a `defer` or a different single target, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).

---

## 4. SOURCE FILES

- `manual-testing-playbook.md` - Root directory page and scenario summary.
- `.skilled/skills/sk-code/sk-code-ci/SKILL.md` - CI surface contract and its job-shape references.
- `.skilled/skills/sk-code/ROUTER.md` - Surface intent signals and the CI resource map.
- `.skilled/bin/compiled-route.cjs` - Compiled route front door.

---

## 5. SOURCE METADATA

- Group: Compiled Routing
- Playbook ID: CB-CR-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `compiled-routing/surface-alone-ci-compiled-routing.md`
- **Created**: 2026-10-25
- **Critical path**: No
- **Destructive**: No
- **Sandbox**: not needed
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run
