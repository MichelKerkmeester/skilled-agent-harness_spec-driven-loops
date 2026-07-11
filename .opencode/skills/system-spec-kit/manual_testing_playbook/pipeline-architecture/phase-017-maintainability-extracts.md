---
title: "270 -- Phase 017 maintainability extracts"
description: "This scenario validates the Phase 017 maintainability extracts for `270`. It focuses on proving the shared helper surfaces replaced the old inline variants without changing the contracts they serve."
version: 3.6.0.8
---

# 270 -- Phase 017 maintainability extracts

## 1. OVERVIEW

This scenario validates the Phase 017 maintainability extracts for `270`. It focuses on proving the shared helper surfaces replaced the old inline variants without changing the contracts they serve.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the shared `assertNever()` helper, `runEnrichmentStep()`, `executeAtomicReconsolidationTxn()`, and `advisoryPreset` rename are wired as the live pipeline contracts.
- Real user request: `` Please validate Phase 017 maintainability extracts against the documented helper surfaces and tell me whether the expected signals are present: helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses `advisoryPreset`. ``
- Prompt: `Validate Phase 017 maintainability extracts against the documented helper surfaces and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses `advisoryPreset`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the extracted helper surfaces are the live path and no old inline contract is still active

---

## 3. TEST EXECUTION

### Prompt

```
Validate Phase 017 maintainability extracts against the documented helper surfaces and return pass/fail with cited evidence.
```

### Commands

1. Run the exhaustiveness suite
2. Run the `runEnrichmentStep()` suite
3. Run the reconsolidation suite that covers shared conflict transactions
4. Inspect `memory_context` structural routing metadata or the nudge tests and confirm the field name is `advisoryPreset`

### Expected

Helper-based code paths are active; tests for the extracted helpers pass; routing metadata uses `advisoryPreset`

### Evidence

Exhaustiveness suite:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  15:20:58
   Duration  96ms (transform 16ms, setup 13ms, import 9ms, tests 2ms, environment 0ms)
```

`runEnrichmentStep()` suite:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  15:21:05
   Duration  585ms (transform 381ms, setup 15ms, import 492ms, tests 4ms, environment 0ms)
```

Reconsolidation suite:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  15:21:13
   Duration  735ms (transform 441ms, setup 14ms, import 590ms, tests 52ms, environment 0ms)
```

Routing nudge suite:

```text
RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:88250) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  15:21:28
   Duration  8.88s (transform 1.17s, setup 14ms, import 19ms, tests 8.77s, environment 0ms)
```

Routing metadata source inspection:

```text
mcp_server/handlers/memory-context.ts:231-237
interface StructuralRoutingNudgeMeta {
  advisory: true;
  advisoryPreset: 'ready';
  preferredTool: 'code_graph_query';
  message: string;
  preservesAuthority: 'session_bootstrap';
}

mcp_server/handlers/memory-context.ts:565-571
return {
  advisory: true,
  advisoryPreset: 'ready',
  preferredTool: 'code_graph_query',
  message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
  preservesAuthority: 'session_bootstrap',
};

mcp_server/tests/graph-first-routing-nudge.vitest.ts:155-159
expect(parsed.meta.structuralRoutingNudge).toMatchObject({
  advisory: true,
  advisoryPreset: 'ready',
  preferredTool: 'code_graph_query',
});
```

### Pass / Fail

- **PASS**: the extracted helper suites all passed, the routing nudge suite passed, and source/test inspection shows the live structural routing metadata field is `advisoryPreset: 'ready'`.

### Failure Triage

Inspect `mcp_server/lib/utils/exhaustiveness.ts`, `mcp_server/handlers/save/post-insert.ts`, `mcp_server/lib/storage/reconsolidation.ts`, and `mcp_server/handlers/memory-context.ts`

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [pipeline-architecture/phase-017-maintainability-extracts.md](../../feature_catalog/pipeline-architecture/phase-017-maintainability-extracts.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 270
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline-architecture/phase-017-maintainability-extracts.md`
