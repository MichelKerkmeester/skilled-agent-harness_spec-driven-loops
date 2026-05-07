# Iteration 5 — Issue D: Tree-sitter Parser Crashes

## METADATA
- Iteration: 5 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 4 — Issue D: Tree-sitter parser crashes

## INVESTIGATION
Read the research charter, prior iterations 001-003, the native-rerun synthesis, and the native trial log. `iteration-004.md` was absent at read time, so there was no prior Issue C artifact to incorporate.

Traced the parser path through `code_graph/lib/structural-indexer.ts`, `code_graph/lib/tree-sitter-parser.ts`, `code_graph/handlers/scan.ts`, `code_graph/lib/ensure-ready.ts`, and `code_graph/lib/code-graph-db.ts`. Checked parser dependency versions in `mcp_server/package.json` and the lockfile. Read the native zero-node raw artifact and trial log for the reported `parserCrashCount: 10`.

Also ran a read-only parser probe against the current `.opencode` JS/TS candidate set. It checked 1,463 files with the current built tree-sitter parser and found zero reproducible `memory access out of bounds` hits. That does not disprove the native trial; it means the archived artifacts do not contain enough file-level data to recover the exact 10 affected files.

## FINDINGS
- P0 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:467` — Error parse results are persisted as authoritative file state with `node_count=0` and then `replaceNodes()`/`replaceEdges()` clears the file's graph content; recommended remediation: do not replace a prior successful file graph when `result.parseHealth === "error"`, and persist the parse diagnostic separately.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:348` — Any per-file parse error suppresses candidate-manifest recording for the whole full scan, so a scan with 10 parser crashes can complete with persisted graph changes but no fresh manifest baseline; recommended remediation: record the candidate manifest independently from per-file parse health, or distinguish fatal scan errors from nonfatal per-file parser diagnostics.
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:81` — `code_files` stores only `parse_health` and not the actual parse error text, while scan response truncates errors at `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:402`; recommended remediation: add durable parse diagnostic storage keyed by file path and expose it via scan/status so native crash artifacts include affected filenames and messages.
- P2 `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:722` — Tree-sitter syntax errors and parser runtime crashes are both collapsed into `parseHealth`/`parseErrors` results, but only syntax errors get the stable message `Tree contains syntax errors (partial parse)`; recommended remediation: classify parser runtime exceptions separately from syntax-recovered parses so OOB crashes are counted and reported as parser backend failures.

## EVIDENCE
Parser versions:

```text
.opencode/skills/system-spec-kit/mcp_server/package.json:59 tree-sitter-wasms ^0.1.13
.opencode/skills/system-spec-kit/mcp_server/package.json:60 web-tree-sitter ^0.24.7
.opencode/skills/system-spec-kit/package-lock.json:5593 tree-sitter-wasms 0.1.13
.opencode/skills/system-spec-kit/package-lock.json:7569 web-tree-sitter 0.24.7
```

Parser selection and fallback:

```text
structural-indexer.ts:887-910 getParser() defaults SPECKIT_PARSER to treesitter, lazy-loads TreeSitterParser, and falls back to RegexParser only if init/load fails.
structural-indexer.ts:1243-1255 parseFile() catches parser exceptions and returns parseHealth="error" with zero nodes/edges.
tree-sitter-parser.ts:713-720 calls parserInstance.setLanguage(), parserInstance.parse(content), walkAST(), capturesToNodes(), and extractEdges().
tree-sitter-parser.ts:722-739 marks grammar syntax errors as recovered/error based on captures and emits "Tree contains syntax errors (partial parse)".
tree-sitter-parser.ts:741-755 catches runtime exceptions such as "memory access out of bounds" and returns parseHealth="error".
```

Scan/persistence behavior:

```text
structural-indexer.ts:2131-2147 reads every candidate and pushes parseFile() results; unreadable files are skipped silently.
scan.ts:315 persists every ParseResult before checking parseErrors.
ensure-ready.ts:467-480 upserts the file, replaces nodes, replaces edges, then upserts again with final mtime.
scan.ts:325-328 appends parseErrors to the scan-level errors list after persistence.
scan.ts:348-354 records the candidate manifest only when errors.length === 0.
scan.ts:402 exposes only errors.slice(0, 10) in the scan response.
code-graph-db.ts:81-92 code_files has parse_health and parse_duration_ms, but no parse_errors column/table.
```

Native-rerun evidence:

```text
trial-log.jsonl N-CG-005: status=completed_with_failure, totalNodes=0, previousTotalNodes=56843, parserCrashCount=10, parserCrashMessage="memory access out of bounds".
trial-log.jsonl N-CG-007: repeat includeSkills:true recovery also completed_with_failure with totalNodes=0, totalEdges=764, parserCrashCount=10.
code-graph-zero-node-scans.json repeats the crash count/message, but does not list affected files.
synthesis-report-native-rerun.md classifies structural-indexer parser crashes as P0 and says the crashes skip valid TypeScript files.
```

Read-only parser probe:

```text
Checked current .opencode JS/TS candidates: 1,463
Reproduced memory access out of bounds hits: 0
```

Live DB diagnostic check:

```text
SELECT parse_health, COUNT(*) FROM code_files GROUP BY parse_health;
clean|7632
error|1648
```

Two sampled currently error-marked TypeScript files did not reproduce parser errors with the current built parser:

```text
.opencode/skills/mcp-code-mode/mcp_server/index.ts|clean|nodes=28|edges=13|errors=
.opencode/skills/system-spec-kit/mcp_server/api/eval.ts|clean|nodes=20|edges=0|errors=
```

The sampled files use ordinary TypeScript features: imports, `z.infer`, typed function signatures, template literals, and re-export blocks. No common unusual TS syntax was verified from those samples.

## NEW INSIGHTS
- The native artifacts preserve the crash count and OOB message, but not the affected filenames. The exact 10-file pattern is therefore UNKNOWN from the archived packet.
- The current parser/backend combination did not reproduce OOB on 1,463 `.opencode` JS/TS files, so the crash may depend on an older file version, a broader candidate set, a native runtime state, or a parser/WASM state that was not captured. This is an open question, not a conclusion.
- Parser runtime crashes are not propagated as fatal scan exceptions. They become per-file `ParseResult` objects, are persisted as zero-node/error files, and only then become scan-level errors.
- Per-file parser errors also suppress candidate-manifest recording for the whole scan. That links Issue D back to Issue B: parser crashes can keep the graph stale even when the scan otherwise updates persisted state.
- Live `code_files.parse_health` is not reliable enough to recover the native OOB set because it lacks the error message and can mark files as `error` even when the current parser now parses them cleanly.

## OPEN QUESTIONS
- Which exact 10 files hit `memory access out of bounds` in the native trial? The archived `trial-log.jsonl` and raw JSON do not contain filenames.
- Did the native trial run against a different file snapshot than the current workspace, or did the parser/WASM runtime enter a state that the fresh read-only probe did not reproduce?
- Should parser backend runtime exceptions fail the scan, skip persistence for only affected files, or persist a degraded diagnostic row while preserving the last successful nodes/edges?
- Should `code_graph_scan` return a dedicated `parserDiagnostics` array instead of overloading the top-level `errors` list and truncating it to 10 entries?
