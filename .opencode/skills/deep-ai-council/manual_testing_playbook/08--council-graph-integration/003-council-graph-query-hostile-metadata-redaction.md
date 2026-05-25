---
title: "DAC-021 -- runtime query CLI hostile metadata redaction"
description: "This scenario validates that `runtime query CLI` redacts arbitrary metadata keys and bounds string lengths before returning prompt-safe output. Anchors to council-graph-script.vitest.ts test 'redacts arbitrary metadata from prompt-safe query output'."
---

# DAC-021 -- runtime query CLI hostile metadata redaction

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-021`.

---

## 1. OVERVIEW

This scenario validates that `runtime query CLI` returns prompt-safe metadata only — even when the underlying graph row contains arbitrary keys, oversized strings, or hostile payloads injected during reducer/upsert. The query handler must redact non-allowlisted keys and truncate long strings before serializing into the response.

### Why This Matters

Council artifacts are user-influenced text (seat output, deliberations, critiques). A reducer that blindly stuffs artifact text into graph row metadata would let arbitrary content bleed into synthesis prompts via subsequent `runtime query CLI` calls. The allowlist (`confidence`, `confidenceScore`, `planConfidence`, `severity`, `priority`, `status`) plus length bounds were added as P1-003 remediation in 003 to make query output prompt-safe by construction.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-021` and confirm the expected signals without contradictory evidence.

- Objective: Verify `runtime query CLI` redacts arbitrary metadata keys and bounds string lengths in its response.
- Real user request: Query the council graph after I seed a node with weird metadata keys and oversized strings, and tell me what the query response actually exposes.
- Prompt: `As a council-graph integration validator, upsert a council graph node with hostile metadata (arbitrary keys, oversized strings) and then call runtime query CLI; assert the response strips arbitrary keys and bounds string lengths.`
- Expected execution process: Upsert one DISAGREEMENT node with metadata containing both allowlisted keys (`confidence: 0.4`, `severity: 'critical'`) and arbitrary keys (`secret: 'leak-me'`, `payload: 'A'.repeat(10000)`); query in `evidence_chain` (or any) mode; inspect response metadata.
- Expected signals: Response metadata contains only allowlisted scalars (`confidence`, `severity`, etc.); `secret` key absent; `payload` either absent or truncated to a bounded length.
- Desired user-visible outcome: The user sees that hostile content cannot escape into prompt context via graph queries.
- Pass/fail: PASS if redaction holds; FAIL if any non-allowlisted key appears in response or if string lengths exceed handler bounds.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pick a sandbox `(specFolder, sessionId)` pair (e.g. `specFolder='sandbox/dac-021', sessionId='dac-021-run-01'`).
2. Upsert a SESSION + ROUND + DISAGREEMENT node where the DISAGREEMENT carries both allowlisted and hostile metadata.
3. Issue `runtime query CLI` (e.g. `mode: 'evidence_chain'` or `'unresolved_disagreements'`).
4. Inspect the metadata fields of every node returned.

### Prompt

`As a council-graph integration validator, upsert a council graph node with hostile metadata (arbitrary keys, oversized strings) and then call runtime query CLI; assert the response strips arbitrary keys and bounds string lengths.`

### Commands

1. `tool: runtime upsert CLI({ specFolder: 'sandbox/dac-021', sessionId: 'dac-021-run-01', nodes: [{id:'s1', kind:'SESSION'},{id:'r1', kind:'ROUND'},{id:'d1', kind:'DISAGREEMENT', metadata: {confidence: 0.4, severity: 'critical', secret: 'leak-me', payload: 'A'.repeat(10000)}}] })`
2. `tool: runtime query CLI({ specFolder: 'sandbox/dac-021', sessionId: 'dac-021-run-01', mode: 'unresolved_disagreements', limit: 10 })`

### Expected

Response metadata for `d1` contains `confidence` and `severity` only. `secret` and oversized `payload` are absent or `payload` is truncated to the documented bound.

### Evidence

Capture the query response verbatim and the metadata field-set per returned node.

### Pass / Fail

- **Pass**: Only allowlisted scalars present; oversized strings truncated.
- **Fail**: `secret` (or any non-allowlisted key) appears in response, or `payload` returned at full 10000-char length.

### Failure Triage

If hostile metadata leaks, inspect `lib/council/council-graph-query.ts` allowlist + length-bound logic. Re-run `npx vitest run tests/council-graph-script.vitest.ts -t 'redacts arbitrary metadata from prompt-safe query output'` to confirm regression.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-021 | runtime query CLI hostile metadata redaction | Verify allowlisted-only metadata + bounded strings | `As a council-graph integration validator, upsert a council graph node with hostile metadata (arbitrary keys, oversized strings) and then call runtime query CLI; assert the response strips arbitrary keys and bounds string lengths.` | upsert (hostile) -> query (unresolved_disagreements) | Only allowlisted keys; oversized strings truncated | runtime CLI query response | PASS if redaction holds | Inspect council-graph-query.ts allowlist |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Allowlist + length bounds (P1-003 remediation) |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | runtime CLI script: prompt-safe query envelope |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Test: "redacts arbitrary metadata from prompt-safe query output" |
| `.opencode/skills/deep-ai-council/references/integration/graph_support.md` | Documents the allowlist contract |

---

## 5. SOURCE METADATA

- Group: COUNCIL GRAPH INTEGRATION
- Playbook ID: DAC-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md`
