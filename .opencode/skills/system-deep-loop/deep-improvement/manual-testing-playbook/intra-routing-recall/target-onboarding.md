---
id: DI-R05
category: intra_routing_recall
stage: routing
title: 'Deep improvement target onboarding routing'
description: "Verify a target-onboarding-shaped request scores the TARGET_ONBOARDING intent and loads its resource set through the packet's own smart router."
expected_intent: TARGET_ONBOARDING
expected_resources:
  - references/agent-improvement/target-onboarding.md
version: 1.1.0.0
---

# DI-R05: Deep improvement target onboarding routing

## 1. OVERVIEW

This scenario verifies the `deep-improvement` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a target-onboarding-shaped request as `TARGET_ONBOARDING` and loads the `TARGET_ONBOARDING` resource set, distinct from the other eight intra-routing-recall intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working the target-onboarding phase of an improvement session wants the packet to load the matching resource set.

**Exact prompt**:
```text
Onboard a new target with a target profile for a second target improvement run.
```

- Expected intent: `TARGET_ONBOARDING`

**Expected route**:
- Intent: `TARGET_ONBOARDING`
- Resource set: `references/shared/quick-reference.md` (always loaded first, unconditionally) plus every path in `RESOURCE_MAP["TARGET_ONBOARDING"]`. The exact prompt also contains the `ON_DEMAND_KEYWORDS` term `"target profile"`, so the router's on-demand branch loads every `RESOURCE_MAP` path in addition to the selected intent's set. The observed resource set is therefore a superset of `RESOURCE_MAP["TARGET_ONBOARDING"]`, and this scenario asserts containment rather than equality.

**Why this route is expected**:
- `INTENT_SIGNALS["TARGET_ONBOARDING"]` keywords include `"new target"`, `"target profile"`, and `"second target"`; the exact prompt contains all of them.
- `RESOURCE_MAP["TARGET_ONBOARDING"]` lists `references/agent-improvement/target-onboarding.md`.
- The smart router pseudocode calls `load_if_available(DEFAULT_RESOURCE)` unconditionally before the per-intent resource loop, so `references/shared/quick-reference.md` is always present regardless of intent.

**Desired user-visible outcome**: The AI resolves `TARGET_ONBOARDING` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and the smart router pseudocode.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-improvement/`.

### Prompt

- Prompt: `Onboard a new target with a target profile for a second target improvement run.`

### Commands

1. `sed -n '104,126p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` - confirm the `TARGET_ONBOARDING` keyword list and resource map.
2. `for p in references/shared/quick-reference.md references/agent-improvement/target-onboarding.md; do test -e ".opencode/skills/system-deep-loop/deep-improvement/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-improvement packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `TARGET_ONBOARDING` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `TARGET_ONBOARDING` and a resource set containing every path in `expected_resources`; the on-demand branch also pulls the other intents' paths, which is expected for this prompt and is not a failure.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/di-r05-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `TARGET_ONBOARDING` as the dominant intent, and the loaded resource set contains `RESOURCE_MAP["TARGET_ONBOARDING"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["TARGET_ONBOARDING"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other eight intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK, FULL_SETUP) before assuming a routing defect.

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
- Playbook ID: DI-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/target-onboarding.md`
