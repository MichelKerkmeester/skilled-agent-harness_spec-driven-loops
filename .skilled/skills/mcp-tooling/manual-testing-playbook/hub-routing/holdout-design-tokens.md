---
id: MT-H02
category: hub_routing
stage: holdout
title: "Blind holdout: design-token extraction routes to mcp-figma"
description: "Confirm the routing contract for `MT-H02`: Blind holdout: design-token extraction routes to mcp-figma."
expected_intent: mcp-figma
expected_resources:
  - mcp-figma/references/figma-cli-reference.md
  - mcp-figma/references/mcp-wiring.md
expected_workflow_mode: mcp-figma
expected_leaf_resources:
  - workflow_mode: mcp-figma
    leaf_resource_id: references/figma-cli-reference.md
  - workflow_mode: mcp-figma
    leaf_resource_id: references/mcp-wiring.md
blindToRouterKeywords: true
blindExceptions:
  - "design file"
version: 1.1.1.0
---

# MT-H02: Blind holdout — design tokens

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-H02`.

---

## 1. OVERVIEW

Natural-language design-token intent (no "Figma" alias) should still resolve `mcp-figma`.

### Route Binding

Bound to `mcp-figma` by the `design-transport` keyword "design file" (added during routing remediation, F004). The holdout stays blind to all provider aliases ("figma", "figma cli", ...) but is no longer blind for the term "design file" — recorded in `blindExceptions` above.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H02` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: design-token extraction routes to mcp-figma.
- Real user request: `Pull the button component's colors and spacing values out of our shared design file and hand them to the build.`
- Prompt: `Pull the button component's colors and spacing values out of our shared design file and hand them to the build.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-figma"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-figma`.
- Pass/fail: PASS when the front door routes to `mcp-figma`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Pull the button component's colors and spacing values out of our shared design file and hand them to the build."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H02 | Hub Routing | Blind holdout: design-token extraction routes to mcp-figma | `Pull the button component's colors and spacing values out of our shared design file and hand them to the build.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Pull the button component's colors and spacing values out of our shared design file and hand them to the build."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-figma"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-figma`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-design-tokens.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-H02
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-design-tokens.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
