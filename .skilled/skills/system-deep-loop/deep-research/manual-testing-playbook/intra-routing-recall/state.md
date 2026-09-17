---
id: DR-R05
category: intra_routing_recall
stage: routing
title: 'Deep research state routing'
description: "Verify a state-shaped request scores the STATE intent and loads its resource set through the packet's own smart router."
expected_intent: STATE
expected_resources:
  - references/state/state-format.md
  - references/state/state-jsonl.md
  - references/state/state-outputs.md
  - references/state/state-reducer-registry.md
  - assets/deep-research-strategy.md
version: 1.1.0.0
---

# DR-R05: Deep research state routing

## 1. OVERVIEW

This scenario verifies the `deep-research` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a state-shaped request as `STATE` and loads the `STATE` resource set, distinct from the other seven intra-routing-recall intents (LOOP_SETUP, ITERATION, CONVERGENCE, RECOVERY, SPEC_ANCHORING, RUNTIME_PARITY, RESOURCE_MAP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working on the state phase of a research loop wants the packet to load the matching resource set.

**Exact prompt**:
```text
Explain the state file, jsonl strategy, dashboard, registry, and lineage records for a research session.
```

- Expected intent: `STATE`

**Expected route**:
- Intent: `STATE`
- Resource set: `references/guides/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["STATE"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["STATE"]` keywords include `"state file"`, `"jsonl"`, `"strategy"`, `"dashboard"`, `"registry"`, and `"lineage"`; the exact prompt contains all of them.
- `RESOURCE_MAP["STATE"]` lists `references/state/state-format.md`, `references/state/state-jsonl.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md`, and `assets/deep-research-strategy.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/guides/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `STATE` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-research/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-research/`.

### Prompt

- Prompt: `Explain the state file, jsonl strategy, dashboard, registry, and lineage records for a research session.`

### Commands

1. `sed -n '113,132p' .opencode/skills/system-deep-loop/deep-research/SKILL.md` - confirm the `STATE` keyword list and resource map.
2. `for p in references/guides/quick-reference.md references/state/state-format.md references/state/state-jsonl.md references/state/state-outputs.md references/state/state-reducer-registry.md assets/deep-research-strategy.md; do test -e ".opencode/skills/system-deep-loop/deep-research/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-research packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `STATE` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `STATE` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dr-r05-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `STATE` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["STATE"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["STATE"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other seven intents (LOOP_SETUP, ITERATION, CONVERGENCE, RECOVERY, SPEC_ANCHORING, RUNTIME_PARITY, RESOURCE_MAP) before assuming a routing defect.

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
- Playbook ID: DR-R05
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/state.md`
