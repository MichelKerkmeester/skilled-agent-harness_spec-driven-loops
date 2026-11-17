---
id: CE-001
category: hub_routing
stage: routing
title: "Full-runtime dispatch request routes to cli-opencode"
description: "Confirm the routing contract for `CE-001`: Full-runtime dispatch request routes to cli-opencode."
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
created: 2026-07-10
version: 1.4.1.0
---

# CE-001: Full-runtime dispatch request routes to cli-opencode

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `CE-001`.

---

## 1. OVERVIEW

Strong `cli-opencode-aliases`/`opencode-dispatch` signal (OpenCode, full plugin runtime, ablation suite) resolves `workflowMode: cli-opencode`; the hub loads `cli-opencode/SKILL.md`, not the hub's own thin `SKILL.md` or the sibling packet. The surface router loads `cli-opencode/references/cli-reference.md` and `cli-opencode/references/integration-patterns.md` for that full-runtime dispatch.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CE-001` and confirm the expected signals without contradictory evidence.

- Objective: Full-runtime dispatch request routes to cli-opencode.
- Real user request: `Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.`
- Prompt: `Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "cli-opencode"` under `skillId: "cli-external-orchestration"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `cli-opencode`.
- Pass/fail: PASS when the front door routes to `cli-opencode`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `cli-opencode` as a single dominant mode, not an ordered bundle or a deferred disambiguation.

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
node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CE-001 | Hub Routing | Full-runtime dispatch request routes to cli-opencode | `Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Delegate this to OpenCode and run the ablation suite with full plugin and Spec Kit Memory runtime."` | the front door answers `action: "route"` and its targets include `workflowMode: "cli-opencode"` under `skillId: "cli-external-orchestration"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `cli-opencode`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/opencode-full-runtime-dispatch.md` | Canonical per-feature execution contract |

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
- Playbook ID: CE-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/opencode-full-runtime-dispatch.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
