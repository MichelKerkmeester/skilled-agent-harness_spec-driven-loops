---
title: "DAC-027 -- Unresolved disagreement triage: graph vs no-graph baseline"
description: "Real-world scenario comparing operator effort to identify unresolved critical disagreements after a multi-round council, with vs without the council graph. Anchors to `runtime query CLI mode='unresolved_disagreements'`."
version: 2.3.0.9
---

# DAC-027 -- Unresolved disagreement triage: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-027`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI mode='unresolved_disagreements'` materially beats the no-graph baseline for the common operator task: "after a 3-round council, which critical disagreements were never resolved?"

### Why This Matters

Council deliberation produces 5+ artifacts per seat per round. A 3-round, 3-seat run yields ≥45 artifact files. Triaging which DISAGREEMENT nodes remain unresolved by re-reading every critique is slow, error-prone, and breaks down when reviewing weeks-old sessions. The graph collapses this to one runtime CLI call.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-027 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-027` and confirm the with-graph path produces the same answer as the no-graph baseline in materially less effort.

- Objective: Demonstrate measurable effort reduction between no-graph baseline and graph-driven workflow for finding unresolved critical disagreements.
- Real-world situation: A 3-round, 3-seat council shipped 4 DISAGREEMENT nodes. Seat A and Seat B reached agreement on 2 of them via RESOLVES edges in round 3. The remaining 2 carry `severity: 'critical'` and have no RESOLVES edge. Operator needs to list the unresolved criticals before declaring convergence.
- Real user request: After this 3-round council finishes, give me the critical disagreements that never got resolved.
- Prompt: `As a council-graph integration validator, run the unresolved-disagreement triage on a seeded 3-round council session — first via the no-graph baseline (operator reads artifacts), then via runtime query CLI with mode unresolved_disagreements — and confirm the with-graph path returns the same 2 critical unresolved nodes in one runtime CLI call.`
- Expected execution process: Seed graph with 3 rounds, 3 seats, 12 claims, 4 disagreements (2 resolved via RESOLVES edges in round 3, 2 critical unresolved). Run baseline workflow and graph workflow. Compare answers and effort.
- Expected signals: Both workflows identify the same 2 unresolved critical disagreement nodes. Graph workflow uses 1 runtime CLI call returning bounded prompt-safe metadata. Baseline workflow requires reading ≥12 artifact files manually.
- Desired user-visible outcome: The user sees the graph cuts triage effort from "scan 12+ files" to "one call returns 2 nodes".
- Pass/fail: PASS if both workflows agree on the unresolved set AND the graph workflow uses materially fewer reads; FAIL if answers diverge or the graph response includes resolved disagreements.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed the council graph: SESSION + 3 ROUNDs + 3 SEATs + 12 CLAIMs + 4 DISAGREEMENTs with RESOLVES edges on disagreements `d2` and `d4` only. Disagreements `d1` and `d3` carry `metadata: { severity: 'critical' }` and no RESOLVES edge.
2. Run the **no-graph baseline workflow**: list every file under `ai-council/deliberations/**` and `ai-council/critiques/**`, read each, extract DISAGREEMENT mentions, cross-reference resolution language, build the unresolved list. Capture file-read count and conclusion.
3. Run the **with-graph workflow**: one runtime CLI call `runtime query CLI mode='unresolved_disagreements' limit:10`.
4. Compare both answers and report the effort delta.

### Prompt

`As a council-graph integration validator, run the unresolved-disagreement triage on a seeded 3-round council session — first via the no-graph baseline (operator reads artifacts), then via runtime query CLI with mode unresolved_disagreements — and confirm the with-graph path returns the same 2 critical unresolved nodes in one runtime CLI call.`

### Commands

**No-graph baseline:**

1. `bash: find <spec-folder> -type f | wc -l` (capture count, expect ≥12)
2. `bash: for f in <spec-folder>*.md <spec-folder>*.md; do rg -l 'DISAGREEMENT|disagreement|conflict|unresolved' "$f" 2>/dev/null; done` (manual review of each hit follows)
3. Capture operator's conclusion in a transcript bullet.

**With-graph:**

4. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-027', sessionId: 'dac-027-run-01', nodes: [...12 claims, 4 disagreements (d1/d3 critical, d2/d4 with RESOLVES)...], edges: [...] })`
5. `tool: runtime query CLI({ specFolder: 'sandbox/dac-027', sessionId: 'dac-027-run-01', mode: 'unresolved_disagreements', limit: 10 })`

### Expected

Both workflows identify the same 2 unresolved critical disagreement nodes (`d1`, `d3`). Graph workflow uses 1 runtime CLI call with bounded prompt-safe response. Baseline workflow requires reading 12+ artifact files and cross-referencing resolution language manually.

### Evidence

Capture: baseline file-read count, baseline conclusion, graph response JSON, and a one-line value delta ("graph cut effort from 12 file reads to 1 runtime CLI call").

### Pass / Fail

- **Pass**: Both workflows agree on the unresolved set. Graph response contains only `d1` and `d3`. Baseline requires materially more effort (≥10× the file reads).
- **Fail**: Answers diverge. Graph response includes resolved nodes `d2` or `d4`. Graph response missing `d1` or `d3`.

### Failure Triage

If graph response includes resolved disagreements, inspect `lib/council/council-graph-query.ts` `getUnresolvedDisagreements` for RESOLVES-edge filtering regression. If answers diverge between workflows, the seed data does not match the documented contract — re-seed and retry.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-027 | Unresolved disagreement triage value | Demonstrate graph beats baseline for triage | `As a council-graph integration validator, run the unresolved-disagreement triage on a seeded 3-round council session — first via the no-graph baseline (operator reads artifacts), then via runtime query CLI with mode unresolved_disagreements — and confirm the with-graph path returns the same 2 critical unresolved nodes in one runtime CLI call.` | baseline: find + rg artifacts -> manual review -> with-graph: upsert + query | Same 2 unresolved critical nodes; baseline ≥12 reads vs 1 runtime CLI call | Baseline transcript + graph response + value-delta line | PASS if equal answers + materially less effort | Inspect getUnresolvedDisagreements RESOLVES-edge filter |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` | Functional anchor for `unresolved_disagreements` mode |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script for `runtime query CLI` |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | `getUnresolvedDisagreements` helper |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | "upserts prompt-safe council graph data and queries unresolved disagreements and decision support" |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/graph_support.md` §3 | Documents the RESOLVES edge contract |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-027
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/unresolved-disagreement-triage-graph-vs-baseline.md`
