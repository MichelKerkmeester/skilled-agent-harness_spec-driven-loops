---
title: "Summary: 016/004/014 Mirror Dedup with Canonical Preference"
description: "Implementation summary for CocoIndex mirror-aware hybrid dedup, canonical mirror config, pure path helpers, tests, corrected bench evidence, ADR-017, README, and packet validation."
trigger_phrases: ["016/004/014 summary", "mirror dedup summary", "canonical mirror summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference"
    last_updated_at: "2026-05-19T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified mirror dedup"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py"
      - "evidence/phase2-comparison-014-dedup.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004014"
      session_id: "016-004-014-summary"
      parent_session_id: "016-004-014"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Summary: 016/004/014 Mirror Dedup with Canonical Preference

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | COMPLETE |
| Completed | 2026-05-19 |
| Level | 2 |
| Scope | CocoIndex config, path helpers, hybrid dedup, tests, bench evidence, ADR/README/spec docs |
| SpawnAgent | Not used |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

CocoIndex now collapses runtime mirror aliases before the rerank window is consumed. The new pass prefers `.opencode/` by default, keeps the first ranked mirror when the canonical copy is absent, and can be disabled by setting `COCOINDEX_MIRROR_PREFIXES='[]'`.

### Config And Helpers

`config.py` now exposes:

| Setting | Default | Behavior |
|---|---|---|
| `COCOINDEX_CANONICAL_MIRROR` | `.opencode` | Normalized internally to `.opencode/`; empty values warn and fall back |
| `COCOINDEX_MIRROR_PREFIXES` | `[".opencode/", ".codex/", ".gemini/", ".claude/"]` | JSON list, normalized with trailing slashes; `[]` disables mirror collapse |

`path_utils.py` provides `extract_path_stem`, `is_mirror_path`, and `select_canonical_mirror_copy` as pure helper functions.

### Query Integration

`_dedup_and_rank_hybrid_rows()` now has two passes:

1. Mirror collapse keyed by path stem plus content hash and line range.
2. Existing source-realpath/content-hash plus line-range dedup.

The path-stem plus content-hash/line-range grouping is deliberate: it collapses duplicate mirror chunks without dropping distinct chunks from the same mirrored file, and it does not depend on source-realpath consistency across future indexes.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Add canonical mirror and mirror-prefix env config |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py` | Created | Pure mirror path helper module |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Add mirror-collapse pass before existing hybrid dedup |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_path_utils.py` | Created | Helper unit tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py` | Created | Hybrid dedup integration tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Mirror config tests |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md` | Modified | Document mirror dedup behavior and helper module |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Append ADR-017 |
| `spec.md` | Modified | Update continuity/status metadata after implementation |
| `plan.md` | Created | L2 implementation plan |
| `tasks.md` | Created | Task ledger |
| `checklist.md` | Created | Verification checklist |
| `implementation-summary.md` | Created | Completion summary and handoff |
| `description.json` | Created | Spec memory metadata |
| `graph-metadata.json` | Created | Spec graph metadata |
| `evidence/phase2-comparison-014-dedup.md` | Created | Corrected bench output |
| `evidence/phase2-comparison-013-vs-014-delta.md` | Created | Baseline-vs-014 delta |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The implementation stayed embedder-agnostic and reranker-agnostic. It operates only on candidate file paths and existing chunk identity keys. No `ccc reset`, `ccc index`, git commit, or SpawnAgent was used.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Put helpers in `path_utils.py` | Downstream packets can reuse stem logic without importing `indexer.py` |
| Normalize mirror prefixes with trailing slash | Avoid prefix ambiguity and keep startswith checks cheap |
| Preserve `COCOINDEX_MIRROR_PREFIXES='[]'` | Gives operators a clean runtime rollback |
| Group mirror collapse by path stem plus content hash and line range | Avoids collapsing distinct chunks from the same file and tolerates mirror-specific realpaths |
| Prefer canonical copy even if ranked lower than an alias | Human-facing results should point at the source-of-truth mirror |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|---|---|
| Sequential-thinking MCP | Attempted 5 times; tool returned `user cancelled MCP tool call` each time |
| SpawnAgent | PASS: not used |
| Targeted pytest | PASS: `39 passed` |
| Full MCP server pytest | PASS: `104 passed` |
| Corrected bench rerun | PASS: baseline-bge `14/18`, bge-path-class `14/18`, jina-v3 `14/18` |
| Probe regression check | PASS: no hit/miss deltas versus 013 corrected baseline |
| Latency gate | PASS: retained rerun p95 deltas are -14.53%, -4.26%, -5.69% |
| Strict validation | PASS: `validate.sh --strict` returned `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Sequential-thinking MCP did not execute successfully.** Five required calls were made before edits, but each returned `user cancelled MCP tool call`. This is recorded instead of fabricated as success.
2. **Rerank-score JSONL files were empty in the retained bench run.** The bench comparison and result JSONL files were produced correctly; mirror-collapse behavior is demonstrated by targeted integration tests rather than rerank-score rows.

## Commit Handoff

No git commit was made. Intended commit scope:

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/path_utils.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/README.md`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_path_utils.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_dedup_mirrors.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/description.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/graph-metadata.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/evidence/phase2-comparison-014-dedup.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/evidence/phase2-comparison-013-vs-014-delta.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/baseline-bge-014-dedup.results.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/bge-path-class-014-dedup.results.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/jina-v3-014-dedup.results.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/*-014-dedup.rerank-scores.jsonl`
<!-- /ANCHOR:limitations -->
