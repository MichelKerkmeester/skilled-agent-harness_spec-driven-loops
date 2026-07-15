# Iteration 008 - IRQ8 code_packages Necessity Escalation Triggers

## Focus

IRQ8 cross-validated Phase 002 P1 REQ-007: whether the optional `code_packages` table can stay P1, or whether the Iteration 002 `CONTAINS` blocker escalates module/package resolution into P0. The answer is split: a correct module-rung resolver is P0 if Phase 002 keeps promising `symbol -> class -> module -> architectural_role`, but the currently described `code_packages` table is not sufficient unless it is populated from file/package ownership rather than naive `fq_name` prefix splitting.

## Actions Taken

- Read Phase 002's trace contract and optional package statement: `traceSymbol()` is scoped to return `symbol/class?/file/module/architectural_role`, walk incoming `CONTAINS` edges until file-level, and optionally add `code_packages` populated from `fq_name` prefix splitting (`002-code-graph-trace/spec.md:81-90`, `002-code-graph-trace/spec.md:113-118`).
- Read Phase 002's explicit fallback and edge cases: incomplete `CONTAINS` chains fall back to dot-delimited `fq_name` splitting, while no-edge symbols still return `file` and `architectural_role` (`002-code-graph-trace/spec.md:136-139`, `002-code-graph-trace/spec.md:156-162`).
- Read Phase 002 plan Phase 5: `code_packages(package_name PK, files_json, depth)` is optional and populated from an `fq_name` prefix scan (`002-code-graph-trace/plan.md:39-42`).
- Re-read Iteration 002's blocking finding: `CONTAINS` only emits `class -> method`, with no module/file containment rung, making fallback resolution mandatory for top-level symbols and file/module rungs (`027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:19-24`, `027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:61-65`).
- Re-read Iteration 006's cross-phase contract: `trace.architectural_role` is an alias of Phase 001 HLD `file_role`, so Phase 002 can source the architectural rung from the resolved file even when containment is absent (`027-xce-research-based-refinement-pt-02/iterations/iteration-006.md:37-42`, `027-xce-research-based-refinement-pt-02/iterations/iteration-006.md:61-70`).
- Read current schema: `code_files`, `code_nodes`, and `code_edges` exist; `code_nodes` already has `file_path` and `fq_name`; there is no `code_packages` table today (`mcp_server/code_graph/lib/code-graph-db.ts:103-186`).
- Read `CodeNode`: every node carries `filePath`, `fqName`, `kind`, `name`, and language (`mcp_server/code_graph/lib/indexer-types.ts:52-67`), and IDs are generated from `filePath + fqName + kind` (`mcp_server/code_graph/lib/indexer-types.ts:109-114`).
- Read `fq_name` assignment: captures use `parentName ? parentName + "." + name : name`; module nodes use only `getModuleName(filePath)` as both `fqName` and `name` (`mcp_server/code_graph/lib/structural-indexer.ts:233-235`, `mcp_server/code_graph/lib/structural-indexer.ts:943-992`).
- Read current containment emission: `CONTAINS` still only links classes to methods by `method.fqName.startsWith(c.name + ".")`, not module/file to symbol (`mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`).
- Read export parsing: star re-exports become export name `"*"`, named exports use the local/exported specifier name, declaration exports also visit the inner declaration, and anonymous/default declarations with no name are skipped as captures (`mcp_server/code_graph/lib/tree-sitter-parser.ts:235-239`, `mcp_server/code_graph/lib/tree-sitter-parser.ts:524-552`, `mcp_server/code_graph/lib/tree-sitter-parser.ts:588-607`).
- Ran live DB checks against `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite`: tables are only `code_edges`, `code_files`, `code_graph_metadata`, `code_nodes`, diagnostics/metadata tables; sample module nodes had basename `fq_name` values such as `index`, `providers`, and `eval`; method samples had class-qualified `fq_name` values such as `APIClient.get`; re-export barrels had `fq_name="*"`.

## Findings

### f-iter008-001 - BLOCKING - `fq_name` is symbol-qualified, not package-qualified

