---
title: "057 -- Spec folder hierarchy as retrieval structure (S4)"
description: "This scenario validates Spec folder hierarchy as retrieval structure (S4) for `057`. It focuses on Confirm hierarchy-aware retrieval."
audited_post_018: true
version: 3.6.0.16
id: retrieval-enhancements-spec-folder-hierarchy-as-retrieval-structure-s4
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 057 -- Spec folder hierarchy as retrieval structure (S4)

## 1. OVERVIEW

This scenario validates Spec folder hierarchy as retrieval structure (S4) for `057`. It focuses on Confirm hierarchy-aware retrieval.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm hierarchy-aware retrieval.
- Real user request: `Please validate Spec folder hierarchy as retrieval structure (S4) against the documented validation surface and tell me whether the expected signals are present: Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Spec folder hierarchy as retrieval structure (S4) against the documented validation surface. Verify self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if retrieval respects folder hierarchy with self > parent > sibling ordering

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Spec folder hierarchy as retrieval structure (S4) against the documented validation surface. Verify self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. create nested hierarchy
2. query
3. verify self/parent/sibling scoring

### Expected

Self-folder results ranked highest; parent and sibling folders contribute scored results; hierarchy depth reflected in ranking

### Evidence

Command: `npx vitest run tests/spec-folder-hierarchy.vitest.ts`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  22:34:17
   Duration  111ms (transform 27ms, setup 14ms, import 25ms, tests 11ms, environment 0ms)
```

Command: `npx vitest run tests/spec-folder-hierarchy.vitest.ts -t "assigns correct relevance scores" --reporter verbose`

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > returns parent for 3-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > returns parent for 2-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > returns null for single-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > returns null for empty string
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > strips trailing slashes before computing parent
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > strips multiple trailing slashes
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > handles deeply nested paths
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getParentPath > returns null for path with leading slash only
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > returns full ancestor chain for 3-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > returns single ancestor for 2-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > returns empty array for single-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > returns empty array for empty string
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > returns correct chain for 5-segment path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getAncestorPaths > ancestors are ordered parent-first (nearest to farthest)
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > builds tree with correct parent-child links
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > creates implicit parent nodes for gaps in hierarchy
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > counts memories per folder correctly
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > identifies roots correctly
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > handles empty database gracefully
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > handles multiple siblings under one parent
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > buildHierarchyTree > does not duplicate nodes or children
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getSiblingPaths > returns sibling folders under same parent
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getSiblingPaths > returns empty array for root-level folders
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getSiblingPaths > returns empty array when folder has no siblings
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getSiblingPaths > returns empty array when folder is not in tree
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getDescendantPaths > returns all descendants recursively
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getDescendantPaths > returns empty array for leaf nodes
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getDescendantPaths > returns empty array for folder not in tree
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getRelatedFolders > returns self + ancestors + siblings
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getRelatedFolders > self is always first in the list
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getRelatedFolders > ancestors appear before siblings
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getRelatedFolders > returns only self for root-level folder with no siblings
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > getRelatedFolders > includes all ancestors for deeply nested path
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > returns memories from self, parent, and sibling folders
 ✓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > assigns correct relevance scores 3ms
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > results are sorted by relevance (highest first)
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > excludes deprecated memories
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > excludes chunk children (parent_id not null)
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > respects limit parameter
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > returns empty array when no memories exist
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > handles folder with no ancestors or siblings
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > queryHierarchyMemories > deep ancestor relevance floors at 0.3
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Hierarchy cache behavior > returns cached tree within TTL and refreshes after explicit cache invalidation
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Hierarchy cache behavior > detects stale cache after TTL expiry and rebuilds hierarchy
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Edge Cases > getParentPath handles path with only slashes
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Edge Cases > getAncestorPaths handles trailing slash gracefully
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Edge Cases > buildHierarchyTree excludes null and empty spec_folder values
 ↓ mcp-server/tests/spec-folder-hierarchy.vitest.ts > Edge Cases > queryHierarchyMemories with folder not in DB still resolves ancestors

 Test Files  1 passed (1)
      Tests  1 passed | 47 skipped (48)
   Start at  22:36:26
   Duration  98ms (transform 25ms, setup 12ms, import 24ms, tests 4ms, environment 0ms)
```

Observed fixture and assertion values from `mcp-server/tests/spec-folder-hierarchy.vitest.ts`:

```text
insertMemory(db, 1, '003-foo', 'root-memory');
insertMemory(db, 2, '003-foo/140-bar', 'parent-memory');
insertMemory(db, 3, '003-foo/140-bar/006-sprint', 'self-memory');
insertMemory(db, 4, '003-foo/140-bar/007-sprint', 'sibling-memory');

const results = queryHierarchyMemories(db, '003-foo/140-bar/006-sprint');

expect(selfResult!.relevance).toBeCloseTo(1.0, 10);
expect(parentResult!.relevance).toBeCloseTo(0.8, 10);
expect(rootResult!.relevance).toBeCloseTo(0.6, 10);
expect(siblingResult!.relevance).toBeCloseTo(0.5, 10);
```

MCP query wrapper output from `memory_quick_search` for query `spec folder hierarchy retrieval self parent sibling hierarchy depth ranking` scoped to `system-spec-kit`:

```text
summary: Found 8 memories
data.searchType: hybrid
data.count: 8
data.pipelineMetadata.stage1.searchType: hybrid
data.pipelineMetadata.stage1.channelCount: 3
data.pipelineMetadata.stage1.activeChannels: 2
data.pipelineMetadata.stage1.candidateCount: 27
data.searchDecisionEnvelope.queryPlan.selectedChannels: ["vector","fts","bm25","graph","degree"]
data.results[0].specFolder: system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking
data.results[0].score: 0.49803
data.results[1].specFolder: system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling
data.results[1].score: 0.49542777740004956
data.results[5].specFolder: system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals
data.results[5].score: 0.9298029615441982
data.results[6].specFolder: system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/004-literal-spec-folder-names
data.results[6].score: 0.9298029368443471
```

### Pass / Fail

- **PASS**: The hierarchy retrieval test created an in-memory nested hierarchy and passed assertions for self `1.0`, parent `0.8`, root/grandparent `0.6`, sibling `0.5`, with the full hierarchy test file passing `48 passed (48)`.

### Failure Triage

Verify nested hierarchy exists; check hierarchy scoring weights; inspect folder-path resolution in retrieval pipeline

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval-enhancements/spec-folder-hierarchy-as-retrieval-structure.md](../../feature-catalog/retrieval-enhancements/spec-folder-hierarchy-as-retrieval-structure.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 057
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval-enhancements/spec-folder-hierarchy-as-retrieval-structure-s4.md`
