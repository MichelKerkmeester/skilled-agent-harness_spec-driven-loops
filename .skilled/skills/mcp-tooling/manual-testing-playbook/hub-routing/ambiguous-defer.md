---
id: MT-004
category: hub_routing
stage: routing
title: "Genuinely ambiguous tool request defers rather than silently defaulting"
description: "Confirm the routing contract for `MT-004`: Genuinely ambiguous tool request defers rather than silently defaulting."
expected_intent: defer
expected_resources: []
expected_workflow_mode: defer
expected_leaf_resources: []
created: 2026-07-10
version: 1.1.2.0
---

# MT-004: Genuinely ambiguous tool request defers rather than silently defaulting

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-004`.

---

## 1. OVERVIEW

No specific tool named (no browser, ClickUp, or Figma signal), so the router does not have a strong per-mode signal. `routerPolicy.defaultMode` (`mcp-chrome-devtools`) is a WEAK default per ADR-006 — the router should `defer`/disambiguate on genuinely ambiguous, non-matching intent rather than silently resolving to `mcp-chrome-devtools` on hub-identity vocabulary alone.

Hub-identity vocabulary ("mcp tool bridge" here) is discovery evidence only (`routerPolicy.discoveryClasses`): it scores NO mode, so this prompt takes the zero-signal branch. This scenario asserts the **fallback-only** contract for `routerPolicy.defaultResource` (`defaultResourceSemantics: "fallback-only"`): on defer, NO packet resources are assembled — `expected_resources` is empty by design — and the Chrome default is at most the defer-time suggestion offered alongside the disambiguation question, never a silent load.

This scenario tests the hub's own stage-two routing, from the point where the hub has been asked. At stage one the advisor gives this exact prompt to `mcp-code-mode`, which owns the generic MCP tool bridge, so a live session does not reach the hub with it. That stage-one choice is deliberate and is not what this scenario measures.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-004` and confirm the expected signals without contradictory evidence.

- Objective: Genuinely ambiguous tool request defers rather than silently defaulting.
- Real user request: `Use the MCP tool bridge for this.`
- Prompt: `Use the MCP tool bridge for this.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "defer"` with no target; any routed target is a failure.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: a defer that asks the operator which mode to use.
- Pass/fail: PASS when the front door defers; FAIL when it routes any target; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router does not silently resolve to `mcp-chrome-devtools` on bare hub-identity vocabulary with no per-mode signal: zero modes score, the outcome is `defer`, and no mode resources (including `defaultResource`) are silently assembled.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the MCP tool bridge for this."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-004 | Hub Routing | Genuinely ambiguous tool request defers rather than silently defaulting | `Use the MCP tool bridge for this.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the MCP tool bridge for this."` | the front door answers `action: "defer"` with no target; any routed target is a failure | The exact command, its exit status, and the front door's full JSON | PASS when the front door defers; FAIL when it routes any target; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/ambiguous-defer.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/ambiguous-defer.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
