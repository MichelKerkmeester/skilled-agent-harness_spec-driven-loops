# Iteration 003 - IRQ3 Phase 003 Risk-Formula Weight Validation

## Focus

IRQ3 cross-validated Phase 003's deterministic risk formula:

```text
risk = normalize(fanIn) * 0.35
     + normalize(hubDegree) * 0.25
     + (untestedFlag ? 1.0 : 0.0) * 0.25
     + normalize(transitiveDepth) * 0.15
```

The formula is explicitly described as "heuristic, tunable" in the Phase 003 spec (`003-code-graph-impact-analysis/spec.md:48-54`), and the same spec says the weights are design intuition to be validated later by Phase 005 (`003-code-graph-impact-analysis/spec.md:58`, `003-code-graph-impact-analysis/spec.md:150`, `003-code-graph-impact-analysis/spec.md:196`).

## Actions Taken

- Read Phase 003's risk-signal and formula contract: five deterministic signals (`003-code-graph-impact-analysis/spec.md:41-47`), the proposed weighted formula (`003-code-graph-impact-analysis/spec.md:48-54`), tunable constants requirement (`003-code-graph-impact-analysis/spec.md:120`), 3-hop BFS requirement (`003-code-graph-impact-analysis/spec.md:122`), and L2 edge cases (`003-code-graph-impact-analysis/spec.md:171-174`).
- Read prior pt-02 findings: Iteration 001 already flagged deterministic ordering and dangling-edge policy gaps (`027-xce-research-based-refinement-pt-02/iterations/iteration-001.md:17-33`), while Iteration 002 found the `CONTAINS` contract is not a symbol-to-file/module chain (`027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:19-29`) and therefore should not be treated as a reliable file/module traversal source for impact narratives.
- Read `queryEdgesFrom()` and `queryEdgesTo()`: both take a `symbolId` and query `code_edges.source_id` / `code_edges.target_id`, not `file_path` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-987`).
- Read file-level helpers: `queryFileImportDependents()` returns distinct imported/importer file pairs from `IMPORTS` edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1017-1036`), and `queryFileDegrees(filePaths)` computes per-file connected degree through joined source/target node file paths (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1039-1083`).
- Read edge confidence defaults: `EdgeType` includes `TESTED_BY` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:17-21`), and `DEFAULT_EDGE_WEIGHTS` gives `TESTED_BY` the lowest default listed confidence at `0.6` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:23-34`).
- Read edge write/read behavior: `code_edges` stores `weight` and JSON `metadata` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:138-145`), `replaceEdges()` persists edge metadata as JSON (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:738-742`), and `rowToEdge()` parses that metadata on read (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1201-1233`).
- Read edge generation patterns: structural edges attach `metadata.confidence` through `buildEdgeMetadata()` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:133-155`), `CALLS` is heuristic/inferred (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1128-1141`), and cross-file `TESTED_BY` edges are heuristic/ambiguous (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`).
- Read Phase 005 eval scope: the labeled task file is future work (`005-code-graph-adoption-eval/spec.md:93-95`, `005-code-graph-adoption-eval/spec.md:124`), and Phase 005 explicitly promises empirical validation of Phase 003 risk weights (`005-code-graph-adoption-eval/spec.md:149`).
- Read Phase 001 integration surface: Phase 001 emits `generateHLD(filePath, db) -> {file_role, layer, summary, primary_symbols[]}` (`001-code-graph-hld-lld/spec.md:100-104`) and is listed as feeding Phase 003 layer-based criticality weighting (`001-code-graph-hld-lld/spec.md:196-197`).

## Findings

### f-iter003-001 - BLOCKING - Weight defaults are acknowledged design intuition, not empirically defensible yet

Evidence: Phase 003 calls the formula "heuristic, tunable" (`003-code-graph-impact-analysis/spec.md:48`), says weights are tunable constants that Phase 005 validates (`003-code-graph-impact-analysis/spec.md:58`), lists the formula as an unvalidated design-intuition risk (`003-code-graph-impact-analysis/spec.md:150`), and leaves empirical validation as an open question (`003-code-graph-impact-analysis/spec.md:196`). Phase 005 has not yet produced the labeled task set; it only specifies a future `tasks/labeled-tasks.jsonl` with 12-20 tasks (`005-code-graph-adoption-eval/spec.md:93-95`, `005-code-graph-adoption-eval/spec.md:124`).

Verdict: BLOCKING for any claim that `0.35/0.25/0.25/0.15` is validated. The Phase 003 implementation can still ship these numbers as defaults if the output labels them heuristic and if `RISK_WEIGHTS` stays overrideable for Phase 005 calibration (`003-code-graph-impact-analysis/spec.md:120`, `003-code-graph-impact-analysis/spec.md:129`).

### f-iter003-002 - BLOCKING - `normalize()` is unspecified, making scores non-reproducible across graph sizes

Evidence: The formula uses `normalize(fanIn)`, `normalize(hubDegree)`, and `normalize(transitiveDepth)` (`003-code-graph-impact-analysis/spec.md:50-53`), and success criteria require scores in `[0..1]` (`003-code-graph-impact-analysis/spec.md:137`). No Phase 003 requirement defines whether normalization is max-normalization, log-scaling, z-score, percentile, or a fixed cap (`003-code-graph-impact-analysis/spec.md:118-130`).

Verdict: BLOCKING. Add a deterministic normalizer requirement before implementation. A defensible MVP shape is `min(log1p(value) / log1p(cap), 1)` with documented caps per signal, or percentile-by-current-graph if the report also includes the graph baseline. Max-normalization is simpler but unstable when one new outlier file changes every other file's score; that instability follows directly from the missing normalizer contract and the `[0..1]` score requirement (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:137`).

