---
title: "094 -- Implemented: cross-document entity linking (S5)"
description: "This scenario validates Implemented: cross-document entity linking (S5) for `094`. It focuses on Confirm deferred->implemented status."
audited_post_018: true
version: 3.6.0.16
---

# 094 -- Implemented: cross-document entity linking (S5)

## 1. OVERVIEW

This scenario validates Implemented: cross-document entity linking (S5) for `094`. It focuses on Confirm deferred->implemented status.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deferred->implemented status.
- Real user request: `Please validate Implemented: cross-document entity linking (S5) against the documented validation surface and tell me whether the expected signals are present: Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Implemented: cross-document entity linking (S5) against the documented validation surface. Verify entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if entity linker produces correctly typed supports-edges and density guards enforce limits

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Implemented: cross-document entity linking (S5) against the documented validation surface. Verify entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. run entity linker
2. inspect supports edges
3. verify density guards

### Expected

Entity linker creates supports-edges between related documents; density guards cap edge creation; edge types are correctly classified

### Evidence

Entity linker command output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  22:16:23
   Duration  139ms (transform 44ms, setup 13ms, import 47ms, tests 17ms, environment 0ms)
```

Supports-edge inspection output:

```text
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > creates causal_edges with relation=supports 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > sets strength to 0.7 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > sets created_by to entity_linker 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > includes entity name in evidence field 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > runEntityLinking > end-to-end: extracts cross-doc matches and creates links 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > runEntityLinkingForMemory > creates links only for the saved memory scope 0ms
```

Actual supports-edge values inspected in `mcp_server/tests/entity-linker.vitest.ts`:

```text
expect(edges).toHaveLength(1);
expect(edges[0].relation).toBe('supports');
expect(edge.strength).toBeCloseTo(0.7);
expect(edge.created_by).toBe('entity_linker');
expect(edge.evidence).toBe('Cross-doc entity: memory system');
expect(result.linksCreated).toBe(1);
expect(result.crossDocMatches).toBe(1);
expect(result.entitiesProcessed).toBe(1);
expect(edges).toEqual([
  {
    source_id: '1',
    target_id: '2',
    evidence: 'Cross-doc entity: shared entity',
  },
]);
```

Density guard output:

```text
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > respects MAX_EDGES_PER_NODE limit (20) 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > skips link creation when projected density exceeds threshold 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > createEntityLinks > allows link creation when projected density equals threshold 1ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > runEntityLinking > honors density-threshold env override for S5 linking 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > runEntityLinking > falls back to default threshold for invalid density env value 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > __testables > exposes MAX_EDGES_PER_NODE constant 0ms
 ✓ mcp_server/tests/entity-linker.vitest.ts > S8 Entity Linker > __testables > exposes density-threshold helpers 0ms
```

Actual density guard values inspected in `mcp_server/tests/entity-linker.vitest.ts`:

```text
expect(__testables.MAX_EDGES_PER_NODE).toBe(20);
expect(result.linksCreated).toBe(0);
expect(result.skippedByDensityGuard).toBe(true);
expect(result.edgeDensity).toBeCloseTo(1.0);
expect(result.densityThreshold).toBe(1.0);
expect(count.cnt).toBe(4);
expect(result.linksCreated).toBe(1);
expect(result.skippedByDensityGuard).toBe(false);
expect(result.densityThreshold).toBe(1.0);
expect(result.densityThreshold).toBe(1.5);
expect(result.edgeDensity).toBeCloseTo(1.25);
```

Integration validation output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > extracts entities from content and stores them 1ms
 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > updates entity catalog from extracted entities 0ms
 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > finds cross-document entity matches after extraction 0ms
 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > creates causal edges from cross-document entity matches 0ms
 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > end-to-end: runEntityLinking creates cross-doc links 0ms
 ✓ mcp_server/tests/deferred-features-integration.vitest.ts > Deferred Features: Integration Tests > R10 → S5 dependency chain > density guard skips entity linking when graph is already dense 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  22:18:39
   Duration  156ms (transform 63ms, setup 12ms, import 71ms, tests 14ms, environment 0ms)
```

MCP causal-stats inspection attempt:

```text
MCP error -32001: Request timed out
MCP error -32000: Connection closed
```

### Pass / Fail

- **PASS**: entity linker produced correctly typed `supports` edges in the documented validation surface, density guards enforced both per-node and global density limits, and no contradicting evidence appeared.

### Failure Triage

Verify entity linker implementation is active; check supports-edge schema; inspect density guard threshold and enforcement

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [retrieval_enhancements/cross_document_entity_linking.md](../../feature_catalog/retrieval_enhancements/cross_document_entity_linking.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 094
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `retrieval_enhancements/implemented_cross_document_entity_linking_s5.md`
