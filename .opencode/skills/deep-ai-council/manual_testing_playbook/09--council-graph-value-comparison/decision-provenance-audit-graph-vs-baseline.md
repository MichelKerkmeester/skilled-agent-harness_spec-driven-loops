---
title: "DAC-028 -- Decision provenance audit: graph vs no-graph baseline"
description: "Real-world scenario comparing operator effort to justify a council decision via evidence chain, with vs without the council graph. Anchors to `runtime query CLI mode='decision_support'`."
---

# DAC-028 -- Decision provenance audit: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-028`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI mode='decision_support'` (and `mode='evidence_chain'`) materially beats the no-graph baseline for the audit task: "the council picked Plan B — what evidence and seat reasoning supports that choice?"

### Why This Matters

When a stakeholder, reviewer, or post-mortem asks "why did the council recommend Plan B?", the answer must be traceable to specific evidence and seat claims. Without graph: the answer requires re-reading the council report, every deliberation, every critique, then manually building a justification narrative. With graph: a structured edge traversal returns DECISION → SUPPORTS → EVIDENCE → SEAT in one call.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-028 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-028` and confirm the with-graph path produces a usable provenance trace where the no-graph baseline produces only unstructured prose.

- Objective: Demonstrate measurable audit-quality improvement between no-graph baseline and graph-driven provenance trace for a council decision.
- Real-world situation: A 3-round, 3-seat council recommended Plan B. Plan B is backed by 3 EVIDENCE nodes (`e1`, `e2`, `e3`) via SUPPORTS edges, proposed by Seat B via PROPOSES edge, and finalized via DECISION → RECOMMENDS → RECOMMENDATION chain. Stakeholder asks: "what specifically supported choosing Plan B over Plan A?"
- Real user request: Tell me exactly what evidence supported choosing Plan B in this council session.
- Prompt: `As a council-graph integration validator, build a Plan-B provenance trace on a seeded council session — first via the no-graph baseline (operator reads council-report.md + every deliberation), then via runtime query CLI with mode decision_support — and confirm the with-graph path returns a structured DECISION/SUPPORTS/EVIDENCE/SEAT trace in one runtime CLI call.`
- Expected execution process: Seed a session with explicit DECISION node for Plan B, 3 EVIDENCE nodes connected via SUPPORTS edges, SEAT B with PROPOSES edge. Run baseline workflow and graph workflow. Compare output quality (structured vs unstructured).
- Expected signals: Graph returns DECISION node + 3 EVIDENCE nodes + Seat B + bounded provenance trace. Baseline produces prose narrative requiring manual cross-reference.
- Desired user-visible outcome: The user can answer "why Plan B?" with cited graph-row IDs and a bounded supporting trace.
- Pass/fail: PASS if graph workflow returns the 3 EVIDENCE nodes via SUPPORTS chain AND baseline workflow takes materially more effort; FAIL if graph response missing evidence or includes unrelated nodes.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed: SESSION + 3 ROUNDs + 3 SEATs + claims + 3 EVIDENCE (`e1`, `e2`, `e3`) + DECISION `decB` with `name: 'Plan B chosen'` + SUPPORTS edges `e{1,2,3} -> decB` + PROPOSES edge `seatB -> decB` + RECOMMENDS edge `decB -> rec1`.
2. Run **no-graph baseline**: read `ai-council/council-report.md` + all 9 deliberation files + 3 critique files; assemble the Plan B justification narrative.
3. Run **with-graph workflow**: `runtime query CLI mode='decision_support' limit:10` scoped to `decB` node.
4. Compare result quality: structured prompt-safe trace with cited node IDs vs free-form prose narrative.

### Prompt

`As a council-graph integration validator, build a Plan-B provenance trace on a seeded council session — first via the no-graph baseline (operator reads council-report.md + every deliberation), then via runtime query CLI with mode decision_support — and confirm the with-graph path returns a structured DECISION/SUPPORTS/EVIDENCE/SEAT trace in one runtime CLI call.`

### Commands

**No-graph baseline:**

1. `bash: cat <spec-folder>`
2. `bash: ls <spec-folder> <spec-folder> | wc -l`
3. `bash: for f in <spec-folder>*.md; do echo "=== $f ==="; rg 'Plan B|evidence|support' "$f"; done`
4. Operator assembles narrative justification (transcript bullet).

**With-graph:**

5. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-028', sessionId: 'dac-028-run-01', nodes: [...SESSION, 3 ROUNDs, 3 SEATs, claims, 3 EVIDENCE, DECISION decB, RECOMMENDATION rec1...], edges: [...e1→decB SUPPORTS, e2→decB SUPPORTS, e3→decB SUPPORTS, seatB→decB PROPOSES, decB→rec1 RECOMMENDS...] })`
6. `tool: runtime query CLI({ specFolder: 'sandbox/dac-028', sessionId: 'dac-028-run-01', mode: 'decision_support', limit: 10 })`

### Expected

Graph response returns DECISION `decB` plus all 3 EVIDENCE nodes (`e1`, `e2`, `e3`) plus Seat B reference, with bounded prompt-safe metadata and a clear edge-traversal trace. Baseline workflow yields a prose narrative requiring manual cross-reference.

### Evidence

Capture: baseline narrative transcript + file-read count, graph response JSON with cited node IDs and edges, one-line value summary ("graph cited 3 evidence nodes by ID; baseline required reading 12+ files").

### Pass / Fail

- **Pass**: Graph returns all 3 SUPPORTS evidence nodes + DECISION + Seat B reference. Baseline takes materially more effort.
- **Fail**: Graph misses an evidence node, returns evidence from a different DECISION, or fails to surface Seat B as proposer.

### Failure Triage

If graph response misses evidence, inspect `lib/council/council-graph-query.ts` `getDecisionSupport` for SUPPORTS-edge traversal depth. If wrong DECISION appears, the seed data may not pin `decision_support` mode to the correct DECISION node id — re-seed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-028 | Decision provenance audit value | Demonstrate graph cites evidence by ID; baseline produces only prose | `As a council-graph integration validator, build a Plan-B provenance trace on a seeded council session — first via the no-graph baseline (operator reads council-report.md + every deliberation), then via runtime query CLI with mode decision_support — and confirm the with-graph path returns a structured DECISION/SUPPORTS/EVIDENCE/SEAT trace in one runtime CLI call.` | baseline: cat + ls + rg artifacts -> with-graph: upsert + query decision_support | Structured trace with 3 evidence nodes + Seat B vs prose narrative | Baseline narrative + graph response | PASS if graph cites all 3 evidence nodes + Seat B | Inspect getDecisionSupport SUPPORTS traversal |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` | Functional anchor for `decision_support` mode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | `getDecisionSupport` helper |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md` §3 | Documents SUPPORTS / PROPOSES / RECOMMENDS edges |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/decision-provenance-audit-graph-vs-baseline.md`
