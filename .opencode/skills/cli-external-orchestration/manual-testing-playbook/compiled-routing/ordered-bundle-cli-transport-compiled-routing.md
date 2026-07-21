---
id: CE-CR-001
category: compiled_routing
stage: routing
title: "cli-external-orchestration opencode transport serves compiled and matches legacy"
route_shape: orderedBundle
expected_intent: cli-opencode
expected_resources:
  - cli-opencode/references/cli-reference.md
  - cli-opencode/references/integration-patterns.md
expected_workflow_mode: cli-opencode
expected_leaf_resources:
  - workflow_mode: cli-opencode
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-opencode
    leaf_resource_id: references/integration-patterns.md
full_inventory_intent: false
evidence_compiled_route: cli-external-orchestration/cli-opencode
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 8421624a5e7550ff0471728ea9ec6c116c083a21a3880169e5a1b57fa1b5cd7f
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# cli-external-orchestration opencode transport serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: cli-external-orchestration resolves a **CLI-transport ordering** — a dispatch prompt selects one of `cli-opencode` / `cli-codex` / `cli-claude-code` and assembles that transport's ordered reference set. This scenario proves the compiled engine serves that transport decision (`servingAuthority: compiled`) and matches the legacy decision. Distinct rationale versus the other ordered-bundle hubs: this ordering selects an **external CLI executor transport**, not a design pairing or a deep-loop mode.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.
```

**Expected route**:
- Mode: `cli-opencode`
- Route shape: `orderedBundle` — an ordered CLI-transport reference set.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill cli-external-orchestration --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios CE-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
