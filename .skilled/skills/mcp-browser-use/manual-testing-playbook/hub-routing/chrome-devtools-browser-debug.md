---
title: "MT-001 -- Browser debugging request routes to mcp-chrome-devtools"
description: "This scenario validates hub routing for `MT-001`. It focuses on a Chrome DevTools HAR request landing on mcp-chrome-devtools."
stage: routing
id: MT-001
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
version: 1.0.0.0
---

# MT-001 -- Browser debugging request routes to mcp-chrome-devtools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-001`.

---

## 1. OVERVIEW

The prompt names Chrome DevTools and HAR capture, both Chrome DevTools vocabulary, so the hub routes to `mcp-chrome-devtools` and loads its CDP and session references.

### Why This Matters

This is the incumbent mode. If its plainest request drifts, every Chrome request is at risk.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-001` and confirm the expected signals without contradictory evidence.

- Objective: Route a Chrome DevTools HAR request to mcp-chrome-devtools.
- Real user request: `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.`
- Prompt: `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`
- Desired user-visible outcome: The request lands on `mcp-chrome-devtools`.
- Pass/fail: PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-001 | Hub Routing | Browser debugging request routes to mcp-chrome-devtools | `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."` | the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

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
| `hub-routing/chrome-devtools-browser-debug.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/chrome-devtools-browser-debug.md`
