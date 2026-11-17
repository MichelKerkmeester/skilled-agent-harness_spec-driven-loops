---
id: MT-H04
category: hub_routing
stage: holdout
title: "Blind holdout: autonomous browser task routes to mcp-aside-devtools"
description: "Confirm the routing contract for `MT-H04`: Blind holdout: autonomous browser task routes to mcp-aside-devtools."
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
blindToRouterKeywords: true
blindExceptions:
  - "click through"
  - "on its own"
version: 1.1.1.0
---

# MT-H04: Blind holdout — autonomous browser task

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-H04`.

---

## 1. OVERVIEW

Natural-language AUTONOMOUS-browser intent (no "Aside"/"agentic browser" alias) should resolve `mcp-aside-devtools`: the browser is asked to act by itself (sign in, click through, capture evidence), which is the agentic surface — not developer-driven inspection primitives, so `mcp-chrome-devtools` must NOT win. This is the inverse of MT-H01's boundary.

### Route Binding

Bound to `mcp-aside-devtools` by the `agentic-browser` keywords "click through" and "on its own" (added during routing remediation, F004) — both are autonomy markers, not tool aliases. The holdout stays blind to all Aside aliases ("aside", "agentic browser", ...) but is no longer blind for those two phrases — recorded in `blindExceptions` above.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H04` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: autonomous browser task routes to mcp-aside-devtools.
- Real user request: `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.`
- Prompt: `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-aside-devtools"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-aside-devtools`.
- Pass/fail: PASS when the front door routes to `mcp-aside-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H04 | Hub Routing | Blind holdout: autonomous browser task routes to mcp-aside-devtools | `Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Have the browser sign into the staging portal on its own, click through the checkout flow, and save proof screenshots of every step it takes."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-aside-devtools"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-aside-devtools`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-agentic-browser.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-H04
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-agentic-browser.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
