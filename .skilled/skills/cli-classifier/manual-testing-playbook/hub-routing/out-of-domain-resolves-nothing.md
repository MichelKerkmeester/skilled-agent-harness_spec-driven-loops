---
id: CC-003
category: hub_routing
stage: negative
title: "CC-003 -- An out-of-domain request resolves nothing here"
description: "This scenario validates that a request with no classifier signal produces no cli-classifier recommendation and that the front door defers it and a judgment-words holdout, for `CC-003`."
expected_intent: none
expected_resources: []
expected_workflow_mode: none
expected_leaf_resources: []
version: 1.1.0.0
---

# CC-003 -- An out-of-domain request resolves nothing here

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-003`.

---

## 1. OVERVIEW

This scenario validates that a request with no classifier signal produces no `cli-classifier` recommendation, and that the front door defers it. It absorbs the retired `cli-jev` hub's `CJ-003`, whose two front-door prompts, one of them a judgment-words holdout, run here as steps 3 and 4.

### Why This Matters

A hub that routes too broadly takes requests that belong elsewhere. The `cli-classifier` vocabulary names Jev or Deem in every multi-word phrase, and `routerPolicy.defaultMode` is `null`, so ordinary judgment words alone must not reach either transport.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a request with no classifier signal produces no `cli-classifier` recommendation and no front-door route, holdout included.
- Real user request: `summarize the release notes for the last sprint`
- Prompt: `summarize the release notes for the last sprint`
- Expected execution process: Run the advisor once, then the compiled front door for the prompt and the two carried-over prompts, from the repository root.
- Expected signals: `cli-classifier` appears nowhere in the advisor array. Each front-door call answers `action: "defer"` with `selectionKind: null` and `targets: []`.
- Desired user-visible outcome: A verdict that the request stayed out of the hub.
- Pass/fail: PASS if `cli-classifier` is absent and every front-door call defers with empty targets. FAIL if the hub appears at any rank or any call routes. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "summarize the release notes for the last sprint" --format json`
2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "summarize the release notes for the last sprint"`
3. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "Summarize the open questions in this spec packet."`
4. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "score this flavor of ice cream"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-003 | An out-of-domain request resolves nothing here | Confirm a request with no classifier signal produces no `cli-classifier` recommendation and no front-door route | `summarize the release notes for the last sprint` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "summarize the release notes for the last sprint" --format json` -> 2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "summarize the release notes for the last sprint"` -> 3. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "Summarize the open questions in this spec packet."` -> 4. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "score this flavor of ice cream"` | Step 1: no `cli-classifier` entry. Steps 2 to 4: `defer` with empty targets | Every transcript, its exit status, the recommendations array and each front door JSON | PASS if `cli-classifier` is absent and every front-door call defers. FAIL if it appears at any rank or any call routes. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Check `graph-metadata.json` for a single-word signal that matches ordinary text. 2. Check `hub-router.json` for a hub-identity class or a non-null `routerPolicy.defaultMode`. 3. Narrow the signal rather than editing this scenario |

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
| [hub-router.json](../../hub-router.json) | The stage-two vocabulary and the `null` default mode |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/out-of-domain-resolves-nothing.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
