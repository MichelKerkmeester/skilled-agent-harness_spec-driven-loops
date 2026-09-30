---
id: CJ-002
category: hub_routing
stage: routing
title: "The cli-jev name resolves the Jev transport"
description: "Confirm a request that names cli-jev, and no judgment phrase, resolves mode cli-jev over the cli-usage packet, for `CJ-002`."
expected_intent: cli-jev
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-jev
expected_leaf_resources: []
created: 2026-09-20
version: 1.1.0.0
---

# CJ-002: The cli-jev name resolves the Jev transport

This document captures the realistic routing contract, observed behavior, execution flow, source anchors, and metadata for `CJ-002`.

---

## 1. OVERVIEW

`cli-jev` has named the Jev transport as a mode, then as a hub of its own, and now names it as a mode again: mode `cli-jev` of the `cli-classifier` hub, over the packet folder `cli-usage`. The name sits in `mode-registry.json` `aliases[]` and as a vocabulary entry in `hub-router.json` `vocabularyClasses`, so a request that names it resolves mode `cli-jev` and loads the `cli-usage` packet.

### Why This Matters

The rename is a compatibility promise: existing habits, notes and scripts still say `cli-jev`, and the alias is what keeps them working. If the registration lapses, every old habit resolves nothing, and the symptom is silence rather than a warning.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CJ-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the `cli-jev` name resolves mode `cli-jev` over the `cli-usage` transport packet.
- Real user request: `cli-jev noul for this question.`
- Prompt: `cli-jev noul for this question.`
- Expected execution process: run the command sequence in §3 from the repository root, read the front door's JSON, then judge the result against the pass/fail criteria below.
- Expected signals: the prompt carries no `jev judgment` phrase, so the resolution proves the alias signal: the front door answers `action: "route"` with `selectionKind: "single"` and one target whose `skillId` is `cli-classifier`, whose `workflowMode` is `cli-jev` and whose `packetId` is `cli-usage`, not a defer and not a `cli-deem` target.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `cli-jev` and packet `cli-usage` for a request that never says `cli-usage`.
- Pass/fail: PASS when the alias prompt routes a single `cli-jev` target; FAIL when it defers (the alias registration lost) or resolves anything else; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the front door's JSON and confirm the single `cli-jev` target.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "cli-jev noul for this question."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CJ-002 | Hub Routing | Confirm the `cli-jev` name resolves mode `cli-jev` over the `cli-usage` transport | `cli-jev noul for this question.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "cli-jev noul for this question."` | `action: "route"`, `selectionKind: "single"`, one target with `skillId: "cli-classifier"`, `workflowMode: "cli-jev"` and `packetId: "cli-usage"`, resolved through the alias registration, not a defer | The exact command, its exit status, and the front door's full JSON | PASS when the alias prompt routes a single `cli-jev` target; FAIL when it defers or resolves anything else; SKIP only when the compiled front door cannot start, naming the failure as the blocker | A defer means the alias registration lost: check `mode-registry.json` `aliases[]` for the `cli-jev` entry and `hub-router.json` `vocabularyClasses` for its entry, then re-derive the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/alias-still-resolves.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [mode-registry.json](../../mode-registry.json) | The alias registration for the `cli-jev` name |
| [hub-router.json](../../hub-router.json) | The vocabulary entry that keeps the alias routable |
| [SKILL.md](../../SKILL.md) | The hub's routing contract |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CJ-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/alias-still-resolves.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
