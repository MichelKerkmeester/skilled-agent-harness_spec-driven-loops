---
id: MT-H01
category: hub_routing
stage: holdout
title: "Blind holdout: browser inspection routes to mcp-chrome-devtools"
description: "Confirm the routing contract for `MT-H01`: Blind holdout: browser inspection routes to mcp-chrome-devtools."
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
version: 1.1.1.0
---

# MT-H01: Blind holdout — browser inspection

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-H01`.

---

## 1. OVERVIEW

Natural-language browser-inspection intent (no "Chrome DevTools"/"HAR" alias) should still resolve `mcp-chrome-devtools`.

### Boundary (six-mode hub)

With `mcp-aside-devtools` in the hub, this prompt is the chrome-vs-aside boundary case: it must STILL resolve `mcp-chrome-devtools` because it describes developer-driven inspection primitives (network requests, live DOM) with no agentic/AI-browser vocabulary. `mcp-aside-devtools` wins only when the prompt asks the browser to act autonomously (natural-language tasks, sign-in-and-do flows, agent-captured evidence). If the router returns `mcp-aside-devtools` or a defer here, that is a routing regression.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H01` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: browser inspection routes to mcp-chrome-devtools.
- Real user request: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`
- Prompt: `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-chrome-devtools"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-chrome-devtools`.
- Pass/fail: PASS when the front door routes to `mcp-chrome-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook.
3. Run the command below exactly as written, from the repository root.
4. Read the front door's JSON and compare it with the expected signals.
5. Record the verdict with its evidence.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H01 | Hub Routing | Blind holdout: browser inspection routes to mcp-chrome-devtools | `The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-chrome-devtools"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-chrome-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-browser-inspect.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hub-router.json](../../hub-router.json) | The stage-two vocabulary the compiled router reads |
| [mode-registry.json](../../mode-registry.json) | The workflow modes and their aliases |
| [ROUTER.md](../../ROUTER.md) | The prose fallback router |
| `.skilled/bin/compiled-route-admission.cjs` | Replays this page's prompt against its gold |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: MT-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-browser-inspect.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
