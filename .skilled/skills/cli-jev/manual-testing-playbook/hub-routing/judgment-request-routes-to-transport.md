---
id: CJ-001
category: hub_routing
stage: routing
title: "A Jev judgment request resolves cli-usage"
description: "Confirm the hub resolves a Jev judgment request to the single cli-usage transport, for `CJ-001`."
expected_intent: cli-usage
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-usage
expected_leaf_resources: []
created: 2026-09-20
version: 0.2.0.3
---

# CJ-001: A Jev judgment request resolves cli-usage

This document captures the realistic routing contract, observed behavior, execution flow, source anchors, and metadata for `CJ-001`.

---

## 1. OVERVIEW

The `jev judgment` phrase is a `cli-usage-aliases` signal, so the hub resolves `workflowMode: cli-usage` and selects the `cli-usage` transport packet. Because the hub is single-transport, the answer is one dominant route rather than an ordered bundle or a deferred disambiguation.

### Why This Matters

The phrase has to be one the hub vocabulary actually carries: a bare `jev` with a distant `probability` is a defer, not a route, because a multi-word detector only spans two intervening words. Now that the hub has joined the compiled serving closure the compiled-route CLI answers with a route whose target is `cli-usage` rather than the legacy sentinel, so this check reads an observed route.

The hub's own `description.json` and `graph-metadata.json` advertise phrasings that name Jev with an ordinary verb or preposition, such as `ask jev for a probability` and `score these three levels with jev`. Six of them used to defer, and nothing here noticed, because this scenario only replayed an exact alias. The `jev-dispatch` class now carries `ask jev`, `use jev`, `with jev` and `through jev` for them. The second command replays the six phrasings, so a vocabulary that narrows again shows up here as a defer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CJ-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the hub resolves a Jev judgment request to the single `cli-usage` transport.
- Real user request: `Use jev judgment to decide whether this incident is urgent, and give me the probability.`
- Prompt: `Use jev judgment to decide whether this incident is urgent, and give me the probability.`
- Expected execution process: run the command sequence in §3 from the repository root, read the front door's JSON, then judge the result against the pass/fail criteria below.
- Expected signals: the front door answers `action: "route"` with `selectionKind: "single"` and one target whose `workflowMode` and `packetId` are both `cli-usage` and whose `packetKind` is `transport`, resolved under the compiled policy rather than the legacy sentinel. Each of the six advertised phrasings in the second command returns the same single target.
- Evidence: both commands, their exit statuses and every front door JSON they print.
- Desired user-visible outcome: the resolved workflow mode `cli-usage` with the `cli-usage` transport packet.
- Pass/fail: PASS when the prompt and all six phrasings each route a single `cli-usage` target; FAIL when any of them defers, resolves a different mode, or answers with the legacy sentinel; SKIP only when the compiled front door cannot start, naming the failure as the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run the command sequence below exactly as written, from the repository root.
4. Read each front door JSON and confirm the single `cli-usage` target.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "Use jev judgment to decide whether this incident is urgent, and give me the probability."
for p in "ask jev for a probability that this plan ships on time" "score these three levels with jev" "run a batch of typed questions through jev" "pick one option with jev" "order levels with jev" "batch typed questions through jev"; do node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "$p"; done
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CJ-001 | Hub Routing | Confirm a Jev judgment request resolves the single `cli-usage` transport | `Use jev judgment to decide whether this incident is urgent, and give me the probability.` | 1. `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "Use jev judgment to decide whether this incident is urgent, and give me the probability."` 2. the phrasing loop in the Commands block, one front-door call per advertised phrasing | `action: "route"`, `selectionKind: "single"`, one target with `workflowMode: "cli-usage"`, `packetId: "cli-usage"` and `packetKind: "transport"`, the compiled policy hash and generation, not the legacy sentinel, for the prompt and for each of the six phrasings | Both commands, their exit statuses and every front door JSON they print | PASS when the prompt and all six phrasings each route a single `cli-usage` target; FAIL when any of them defers, resolves a different mode, or answers with the legacy sentinel; SKIP only when the compiled front door cannot start, naming the failure as the blocker | A defer or a second target means the vocabulary signal did not carry: check `hub-router.json` `vocabularyClasses` for the `jev judgment` phrase and, for a phrasing, the `ask jev`, `use jev`, `with jev` and `through jev` entries in `jev-dispatch`, then the compiled policy generation. A legacy sentinel after a vocabulary edit means the activation manifest was not re-minted. If the front door cannot start, fix the launch rather than editing the scenario |

### Recorded Result

Observed during the 09-21 hub-routing remediation: the command exited 0 and the front door answered `{"hubId":"cli-jev","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-dispatch","packetId":"cli-usage","packetKind":"transport","skillId":"cli-jev","workflowMode":"cli-usage"}],"effectivePolicyHash":"3240ebf5ec2848ba6b0a2c0fabf77f6b1b4c2b7475519154e1f7816fe3a670d2","generation":1}`. The route is a single `cli-usage` target under the same policy hash the 09-20 baseline recorded. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `hub-routing/judgment-request-routes-to-transport.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hub-router.json](../../hub-router.json) | The vocabulary classes the judgment signals match |
| [mode-registry.json](../../mode-registry.json) | The single registered mode and its packet kind |
| [SKILL.md](../../SKILL.md) | The hub's routing contract |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CJ-001
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `hub-routing/judgment-request-routes-to-transport.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
