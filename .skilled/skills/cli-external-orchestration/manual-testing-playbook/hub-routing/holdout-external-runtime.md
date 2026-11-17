---
id: CE-H01
category: hub_routing
stage: holdout
title: "Blind holdout: full-runtime handoff routes to cli-opencode"
description: "Confirm the routing contract for `CE-H01`: Blind holdout: full-runtime handoff routes to cli-opencode."
expected_intent: cli-opencode
expected_resources:
  - cli-opencode/references/cli-reference.md
  - cli-opencode/references/integration-patterns.md
expected_workflow_mode: cli-opencode
expected_leaf_resources:
  - workflow_mode: cli-opencode
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-opencode
    leaf_resource_id: references/integration-patterns.md
blindToRouterKeywords: true
version: 1.4.1.0
---

# CE-H01: Blind holdout — external full-runtime handoff

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `CE-H01`.

---

## 1. OVERVIEW

Natural-language external-full-runtime-dispatch intent (no "OpenCode" alias) should still resolve `cli-opencode`. The full plugin and memory stack handoff loads `cli-opencode/references/cli-reference.md` and `cli-opencode/references/integration-patterns.md`.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CE-H01` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: full-runtime handoff routes to cli-opencode.
- Real user request: `Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended.`
- Prompt: `Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "cli-opencode"` under `skillId: "cli-external-orchestration"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `cli-opencode`.
- Pass/fail: PASS when the front door routes to `cli-opencode`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

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
node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CE-H01 | Hub Routing | Blind holdout: full-runtime handoff routes to cli-opencode | `Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Hand this whole task to a separate autonomous coding session that has the full plugin and memory stack and let it run unattended."` | the front door answers `action: "route"` and its targets include `workflowMode: "cli-opencode"` under `skillId: "cli-external-orchestration"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `cli-opencode`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-external-runtime.md` | Canonical per-feature execution contract |

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
- Playbook ID: CE-H01
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-external-runtime.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
