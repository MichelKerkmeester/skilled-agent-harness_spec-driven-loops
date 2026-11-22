---
id: MT-002
category: hub_routing
stage: routing
title: "ClickUp task request routes to mcp-click-up"
description: "Confirm the routing contract for `MT-002`: ClickUp task request routes to mcp-click-up."
expected_intent: mcp-click-up
expected_resources:
  - mcp-click-up/references/cupt-commands.md
  - mcp-click-up/references/mcp-tools.md
expected_workflow_mode: mcp-click-up
expected_leaf_resources:
  - workflow_mode: mcp-click-up
    leaf_resource_id: references/cupt-commands.md
  - workflow_mode: mcp-click-up
    leaf_resource_id: references/mcp-tools.md
created: 2026-07-10
version: 1.0.2.0
---

# MT-002: ClickUp task request routes to mcp-click-up

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-002`.

---

## 1. OVERVIEW

Strong `clickup-aliases`/`task-management` signal (ClickUp, mark done) resolves `workflowMode: mcp-click-up`; the hub loads `mcp-click-up/SKILL.md`.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-002` and confirm the expected signals without contradictory evidence.

- Objective: ClickUp task request routes to mcp-click-up.
- Real user request: `Mark the ClickUp task done and add a note that it shipped.`
- Prompt: `Mark the ClickUp task done and add a note that it shipped.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-click-up"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-click-up`.
- Pass/fail: PASS when the front door routes to `mcp-click-up`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-click-up` as a single dominant mode without needing a default mode.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Mark the ClickUp task done and add a note that it shipped."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-002 | Hub Routing | ClickUp task request routes to mcp-click-up | `Mark the ClickUp task done and add a note that it shipped.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Mark the ClickUp task done and add a note that it shipped."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-click-up"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-click-up`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/clickup-task-management.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/clickup-task-management.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
