---
id: SP-CR-001
category: compiled_routing
stage: routing
title: "sk-prompt default-mode route serves compiled and matches legacy"
route_shape: default
expected_intent: prompt-improve
expected_resources:
  - prompt-improve/references/depth-framework.md
expected_workflow_mode: prompt-improve
expected_leaf_resources:
  - workflow_mode: prompt-improve
    leaf_resource_id: references/depth-framework.md
full_inventory_intent: false
evidence_compiled_route: sk-prompt/prompt-improve
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: 6f581ac84cf282aea57da0298c66b5f52e08888b2ba5a4540706b94d55f5c39d
evidence_model: router-replay
evidence_reasoning_effort: n/a
created: 2026-07-21
version: 1.0.0.0
---

# sk-prompt default-mode route serves compiled and matches legacy

## 1. OVERVIEW

Serving-authority focus: sk-prompt is the **only hub with a non-null `defaultMode`** (`prompt-improve`) — a general prompt-craft request resolves to that default rather than through a surface pick, an ordered bundle, or a bundle rule. This scenario proves the compiled engine serves that default-mode decision (`servingAuthority: compiled`) and matches the legacy decision. Distinct rationale versus every other hub: it is the sole coverage of a **default-mode fallthrough** serving decision, the exact class this branch's routing cutover most affects.

## 2. SCENARIO CONTRACT

**Exact prompt**:
```text
Help me write a better prompt for a customer support chatbot.
```

**Expected route**:
- Mode: `prompt-improve` (default mode)
- Route shape: `default` — the hub's non-null `defaultMode` resolves the general request.

## 3. COMMAND SEQUENCE

The cutover executor runs this hub's compiled-routing parity command scoped to this directory and gates on the captured evidence contract:
```
run-skill-benchmark.cjs --skill sk-prompt --compiled-routing-parity on --route-gold off --playbook-dir <this-dir> --scenarios SP-CR-001 --trace-mode router
```

## Pass/Fail Criteria

- **PASS** iff the captured evidence shows `servingAuthority: compiled` and the compiled routing decision (workflow-mode intents) matches the legacy decision.
- **FAIL** iff the serving authority is not `compiled`, or the compiled routing decision names a different workflow mode than legacy (a real drift), or the compiled path is structurally broken (`resolver-missing`).
- **SKIP** iff the hub is outside the compiled serving closure (parity status `n/a`).
