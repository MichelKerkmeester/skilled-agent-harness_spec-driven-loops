---
id: MT-CR-001
category: compiled_routing
stage: routing
title: "mcp-tooling design-transport ordered bundle serves compiled and matches legacy"
route_shape: orderedBundle
expected_intent: mcp-refero
expected_resources:
  - mcp-refero/references/tool-surface.md
  - mcp-refero/references/mcp-wiring.md
expected_workflow_mode: mcp-refero
expected_leaf_resources:
  - workflow_mode: mcp-refero
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-refero
    leaf_resource_id: references/mcp-wiring.md
full_inventory_intent: false
evidence_compiled_route: mcp-tooling/mcp-refero
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: afe102ea655e81025a471e6b33479b3d84fa2bb990a533da21467294e38a9ff0
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# mcp-tooling design-transport ordered bundle serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: mcp-tooling's characteristic decision is an **ordered design-transport bundle** — the hub selects and orders transports (`mcp-figma` / `mcp-refero` / `mcp-mobbin` and the devtools transports) for one prompt. This scenario exercises the Refero real-app-reference transport within that ordered-bundle family, and promotes design-transport routing from a prose-supplemental aside to a primary, evidence-bearing compiled-routing row: it proves the compiled engine serves that transport decision (`servingAuthority: compiled`) and matches the legacy routing decision. Distinct rationale versus the other ordered-bundle hubs: this ordering selects a **design-reference transport** (a real shipped-app UI source), not a deep-loop mode or a CLI executor.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Pull real shipped-app UI references from Refero and Mobbin for this checkout screen.
```

**Expected route**:
- Mode: `mcp-refero`
- Route shape: `orderedBundle` — a design-transport resolved within the hub's ordered-transport family.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill mcp-tooling --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios MT-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
