---
title: "Summary: 018/003 comparison measure"
description: "Primary CocoIndex embedder comparison completed; ADR-001 keeps jina-code"
trigger_phrases: ["018/003 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Measured jina-code vs gemma, restored production jina-code index, and authored ADR-001"
    next_safe_action: "Keep CocoIndex production default on jina-code"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-comparison-measure-impl"
      parent_session_id: "018-003-comparison-measure"
    completion_pct: 100
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
| Status | Complete |
| Artifact | `evidence/cocoindex-embedder-comparison.jsonl`, `evidence/cocoindex-embedder-comparison.csv`, `decision-record.md` ADR-001 |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Ran the 018/002 fixture against the two primary local candidates: `sbert/jinaai/jina-embeddings-v2-base-code` and `sbert/google/embeddinggemma-300m`. Wrote 36 per-pair rows to `evidence/cocoindex-embedder-comparison.jsonl`, aggregate metrics to `evidence/cocoindex-embedder-comparison.csv`, and ADR-001 to `decision-record.md`.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

For each primary candidate, stopped the daemon, reset the CocoIndex databases, set `COCOINDEX_CODE_EMBEDDING_MODEL`, ran a full `ccc index`, then executed direct `ccc search --limit 5` probes for all 18 fixture queries. Full reindex time was about 24-25 minutes per primary candidate. After measurement, restored production state by rebuilding the index with `sbert/jinaai/jina-embeddings-v2-base-code`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- ADR-001 verdict is KEEP-JINA-CODE.
- Mirror-equivalent paths under `.opencode`, `.claude`, `.codex`, and `.gemini` are normalized for hit scoring because the fixture targets canonical `.opencode` paths while the index may return equivalent runtime mirrors.
- Optional CodeRankEmbed and bge-code sweeps were deferred after the primary pair consumed the benchmark budget.
- No config flip shipped because the accepted winner is already `_DEFAULT_MODEL`.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- Run: `cat evidence/cocoindex-embedder-comparison.csv` — PASS, rows for jina-code and gemma.
- MPS gate: `_resolve_device(None) == "mps"` and `Config.from_env().device == "mps"`.
- Rescue gate: no `rescue` / `SPECKIT_RERANK_LAYER` code under `cocoindex_code`.
- Production restore: `ccc index` with jina-code completed with 8,427 files, 127,346 chunks, errors 0.
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — PASS, exit 0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The benchmark exposed search-surface noise: canonical docs and mirrored skill directories frequently outrank the canonical `.opencode` source file. That limits how much recall signal this fixture can provide without a path-class filter or mirror-aware scoring. Optional CodeRankEmbed and bge-code candidates remain deferred.
<!-- /ANCHOR:limitations -->
