---
id: DV-R01
category: intra_routing_recall
stage: routing
title: 'Deep review setup routing'
description: "Verify a deep-review setup request scores the REVIEW_SETUP intent and loads the setup resource set through the packet's own smart router."
expected_intent: REVIEW_SETUP
expected_resources:
  - references/protocol/quick-reference.md
  - references/protocol/loop-protocol.md
  - references/state/state-format.md
  - references/state/state-outputs.md
  - references/state/state-reducer-registry.md
  - assets/deep-review-strategy.md
  - references/state/state-jsonl.md
version: 1.1.0.0
---

# DV-R01: Deep review setup routing

## 1. OVERVIEW

This scenario verifies the `deep-review` packet's own intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a setup-shaped request as `REVIEW_SETUP` and loads the setup resource set, distinct from the parent `system-deep-loop` hub's mode-level routing which selects `review` before this packet even loads.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator starting a fresh review wants the packet to load its setup and state-contract references before the first iteration.

**Exact prompt**:
```text
Start deep review in review mode for an audit spec workflow and prepare convergence review setup.
```

- Expected intent: `REVIEW_SETUP`

**Expected route**:
- Intent: `REVIEW_SETUP`
- Resource set: `references/protocol/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["REVIEW_SETUP"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["REVIEW_SETUP"]` keywords include `"deep review"`, `"review mode"`, `"convergence review"`, and `"audit spec"`; the exact prompt contains all four.
- `RESOURCE_MAP["REVIEW_SETUP"]` lists `references/protocol/loop-protocol.md`, `references/state/state-format.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md`, `assets/deep-review-strategy.md`, and `references/state/state-jsonl.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/protocol/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `REVIEW_SETUP` as the dominant intent and names the setup resource set, not the iteration, convergence, or report resource sets.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-review/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-review/`.

### Prompt

- Prompt: `Start deep review in review mode for an audit spec workflow and prepare convergence review setup.`

### Commands

1. `sed -n '106,149p' .opencode/skills/system-deep-loop/deep-review/SKILL.md` - confirm the `REVIEW_SETUP` keyword list and resource map.
2. `for p in references/protocol/quick-reference.md references/protocol/loop-protocol.md references/state/state-format.md references/state/state-outputs.md references/state/state-reducer-registry.md assets/deep-review-strategy.md references/state/state-jsonl.md; do test -e ".opencode/skills/system-deep-loop/deep-review/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-review packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `REVIEW_SETUP` keyword list and its resource map entries. Step 2 prints `OK` for all seven paths. Step 3's transcript reports intent `REVIEW_SETUP` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dv-r01-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `REVIEW_SETUP` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["REVIEW_SETUP"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["REVIEW_SETUP"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap: `REVIEW_SETUP` shares no keywords with `REVIEW_ITERATION`, `REVIEW_CONVERGENCE`, or `REVIEW_REPORT`, so an unexpected winner points to a keyword-list edit in `SKILL.md` rather than this scenario's prompt.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` §2 | `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS` this scenario exercises |

---

## 5. SOURCE METADATA

- Group: Intra Routing Recall
- Playbook ID: DV-R01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/review-setup.md`