Evidence: `getCaptureFqName()` creates `fqName` from lexical capture parentage only: `parentName.name` when a parent class/function context exists, otherwise the local symbol name (`mcp_server/code_graph/lib/structural-indexer.ts:233-235`). Module nodes are not path/package-qualified either; they use `getModuleName(filePath)` for both `fqName` and `name` (`mcp_server/code_graph/lib/structural-indexer.ts:951-956`). `CodeNode` separately stores `filePath`, which is the only reliable file/package anchor available today (`mcp_server/code_graph/lib/indexer-types.ts:52-67`).

Verdict: BLOCKING. Dot-splitting `fq_name` cannot recover module hierarchy because dots currently mean lexical/class nesting, not package path. The correct P0 fallback source for file/module ownership is `CodeNode.filePath`, not `fqName`.

### f-iter008-002 - BLOCKING - Iteration 002 escalates module-rung resolution to P0, but not the current table design verbatim

Evidence: Phase 002's plan still makes `code_packages` optional and populated from `fq_name` prefixes (`002-code-graph-trace/plan.md:39-42`), but Iteration 002 proved the upward `CONTAINS` chain stops at `class -> method` and never reaches module/file (`027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:19-24`). Therefore the fallback is not a rare edge path; it is the normal path for every top-level function, export/import node, Bash function, module node, and class without a method target. Since `fq_name` is not package-qualified, a table populated from `fq_name` splitting would persist ambiguous module labels rather than fix them.

Verdict: BLOCKING. Amend Phase 002 as: P0 must include deterministic file/module resolution from `node.filePath` plus a documented module policy. `code_packages` can remain P1 only if it is explicitly an optimization over that file-path-derived policy. If the product requirement is a true package hierarchy, then a redesigned package table populated from file paths, Python package markers, TS path aliases, and import metadata becomes P0.

### f-iter008-003 - CONFIRMED - Live DB samples show dot splitting misclassifies common shapes

Evidence: The live DB has 57,318 `code_nodes` and no `code_packages` table. Sample module nodes are basename-only: `index`, `providers`, `eval`. Sample methods are class-qualified: `APIClient.constructor`, `APIClient.get`, `AdvisorHookMetricsCollector.record`. Splitting `APIClient.get` gives a false module candidate of `APIClient`; the correct module is only recoverable from `file_path`, such as `.opencode/skills/sk-code/assets/universal/patterns/validation_patterns.js` or `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts`. Star re-exports appear as `fq_name="*"`, which has no module prefix at all.

Verdict: CONFIRMED. The empirical test fails the proposed fallback. Dot splitting can be useful for display rungs like class/method, but not for the trace `module` rung.

### f-iter008-004 - BLOCKING - Class/method and parameter nesting prove `fq_name` dots are lexical separators

Evidence: Tree-sitter captures carry `parentName` into nested class/method/parameter contexts (`mcp_server/code_graph/lib/tree-sitter-parser.ts:619-638`, `mcp_server/code_graph/lib/tree-sitter-parser.ts:641-665`), and `getCaptureFqName()` turns that parent chain into dotted `fqName` (`mcp_server/code_graph/lib/structural-indexer.ts:233-235`). Phase 002's proposed example `class C { method m() {} } -> module.C.m` assumes the left side before the last segment is a module path, but current data would encode the class and method as `C.m` inside a separate file path.

Verdict: BLOCKING. The fallback rule "module = fqName prefix" confuses lexical containers with package containers. Phase 002 should derive class/method display from `fqName`, but derive module/package from `filePath` and optional package metadata.

### f-iter008-005 - CONFIRMED - Re-exports and anonymous/default exports are insufficiently represented for package inference

Evidence: Export parsing emits star re-exports as `name="*"` and `exportKind="star"` (`mcp_server/code_graph/lib/tree-sitter-parser.ts:524-527`), named export specifiers as their specifier name (`mcp_server/code_graph/lib/tree-sitter-parser.ts:529-540`), declaration exports as the declaration name (`mcp_server/code_graph/lib/tree-sitter-parser.ts:544-552`), and skips captures when no extractable name exists (`mcp_server/code_graph/lib/tree-sitter-parser.ts:604-607`). Iteration 002 already flagged anonymous default exports and anonymous class-contained function expressions as sparse trace cases (`027-xce-research-based-refinement-pt-02/iterations/iteration-002.md:49-53`).

