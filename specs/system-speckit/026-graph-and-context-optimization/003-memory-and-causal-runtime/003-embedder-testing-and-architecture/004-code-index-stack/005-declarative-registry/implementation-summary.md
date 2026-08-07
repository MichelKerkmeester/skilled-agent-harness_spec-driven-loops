---
title: "Summary: 019/001 declarative registry"
description: "Pending — populated after registry module lands"
trigger_phrases: ["019/001 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/005-declarative-registry"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Backfill after implementation"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019001"
      session_id: "019-001-declarative-registry-impl"
      parent_session_id: "019-001-declarative-registry"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 019/001 declarative registry

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Pending — placeholder |
| Artifact | TBD: `cocoindex_code/registered_embedders.py`, `tests/test_registered_embedders.py` |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Pending. Will land at `cocoindex_code/registered_embedders.py` (EmbedderMetadata dataclass + MANIFESTS list of 6 candidates + list/get/default API) and `tests/test_registered_embedders.py` (schema + default alignment).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Python module (typed, testable) over YAML (operator-editable) — typed wins because module is consumed by tests + INSTALL_GUIDE generation
- MANIFESTS frozen list pattern reuses the 016 mk-spec-memory convention
- Default must match config.py `_DEFAULT_MODEL` — enforced by pytest
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Pending. After implementation:
- Run: `python -m pytest tests/test_registered_embedders.py -v` — expect PASS
- Run: `python -c "from cocoindex_code.registered_embedders import list_embedders, default_embedder; print(default_embedder().model_name); print(len(list_embedders()))"` — expect jina-code + ≥ 4
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — expect exit 0
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Pending — populated after implementation.
<!-- /ANCHOR:limitations -->
