---
title: "MT-004 -- Ambiguous tool request defers"
description: "This scenario validates the defer contract for `MT-004`. It focuses on a request with no per-mode signal deferring instead of defaulting."
stage: routing
id: MT-004
expected_intent: defer
expected_resources: []
expected_workflow_mode: defer
expected_leaf_resources: []
version: 1.0.0.0
---

# MT-004 -- Ambiguous tool request defers

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-004`.

---

## 1. OVERVIEW

The prompt names no browser tool, so no mode scores and the hub defers. No packet resources load on a defer. At stage one the advisor gives this prompt to `mcp-code-mode`, so a live session does not reach the hub with it. This scenario tests the hub on its own.

### Why This Matters

A silent default would load a browser packet for a request that never asked for one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-004` and confirm the expected signals without contradictory evidence.

- Objective: Defer a request that carries no per-mode signal.
- Real user request: `Use the MCP tool bridge for this.`
- Prompt: `Use the MCP tool bridge for this.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "defer"` with an empty `targets` list
- Desired user-visible outcome: A defer that asks the operator which mode to use.
- Pass/fail: PASS if the router defers. FAIL if it routes any target. SKIP only when the router cannot start, with its startup error named as the blocker.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the MCP tool bridge for this.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the MCP tool bridge for this."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-004 | Hub Routing | Ambiguous tool request defers | `Use the MCP tool bridge for this.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the MCP tool bridge for this."` | the router prints `action: "defer"` with an empty `targets` list | The exact command, its exit status and the full JSON. | PASS if the router defers. FAIL if it routes any target. SKIP only when the router cannot start, with its startup error named as the blocker. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

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
| `hub-routing/ambiguous-defer.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/mcp-browser-use/hub-router.json` | The stage-two vocabulary the compiled router reads |
| `.skilled/skills/mcp-browser-use/mode-registry.json` | The workflow modes and their aliases |
| `.skilled/skills/mcp-browser-use/ROUTER.md` | The prose router and its resource map |
| `.skilled/bin/compiled-route-admission.cjs` | Replays this page prompt against its gold |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: MT-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/ambiguous-defer.md`
