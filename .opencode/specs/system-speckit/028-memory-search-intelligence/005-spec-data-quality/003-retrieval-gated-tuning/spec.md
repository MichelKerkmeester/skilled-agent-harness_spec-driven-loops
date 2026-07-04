---
title: "Feature Specification: Retrieval-Gated Tuning Phase Parent"
description: "Retrieval-Gated Tuning subgroup of the spec-data-quality track: retrieval-tuning items gated behind benchmarks."
trigger_phrases:
  - "retrieval gated tuning"
  - "spec data quality retrieval-gated tuning"
  - "retrieval-gated tuning phase parent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning"
    last_updated_at: "2026-07-04T17:11:48.666Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped the retrieval-gated tuning phases under one subparent during the 005 restructure"
    next_safe_action: "None — subgroup complete"
    blockers: []
    key_files:
      - "spec.md"
      - "014-chunk-prefix/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-27-028-005-003-retrieval-gated-tuning-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The retrieval-gated tuning phases are grouped under this subparent (5 children)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Retrieval Gated Tuning

Groups retrieval-gated tuning phases that adjust chunk prefixes, production recall gates, answerability tags, metadata fusion, and judge scoring for evidence-aware search quality.

| Child | Description |
|-------|-------------|
| `014-chunk-prefix/` | Chunk Prefix |
| `015-prodmode-recall-gate/` | Prodmode Recall Gate |
| `016-answerable-questions-tags/` | Answerable Questions Tags |
| `017-metadata-fusion/` | Metadata Fusion |
| `018-llm-judge-scorer/` | LLM Judge Scorer |