Verdict: CONFIRMED. For `export { foo } from "./lib"`, the export node reflects the exporting/barrel file and specifier name, not a durable source-module ownership chain. For anonymous default exports, there may be no stable symbol capture. These are test obligations and package-inference blockers for `fq_name` splitting.

### f-iter008-006 - NO-CHANGE-NEEDED - Performance does not by itself justify a P0 schema migration at current scale

Evidence: Existing indexes include `idx_nodes_symbol_id`, `idx_nodes_kind`, `idx_file_line`, `idx_files_path`, and edge source/target indexes (`mcp_server/code_graph/lib/code-graph-db.ts:174-183`). The live DB has 57,318 nodes and 1,579 module nodes. A trace lookup can resolve `file` directly from the node row and derive a module label from the already-loaded `file_path` string, so runtime dot splitting is not the dominant cost compared with graph traversal and handler serialization. Phase 002's NFR is `<50ms p95` for 10k-symbol graphs (`002-code-graph-trace/spec.md:147-152`), but no benchmark currently proves package-table joins are required to meet that.

Verdict: NO-CHANGE-NEEDED. Make correctness the escalation trigger, not performance. Add `code_packages` for performance only after a benchmark shows file-path/module derivation is hot, or when graphs reach a measured scale where repeated module aggregation dominates p95.

## Questions Answered

- Who produces `fq_name` today? `structural-indexer.ts` produces it when converting parser captures into `CodeNode`s. It uses capture `parentName` plus local `name`, while module nodes use basename-derived module names (`mcp_server/code_graph/lib/structural-indexer.ts:233-235`, `mcp_server/code_graph/lib/structural-indexer.ts:951-956`, `mcp_server/code_graph/lib/structural-indexer.ts:965-986`).
- What is the format? It is not `src.auth.middleware.requireAuth` or `src/auth/middleware.ts:requireAuth`. For top-level symbols it is usually the local name (`main`, `setupMcpTools`); for methods/classes it is lexical (`APIClient.get`); for module nodes it is a basename (`providers`, `index`); for star re-exports it can be `*`.
- Where is it well-defined? It is useful for lexical display in TS/JS/Python captures, especially named class/method and function/parameter rungs. It is not a package identity.
- Where is it ambiguous? Anonymous/default exports may not produce stable captures; star re-exports use `*`; named re-exports reflect the barrel/exporting file's specifier; class/method dots are lexical; Bash top-level functions and plain JS modules have no package path in `fq_name`; Rust `mod` is out of current supported-language scope.
- Does Iteration 002 escalate REQ-007 from P1 to P0? It escalates the need for deterministic module-rung resolution to P0 if Phase 002 keeps the module rung in the trace contract. It does not automatically make the current `code_packages(package_name, files_json, depth)` table P0, because that table's proposed population method (`fq_name` prefix scan) is the failing assumption.
- When does the fallback fail? It fails whenever `fq_name` encodes lexical containment (`C.m`), has no dot (`main`), uses non-module sentinels (`*`), skips unnamed exports, or represents a symbol re-exported through a barrel file.
- At what scale does performance matter? UNKNOWN without a benchmark. For the current 57k-node DB, correctness dominates; file-path-derived module resolution should be O(loaded node string handling) per trace. A package table becomes performance-motivated only if measured p95 exceeds the Phase 002 NFR or if repeated package aggregation across large graphs becomes a hot path.

## Questions Remaining

- What should `module` mean in the trace payload: file basename, directory package, import alias/root package, Python package, or Phase 001 architectural module?
- Should Phase 002 P0 define `resolveModuleFromFilePath(filePath, rootDir, language, config)` and defer `code_packages`, or should it add a formal `code_packages` table immediately but populate it from file paths and language-specific package metadata?
- How should barrel re-exports be represented in trace output: exporting module, source module, or both with provenance?

## Next Focus

IRQ9 - LLM-enrichment dispatch shape: validate Phase 003 P1 `enrichWithLLM=true`, local-first executor routing, and SaaS leak prevention.
