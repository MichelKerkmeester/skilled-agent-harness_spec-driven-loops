---
title: "BOT-003 -- Weekday schedule request routes to schedule"
description: "This scenario validates hub routing for `BOT-003`. It focuses on a bot request landing on schedule."
stage: routing
id: BOT-003
expected_intent: schedule
expected_resources:
  - bots-schedule/references/schedule-lifecycle.md
expected_workflow_mode: schedule
expected_leaf_resources:
  - workflow_mode: schedule
    leaf_resource_id: references/schedule-lifecycle.md
version: 1.0.0.0
---

# BOT-003 -- Weekday schedule request routes to schedule

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-003`.

---

## 1. OVERVIEW

The prompt asks for a bot to fire on a recurring time, so the hub routes to `schedule`. It also carries the word "run", so this scenario checks that the schedule intent wins over the run verb.

### Why This Matters

A schedule request names "run" for what the schedule will do. It must not start a run now.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-003` and confirm the expected signals without contradictory evidence.

- Objective: Route a recurring-timing request to schedule.
- Real user request: `schedule a bot to run on weekdays at nine`
- Prompt: `schedule a bot to run on weekdays at nine`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `schedule` under `skillId: "system-skilled-bots"`
- Desired user-visible outcome: The request lands on `schedule`.
- Pass/fail: PASS if the router routes to `schedule`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `schedule a bot to run on weekdays at nine`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "schedule a bot to run on weekdays at nine"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOT-003 | Hub Routing | Weekday schedule request routes to schedule | `schedule a bot to run on weekdays at nine` | 1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "schedule a bot to run on weekdays at nine"` | the router prints `action: "route"` with one target whose `workflowMode` is `schedule` under `skillId: "system-skilled-bots"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `schedule`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"schedule"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `schedule`.
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
| `hub-routing/schedule-weekday-bot.md` | Canonical per-feature execution contract |

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
- Playbook ID: BOT-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/schedule-weekday-bot.md`
