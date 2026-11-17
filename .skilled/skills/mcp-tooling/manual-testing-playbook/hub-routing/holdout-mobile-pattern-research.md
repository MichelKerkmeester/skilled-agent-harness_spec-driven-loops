---
id: MT-H06
category: hub_routing
stage: holdout
title: "Blind holdout: mobile app pattern research routes to mcp-mobbin"
description: "Confirm the routing contract for `MT-H06`: Blind holdout: mobile app pattern research routes to mcp-mobbin."
expected_intent: mcp-mobbin
expected_resources:
  - mcp-mobbin/references/tool-surface.md
  - mcp-mobbin/references/mcp-wiring.md
expected_workflow_mode: mcp-mobbin
expected_leaf_resources:
  - workflow_mode: mcp-mobbin
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-mobbin
    leaf_resource_id: references/mcp-wiring.md
blindToRouterKeywords: true
blindExceptions:
  - "phone apps"
version: 1.1.1.0
---

# MT-H06: Blind holdout — mobile app pattern research

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-H06`.

---

## 1. OVERVIEW

Natural-language MOBILE-app pattern-research intent (no "Mobbin" alias) should resolve `mcp-mobbin`: phone apps + first-run walkthroughs from real products is its app/flow research surface. `mcp-refero` is the adjacent transport but is web/styles-anchored — a defer between the two research transports is a tolerable secondary outcome; `mcp-figma` or a workflow mode is a failure.

### Route Binding

Bound to `mcp-mobbin` by the `app-design-research` keyword "phone apps" (added during routing remediation, F004) — the mobile-anchor that separates Mobbin from the web-anchored `mcp-refero`. The holdout stays blind to all Mobbin aliases but is no longer blind for the term "phone apps" — recorded in `blindExceptions` above.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H06` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: mobile app pattern research routes to mcp-mobbin.
- Real user request: `Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.`
- Prompt: `Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-mobbin"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-mobbin`.
- Pass/fail: PASS when the front door routes to `mcp-mobbin`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H06 | Hub Routing | Blind holdout: mobile app pattern research routes to mcp-mobbin | `Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Collect how popular phone apps welcome first-time users — real product walkthroughs, not mockups — so we can rework our signup."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-mobbin"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-mobbin`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-mobile-pattern-research.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-H06
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-mobile-pattern-research.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
