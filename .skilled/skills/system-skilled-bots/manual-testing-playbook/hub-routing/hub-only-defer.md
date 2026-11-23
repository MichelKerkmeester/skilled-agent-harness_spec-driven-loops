---
title: "BOT-007 -- Bot request with no mode defers"
description: "This scenario validates the defer contract for `BOT-007`. It focuses on a request the hub must not route."
stage: routing
id: BOT-007
expected_intent: defer
expected_resources: []
expected_workflow_mode: defer
expected_leaf_resources: []
version: 1.0.0.0
---

# BOT-007 -- Bot request with no mode defers

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-007`.

---

## 1. OVERVIEW

The prompt names the hub's domain but no mode. Only hub identity vocabulary matches, which scores no mode, so the hub defers. No packet resources load on a defer.

### Why This Matters

A silent default would load a bot packet the request never asked for.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-007` and confirm the expected signals without contradictory evidence.

- Objective: Defer a bot request that names no mode.
- Real user request: `help with my headless bots`
- Prompt: `help with my headless bots`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "defer"` with an empty `targets` list
- Desired user-visible outcome: A defer that asks the operator which bot mode to use, or no bot mode at all.
- Pass/fail: PASS if the router defers. FAIL if it routes any target. SKIP only when the router cannot start, with its startup error named as the blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `help with my headless bots`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "help with my headless bots"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOT-007 | Hub Routing | Bot request with no mode defers | `help with my headless bots` | 1. `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "help with my headless bots"` | the router prints `action: "defer"` with an empty `targets` list | The exact command, its exit status and the full JSON. | PASS if the router defers. FAIL if it routes any target. SKIP only when the router cannot start, with its startup error named as the blocker. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"defer"`
- `"targets":[]`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router defers.
- **Fail**: it routes any target. SKIP only when the router cannot start, with its startup error named as the blocker.

### Failure Triage

1. Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`.
2. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `hub-routing/hub-only-defer.md` | Canonical per-feature execution contract |

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
- Playbook ID: BOT-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/hub-only-defer.md`
