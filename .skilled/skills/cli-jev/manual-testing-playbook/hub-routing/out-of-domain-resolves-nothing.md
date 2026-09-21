---
id: CJ-003
category: hub_routing
stage: routing
title: "A request with no Jev signal resolves no mode"
description: "Confirm a request with no Jev signal resolves no mode, and that judgment words alone stay unrouted, for `CJ-003`."
expected_intent: none
expected_resources: []
expected_workflow_mode: none
expected_leaf_resources: []
created: 2026-09-20
version: 0.2.0.2
---

# CJ-003: A request with no Jev signal resolves no mode

This document captures the realistic routing contract, observed behavior, execution flow, source anchors, and metadata for `CJ-003`.

---

## 1. OVERVIEW

The hub declares no hub-identity catch-all class, because it also declares `routerPolicy.defaultMode: null` in `hub-router.json`. A request that carries no `cli-usage-aliases` or `jev-dispatch` phrase therefore scores nothing and resolves no mode: the hub neither invents a route nor falls back to `cli-usage`.

### Why This Matters

A wrong default would disguise unroutable requests as judgments and send non-Jev prompts at the transport. The holdout form of this check keeps the negative honest: the words `score` and `judgment` alone must not be enough, since the signal classes carry the judgment nouns only in their Jev-dispatch phrasing.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CJ-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a request with no Jev signal resolves no mode, and that the judgment-words holdout stays unrouted.
- Real user request: `Summarize the open questions in this spec packet.`
- Prompt: `Summarize the open questions in this spec packet.`
- Expected execution process: run both commands in §3 from the repository root, read each front door JSON, then judge the result against the pass/fail criteria below.
- Expected signals: both prompts answer `action: "defer"` with `selectionKind: null` and `targets: []`. The second prompt, `score this flavor of ice cream`, is the holdout: its judgment-adjacent words must not route.
- Evidence: both commands, their exit statuses, and both front door JSONs.
- Desired user-visible outcome: no workflow mode and no packet for either prompt.
- Pass/fail: PASS when both prompts defer with empty targets; FAIL when either resolves a mode, which means an invented default or a too-greedy signal; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run both commands below exactly as written, from the repository root.
4. Read each front door JSON and confirm the defer with empty targets.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "Summarize the open questions in this spec packet."
node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "score this flavor of ice cream"
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CJ-003 | Hub Routing | Confirm a request with no Jev signal resolves no mode, holdout included | `Summarize the open questions in this spec packet.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "Summarize the open questions in this spec packet."` 2. `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "score this flavor of ice cream"` | Both prompts answer `action: "defer"`, `selectionKind: null`, `targets: []`; the holdout's judgment-adjacent words stay unrouted | Both commands, their exit statuses, and both front door JSONs | PASS when both prompts defer with empty targets; FAIL when either resolves a mode, which means an invented default or a too-greedy signal; SKIP only when the compiled front door cannot start, naming the failure as the blocker | A resolved mode means a catch-all or a default sneaked in: check `hub-router.json` for a hub-identity vocabulary class and for `routerPolicy.defaultMode` (it must stay `null`), and confirm the judgment nouns still require their Jev-dispatch phrasing. If the front door cannot start, fix the launch rather than editing the scenario |

### Recorded Result

Observed during the 09-21 hub-routing remediation: both commands exited 0. The prompt returned `{"hubId":"cli-jev","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"3240ebf5ec2848ba6b0a2c0fabf77f6b1b4c2b7475519154e1f7816fe3a670d2","generation":1}`, and the holdout returned the same defer with empty targets. No mode resolves, no packet loads. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/out-of-domain-resolves-nothing.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hub-router.json](../../hub-router.json) | The router policy whose `defaultMode` stays `null` |
| [SKILL.md](../../SKILL.md) | The hub's routing contract |
| [mode-registry.json](../../mode-registry.json) | The single registered mode a stray route would have to explain |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CJ-003
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/out-of-domain-resolves-nothing.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
