# Iteration 002 - IRQ2 Phase 002 CONTAINS Edge Cross-Language Population

## Focus

IRQ2 cross-validated Phase 002's assumption that `traceSymbol()` can walk `symbol -> class -> module -> architectural_role` by repeatedly calling `queryEdgesTo(symbolId, 'CONTAINS')`. The phase spec says the new trace tool should walk `queryEdgesTo(symbolId, 'CONTAINS')` until a file-level node is reached (`002-code-graph-trace/spec.md:83-85`), and it also claims existing `CONTAINS` edges cover `symbol->class->file` (`002-code-graph-trace/spec.md:41-43`). The implementation evidence does not support that full chain.

## Actions Taken

- Read Phase 002 trace contract, especially the chain walker requirement (`002-code-graph-trace/spec.md:83-85`), minimum output contract (`002-code-graph-trace/spec.md:107`), optional `code_packages` fallback (`002-code-graph-trace/spec.md:116-117`), incomplete-chain risk mitigation (`002-code-graph-trace/spec.md:136-139`), and file-level/no-edge edge cases (`002-code-graph-trace/spec.md:159-161`).
- Read iteration 001 overlap: prior research already flagged multiple module-symbol ambiguity and the need for a deterministic primary module rule (`027-xce-research-based-refinement-pt-02/iterations/iteration-001.md:41-45`), plus mixed-language content staying bounded to the existing indexed graph (`027-xce-research-based-refinement-pt-02/iterations/iteration-001.md:47-51`).
- Read graph edge type and weight definitions: `CONTAINS` is a valid `EdgeType` and has default weight `1.0` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:17-24`).
- Read supported-language and extension routing: `SupportedLanguage` is `javascript | typescript | python | bash | doc` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:49-50`), `detectLanguage()` maps JS/TS/Python/Bash/doc extensions only (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:122-138`), and tests assert `.rs` and `.go` return `null` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:340-343`).
- Read Tree-sitter grammar loading: runtime-supported parser grammars are `javascript`, `typescript`, `python`, and `bash` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:49-52`), mapped to four WASM files from `tree-sitter-wasms` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:110-124`), while `doc` returns no nodes or edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:712-723`).
- Read node conversion and edge emission: `capturesToNodes()` creates a synthetic module node for non-empty content (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`) and returns `[moduleNode, ...symbolNodes]` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:988-992`), but `extractEdges()` only emits `CONTAINS` from class nodes to method nodes (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).
- Read Phase 002's primary walker helper: `queryEdgesTo()` returns incoming edges to the target symbol and optional `sourceNode` resolution (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-987`).

## Findings

### f-iter002-001 - BLOCKING - CONTAINS is not a symbol-to-file/module chain

Evidence: Phase 002 expects a recursive upward walk via `queryEdgesTo(symbolId, 'CONTAINS')` until a file-level node (`002-code-graph-trace/spec.md:83-85`) and claims existing `CONTAINS` edges cover `symbol->class->file` (`002-code-graph-trace/spec.md:41-43`). The actual edge emitter only filters `classes` and `methods`, then pushes `CONTAINS` edges from a class to a method (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`). The synthetic module node exists for non-empty files (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-963`), but no `CONTAINS` emission path connects that module node to classes, functions, imports, exports, or methods (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).

Verdict: BLOCKING. Phase 002 must not rely on `CONTAINS` alone for the `file` or `module` rung. The spec should add either module/file containment edge population during indexing or a trace-local fallback that resolves `file` from the node's `filePath` and derives `module` independently.

### f-iter002-002 - BLOCKING - CONTAINS is not emitted for all supported languages

Evidence: Supported graph languages are JS, TS, Python, Bash, and doc (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:49-50`). Tree-sitter loads JS, TS, Python, and Bash grammars (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:49-52`), and doc parsing returns empty `nodes` and `edges` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:712-723`). Since `CONTAINS` emission requires both `class` nodes and `method` nodes (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1040`), Bash and doc cannot produce `CONTAINS` edges under the current model.

