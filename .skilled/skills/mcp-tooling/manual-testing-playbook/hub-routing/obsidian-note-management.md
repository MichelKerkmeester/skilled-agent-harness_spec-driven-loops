---
id: MT-010
category: hub_routing
stage: routing
title: "Obsidian note-management request routes to mcp-obsidian"
description: "Confirm the routing contract for `MT-010`: Obsidian note-management request routes to mcp-obsidian."
expected_intent: mcp-obsidian
expected_resources:
  - mcp-obsidian/references/mcp-tools.md
  - mcp-obsidian/references/obsidian-cli-commands.md
expected_workflow_mode: mcp-obsidian
expected_leaf_resources:
  - workflow_mode: mcp-obsidian
    leaf_resource_id: references/mcp-tools.md
  - workflow_mode: mcp-obsidian
    leaf_resource_id: references/obsidian-cli-commands.md
created: 2026-08-02
version: 1.0.1.0
---

# MT-010: Obsidian note-management request routes to mcp-obsidian

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-010`.

---

## 1. OVERVIEW

Strong `obsidian-aliases`/`note-management` signal (Obsidian, daily note) in `hub-router.json`, matched to the registered `mcp-obsidian` workflow in `mode-registry.json`, resolves `workflowMode: mcp-obsidian`; the hub loads `mcp-obsidian/SKILL.md` and exactly its selected packet resources.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-010` and confirm the expected signals without contradictory evidence.

- Objective: Obsidian note-management request routes to mcp-obsidian.
- Real user request: `Create a daily note in my Obsidian vault and search my notes.`
- Prompt: `Create a daily note in my Obsidian vault and search my notes.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-obsidian"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-obsidian`.
- Pass/fail: PASS when the front door routes to `mcp-obsidian`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-obsidian` as a single dominant mode and does not union the fallback-only `routerPolicy.defaultResource` into its selected packet resources.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Create a daily note in my Obsidian vault and search my notes."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-010 | Hub Routing | Obsidian note-management request routes to mcp-obsidian | `Create a daily note in my Obsidian vault and search my notes.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Create a daily note in my Obsidian vault and search my notes."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-obsidian"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-obsidian`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/obsidian-note-management.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/obsidian-note-management.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
