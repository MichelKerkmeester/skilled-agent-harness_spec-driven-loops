# Iteration 006 - IRQ6 Cross-Phase Integration Contract

## Focus

IRQ6 cross-validated the JSON contract between Phase 001 HLD/LLD, Phase 002 trace, and Phase 003 impact analysis. The core question was whether `file_role`, `architectural_role`, `layer`, and `hld_lld` are one shared wire contract or three loosely related local fields. The evidence points to a partially specified contract: Phase 002 hard-depends on Phase 001's role classifier, Phase 003 only optionally consumes Phase 001's layer signal, and the current `code_graph_context` schema does not yet admit the Phase 001 `queryMode:'omni'`/`hld_lld` extension.

## Actions Taken

- Read Phase 001 HLD/LLD spec: generator shape `generateHLD(filePath, db) -> {file_role, layer, summary, primary_symbols[]}` (`001-code-graph-hld-lld/spec.md:100-104`), omni integration requirement (`001-code-graph-hld-lld/spec.md:153`), baseline role labels (`001-code-graph-hld-lld/spec.md:161`), empty-file extra role (`001-code-graph-hld-lld/spec.md:224`), and open enum question (`001-code-graph-hld-lld/spec.md:254`).
- Read Phase 002 trace spec: hard sequence on Phase 001 (`002-code-graph-trace/spec.md:47`), trace output shape with `architectural_role` (`002-code-graph-trace/spec.md:83-85`), requirement that it equal `classifyFileRole()` output (`002-code-graph-trace/spec.md:107-110`), and dependency declaration (`002-code-graph-trace/spec.md:140`).
- Read Phase 003 impact-analysis spec and metadata: optional Phase 001 dependency for layer-based criticality (`003-code-graph-impact-analysis/spec.md:73`), deterministic base formula without a layer term (`003-code-graph-impact-analysis/spec.md:48-54`), optional LLM narrative requirement (`003-code-graph-impact-analysis/spec.md:128`), and `description.json` showing no hard dependencies (`003-code-graph-impact-analysis/description.json:20-22`).
- Read prior pt-02 findings: Iteration 001 already found truncation and dangling-edge contract blockers (`iteration-001.md:17-33`), Iteration 002 contains multiple Phase 002 blocking findings around `CONTAINS` assumptions (`iteration-002.md:19-65`), and Iteration 003 confirmed Phase 001 `layer` should remain optional for Phase 003 MVP (`iteration-003.md:66-70`).
- Read current `ContextResult` surface: `QueryMode` is only `neighborhood | outline | impact` (`mcp_server/code_graph/lib/code-graph-context.ts:19`), `ContextResult` has no `hld_lld` field (`mcp_server/code_graph/lib/code-graph-context.ts:32-54`), and `buildContext()` returns only the existing fields (`mcp_server/code_graph/lib/code-graph-context.ts:189-211`).
- Read current context handler schema: incoming `queryMode` is a string (`mcp_server/code_graph/handlers/context.ts:12-15`), accepted modes are only `neighborhood`, `outline`, and `impact` (`mcp_server/code_graph/handlers/context.ts:264-266`), and serialized `data` emits `queryMode`, summaries, anchors, `graphContext`, `textBrief`, `metadata`, and `graphMetadata`, but no `hld_lld` (`mcp_server/code_graph/handlers/context.ts:356-400`).
- Checked implementation status: no current `classifyFileRole` implementation exists under the code graph runtime or tests, so the contract is still spec-only and can drift during incremental work.

## Findings

### f-iter006-001 - BLOCKING - `file_role` is an open string in Phase 001 but a consumed contract in Phase 002

Evidence: Phase 001 requires five baseline labels - `module / api-handler / library / test / config` (`001-code-graph-hld-lld/spec.md:161`) but later explicitly leaves "closed enum or open string" unanswered with a default of open string (`001-code-graph-hld-lld/spec.md:254`). It also adds `file_role: "empty"` for empty/comment-only files (`001-code-graph-hld-lld/spec.md:224`), which is already outside the five baseline labels. Phase 002 requires `architectural_role` to use Phase 001's `classifyFileRole()` and equal the HLD output for the same file (`002-code-graph-trace/spec.md:107-110`).

Verdict: BLOCKING. The shared JSON contract should be documented as an open string with a required baseline set, not a closed five-value enum. Phase 002 tests must assert equality with `classifyFileRole()` and fixture coverage for baseline labels plus `"empty"`, not reject non-baseline future labels.

### f-iter006-002 - BLOCKING - `classifyFileRole()` signature is implied but not pinned in Phase 001's public contract

