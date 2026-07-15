---
title: "Implementation Summary: 023A2 Prompt License Registry"
description: "CocoIndex now exposes prompt and license metadata through typed registry accessors and validates the registry at daemon and doctor boundaries."
trigger_phrases:
  - "023A2 complete"
  - "prompt license registry complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry"
    last_updated_at: "2026-05-19T22:55:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented registry accessors"
    next_safe_action: "Run final verification"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registry.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_registry_accessors.py"
    session_dedup:
      fingerprint: "sha256:023a200000000000000000000000000000000000000000000000000000000004"
      session_id: "023-deep-research-arc-blind-spots/006-prompt-license-registry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 023A2 Prompt License Registry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/006-prompt-license-registry` |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

023A2 consolidates CocoIndex model prompt and license metadata into a typed registry API. Embedder specs now expose `query_prompt_name` and `document_prompt_name` as dataclass fields, with upstream-style `query_params` and `indexing_params` derived from those fields. Reranker and embedder license reads now have scalar accessors.

### Accessor List

- `embedder_for(name) -> EmbedderSpec`
- `reranker_for(name) -> RerankerSpec`
- `embed_query_prompt(name) -> str | None`
- `embed_document_prompt(name) -> str | None`
- `embedder_license(name) -> str`
- `rerank_license(name) -> str`
- `validate_registry() -> None`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cocoindex_code/registered_embedders.py` | Modified | Added first-class prompt fields, `EmbedderSpec`/`RerankerSpec` aliases, accessors, and validation. |
| `cocoindex_code/registry.py` | Created | Public registry façade for clean imports. |
| `cocoindex_code/shared.py` | Modified | Prompt resolution now calls registry prompt accessors after env overrides. |
| `cocoindex_code/config.py` | Modified | Registered-model and commercial-safe profile reads now use typed accessors. |
| `cocoindex_code/cli.py` | Modified | `ccc doctor` now includes a registry-contract check and uses typed license accessors. |
| `cocoindex_code/daemon.py` | Modified | Daemon startup calls `validate_registry()`. |
| `cocoindex_code/index_metadata.py` | Modified | Reranker fingerprint license reads through `rerank_license()`. |
| `cocoindex_code/observability.py` | Modified | Compatibility wrapper reads reranker license through `rerank_license()`. |
| `tests/test_registry_accessors.py` | Created | Covers accessor typing, field completeness, duplicate prompt registry absence, and unknown model hints. |
| `tests/test_doctor.py` | Modified | Updates JSON check count for the registry-contract doctor check. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation keeps `registered_embedders.py` as the data owner and adds `registry.py` as the public façade. This avoids a new parallel registry while giving callers a stable import path. Prompt names are now explicit fields; `query_params` and `indexing_params` are normalized in `__post_init__` to preserve the 023A1 upstream-style embedding call shape.

Deduplication evidence: source scan tests assert no competing `_QUERY_PROMPT_MODELS` remains in source files. The old prompt resolver in `shared.py` now delegates to `embed_query_prompt()` and `embed_document_prompt()`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep data ownership in `registered_embedders.py` | Avoids a second registry while preserving existing tests and defaults. |
| Add `registry.py` as façade | Gives new consumers a clean import path without forcing a broad rename. |
| Typed accessors raise `KeyError`; compatibility paths catch unknowns | Required callers get clear errors, while custom-model paths retain old tolerance. |
| Validate registry in doctor and daemon | Catches missing prompt/license metadata at operator and startup boundaries. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_registry_accessors.py tests/test_prompt_policy_contract.py tests/test_embedder_license.py tests/test_doctor.py -q` | PASS, `18 passed in 1.51s` |
| `.venv/bin/python -m pytest tests/ -q` | PASS, `216 passed in 17.84s` |
| `.venv/bin/ruff check` | PASS, `All checks passed!` |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server` | PASS, `0 errors`; existing warnings are shebang/docstring alignment warnings outside this packet's scope. |
| `validate.sh --strict` | PASS, 0 errors and 0 warnings |

Findings closed:

| Finding | Status | Evidence |
|---------|--------|----------|
| HIGH FINDING-006-A | Finished | Prompt names are first-class registry fields and exposed through typed accessors. |
| MED FINDING-002-C | Closed by 023D/doctor path | Existing doctor checks sentence-transformers freshness; 023A2 keeps registry self-test separate. |
| MED FINDING-016-A | Finished | Fixed dims remain normal; prompt/license metadata now has a single registry API. |
| MED FINDING-018-C | Codified | Registry validation plus accessor-based reads reinforce ADR-026 pipeline-before-model discipline. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `build/lib` may still contain stale generated copies; the source-level duplicate prompt registry test intentionally ignores build output.
2. Unknown custom models still bypass registry policy in compatibility paths that previously tolerated unknown models.
3. No git commit was created per user constraint.

```text
PACKET_023A2_COMPLETE pytest=216 ruff=clean strict_validate=PASSED findings_closed=4
SPAWN_AGENT_USED=no
AGENT_RECEIVED=cli-codex-gpt-5.5-high-fast
```
<!-- /ANCHOR:limitations -->
