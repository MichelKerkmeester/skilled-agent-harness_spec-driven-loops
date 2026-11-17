---
id: MT-007
category: hub_routing
stage: routing
title: "Agentic Aside browser task routes to mcp-aside-devtools"
description: "Confirm the routing contract for `MT-007`: Agentic Aside browser task routes to mcp-aside-devtools."
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
created: 2026-07-16
version: 1.0.1.0
---

# MT-007: Agentic Aside browser task routes to mcp-aside-devtools

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-007`.

---

## 1. OVERVIEW

Strong `aside-devtools-aliases`/`agentic-browser` signal (Aside browser, REPL evidence) resolves `workflowMode: mcp-aside-devtools`; the hub loads `mcp-aside-devtools/SKILL.md`, not the hub's own thin `SKILL.md` and not `mcp-chrome-devtools` (which owns Chrome/`bdg`/CDP debugging, a distinct vocabulary class).

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-007` and confirm the expected signals without contradictory evidence.

- Objective: Agentic Aside browser task routes to mcp-aside-devtools.
- Real user request: `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.`
- Prompt: `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-aside-devtools"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-aside-devtools`.
- Pass/fail: PASS when the front door routes to `mcp-aside-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-aside-devtools` as a single dominant mode. Generic browser-debug phrasing WITHOUT Aside vocabulary must still prefer `mcp-chrome-devtools` (its aliases plus the tie-break order protect the incumbent), so this scenario passes only when Aside-specific vocabulary is present.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-007 | Hub Routing | Agentic Aside browser task routes to mcp-aside-devtools | `Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Aside browser to sign into the staging dashboard, capture REPL evidence of the console errors, and screenshot the failing widget."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-aside-devtools"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-aside-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/aside-browser-automation.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/aside-browser-automation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
