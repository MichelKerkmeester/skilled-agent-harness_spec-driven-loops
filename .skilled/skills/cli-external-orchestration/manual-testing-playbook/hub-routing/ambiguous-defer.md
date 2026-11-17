---
id: CE-003
category: hub_routing
stage: routing
title: "Ambiguous CLI-dispatch request defers instead of silently defaulting"
description: "Confirm the routing contract for `CE-003`: Ambiguous CLI-dispatch request defers instead of silently defaulting."
expected_intent: defer
expected_resources: []
expected_workflow_mode: defer
expected_leaf_resources: []
created: 2026-07-10
version: 1.4.1.0
---

# CE-003: Ambiguous CLI-dispatch request defers instead of silently defaulting

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `CE-003`.

---

## 1. OVERVIEW

No strong `cli-opencode-aliases` or `cli-claude-code-aliases` signal is present — just the bare "CLI executor" phrase. The router must defer and ask which executor, not silently default to `cli-opencode` (`routerPolicy.defaultMode`) on genuine ambiguity.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CE-003` and confirm the expected signals without contradictory evidence.

- Objective: Ambiguous CLI-dispatch request defers instead of silently defaulting.
- Real user request: `Dispatch this to a CLI executor.`
- Prompt: `Dispatch this to a CLI executor.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "defer"` with no target; any routed target is a failure.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: a defer that asks the operator which mode to use.
- Pass/fail: PASS when the front door defers; FAIL when it routes any target; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `defer`, not a single mode; the response asks the operator to name `cli-opencode` or `cli-claude-code` explicitly.

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
node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Dispatch this to a CLI executor."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CE-003 | Hub Routing | Ambiguous CLI-dispatch request defers instead of silently defaulting | `Dispatch this to a CLI executor.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Dispatch this to a CLI executor."` | the front door answers `action: "defer"` with no target; any routed target is a failure | The exact command, its exit status, and the front door's full JSON | PASS when the front door defers; FAIL when it routes any target; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

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
- Playbook ID: CE-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/ambiguous-defer.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
