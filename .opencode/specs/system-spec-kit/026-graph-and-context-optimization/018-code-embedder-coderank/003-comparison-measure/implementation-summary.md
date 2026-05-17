---
title: "Summary: 018/003 comparison measure"
description: "Pending — populated after comparison runs and ADR-001 lands"
trigger_phrases: ["018/003 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/003-comparison-measure"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded packet"
    next_safe_action: "Backfill after comparison"
    blockers:
      - "depends on 018/001"
      - "depends on 018/002"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-comparison-measure-impl"
      parent_session_id: "018-003-comparison-measure"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 018/003 comparison measure

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Pending — placeholder |
| Artifact | TBD: `evidence/cocoindex-embedder-comparison.csv`, `decision-record.md` ADR-001 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Pending. Will land at `evidence/cocoindex-embedder-comparison.jsonl` (per-pair rows), `evidence/cocoindex-embedder-comparison.csv` (aggregated), and `decision-record.md` ADR-001 (verdict + cited numbers).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Will document the measurement runbook + per-candidate reindex wall-clock.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001 ratifies the production embedder choice for CocoIndex (analog of 016/004 ADR-012 for mk-spec-memory)
- Optional candidates (jina-code, bge-code) included only if CodeRankEmbed vs gemma is inconclusive
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Pending. After comparison:
- Run: `cat evidence/cocoindex-embedder-comparison.csv` — expect per-candidate rows
- Read: `decision-record.md` ADR-001 verdict
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — expect exit 0
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Pending — populated after comparison.
<!-- /ANCHOR:limitations -->
