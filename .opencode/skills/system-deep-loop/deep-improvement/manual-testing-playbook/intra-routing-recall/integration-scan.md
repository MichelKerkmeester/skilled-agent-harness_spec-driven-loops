---
id: DI-R06
category: intra_routing_recall
stage: routing
title: 'Deep improvement integration scan routing'
description: "Verify a integration-scan-shaped request scores the INTEGRATION_SCAN intent and loads its resource set through the packet's own smart router."
expected_intent: INTEGRATION_SCAN
expected_resources:
  - references/agent-improvement/integration-scanning.md
  - references/model-benchmark/evaluator-contract.md
  - references/agent-improvement/profiling-audit-log.md
version: 1.1.0.0
---

# DI-R06: Deep improvement integration scan routing

## 1. OVERVIEW

This scenario verifies the `deep-improvement` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a integration-scan-shaped request as `INTEGRATION_SCAN` and loads the `INTEGRATION_SCAN` resource set, distinct from the other eight intra-routing-recall intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working the integration-scan phase of an improvement session wants the packet to load the matching resource set.

**Exact prompt**:
```text
Run an integration scan surfaces pass with dynamic profile and 5-dimension scoring context.
```

- Expected intent: `INTEGRATION_SCAN`

**Expected route**:
- Intent: `INTEGRATION_SCAN`
- Resource set: `references/shared/quick-reference.md` (always loaded first, unconditionally) plus every path in `RESOURCE_MAP["INTEGRATION_SCAN"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["INTEGRATION_SCAN"]` keywords include `"integration"`, `"scan surfaces"`, `"dynamic profile"`, and `"5-dimension"`; the exact prompt contains all of them.
- `RESOURCE_MAP["INTEGRATION_SCAN"]` lists `references/agent-improvement/integration-scanning.md`, `references/model-benchmark/evaluator-contract.md`, and `references/agent-improvement/profiling-audit-log.md`.
- The smart router pseudocode calls `load_if_available(DEFAULT_RESOURCE)` unconditionally before the per-intent resource loop, so `references/shared/quick-reference.md` is always present regardless of intent.

**Desired user-visible outcome**: The AI resolves `INTEGRATION_SCAN` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and the smart router pseudocode.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-improvement/`.

### Prompt

- Prompt: `Run an integration scan surfaces pass with dynamic profile and 5-dimension scoring context.`

### Commands

1. `sed -n '104,126p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` - confirm the `INTEGRATION_SCAN` keyword list and resource map.
2. `for p in references/shared/quick-reference.md references/agent-improvement/integration-scanning.md references/model-benchmark/evaluator-contract.md references/agent-improvement/profiling-audit-log.md; do test -e ".opencode/skills/system-deep-loop/deep-improvement/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-improvement packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `INTEGRATION_SCAN` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `INTEGRATION_SCAN` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/di-r06-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `INTEGRATION_SCAN` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["INTEGRATION_SCAN"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["INTEGRATION_SCAN"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other eight intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP) before assuming a routing defect.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 | `INTENT_SIGNALS`, `RESOURCE_MAP`, and smart router pseudocode this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: DI-R06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/integration-scan.md`
