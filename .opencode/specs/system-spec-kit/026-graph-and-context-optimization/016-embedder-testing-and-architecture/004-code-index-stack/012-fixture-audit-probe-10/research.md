---
title: "Research: 016/004/012 Code Retrieval Fixture Expected-Path Audit"
description: "Peer review of all 18 code-retrieval fixture expected_source_path values, with probe 10 and universal-ceiling probes prioritized."
trigger_phrases:
  - "fixture audit probe 10 research"
  - "code retrieval fixture expected path audit"
  - "universal ceiling probe audit"
importance_tier: "important"
contextType: "research"
---

# Research: 016/004/012 Code Retrieval Fixture Expected-Path Audit

<!-- ANCHOR:overview -->
## 1. Overview

Audited the 18-pair fixture at `../002-baseline-fixture/evidence/code-retrieval-fixture.json` against the live source tree and the May 18 rerank failure analysis at `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md`. Method: read every `expected_source_path`, inspect the expected symbol area or relevant implementation region, and use targeted `rg` searches for plausible source, test, doc, and mirror alternatives.

Verdict counts: KEEP 16, CHANGE 1, AMBIGUOUS 1. Recommendation: update probe 10 from generated dist JavaScript to tracked TypeScript source; leave the remaining paths unchanged until probe 18's query wording or target intent is clarified.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:verdict-table -->
## 2. Verdict Table

