---
title: "MT-013 -- Lighthouse audit routes to mcp-chrome-devtools"
description: "This scenario validates hub routing for `MT-013`. It focuses on a Lighthouse audit landing on mcp-chrome-devtools with the Lighthouse leaves."
stage: routing
id: MT-013
expected_intent: mcp-chrome-devtools
expected_resources:
  - mcp-chrome-devtools/feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md
  - mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md
expected_workflow_mode: mcp-chrome-devtools
expected_leaf_resources:
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md
  - workflow_mode: mcp-chrome-devtools
    leaf_resource_id: assets/utcp-chrome-devtools-manuals.md
version: 1.0.0.0
---

# MT-013 -- Lighthouse audit routes to mcp-chrome-devtools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MT-013`.

---

## 1. OVERVIEW

Lighthouse runs through the Chrome DevTools MCP lane, because `bdg` ships no Lighthouse command. The hub routes to `mcp-chrome-devtools` and loads the Lighthouse and performance-trace leaf with the manual snapshot.

### Why This Matters

Lighthouse is the one Chrome request that loads different leaves from the CDP default.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-013` and confirm the expected signals without contradictory evidence.

- Objective: Route a Lighthouse request to mcp-chrome-devtools.
- Real user request: `Run a Lighthouse audit on the staging homepage and report the performance score.`
- Prompt: `Run a Lighthouse audit on the staging homepage and report the performance score.`
- Expected execution process: run the command in section 3 from the repository root, read the JSON the router prints and its exit status, then judge them against the pass/fail criteria.
- Expected signals: the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"`
- Desired user-visible outcome: The request lands on `mcp-chrome-devtools`.
- Pass/fail: PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run a Lighthouse audit on the staging homepage and report the performance score.`

### Commands

1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Run a Lighthouse audit on the staging homepage and report the performance score."`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-013 | Hub Routing | Lighthouse audit routes to mcp-chrome-devtools | `Run a Lighthouse audit on the staging homepage and report the performance score.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "Run a Lighthouse audit on the staging homepage and report the performance score."` | the router prints `action: "route"` with one target whose `workflowMode` is `mcp-chrome-devtools` under `skillId: "mcp-browser-use"` | The exact command, its exit status and the full JSON. | PASS if the router routes to `mcp-chrome-devtools`. FAIL if it defers or routes elsewhere. SKIP only when the router cannot start, naming the failure. | Check the phrases this prompt carries against the classes in `hub-router.json` and the aliases in `mode-registry.json`. A miss is a routing finding for the routing owner. Never reword the prompt or the gold to make it pass. |

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
| `hub-routing/lighthouse-performance-audit.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/lighthouse-performance-audit.md`
