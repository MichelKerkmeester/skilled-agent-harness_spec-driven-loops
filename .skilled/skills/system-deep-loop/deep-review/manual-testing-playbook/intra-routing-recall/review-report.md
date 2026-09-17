---
id: DV-R04
category: intra_routing_recall
stage: routing
title: 'Deep review report routing'
description: "Verify a report-preparation request scores the REVIEW_REPORT intent and loads the state and dashboard resource set through the packet's own smart router."
expected_intent: REVIEW_REPORT
expected_resources:
  - references/protocol/quick-reference.md
  - references/state/state-format.md
  - references/state/state-outputs.md
  - references/state/state-reducer-registry.md
  - assets/deep-review-dashboard.md
version: 1.1.0.0
---

# DV-R04: Deep review report routing

## 1. OVERVIEW

This scenario verifies the `deep-review` packet's intra-packet smart router (`SKILL.md` §2 `Smart Router Pseudocode`) scores a report-preparation request as `REVIEW_REPORT` and loads the state and dashboard resource set, distinct from the setup, iteration, and convergence resource sets.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: An operator finishing a review wants the packet to load the state contract and dashboard references before writing the final report.

**Exact prompt**:
```text
Prepare the review report with remediation, verdict, release readiness, and planning packet results.
```

- Expected intent: `REVIEW_REPORT`

**Expected route**:
- Intent: `REVIEW_REPORT`
- Resource set: `references/protocol/quick-reference.md` (always-loaded default) plus every path in `RESOURCE_MAP["REVIEW_REPORT"]`.

**Why this route is expected**:
- `INTENT_SIGNALS["REVIEW_REPORT"]` keywords include `"review report"`, `"remediation"`, `"verdict"`, `"release readiness"`, and `"planning packet"`; the exact prompt contains all five.
- `RESOURCE_MAP["REVIEW_REPORT"]` lists `references/state/state-format.md`, `references/state/state-outputs.md`, `references/state/state-reducer-registry.md`, and `assets/deep-review-dashboard.md`.
- `LOADING_LEVELS["ALWAYS"]` always loads `references/protocol/quick-reference.md` (`DEFAULT_RESOURCE`) regardless of intent.

**Desired user-visible outcome**: The AI resolves `REVIEW_REPORT` as the dominant intent and names the state and dashboard resource set, not the setup, iteration, or convergence resource sets.

---

## 3. TEST EXECUTION

### Preconditions

1. `.opencode/skills/system-deep-loop/deep-review/SKILL.md` §2 contains `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`.
2. Every path in `expected_resources` exists under `.opencode/skills/system-deep-loop/deep-review/`.

### Prompt

- Prompt: `Prepare the review report with remediation, verdict, release readiness, and planning packet results.`

### Commands

1. `sed -n '106,149p' .opencode/skills/system-deep-loop/deep-review/SKILL.md` - confirm the `REVIEW_REPORT` keyword list and resource map.
2. `for p in references/protocol/quick-reference.md references/state/state-format.md references/state/state-outputs.md references/state/state-reducer-registry.md assets/deep-review-dashboard.md; do test -e ".opencode/skills/system-deep-loop/deep-review/$p" && echo "OK $p" || echo "MISS $p"; done` - confirm every expected resource resolves on disk.
3. Dispatch the exact prompt into the deep-review packet's router and capture which intent and resource set it reports.

### Expected

Step 1 shows the `REVIEW_REPORT` keyword list and its resource map entries. Step 2 prints `OK` for all five paths. Step 3's transcript reports intent `REVIEW_REPORT` and a resource set matching `expected_resources`.

### Evidence

Command transcript from steps 1-2; the router transcript from step 3, saved to `/tmp/dv-r04-router.txt`.

### Pass / Fail

- **Pass**: every `expected_resources` path exists, the router reports `REVIEW_REPORT` as the dominant intent, and the loaded resource set matches `RESOURCE_MAP["REVIEW_REPORT"]` plus the always-loaded default.
- **Fail**: any listed path is missing, the router selects a different dominant intent, or the loaded resource set omits a `RESOURCE_MAP["REVIEW_REPORT"]` entry.

### Failure Triage

1. Re-run step 2 for the specific path that failed and confirm whether it was renamed or removed.
2. If a different intent wins, note that `"verdict"` also appears in `REVIEW_CONVERGENCE`'s keyword list; compare the full match count and weight for each candidate intent before assuming a routing defect.

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
- Playbook ID: DV-R04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `intra-routing-recall/review-report.md`
