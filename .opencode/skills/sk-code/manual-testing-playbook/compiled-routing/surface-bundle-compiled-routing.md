---
id: CB-CR-001
category: compiled_routing
stage: routing
title: "sk-code surface-bundle route serves compiled and matches legacy"
route_shape: surfaceBundle
expected_intent: code-webflow
expected_resources:
  - code-webflow/references/implementation/animation-workflows/overview-decision-tree-and-css.md
  - code-webflow/references/implementation/animation-workflows/motion-dev-and-performance.md
expected_workflow_mode: code-webflow
expected_leaf_resources:
  - workflow_mode: code-webflow
    leaf_resource_id: references/implementation/animation-workflows/overview-decision-tree-and-css.md
  - workflow_mode: code-webflow
    leaf_resource_id: references/implementation/animation-workflows/motion-dev-and-performance.md
full_inventory_intent: false
evidence_compiled_route: sk-code/code-webflow
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 1a42e542b2e3d2c544b456b7026de69af8f79b57c92b22945e92aef5aa3dd29c
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# sk-code surface-bundle route serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: sk-code is the one hub whose primary decision is a **surface bundle** — the router first resolves a code surface (`code-webflow` / `code-opencode` / `code-review` / `quality`) and only then assembles that surface's leaves. This scenario proves the compiled engine serves that surface-bundle decision (`servingAuthority: compiled`) and that the compiled decision is byte-equivalent to the legacy one for the same prompt. The distinct rationale versus every other hub: only sk-code varies on a **surface axis**, so it is the sole coverage of a surface-bundle serving decision.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Add a scroll-triggered reveal animation to my Webflow site using GSAP and IntersectionObserver.
```

**Expected route**:
- Mode: `code-webflow` (surface-resolved bundle)
- Route shape: `surfaceBundle` — a surface pick precedes leaf assembly.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill sk-code --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios CB-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision. A conservative compiled defer serves the legacy decision unchanged and still passes.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
