---
id: DI-R08
category: intra_routing_recall
stage: routing
title: 'Deep improvement skill benchmark routing'
description: "Verify a skill-benchmark-shaped request scores the SKILL_BENCHMARK intent and loads its resource set through the packet's own smart router."
expected_intent: SKILL_BENCHMARK
expected_resources:
  - references/skill-benchmark/operator-guide.md
  - references/skill-benchmark/scoring-contract.md
  - references/skill-benchmark/scenario-authoring.md
  - references/skill-benchmark/routing-optimization.md
  - assets/skill-benchmark/fixtures/deep-loop-workflows/routing-precision.md
version: 1.1.0.0
---

# DI-R08: Deep improvement skill benchmark routing

## 1. OVERVIEW

This scenario verifies the `deep-improvement` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a skill-benchmark-shaped request as `SKILL_BENCHMARK` and loads the `SKILL_BENCHMARK` resource set, distinct from the other eight intra-routing-recall intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, FULL_SETUP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working the skill-benchmark phase of an improvement session wants the packet to load the matching resource set.

**Exact prompt**:
```text
Benchmark a skill for skill routing, unprompted discovery, routing accuracy, and skill-benchmark diagnostics.
```

- Expected intent: `SKILL_BENCHMARK`

**Expected route**:
- Intent: `SKILL_BENCHMARK`
- Resource set: `references/shared/quick-reference.md` (always loaded first, unconditionally) plus every path in `RESOURCE_MAP["SKILL_BENCHMARK"]`. The exact prompt also contains the `ON_DEMAND_KEYWORDS` term `"benchmark"`, so the router's on-demand branch loads every `RESOURCE_MAP` path in addition to the selected intent's set. The observed resource set is therefore a superset of `RESOURCE_MAP["SKILL_BENCHMARK"]`, and this scenario asserts containment rather than equality.

**Why this route is expected**:
- `INTENT_SIGNALS["SKILL_BENCHMARK"]` keywords include `"benchmark a skill"`, `"skill routing"`, `"unprompted discovery"`, `"routing accuracy"`, and `"skill-benchmark"`; the exact prompt contains all of them.
- `RESOURCE_MAP["SKILL_BENCHMARK"]` lists `references/skill-benchmark/operator-guide.md`, `references/skill-benchmark/scoring-contract.md`, `references/skill-benchmark/scenario-authoring.md`, `references/skill-benchmark/routing-optimization.md`, and `assets/skill-benchmark/fixtures/deep-loop-workflows/routing-precision.md`.
- The smart router pseudocode calls `load_if_available(DEFAULT_RESOURCE)` unconditionally before the per-intent resource loop, so `references/shared/quick-reference.md` is always present regardless of intent.

**Desired user-visible outcome**: The AI resolves `SKILL_BENCHMARK` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and the smart router pseudocode.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-improvement/`.

### Prompt

- Prompt: `Benchmark a skill for skill routing, unprompted discovery, routing accuracy, and skill-benchmark diagnostics.`

### Commands

1. `sed -n '104,126p' .opencode/skills/system-deep-loop/deep-improvement/SKILL.md` - confirm the `SKILL_BENCHMARK` keyword list and resource map.
2. `for p in references/shared/quick-reference.md references/skill-benchmark/operator-guide.md references/skill-benchmark/scoring-contract.md references/skill-benchmark/scenario-authoring.md references/skill-benchmark/routing-optimization.md assets/skill-benchmark/fixtures/deep-loop-workflows/routing-precision.md; do test -e ".opencode/skills/system-deep-loop/deep-improvement/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-improvement packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `SKILL_BENCHMARK` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `SKILL_BENCHMARK` and a resource set containing every path in `expected_resources`; the on-demand branch also pulls the other intents' paths, which is expected for this prompt and is not a failure.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/di-r08-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `SKILL_BENCHMARK` as the dominant intent, and the loaded resource set contains `RESOURCE_MAP["SKILL_BENCHMARK"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["SKILL_BENCHMARK"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other eight intents (QUICK_REFERENCE, LOOP_EXECUTION, EVALUATION_POLICY, PROMOTION_OPERATIONS, TARGET_ONBOARDING, INTEGRATION_SCAN, MODEL_BENCHMARK, FULL_SETUP) before assuming a routing defect.

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
- Playbook ID: DI-R08
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/skill-benchmark.md`
