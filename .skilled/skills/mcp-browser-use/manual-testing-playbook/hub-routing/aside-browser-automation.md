---
title: "MT-007 -- Aside browser task routes to mcp-aside-devtools"
description: "This scenario validates hub routing for `MT-007`. It focuses on an Aside browser request with REPL evidence landing on mcp-aside-devtools."
stage: routing
id: MT-007
expected_intent: mcp-aside-devtools
expected_resources:
  - mcp-aside-devtools/references/aside-cli-reference.md
  - mcp-aside-devtools/references/mcp-wiring.md
expected_workflow_mode: mcp-aside-devtools
expected_leaf_resources:
  - workflow_mode: mcp-aside-devtools
    leaf_resource_id: references/aside-cli-reference.md
  - workflow_mode: mcp-aside-devtools
    leaf_resource_id: references/mcp-wiring.md
version: 1.0.0.0
---

# MT-007 -- Aside browser task routes to mcp-aside-devtools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-007`.

---

## 1. OVERVIEW

The prompt names the Aside browser and REPL evidence, so the hub routes to `mcp-aside-devtools`. "console errors" is Chrome DevTools vocabulary as well, so this scenario also checks that Aside wins the overlap when Aside is named.

### Why This Matters

Aside and Chrome DevTools share inspection words. The named tool must decide.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-007` and confirm the expected signals without contradictory evidence.

- Objective: Route an Aside REPL evidence request to mcp-aside-devtools.
- Real user request: `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.`
- Prompt: `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-aside-devtools` under `skillId: "mcp-browser-use"`
- Desired user-visible outcome: The request lands on `mcp-aside-devtools`.
- Pass/fail: PASS if the router routes to `mcp-aside-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-007 | Hub Routing | Aside browser task routes to mcp-aside-devtools | `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."` | the router prints `action: "route"` with one target whose `workflowMode` is `mcp-aside-devtools` under `skillId: "mcp-browser-use"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `mcp-aside-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

### Expected

- `"action":"route"`
- `"workflowMode":"mcp-aside-devtools"`
- Exit 0

### Evidence

The exact command, its exit status and the full JSON.

### Pass / Fail

- **Pass**: the router routes to `mcp-aside-devtools`.
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
| `hub-routing/aside-browser-automation.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-007
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/aside-browser-automation.md`
