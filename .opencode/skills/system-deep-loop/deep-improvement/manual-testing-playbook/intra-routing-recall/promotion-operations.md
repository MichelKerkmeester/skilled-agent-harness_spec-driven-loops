---
id: DI-R04
category: intra_routing_recall
stage: routing
title: 'Deep improvement promotion operations routing'
description: "Verify a promotion-operations-shaped request scores the PROMOTION_OPERATIONS intent and loads its resource set through the packet's own smart router."
expected_intent: PROMOTION_OPERATIONS
expected_resources:
  - references/shared/rollback-runbook.md
  - references/agent-improvement/mirror-drift-policy.md
  - references/shared/promotion-rules.md
  - references/agent-improvement/stress-test-protocol.md
  - references/shared/promotion-gate-contract.md
version: 1.1.0.0
---

# DI-R04: Deep improvement promotion operations routing

## 1. OVERVIEW

This scenario verifies the `deep-improvement` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a promotion-operations-shaped request as `PROMOTION_OPERATIONS` and loads the `PROMOTION_OPERATIONS` resource set, distinct from the other eight intra-routing-recall intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working the promotion-operations phase of an improvement session wants the packet to load the matching resource set.

**Exact prompt**:
```text
Handle promote and rollback operations with mirror drift review and an approval gate.
```

- Expected intent: `PROMOTION_OPERATIONS`

**Expected route**:
- Intent: `PROMOTION_OPERATIONS`
- Resource set: `references/shared/quick-reference.md` (always loaded first, unconditionally) plus every path in `RESOURCE_MAP["PROMOTION_OPERATIONS"]`. The exact prompt also contains the `ON_DEMAND_KEYWORDS` term `"mirror drift"`, so the router's on-demand branch loads every `RESOURCE_MAP` path in addition to the selected intent's set. The observed resource set is therefore a superset of `RESOURCE_MAP["PROMOTION_OPERATIONS"]`, and this scenario asserts containment rather than equality.

**Why this route is expected**:
- `INTENT_SIGNALS["PROMOTION_OPERATIONS"]` keywords include `"promote"`, `"rollback"`, `"mirror drift"`, and `"approval gate"`; the exact prompt contains all of them.
- `RESOURCE_MAP["PROMOTION_OPERATIONS"]` lists `references/shared/rollback-runbook.md`, `references/agent-improvement/mirror-drift-policy.md`, `references/shared/promotion-rules.md`, `references/agent-improvement/stress-test-protocol.md`, and `references/shared/promotion-gate-contract.md`.
- The smart router pseudocode calls `load_if_available(DEFAULT_RESOURCE)` unconditionally before the per-intent resource loop, so `references/shared/quick-reference.md` is always present regardless of intent.

**Desired user-visible outcome**: The AI resolves `PROMOTION_OPERATIONS` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and the smart router pseudocode.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-improvement/`.

### Prompt

- Prompt: `Handle promote and rollback operations with mirror drift review and an approval gate.`

### Commands

1. `sed -n '104,126p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` - confirm the `PROMOTION_OPERATIONS` keyword list and resource map.
2. `for p in references/shared/quick-reference.md references/shared/rollback-runbook.md references/agent-improvement/mirror-drift-policy.md references/shared/promotion-rules.md references/agent-improvement/stress-test-protocol.md references/shared/promotion-gate-contract.md; do test -e ".opencode/skills/system-deep-loop/deep-improvement/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-improvement packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `PROMOTION_OPERATIONS` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `PROMOTION_OPERATIONS` and a resource set containing every path in `expected_resources`; the on-demand branch also pulls the other intents' paths, which is expected for this prompt and is not a failure.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/di-r04-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `PROMOTION_OPERATIONS` as the dominant intent, and the loaded resource set contains `RESOURCE_MAP["PROMOTION_OPERATIONS"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["PROMOTION_OPERATIONS"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other eight intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP) before assuming a routing defect.

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
- Playbook ID: DI-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/promotion-operations.md`
