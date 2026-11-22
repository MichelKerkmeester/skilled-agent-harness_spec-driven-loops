---
title: "MT-H01 -- Blind holdout: browser inspection routes to mcp-chrome-devtools"
description: "This scenario validates a blind holdout for `MT-H01`. It focuses on plain-language network and DOM inspection landing on mcp-chrome-devtools."
stage: holdout
id: MT-H01
expected_intent: mcp-chrome-devtools
expected_resources:
  - mcp-chrome-devtools/references/cdp-patterns.md
  - mcp-chrome-devtools/references/session-management.md
expected_workflow_mode: mcp-chrome-devtools
expected_leaf_resources:
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: references/cdp-patterns.md
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: references/session-management.md
blindToRouterKeywords: true
version: 1.0.0.0
---

# MT-H01 -- Blind holdout: browser inspection routes to mcp-chrome-devtools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-H01`.

---

## 1. OVERVIEW

The prompt names no tool. It describes developer-driven inspection of network requests and the live DOM, which is Chrome DevTools work, so the hub must route to `mcp-chrome-devtools` and never to Aside or Bladebro.

### Why This Matters

This is the Chrome and Aside boundary. A defer or an Aside route here is a regression.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H01` and confirm the expected signals without contradictory evidence.

- Objective: Route plain-language inspection to mcp-chrome-devtools.
- Real user request: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`
- Prompt: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`
- Desired user-visible outcome: The request lands on `mcp-chrome-devtools`.
- Pass/fail: PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H01 | Hub Routing | Blind holdout: browser inspection routes to mcp-chrome-devtools | `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."` | the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"mcp-chrome-devtools"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `mcp-chrome-devtools`.
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
| `hub-routing/holdout-browser-inspect.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-H01
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/holdout-browser-inspect.md`
