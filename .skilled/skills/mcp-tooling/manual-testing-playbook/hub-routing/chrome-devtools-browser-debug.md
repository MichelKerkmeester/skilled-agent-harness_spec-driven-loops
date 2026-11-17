---
id: MT-001
category: hub_routing
stage: routing
title: "Browser debugging request routes to mcp-chrome-devtools"
description: "Confirm the routing contract for `MT-001`: Browser debugging request routes to mcp-chrome-devtools."
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
created: 2026-07-10
version: 1.0.1.0
---

# MT-001: Browser debugging request routes to mcp-chrome-devtools

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-001`.

---

## 1. OVERVIEW

Strong `chrome-devtools-aliases`/`browser-debug` signal (Chrome DevTools, HAR capture) resolves `workflowMode: mcp-chrome-devtools`; the hub loads `mcp-chrome-devtools/SKILL.md`, not the hub's own thin `SKILL.md` or a sibling packet.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-001` and confirm the expected signals without contradictory evidence.

- Objective: Browser debugging request routes to mcp-chrome-devtools.
- Real user request: `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.`
- Prompt: `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-chrome-devtools"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-chrome-devtools`.
- Pass/fail: PASS when the front door routes to `mcp-chrome-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-chrome-devtools` as a single dominant mode, not an ordered bundle or a deferred disambiguation.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-001 | Hub Routing | Browser debugging request routes to mcp-chrome-devtools | `Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use Chrome DevTools to capture a HAR for the reducer dashboard failing in staging."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-chrome-devtools"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-chrome-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/chrome-devtools-browser-debug.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/chrome-devtools-browser-debug.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
