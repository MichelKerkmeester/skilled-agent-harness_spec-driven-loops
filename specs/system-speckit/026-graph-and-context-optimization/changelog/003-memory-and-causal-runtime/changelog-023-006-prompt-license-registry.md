---
title: "023A2 Prompt License Registry: Typed Accessors and Startup Validation"
description: "CocoIndex embedder and reranker prompt and license metadata promoted to first-class registry fields with typed accessors, a public import facade and validation at daemon startup and ccc doctor."
trigger_phrases:
  - "023A2 prompt license registry"
  - "cocoindex registry accessors"
  - "embedder reranker typed accessors"
  - "registry validate daemon startup"
  - "ccc doctor registry check"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

Prior to 023A2, CocoIndex consumers had to navigate optional helper objects or inline metadata dicts to read prompt names and license strings. The registry lacked a single stable access path, which weakened the fingerprint contract established in 023A1 and the license policy added in 023D.

023A2 makes `registered_embedders.py` the authoritative data owner and adds `registry.py` as a public facade. Embedder specs now carry `query_prompt_name` and `document_prompt_name` as dataclass fields. Seven typed accessors (`embedder_for`, `reranker_for`, `embed_query_prompt`, `embed_document_prompt`, `embedder_license`, `rerank_license`, `validate_registry`) give CLI, daemon, config, fingerprint and test code a single import path. Registry validation runs at daemon startup and inside `ccc doctor` so broken metadata surfaces at operator and startup boundaries rather than at inference time.

Four open findings from the 023-arc investigation were closed: prompt names became first-class registry fields (HIGH FINDING-006-A), fixed dims stayed stable (MED FINDING-016-A), the registry self-test reinforces the pipeline-before-model discipline from ADR-026 (MED FINDING-018-C) and the 023D doctor path was preserved with the registry check separate (MED FINDING-002-C).

### Added

- `query_prompt_name` and `document_prompt_name` dataclass fields on `EmbedderSpec`
- `EmbedderSpec` and `RerankerSpec` type aliases exported from `cocoindex_code.registry`
- Seven typed accessor functions for embedder lookup, reranker lookup, prompt resolution, license reads and registry validation
- `cocoindex_code/registry.py` public facade for stable consumer imports (NEW)
- `tests/test_registry_accessors.py` covering accessor typing, field completeness, duplicate prompt registry absence and unknown model error hints (NEW)
- Registry-contract check in `ccc doctor` before model-license checks

### Changed

- `shared.py` prompt resolution now delegates to `embed_query_prompt()` and `embed_document_prompt()` after env overrides, replacing inline dict reads
- `config.py` registered-model and commercial-safe profile reads now route through typed accessors
- `daemon.py` startup now calls `validate_registry()` before serving requests
- `index_metadata.py` reranker fingerprint license reads through `rerank_license()`
- `observability.py` compatibility wrapper reads reranker license through `rerank_license()`
- `tests/test_doctor.py` JSON check count updated to account for the registry-contract doctor check

### Fixed

- Prompt and license metadata had no single stable access path. Typed accessors and the `registry.py` facade resolved the weak contract.
- Unknown model names produced unguided lookup failures. Accessors now raise `KeyError` with a registered-name hint.
- Duplicate `_QUERY_PROMPT_MODELS` source registries could silently diverge. Tests now assert no competing registry exists in the source tree.

### Verification

| Check | Result |
|-------|--------|
| `pytest tests/test_registry_accessors.py tests/test_prompt_policy_contract.py tests/test_embedder_license.py tests/test_doctor.py -q` | PASS. 18 passed in 1.51s |
| `pytest tests/ -q` | PASS. 216 passed in 17.84s |
| `ruff check` | PASS. All checks passed |
| `verify_alignment_drift.py --root mcp_server` | PASS. 0 errors. Existing warnings are shebang/docstring alignment warnings outside this packet scope |
| `validate.sh --strict` | PASS. 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `cocoindex_code/registered_embedders.py` | Modified | First-class prompt fields, `EmbedderSpec`/`RerankerSpec` aliases, typed accessors and registry self-test added. |
| `cocoindex_code/registry.py` | Created (NEW) | Public registry facade for clean consumer imports. |
| `cocoindex_code/shared.py` | Modified | Prompt resolution delegates to registry prompt accessors after env overrides. |
| `cocoindex_code/config.py` | Modified | Registered-model and commercial-safe profile reads route through typed accessors. |
| `cocoindex_code/cli.py` | Modified | `ccc doctor` includes registry-contract check and uses typed license accessors. |
| `cocoindex_code/daemon.py` | Modified | Startup calls `validate_registry()` before serving requests. |
| `cocoindex_code/index_metadata.py` | Modified | Reranker fingerprint license reads through `rerank_license()`. |
| `cocoindex_code/observability.py` | Modified | Compatibility wrapper reads reranker license through `rerank_license()`. |
| `tests/test_registry_accessors.py` | Created (NEW) | Accessor typing, field completeness, duplicate registry absence and unknown model hints covered. |
| `tests/test_doctor.py` | Modified | JSON check count updated for the registry-contract doctor check. |

### Follow-Ups

- Stale generated copies may remain in `build/lib`. The source-level duplicate prompt registry test intentionally ignores build output. A clean build or `build/lib` purge would remove the stale copies.
- Unknown custom models still bypass registry policy in compatibility paths that previously tolerated unknown models. A follow-on packet could extend accessor coverage to those paths with an explicit allow-list pattern.
- No git commit was created for the implementation per a user constraint. The changes are reflected in commit `263e669a26` which consolidated them with prior session work.
