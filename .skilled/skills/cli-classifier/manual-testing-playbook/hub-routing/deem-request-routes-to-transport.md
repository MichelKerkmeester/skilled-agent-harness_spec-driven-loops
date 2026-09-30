---
id: CC-001
category: hub_routing
stage: routing
title: "CC-001 -- A Deem request resolves mode cli-deem"
description: "This scenario validates that a Deem judgment request resolves the cli-classifier hub and its cli-deem mode, for `CC-001`."
expected_intent: cli-deem
expected_resources:
  - cli-deem/SKILL.md
expected_workflow_mode: cli-deem
expected_leaf_resources: []
version: 0.4.0.0
---

# CC-001 -- A Deem request resolves mode cli-deem

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-001`.

---

## 1. OVERVIEW

This scenario validates that a Deem judgment request resolves the `cli-classifier` hub at stage one and the `cli-deem` transport at stage two.

### Why This Matters

The hub is useful only when a request that names Deem reaches it and stays with Deem. The advisor scores the hub's `graph-metadata.json` signals at stage one. Stage two is the compiled front door, which serves the policy built from `hub-router.json`, where the `ask deem` phrase is a `cli-deem` signal and no Jev phrase is present, so `cli-jev` must not appear.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a Deem judgment request ranks `cli-classifier` first and the front door resolves a single `cli-deem` target.
- Real user request: `ask deem for a probability that this incident is urgent`
- Prompt: `ask deem for a probability that this incident is urgent`
- Expected execution process: Run the advisor, then the compiled front door, then read the registry's modes from the repository root.
- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `action: "route"` with `selectionKind: "single"` and one target whose `workflowMode` and `packetId` are both `cli-deem`. The registry lists `cli-deem,cli-jev`.
- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-deem` as the resolved mode.
- Pass/fail: PASS if all three signals hold. FAIL if the advisor ranks another skill first, the front door routes anything but a single `cli-deem` target or the registry lists other modes. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask deem for a probability that this incident is urgent" --format json`
2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask deem for a probability that this incident is urgent"`
3. `bash: node -e "console.log(require('./.skilled/skills/cli-classifier/mode-registry.json').modes.map((m) => m.workflowMode).join(','))"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-001 | A Deem request resolves mode cli-deem | Confirm a Deem judgment request ranks `cli-classifier` first and the front door resolves a single `cli-deem` target | `ask deem for a probability that this incident is urgent` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask deem for a probability that this incident is urgent" --format json` -> 2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask deem for a probability that this incident is urgent"` -> 3. `bash: node -e "console.log(require('./.skilled/skills/cli-classifier/mode-registry.json').modes.map((m) => m.workflowMode).join(','))"` | Step 1: first recommendation `cli-classifier`. Step 2: a compiled `route` with one `cli-deem` target. Step 3: `cli-deem,cli-jev` | All three transcripts with exit statuses | PASS if all three signals hold. FAIL if another skill ranks first, the front door routes anything but a single `cli-deem` target or the registry lists other modes. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Confirm the advisor graph includes `cli-classifier`. 2. Compare the prompt with the hub's `intent_signals` in `graph-metadata.json`. 3. Check `hub-router.json` for the `ask deem` phrase |

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
| [mode-registry.json](../../mode-registry.json) | The two registered modes |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/deem-request-routes-to-transport.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
