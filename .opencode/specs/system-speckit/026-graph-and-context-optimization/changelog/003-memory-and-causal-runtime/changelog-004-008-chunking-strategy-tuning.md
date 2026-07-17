---
title: "Code Index Stack Phase 008: Chunking Strategy Tuning"
description: "Stage A chunking defaults tuned for the mcp-coco-index cocoindex pipeline. CHUNK_SIZE raised from 1000 to 1500, CHUNK_OVERLAP raised from 150 to 200 and three bounded environment overrides added. Six new test cases validate the config path. Stage B and tree-sitter integration deferred pending benchmark confirmation."
trigger_phrases:
  - "chunking strategy tuning"
  - "cocoindex chunk size"
  - "COCOINDEX_CODE_CHUNK_SIZE"
  - "chunk overlap env override"
  - "stage A chunking defaults"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/008-chunking-strategy-tuning`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The cocoindex pipeline hard-coded CHUNK_SIZE=1000 and CHUNK_OVERLAP=150 with no runtime override path. At 741-char average chunk size the corpus was well below the 512-1024 token optimum confirmed by Wu et al. 2026 and NVIDIA 2024. Operators had no way to tune chunking without editing source.

A 3-iteration deep-research phase (cli-devin SWE-1.6 and Kimi-k2.6) converged on conservative Stage A defaults: raise CHUNK_SIZE to 1500 chars and CHUNK_OVERLAP to 200. The research estimated a 4-6 percentage-point lift on the 18-pair retrieval fixture. Stage A shipped in commit `e0560b0a96`.

`config.py` gained a `_parse_int_env` helper mirroring the existing warn-on-invalid pattern. Three bounded environment variables now allow operators to override chunk parameters at runtime. `indexer.py` now reads chunk params from the Config object. Six new test cases cover defaults, env overrides, invalid-input fallback and out-of-bounds parametrized cases.

Stage B (raise to 2000 chars, per-language overrides) and cAST/tree-sitter integration were deferred pending the Stage A reindex benchmark.

### Added

- `_parse_int_env(var, default, min, max)` helper in `config.py` with warn-on-invalid fallback
- `COCOINDEX_CODE_CHUNK_SIZE` environment override (bounded 100..8000)
- `COCOINDEX_CODE_CHUNK_OVERLAP` environment override (bounded 0..1000)
- `COCOINDEX_CODE_MIN_CHUNK_SIZE` environment override (bounded 50..1000)
- Three new Config fields: `chunk_size`, `chunk_overlap`, `min_chunk_size` loaded via `Config.from_env()`
- `TestChunkConfigValidation` class in `test_config.py` with 6 cases covering defaults, env override, invalid fallback, out-of-bounds (99 and 8001) and min_chunk_size validation

### Changed

- `CHUNK_SIZE` default raised from 1000 to 1500 chars
- `CHUNK_OVERLAP` default raised from 150 to 200 chars
- `indexer.py` `RecursiveSplitter.split()` call now reads `config.chunk_size`, `config.chunk_overlap` and `config.min_chunk_size` rather than module-level constants

### Fixed

- None.

### Verification

- Config smoke check: `python -c "import cocoindex_code.config as c; cfg = c.Config.from_env(); print(f'chunk_size={cfg.chunk_size}, overlap={cfg.chunk_overlap}, min={cfg.min_chunk_size}')"` returned `chunk_size=1500, overlap=200, min=250` (PASS).
- Targeted pytest run: `.venv/bin/python -m pytest tests/test_config.py -v` reported 16 passed (PASS).
- Alignment drift check: `verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server` returned 0 errors, 18 warnings (existing package-wide policy findings unrelated to this change) (PASS).
- Strict spec validation: `validate.sh ... --strict` reported 0 errors and 0 warnings (PASS).

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | New `_parse_int_env` helper. Three `COCOINDEX_CODE_CHUNK_*` env vars with bounded validation. Three new Config fields. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modified | CHUNK_SIZE 1000 to 1500, CHUNK_OVERLAP 150 to 200. Splitter call reads from Config rather than module constants. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | New `TestChunkConfigValidation` class with 6 test cases. Total suite 16 passing. |

Note: The `mcp-coco-index` skill was subsequently removed in a later packet (`chore(014/005): remove mcp-coco-index skill`). File paths reflect the state at time of shipping commit `e0560b0a96`.

### Follow-Ups

- Run the 18-pair fixture reindex benchmark with Stage A defaults to measure actual hit-rate lift before deciding on Stage B.
- Implement Stage B (CHUNK_SIZE 2000, per-language overrides TS=2000, MD=800, Python=1500) if Stage A benchmark confirms the estimated lift.
- Evaluate cAST/tree-sitter integration in a follow-on packet once Stage A lift is validated.
