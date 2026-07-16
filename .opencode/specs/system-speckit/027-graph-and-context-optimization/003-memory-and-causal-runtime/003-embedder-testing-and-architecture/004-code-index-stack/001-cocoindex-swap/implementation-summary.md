---
title: "Summary: 018/001 CocoIndex swap"
description: "Pending — populated after Phase 1-5 land"
trigger_phrases: ["018/001 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/001-cocoindex-swap"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Backfill after implementation"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018001"
      session_id: "018-001-cocoindex-swap-impl"
      parent_session_id: "018-001-cocoindex-swap"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 018/001 CocoIndex swap

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Pending — placeholder until implementation lands |
| Artifact | TBD: `evidence/swap-runbook.md`, smoke-test logs |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Pending. Will document the `_DEFAULT_MODEL` flip + MPS branch + vitest after Phase 2 lands.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Will record reindex wall-clock, disk size, and smoke-test results.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Default flipped to `sbert/jinaai/jina-embeddings-v2-base-code` based on code-tuned model rationale (see 018 parent spec.md §1 OVERVIEW)
- MPS auto-detect added so Apple Silicon users get GPU acceleration without env-var setup
- `COCOINDEX_CODE_DEVICE=cpu` preserved as kill switch
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Pending. After implementation:
- Run: `npx vitest run tests/mps-auto-detect.vitest.ts` — expect PASS
- Run: `mcp__cocoindex_code__search query="..."` — expect non-empty result
- Run: `mcp__mk_code_index__code_graph_context symbol="..."` — expect populated bridge response
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — expect exit 0
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Pending — populated after implementation.
<!-- /ANCHOR:limitations -->
