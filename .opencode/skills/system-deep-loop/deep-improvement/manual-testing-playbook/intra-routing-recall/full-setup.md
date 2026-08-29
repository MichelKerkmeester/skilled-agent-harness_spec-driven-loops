---
id: DI-R10
category: intra_routing_recall
stage: routing
title: 'Deep improvement full setup routing'
description: "Verify a full-setup-shaped request scores the FULL_SETUP intent and loads its resource set through the packet's own smart router."
expected_intent: FULL_SETUP
expected_resources:
  - assets/agent-improvement/improvement-charter.md
  - assets/agent-improvement/improvement-strategy.md
version: 1.1.0.0
---

# DI-R10: Deep improvement full setup routing

## 1. OVERVIEW

This scenario verifies the `deep-improvement` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a full-setup-shaped request as `FULL_SETUP` and loads the `FULL_SETUP` resource set, distinct from the other eight intra-routing-recall intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working the full-setup phase of an improvement session wants the packet to load the matching resource set.

**Exact prompt**:
```text
Run full setup to initialize runtime with the charter and strategy for an improvement session.
```

- Expected intent: `FULL_SETUP`

**Expected route**:
- Intent: `FULL_SETUP`
- Resource set: `references/shared/quick-reference.md` (always loaded first, unconditionally) plus every path in `RESOURCE_MAP["FULL_SETUP"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["FULL_SETUP"]` keywords include `"full setup"`, `"initialize runtime"`, `"charter"`, and `"strategy"`; the exact prompt contains all of them.
- `RESOURCE_MAP["FULL_SETUP"]` lists `assets/agent-improvement/improvement-charter.md`, and `assets/agent-improvement/improvement-strategy.md`.
- The smart router pseudocode calls `load_if_available(DEFAULT_RESOURCE)` unconditionally before the per-intent resource loop, so `references/shared/quick-reference.md` is always present regardless of intent.

**Desired user-visible outcome**: The AI resolves `FULL_SETUP` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and the smart router pseudocode.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-improvement/`.

### Prompt

- Prompt: `Run full setup to initialize runtime with the charter and strategy for an improvement session.`

### Commands

1. `sed -n '104,126p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` - confirm the `FULL_SETUP` keyword list and resource map.
2. `for p in references/shared/quick-reference.md assets/agent-improvement/improvement-charter.md assets/agent-improvement/improvement-strategy.md; do test -e ".opencode/skills/system-deep-loop/deep-improvement/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-improvement packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `FULL_SETUP` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `FULL_SETUP` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/di-r10-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `FULL_SETUP` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["FULL_SETUP"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["FULL_SETUP"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other eight intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, SKILL_BENCHMARK) before assuming a routing defect.

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
- Playbook ID: DI-R10
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/full-setup.md`
