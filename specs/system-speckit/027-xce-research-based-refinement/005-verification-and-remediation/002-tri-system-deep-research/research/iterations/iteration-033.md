# Iteration 033 — Angle 33

**Angle:** Gold-query battery freshness: do the battery queries still represent the tree after the epic's renames and the agents/skills/commands pluralization?

**Summary:** The battery has been mostly moved to the current system-code-graph/system-skill-advisor tree: no missing source paths, no missing expected symbols, and no old `mcp_server/code_graph` or singular `.opencode/skill|agent|command` strings were found. Remaining freshness issues are stale line anchors and weak pluralization-specific coverage.

**Findings kept:** 2

## [P2][DOC-DRIFT] Gold battery source line anchors are stale for 9 of 28 queries

- Evidence: Command: node static battery check. Observed output: "missingPaths": [], "missingSymbols": [], "staleLinesCount": 9, including GQ-MCP-001 .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1198 actual="// exactly. We over-collect..." expectedAny=handleCodeGraphQuery|QueryArgs|SUPPORTED_RELATIONSHIP_OPERATIONS; GQ-MCP-002 scan.ts:312 actual="): graphDb.ParseDiagnosticsSummary {"; GQ-MCP-003 status.ts:197 actual="if (verificationTimestampMs === null) {"; GQ-MCP-006 advisor-recommend.ts:320 actual="sourceSignature,"; GQ-TYPE-002 query.ts:27 actual="} from '../lib/graph/bfs-traversal.js';"; GQ-TYPE-004 skill-graph-db.ts:43 actual="| 'enhances'"; GQ-REG-003 tool-schemas.ts:186 actual=""; GQ-REG-004 query.ts:1198 same as GQ-MCP-001; GQ-REG-006 skill-graph-queries.ts:83 actual="".
- Detail: The current battery no longer contains old pre-extraction paths and every expected symbol is still present in its referenced file, so the functional outline checks still represent current files. However, the human/source-line anchors embedded in `source_file:line` are stale for nearly a third of the battery, which makes failure reports and operator triage misleading after the epic's rewrites.
- Fix sketch: Refresh the `source_file:line` values from current symbol locations and add a small static test that fails when the anchored line contains none of the query's expected symbols.

## [P2][REFINEMENT] Battery lacks a literal canary for agents/skills/commands pluralization

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts:14-20 defines current plural globs `**/.opencode/skills/**`, `**/.opencode/agents/**`, `**/.opencode/commands/**`; .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/005-resilience-and-advisor/002-code-graph-resilience-research/assets/code-graph-gold-queries.json:172-185 only asserts symbols `getDefaultConfig`, `IndexerConfig`, `detectLanguage`, `EXCLUDED_FOR_CODE_GRAPH`, `shouldIndexForCodeGraph`, `matchesAnyPattern`; .opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:364-388 checks discovered symbol names only.
- Detail: The code-graph verifier does not evaluate query text or literal values; it outlines a source file and passes when expected symbol names are present. That means a regression from plural `.opencode/skills|agents|commands` globs back to singular roots could still pass the current gold battery if the surrounding symbol names remain unchanged.
- Fix sketch: Add a regression query or companion static assertion that explicitly checks the plural root literals in the runtime scope-policy source.
