---
id: MT-011
category: hub_routing
stage: routing
title: "Notion database request routes to mcp-notion"
description: "Confirm the routing contract for `MT-011`: Notion database request routes to mcp-notion."
expected_intent: mcp-notion
expected_resources:
  - mcp-notion/references/mcp-tools.md
  - mcp-notion/references/api-gap-tools.md
expected_workflow_mode: mcp-notion
expected_leaf_resources:
  - workflow_mode: mcp-notion
    leaf_resource_id: references/mcp-tools.md
  - workflow_mode: mcp-notion
    leaf_resource_id: references/api-gap-tools.md
created: 2026-10-29
version: 1.0.1.0
---

# MT-011: Notion database request routes to mcp-notion

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-011`.

---

## 1. OVERVIEW

Strong `notion-aliases`/`notion-data` signal (Notion, Notion database) in `hub-router.json`, matched to the registered `mcp-notion` workflow in `mode-registry.json`, resolves `workflowMode: mcp-notion`; the hub loads `mcp-notion/SKILL.md` and exactly its selected packet resources.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-011` and confirm the expected signals without contradictory evidence.

- Objective: Notion database request routes to mcp-notion.
- Real user request: `Query my Notion database for rows whose status is open and update the matching page.`
- Prompt: `Query my Notion database for rows whose status is open and update the matching page.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-notion"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-notion`.
- Pass/fail: PASS when the front door routes to `mcp-notion`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

### Success Criteria

The router resolves `mcp-notion` as a single dominant mode, the open-status rows do not pull the `mcp-click-up` task vocabulary into the route, and the fallback-only `routerPolicy.defaultResource` is not unioned into the selected packet resources.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Query my Notion database for rows whose status is open and update the matching page."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-011 | Hub Routing | Notion database request routes to mcp-notion | `Query my Notion database for rows whose status is open and update the matching page.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Query my Notion database for rows whose status is open and update the matching page."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-notion"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-notion`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/notion-workspace-data.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/notion-workspace-data.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
