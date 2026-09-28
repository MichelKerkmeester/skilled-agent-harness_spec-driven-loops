---
id: CC-001
category: hub_routing
stage: routing
title: "CC-001 -- A Deem request resolves cli-classifier"
description: "This scenario validates that a Deem judgment request resolves the cli-classifier hub and its cli-deem transport, for `CC-001`."
expected_intent: cli-deem
expected_resources:
  - cli-deem/SKILL.md
expected_workflow_mode: cli-deem
expected_leaf_resources: []
version: 1.0.0.0
---

# CC-001 -- A Deem request resolves cli-classifier

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-001`.

---

## 1. OVERVIEW

This scenario validates that a Deem judgment request resolves the `cli-classifier` hub at stage one and the `cli-deem` transport at stage two.

### Why This Matters

The hub is useful only when a request that names Deem reaches it. The advisor scores the hub's `graph-metadata.json` signals at stage one. The hub has no compiled activation manifest, so stage two resolves through `hub-router.json`, where `cli-deem` is the only registered signal.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a Deem judgment request ranks `cli-classifier` first and the registry resolves `cli-deem`.
- Real user request: `ask deem for a probability that this incident is urgent`
- Prompt: `ask deem for a probability that this incident is urgent`
- Expected execution process: Run the advisor, then the compiled front door, then read the registry's modes from the repository root.
- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `{"servingAuthority":"legacy","hubId":"cli-classifier"}`. The registry lists exactly `cli-deem`.
- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-deem` as the resolved transport.
- Pass/fail: PASS if all three signals hold. FAIL if the advisor ranks another skill first or the registry lists anything but `cli-deem`. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask deem for a probability that this incident is urgent" --format json`
2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask deem for a probability that this incident is urgent"`
3. `bash: node -e "console.log(require('./.skilled/skills/cli-classifier/mode-registry.json').modes.map((m) => m.workflowMode).join(','))"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-001 | A Deem request resolves cli-classifier | Confirm a Deem judgment request ranks `cli-classifier` first and the registry resolves `cli-deem` | `ask deem for a probability that this incident is urgent` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask deem for a probability that this incident is urgent" --format json` -> 2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask deem for a probability that this incident is urgent"` -> 3. `bash: node -e "console.log(require('./.skilled/skills/cli-classifier/mode-registry.json').modes.map((m) => m.workflowMode).join(','))"` | Step 1: first recommendation `cli-classifier`. Step 2: the legacy sentinel naming `cli-classifier`. Step 3: `cli-deem` | All three transcripts with exit statuses | PASS if all three signals hold. FAIL if another skill ranks first or the registry lists anything but `cli-deem`. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Confirm the advisor graph includes `cli-classifier`. 2. Compare the prompt with the hub's `intent_signals` in `graph-metadata.json`. 3. Check `hub-router.json` for the `ask deem` phrase |

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
| [mode-registry.json](../../mode-registry.json) | The single registered mode |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/deem-request-routes-to-transport.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
