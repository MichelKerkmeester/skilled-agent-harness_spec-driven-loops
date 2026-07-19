---
title: "058 -- Lightweight consolidation (N3-lite)"
description: "This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior."
audited_post_018: true
version: 3.6.0.16
id: retrieval-enhancements-lightweight-consolidation-n3-lite
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 058 -- Lightweight consolidation (N3-lite)

## 1. OVERVIEW

This scenario validates Lightweight consolidation (N3-lite) for `058`. It focuses on Confirm maintenance cycle behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm maintenance cycle behavior.
- Real user request: `Please validate Lightweight consolidation (N3-lite) against the documented validation surface and tell me whether the expected signals are present: Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Lightweight consolidation (N3-lite) against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all three consolidation sub-processes execute and produce expected outputs without errors

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Lightweight consolidation (N3-lite) against the documented validation surface. Verify consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. trigger cycle
2. inspect contradiction/hebbian/staleness outputs
3. verify logs

### Expected

Consolidation cycle completes; contradiction detection, hebbian strengthening, and staleness decay all produce output; no runtime errors in logs

### Evidence

Preconditions: no explicit `Preconditions` section is present in this scenario file.

Trigger attempt via production MCP save surface:

```json
{
  "summary": "Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
  "data": {
    "error": "Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest",
    "code": "E085",
    "details": {
      "requestId": "aa3e02bc-abfe-49b0-806d-181cf9e6f4fd",
      "issues": [
        "tenantId is required for governed ingest",
        "sessionId is required for governed ingest",
        "userId or agentId is required for governed ingest",
        "provenanceSource is required for governed ingest",
        "provenanceActor is required for governed ingest"
      ]
    }
  },
  "hints": [
    "Supply the required governed-ingest provenance/scope fields and retry.",
    "Provide the missing tenant/provenance/actor metadata",
    "Retry memory_save"
  ]
}
```

Retry via MCP save surface with required governed-ingest fields, constrained to non-mutating planner mode:

```json
{
  "summary": "Planner prepared a non-mutating canonical save plan.",
  "data": {
    "status": "planned",
    "plannerMode": "plan-only",
    "message": "Planner prepared a non-mutating canonical save plan.",
    "followUpActions": [
      { "action": "apply", "title": "Apply canonical save" },
      { "action": "refresh-graph", "title": "Refresh graph metadata" },
      { "action": "reindex", "title": "Reindex touched spec docs" },
      { "action": "reconsolidate", "title": "Run full-auto fallback with reconsolidation" }
    ]
  },
  "hints": [
    "Planner prepared 1 proposed edit(s) for /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-speckit/031-manual-playbook-execution-sweep/spec.md",
    "Available follow-up actions: apply, refresh-graph, reindex, reconsolidate",
    "3 advisory warning(s) remain after structural planning checks"
  ]
}
```

The non-mutating MCP save path did not execute N3-lite consolidation. To avoid modifying any file outside this scenario, the implementation's dedicated N3-lite validation command was run instead.

Command:

```bash
SPECKIT_CONSOLIDATION=true npx vitest run tests/n3lite-consolidation.vitest.ts --reporter=verbose
```

Output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp-server/tests/n3lite-consolidation.vitest.ts
[shared/paths] database dir resolved outside @spec-kit workspace root (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit); falling back to import.meta.dirname-relative resolution

stderr | mcp-server/tests/n3lite-consolidation.vitest.ts > T002d: Edge bounds enforcement > T-BOUNDS-02: auto edge rejected when at MAX_EDGES_PER_NODE
[causal-edges] Edge bounds: node 1 has 20 edges (max 20), rejecting auto edge

 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-01: hasNegationConflict detects single-sided negation 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-02: hasNegationConflict returns false when both have same negation 0ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-03: hasNegationConflict returns false when neither has negation 0ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-04: hasNegationConflict detects don't vs positive 0ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-05: hasNegationConflict detects deprecated keyword 0ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-06: scanContradictions with heuristic (no vec) 4ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002a: Contradiction scan > T-N3-07: scanContradictions returns empty on no data 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002e: Contradiction cluster surfacing > T-N3-08: buildContradictionClusters includes seed pair members 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002e: Contradiction cluster surfacing > T-N3-09: cluster expands to include causal neighbors 3ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002e: Contradiction cluster surfacing > T-N3-10: empty pairs returns empty clusters 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T001d: Weight history audit tracking > T-WH-01: updateEdge logs weight change to weight_history 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T001d: Weight history audit tracking > T-WH-02: multiple updates accumulate in weight_history 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T001d: Weight history audit tracking > T-WH-03: no-op update (same strength) does not log 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T001d: Weight history audit tracking > T-WH-04: rollbackWeights restores to pre-change value 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T001d: Weight history audit tracking > T-WH-05: insertEdge upsert logs weight change 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-01: recently accessed edges get strengthened 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-02: strength increase capped at MAX_STRENGTH_INCREASE_PER_CYCLE 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-03: auto edges cannot exceed MAX_AUTO_STRENGTH via Hebbian 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-04: 30-day decay reduces edge strength 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-05: weight changes from Hebbian are logged 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002b: Hebbian strengthening > T-HEB-06: strengthening respects created_by auto cap from query selection 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002c: Staleness detection > T-STALE-01: detects edges not accessed in 90+ days 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002c: Staleness detection > T-STALE-02: recently accessed edges are not stale 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002d: Edge bounds enforcement > T-BOUNDS-01: checkEdgeBounds reports correct count 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002d: Edge bounds enforcement > T-BOUNDS-02: auto edge rejected when at MAX_EDGES_PER_NODE 3ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002d: Edge bounds enforcement > T-BOUNDS-03: manual edge NOT rejected at MAX_EDGES_PER_NODE 3ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002d: Edge bounds enforcement > T-BOUNDS-04: auto edge strength capped at MAX_AUTO_STRENGTH 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002: Full consolidation cycle > T-CONS-01: runConsolidationCycle runs without error 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002: Full consolidation cycle > T-CONS-02: consolidation on empty database returns zeros 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002: Full consolidation cycle > T-CONS-03: runConsolidationCycleIfEnabled returns null when flag is explicitly off 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002: Full consolidation cycle > T-CONS-04: runConsolidationCycleIfEnabled runs when flag is true 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002: Full consolidation cycle > T-CONS-05: runtime hook enforces weekly cadence 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002f: Consolidation lock ordering (R1) > T-LOCK-01: read-only scan does NOT hold the write lock (concurrent write not blocked) 14ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002f: Consolidation lock ordering (R1) > T-LOCK-02: cadence re-check under the lock prevents double-apply 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002g: Consolidation handle consistency (R2) > T-HANDLE-01: cycle reads and writes occur on the one connection passed in 1ms
 ✓ mcp-server/tests/n3lite-consolidation.vitest.ts > T002g: Consolidation handle consistency (R2) > T-HANDLE-02: detectStaleEdges reads via the module-global (no threaded handle) 1ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  22:28:27
   Duration  747ms (transform 385ms, setup 79ms, import 467ms, tests 55ms, environment 0ms)
```

Expected comparison: contradiction detection produced output via the passing `T002a: Contradiction scan` and `T002e: Contradiction cluster surfacing` cases; Hebbian strengthening and decay produced output via the passing `T002b: Hebbian strengthening` cases; staleness detection produced output via the passing `T002c: Staleness detection` cases; the full consolidation cycle completed via the passing `T002: Full consolidation cycle` cases. The only stderr entries were a path fallback warning and an expected edge-bounds rejection log; no test failure or runtime error appeared in the command transcript.

### Pass / Fail

- **Verdict**: PASS
- **Reason**: The N3-lite consolidation validation suite completed with `Test Files  1 passed (1)` and `Tests  36 passed (36)`, including contradiction scan/cluster surfacing, Hebbian strengthening/decay, staleness detection, and full consolidation cycle cases; no runtime error appeared in the observed transcript.

### Failure Triage

Check consolidation trigger mechanism; inspect individual sub-process logs; verify database state before and after cycle

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval-enhancements/lightweight-consolidation.md](../../feature-catalog/retrieval-enhancements/lightweight-consolidation.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 058
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval-enhancements/lightweight-consolidation-n3-lite.md`
