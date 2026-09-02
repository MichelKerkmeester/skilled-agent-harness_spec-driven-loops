---
title: "CHT-008 -- The form comes from the lookup, and the diagram boundary holds"
description: "This scenario validates routing and form selection for `CHT-008`. It confirms a chart request reaches this packet and resolves to a named catalog row, while a structural-visual request still reaches the neighbouring diagram packet."
stage: routing
version: 1.0.0.0
---

# CHT-008 -- The form comes from the lookup, and the diagram boundary holds

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CHT-008`.

---

## 1. OVERVIEW

This scenario validates routing and form selection for `CHT-008`. It confirms a chart request reaches this packet and resolves to a named catalog row, while a structural-visual request still reaches the neighbouring diagram packet.

### Why This Matters

Two packets under one hub draw pictures, and the line between them is what the artifact carries rather than which one was asked first. A diagram carries a structure a reader follows. A chart carries values a reader compares. The neighbour's own selection guide names bar, line, scatter, radar, Gantt and org types, so this packet answers the form names that packet has no file for plus the data-qualified phrasings, and it leaves the bare type names alone.

That split lives in vocabulary, which means either side can quietly take the other's traffic with one edit. The symptom is one wrong answer to one request. No check goes red, because both packets are correctly registered and both route to something.

Routing runs in two stages and each can pass while the other is broken. The advisor scores the hub, then the hub's router picks the mode. A stage-one hit with no stage-two intent, or the reverse, means the two disagree about the same phrasing, and both sides need fixing rather than the one that happens to be failing.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHT-008` and confirm the expected signals without contradictory evidence.

- Objective: confirm a chart request reaches this packet at both routing stages, resolves to one catalog row and leaves the neighbouring diagram packet its own traffic
- Real user request: `Make a waterfall chart of the budget movement from gross to net.`
- Prompt: `Make a waterfall chart of the budget movement from gross to net, and tell me which row of the lookup you used.`
- Expected execution process: the advisor scores the hub above the mandatory-invoke bar, the hub router resolves the mode and names its reference resources, the catalog is read, one row is chosen for the question and the file that row names is copied whole rather than rewritten.
- Expected signals: stage one returns `sk-doc` above the bar. Stage two returns the chart mode with the matched alias and resolves the catalog, the colour systems and the template contract, all of which exist on disk. The agent names the row it used. A structural-visual request resolves to the diagram mode instead.
- Desired user-visible outcome: a chart request gets a chart traceable to a named row, and a diagram request still gets a diagram.
- Pass/fail: PASS when both stages resolve this packet for the chart request, the neighbour still takes the diagram request and the delivered file traces to one row. FAIL when either stage resolves the wrong packet, when a resolved resource is not on disk or when the chart was written freehand while a row for its question exists.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Make a waterfall chart of the budget movement from gross to net, and tell me which row of the lookup you used.`

### Commands

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "make a waterfall chart of the budget movement" --threshold 0.8 > stage-one.txt 2>&1`
2. `bash: node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-doc --task "make a waterfall chart of the budget movement" > stage-two.txt 2>&1`
3. `bash: node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-doc --task "create a diagram of the checkout flow" > neighbour.txt 2>&1`
4. `agent: Read references/catalog.md and name the row that answers a step by step movement from gross to net`
5. `agent: Copy the file that row names, swap its data block and report the row id`
6. `bash: node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs > corpus.txt 2>&1`
7. `bash: git status --porcelain .opencode/skills/sk-doc/sk-create-chart`

### Expected

Step 1 returns `sk-doc` above the threshold with the matched signal in its reason. Step 2 returns the chart mode as the intent, the matched alias that carried it and a resource list holding the catalog, the colour systems and the template contract, with an empty unresolved list. Step 3 returns the diagram mode, which is the half of the boundary that has to keep working. Step 4 resolves to the waterfall row in the time family. Step 5 produces one self-contained file that names its row. Step 6 confirms the corpus is unchanged. Step 7 returns empty output, because the delivery is written outside the packet.

Stage two is the stage that decides the mode, and it resolves on the alias rather than on the sentence. Stage one decides the hub.

### Evidence

Capture the prompt as typed, all three routing outputs in full, the exit status of each read separately, the confidence and matched signals from stage one, the intent, the matched alias and the resolved resource list from stage two, the row id the agent named, the path of the delivered file and the corpus-check `RESULT:` line. Record `git status --porcelain` for the packet path.

### Pass / Fail

- **Pass**: stage one returns the hub above the bar, stage two returns the chart mode with resolvable resources, the diagram request still returns the diagram mode and the delivery traces to a named row.
- **Fail**: either stage resolves a different packet for the chart request, the diagram request is taken by this packet, a resolved resource is missing from disk or a chart was written freehand while a row for its question exists.

### Failure Triage

1. Read both stages before concluding anything. A registry entry is not a route, and a green per-hub gate asserts presence rather than reachability.
2. A bare two-word form name is a weaker signal than a sentence. Short fragments score lower at stage one than a full request does, so a fragment sitting under the bar while a real request clears it is expected rather than a regression. Compare a fragment against a full phrasing before reporting a routing fault.
3. When stage two resolves and stage one does not, the mode's vocabulary reaches the router but not the hub's advisor metadata. Both surfaces carry vocabulary and they are edited separately.
4. When the diagram request starts resolving here, read the alias list for a term generic enough to catch it. An alias earns its place by catching a request for this mode, and a term that also matches unrelated work takes traffic the packet cannot serve.
5. When no row answers the question, the correct outcome is to report the gap rather than to improvise a form. A freehand chart that renders is the failure this rule exists to prevent, and it looks like a success.

### Optional Supplemental Checks

Replay a data-qualified crossover such as a bar chart of a named measure, then replay the bare type name alone. The first should reach this packet and the second should stay with the neighbour. That pair is the boundary stated as an experiment rather than as a paragraph, and it is the cheapest way to catch a vocabulary edit that widened one side.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Primary anchor, section 1 for the boundary and the name split |
| [`references/catalog.md`](../../references/catalog.md) | The rows a delivery has to trace back to |
| [`../ROUTER.md`](../../../ROUTER.md) | Stage-two leaf selection for the hub |
| [`../mode-registry.json`](../../../mode-registry.json) | The mode registration and its aliases |
| [`../sk-create-diagram/SKILL.md`](../../../sk-create-diagram/SKILL.md) | The neighbour on the other side of the boundary |

---

## 5. SOURCE METADATA

- Group: DELIVERY AND ROUTING
- Playbook ID: CHT-008
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `delivery-and-routing/form-choice-and-the-diagram-boundary.md`
