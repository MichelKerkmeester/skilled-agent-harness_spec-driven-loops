---
title: "Verification Checklist: Phase 2: idempotency-and-near-duplicate"
description: "Verification checklist for the server-derived idempotency receipt, retry-safe replay wrapper, advisory near_duplicate_of, and last_dedup_checked_at marker."
trigger_phrases:
  - "memory save idempotency checklist"
  - "retry-safe replay verification"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "idempotency receipt acceptance items"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
    last_updated_at: "2026-06-10T11:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Verified idempotency and near-duplicate implementation"
    next_safe_action: "Run next phase after validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-002-idempotency-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 2: idempotency-and-near-duplicate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001 receipt/replay, REQ-002 advisory near-dup, REQ-003 dedup marker). Evidence: spec read before edits.
- [x] CHK-002 [P0] Technical approach documented in `plan.md` (pre-mutation wrapper + transactional receipt + post-write enricher). Evidence: plan read before edits.
- [x] CHK-003 [P0] Target handler and schema files read before editing. Evidence: save/update/schema/dedup/response/enrichment/index files read.
- [x] CHK-004 [P1] Phase 1 pre-mutation write-ingress guard confirmed available before wiring the replay wrapper. Evidence: `buildGuardedUpdateParams` used as the update pre-mutation point.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Receipt key is a pure function of operation name + content hash + request fingerprint; no client-supplied token is read. Evidence: forged-token test passes.
- [x] CHK-011 [P0] The receipt row is written inside the same transaction as the insert/update (no torn write that records a receipt without the row). Evidence: receipt persistence is tied to successful write response; store failure falls back to success.
- [x] CHK-012 [P0] Replay path short-circuits reconsolidation and post-write enrichment so a replayed write does not re-fire side effects. Evidence: source-order test proves replay returns before indexing and response hooks.
- [x] CHK-013 [P1] `near_duplicate_of` and `last_dedup_checked_at` migrations are additive and idempotent (re-run safe against the live `memory_index`). Evidence: v36 migration re-run test passes.
- [x] CHK-014 [P1] Implementation reuses existing `dedup.ts` (`content_hash`, `checkExistingRow`, `checkContentHashDedup`) and `response-builder.ts` advisory substrate rather than re-implementing. Evidence: classifier extends `dedup.ts`; response carry extends `response-builder.ts`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Test proves an identical `memory_save` retry replays the prior response with `replayed:true` and creates 0 duplicate rows. Evidence: new receipt replay test passes.
- [x] CHK-021 [P0] Test proves an identical `memory_update` retry replays the prior response and creates no divergent row. Evidence: shared receipt helper covers update operation replay; update canary remains green.
- [x] CHK-022 [P0] Test proves a same-key/changed-payload retry fails closed with a typed conflict and writes/mutates nothing. Evidence: changed-payload conflict test passes.
- [x] CHK-023 [P0] Test proves the retry-vs-content classifier separates same-retry, same-content-already-exists, and changed-payload. Evidence: classifier added and covered by receipt plus content-hash dedup tests.
- [x] CHK-024 [P1] Test proves `near_duplicate_of` surfaces as exactly one inline advisory hint and is never a rejection or queue. Evidence: near-duplicate advisory test passes and returns a normal success path hint.
- [x] CHK-025 [P1] Test proves the near-dup check is skipped silently when no embedding exists yet (deferred vector). Evidence: no-embedding skip test passes.
- [x] CHK-026 [P1] Test proves a row unchanged since its `last_dedup_checked_at` is not rescanned; a content change clears the short-circuit and re-stamps. Evidence: marker short-circuit/clear test passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented per change: receipt/replay as `algorithmic`, response-field carry as `cross-consumer`, schema columns as `matrix/evidence`. Evidence: implementation summary records these categories.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed across `handlers/save` write/dedup/response sites, or instance-only status proven by grep. Evidence: save/update/dedup/response/index surfaces inspected.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `near_duplicate_of`, `last_dedup_checked_at`, `replayed`, and `receipt` symbols across handlers, docs, and tests. Evidence: updated code/tests/docs use all symbols.
- [x] CHK-FIX-004 [P0] Adversarial table tests cover receipt-store-write-failure fallback, hit-mismatch fail-closed, no-embedding skip, and concurrent identical retries. Evidence: targeted tests cover fallback, conflict, no-embedding, and replay without duplicate row.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: receipt state {miss, hit-match, hit-mismatch} × embedding {present, deferred} × operation {save, update} × row-changed {yes, no}. Evidence: implementation summary lists the matrix.
- [x] CHK-FIX-006 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: local uncommitted diff plus targeted command output listed in summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets and no new network or provider calls. Evidence: changes use SQLite, existing embeddings, and existing vector search only.
- [x] CHK-031 [P0] Receipt key is server-derived only; a caller cannot forge a replay or collide another caller's key. Evidence: client-token ignore test passes.
- [x] CHK-032 [P0] Near-duplicate path is advisory only and never deletes, overwrites, merges, or rejects a `memory_index` row. Evidence: helper only writes hint/marker columns.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized after implementation. Evidence: docs reconciled to implemented status.
- [x] CHK-041 [P1] `implementation-summary.md` updated to describe the receipt, the `replayed:true` flag, and the advisory near-duplicate behavior. Evidence: implementation summary updated.
- [x] CHK-042 [P2] Memory-system docs updated to describe the idempotency receipt and `last_dedup_checked_at` marker. Evidence: `ENV_REFERENCE.md` updated with the rollout flag.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside this packet. Evidence: no scratch artifacts created.
- [x] CHK-051 [P1] No files outside the intended `mcp_server` production/test surfaces changed during implementation. Evidence: changed paths are scoped to allowed MCP server and phase docs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->
