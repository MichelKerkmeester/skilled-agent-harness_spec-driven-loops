# Iteration 8 — CocoIndex / Code Graph / Memory Seed Contract Consistency

## METADATA
- Iteration: 8 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 7 — CocoIndex / code_graph / memory seed contract consistency

## INVESTIGATION
Read the deep-research charter, all prior on-disk iterations (`iteration-001.md` through `iteration-006.md`; `iteration-007.md` was not present), the native-rerun synthesis, and the native-rerun trial log.

Traced the seed/result contracts across:

- CocoIndex docs and MCP implementation: `.opencode/skills/mcp-coco-index/references/tool_reference.md`, `mcp_server/cocoindex_code/server.py`, and `mcp_server/cocoindex_code/protocol.py`.
- Code graph seed ingestion: `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts`, `code_graph/lib/seed-resolver.ts`, and `schemas/tool-input-schemas.ts`.
- Memory search result/calibration surface: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`, `lib/search/cocoindex-calibration.ts`, and pipeline row types/tests.

The focus was field-name compatibility (`file` / `filePath` / `file_path`, `range` / `startLine` / `start_line`), line-range conventions, and provider/source tags across handoff boundaries.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:240` — `code_graph_context` does not accept the live CocoIndex MCP result shape as a raw seed. The handler looks for `seed.file ?? seed.filePath`, and then for `seed.range` or camelCase `startLine` / `endLine`; the actual CocoIndex MCP model emits `file_path`, `start_line`, `end_line`, and `content`. Passing a raw CocoIndex result with `provider:"cocoindex"` therefore fails the CocoIndex branch and falls through to an empty generic seed path. Recommended remediation: accept and normalize `file_path`, `start_line`, `end_line`, and `content` in the code graph seed schema and handler, with regression coverage that pipes an actual `search` result into `code_graph_context`.
- P1 `.opencode/skills/mcp-coco-index/references/tool_reference.md:266` — the CocoIndex tool reference documents MCP results as `file` plus `lines`, but the checked-in MCP implementation and protocol expose `file_path`, `start_line`, and `end_line`. This stale documentation encourages callers to build the wrong seed adapter and also conflicts with the code graph handler's partial support for `file` / `range`. Recommended remediation: update the tool reference and examples to the live snake_case shape, or introduce a documented canonical adapter that converts CocoIndex results to `{provider:"cocoindex", file, range, score, snippet}` before code graph ingestion.
- P2 `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177` — the memory search decision envelope marks `cocoIndex.available: true` unconditionally and derives `cocoindexCalibration` from memory pipeline rows by mapping `file_path` / `filePath` and `contextType` / `context_type`, not from actual CocoIndex result fields such as `path_class` or `raw_score`. This makes memory-search telemetry look like a CocoIndex seed contract even when no CocoIndex rows were involved. Recommended remediation: gate `cocoIndex.available` and calibration on actual CocoIndex channel evidence, and preserve real CocoIndex field names when they exist.

## EVIDENCE
Native rerun context:

```text
../002-native-rerun/synthesis-report-native-rerun.md: code graph downgraded to OVERHEAD after successful broad scan, drift-blocked reads, zero-node persistence, and failed recovery.
../002-native-rerun/trials/trial-log.jsonl: N-CG-001 first scan with includeSkills:true returned 56,843 nodes; N-CG-002..004 read paths blocked; N-CG-005..007 zero-node scans persisted.
```

CocoIndex live MCP output shape:

```text
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:45-50 defines CodeChunkResult as file_path, language, content, start_line, end_line, score.
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:152-165 maps daemon results into file_path/start_line/end_line/raw_score/path_class/rankingSignals.
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:95-104 defines the same daemon SearchResult fields: file_path, content, start_line, end_line, raw_score, path_class, rankingSignals.
```

CocoIndex docs conflict with that live shape:

```text
.opencode/skills/mcp-coco-index/references/tool_reference.md:266-273 says each MCP result contains file, lines, snippet, score, language, plus fork telemetry.
.opencode/skills/mcp-coco-index/references/tool_reference.md:415-423 example uses file and lines, then source_realpath/content_hash/path_class/raw_score.
```

Code graph seed contract:

```text
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:514-543 accepts filePath, startLine, endLine, file, range, score, snippet, rawScore/raw_score, pathClass/path_class, and rankingSignals; it does not accept file_path, start_line, end_line, or content.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:16-40 declares the same seed fields, again missing file_path/start_line/end_line/content.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:240-262 converts CocoIndex seeds only from file/filePath plus range/startLine/endLine.
.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:291-297 generic fallback also ignores file_path/start_line/end_line.
.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:20-24 models native CocoIndex seeds as file plus range, not the live MCP response shape.
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:215-238 covers the file/range shape.
.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts:298-319 covers filePath/range, but no test covers raw file_path/start_line/end_line.
```

Memory search / calibration surface:

```text
.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187-221 memory_search accepts query/concepts/anchors and retrieval controls, but no structured code seed payload.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1145-1162 builds cocoindexCalibration from pipelineResult.results, mapping file_path/filePath and contextType/context_type.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177-1180 sets trustTreeInput.cocoIndex.available=true and chooses a pathClass from calibration counts.
.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:5-12 accepts file/filePath/path and pathClass, not file_path/path_class.
.opencode/skills/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:130-132 normalizes candidate paths from filePath, file, then path.
```

## NEW INSIGHTS
- The most dangerous seed mismatch is not `file` vs `filePath`; the checked-in tests already cover those. The untested gap is raw CocoIndex MCP output: `file_path`, `start_line`, `end_line`, and `content`.
- `code_graph_context` has fork-telemetry compatibility for `raw_score` and `path_class`, but lacks equivalent compatibility for the core location fields. The optional metadata path is more tolerant than the fields required for anchor resolution.
- The mcp-coco-index reference appears to describe an older or adapter-shaped result contract (`file` / `lines`) while the live server/protocol use snake_case fields.
- `memory_search` does not currently expose a structured seed input comparable to `code_graph_context.seeds`; its CocoIndex-labeled telemetry is derived from memory pipeline rows, so it should not be treated as evidence that actual CocoIndex seed ingestion is working.

## OPEN QUESTIONS
- Was `iteration-007.md` intentionally omitted, or did a prior executor fail to write it? It was not present in `research/iterations/` during this iteration.
- Should the canonical cross-system seed shape be the live CocoIndex MCP shape (`file_path`, `start_line`, `end_line`) or the code graph adapter shape (`file`, `range`)?
- Should `memory_search` ever accept structured code seeds, or should code seeds remain exclusively a `code_graph_context` concern?
- Should provider tags distinguish `source:"semantic-search"` from `provider:"cocoindex"` more strictly so channel attribution and seed provenance cannot drift?
