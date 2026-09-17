---
id: DR-R06
category: intra_routing_recall
stage: routing
title: 'Deep research spec anchoring routing'
description: "Verify a spec-anchoring-shaped request scores the SPEC_ANCHORING intent and loads its resource set through the packet's own smart router."
expected_intent: SPEC_ANCHORING
expected_resources:
  - references/protocol/spec-check-protocol.md
  - references/state/state-outputs.md
version: 1.1.0.0
---

# DR-R06: Deep research spec anchoring routing

## 1. OVERVIEW

This scenario verifies the `deep-research` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a spec-anchoring-shaped request as `SPEC_ANCHORING` and loads the `SPEC_ANCHORING` resource set, distinct from the other seven intra-routing-recall intents (LOOP_SETUP, ITERATION, CONVERGENCE, RECOVERY, STATE, RUNTIME_PARITY, RESOURCE_MAP).

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator working on the spec-anchoring phase of a research loop wants the packet to load the matching resource set.

**Exact prompt**:
```text
Use spec anchoring with a generated fence, folder_state classification, and lock handling for the research run.
```

- Expected intent: `SPEC_ANCHORING`

**Expected route**:
- Intent: `SPEC_ANCHORING`
- Resource set: `references/guides/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["SPEC_ANCHORING"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["SPEC_ANCHORING"]` keywords include `"spec anchoring"`, `"generated fence"`, `"folder_state"`, and `"lock"`; the exact prompt contains all of them.
- `RESOURCE_MAP["SPEC_ANCHORING"]` lists `references/protocol/spec-check-protocol.md`, and `references/state/state-outputs.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/guides/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `SPEC_ANCHORING` as the dominant intent and names its resource set, not the resource set of any other intra-routing-recall intent.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-research/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-research/`.

### Prompt

- Prompt: `Use spec anchoring with a generated fence, folder_state classification, and lock handling for the research run.`

### Commands

1. `sed -n '113,132p' .opencode/skills/system-deep-loop/deep-research/SKILL.md` - confirm the `SPEC_ANCHORING` keyword list and resource map.
2. `for p in references/guides/quick-reference.md references/protocol/spec-check-protocol.md references/state/state-outputs.md; do test -e ".opencode/skills/system-deep-loop/deep-research/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-research packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `SPEC_ANCHORING` keyword list and its resource map entries. Step 2 prints `OK` for every path. Step 3's transcript reports intent `SPEC_ANCHORING` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dr-r06-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `SPEC_ANCHORING` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["SPEC_ANCHORING"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["SPEC_ANCHORING"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap against the other seven intents (LOOP_SETUP, ITERATION, CONVERGENCE, RECOVERY, STATE, RUNTIME_PARITY, RESOURCE_MAP) before assuming a routing defect.

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
- Playbook ID: DR-R06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/spec-anchoring.md`