Evidence: Phase 001 documents `generateHLD(filePath, db)`, `generateLLD(symbolId, db)`, and `generateFileNarrative(filePath, db)` (`001-code-graph-hld-lld/spec.md:100-103`), but REQ-007 only says file-role classification covers five kinds (`001-code-graph-hld-lld/spec.md:161`). The task list names `classifyFileRole()` but does not show its signature (`001-code-graph-hld-lld/tasks.md:19`). Phase 002 says it will call/import `classifyFileRole()` (`002-code-graph-trace/spec.md:47`, `002-code-graph-trace/spec.md:85`, `002-code-graph-trace/spec.md:110`), and its plan says Phase 002 imports that function (`002-code-graph-trace/plan.md:50`).

Verdict: BLOCKING. Pin the exported signature before either phase implements tests: `classifyFileRole(filePath: string, db: CodeGraphDbLike): string` or a named result object. Given Phase 001 derives role from SymbolKind counts and path heuristics (`001-code-graph-hld-lld/spec.md:82-86`), a db-aware signature is the safer contract; a path-only stub cannot satisfy the symbol-count part.

### f-iter006-003 - BLOCKING - Phase 001's omni `hld_lld` integration conflicts with the current `code_graph_context` schema

Evidence: Phase 001 requires `queryMode:'omni'` payloads to include an `hld_lld` sub-result (`001-code-graph-hld-lld/spec.md:153`) and its plan says to update `ContextResult` with optional `hld_lld?` (`001-code-graph-hld-lld/plan.md:50-51`). The current runtime type only allows `QueryMode = 'neighborhood' | 'outline' | 'impact'` (`mcp_server/code_graph/lib/code-graph-context.ts:19`), and the handler accepts only those same three strings before defaulting to `neighborhood` (`mcp_server/code_graph/handlers/context.ts:264-266`). Current `ContextResult` has no `hld_lld` field (`mcp_server/code_graph/lib/code-graph-context.ts:32-54`), and the serialized handler output has no `hld_lld` field (`mcp_server/code_graph/handlers/context.ts:356-400`).

Verdict: BLOCKING. Schema drift can surface even if Phase 001's generator works: callers using `queryMode:'omni'` would be downgraded to `neighborhood`, and `hld_lld` may never cross the MCP wire. Phase 001 must update both internal TypeScript types and the handler serialization contract, with an integration test parsing the handler JSON.

### f-iter006-004 - CONFIRMED - `architectural_role` should be an alias of HLD `file_role`, not a separate classifier

Evidence: Phase 002's REQ-004 says `architectural_role` uses Phase 001's `classifyFileRole()` and returns the same role string as `code_graph_hld_lld` HLD output for the same file (`002-code-graph-trace/spec.md:110`). The success example shows `architectural_role: "api-handler"` (`002-code-graph-trace/spec.md:125`), matching one of Phase 001's baseline file-role labels (`001-code-graph-hld-lld/spec.md:161`).

Verdict: CONFIRMED. The cross-phase contract should state: `trace.architectural_role === hld.file_role` for the resolved file. Keep the different JSON field names because they describe different payload contexts, but document that Phase 002 is a consumer alias of Phase 001's `file_role` value.

### f-iter006-005 - BLOCKING - Phase 003's optional `layer` dependency needs an explicit fallback

Evidence: Phase 003 metadata lists Phase 001 as optional for layer-based criticality in LLM enrichment (`003-code-graph-impact-analysis/spec.md:73`) and `description.json` has `"depends_on": []` (`003-code-graph-impact-analysis/description.json:20-22`). Phase 003's deterministic formula has no `layer` term (`003-code-graph-impact-analysis/spec.md:48-54`), while Phase 001 emits `layer` inside HLD (`001-code-graph-hld-lld/spec.md:100-104`). Iteration 003 already concluded Phase 001 layer criticality should stay optional for MVP and be exposed as a separate annotation or later multiplier (`iteration-003.md:66-70`).

Verdict: BLOCKING for LLM enrichment mode, not for deterministic MVP. If Phase 003 ships before Phase 001, `layer` must resolve to a documented fallback such as `{source:"unavailable", value:null}` and omit layer-based criticality weighting. It should not invent a local layer classifier, because that would create a second source of truth.

### f-iter006-006 - BLOCKING - Parallel development stubs can hide contract drift unless they use the real exported shape

Evidence: Phase 002 has a hard dependency on Phase 001 (`002-code-graph-trace/description.json:19-21`, `002-code-graph-trace/spec.md:140`), while Phase 001 is still spec-scaffolded (`001-code-graph-hld-lld/description.json:13-25`). No current runtime or test file contains `classifyFileRole`, so Phase 002 cannot import it yet. Phase 001's open-string default plus empty-file role already means a stub returning only `"unclassified"` would not exercise the baseline labels or the equality contract (`001-code-graph-hld-lld/spec.md:161`, `001-code-graph-hld-lld/spec.md:224`, `002-code-graph-trace/spec.md:110`).

