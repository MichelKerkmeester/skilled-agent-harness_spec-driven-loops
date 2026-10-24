---
id: CB-CR-001
category: compiled_routing
stage: routing
title: "sk-code single-surface bundle route serves compiled and matches legacy"
route_shape: surfaceBundle
expected_intent: sk-code-review
expected_bundle: [sk-code-review, sk-code-skilled]
expected_resources:
  - sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md
  - sk-code-skilled/references/typescript/quality-standards/overview-and-type-system.md
expected_workflow_mode: sk-code-review
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
evidence_manifest_digest: 1a42e542b2e3d2c544b456b7026de69af8f79b57c92b22945e92aef5aa3dd29c
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.2.0
---

# sk-code single-surface bundle route serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: sk-code is the hub whose primary decision can be a surface bundle — the router resolves one workflow mode, then attaches the single shipped surface packet, `sk-code-skilled`, as read-only evidence. This scenario proves the compiled engine serves the pair `[sk-code-review, sk-code-skilled]` and that the compiled decision is byte-equivalent to the legacy one for the same prompt. It preserves coverage of the surface-bundle contract while proving that one evidence packet resolves with its workflow mode.

---

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
review my typescript module for jank
```

**Expected route**:
- Bundle: `[sk-code-review, sk-code-skilled]` (one workflow mode followed by one read-only surface packet).
- Route shape: `surfaceBundle` — a single-surface bundle.

---

## 3. COMMAND SEQUENCE

Capture this hub's compiled-routing parity evidence with the live front door and serving-status probe:
```
node .skilled/bin/compiled-route-status.cjs --hub sk-code
node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review my typescript module for jank"
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled decision resolves exactly to `[sk-code-review, sk-code-skilled]`, matching the legacy decision. The bundle order must keep the workflow mode first and the surface packet second.
- **FAIL** iff the serving authority is not `compiled`, the compiled decision differs from the legacy decision, the bundle includes an additional surface packet, or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
