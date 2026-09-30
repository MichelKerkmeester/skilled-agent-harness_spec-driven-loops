---
id: CC-003
category: hub_routing
stage: negative
title: "CC-003 -- An out-of-domain request resolves nothing here"
description: "This scenario validates that a request with no classifier signal produces no cli-classifier recommendation, for `CC-003`."
expected_intent: none
expected_resources: []
expected_workflow_mode: none
expected_leaf_resources: []
version: 1.0.0.0
---

# CC-003 -- An out-of-domain request resolves nothing here

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-003`.

---

## 1. OVERVIEW

This scenario validates that a request with no classifier signal produces no `cli-classifier` recommendation.

### Why This Matters

A hub that routes too broadly takes requests that belong elsewhere. The `cli-classifier` vocabulary names Deem in every multi-word phrase, so ordinary judgment words alone must not reach it.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a request with no classifier signal produces no `cli-classifier` recommendation.
- Real user request: `summarize the release notes for the last sprint`
- Prompt: `summarize the release notes for the last sprint`
- Expected execution process: Run the advisor once from the repository root and inspect the recommendations array.
- Expected signals: `cli-classifier` appears nowhere in the array.
- Desired user-visible outcome: A verdict that the request stayed out of the hub.
- Pass/fail: PASS if `cli-classifier` is absent. FAIL if it appears at any rank. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "summarize the release notes for the last sprint" --format json`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-003 | An out-of-domain request resolves nothing here | Confirm a request with no classifier signal produces no `cli-classifier` recommendation | `summarize the release notes for the last sprint` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "summarize the release notes for the last sprint" --format json` | Step 1: no `cli-classifier` entry | The transcript, its exit status and the recommendations array | PASS if `cli-classifier` is absent. FAIL if it appears at any rank. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Check `graph-metadata.json` for a single-word signal that matches ordinary text. 2. Narrow the signal rather than editing this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [graph-metadata.json](../../graph-metadata.json) | The stage-one signals the advisor scores |
| [hub-router.json](../../hub-router.json) | The stage-two vocabulary |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/out-of-domain-resolves-nothing.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
