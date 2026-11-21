---
title: "MT-012 -- Bladebro stealth request routes to mcp-bladebro"
description: "This scenario validates hub routing for `MT-012`. It focuses on a named Bladebro stealth request landing on mcp-bladebro."
stage: routing
id: MT-012
expected_intent: mcp-bladebro
expected_resources:
  - mcp-bladebro/references/cli-reference.md
  - mcp-bladebro/references/mcp-wiring.md
expected_workflow_mode: mcp-bladebro
expected_leaf_resources:
  - workflow_mode: mcp-bladebro
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: mcp-bladebro
    leaf_resource_id: references/mcp-wiring.md
version: 1.0.0.0
---

# MT-012 -- Bladebro stealth request routes to mcp-bladebro

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-012`.

---

## 1. OVERVIEW

The prompt names Bladebro, so the hub routes to `mcp-bladebro` and loads its CLI reference and MCP wiring guide.

### Why This Matters

Bladebro is the newest mode. Without this scenario the hub has no gold for it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-012` and confirm the expected signals without contradictory evidence.

- Objective: Route a named Bladebro request to mcp-bladebro.
- Real user request: `Use Bladebro to read example.com in stealth mode and click the Learn more link.`
- Prompt: `Use Bladebro to read example.com in stealth mode and click the Learn more link.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-bladebro` under `skillId: "mcp-browser-use"`
- Desired user-visible outcome: The request lands on `mcp-bladebro`.
- Pass/fail: PASS if the router routes to `mcp-bladebro`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use Bladebro to read example.com in stealth mode and click the Learn more link.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Bladebro to read example.com in stealth mode and click the Learn more link."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-012 | Hub Routing | Bladebro stealth request routes to mcp-bladebro | `Use Bladebro to read example.com in stealth mode and click the Learn more link.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Bladebro to read example.com in stealth mode and click the Learn more link."` | the router prints `action: "route"` with one target whose `workflowMode` is `mcp-bladebro` under `skillId: "mcp-browser-use"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `mcp-bladebro`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"mcp-bladebro"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `mcp-bladebro`.
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
| `hub-routing/bladebro-stealth-browser.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/bladebro-stealth-browser.md`