Verdict: BLOCKING. The accurate statement is: `CONTAINS` is emitted only for captured `class -> method` pairs. That can occur in TypeScript/JavaScript and Python when methods are captured, but it is not available for every supported language and not available for file-level functions.

### f-iter002-003 - CONFIRMED - Go and Rust WASMs are present but not runtime-supported languages

Evidence: The parser package is `tree-sitter-wasms`, described as prebuilt WASM binaries for tree-sitter language parsers (`.opencode/skills/system-spec-kit/mcp_server/node_modules/tree-sitter-wasms/README.md:1-3`). The runtime loader's `nameMap` only maps `javascript`, `typescript`, `python`, and `bash` to WASM artifacts (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:110-124`). The language detector returns `null` for `.rs` and `.go` in tests (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:340-343`).

Verdict: CONFIRMED. Go interface methods and Rust `impl` blocks are not Phase 002 cross-language edge cases for the current runtime. They are future-parser expansion cases, not current trace blockers.

### f-iter002-004 - BLOCKING - Nested classes can break upward containment selection

Evidence: Tree-sitter recursion records nested class names by passing a fully qualified parent class name (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:634-638`), and `getCaptureFqName()` formats nested captures as `parentName.name` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:233-234`). The `CONTAINS` parent lookup checks `method.fqName.startsWith(c.name + '.')`, using only the candidate class's short `name`, not its `fqName` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1043`).

Verdict: BLOCKING for nested classes. A nested method such as `Outer.Inner.run` will not match class `Inner` through `startsWith('Inner.')`, and can instead match `Outer` through `startsWith('Outer.')`. The parent lookup should compare against `c.fqName + '.'`, not `c.name + '.'`, with a regression fixture.

### f-iter002-005 - CONFIRMED - Python decorators do not affect CONTAINS, but decorator edges are separate

Evidence: Decorated Python definitions are unwrapped by visiting the inner `function_definition` or `class_definition` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:672-688`), and decorator names are captured on symbols (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:321-338`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:628-630`). Decorator relationships emit `DECORATES`, not `CONTAINS` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1147-1164`).

Verdict: CONFIRMED. Python decorators do not block class-to-method containment directly, but Phase 002 should not expect decorators to add containment rungs.

### f-iter002-006 - BLOCKING - Anonymous functions inside classes and export-default classes are sparse trace cases

Evidence: JS/TS captures named declarations, method definitions, classes, interfaces, aliases, enums, imports, and exports (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:162-176`). Function expressions and arrow functions are only recognized when they are named through `variable_declarator` or `lexical_declaration` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:385-416`). `export_statement` emits an export capture and separately visits an inner declaration when present (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:588-594`), and name extraction returns `null` when an export declaration has no inner named declaration (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:235-238`).

Verdict: BLOCKING for test coverage. `export default class Named {}` is likely recoverable through the inner class visit, but anonymous `export default class {}` and anonymous class-contained function expressions can lack stable symbol nodes. Phase 002 should add fixtures for named default classes, anonymous default classes, and class fields assigned anonymous functions before promising complete trace chains.

### f-iter002-007 - NO-CHANGE-NEEDED - TypeScript namespace, Go interface methods, and Rust impl blocks are out of current parser scope

Evidence: JS/TS kind mapping does not include `module_declaration`, `internal_module`, or namespace-specific node types (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:162-176`). Go and Rust files are not detected as supported languages in tests (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:340-343`).

Verdict: NO-CHANGE-NEEDED for Phase 002 MVP if the spec explicitly scopes to the current `SupportedLanguage` set. Add namespace/Go/Rust notes only as future parser expansion risks.

### f-iter002-008 - BLOCKING - The fq_name prefix fallback is specified but not robust enough as written

