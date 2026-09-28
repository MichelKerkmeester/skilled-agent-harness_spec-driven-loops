---
id: CC-002
category: hub_routing
stage: negative
title: "CC-002 -- A Jev request stays with cli-jev"
description: "This scenario validates that a request naming the hosted Jev service ranks cli-jev and never cli-classifier, for `CC-002`."
expected_intent: none
expected_resources: []
expected_workflow_mode: none
expected_leaf_resources: []
version: 1.0.0.0
---

# CC-002 -- A Jev request stays with cli-jev

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-002`.

---

## 1. OVERVIEW

This scenario validates that a request naming the hosted Jev service ranks `cli-jev` and never `cli-classifier`.

### Why This Matters

Deem and Jev answer the same judgment types. The two hubs must not compete for each other's requests, because a caller names its backend and the two never fail over silently. The `cli-classifier` signals therefore carry no Jev vocabulary.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a Jev request ranks `cli-jev` and produces no `cli-classifier` recommendation.
- Real user request: `ask jev for a probability that this plan ships on time`
- Prompt: `ask jev for a probability that this plan ships on time`
- Expected execution process: Run the advisor once from the repository root and inspect the recommendations array.
- Expected signals: The first recommendation is `cli-jev`. `cli-classifier` appears nowhere in the array.
- Desired user-visible outcome: A verdict that the Jev request stayed with `cli-jev`.
- Pass/fail: PASS if `cli-jev` ranks first and `cli-classifier` is absent. FAIL if `cli-classifier` appears at any rank. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask jev for a probability that this plan ships on time" --format json`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-002 | A Jev request stays with cli-jev | Confirm a Jev request ranks `cli-jev` and produces no `cli-classifier` recommendation | `ask jev for a probability that this plan ships on time` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask jev for a probability that this plan ships on time" --format json` | Step 1: first recommendation `cli-jev`, no `cli-classifier` entry | The transcript, its exit status and the recommendations array | PASS if `cli-jev` ranks first and `cli-classifier` is absent. FAIL if `cli-classifier` appears at any rank. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Search the hub's `graph-metadata.json`, `description.json` and `hub-router.json` for Jev vocabulary. 2. Remove it there rather than editing this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [graph-metadata.json](../../graph-metadata.json) | The stage-one signals, which carry no Jev vocabulary |
| [description.json](../../description.json) | The hub keywords and trigger examples |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/jev-request-stays-with-cli-jev.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
