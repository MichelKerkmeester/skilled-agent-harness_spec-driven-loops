---
title: "051 -- Chunk ordering preservation (B2)"
description: "This scenario validates Chunk ordering preservation (B2) for `051`. It focuses on Confirm ordered reassembly."
audited_post_018: true
version: 3.6.0.16
---

# 051 -- Chunk ordering preservation (B2)

## 1. OVERVIEW

This scenario validates Chunk ordering preservation (B2) for `051`. It focuses on Confirm ordered reassembly.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm ordered reassembly.
- Real user request: `Please validate Chunk ordering preservation (B2) against the documented validation surface and tell me whether the expected signals are present: Collapsed chunks reassembled in original document order; marker sequence preserved; no reordering artifacts.`
- Prompt: `Validate chunk ordering preservation (B2) against the documented validation surface and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Collapsed chunks reassembled in original document order; marker sequence preserved; no reordering artifacts
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Marker sequence in collapsed output matches original save order; FAIL: Markers out of order or missing

---

## 3. TEST EXECUTION

### Prompt

```
Validate chunk ordering preservation (B2) against the documented validation surface and return pass/fail with cited evidence.
```

### Commands

1. Save ordered marker chunks
2. collapse
3. verify original order preserved

### Expected

Collapsed chunks reassembled in original document order; marker sequence preserved; no reordering artifacts

### Evidence

No explicit Preconditions section is present in this scenario file.

Catalog validation surface read:

```text
45: | `mcp_server/tests/mpab-aggregation.vitest.ts` | Automated test | MPAB chunk collapse, ordering, and fallback behavior |
```

Targeted validation command:

```bash
npx vitest run mcp_server/tests/mpab-aggregation.vitest.ts -t "T001a" --reporter verbose
```

Observed output:

```text
 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=0: returns 0 (no chunks = no signal)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=1: returns raw score (no bonus)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=1: returns exact score value without modification
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=2: correct MPAB calculation
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=2: order of input does not matter
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=10: correct MPAB calculation with known values
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > N=10: result can exceed 1.0 for multi-chunk documents
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > index-based max removal: tied scores handled correctly
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > index-based max removal: two tied max values, only one removed
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > does not mutate the input array
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > bonus coefficient matches exported constant
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > all-zero scores returns 0
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > computeMPAB > non-finite chunk scores are sanitized to zero before aggregation
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is not set (graduated — default ON)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "true"
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "TRUE" (case-insensitive)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is "True"
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns false when env var is "false"
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is empty string (graduated — treated as enabled)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > isMpabEnabled > returns true when env var is arbitrary string (graduated — only "false" disables)
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > empty input returns empty array
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > single chunk returns single collapsed result with raw score
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > _chunkHits metadata is preserved correctly
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > multiple chunks from same parent are collapsed with MPAB
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > chunks from different parents produce separate collapsed results
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > collapsed results sorted by MPAB score descending
 ✓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > T001a: chunks maintain document position order (by chunkIndex), NOT score order 1ms
 ✓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > T001a: multi-parent collapse preserves document order per parent 0ms
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > numeric parentMemoryId grouping works correctly
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > collapseAndReassembleChunkResults > does not mutate input chunk array
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > Module Exports > exports computeMPAB function
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > Module Exports > exports isMpabEnabled function
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > Module Exports > exports collapseAndReassembleChunkResults function
 ↓ mcp_server/tests/mpab-aggregation.vitest.ts > Module Exports > exports MPAB_BONUS_COEFFICIENT constant

 Test Files  1 passed (1)
      Tests  2 passed | 32 skipped (34)
   Start at  14:19:20
   Duration  100ms (transform 21ms, setup 0ms, import 27ms, tests 2ms, environment 0ms)
```

Marker-sequence probe command:

```bash
node --experimental-strip-types --input-type=module -e "import { collapseAndReassembleChunkResults } from './mcp_server/lib/scoring/mpab-aggregation.ts'; const original = [{ id: 'chunk-marker-0', parentMemoryId: 'marker-doc', chunkIndex: 0, score: 0.3, marker: 'MARKER-001' }, { id: 'chunk-marker-1', parentMemoryId: 'marker-doc', chunkIndex: 1, score: 0.5, marker: 'MARKER-002' }, { id: 'chunk-marker-2', parentMemoryId: 'marker-doc', chunkIndex: 2, score: 0.7, marker: 'MARKER-003' }, { id: 'chunk-marker-3', parentMemoryId: 'marker-doc', chunkIndex: 3, score: 0.9, marker: 'MARKER-004' }]; const retrievalOrder = [original[3], original[0], original[2], original[1]]; const collapsed = collapseAndReassembleChunkResults(retrievalOrder); const markerSequence = collapsed[0].chunks.map((chunk) => chunk.marker); console.log(JSON.stringify({ originalSaveOrder: original.map((chunk) => chunk.marker), retrievalInputOrder: retrievalOrder.map((chunk) => chunk.marker), collapsedMarkerSequence: markerSequence, collapsedChunkIndexes: collapsed[0].chunks.map((chunk) => chunk.chunkIndex), matchesOriginalOrder: JSON.stringify(markerSequence) === JSON.stringify(original.map((chunk) => chunk.marker)), parentMemoryId: collapsed[0].parentMemoryId, chunkHits: collapsed[0]._chunkHits, mpabScore: collapsed[0].mpabScore }, null, 2));"
```

Observed output:

```json
{
  "originalSaveOrder": [
    "MARKER-001",
    "MARKER-002",
    "MARKER-003",
    "MARKER-004"
  ],
  "retrievalInputOrder": [
    "MARKER-004",
    "MARKER-001",
    "MARKER-003",
    "MARKER-002"
  ],
  "collapsedMarkerSequence": [
    "MARKER-001",
    "MARKER-002",
    "MARKER-003",
    "MARKER-004"
  ],
  "collapsedChunkIndexes": [
    0,
    1,
    2,
    3
  ],
  "matchesOriginalOrder": true,
  "parentMemoryId": "marker-doc",
  "chunkHits": 4,
  "mpabScore": 1.125
}
```

### Pass / Fail

- **PASS**: Marker sequence in collapsed output matches original save order: `MARKER-001`, `MARKER-002`, `MARKER-003`, `MARKER-004`; targeted ordering tests passed with `2 passed | 32 skipped (34)`.

### Failure Triage

Verify chunk ordering index → Check collapse algorithm → Inspect ordering preservation across save/retrieve cycle

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/chunk-ordering-preservation.md](../../feature_catalog/14--pipeline-architecture/chunk-ordering-preservation.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 051
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/chunk-ordering-preservation-b2.md`
