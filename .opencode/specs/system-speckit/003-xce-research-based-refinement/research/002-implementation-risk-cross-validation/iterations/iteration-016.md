# Iteration 007 - IRQ7 TESTED_BY Edge Ground-Truth

## Focus

IRQ7 cross-validated Phase 003's test-coverage gap signal against the actual `TESTED_BY` edge contract. The question was whether `untestedFlag = !hasTestEdge`, currently described as `queryEdgesFrom(_, 'TESTED_BY')`, is viable from day 1 or whether Phase 003 needs an indexer amendment, filesystem fallback, or downgraded optional signal.

## Actions Taken

- Read Phase 003's risk-signal contract: test coverage is signal #4 (`003-code-graph-impact-analysis/spec.md:45`), the untested term contributes `0.25` to the risk formula (`003-code-graph-impact-analysis/spec.md:50-53`), REQ-002 requires all five signals to be asserted in fixture tests (`003-code-graph-impact-analysis/spec.md:119`), and no `TESTED_BY` edge means `untestedFlag=true` (`003-code-graph-impact-analysis/spec.md:173`).
- Read edge type declarations: `EdgeType` includes `TESTED_BY` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:17-21`) and `DEFAULT_EDGE_WEIGHTS.TESTED_BY` is `0.6` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:23-34`).
- Read the structural indexer TESTED_BY emitter: `finalizeIndexResults()` has a cross-file `TESTED_BY` heuristic block (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2049`) that detects test files with `/[./](?:test|spec|vitest)\./`, derives the subject path by replacing `.(test|spec|vitest).` with `.`, and emits one edge from every test node to every node in the sibling subject file.
- Read persistence behavior: finalized results are produced before metrics emission (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2156-2163`), `ensure-ready.ts` persists each parse result's edges with `replaceEdges(sourceIds, result.edges)` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:553-563`), and `replaceEdges()` inserts only edges whose source id is a retained source node while deleting dangling source/target edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:738-749`).
- Read graph query direction: `queryEdgesFrom(symbolId, edgeType)` filters `code_edges.source_id = ?` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-958`), while `queryEdgesTo(symbolId, edgeType)` filters `code_edges.target_id = ?` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-981`).
- Read cross-file resolver behavior: it only rewrites `CALLS` edges that target import proxy nodes (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:80-95`); its test-file detection is used only to prefer production call targets (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:19-23`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:101-106`).
- Checked existing test coverage references: repository tests mention `TESTED_BY` only in handler validation and type surfaces, not in an indexer fixture that proves edge emission (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:285`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`).

## Findings

### f-iter007-001 - CONFIRMED - TESTED_BY is declared and has the lowest default edge weight

Evidence: `EdgeType` includes `TESTED_BY` alongside structural and semantic edge types (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:17-21`). `DEFAULT_EDGE_WEIGHTS` assigns it `0.6`, below `CALLS: 0.8` and the structural/import/export defaults (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:23-34`).

Verdict: CONFIRMED. Phase 003 can depend on the edge type existing, but should expose that the signal is heuristic/low-confidence rather than equivalent to measured coverage.

### f-iter007-002 - CONFIRMED - structural-indexer does emit TESTED_BY, but only through filename sibling matching

Evidence: The emitter is present at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2049`. It recognizes file paths containing `.test.`, `.spec.`, or `.vitest.`, maps `foo.test.ts` / `foo.spec.ts` / `foo.vitest.ts` to `foo.ts`, then emits `TESTED_BY` edges from every test-file node to every subject-file node with heuristic/ambiguous metadata (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2033-2046`).

Verdict: CONFIRMED. The suspected "no emission path" blocker does not hold. However, the supported pattern is narrow: sibling filename convention only, not imports from test files to subjects, `__tests__` folder ownership, `*.test-d.ts`, or runner-import detection from `vitest` / `jest` / `mocha`.

### f-iter007-003 - BLOCKING - Phase 003's described query direction is wrong for populated TESTED_BY edges

Evidence: The indexer emits `sourceId: testNode.symbolId` and `targetId: testedNode.symbolId` for each `TESTED_BY` edge (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2040-2046`). `queryEdgesFrom(symbolId, 'TESTED_BY')` reads outgoing edges where `source_id = symbolId` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-958`), while the production symbol being assessed is the target and must be checked with `queryEdgesTo(symbolId, 'TESTED_BY')` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-981`).

Verdict: BLOCKING. If Phase 003 implements the spec literally, files with valid `TESTED_BY` edges will still be flagged untested. Amend the signal contract to aggregate incoming `TESTED_BY` edges over all production symbols in the file.

