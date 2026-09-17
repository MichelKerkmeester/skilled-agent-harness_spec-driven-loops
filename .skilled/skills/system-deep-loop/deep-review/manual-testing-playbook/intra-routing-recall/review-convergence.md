---
id: DV-R03
category: intra_routing_recall
stage: routing
title: 'Deep review convergence routing'
description: "Verify a convergence-evaluation request scores the REVIEW_CONVERGENCE intent and loads the convergence and gate resource set through the packet's own smart router."
expected_intent: REVIEW_CONVERGENCE
expected_resources:
  - references/protocol/quick-reference.md
  - references/convergence/convergence.md
  - references/convergence/convergence-signals.md
  - references/state/state-outputs.md
  - references/protocol/completion-criteria.md
  - references/protocol/loop-state-and-gates.md
  - references/convergence/convergence-recovery.md
version: 1.1.0.0
---

# DV-R03: Deep review convergence routing

## 1. OVERVIEW

This scenario verifies the `deep-review` packet's intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a convergence-evaluation request as `REVIEW_CONVERGENCE` and loads the convergence and gate resource set, distinct from the setup, iteration, and report resource sets.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator wants to know whether the review loop has covered every dimension and is legally allowed to stop.

**Exact prompt**:
```text
Evaluate review convergence, coverage gate status, verdict, binary gate, and all dimensions before stopping.
```

- Expected intent: `REVIEW_CONVERGENCE`

**Expected route**:
- Intent: `REVIEW_CONVERGENCE`
- Resource set: `references/protocol/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["REVIEW_CONVERGENCE"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["REVIEW_CONVERGENCE"]` keywords include `"review convergence"`, `"coverage gate"`, `"verdict"`, `"binary gate"`, and `"all dimensions"`; the exact prompt contains all five.
- `RESOURCE_MAP["REVIEW_CONVERGENCE"]` lists `references/convergence/convergence.md`, `references/convergence/convergence-signals.md`, `references/state/state-outputs.md`, `references/protocol/completion-criteria.md`, `references/protocol/loop-state-and-gates.md`, and `references/convergence/convergence-recovery.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/protocol/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `REVIEW_CONVERGENCE` as the dominant intent and names the convergence and gate resource set, not the setup, iteration, or report resource sets.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-review/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-review/`.

### Prompt

- Prompt: `Evaluate review convergence, coverage gate status, verdict, binary gate, and all dimensions before stopping.`

### Commands

1. `sed -n '106,149p' .opencode/skills/system-deep-loop/deep-review/SKILL.md` - confirm the `REVIEW_CONVERGENCE` keyword list and resource map.
2. `for p in references/protocol/quick-reference.md references/convergence/convergence.md references/convergence/convergence-signals.md references/state/state-outputs.md references/protocol/completion-criteria.md references/protocol/loop-state-and-gates.md references/convergence/convergence-recovery.md; do test -e ".opencode/skills/system-deep-loop/deep-review/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-review packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `REVIEW_CONVERGENCE` keyword list and its resource map entries. Step 2 prints `OK` for all seven paths. Step 3's transcript reports intent `REVIEW_CONVERGENCE` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dv-r03-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `REVIEW_CONVERGENCE` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["REVIEW_CONVERGENCE"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["REVIEW_CONVERGENCE"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, note that `"verdict"` also appears in `REVIEW_REPORT`'s keyword list; compare the full match count and weight for each candidate intent before assuming a routing defect.

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
- Playbook ID: DV-R03
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/review-convergence.md`
