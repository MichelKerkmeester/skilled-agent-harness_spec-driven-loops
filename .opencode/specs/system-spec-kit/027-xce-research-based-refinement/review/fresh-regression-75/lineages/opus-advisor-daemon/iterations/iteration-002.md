# Seat opus-advisor-daemon — iteration 2 (global #13)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-advisor-daemon
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=0

## Analysis

I've completed a full read-only trace of the slice and its real dependencies. Here is my analysis.

## Review: Advisor BFS skill-graph traversal — equivalence, cycles, depth bounds

**Slice traced:** `lib/skill-graph/skill-graph-queries.ts` (the two BFS callers `transitivePath` + `subgraph`), the shared helper `lib/skill-graph/bfs-traversal.ts`, the legacy recursive/iterative implementation removed in `16bf17d2c1`, and the two test files that lock the behavior.

### Equivalence to the prior implementation

I diffed the new helper-based code against the legacy code it replaced (commit `16bf17d2c1`, `MAX_TRANSITIVE_DEPTH = 8`).

- **`transitivePath`** — Legacy capped expansion at dequeue with `current.edges.length >= 8`; new caps with `current.depth >= maxDepth` where `maxDepth = clampSkillGraphTraversalDepth(8,0) = 8` (bfs-traversal.ts:60, :74). For this caller `depth === edges.length` at every state, so the cap is identical. Target detection is equivalent: legacy checked `relation.node.id === toSkillId` *before* pushing and only for unvisited rows; new runs `shouldStop` after the `visited.has` guard and before `visited.add`/push (bfs-traversal.ts:84-100). Both return the target the first time it is discovered, at hop counts up to and including 8. `nodeCache`/`onRelation` is populated for **every** read row in both versions, including visited ones — preserved (skill-graph-queries.ts:339-341).
- **`subgraph`** — `safeDepth` formula is byte-for-byte the same (`clampSkillGraphTraversalDepth(depth,1)` reproduces `Number.isFinite ? max(0,min(trunc,8)) : 1`, bfs-traversal.ts:50-54). Both record `nodes`/`edges` for every relation before the visited guard, so boundary edges to already-seen nodes are captured identically (skill-graph-queries.ts:403-406). Output sorting unchanged (skill-graph-queries.ts:410-417).

### Cycle handling

`visited` is seeded with `rootId` and a node is marked on enqueue (bfs-traversal.ts:61, :99) — standard BFS cycle guard. The parity fixture deliberately includes a back-edge (`zeta → alpha` conflict, an inbound edge into the root) and a diamond (`alpha→beta→delta`, `alpha→gamma→delta`); `subgraph` and `transitivePath` outputs match the legacy reference exactly (parity test lines 57-89). Self-loops and back-edges to root hit the `visited.has` guard and are skipped from re-expansion while still being recorded by `onRelation`. No unbounded recursion path exists.

### Depth bounds

- Root at `depth 0` is only expanded when `maxDepth > 0`; `maxDepth === 0` yields root-only with `truncated=true` (bfs-traversal.ts:74-77) — matches legacy `subgraph('alpha',0)` (parity test line 88).
- Off-by-one verified both directions: a node at `depth = maxDepth-1` is expanded and can return/record children at `depth = maxDepth`; a node at `depth = maxDepth` is never expanded. This equals the legacy `>= cap` dequeue semantics.
- Clamp is hardened against `NaN`/negative/over-cap inputs and unit-tested (bfs-traversal.test lines 10-15).

### Notes (not findings)

- The new `truncated` flag is computed correctly but is intentionally **not consumed** by either caller — forward-looking helper API surface, not a defect. The silent depth-cap-at-8 (results may be incomplete without signaling the caller) is **pre-existing legacy behavior**, not introduced by this refactor, so it is out of regression scope.
- `subgraph` queue states now carry the full accumulated `nodeIds` path (the helper is shared with `transitivePath`), versus the legacy `{skillId, depth}`. This is bounded memory overhead (≤ depth 8), `currentId` is still the correct frontier node, and it is not a correctness difference.

### Verdict

This is a genuinely behavior-preserving consolidation. The cutover is backed by a row-level parity test against a faithful legacy reimplementation plus a focused helper unit test covering clamp, visited semantics, truncation, and breadth-first match order. I traced the real control flow and edge cases (depth 0, missing nodes, self-path, cycles, diamonds, depth cap boundaries) and found no divergence from the prior recursive/BFS behavior and no cycle/depth-bound defect. No high-confidence finding to report.

```json
{"seat":"opus-advisor-daemon","model":"claude-opus-4-8","angle":"Advisor BFS skill-graph traversal: equivalence to the prior recursive-CTE behavior; cycle handling, depth bounds.","verdict":"PASS","summary":"BFS consolidation is behavior-preserving vs legacy: identical depth cap (8), cycle guard via visited-on-enqueue, first-discovery target match. Parity+unit tests lock cycles, depth 0/boundary, missing nodes. No defect found.","files_reviewed":[".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-queries.ts",".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts",".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-queries-parity.vitest.ts",".opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-bfs-traversal.vitest.ts"],"findings":[]}
```