### f-iter007-004 - BLOCKING - Current TESTED_BY population is incomplete enough that absence must mean unknown-or-missing

Evidence: Phase 003 currently says no `TESTED_BY` edges means `untestedFlag=true` and assigns that term the same weight as hub centrality (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:173`). The indexer only uses the path regex `/[./](?:test|spec|vitest)\./` and sibling path replacement (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2033-2038`). The resolver does not add test edges by walking imports; it only handles `CALLS` import-proxy retargeting (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:80-95`).

Verdict: BLOCKING. Phase 003 should rename the boolean internally to `coverageUnknownOrMissing` or emit `{hasTestEdge, coverageEvidence}`. Treating absence as proven untested overstates risk for common test layouts that the current graph does not model.

### f-iter007-005 - NO-CHANGE-NEEDED - Do not expand the indexer inside Phase 003

Evidence: Phase 003's MVP is a new impact-analysis wrapper and handler over existing graph data (`003-code-graph-impact-analysis/spec.md:37-45`) and explicitly says no new tables for MVP (`003-code-graph-impact-analysis/spec.md:56-59`). Iteration 003 already found Phase 003 needs file-level aggregation before using symbol-level edge APIs (`027-xce-research-based-refinement-pt-02/iterations/iteration-003.md:42-47`). Adding import-walk test ownership to the structural indexer would be a separate graph-population project, not a local risk-signal wrapper.

Verdict: NO-CHANGE-NEEDED for indexer scope. Choose Option B with guardrails: Phase 003 should first use incoming graph edges, then optionally add a small same-directory sibling heuristic for `<subject>.test/spec/vitest.<ext>` when graph evidence is absent. Do not take Option A in Phase 003; Option C is only necessary if the team refuses to carry the unknown/missing caveat in the output contract.

### f-iter007-006 - BLOCKING - Add a fixture that proves both edge direction and sibling heuristic limits

Evidence: Existing test references surface `TESTED_BY` as an accepted edge type in query validation (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:285`), but code search found no indexer fixture asserting that `foo.test.ts` creates incoming `TESTED_BY` edges to `foo.ts`. Phase 003 REQ-002 requires unit tests to assert every signal value for a fixture db (`003-code-graph-impact-analysis/spec.md:119`).

Verdict: BLOCKING for Phase 003 confidence. Add a fixture with `src/foo.ts`, `src/foo.test.ts`, and `src/foo.integration.test.ts` or `src/__tests__/foo.test.ts` so the implementation proves the current supported sibling path and documents unsupported layouts as `coverageEvidence: "unknown"`.

## Questions Answered

- Is `TESTED_BY` declared? Yes, in `EdgeType` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:17-21`).
- What is its default weight? `0.6` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:23-34`).
- Does `structural-indexer.ts` emit `TESTED_BY`? Yes, at `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2049`.
- What pattern triggers emission? A test file path containing `.test.`, `.spec.`, or `.vitest.` and a same-directory/same-basename subject file obtained by replacing that segment with `.` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2033-2038`).
- Does it detect files importing from `vitest`, `jest`, or `mocha`? No. Search found no runner-import based path in the indexer; only filename regex matching is used (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`).
- Does `cross-file-edge-resolver.ts` populate test edges post-indexing? No. It filters test files only to prefer production candidates while retargeting `CALLS` edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:19-23`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/cross-file-edge-resolver.ts:80-106`).
- If `TESTED_BY` appears empty in a live db, what is the fallback? Do not run the live query in this iteration per instruction. Reasoning from code: use incoming `queryEdgesTo(symbolId, 'TESTED_BY')` first, then a bounded sibling filename heuristic if no graph evidence exists; expose absence as unknown-or-missing rather than proven untested.

## Questions Remaining

- Should Phase 003 aggregate `hasTestEdge` at symbol level, file level, or connected-file level? Iteration 003 already requires file aggregation before using symbol APIs (`027-xce-research-based-refinement-pt-02/iterations/iteration-003.md:42-47`); IRQ7 adds that the aggregation must use incoming `TESTED_BY`.
- Should unsupported layouts such as `__tests__/foo.test.ts`, `foo.integration.test.ts`, and test files that import subjects be reported as `coverageEvidence: "unknown"` or left out of the signal entirely?
- Should a later phase add import-walk ownership to the indexer or resolver? That is a plausible follow-up, but it is outside Phase 003's existing graph-data wrapper scope (`003-code-graph-impact-analysis/spec.md:37-45`, `003-code-graph-impact-analysis/spec.md:56-59`).

## Next Focus

IRQ8 - code_packages necessity escalation triggers.
