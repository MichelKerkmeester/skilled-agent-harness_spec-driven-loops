---
title: "023D Doctor Model Swap UX"
description: "ccc doctor command shipped: six operator-facing health checks cover stale CLI installs, non-commercial reranker licenses, fingerprint drift plus model-swap reindex cost in text and JSON output."
trigger_phrases:
  - "ccc doctor"
  - "doctor model swap ux"
  - "commercial safe profile"
  - "reranker license governance"
  - "reindex cost estimator"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

CocoIndex operators had no single preflight for three high-trust failure modes: a stale global `ccc` install, non-commercial default reranker licensing plus expensive model-swap reindexing. The default reranker was empirically strong but licensed CC BY-NC 4.0, creating silent commercial risk for operators who assumed Apache-licensed project code meant unrestricted model use.

`ccc doctor` was added with six PASS/WARN/FAIL/INFO checks and JSON output. The model registry now carries license and `commercial_safe` metadata for all embedders and rerankers. `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` refuses non-commercial models at config load with a structured error and suggests a registered Apache-2.0 alternative. The reindex estimator surfaces swap cost from chunk count before an operator commits to a full reindex.

Nine research findings from the 023 deep-research arc (008-A, 008-B, 008-C, 010-C, 012-A, 012-B, 018-A, 018-B, 018-C) were closed. All six doctor checks pass the 210-test suite without regressions.

### Added

- `ccc doctor` command with six health checks (stale CLI resolution, sentence-transformers freshness, active model licenses, commercial-safe enforcement, fingerprint drift plus model-swap reindex cost estimate) in text and JSON output
- License and `commercial_safe` metadata for embedder and reranker registry entries in `registered_embedders.py`
- Reranker registry covering Jina v3 (CC BY-NC 4.0) and BGE reranker (Apache-2.0) with safe-alternative mapping
- `COCOINDEX_COMMERCIAL_SAFE_PROFILE` environment variable enforcement at config load, raising a structured error and recommending `BAAI/bge-reranker-v2-m3`
- `test_doctor.py` (NEW) covering doctor rc=0/1/2, JSON shape, config refusal plus reindex estimator
- `test_embedder_license.py` (NEW) covering license completeness and Jina v3 non-commercial marking
- ADR-024, ADR-025 plus ADR-026 appended to the bake-off decision record for license governance, reranker criteria plus pipeline-before-model discipline

### Changed

- `registered_embedders.py` extended with license metadata, commercial-safe derivation, reranker registry plus safe-alternative fields
- `index_metadata.py` updated to consume reranker registry license metadata for fingerprint construction
- `observability.py` updated to preserve compatibility wrappers while delegating index metadata to the shared registry

### Fixed

- Operators had no visibility into stale global `ccc` resolving outside the venv without tree-sitter. Doctor reports FAIL for this case.
- Default `jinaai/jina-reranker-v3` CC BY-NC 4.0 license was not surfaced to operators. Doctor reports WARN and commercial-safe profile raises a structured config error.
- Fingerprint drift after a model swap was not surfaced before a reindex. Doctor reports fingerprint status and estimates reindex cost.

### Verification

| Check | Result |
|-------|--------|
| `pytest tests/test_doctor.py tests/test_embedder_license.py tests/test_registered_embedders.py tests/test_fingerprint.py -q` | PASS, 24 passed |
| `pytest tests/test_config.py -q` | PASS, 35 passed |
| `ruff check cocoindex_code/ tests/test_doctor.py tests/test_embedder_license.py` | PASS, all checks passed |
| `.venv/bin/ccc doctor --json` | PASS for structured output. rc=2 intentional: stale `/opt/homebrew/bin/ccc` and CC BY-NC default reranker warning detected. |
| `pytest tests/ -q` | PASS, 210 passed |
| `ruff check cocoindex_code/ tests/` | PASS, all checks passed |
| `validate.sh --strict` | PASS, 0 errors and 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | Added `doctor` command with structured check results, JSON output, exit-code mapping plus reindex estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modified | Added license metadata, commercial-safe derivation, reranker registry plus safe-alternative fields. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Added `COCOINDEX_COMMERCIAL_SAFE_PROFILE` and structured refusal for unsafe active models. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` | Modified | Reused reranker registry license metadata in fingerprint construction. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modified | Preserved compatibility wrappers while delegating index metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_doctor.py` | Created (NEW) | Covered doctor rc=0/1/2, JSON shape, config refusal plus reindex estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_embedder_license.py` | Created (NEW) | Covered license completeness and Jina v3 non-commercial marking. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Added ADR-024, ADR-025 plus ADR-026. |

### Follow-Ups

- PyPI freshness is network-dependent. Doctor returns INFO if PyPI latest cannot be fetched.
- Fingerprint status is daemon-dependent. Doctor returns INFO when the daemon status payload lacks the 023C fingerprint but still estimates reindex cost from local metadata when possible.
- Default Jina v3 remains non-commercial. That is intentional from ADR-021 quality evidence. Commercial deployments should enable `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` or set `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3`.