Evidence: Phase 002 only defines `code_packages` as an optional table populated from fq_name prefix splitting (`002-code-graph-trace/spec.md:116-117`) and says incomplete `CONTAINS` chains fall back to dot-delimited `fq_name` prefix splitting (`002-code-graph-trace/spec.md:136-139`). Actual symbol IDs derive from file path, fqName, and kind (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:109-114`), while module nodes use only the basename-derived module name (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-956`).

Verdict: BLOCKING. Dot splitting can recover class/method-like names, but it cannot reliably identify file/module boundaries because module names are basename-derived and may not match package path prefixes. The fallback needs a deterministic rule: always source `file` from the node's `filePath`, derive `module` from Phase 001/file classification or a package-path heuristic, and use fqName splitting only for symbol-level display rungs.

### f-iter002-009 - CONFIRMED - Empty CONTAINS chains are specified, but implementation tests must enforce the shape

Evidence: REQ-001 requires `symbol`, `file`, and `architectural_role` minimum output, with `class` and `module` optional based on container chain (`002-code-graph-trace/spec.md:107`). L2 edge cases require file-level symbols to return `class: null` and no-edge symbols to return `chain: [symbol]`, `truncated: false`, and a role from file-path heuristic (`002-code-graph-trace/spec.md:159-160`). `queryEdgesTo()` can return no rows when a symbol has no incoming `CONTAINS` edge because it filters by `target_id` and optional edge type (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-981`).

Verdict: CONFIRMED with test obligation. Phase 002 already specifies the desired empty-chain behavior, but the checklist should require fixtures for top-level functions, Bash functions, doc files, and symbols with no incoming `CONTAINS` edge.

## Questions Answered

- Is `CONTAINS` emitted for all supported languages? No. It is emitted only for `class -> method` pairs (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`), so Bash and doc have no current containment path (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:49-50`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:712-723`).
- Is it TS/JS-only? No. Python can also emit `class -> method` pairs because Python captures class methods with `kind: 'method'` and `parentName` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:716-735`), but only the `class -> method` rung is emitted (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).
- Which tree-sitter grammars are loaded? Runtime loading is limited to `javascript`, `typescript`, `python`, and `bash` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:49-52`, `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:110-124`).
- Are Go interface methods or Rust impl blocks current risks? No for current runtime, because `.go` and `.rs` are not detected as supported languages (`.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:340-343`).
- Is fqName prefix splitting robust? Not for file/module rungs. The spec names it as a fallback (`002-code-graph-trace/spec.md:136-139`), but module nodes are basename-derived (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-956`), so path/package identity cannot be reliably recovered from dot splitting alone.
- How should Phase 002 behave when the `CONTAINS` chain is empty? The spec says return at least `symbol`, `file`, and `architectural_role` (`002-code-graph-trace/spec.md:107`), with `class: null` for file-level symbols and `chain: [symbol]` for no-edge symbols (`002-code-graph-trace/spec.md:159-160`).

## Questions Remaining

- Should Phase 002 amend the indexer to emit `module -> top-level symbol` and `class -> nested class` containment edges, or should `code_graph_trace` derive file/module rungs without changing indexer output? The current phase lists new parsing logic out of scope (`002-code-graph-trace/spec.md:92-97`) but depends on a chain the current indexer does not emit (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).
- Should nested-class containment be fixed inside `extractEdges()` before Phase 002, or should Phase 002 defensively ignore ambiguous incoming `CONTAINS` parents? The current parent lookup uses short class names (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1043`) even though captures preserve fqName nesting (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:233-234`).
- Should `module` in the trace payload mean basename module, package segment, directory package, or Phase 001 architectural module? Phase 002 shows `module: "auth"` in the success example (`002-code-graph-trace/spec.md:125`) but the synthetic module node is basename-derived (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:951-956`).

## Next Focus

IRQ3 - Phase 003 risk-formula weight validation: validate whether `0.35/0.25/0.25/0.15` is defensible against existing graph data, explainability needs, and edge weighting semantics.
