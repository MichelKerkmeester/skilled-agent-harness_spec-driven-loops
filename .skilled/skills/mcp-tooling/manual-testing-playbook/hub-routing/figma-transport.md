---
id: MT-003
category: hub_routing
stage: routing
title: "Figma render/export request routes to the mcp-figma transport"
description: "Confirm the routing contract for `MT-003`: Figma render/export request routes to the mcp-figma transport."
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
created: 2026-07-10
version: 1.0.1.0
---

# MT-003: Figma render/export request routes to the mcp-figma transport

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-003`.

---

## 1. OVERVIEW

Strong `figma-aliases`/`design-transport` signal (Figma, render, export) resolves `workflowMode: mcp-figma`; the hub loads `mcp-figma/SKILL.md`. Because `mcp-figma` is a transport (`packetKind: "transport"`), it never produces the measured design reference itself — a design-affecting operation still requires the mandatory `sk-design-md-generator` cross-hub pairing for a measured Style Reference (extracted design tokens).

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-003` and confirm the expected signals without contradictory evidence.

- Objective: Figma render/export request routes to the mcp-figma transport.
- Real user request: `Render this component in Figma and export the design tokens.`
- Prompt: `Render this component in Figma and export the design tokens.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-figma"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-figma`.
- Pass/fail: PASS when the front door routes to `mcp-figma`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-figma` as a single dominant mode; the transport does not silently substitute for the measured Style Reference `sk-design-md-generator` produces.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Render this component in Figma and export the design tokens."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-003 | Hub Routing | Figma render/export request routes to the mcp-figma transport | `Render this component in Figma and export the design tokens.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Render this component in Figma and export the design tokens."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-figma"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-figma`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/figma-transport.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/figma-transport.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
