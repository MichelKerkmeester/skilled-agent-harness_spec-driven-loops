---
id: CJ-002
category: hub_routing
stage: routing
title: "The retired cli-jev mode name still resolves the transport"
description: "Confirm the retired cli-jev mode name still resolves the same single cli-usage transport, for `CJ-002`."
expected_intent: cli-usage
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-usage
expected_leaf_resources: []
created: 2026-09-20
version: 0.2.0.1
---

# CJ-002: The retired cli-jev mode name still resolves the transport

This document captures the realistic routing contract, observed behavior, execution flow, source anchors, and metadata for `CJ-002`.

---

## 1. OVERVIEW

`cli-jev` was the mode's name before the hub took the id, so it survives as a mode alias in `mode-registry.json` `aliases[]` and as a hub vocabulary entry in `hub-router.json` `vocabularyClasses`. A request that still names it resolves the same single mode, `cli-usage`, and loads the same packet.

### Why This Matters

The rename is a compatibility promise: existing habits, notes and scripts still say `cli-jev`, and the alias is what keeps them working. If the registration lapses, every old habit resolves nothing, and the symptom is silence rather than a warning.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CJ-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the retired `cli-jev` mode name resolves the same single `cli-usage` transport.
- Real user request: `cli-jev noul for this question.`
- Prompt: `cli-jev noul for this question.`
- Expected execution process: run the command sequence in §3 from the repository root, read the front door's JSON, then judge the result against the pass/fail criteria below.
- Expected signals: the prompt carries no `jev judgment` phrase, so the resolution proves the alias signal: the front door answers `action: "route"` with `selectionKind: "single"` and one target whose `workflowMode` and `packetId` are both `cli-usage`, not the retired name and not a defer.
- Evidence: the exact command, its exit status, and the front door's full JSON.
- Desired user-visible outcome: the resolved workflow mode `cli-usage` for a request that never says `cli-usage`.
- Pass/fail: PASS when the alias prompt routes a single `cli-usage` target; FAIL when it defers (the alias registration lost) or resolves anything else; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the front door's JSON and confirm the single `cli-usage` target.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "cli-jev noul for this question."
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CJ-002 | Hub Routing | Confirm the retired `cli-jev` mode name still resolves the `cli-usage` transport | `cli-jev noul for this question.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "cli-jev noul for this question."` | `action: "route"`, `selectionKind: "single"`, one target with `workflowMode: "cli-usage"` and `packetId: "cli-usage"`, resolved through the alias registration, not the retired name and not a defer | The exact command, its exit status, and the front door's full JSON | PASS when the alias prompt routes a single `cli-usage` target; FAIL when it defers or resolves anything else; SKIP only when the compiled front door cannot start, naming the failure as the blocker | A defer means the alias registration lost: check `mode-registry.json` `aliases[]` for the retired name and `hub-router.json` `vocabularyClasses` for its entry, then re-derive the compiled policy. If the front door cannot start, fix the launch rather than editing the scenario |

### Recorded Result

Observed during the 09-21 hub-routing remediation: the command exited 0 and the front door answered `{"hubId":"cli-jev","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-dispatch","packetId":"cli-usage","packetKind":"transport","skillId":"cli-jev","workflowMode":"cli-usage"}],"effectivePolicyHash":"3240ebf5ec2848ba6b0a2c0fabf77f6b1b4c2b7475519154e1f7816fe3a670d2","generation":1}`. The prompt names only the retired mode name, so the alias registration carried the route. Verdict PASS.

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
| [mode-registry.json](../../mode-registry.json) | The alias registration for the retired mode name |
| [hub-router.json](../../hub-router.json) | The vocabulary entry that keeps the alias routable |
| [SKILL.md](../../SKILL.md) | The hub's routing contract |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CJ-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/alias-still-resolves.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