### f-iter003-003 - BLOCKING - Phase 003 describes file-level signals using symbol-level edge APIs

Evidence: The spec says fan-in is `queryEdgesTo(filePath)` and fan-out is `queryEdgesFrom(filePath)` (`003-code-graph-impact-analysis/spec.md:41-43`), and it describes `TESTED_BY` as `queryEdgesFrom(_, 'TESTED_BY')` (`003-code-graph-impact-analysis/spec.md:45`). The actual helpers accept a symbol id and query `code_edges.source_id = ?` or `code_edges.target_id = ?` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-987`). By contrast, `queryFileDegrees(filePaths)` is genuinely file-level because it joins edges through source/target node `file_path` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1039-1083`).

Verdict: BLOCKING. Phase 003 must define file aggregation before computing weights: collect all nodes for a file, count incoming/outgoing edges across those nodes, dedupe connected files, and decide whether `TESTED_BY` is true when any symbol in the file has an incoming or outgoing test edge. Without that policy, the proposed formula is deterministic in text but not implementable against the current API surface.

### f-iter003-004 - CONFIRMED - Additive scoring is the right MVP shape; multiplicative scoring fails the stated edge cases

Evidence: The Phase 003 edge cases say a file with `fanIn=0` should score accordingly, and a file with no `TESTED_BY` edges should set `untestedFlag=true` (`003-code-graph-impact-analysis/spec.md:171-173`). The additive formula gives an orphan-but-untested file at least the untested contribution (`003-code-graph-impact-analysis/spec.md:50-53`). A multiplicative formula would collapse to zero when `fanIn=0`, which would erase the untested signal that the spec says should carry the highest risk weight (`003-code-graph-impact-analysis/spec.md:173`).

Verdict: CONFIRMED. Keep additive composition for MVP. A log-scaled additive model is a better amendment than a multiplicative model because it preserves independent evidence from untested status while controlling count signals through the missing normalizer (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:137`).

### f-iter003-005 - BLOCKING - The 3-hop transitive-depth cap is specified, but the data path and rationale are not

Evidence: Phase 003 says BFS for transitive depth is capped at 3 hops via `queryFileImportDependents` LIMIT (`003-code-graph-impact-analysis/spec.md:97`) and requires depth not to expand beyond 3 (`003-code-graph-impact-analysis/spec.md:122`). The existing `queryFileImportDependents()` helper returns all distinct import-dependent file pairs and has no depth parameter or SQL `LIMIT` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1017-1036`). The spec separately requires cycle detection through a visited set (`003-code-graph-impact-analysis/spec.md:174`) and lists BFS cost as the reason for capping (`003-code-graph-impact-analysis/spec.md:151`).

Verdict: BLOCKING. The implementation must perform the 3-hop cap in its own BFS loop over the returned pair list, not rely on a helper-level LIMIT. The spec should also state why 3 is the MVP cap: performance bound plus explainability, with Phase 005 free to compare 2/3/5 hop settings (`005-code-graph-adoption-eval/spec.md:149`).

### f-iter003-006 - CONFIRMED - Missing `TESTED_BY` edges bridge directly into IRQ7 because absence is overloaded as risk

Evidence: Phase 003 says a file with no `TESTED_BY` edges sets `untestedFlag=true` (`003-code-graph-impact-analysis/spec.md:173`), while edge defaults give `TESTED_BY` a confidence/weight of `0.6` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:23-34`). The indexer emits cross-file `TESTED_BY` edges only through a filename heuristic and marks them ambiguous (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`).

Verdict: CONFIRMED. Treat `untestedFlag` as `coverageUnknownOrMissing` unless the implementation can distinguish "test edge population disabled or incomplete" from "file truly lacks tests." This is not a reason to remove the 0.25 term, but it should be carried into IRQ7 as a confidence edge case because missing edge population can inflate risk by the same weight as hub centrality (`003-code-graph-impact-analysis/spec.md:51-53`).

