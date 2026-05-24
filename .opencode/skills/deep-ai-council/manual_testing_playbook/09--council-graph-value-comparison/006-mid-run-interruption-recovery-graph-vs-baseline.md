---
title: "DAC-032 -- Mid-run interruption recovery: graph vs no-graph baseline"
description: "Real-world scenario where a council process is interrupted mid-round. Graph status returns counts, readiness, and a namespace-scoped recovery payload; baseline requires manual JSONL parsing. Anchors to `runtime status CLI`."
---

# DAC-032 -- Mid-run interruption recovery: graph vs no-graph baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-032`.

---

## 1. OVERVIEW

This scenario validates that `runtime status CLI` materially beats the no-graph baseline for the operations task: "the council process was killed mid-round — where did state stop, and how do I recover?"

### Why This Matters

The append-only `ai-council-state.jsonl` captures every state transition, including `council_complete`. When the process is interrupted before `council_complete`, the operator must determine the last completed round, what artifacts persisted, and whether to resume or roll back. Without graph: parse the JSONL line-by-line, cross-reference filesystem artifacts. With graph: `runtime status CLI` returns counts + readiness + namespace-scoped `recovery` payload in one call.

> **Automated test anchor:** `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` test name `DAC-032 graph beats no-graph baseline`. Measured baseline-vs-graph ratios live in `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json`.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-032` and confirm the with-graph path produces a structured recovery payload while the no-graph baseline requires manual JSONL forensics.

- Objective: Demonstrate `runtime status CLI` returns structured recovery context where the baseline requires manual JSONL parsing.
- Real-world situation: A 4-round council was killed (e.g., SIGKILL) during round 3. `ai-council-state.jsonl` carries `round_started` for round 3 but no `round_complete` and no `council_complete` event. Graph rows for rounds 1 and 2 are fully persisted; round 3 has partial seat nodes but no DECISION node. Operator returns to triage the interrupted run.
- Real user request: This council process got killed during round 3 — where did state stop, and can I recover?
- Prompt: `As a council-graph integration validator, recover from an interrupted council session — first via the no-graph baseline (manually parse ai-council-state.jsonl), then via runtime status CLI — and confirm the with-graph path returns counts, readiness, and a namespace-scoped recovery payload in one runtime CLI call.`
- Expected execution process: Seed an interrupted state: 2 full rounds persisted to graph, 1 partial round, no `council_complete` event in JSONL. Run baseline JSONL forensics. Run `runtime status CLI`. Compare diagnostic quality.
- Expected signals: Baseline yields raw JSONL events requiring operator interpretation. Graph returns `counts: { sessions, rounds, seats, claims, evidence, disagreements, decisions, recommendations }`, `readiness: ...`, `signals: { ... }`, `recovery: { replay-hint scoped to (specFolder, sessionId) }`.
- Desired user-visible outcome: Operator knows exactly which round to resume from and what derived rows to discard/replay.
- Pass/fail: PASS if graph response includes a non-empty `recovery` payload scoped to the session; FAIL if recovery payload absent or globally-scoped.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Seed: persist artifacts for rounds 1 + 2 fully, then simulate interruption (round 3 partial: ROUND node + 1 SEAT node, no DECISION, no `council_complete` event in JSONL).
2. Run **no-graph baseline**: parse `ai-council-state.jsonl` manually; find last event for the session; determine what artifacts persisted.
3. Run **with-graph workflow**: `runtime status CLI`.
4. Compare diagnostic completeness.

### Prompt

`As a council-graph integration validator, recover from an interrupted council session — first via the no-graph baseline (manually parse ai-council-state.jsonl), then via runtime status CLI — and confirm the with-graph path returns counts, readiness, and a namespace-scoped recovery payload in one runtime CLI call.`

### Commands

**No-graph baseline:**

1. `bash: tail -20 <spec-folder> | jq -c '.'` (operator inspects event stream)
2. `bash: rg -c 'round_complete|council_complete' <spec-folder>` (count completion events)
3. `bash: find <spec-folder> -type f -newer /tmp/dac-032-marker 2>/dev/null` (manual artifact-tree audit)
4. Operator builds recovery hypothesis from raw evidence.

**With-graph:**

5. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-032', sessionId: 'dac-032-run-01', nodes: [...round 1 + 2 full, round 3 partial: ROUND + 1 SEAT only...], edges: [...] })`
6. `tool: runtime status CLI({ specFolder: 'sandbox/dac-032', sessionId: 'dac-032-run-01' })`

### Expected

Baseline produces unstructured event-stream snippet requiring operator interpretation. Graph returns structured response with `counts`, `readiness`, `signals`, and a `recovery` payload that names the namespace + suggests next steps (replay round 3, or discard partial rows and resume from round 2).

### Evidence

Capture: baseline tail/parse transcript + operator hypothesis, graph status response with all 4 fields, one-line value summary ("graph returned structured recovery payload; baseline produced raw JSONL events requiring interpretation").

### Pass / Fail

- **Pass**: Graph response includes non-empty `recovery` payload scoped to `(sandbox/dac-032, dac-032-run-01)`. `counts` reflects 2 full rounds + 1 partial. `readiness` distinguishes incomplete state from healthy state.
- **Fail**: Recovery payload absent, empty, or globally-scoped. `readiness` falsely reports `ready: true` for the interrupted session.

### Failure Triage

If recovery payload missing, inspect `scripts/status.cjs` for the P2-001 remediation. If globally-scoped, inspect `lib/council/council-graph-db.ts` recovery query for namespace filter regression.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-032 | Mid-run interruption recovery value | Demonstrate graph status produces recovery payload; baseline needs JSONL forensics | `As a council-graph integration validator, recover from an interrupted council session — first via the no-graph baseline (manually parse ai-council-state.jsonl), then via runtime status CLI — and confirm the with-graph path returns counts, readiness, and a namespace-scoped recovery payload in one runtime CLI call.` | baseline: tail+rg+find -> with-graph: upsert + status | Structured counts + readiness + recovery payload vs raw JSONL | Baseline transcript + graph status response | PASS if non-empty namespace-scoped recovery payload | Inspect status P2-001 + namespace filter |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../08--council-graph-integration/006-council-graph-status-recovery-payload-and-readiness.md` | Functional anchor for `runtime status CLI` recovery payload |
| `../06--depth-and-failure-handling/002-resume-after-interrupted-state.md` | Baseline JSONL-resume contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | runtime CLI script with `recovery` field (P2-001 remediation) |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Storage layer: namespace-scoped recovery query |
| `.opencode/skills/deep-ai-council/references/state_format.md` | Documents append-only `ai-council-state.jsonl` event contract |
| `.opencode/skills/deep-ai-council/references/graph_support.md` §5 | Documents the recovery + replay contract |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH VALUE COMPARISON
- Playbook ID: DAC-032
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--council-graph-value-comparison/006-mid-run-interruption-recovery-graph-vs-baseline.md`
