---
id: CE-002
category: hub_routing
stage: routing
title: "Anthropic-backed second-opinion request routes to cli-claude-code"
description: "Confirm the routing contract for `CE-002`: Anthropic-backed second-opinion request routes to cli-claude-code."
expected_intent: cli-claude-code
expected_resources:
  - cli-claude-code/references/cli-reference.md
  - cli-claude-code/references/integration-patterns.md
expected_workflow_mode: cli-claude-code
expected_leaf_resources:
  - workflow_mode: cli-claude-code
    leaf_resource_id: references/cli-reference.md
  - workflow_mode: cli-claude-code
    leaf_resource_id: references/integration-patterns.md
created: 2026-07-10
version: 1.4.1.0
---

# CE-002: Anthropic-backed second-opinion request routes to cli-claude-code

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `CE-002`.

---

## 1. OVERVIEW

Strong `cli-claude-code-aliases`/`claude-dispatch` signal (Anthropic CLI, extended thinking) resolves `workflowMode: cli-claude-code`; the hub loads `cli-claude-code/SKILL.md`, not the hub's own thin `SKILL.md` or the sibling packet. The surface router loads `cli-claude-code/references/cli-reference.md` and `cli-claude-code/references/integration-patterns.md` for that second-opinion dispatch.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CE-002` and confirm the expected signals without contradictory evidence.

- Objective: Anthropic-backed second-opinion request routes to cli-claude-code.
- Real user request: `Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge.`
- Prompt: `Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "cli-claude-code"` under `skillId: "cli-external-orchestration"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `cli-claude-code`.
- Pass/fail: PASS when the front door routes to `cli-claude-code`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `cli-claude-code` as a single dominant mode, not an ordered bundle or a deferred disambiguation.

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
node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CE-002 | Hub Routing | Anthropic-backed second-opinion request routes to cli-claude-code | `Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "Get an Anthropic CLI second opinion on this refactor with extended thinking before I merge."` | the front door answers `action: "route"` and its targets include `workflowMode: "cli-claude-code"` under `skillId: "cli-external-orchestration"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `cli-claude-code`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/claude-code-second-opinion.md` | Canonical per-feature execution contract |

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
- Playbook ID: CE-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/claude-code-second-opinion.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
