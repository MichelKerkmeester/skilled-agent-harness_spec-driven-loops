#!/usr/bin/env python3
"""Draft the CC-001, CC-002 and CC-003 scenario rewrites (scratch attachments only)."""
A='specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build/attach/playbook/hub-routing/'
H='.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/'
def apply(t, reps):
    for o,n in reps:
        assert t.count(o)==1,(o[:70],t.count(o))
        t=t.replace(o,n)
    return t
FD='node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt'
ADV='node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt'
# CC-001
t=open(H+'deem-request-routes-to-transport.md').read()
t=apply(t,[
('title: "CC-001 -- A Deem request resolves cli-classifier"','title: "CC-001 -- A Deem request resolves mode cli-deem"'),
('description: "This scenario validates that a Deem judgment request resolves the cli-classifier hub and its cli-deem transport, for `CC-001`."','description: "This scenario validates that a Deem judgment request resolves the cli-classifier hub and its cli-deem mode, for `CC-001`."'),
('version: 1.0.0.0','version: 1.1.0.0'),
('# CC-001 -- A Deem request resolves cli-classifier','# CC-001 -- A Deem request resolves mode cli-deem'),
("The hub is useful only when a request that names Deem reaches it. The advisor scores the hub's `graph-metadata.json` signals at stage one. The hub has no compiled activation manifest, so stage two resolves through `hub-router.json`, where `cli-deem` is the only registered signal.",
 "The hub is useful only when a request that names Deem reaches it and stays with Deem. The advisor scores the hub's `graph-metadata.json` signals at stage one. Stage two is the compiled front door, which serves the policy built from `hub-router.json`, where the `ask deem` phrase is a `cli-deem` signal and no Jev phrase is present, so `cli-jev` must not appear."),
("- Objective: Confirm a Deem judgment request ranks `cli-classifier` first and the registry resolves `cli-deem`.","- Objective: Confirm a Deem judgment request ranks `cli-classifier` first and the front door resolves a single `cli-deem` target."),
("- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `{\"servingAuthority\":\"legacy\",\"hubId\":\"cli-classifier\"}`. The registry lists exactly `cli-deem`.",
 "- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `action: \"route\"` with `selectionKind: \"single\"` and one target whose `workflowMode` and `packetId` are both `cli-deem`. The registry lists `cli-deem,cli-jev`."),
("- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-deem` as the resolved transport.","- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-deem` as the resolved mode."),
("- Pass/fail: PASS if all three signals hold. FAIL if the advisor ranks another skill first or the registry lists anything but `cli-deem`. SKIP only",
 "- Pass/fail: PASS if all three signals hold. FAIL if the advisor ranks another skill first, the front door routes anything but a single `cli-deem` target or the registry lists other modes. SKIP only"),
("| CC-001 | A Deem request resolves cli-classifier | Confirm a Deem judgment request ranks `cli-classifier` first and the registry resolves `cli-deem` |",
 "| CC-001 | A Deem request resolves mode cli-deem | Confirm a Deem judgment request ranks `cli-classifier` first and the front door resolves a single `cli-deem` target |"),
("| Step 1: first recommendation `cli-classifier`. Step 2: the legacy sentinel naming `cli-classifier`. Step 3: `cli-deem` |",
 "| Step 1: first recommendation `cli-classifier`. Step 2: a compiled `route` with one `cli-deem` target. Step 3: `cli-deem,cli-jev` |"),
("| PASS if all three signals hold. FAIL if another skill ranks first or the registry lists anything but `cli-deem`. SKIP only",
 "| PASS if all three signals hold. FAIL if another skill ranks first, the front door routes anything but a single `cli-deem` target or the registry lists other modes. SKIP only"),
("| [mode-registry.json](../../mode-registry.json) | The single registered mode |","| [mode-registry.json](../../mode-registry.json) | The two registered modes |"),
])
open(A+'deem-request-routes-to-transport.md','w').write(t)
# CC-002, rewritten in place
P='ask jev for a probability that this plan ships on time'
t=f'''---
id: CC-002
category: hub_routing
stage: routing
title: "CC-002 -- A Jev request resolves mode cli-jev"
description: "This scenario validates that a request naming the hosted Jev service ranks cli-classifier first and resolves mode cli-jev over the cli-usage packet, for `CC-002`."
expected_intent: cli-jev
expected_resources:
  - cli-usage/SKILL.md
expected_workflow_mode: cli-jev
expected_leaf_resources: []
version: 1.1.0.0
---

# CC-002 -- A Jev request resolves mode cli-jev

This document captures the realistic routing contract, observed behavior, execution flow, source anchors and metadata for `CC-002`.

---

## 1. OVERVIEW

This scenario validates that a request naming the hosted Jev service ranks `cli-classifier` first at stage one and resolves mode `cli-jev`, over the `cli-usage` packet, at stage two.

### Why This Matters

Deem and Jev answer the same judgment types from different backends, and a caller names its backend. Both transports now live in this hub, so the split moved from the advisor to the router: the advisor resolves the hub, and `hub-router.json` must send a Jev request to `cli-jev` and never to `cli-deem`, because the two never fail over silently. The file name records the earlier split, when Jev had a hub of its own.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a Jev request ranks `cli-classifier` first and the front door resolves a single `cli-jev` target.
- Real user request: `{P}`
- Prompt: `{P}`
- Expected execution process: Run the advisor, then the compiled front door, from the repository root.
- Expected signals: The advisor's first recommendation is `cli-classifier`. The front door answers `action: "route"` with `selectionKind: "single"` and one target whose `workflowMode` is `cli-jev` and whose `packetId` is `cli-usage`. No `cli-deem` target appears.
- Desired user-visible outcome: A verdict that names `cli-classifier` as the routed hub and `cli-jev` as the resolved mode.
- Pass/fail: PASS if both signals hold. FAIL if another skill ranks first, the front door defers or a `cli-deem` target appears. SKIP only when the advisor runtime is unavailable. Record that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. `bash: {ADV} "{P}" --format json`
2. `bash: {FD} "{P}"`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-002 | A Jev request resolves mode cli-jev | Confirm a Jev request ranks `cli-classifier` first and the front door resolves a single `cli-jev` target | `{P}` | 1. `bash: {ADV} "{P}" --format json` -> 2. `bash: {FD} "{P}"` | Step 1: first recommendation `cli-classifier`. Step 2: a compiled `route` with one `cli-jev` target over `cli-usage` and no `cli-deem` target | Both transcripts with exit statuses | PASS if both signals hold. FAIL if another skill ranks first, the front door defers or a `cli-deem` target appears. SKIP only when the advisor runtime is unavailable, recorded as the blocker | 1. Confirm the advisor graph includes the hub's Jev signals in `graph-metadata.json`. 2. Check `hub-router.json` for the `ask jev` phrase in the `jev-dispatch` class. 3. A `cli-deem` target means a Deem phrase matched: remove the overlap rather than editing this scenario |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [graph-metadata.json](../../graph-metadata.json) | The stage-one signals, which carry the Jev vocabulary |
| [hub-router.json](../../hub-router.json) | The stage-two vocabulary that separates `cli-jev` from `cli-deem` |

---

## 5. SOURCE METADATA

- Group: Hub Routing
- Playbook ID: CC-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `hub-routing/jev-request-stays-with-cli-jev.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
'''
open(A+'jev-request-stays-with-cli-jev.md','w').write(t)
# CC-003, merged with the retired hub's CJ-003
t=open(H+'out-of-domain-resolves-nothing.md').read()
P3='summarize the release notes for the last sprint'
Q1='Summarize the open questions in this spec packet.'
Q2='score this flavor of ice cream'
t=apply(t,[
('description: "This scenario validates that a request with no classifier signal produces no cli-classifier recommendation, for `CC-003`."',
 'description: "This scenario validates that a request with no classifier signal produces no cli-classifier recommendation and that the front door defers it and a judgment-words holdout, for `CC-003`."'),
('version: 1.0.0.0','version: 1.1.0.0'),
("This scenario validates that a request with no classifier signal produces no `cli-classifier` recommendation.\n",
 "This scenario validates that a request with no classifier signal produces no `cli-classifier` recommendation, and that the front door defers it. It absorbs the retired `cli-jev` hub's `CJ-003`, whose two front-door prompts, one of them a judgment-words holdout, run here as steps 3 and 4.\n"),
("A hub that routes too broadly takes requests that belong elsewhere. The `cli-classifier` vocabulary names Deem in every multi-word phrase, so ordinary judgment words alone must not reach it.",
 "A hub that routes too broadly takes requests that belong elsewhere. The `cli-classifier` vocabulary names Jev or Deem in every multi-word phrase, and `routerPolicy.defaultMode` is `null`, so ordinary judgment words alone must not reach either transport."),
("- Objective: Confirm a request with no classifier signal produces no `cli-classifier` recommendation.","- Objective: Confirm a request with no classifier signal produces no `cli-classifier` recommendation and no front-door route, holdout included."),
("- Expected execution process: Run the advisor once from the repository root and inspect the recommendations array.",
 "- Expected execution process: Run the advisor once, then the compiled front door for the prompt and the two carried-over prompts, from the repository root."),
("- Expected signals: `cli-classifier` appears nowhere in the array.",
 "- Expected signals: `cli-classifier` appears nowhere in the advisor array. Each front-door call answers `action: \"defer\"` with `selectionKind: null` and `targets: []`."),
("- Pass/fail: PASS if `cli-classifier` is absent. FAIL if it appears at any rank. SKIP only",
 "- Pass/fail: PASS if `cli-classifier` is absent and every front-door call defers with empty targets. FAIL if the hub appears at any rank or any call routes. SKIP only"),
(f'1. `bash: {ADV} "{P3}" --format json`\n',
 f'1. `bash: {ADV} "{P3}" --format json`\n2. `bash: {FD} "{P3}"`\n3. `bash: {FD} "{Q1}"`\n4. `bash: {FD} "{Q2}"`\n'),
("| Confirm a request with no classifier signal produces no `cli-classifier` recommendation |","| Confirm a request with no classifier signal produces no `cli-classifier` recommendation and no front-door route |"),
(f'| 1. `bash: {ADV} "{P3}" --format json` | Step 1: no `cli-classifier` entry |',
 f'| 1. `bash: {ADV} "{P3}" --format json` -> 2. `bash: {FD} "{P3}"` -> 3. `bash: {FD} "{Q1}"` -> 4. `bash: {FD} "{Q2}"` | Step 1: no `cli-classifier` entry. Steps 2 to 4: `defer` with empty targets |'),
("| The transcript, its exit status and the recommendations array | PASS if `cli-classifier` is absent. FAIL if it appears at any rank.",
 "| Every transcript, its exit status, the recommendations array and each front door JSON | PASS if `cli-classifier` is absent and every front-door call defers. FAIL if it appears at any rank or any call routes."),
("1. Check `graph-metadata.json` for a single-word signal that matches ordinary text. 2. Narrow the signal rather than editing this scenario |",
 "1. Check `graph-metadata.json` for a single-word signal that matches ordinary text. 2. Check `hub-router.json` for a hub-identity class or a non-null `routerPolicy.defaultMode`. 3. Narrow the signal rather than editing this scenario |"),
("| [hub-router.json](../../hub-router.json) | The stage-two vocabulary |","| [hub-router.json](../../hub-router.json) | The stage-two vocabulary and the `null` default mode |"),
])
open(A+'out-of-domain-resolves-nothing.md','w').write(t)
print('ok')
