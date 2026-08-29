---
id: DR-R04
category: intra_routing_recall
stage: routing
title: 'Deep research recovery routing'
description: "Verify a recovery-shaped request scores the RECOVERY intent and loads its resource set through the packet's own smart router."
expected_intent: RECOVERY
expected_resources:
  - references/convergence/convergence-recovery.md
  - references/state/state-reducer-registry.md
version: 1.1.0.0
---

# DR-R04: Deep research recovery routing

## 1. OVERVIEW

This scenario verifies the `deep-research` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a recovery-shaped request as `RECOVERY` and loads the `RECOVERY` resource set, distinct from the other seven intra-routing-recall intents (LOOP_SETUP, ITERATION, CONVERGENCE, STATE, SPEC_ANCHORING, RUNTIME_PARITY, RESOURCE_MAP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working on the recovery phase of a research loop wants the packet to load the matching resource set.

**Exact prompt**:
```text
The research loop is stuck after a timeout; run recovery, reconstruct state, and resolve the blocked stop.
```

- Expected intent: `RECOVERY`

**Expected route**:
- Intent: `RECOVERY`
- Resource set: `references/guides/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["RECOVERY"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["RECOVERY"]` keywords include `"stuck"`, `"timeout"`, `"recovery"`, `"reconstruct"`, and `"blocked stop"`; the exact prompt contains all of them.
- `RESOURCE_MAP["RECOVERY"]` lists `references/convergence/convergence-recovery.md`, and `references/state/state-reducer-registry.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/guides/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `RECOVERY` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-research/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-research/`.

### Prompt

- Prompt: `The research loop is stuck after a timeout; run recovery, reconstruct state, and resolve the blocked stop.`

### Commands

1. `sed -n '113,132p' .opencode/skills/system-deep-loop/deep-research/SKILL.md` - confirm the `RECOVERY` keyword list and resource map.
2. `for p in references/guides/quick-reference.md references/convergence/convergence-recovery.md references/state/state-reducer-registry.md; do test -e ".opencode/skills/system-deep-loop/deep-research/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-research packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `RECOVERY` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `RECOVERY` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dr-r04-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `RECOVERY` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["RECOVERY"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["RECOVERY"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other seven intents (LOOP_SETUP, ITERATION, CONVERGENCE, STATE, SPEC_ANCHORING, RUNTIME_PARITY, RESOURCE_MAP) before assuming a routing defect.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md` §2 | `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: DR-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/recovery.md`