| Probe | Priority | Query short form | Current expected_source_path | Verdict | Proposed path |
|---:|---|---|---|---|---|
| 1 | Universal ceiling | embedding backend registry | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | KEEP | - |
| 2 | Other | embedder_set queues reindex | `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts` | KEEP | - |
| 3 | Other | CocoIndex default local code embedder config | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | KEEP | - |
| 4 | Other | strict recursive spec validator | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | KEEP | - |
| 5 | Other | readiness snapshot Vitest coverage | `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts` | KEEP | - |
| 6 | Universal ceiling | Ollama adapter with query/document prefixes | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | KEEP | - |
| 7 | Other | stage 2 fusion scoring point | `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | KEEP | - |
| 8 | Other | CocoIndex readiness probe | `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts` | KEEP | - |
| 9 | Other | vetted code-search embedders registry | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | KEEP | - |
| 10 | Probe 10 | context save command with structured JSON + graph metadata | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | CHANGE | `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` |
| 11 | Universal ceiling | Apple Silicon CUDA -> MPS device fallback | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | KEEP | - |
| 12 | Universal ceiling | retrieval rescue sibling promotion | `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts` | KEEP | - |
| 13 | Other | structural context token budget allocation | `.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts` | KEEP | - |
| 14 | Other | structural symbol/import-edge walker | `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | KEEP | - |
| 15 | Universal ceiling | implementation path-class ranking boost | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | KEEP | - |
| 16 | Other | atomic readiness marker partial-write tests | `.opencode/skills/system-code-graph/mcp_server/tests/readiness-marker-atomic-write.vitest.ts` | KEEP | - |
| 17 | Other | canonical resource matcher bypasses hidden exclusions | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | KEEP | - |
| 18 | Other | refresh/incremental reprocessing integration test | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_refresh_split.py` | AMBIGUOUS | - |
<!-- /ANCHOR:verdict-table -->

<!-- ANCHOR:probe-rationale -->
## 3. Per-Probe Rationale

1. KEEP. `registry.ts` defines the mk-spec-memory `MANIFESTS` list with `dim`, `backend`, and `notes`, and exposes `listManifests()`, so it directly answers the backend-registry wording. The strongest alternative, `mcp-coco-index/.../registered_embedders.py`, is covered separately by probe 9 and is about CocoIndex code-search candidates rather than backend adapters.

2. KEEP. `embedder-set.ts` validates the provided name with `getManifest()`, creates the dimension table, and calls `startReindex({ toName: manifest.name })`; this is exactly the handler described by the query. No clearer source path surfaced.

3. KEEP. `config.py` owns `_DEFAULT_MODEL` and `Config.from_env()`, including env override handling for `COCOINDEX_CODE_EMBEDDING_MODEL`. `tests/test_config.py` is lexical-heavy, but the fixture asks for configuration logic, not coverage.

4. KEEP. `validate.sh` parses `--strict`, `--recursive`, and folder arguments in `parse_args()` and owns the spec-folder validator entrypoint. No alternate shell script matches both strict mode and recursive phase support as directly.

5. KEEP. `code-graph-status-readiness-snapshot.vitest.ts` explicitly covers fresh, empty, broad-stale, bounded-stale, and side-effect-free status behavior. That is a better match than the status handler because the query asks for Vitest coverage.

6. KEEP. `ollama.ts` constructs `OllamaAdapter`, maps manifest prefix fields, and applies query/document prefixes in `applyPrefix()` before the POST body is built. `embedder-ollama.vitest.ts` describes the prefix behavior more literally, but it is test coverage, not the implementation.

7. KEEP. `stage2-fusion.ts` is still the single scoring-stage file that applies recency, graph, feedback, artifact routing, validation scoring, and retrieval rescue before deterministic sorting. Side finding: the fixture's `expected_symbol` is stale (`executeStage2Fusion` is now `executeStage2`), but the source path remains correct.

8. KEEP. `ccc-readiness-probe.ts` checks the configured `ccc` binary, `.cocoindex_code` existence, and staleness, then maps the state to canonical readiness/trust vocabulary. That matches "fresh or absent" better than downstream status consumers.

9. KEEP. `registered_embedders.py` is the declarative CocoIndex code-search embedder registry, with frozen metadata rows, dimensions, model-card URLs, and operator notes. It is the clearest path for the "vetted sentence transformer candidates" query.

10. CHANGE. Both `.js` and `.ts` currently exist in this workspace, but the `.js` path is generated dist while `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` is the tracked implementation that parses `--stdin`/`--json`, loads structured JSON, calls `runWorkflow()`, and refreshes graph metadata via `updatePhaseParentPointersAfterSave()`. For a code-retrieval benchmark, the source file is the better expected answer; keeping the generated artifact measures path-class bias instead of retrieval quality.

11. KEEP. `config.py` implements `_resolve_device()` with the CUDA -> MPS -> CPU order and an env override gate. `tests/test_config.py` verifies the Apple Silicon branch, but the source path is the implementation a developer would want.

12. KEEP. `retrieval-rescue.ts` implements same-folder sibling expansion through `fetchSiblingRows()`, lexical backfill, and `applyRetrievalRescueLayer()`. The embedder-pluggability reference explains the feature, but the query asks for the recovery path rather than the architecture narrative.

13. KEEP. `budget-allocator.ts` exports `allocateBudget()` and `createDefaultSources()`, with floor allocation, overflow redistribution, and deterministic cap trimming. No other code-graph file owns bounded context budget allocation this directly.

14. KEEP. `structural-indexer.ts` is the filesystem/code parser that extracts symbols and emits `CodeNode`/`CodeEdge` structures through `indexFiles()`. Side finding: the fixture's `expected_symbol` is stale (`StructuralIndexer` no longer exists), but the file is still the right source path.

15. KEEP. `query.py` applies query-time `implementation_boost`, doc/spec penalties, canonical boosts, and ranking signals inside `_ranked_result()` and `_hybrid_ranked_result()`. `indexer.py` classifies generated paths, and `tool_reference.md` documents the telemetry, but neither is the query-time adjustment point.

16. KEEP. `readiness-marker-atomic-write.vitest.ts` mocks `renameSync` failure, asserts temp cleanup, and checks traversal rejection. That is the exact partial-write atomic-readiness-marker coverage requested.

17. KEEP. `indexer.py` defines `CanonicalResourceMatcher`, whose `is_dir_included()` and `is_file_included()` let canonical resources bypass hidden-directory exclusions. This is a direct implementation match.

18. AMBIGUOUS. `test_refresh_split.py` tests MCP `refresh_index` behavior and the explicit `cocoindex_refresh_index` tool, but it does not prove "only changed files" are reprocessed. The closer integration-style alternative is `.opencode/skills/mcp-coco-index/tests/test_e2e.py` (`test_session_incremental_index`), yet that also proves "add new file -> re-index -> search finds it" rather than only-changed-file accounting; the query should be clarified before moving this fixture target.
<!-- /ANCHOR:probe-rationale -->

<!-- ANCHOR:recommendation -->
## 4. Recommendation

Apply the proposed fixture update for probe 10 only:

- `expected_source_path`: `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`
- `expected_symbol`: leave as `HELP_TEXT` if the fixture is strictly path-focused; the symbol exists in the TypeScript source.

Do not update probe 18 yet. If the intended target is "MCP refresh/search split", the current path is acceptable but the query should drop "only changed files". If the intended target is "incremental index after changes", change the query/target pair in a follow-on packet rather than silently changing only the path.
<!-- /ANCHOR:recommendation -->

<!-- ANCHOR:evidence -->
## 5. Evidence

Evidence files and checks:

- Original fixture: `../002-baseline-fixture/evidence/code-retrieval-fixture.json`
- May 18 failure-mode analysis: `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md`
- Proposed fixture copy: `evidence/code-retrieval-fixture-proposed.json`
- Baseline fixture validation was run against the current workspace and passed: `bash ../002-baseline-fixture/evidence/fixture-validate.sh`
- Targeted audit commands used `rg`, `sed`, `find`, `jq`, and `node`; no `ccc` invocation and no `SpawnAgent`.
<!-- /ANCHOR:evidence -->
