---
id: DL-CR-001
category: compiled_routing
stage: routing
title: "system-deep-loop research mode serves compiled and matches legacy"
route_shape: orderedBundle
expected_intent: research
expected_resources:
  - deep-research/references/protocol/loop-protocol.md
  - deep-research/references/state/state-jsonl.md
  - deep-research/references/convergence/convergence.md
expected_workflow_mode: research
expected_leaf_resources:
  - workflow_mode: research
    leaf_resource_id: references/protocol/loop-protocol.md
  - workflow_mode: research
    leaf_resource_id: references/state/state-jsonl.md
  - workflow_mode: research
    leaf_resource_id: references/convergence/convergence.md
full_inventory_intent: false
evidence_compiled_route: system-deep-loop/research
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 82d7f3af886d3e154da2b0f4ec01302c9266fd24ef89f30244a032d6ff77cc3c
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# system-deep-loop research mode serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: system-deep-loop resolves a **deep-mode ordering** — an iterative-investigation prompt selects `research` (packet `deep-research`) and its ordered protocol/state/convergence leaves, distinct from review, ai-council, or an improvement lane. This scenario proves the compiled engine serves that deep-mode decision (`servingAuthority: compiled`) and matches the legacy routing decision. Distinct rationale versus the other ordered-bundle hubs: this ordering is a **deep-loop workflow-mode selection** whose leaves are a protocol/state/convergence spine, not a transport pairing.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Use deep research to investigate why our advisor sometimes routes iterative investigation prompts incorrectly, compare the registry and advisor behavior, and write the findings as a research summary.
```

**Expected route**:
- Mode: `research`
- Route shape: `orderedBundle` — an ordered protocol/state/convergence leaf set.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill system-deep-loop --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios DL-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
