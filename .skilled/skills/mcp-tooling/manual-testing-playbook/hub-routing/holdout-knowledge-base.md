---
id: MT-H07
category: hub_routing
stage: holdout
title: "Blind holdout: knowledge-base note management routes to mcp-obsidian"
description: "Confirm the routing contract for `MT-H07`: Blind holdout: knowledge-base note management routes to mcp-obsidian."
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
blindToRouterKeywords: true
blindExceptions:
  - "knowledge base"
version: 1.1.1.0
---

# MT-H07: Blind holdout — knowledge-base note management

This document captures the routing contract, expected behavior, execution flow, source anchors and metadata for `MT-H07`.

---

## 1. OVERVIEW

Natural-language note intent (no "Obsidian"/"notesmd-cli" alias, no literal "note management" vocabulary) must still resolve `mcp-obsidian` — capturing linked markdown notes belongs to its vault surface. Note/vault/knowledge-base/markdown-linking intent is not ClickUp task, project, or ticket tracking; an `mcp-click-up` or `defer` result is a routing regression.

### Route Binding

Bound through `hub-router.json` to the registered `mcp-obsidian` workflow in `mode-registry.json` by the `note-management` keyword "knowledge base". The holdout stays blind to the provider aliases ("obsidian", "notesmd-cli") and to the literal "note management" phrase, while recording its `knowledge base` binding in `blindExceptions` above.

### Why This Matters

The frontmatter of this page is routing gold: the admission check replays the prompt below through the compiled router and fails the hub when the result differs, so a drift in the hub vocabulary shows up here first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `MT-H07` and confirm the expected signals without contradictory evidence.

- Objective: Blind holdout: knowledge-base note management routes to mcp-obsidian.
- Real user request: `I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones.`
- Prompt: `I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones.`
- Expected execution process: run the command in §3 from the repository root, read the front door's JSON, then judge it against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` and its targets include `workflowMode: "mcp-obsidian"` under `skillId: "mcp-tooling"`.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `mcp-obsidian`.
- Pass/fail: PASS when the front door routes to `mcp-obsidian`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

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
node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MT-H07 | Hub Routing | Blind holdout: knowledge-base note management routes to mcp-obsidian | `I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones.` | 1. `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "I keep my personal knowledge base as linked markdown files — help me capture a note and link it to related ones."` | the front door answers `action: "route"` and its targets include `workflowMode: "mcp-obsidian"` under `skillId: "mcp-tooling"` | The exact command, its exit status, and the front door's full JSON | PASS when the front door routes to `mcp-obsidian`; FAIL when it defers or routes elsewhere; SKIP only when the compiled front door cannot start, naming the failure as the blocker | Check the vocabulary in `hub-router.json` and the aliases in `mode-registry.json` for the phrases this prompt carries, then re-mint the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/holdout-knowledge-base.md` | Canonical per-feature execution contract |

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
- Playbook ID: MT-H07
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/holdout-knowledge-base.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
