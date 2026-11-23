---
title: "BOT-004 -- Status and last run request routes to status"
description: "This scenario validates hub routing for `BOT-004`. It focuses on a bot request landing on status."
stage: routing
id: BOT-004
expected_intent: status
expected_resources:
  - bots-status/references/status-and-inbox.md
expected_workflow_mode: status
expected_leaf_resources:
  - workflow_mode: status
    leaf_resource_id: references/status-and-inbox.md
version: 1.0.0.0
---

# BOT-004 -- Status and last run request routes to status

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-004`.

---

## 1. OVERVIEW

The prompt asks to see bot state and the last run, so the hub routes to `status`. It mentions a run, so this scenario checks that a read of the last run does not start a new one.

### Why This Matters

A status read must never enqueue a run.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-004` and confirm the expected signals without contradictory evidence.

- Objective: Route a read-only status request to status.
- Real user request: `show bot status and the last bot run`
- Prompt: `show bot status and the last bot run`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `status` under `skillId: "system-skilled-bots"`
- Desired user-visible outcome: The request lands on `status`.
- Pass/fail: PASS if the router routes to `status`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `show bot status and the last bot run`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "show bot status and the last bot run"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOT-004 | Hub Routing | Status and last run request routes to status | `show bot status and the last bot run` | 1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "show bot status and the last bot run"` | the router prints `action: "route"` with one target whose `workflowMode` is `status` under `skillId: "system-skilled-bots"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `status`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"status"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `status`.
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
| `hub-routing/status-last-run.md` | Canonical per-feature execution contract |

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
- Playbook ID: BOT-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/status-last-run.md`
