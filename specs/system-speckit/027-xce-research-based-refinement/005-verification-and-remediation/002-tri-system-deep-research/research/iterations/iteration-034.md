# Iteration 034 — Angle 34

**Angle:** Language coverage honesty: which file types index, which silently skip, and what parser_skip_list accumulates.

**Summary:** Runtime-supported structural languages are JavaScript, TypeScript, Python, Bash, plus a `doc` lane that indexes empty file rows. Current status shows parser_skip_list count 103 with shell-heavy B1 samples, but several docs and recovery surfaces overstate or obscure what is actually covered.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] repair-nodes cannot actually reparse parser_skip_list entries

- Evidence: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:161 says repair-nodes re-parses parser_skip_list candidates; .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:324-341 selects eligible rows then runs a normal incremental scan; .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:786-790 returns an early skip-list sentinel before parsing; .opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:93-97 makes successful unskip a no-op.
- Detail: The recovery operation identifies old quarantine rows, but it never bypasses or removes the skip-list entries it is supposed to repair. Any eligible file remains short-circuited by lookupSkipList, so the operation can report eligibility without testing whether the parser now handles the file.
- Fix sketch: Make repair-nodes perform a targeted retry with skip-list bypass for eligible files, then keep or remove each row based on the retry result.

## [P1][BUG] Unsupported includeGlobs silently disappear from scan accounting

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:113-128 only maps JS/TS/Python/Bash/doc extensions; .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2145-2147 does `if (!language || !config.languages.includes(language)) continue`; .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:744-746 reports filesScanned from `results.length`; .opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:340-342 asserts `.rs` and `.go` are null.
- Detail: A caller can request unsupported file types via includeGlobs, but candidates with unsupported extensions are skipped before ParseResult creation and never appear in filesScanned, errors, or warnings. This makes language coverage look cleaner than it is.
- Fix sketch: Validate includeGlobs against supported extensions or report unsupportedCandidateCount with sample paths and a warning.

## [P1][DOC-DRIFT] README overstates what lands in parser_skip_list

- Evidence: .opencode/skills/system-code-graph/README.md:96 says files that fail to parse land in a quarantine skip-list; .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:808-827 returns syntax-error partial parses without adding skip-list rows; .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:837-845 only adds B1/B2 caught exceptions to parser_skip_list.
- Detail: The skip-list is not a general parse-failure quarantine. It accumulates specific tree-sitter crash cohorts, mainly B1 `resolved is not a function` and B2 `memory access out of bounds`, while syntax errors and OTHER failures surface through parse diagnostics instead.
- Fix sketch: Rewrite the docs to distinguish parseDiagnostics from parser_skip_list, or intentionally route all parse-error classes into a documented quarantine model.

## [P2][DOC-DRIFT] Doc file coverage is file-row only, not structural graph coverage

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:169-175 includes md/json/jsonc/yaml/yml/toml by default; .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1235-1246 returns doc ParseResult with zero nodes and zero edges; .opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:659-668 verifies doc rows have node_count 0 and edge_count 0.
- Detail: Docs and structured config files can be counted as indexed files, but they contribute no symbols or relationships. That is valid as file freshness/scope coverage, but it is not structural source-code coverage and should be named honestly.
- Fix sketch: Document the `doc` lane as empty file-level indexing, or add a separate lightweight heading/key extractor if doc symbols are desired.

## [P2][REFINEMENT] Status output hides narrowed language scope behind a generic label

- Evidence: Observed `code_graph_status` output: `activeScope.fingerprint` contains `includeGlobs=[*.ts]`, while `activeScope.label` is only `end-user code only; opted-in .opencode folders: skills, agents, commands, specs, plugins`; .opencode/skills/system-code-graph/mcp_server/handlers/status.ts:350-364 emits activeScope without includeGlobs/excludeGlobs fields; .opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts:175-186 builds labels without glob scope.
- Detail: The current graph in this workspace is TypeScript-narrowed, but the human-readable status label does not say so. Operators must decode the fingerprint string to notice language/file-type narrowing.
- Fix sketch: Emit includeGlobs/excludeGlobs as first-class status fields and append them to the scope label when non-default.