### f-iter003-007 - NO-CHANGE-NEEDED - Phase 001 layer criticality should stay optional for MVP, not hidden inside the base formula

Evidence: Phase 003 lists Phase 001 as an optional dependency for layer-based criticality in LLM enrichment (`003-code-graph-impact-analysis/spec.md:73`), while Phase 001 emits a deterministic HLD object with a `layer` field (`001-code-graph-hld-lld/spec.md:100-104`) and explicitly feeds Phase 003 layer-based criticality weighting (`001-code-graph-hld-lld/spec.md:196-197`). Phase 003's core formula has no layer term (`003-code-graph-impact-analysis/spec.md:50-53`).

Verdict: NO-CHANGE-NEEDED for the deterministic MVP. Keep the base score graph-only and expose Phase 001 layer criticality as a separate optional annotation or P1 multiplier after Phase 001 is available. Hiding layer inside the base formula would make Phase 003's "works independently of Phase 002" continuity claim harder to preserve for optional phase dependencies (`003-code-graph-impact-analysis/spec.md:17`, `003-code-graph-impact-analysis/spec.md:73-74`).

## Questions Answered

- Are the weights defensible? Not empirically yet. The spec itself calls them heuristic/design intuition and defers validation to Phase 005 (`003-code-graph-impact-analysis/spec.md:48`, `003-code-graph-impact-analysis/spec.md:150`, `003-code-graph-impact-analysis/spec.md:196`).
- Would shifting fan-in to `0.40` and hubDegree to `0.20` change rankings on a 5-task fixture? Unknown without a labeled fixture. Algebraically, the score delta is `0.05 * (normalize(fanIn) - normalize(hubDegree))` relative to the current formula (`003-code-graph-impact-analysis/spec.md:50-53`), so ranking changes only where candidate score gaps are smaller than that delta. The labeled task set is future Phase 005 work (`005-code-graph-adoption-eval/spec.md:93-95`, `005-code-graph-adoption-eval/spec.md:124`).
- Is multiplicative scoring better? No for the stated edge cases. It would erase untested risk when `fanIn=0`, while the spec says no `TESTED_BY` edge should carry a high risk contribution (`003-code-graph-impact-analysis/spec.md:171-173`).
- Is log-scaled additive scoring plausible? Yes, but only after the spec defines `normalize()`. The current formula needs normalized count signals and `[0..1]` output (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:137`).
- Is `fanIn=0` an orphan low-risk case? Yes for dependency blast radius, but the current additive shape still gives an untested orphan a 0.25 contribution when no test edge exists (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:171-173`).
- What if `untestedFlag` is missing because `TESTED_BY` edges are not populated? Current spec would treat missing edges as untested (`003-code-graph-impact-analysis/spec.md:173`), but the edge source is heuristic/ambiguous (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`), so this bridges to IRQ7.
- What should normalize mean? Unanswered by spec. This is blocking because normalization appears in the formula but not in requirements (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:118-130`).
- Why cap BFS at 3? The spec cites BFS cost and cycle protection (`003-code-graph-impact-analysis/spec.md:151`, `003-code-graph-impact-analysis/spec.md:174`), but the exact 3-hop value has no validation basis yet and must be implemented in the analysis layer because `queryFileImportDependents()` has no cap (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1017-1036`).
- Is the formula composable with Phase 001 `layer`? Yes as an optional annotation or later multiplier. Phase 001 exposes `layer` (`001-code-graph-hld-lld/spec.md:100-104`), and Phase 003 lists Phase 001 as optional for criticality weighting (`003-code-graph-impact-analysis/spec.md:73`).

## Questions Remaining

- Which deterministic `normalize()` contract should Phase 003 require: fixed cap, `log1p` cap, graph percentile, or max-normalization (`003-code-graph-impact-analysis/spec.md:50-53`, `003-code-graph-impact-analysis/spec.md:137`)?
- Should file-level fan-in/fan-out count raw edges, distinct source/target symbols, or distinct connected files, given that `queryEdgesFrom/To()` are symbol-level but `queryFileDegrees()` is file-level (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:949-987`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1039-1083`)?
- Should missing `TESTED_BY` be output as `coverage: "missing" | "present" | "unknown"` instead of a boolean, given the heuristic/ambiguous edge generation (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2046`)?
- Should Phase 005 tune risk weights manually from reports or add a small grid-search utility? Phase 005 currently leaves automatic feedback into `RISK_WEIGHTS` open and defaults to manual review (`005-code-graph-adoption-eval/spec.md:211-213`).

## Next Focus

IRQ4 - Phase 004 confidence-edge-case stress: brief shape at confidence `0.79/0.80/0.81`, and behavior when uncertainty exceeds confidence.
