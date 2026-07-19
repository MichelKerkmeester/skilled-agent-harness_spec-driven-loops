---
title: "046 -- Anchor-aware chunk thinning (R7)"
description: "This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-anchor-aware-chunk-thinning-r7
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 046 -- Anchor-aware chunk thinning (R7)

## 1. OVERVIEW

This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm anchor-priority thinning.
- Real user request: `Please validate Anchor-aware chunk thinning (R7) against the documented validation surface and tell me whether the expected signals are present: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order.`
- Prompt: `Validate anchor-aware chunk thinning preserves anchor chunks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set

---

## 3. TEST EXECUTION

### Prompt

```
Validate anchor-aware chunk thinning preserves anchor chunks.
```

### Commands

1. Index long doc with anchors/filler
2. run thinning
3. verify non-empty retained set

### Expected

Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp-server`:

```bash
npx vitest run tests/chunk-thinning.vitest.ts --reporter verbose
```

Actual output observed:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

stderr | mcp-server/tests/chunk-thinning.vitest.ts > R7 integration wiring > uses thinChunks retained set in indexChunkedMemoryFile active path
[memory-save] Chunking /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s6-r7-integration-w80M0o/chunked-memory.md: structure strategy, 5 chunks
[memory-save] Chunk thinning retained 3/5 chunks
INFO  [VectorIndex] Deferred indexing: Memory 1 saved without embedding (BM25/FTS5 searchable)

 ✓ mcp-server/tests/chunk-thinning.vitest.ts > scoreChunk — anchor presence > should give anchorScore 1.0 for chunks with anchors 1ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > scoreChunk — anchor presence > should give anchorScore 0.0 for chunks without anchors 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > scoreChunk — anchor presence > should give anchorScore 1.0 for chunks with multiple anchors 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > scoreChunk — anchor presence > should produce higher composite score for anchored chunks than non-anchored 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > thinChunks — basic filtering > should retain high-quality chunks and drop low-quality ones 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > thinChunks — safety > should never return empty retained array when given chunks 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > thinChunks — safety > should keep the highest-scoring chunk when all are below threshold 0ms
 ✓ mcp-server/tests/chunk-thinning.vitest.ts > R7 integration wiring > uses thinChunks retained set in indexChunkedMemoryFile active path 960ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  12:16:16
   Duration  1.08s (transform 635ms, setup 13ms, import 29ms, tests 965ms, environment 0ms)
```

Initial targeted run also passed:

```text
 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  12:14:21
   Duration  1.29s (transform 786ms, setup 17ms, import 31ms, tests 1.16s, environment 0ms)
```

Attempted additional inline retained/dropped detail using `npx tsx --eval ...`, but the repo did not expose `tsx` on PATH:

```text
sh: tsx: command not found
```

### Pass / Fail

- **PASS**: Targeted documented validation passed: anchor scoring tests passed, high-quality chunks were retained while low-quality chunks were dropped, the retained set was non-empty, and the integration path reported `Chunk thinning retained 3/5 chunks` with `25 passed (25)`.

### Failure Triage

Verify anchor detection logic → Check thinning priority ordering → Inspect minimum retained set size

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/anchor-aware-chunk-thinning.md](../../feature-catalog/memory-quality-and-indexing/anchor-aware-chunk-thinning.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/anchor-aware-chunk-thinning-r7.md`
