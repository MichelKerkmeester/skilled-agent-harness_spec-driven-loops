---
id: DV-R02
category: intra_routing_recall
stage: routing
title: 'Deep review iteration routing'
description: "Verify a review-iteration request scores the REVIEW_ITERATION intent and loads the iteration and convergence resource set through the packet's own smart router."
expected_intent: REVIEW_ITERATION
expected_resources:
  - references/protocol/quick-reference.md
  - references/protocol/loop-protocol.md
  - references/convergence/convergence.md
  - references/convergence/convergence-signals.md
version: 1.1.0.0
---

# DV-R02: Deep review iteration routing

## 1. OVERVIEW

This scenario verifies the `deep-review` packet's intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores an iteration-shaped request as `REVIEW_ITERATION` and loads the iteration resource set, distinct from the setup, convergence, and report resource sets.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator mid-loop wants the packet to load the loop protocol and convergence references before running the next dimension review.

**Exact prompt**:
```text
Run a review iteration for a dimension review and capture review findings with P0, P1, and P2 severity.
```

- Expected intent: `REVIEW_ITERATION`

**Expected route**:
- Intent: `REVIEW_ITERATION`
- Resource set: `references/protocol/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["REVIEW_ITERATION"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["REVIEW_ITERATION"]` keywords include `"review iteration"`, `"dimension review"`, `"review findings"`, `"P0"`, `"P1"`, and `"P2"`; the exact prompt contains all six.
- `RESOURCE_MAP["REVIEW_ITERATION"]` lists `references/protocol/loop-protocol.md`, `references/convergence/convergence.md`, and `references/convergence/convergence-signals.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/protocol/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `REVIEW_ITERATION` as the dominant intent and names the iteration resource set, not the setup, convergence, or report resource sets.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-review/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-review/`.

### Prompt

- Prompt: `Run a review iteration for a dimension review and capture review findings with P0, P1, and P2 severity.`

### Commands

1. `sed -n '106,149p' .opencode/skills/system-deep-loop/deep-review/SKILL.md` - confirm the `REVIEW_ITERATION` keyword list and resource map.
2. `for p in references/protocol/quick-reference.md references/protocol/loop-protocol.md references/convergence/convergence.md references/convergence/convergence-signals.md; do test -e ".opencode/skills/system-deep-loop/deep-review/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-review packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `REVIEW_ITERATION` keyword list and its resource map entries. Step 2 prints `OK` for all four paths. Step 3's transcript reports intent `REVIEW_ITERATION` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dv-r02-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `REVIEW_ITERATION` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["REVIEW_ITERATION"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["REVIEW_ITERATION"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, compare keyword overlap: `REVIEW_ITERATION` shares no keywords with `REVIEW_SETUP`, `REVIEW_CONVERGENCE`, or `REVIEW_REPORT`, so an unexpected winner points to a keyword-list edit in `SKILL.md` rather than this scenario's prompt.

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
- Playbook ID: DV-R02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/review-iteration.md`
