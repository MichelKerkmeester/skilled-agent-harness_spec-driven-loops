---
title: "DAC-031 -- Hot-topic discovery: graph vs no-graph baseline"
description: "Real-world scenario for surfacing the most-contested claims/decisions in a multi-round council. Graph returns ranked hot nodes by edge-degree; baseline requires manual cross-referencing. Anchors to `runtime query CLI mode='hot_nodes'`."
version: 2.3.0.9
---

# DAC-031 -- Hot-topic discovery: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-031`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI mode='hot_nodes'` materially beats the no-graph baseline for surfacing the most-contested or most-supported topics in a council session — useful for post-deliberation analysis, retrospective synthesis, and identifying where seat conflict concentrates.

### Why This Matters

Operators reviewing complex multi-round councils need to know which claims/decisions are the center of gravity. Without graph: the operator counts cross-references between artifacts by hand — easy to miss, easy to weight wrong. With graph: edge-degree ranking surfaces high-connectivity nodes (most SUPPORTS + CONTRADICTS + EVIDENCE_FOR) in one runtime CLI call.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-031 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-031` and confirm the with-graph path produces a sorted hot-node list backed by edge counts where the no-graph baseline produces only an estimate.

- Objective: Demonstrate `hot_nodes` mode surfaces high-degree contested topics; baseline requires manual cross-reference tallying.
- Real-world situation: 4-round, 3-seat council. CLAIM `c1` has 5 incoming SUPPORTS + 2 CONTRADICTS (highest edge-degree, hottest). CLAIM `c2` has 3 incoming SUPPORTS + 1 CONTRADICTS. CLAIM `c3` has 1 incoming SUPPORTS. DECISION `decA` has 4 incoming SUPPORTS + 3 EVIDENCE_FOR. Operator reviewing post-deliberation wants the top-3 hot nodes.
- Real user request: This 4-round council touched a lot of claims — show me the 3 most-contested or most-supported topics.
- Prompt: `As a council-graph integration validator, identify the top 3 hot nodes in a seeded 4-round council session — first via the no-graph baseline (operator counts cross-references manually), then via runtime query CLI with mode hot_nodes — and confirm the with-graph path returns a ranked list backed by edge-degree counts in one runtime CLI call.`
- Expected execution process: Seed graph with known edge-degree distribution. Run baseline cross-reference tally. Run `runtime query CLI mode='hot_nodes' limit:3`. Compare.
- Expected signals: Graph returns `c1`, `decA`, `c2` (in some ranked order) with edge-degree counts as metadata. Baseline produces estimate requiring operator judgment.
- Desired user-visible outcome: Operator can name the hot topics with cited edge counts in seconds.
- Pass/fail: PASS if top-3 graph response contains `c1` and `decA` (the two highest-degree nodes); FAIL if a low-degree node appears in top-3.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed: SESSION + 4 ROUNDs + 3 SEATs + 5 CLAIMs (`c1`..`c5`) + 2 DECISIONs (`decA`, `decB`) + 3 EVIDENCE (`e1`..`e3`). Wire edges per the contract above so `c1` and `decA` have the highest incoming-edge degree.
2. Run **no-graph baseline**: `rg` for each claim/decision id across `ai-council/**`; manually count cross-references; produce ranked estimate.
3. Run **with-graph workflow**: `runtime query CLI mode='hot_nodes' limit:3`.
4. Compare ordering + counts.

### Prompt

`As a council-graph integration validator, identify the top 3 hot nodes in a seeded 4-round council session — first via the no-graph baseline (operator counts cross-references manually), then via runtime query CLI with mode hot_nodes — and confirm the with-graph path returns a ranked list backed by edge-degree counts in one runtime CLI call.`

### Commands

**No-graph baseline:**

1. `bash: for id in c1 c2 c3 c4 c5 decA decB; do echo "$id: $(rg -c "$id" <spec-folder>**/*.md 2>/dev/null | wc -l)"; done` (text-level cross-reference estimate)
2. Operator builds ranked top-3 estimate from raw counts.

**With-graph:**

3. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-031', sessionId: 'dac-031-run-01', nodes: [...5 claims, 2 decisions, 3 evidence...], edges: [...wire edge-degree per contract...] })`
4. `tool: runtime query CLI({ specFolder: 'sandbox/dac-031', sessionId: 'dac-031-run-01', mode: 'hot_nodes', limit: 3 })`

### Expected

Graph returns top-3 with `c1` and `decA` present, ranked by edge-degree, with `degree` or `connections` field in metadata. Baseline produces text-level cross-reference counts that may or may not match graph-degree depending on artifact narrative.

### Evidence

Capture: baseline text-count tally, graph response with ranked nodes + degree counts, one-line value summary ("graph cited 3 hot nodes with edge counts; baseline produced text-count estimates").

### Pass / Fail

- **Pass**: Graph top-3 contains `c1` AND `decA` (the two highest-degree nodes). Edge-degree count present in response metadata.
- **Fail**: Low-degree node (`c3`, `c4`, `c5`) appears in top-3. Degree metadata missing.

### Failure Triage

If wrong nodes appear in top-3, inspect `lib/council/council-graph-query.ts` `getHotNodes` ranking — should sum SUPPORTS + CONTRADICTS + EVIDENCE_FOR edge counts incoming/outgoing. If degree metadata missing, inspect query response shape.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-031 | Hot-topic discovery value | Demonstrate graph ranks by edge-degree; baseline returns text-count estimate | `As a council-graph integration validator, identify the top 3 hot nodes in a seeded 4-round council session — first via the no-graph baseline (operator counts cross-references manually), then via runtime query CLI with mode hot_nodes — and confirm the with-graph path returns a ranked list backed by edge-degree counts in one runtime CLI call.` | baseline: rg counts -> with-graph: upsert + query hot_nodes | Top-3 = {c1, decA, +1} with degree counts | Baseline tally + graph response | PASS if top-3 contains c1 AND decA | Inspect getHotNodes ranking + degree field |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` | Functional anchor for `hot_nodes` mode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | `getHotNodes` ranking helper |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md` §3 | Documents edge kinds counted toward hotness |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/hot-topic-discovery-graph-vs-baseline.md`
