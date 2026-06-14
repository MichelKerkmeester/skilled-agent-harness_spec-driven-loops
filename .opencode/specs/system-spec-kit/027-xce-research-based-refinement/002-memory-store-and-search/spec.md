---
title: "Feature Specification: Memory Store and Search (Phase Parent)"
description: "Phase-parent for the memory store, write-path safety, indexing/causal lifecycle, trigger matching, feedback reducers, and search resilience phases."
trigger_phrases:
  - "027 memory store and search"
  - "memory write safety"
  - "semantic trigger fallback"
  - "feedback reducers"
  - "vector read path resilience"
  - "packed bm25 field weights"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author 002-memory-store-and-search phase-parent control trio"
    next_safe_action: "Resume or validate a child phase folder"
    blockers: []
    key_files:
      - "spec.md"
      - "001-memory-write-safety/spec.md"
      - "002-memory-index-causal-lifecycle/spec.md"
      - "003-semantic-trigger-fallback/spec.md"
      - "004-learning-feedback-reducers/spec.md"
      - "005-memclaw-derived-memory-hardening/spec.md"
      - "006-openltm-retrieval-observability/spec.md"
      - "007-openltm-continuity-resilience/spec.md"
      - "008-vector-read-path-resilience/spec.md"
      - "009-packed-bm25-field-weights/spec.md"
      - "010-bm25-warmup-churn-reduction/spec.md"
      - "011-vector-resilience-durability/spec.md"
      - "012-hybrid-search-scope-then-limit/spec.md"
      - "013-provenance-injection/spec.md"
      - "014-idempotency-flag-on-correctness/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-14-027-six-track"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives, renamed-from, X to Y history
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Memory Store and Search (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-14 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The bulk of 027 hardens the Spec Kit memory store and its retrieval path: write-path safety, incremental index and causal lifecycle, semantic trigger matching, learning feedback reducers, derived-memory hardening, retrieval observability, session continuity, and vector/BM25 search resilience. These share the memory subsystem and a single deployment doctrine (results-affecting features default-off, protections always-on), so they belong under one themed parent.

### Purpose
Own the memory-store and search child phases so each can be resumed, implemented, and validated independently while the parent keeps the phase map, dependency visibility, and handoff order visible.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live inside the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Memory write safety, secret redaction, provenance, idempotency, and near-duplicate detection.
- Incremental index, causal-edge lifecycle, metadata-edge promotion, and statediff reconciliation.
- Semantic trigger fallback and learning feedback reducers (default-off, shadow-first).
- Retrieval observability, session continuity, and vector/BM25 read-path resilience and performance.

### Out of Scope
- Advisor and code-graph feature adoption (track 003).
- Shared transport, command, and dependency layers (track 004).
- Implementation detail at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| child phase folders `[0-9][0-9][0-9]-*/` | Modify/Create | all | Per-phase implementation lives in the child folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-memory-write-safety/` | P0 feedback correctness fixes + fail-closed secret redaction | Complete |
| 002 | `002-memory-index-causal-lifecycle/` | Memory index & causal write lifecycle — incremental index, causal-edge tombstones, metadata-edge promoter, write-path reconciliation | Phase Parent |
| 003 | `003-semantic-trigger-fallback/` | Hybrid lexical-plus-semantic trigger matching (lexical primary, semantic union fallback, default-off) | Phase Parent |
| 004 | `004-learning-feedback-reducers/` | Learning feedback reducers (aggregator, causal, retention) — default-off, shadow-first | Phase Parent |
| 005 | `005-memclaw-derived-memory-hardening/` | MemClaw-derived memory write/surface hardening — idempotency receipts, tool-ownership map, stale-recall audit | Draft (plan only) |
| 006 | `006-openltm-retrieval-observability/` | OpenLTM-derived retrieval observability — why_ranked, inline contradiction/supersession warnings, degraded-vector signal | Complete |
| 007 | `007-openltm-continuity-resilience/` | OpenLTM-derived continuity/session resilience — bounded restore panel, authored PreCompact snapshot, facet taxonomy | Complete |
| 008 | `008-vector-read-path-resilience/` | Vector shard integrity probe, quarantine, and auto-rebuild with authoritative dimension discovery | Complete |
| 009 | `009-packed-bm25-field-weights/` | Packed in-memory BM25 engine with restored BM25F field weighting | Shipped |
| 010 | `010-bm25-warmup-churn-reduction/` | Packed-BM25 warmup RSS cut 743MB to 136.5MB peak-sampled, ranking byte-identical | Complete |
| 011 | `011-vector-resilience-durability/` | Persist shard-repair-pending sentinel across restart with boot-time completeness check | Complete |
| 012 | `012-hybrid-search-scope-then-limit/` | Resolve spec-folder/tier filters before truncating to limit so scoped search returns its real set | Complete |
| 013 | `013-provenance-injection/` | Automated reducer/feedback writers inject source-kind provenance so the write-ingress guard holds | Complete |
| 014 | `014-idempotency-flag-on-correctness/` | Flag-ON correctness for memory idempotency — verbatim replay, immutable first-write receipts | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| (per-child) | (next child) | Each child ships and validates independently under tolerant policy | Per-child strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open at the parent level; per-phase questions live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
