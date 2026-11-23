---
title: "BOT-002 -- Run request for a named bot routes to run"
description: "This scenario validates hub routing for `BOT-002`. It focuses on a bot request landing on run."
stage: routing
id: BOT-002
expected_intent: run
expected_resources:
  - bots-run/references/run-queue-and-answer.md
expected_workflow_mode: run
expected_leaf_resources:
  - workflow_mode: run
    leaf_resource_id: references/run-queue-and-answer.md
version: 1.0.0.0
---

# BOT-002 -- Run request for a named bot routes to run

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-002`.

---

## 1. OVERVIEW

The prompt asks to run one bot by name right away, so the hub routes to `run`.

### Why This Matters

A run request is the most common bot request. It must reach the run queue, not the schedule.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-002` and confirm the expected signals without contradictory evidence.

- Objective: Route a by-name run request to run.
- Real user request: `run the bot nightly-digest now`
- Prompt: `run the bot nightly-digest now`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `run` under `skillId: "system-skilled-bots"`
- Desired user-visible outcome: The request lands on `run`.
- Pass/fail: PASS if the router routes to `run`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `run the bot nightly-digest now`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "run the bot nightly-digest now"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOT-002 | Hub Routing | Run request for a named bot routes to run | `run the bot nightly-digest now` | 1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "run the bot nightly-digest now"` | the router prints `action: "route"` with one target whose `workflowMode` is `run` under `skillId: "system-skilled-bots"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `run`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"run"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `run`.
- **Fail**: it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

### Failure Triage

1. Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`.
2. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `hub-routing/run-named-bot.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/hub-router.json` | The stage-two vocabulary the compiled router reads |
| `.skilled/skills/system-skilled-bots/mode-registry.json` | The workflow modes and their aliases |
| `.skilled/skills/system-skilled-bots/ROUTER.md` | The prose router and its resource map |
| `.skilled/bin/compiled-route-admission.cjs` | Replays this page prompt against its gold |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: BOT-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/run-named-bot.md`
