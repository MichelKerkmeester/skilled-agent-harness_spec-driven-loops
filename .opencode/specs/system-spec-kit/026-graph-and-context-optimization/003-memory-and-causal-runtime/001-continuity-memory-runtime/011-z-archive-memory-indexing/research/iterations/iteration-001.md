# Iter 001 — z_archive doc/test propagation audit

## Focus
Spot-check Phase 1 baseline hits and identify NEW test/doc references to z_archive exclusion

## New findings (not in baseline + not in prior iters)

| File:Line | Severity | Snippet | Suggested fix |
|-----------|----------|---------|---------------|
| .opencode/skills/system-spec-kit/mcp_server/tests/index-scope.vitest.ts:44 | BREAKING | expect(EXCLUDED_FOR_MEMORY.length).toBeGreaterThanOrEqual(3); | Change to toBeGreaterThanOrEqual(2) or toBe(2) |

## Confirmed-already-known
- mcp_server/tests/index-scope.vitest.ts:48-52 - test 'rejects z_future, external, and z_archive for memory indexing' expects shouldIndexForMemory to return false for z_archive paths
- mcp_server/tests/index-scope.vitest.ts:74-90 - test 'skips z_future, external, and z_archive spec docs and graph metadata' creates z_archive fixtures and expects them to be excluded from discovery
- mcp_server/tests/full-spec-doc-indexing.vitest.ts:281-282 - test 'Rejects spec.md in /z_archive/ directory' expects isMemoryFile to return false
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/010-memory-indexer-invariants/plan.md:81 - claims shouldIndexForMemory rejects z_archive (STALE-INVARIANT)

## Gaps for next iter
- 9 remaining baseline STALE-INVARIANT hits not spot-checked: checklist.md:73, implementation-summary.md:152, decision-record.md:125+347, review/iteration-001.md:27
- 2 remaining baseline STALE-DESCRIPTIVE hits not spot-checked: doctor_update.yaml:314-316+349, memory-save.ts:220
- Search for additional config files, CLI docs, and skill docs that might reference old exclusion logic
- Check if any other test files have length checks or count assertions that might break

## JSONL delta row (pasted for verification)
```json
{"type":"iteration","iteration":1,"newInfoRatio":0.067,"newHits":1,"status":"insight","focus":"spot-check baseline + find new test/doc references","timestamp":"2026-05-16T11:02:00Z"}
```
