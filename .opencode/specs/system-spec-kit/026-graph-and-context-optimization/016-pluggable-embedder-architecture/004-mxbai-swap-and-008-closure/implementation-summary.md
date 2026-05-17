---
title: "Summary: 016/004 mxbai swap + 008 closure"
description: "Pre-execution stub. Backfilled after phase 4 ships."
trigger_phrases: ["016/004 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold stub"
    next_safe_action: "Phase 4 execution after 016/003 ships"
    blockers: ["016/003"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-summary"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/004 mxbai swap + 008 closure

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | Scaffolded |
| Branch | main |
| Wall-clock estimate | 1-2 hours (mostly re-index wait + scenario re-runs) |
| Closes | packet 008 cat-24/409 (last of 51 FAILs) |
| Supersedes | packet 115 |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
Pre-execution stub. Expected deliverables:
- evidence/cat-24-rerun.jsonl (3 rows)
- evidence/008-pass-sample-rerun.jsonl (~20 rows)
- evidence/swap-benchmark.csv (1 row: mxbai-embed-large vs baseline)
- decision-record.md with ADR-001 (keep / rollback / hybrid)
- Updates to packet 008 + 115 cross-refs


<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
Pre-execution. Pickup via cli-opencode `--model deepseek/deepseek-v4-pro --pure --format json`.


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
Pre-execution. Pre-decided:
- mxbai-embed-large-v1 chosen ahead of benchmark on theoretical grounds (AnglE loss directly optimizes the failing cosine metric)
- If swap fails, rollback via `embedder_set` back to embeddinggemma-300m — no data loss (vec_768 retained)
- Packet 115 supersedes after this lands (the eval was for 1-model-at-a-time; pluggable approach is strictly more general)


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Target |
|-------|--------|
| cat-24/409 re-run | PASS (8/10 top-3) |
| 008 PASS sample | ≥ 19/20 preserved |
| Cosine on weak pair | ≥ 0.43 (baseline 0.2829) |
| Memory footprint | ≤ 1 GB total |
| Latency per memory_search | ≤ 100 ms p95 |
| strict-validate 016/004 | exit 0 |
| strict-validate 008 | exit 0 (cross-ref update preserved) |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
Pre-execution. Anticipated:
- Larger model (~2× current) increases idle RAM by ~370 MB
- 1024-dim vec store ~25% larger on disk (acceptable)
- Re-index wall ~15-25 min — single-time cost, not recurring
- If 409 doesn't reach PASS even with mxbai, follow-on packet evaluates BGE-large, jina-v3, etc.

<!-- /ANCHOR:limitations -->
