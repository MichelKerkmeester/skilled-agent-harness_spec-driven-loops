---
id: CC-002
category: hub_routing
stage: routing
title: "CC-002 -- A Jev request resolves mode cli-jev"
description: "This scenario validates that a request naming the hosted Jev service ranks cli-classifier first and resolves mode cli-jev over the cli-jev packet, for `CC-002`."
expected_intent: cli-jev
expected_resources:
  - cli-jev/SKILL.md
expected_workflow_mode: cli-jev
expected_leaf_resources:
  - workflow_mode: cli-jev
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-jev
    leaf_resource_id: references/integration-patterns.md
version: 0.4.0.0
---

# CC-002 -- A Jev request resolves mode cli-jev

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-002`.

---

## 1. OVERVIEW

This scenario validates that a request naming the hosted Jev service ranks `cli-classifier` first at stage one and resolves mode `cli-jev`, over the `cli-jev` packet, at stage two.

### Why This Matters

The hub registers `cli-jev` as its only mode today, and `hub-router.json` sends Jev requests to its packet. A future classifier gets a separate new mode and packet under the same parent hub. The file name records the earlier split, when Jev had a hub of its own.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a Jev request ranks `cli-classifier` first and the front door resolves a single `cli-jev` target.
- Real user request: `ask jev for a probability that this plan ships on time`
- Prompt: `ask jev for a probability that this plan ships on time`
- Expected execution process: Run the advisor, then the compiled front door, from the repository root.
- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `action: "route"` with `selectionKind: "single"` and one target whose `workflowMode` is `cli-jev` and whose `packetId` is `cli-jev`.
- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-jev` as the resolved mode.
- Pass/fail: PASS if both signals hold. FAIL if another skill ranks first or the front door defers. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask jev for a probability that this plan ships on time" --format json`
2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask jev for a probability that this plan ships on time"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-002 | A Jev request resolves mode cli-jev | Confirm a Jev request ranks `cli-classifier` first and the front door resolves a single `cli-jev` target | `ask jev for a probability that this plan ships on time` | 1. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "ask jev for a probability that this plan ships on time" --format json` -> 2. `bash: node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask jev for a probability that this plan ships on time"` | Step 1: first recommendation `cli-classifier`. Step 2: a compiled `route` with one `cli-jev` target over `cli-jev` | Both transcripts with exit statuses | PASS if both signals hold. FAIL if another skill ranks first or the front door defers. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Confirm the advisor graph includes the hub's Jev signals in `graph-metadata.json`. 2. Check `hub-router.json` for the `ask jev` phrase in the `jev-dispatch` class. 3. Check the compiled policy generation if the Jev signal defers |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [graph-metadata.json](../../graph-metadata.json) | The stage-one signals, which carry the Jev vocabulary |
| [hub-router.json](../../hub-router.json) | The stage-two vocabulary that routes Jev requests to `cli-jev` |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/jev-request-stays-with-cli-jev.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
