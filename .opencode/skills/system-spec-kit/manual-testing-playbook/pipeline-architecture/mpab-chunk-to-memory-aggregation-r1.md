---
title: "050 -- MPAB chunk-to-memory aggregation (R1)"
description: "This scenario validates MPAB chunk-to-memory aggregation (R1) for `050`. It focuses on Confirm MPAB formula."
audited_post_018: true
version: 3.6.0.16
id: pipeline-architecture-mpab-chunk-to-memory-aggregation-r1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 050 -- MPAB chunk-to-memory aggregation (R1)

## 1. OVERVIEW

This scenario validates MPAB chunk-to-memory aggregation (R1) for `050`. It focuses on Confirm MPAB formula.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm MPAB formula.
- Real user request: `Please validate MPAB chunk-to-memory aggregation (R1) against the documented validation surface and tell me whether the expected signals are present: MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value.`
- Prompt: `Validate MPAB chunk-to-memory aggregation (R1) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Computed MPAB score matches manual calculation within 0.001 tolerance; FAIL: Score deviation >0.001 or missing chunk contributions

---

## 3. TEST EXECUTION

### Prompt

```
Validate MPAB chunk-to-memory aggregation (R1) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Create parent+chunks
2. run stage-3 aggregation
3. compare manual formula

### Expected

MPAB aggregation formula produces correct parent score from child chunks; manual formula matches computed value

### Evidence

Command:

```bash
npm exec vitest -- run tests/mpab-aggregation.vitest.ts -t "multiple chunks from same parent are collapsed with MPAB" --reporter verbose
```

Output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=0: returns 0 (no chunks = no signal)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=1: returns raw score (no bonus)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=1: returns exact score value without modification
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=2: correct MPAB calculation
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=2: order of input does not matter
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=10: correct MPAB calculation with known values
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=10: result can exceed 1.0 for multi-chunk documents
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > index-based max removal: tied scores handled correctly
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > index-based max removal: two tied max values, only one removed
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > does not mutate the input array
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > bonus coefficient matches exported constant
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > all-zero scores returns 0
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > computeMPAB > non-finite chunk scores are sanitized to zero before aggregation
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is not set (graduated — default ON)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "true"
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "TRUE" (case-insensitive)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "True"
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns false when env var is "false"
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is empty string (graduated — treated as enabled)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is arbitrary string (graduated — only "false" disables)
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > empty input returns empty array
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > single chunk returns single collapsed result with raw score
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > _chunkHits metadata is preserved correctly
 ✓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > multiple chunks from same parent are collapsed with MPAB 1ms
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > chunks from different parents produce separate collapsed results
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > collapsed results sorted by MPAB score descending
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > T001a: chunks maintain document position order (by chunkIndex), NOT score order
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > T001a: multi-parent collapse preserves document order per parent
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > numeric parentMemoryId grouping works correctly
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > does not mutate input chunk array
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > Module Exports > exports computeMPAB function
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > Module Exports > exports isMpabEnabled function
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > Module Exports > exports collapseAndReassembleChunkResults function
 ↓ mcp-server/tests/mpab-aggregation.vitest.ts > Module Exports > exports MPAB_BONUS_COEFFICIENT constant

 Test Files  1 passed (1)
      Tests  1 passed | 33 skipped (34)
   Start at  15:14:49
   Duration  144ms (transform 34ms, setup 24ms, import 24ms, tests 2ms, environment 0ms)
```

Command:

```bash
node --import ../scripts/node_modules/tsx/dist/loader.mjs --input-type=module -e "import { computeMPAB, collapseAndReassembleChunkResults, MPAB_BONUS_COEFFICIENT } from './lib/scoring/mpab-aggregation.ts'; const chunks = [{ id: 'chunk-mem-1-0', parentMemoryId: 'mem-1', chunkIndex: 0, score: 0.8 }, { id: 'chunk-mem-1-1', parentMemoryId: 'mem-1', chunkIndex: 1, score: 0.4 }]; const collapsed = collapseAndReassembleChunkResults(chunks); const scores = chunks.map(chunk => chunk.score); const sorted = [...scores].sort((a, b) => b - a); const sMax = sorted[0]; const remaining = sorted.slice(1); const sumRemaining = remaining.reduce((sum, score) => sum + score, 0); const manual = sMax + (MPAB_BONUS_COEFFICIENT * sumRemaining) / Math.sqrt(scores.length); const computed = collapsed[0]?.mpabScore; const direct = computeMPAB(scores); const diff = Math.abs(computed - manual); console.log(JSON.stringify({ inputChunks: chunks, coefficient: MPAB_BONUS_COEFFICIENT, formula: 'sMax + 0.3 * sum(remaining) / sqrt(N)', sMax, remaining, sumRemaining, N: scores.length, collapsed, computed, directComputeMPAB: direct, manual, diff, tolerance: 0.001, withinTolerance: diff <= 0.001 }, null, 2));"
```

Output:

```json
{
  "inputChunks": [
    {
      "id": "chunk-mem-1-0",
      "parentMemoryId": "mem-1",
      "chunkIndex": 0,
      "score": 0.8
    },
    {
      "id": "chunk-mem-1-1",
      "parentMemoryId": "mem-1",
      "chunkIndex": 1,
      "score": 0.4
    }
  ],
  "coefficient": 0.3,
  "formula": "sMax + 0.3 * sum(remaining) / sqrt(N)",
  "sMax": 0.8,
  "remaining": [
    0.4
  ],
  "sumRemaining": 0.4,
  "N": 2,
  "collapsed": [
    {
      "parentMemoryId": "mem-1",
      "mpabScore": 0.8848528137423858,
      "_chunkHits": 2,
      "chunks": [
        {
          "id": "chunk-mem-1-0",
          "parentMemoryId": "mem-1",
          "chunkIndex": 0,
          "score": 0.8
        },
        {
          "id": "chunk-mem-1-1",
          "parentMemoryId": "mem-1",
          "chunkIndex": 1,
          "score": 0.4
        }
      ]
    }
  ],
  "computed": 0.8848528137423858,
  "directComputeMPAB": 0.8848528137423858,
  "manual": 0.8848528137423858,
  "diff": 0,
  "tolerance": 0.001,
  "withinTolerance": true
}
```

### Pass / Fail

- **PASS**: Computed MPAB score `0.8848528137423858` matches manual calculation `0.8848528137423858` with `diff: 0`, which is within the `0.001` tolerance; `_chunkHits: 2` confirms chunk contributions were present.

### Failure Triage

Verify MPAB formula implementation → Check child chunk linkage → Inspect aggregation stage-3 entry point

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [pipeline-architecture/mpab-chunk-to-memory-aggregation.md](../../feature-catalog/pipeline-architecture/mpab-chunk-to-memory-aggregation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 050
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/mpab-chunk-to-memory-aggregation-r1.md`
