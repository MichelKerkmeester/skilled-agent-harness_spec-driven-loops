---
title: "Implementation Summary: 023D Doctor Model Swap UX"
description: "CocoIndex now exposes stale CLI installs, non-commercial model defaults, fingerprint drift, and model-swap reindex cost through `ccc doctor`."
trigger_phrases:
  - "implementation summary"
  - "ccc doctor"
  - "023D"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
    last_updated_at: "2026-05-19T20:36:58Z"
    last_updated_by: "codex"
    recent_action: "summarized"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
    session_dedup:
      fingerprint: "sha256:023d000000000000000000000000000000000000000000000000000000000004"
      session_id: "023-deep-research-arc-blind-spots/005-doctor-model-swap-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/005-doctor-model-swap-ux` |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

CocoIndex now has an operator-facing `ccc doctor` command that makes the risky parts visible before an operator pays for a reindex or trusts search results. It reports stale global CLI resolution, sentence-transformers freshness, active model licenses, commercial-safe failures, fingerprint drift, and model-swap cost in both text and JSON.

### Doctor Command

`ccc doctor` runs six checks and exits with rc=0 for PASS/INFO only, rc=1 for any WARN, and rc=2 for any FAIL. On this machine the real command correctly reports FAIL for the stale global `/opt/homebrew/bin/ccc`, WARN for the default `jinaai/jina-reranker-v3` CC BY-NC 4.0 license, INFO for missing daemon fingerprint exposure, and PASS for the current embedder and reindex estimate.

### License Governance

The model registry now carries license and commercial-safe metadata for embedders and rerankers. `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` refuses non-commercial-safe active models at config load with a structured error and a registered Apache-2.0 reranker alternative.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | Added `doctor`, structured check results, JSON output, exit-code mapping, and reindex estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modified | Added license metadata, commercial-safe derivation, reranker registry, and safe alternatives. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Added `COCOINDEX_COMMERCIAL_SAFE_PROFILE` and structured refusal for unsafe active models. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` | Modified | Reused reranker registry license metadata in fingerprint construction. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modified | Preserved compatibility wrappers while delegating index metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_doctor.py` | Created | Covered doctor rc=0/1/2, JSON shape, config refusal, and reindex estimator. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_embedder_license.py` | Created | Covered license completeness and Jina v3 non-commercial marking. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | Added ADR-024, ADR-025, and ADR-026. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the CocoIndex CLI/config/registry/fingerprint surfaces and the pre-bound 023D packet. HuggingFace license lookups verified the registry annotations: Jina v3 and Salesforce SFR are CC BY-NC 4.0, BGE reranker and BGE code embedder are Apache-2.0, Nomic CodeRankEmbed is MIT, and Jina v2 embedders are Apache-2.0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep license policy in `registered_embedders.py` | Registry metadata is the shared source for CLI, config, and fingerprint consumers. |
| Treat only Apache-2.0, MIT, and BSD prefixes as commercial-safe | This avoids silently blessing custom or non-commercial licenses. |
| Let doctor return INFO when daemon or PyPI data is unavailable | Doctor should still be useful offline and before daemon startup. |
| Keep default Jina v3 but warn unless commercial-safe profile is enabled | This preserves the empirical 018 quality decision while making commercial risk explicit. |

### Findings Closed

008-A, 008-B, 008-C, 010-C, 012-A, 012-B, 018-A, 018-B, and 018-C are closed by the doctor checks, registry metadata, profile enforcement, reindex estimator, and ADRs.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pytest tests/test_doctor.py tests/test_embedder_license.py tests/test_registered_embedders.py tests/test_fingerprint.py -q` | PASS, 24 passed |
| `pytest tests/test_config.py -q` | PASS, 35 passed |
| `ruff check cocoindex_code/ tests/test_doctor.py tests/test_embedder_license.py` | PASS, all checks passed |
| `.venv/bin/ccc doctor --json` | PASS for structured output; command returned rc=2 because it intentionally found stale global `/opt/homebrew/bin/ccc` and CC BY-NC default reranker warning |
| `pytest tests/ -q` | PASS, 210 passed |
| `ruff check cocoindex_code/ tests/` | PASS, all checks passed |
| `validate.sh --strict` | PASS, 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **PyPI freshness is network-dependent.** Doctor returns INFO if PyPI latest cannot be fetched.
2. **Fingerprint status is daemon-dependent.** Doctor returns INFO when the daemon status payload lacks the 023C fingerprint, but still estimates reindex cost from local metadata when possible.
3. **Default Jina v3 remains non-commercial.** That is intentional from ADR-021 quality evidence; commercial deployments should enable `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` or set `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3`.
<!-- /ANCHOR:limitations -->
