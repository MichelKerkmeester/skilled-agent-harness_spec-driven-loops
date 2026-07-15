---
title: "Summary: 019/002 INSTALL_GUIDE updates"
description: "Pending — populated after docs land"
trigger_phrases: ["019/002 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/006-install-guide-updates"
    last_updated_at: "2026-05-17T20:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Backfill after docs land"
    blockers:
      - "depends on 019/001"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000019002"
      session_id: "019-002-install-guide-updates-impl"
      parent_session_id: "019-002-install-guide-updates"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 019/002 INSTALL_GUIDE updates

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Pending — placeholder |
| Artifact | TBD: `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` + `README.md` updates |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Pending. Will land at `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` (new "Choosing an embedder" section) and `.opencode/skills/mcp-coco-index/README.md` (short "Embedder choice" pointer).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Hand-write the alternatives table (small, stable) rather than auto-generate from registry
- Lead with default + "change only if you need different trade-offs" — discourage premature optimization
- MPS auto-detect note prominent for Apple Silicon users; CPU kill switch documented
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Pending. After docs land:
- Read-through: new user picks + activates non-default embedder in <10 min
- Link-check: cross-refs to 019/001 + 018/001 + 018/003 resolve
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — expect exit 0
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Pending.
<!-- /ANCHOR:limitations -->
