---
id: MT-008
category: hub_routing
stage: routing
title: "Design-reference search routes to mcp-refero"
description: "Confirm the routing contract for `MT-008`: Design-reference search routes to mcp-refero."
expected_intent: mcp-refero
expected_resources:
  - mcp-refero/references/tool-surface.md
  - mcp-refero/references/mcp-wiring.md
expected_workflow_mode: mcp-refero
expected_leaf_resources:
  - workflow_mode: mcp-refero
    leaf_resource_id: references/tool-surface.md
  - workflow_mode: mcp-refero
    leaf_resource_id: references/mcp-wiring.md
created: 2026-07-16
version: 1.0.1.0
---

# MT-008: Design-reference search routes to mcp-refero

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-008`.

---

## 1. OVERVIEW

Strong `refero-aliases`/`design-reference-research` signal (Refero, real-app screens, style references) resolves `workflowMode: mcp-refero`; the hub loads `mcp-refero/SKILL.md`, not `mcp-figma` (which owns Figma Desktop operations) and not the hub's own thin `SKILL.md`. The transport pairing rule still applies: to turn the references into a measured Style Reference (design tokens), pair `sk-design-md-generator` to extract from a live source.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-008` and confirm the expected signals without contradictory evidence.

- Objective: Design-reference search routes to mcp-refero.
- Real user request: `Search Refero for real-app checkout flow screens and pull style references for the redesign.`
- Prompt: `Search Refero for real-app checkout flow screens and pull style references for the redesign.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-refero"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-refero`.
- Pass/fail: PASS when the front door routes to `mcp-refero`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-refero` as a single dominant mode. Figma-specific phrasing (render, export tokens, Figma Desktop) must keep resolving `mcp-figma`; a prompt mixing both tools explicitly yields an `orderedBundle` in tie-break order (figma before refero).

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Search Refero for real-app checkout flow screens and pull style references for the redesign."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-008 | Hub Routing | Design-reference search routes to mcp-refero | `Search Refero for real-app checkout flow screens and pull style references for the redesign.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Search Refero for real-app checkout flow screens and pull style references for the redesign."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-refero"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-refero`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/refero-design-reference.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-008
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/refero-design-reference.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