Verdict: BLOCKING for independent Phase 002 tests. A temporary stub is acceptable only as a test double typed to the final exported signature and returning fixture-controlled role strings from the same open-string domain. A production fallback of `"unclassified"` would violate Phase 002's hard dependency and should not be used to claim integration.

### f-iter006-007 - CONFIRMED - Test isolation depends on a small shared contract test, not a closed enum

Evidence: Phase 001 requires unit tests for role coverage (`001-code-graph-hld-lld/spec.md:161`) and Phase 002 requires `architectural_role` to match Phase 001's output (`002-code-graph-trace/spec.md:110`). Phase 002's checklist repeats that the architectural role must match Phase 001's classifier (`002-code-graph-trace/checklist.md:16`). The current codebase has no implementation to import yet.

Verdict: CONFIRMED. The right isolation shape is one shared fixture contract test after Phase 001 lands: for the same file fixture, `generateHLD(file, db).file_role`, `classifyFileRole(file, db)`, and `traceSymbol(symbol, db).architectural_role` must match exactly. That avoids Phase 002 pinning a closed enum and catches signature/serialization drift.

## Questions Answered

- JSON contract between phases: `hld.file_role` is the canonical role string; `trace.architectural_role` is a consumer alias and must equal it for the same resolved file (`002-code-graph-trace/spec.md:110`). `hld.layer` is a separate optional classification consumed by Phase 003 only when Phase 001 is present and LLM enrichment asks for layer-based criticality (`003-code-graph-impact-analysis/spec.md:73`).
- Is `file_role` open or closed? Open string with required baseline labels. Phase 001 explicitly defaults to open string (`001-code-graph-hld-lld/spec.md:254`) and already names `"empty"` outside the five baseline labels (`001-code-graph-hld-lld/spec.md:224`).
- Does `classifyFileRole()` take a db handle? The spec does not pin the signature, but the evidence points to `filePath + db`: role derivation uses SymbolKind counts plus path heuristics (`001-code-graph-hld-lld/spec.md:82-86`), and all Phase 001 generator functions shown in scope are db-aware (`001-code-graph-hld-lld/spec.md:100-103`).
- Is `ContextResult.hld_lld` documented? Only partly. Phase 001 requires an `hld_lld` sub-result in omni mode (`001-code-graph-hld-lld/spec.md:153`) and says the standalone tool returns `hld`, `lld[]`, and `summary` (`001-code-graph-hld-lld/spec.md:90`), but the precise `ContextResult.hld_lld` field schema is not defined in the current runtime or spec.
- If Phase 003 ships first, what is the fallback for `layer`? The deterministic MVP should omit layer criticality or emit a null/unavailable annotation. Phase 003 has no hard dependency in `description.json` (`003-code-graph-impact-analysis/description.json:20-22`) and no layer term in the base formula (`003-code-graph-impact-analysis/spec.md:48-54`).
- Can Phase 002 develop against a stub before Phase 001 ships? Yes only as a typed test double for the final `classifyFileRole(filePath, db)` shape. A production `"unclassified"` fallback would undermine the hard dependency and equality contract (`002-code-graph-trace/spec.md:47`, `002-code-graph-trace/spec.md:110`).
- How do Phase 002 tests run while Phase 001 is in flight? Either sequence Phase 002 after Phase 001 lands, as the specs already say (`002-code-graph-trace/spec.md:140`), or use a local typed test double until the shared implementation is available. Once Phase 001 lands, Phase 002 needs an integration test that imports the real classifier.
- Should naming be unified? No full rename needed. Document the relationship: `file_role` is the canonical HLD field, `architectural_role` is trace-local naming for the same value, and `layer` is a separate HLD classification for optional criticality weighting.

## Questions Remaining

- What exact TypeScript export should Phase 001 publish: a bare `classifyFileRole(filePath, db): FileRoleString`, a structured `{file_role, evidence}` object, or both?
- What is the exact wire shape of `ContextResult.hld_lld`: standalone `{hld,lld,summary}`, `{status,data}`, or a compact subsection under each anchor?
- Should `queryMode:'omni'` become a real fourth `QueryMode`, or should HLD/LLD be controlled by a separate `includeHldLld` flag to preserve the existing three query modes?
- Should the role contract define reserved strings such as `"empty"` and `"unknown"` separately from the five baseline labels?

## Next Focus

IRQ7 - TESTED_BY edge ground-truth: verify whether `structural-indexer.ts` actually emits `TESTED_BY` edges and how that affects Phase 003's untested-risk signal.
