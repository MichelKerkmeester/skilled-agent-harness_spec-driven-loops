---
title: "DAC-030 -- Stalled-council blocker ranking: graph vs no-graph baseline"
description: "Real-world scenario where a council hits max_rounds without convergence. Operator needs to know what blocked progress and what to fix first. Graph returns ranked blockers; baseline requires unranked artifact survey. Anchors to `runtime query CLI mode='convergence_blockers'`."
version: 2.3.0.9
---

# DAC-030 -- Stalled-council blocker ranking: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-030`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI mode='convergence_blockers'` materially beats the no-graph baseline for the post-stall triage task: "the council hit max_rounds without converging — what are the top blockers and in what order should I address them?"

### Why This Matters

When `max_rounds` is reached without convergence, `council-report.md` carries `convergence: false` per `convergence_signals.md`, but it does not rank what to fix first. The operator must re-read all critiques and disagreements to prioritize. The graph computes a structured blocker list ranked by severity + evidence-depth + node-centrality in one call.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-030 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-030` and confirm the with-graph path returns a ranked actionable list where the no-graph baseline returns only an unranked survey.

- Objective: Demonstrate the graph produces a prioritized blocker list; the baseline produces an unranked dump.
- Real-world situation: 4-round council hit `max_rounds` without convergence. Three blockers exist: (a) DISAGREEMENT `d1` critical severity over a security claim (top priority), (b) DISAGREEMENT `d2` medium severity over a UX detail, (c) CLAIM `c5` with low evidence depth (only 1 EVIDENCE node) that prevented a tiebreaker. Operator needs to know what to address first.
- Real user request: This council didn't converge after 4 rounds. What are the top blockers and what should I fix first?
- Prompt: `As a council-graph integration validator, triage a stalled 4-round council session — first via the no-graph baseline (read all critiques + disagreements), then via runtime query CLI with mode convergence_blockers — and confirm the with-graph path returns a ranked blocker list naming the critical disagreement first.`
- Expected execution process: Seed graph with 3 known blockers as above. Run baseline survey workflow. Run `runtime query CLI mode='convergence_blockers'`. Compare prioritization.
- Expected signals: Baseline yields unranked list. Graph returns blockers ranked by severity / evidence / centrality with `d1` first.
- Desired user-visible outcome: Operator knows exactly where to focus the next round's work.
- Pass/fail: PASS if graph orders `d1` (critical) before `d2` (medium) before `c5` (low evidence); FAIL if order is wrong or critical is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed: SESSION + 4 ROUNDs (last round emits `council_complete` with `convergence:false`) + 3 SEATs + claims including `c5` with only 1 EVIDENCE attached. DISAGREEMENT `d1` with `metadata: { severity: 'critical' }` no RESOLVES; DISAGREEMENT `d2` with `metadata: { severity: 'medium' }` no RESOLVES; CONTRADICTS edges to relevant decisions.
2. Run **no-graph baseline**: read every critique + every deliberation, compile blocker list, attempt manual prioritization.
3. Run **with-graph workflow**: `runtime query CLI mode='convergence_blockers' limit:5`.
4. Compare order + completeness.

### Prompt

`As a council-graph integration validator, triage a stalled 4-round council session — first via the no-graph baseline (read all critiques + disagreements), then via runtime query CLI with mode convergence_blockers — and confirm the with-graph path returns a ranked blocker list naming the critical disagreement first.`

### Commands

**No-graph baseline:**

1. `bash: cat <spec-folder> | rg -i 'convergence|blocker|unresolved|max_rounds'`
2. `bash: find <spec-folder> -type f -name '*.md' | xargs wc -l` (capture artifact-volume baseline)
3. `bash: for f in <spec-folder>*.md; do rg -l 'critical|disagreement|low evidence' "$f"; done` (operator builds unranked list)

**With-graph:**

4. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-030', sessionId: 'dac-030-run-01', nodes: [...c5 low evidence, d1 critical, d2 medium, claims, decisions...], edges: [...CONTRADICTS, SUPPORTS, EVIDENCE_FOR...] })`
5. `tool: runtime query CLI({ specFolder: 'sandbox/dac-030', sessionId: 'dac-030-run-01', mode: 'convergence_blockers', limit: 5 })`

### Expected

Graph response returns ordered blockers: `d1` (critical), then `d2` (medium), then `c5` (low evidence depth). Each blocker includes a reason field naming the contributing signal. Baseline produces unranked listing requiring operator judgment.

### Evidence

Capture: baseline file-count + unranked list, graph response with ranked entries + reason fields, one-line value summary ("graph ranked 3 blockers; baseline returned 3 unranked hits").

### Pass / Fail

- **Pass**: Graph orders `d1` before `d2` before `c5`. Each blocker has a reason field.
- **Fail**: `d1` is not ranked first. `d2` or `c5` appears before `d1`. Reason fields missing.

### Failure Triage

If `d1` is not first, inspect `lib/council/council-graph-query.ts` `getConvergenceBlockers` ranking — severity should dominate evidence-depth and centrality. If reason fields missing, inspect handler response shape.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-030 | Stalled-council blocker ranking value | Demonstrate graph ranks blockers; baseline returns unranked list | `As a council-graph integration validator, triage a stalled 4-round council session — first via the no-graph baseline (read all critiques + disagreements), then via runtime query CLI with mode convergence_blockers — and confirm the with-graph path returns a ranked blocker list naming the critical disagreement first.` | baseline: cat report + rg critiques -> with-graph: upsert + query convergence_blockers | Ranked d1, d2, c5 with reason fields vs unranked baseline | Baseline transcript + graph response | PASS if d1 ranked first with reason | Inspect getConvergenceBlockers ranking + reason field |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md` | Functional anchor for `convergence_blockers` mode |
| `../04--convergence-and-rollback/max-rounds-without-convergence-emits-non-converged.md` | Baseline `convergence:false` behavior |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | `getConvergenceBlockers` helper |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/references/convergence/convergence_signals.md` | Documents `max_rounds` escape hatch |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/stalled-council-blocker-ranking-graph-vs-baseline.md`
