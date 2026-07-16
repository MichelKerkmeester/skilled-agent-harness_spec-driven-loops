# Seat opus-codegraph-daemon — iteration 2 (global #17)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-codegraph-daemon
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've thoroughly traced `computeBlastRadius`, its BFS driver `traverseGraphBfs`, `transitiveTraversal`, and the supporting graphDb queries. Here is my analysis.

## Review: `computeBlastRadius` BFS transitive traversal + blast radius

**Files read in full:** `handlers/query.ts` (1767 lines), `lib/graph/bfs-traversal.ts` (185 lines), plus the relevant graphDb helpers (`queryEdgesFrom/To`, `queryFileImportDependents`, `queryFileDegrees`, `resolveSubjectFilePath`).

### Direction & graph construction — correct
`queryImportDependentsForBlastRadius` yields `{importedFilePath, importerFilePath}` edges (importer **imports** imported). `importedBy` is keyed by `importedFilePath`, so `importedBy.get(X)` = "files that import X" = X's dependents. BFS from a seed walks seed → its importers → their importers. This is the correct blast-radius direction (who breaks if the seed changes). ✓

### Cycle handling — correct
Verified A→B→A: `traverseGraphBfs` uses `visitTiming:'enqueue'` with `preVisitedIds:[sourceFile]`, marking neighbors visited at enqueue time (bfs-traversal.ts:157-159, 132-134). The back-edge to a visited node is skipped. Self-import edges are excluded at the SQL layer (`source.file_path != target.file_path`, code-graph-db.ts:1350 and the slow path at query.ts:1034), and even if present would be caught by the `preVisitedIds` seed guard. No infinite loop possible. ✓

### Depth correctness — correct
FIFO queue + enqueue-time visited marking guarantees first discovery is along a shortest path, so `visit.depth` is the true minimum hop count. The cross-source merge keeps the minimum depth (`affectedFile.depth < previous.depth`, query.ts:1186). `maxDepth=0` short-circuits (boundary neighbors all land at depth 1 > 0 → truncated, zero results). ✓

### `depthTruncated` / boundary inspection — correct
`inspectDepthBoundary:true` expands max-depth nodes purely to detect unexplored dependents. The visited-check precedes the depth-check (bfs-traversal.ts:132 before :136), so `depthTruncated` is **not** falsely set for nodes already reached at a shallower depth — no false positives, and no false negatives (any node beyond the horizon is genuinely new). ✓

### Overflow detection — correct (prior bug already fixed)
`totalAffectedBeforeSlice = affectedByFile.size` is captured before `.slice(0, limit)`, and `overflowed = totalAffectedBeforeSlice > limit` (query.ts:1201-1210). The off-by-one (`>= limit` false-positiving at exact equality) noted in the comment is genuinely fixed.

### Fast/slow path consistency — verified equal
I checked the candidate inconsistency: both `queryFileImportDependents` (fast, line 1350) and the inline slow query (line 1034) apply `source.file_path != target.file_path`. The fast path uses `SELECT DISTINCT`; the slow path is deduped in JS by `importerFilePath` (query.ts:1117). Equivalent result sets. **Not a bug.**

### Error/compute fallback — correct
`compute_error` catch (query.ts:1543-1578) returns a stable `code`, preserves seeds, emits a metric guarded against its own failure, and never throws past the handler.

### Findings
The depth/cycle/blast-radius logic is sound. The only real, citable defect is a vestigial expression with no behavioral impact:

- `buildWhyIncluded` confidence seed `edgeChain.length > 0 ? 1 : 1` (query.ts:1141) — both ternary arms are `1`, so the conditional is dead. The min-reduce from `1` is correct (confidences are clamped ≤ 1), so output is right; the code just misleads a reader into thinking the empty/non-empty cases differ. P2 maintainability only.

No P0/P1. Depth, cycle, overflow, multi-source merge, and boundary-truncation handling are all correct.

```json
{"seat":"opus-codegraph-daemon","model":"claude-opus-4-8","angle":"Code-graph BFS transitive traversal + blast radius: correctness of computeBlastRadius, depth/cycle handling.","verdict":"PASS","summary":"BFS direction, cycle guard (enqueue-time visited + preVisited seed), shortest-depth assignment, multi-source min-depth merge, boundary-inspect depthTruncated, and pre-slice overflow detection all verified correct. Only a harmless dead ternary found.","files_reviewed":[".opencode/skills/system-code-graph/mcp_server/handlers/query.ts",".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts",".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts"],"findings":[{"severity":"P2","dimension":"maintainability","title":"Dead ternary in why_included confidence seed","file":".opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1141","evidence":"reduce initial value is `edgeChain.length > 0 ? 1 : 1` — both arms are identical (1), so the condition is inert.","why":"Vestigial conditional implies the empty vs non-empty edgeChain cases produce different seeds; they do not. No output impact (min over clamped [0,1] confidences from seed 1 is correct), but it misleads future readers and hides intent.","recommendation":"Replace with the literal `1` (the correct neutral seed for a min-reduce over confidences in [0,1]), or drop the seed and special-case empty chains explicitly if a distinct seed value was ever intended."}]}
```
