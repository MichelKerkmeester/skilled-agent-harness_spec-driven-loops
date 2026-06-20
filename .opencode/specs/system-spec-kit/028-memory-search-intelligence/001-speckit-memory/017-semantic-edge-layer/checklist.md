---
title: "Verification Checklist: Semantic Edge Layer [system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer/checklist]"
description: "Verification Date: 2026-06-19 - partial implementation: semantic-edge substrate, edge-vector store, consolidation embedder hook, and retrieval primitive done, benchmark/LLM consumers pending."
trigger_phrases:
  - "semantic edge layer checklist"
  - "per edge embedding substrate verification"
  - "edge vector dedup false-merge checklist"
  - "shadow-gated edge intelligence verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented semantic-edge substrate and shadow retrieval primitive"
    next_safe_action: "Run strict validation and final typecheck/tests"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-017-semantic-edge-layer"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Verification Checklist: Semantic Edge Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> **Status:** PARTIAL. The substrate/root work and shadow retrieval primitive are implemented. Semantic dedup/merge, cross-pair invalidation, and post-reindex benchmark/promotion remain pending.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008)
- [x] CHK-002 [P0] Technical approach defined in plan.md (substrate-first, consolidation-time, shadow-gated, benchmark-post-reindex)
- [x] CHK-003 [P1] Dependencies identified: gate-zero corpus reindex (028/001-001), existing vector-store port, no-episode-model constraint
- [x] CHK-004 [P1] Confirmed seams re-verified: exact-key upsert remains, same-pair contradiction path unchanged, consolidation entry used, `causal-edges.ts` has passive `fact_text` but no embedding/vector call in the synchronous insert path
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `tsc`/build green, new store + retrieval modules + migration lint clean, `node --check` passes
- [ ] CHK-011 [P0] No console errors or warnings from the consolidation embedding pass
- [ ] CHK-012 [P1] Graceful-degrade error handling: embed-provider-down at consolidation logs and continues with un-embedded edges, LLM-adjudication failure falls back to exact-key (never merges)
- [x] CHK-013 [P1] New tests follow the existing Vitest lane patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001..REQ-004 P0, REQ-005..REQ-008 P1)
- [x] CHK-021 [P0] Migration back-compat test green: flag-off old edge reads remain unchanged, pre-migration edges read as un-embedded (REQ-001)
- [ ] CHK-022 [P0] Isolation test green: ALL flags off → insert / consolidation / fused recall / same-pair contradiction byte-identical to goldens, no embedding/LLM-merge code executes (REQ-003, REQ-004)
- [x] CHK-023 [P1] Consolidation embedder test: flag-on populates edge vectors off-turn and degrades on provider-down (REQ-003)
- [x] CHK-024 [P1] Nearest-edge + edge-aware-triplet retrieval works over the collection (flag-on) (REQ-005)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class recorded for each surface touched (`schema-migration` for the column/collection, `cross-consumer` for the four consumers)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg 'insertEdge|causal_edges|invalid_at'` - every edge-write seam enumerated and confirmed unchanged in the synchronous path
- [x] CHK-FIX-003 [P0] Consumer inventory for the new substrate: `rg 'SPECKIT_SEMANTIC_EDGE_LAYER|edge-vector|edgeVector|edge-semantic'` - all five consumers individually flagged off
- [ ] CHK-FIX-004 [P0] Adversarial table tests cover paraphrase-equal vs distinct-fact pairs (dedup), high-similarity-but-unrelated cross-pair edges (invalidation), null fact text, and embed-provider-down
- [ ] CHK-FIX-005 [P1] Matrix axes listed: {sub-candidate flag} × {flag-off byte-identical, flag-on shadow} × {edge-pair class} with the row count
- [x] CHK-FIX-006 [P1] Synchronous insert path proven untouched: zero embedding/vector calls inside the `insertEdge` txn, deterministic core (`hybrid-search.ts`, Stage-2 fusion) unmodified (REQ-002)
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA / explicit diff range, not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in fixtures, the migration, or the embedder
- [x] CHK-031 [P0] Default-off enforced: every flag (`SPECKIT_SEMANTIC_EDGE_LAYER` + 4 consumers) ships off, no results-affecting consumer is default-on (REQ-004)
- [ ] CHK-032 [P0] No-silent-merge proven: semantic dedup never merges on adjudication uncertainty, false-merge benchmark recorded and merge stays shadow-only until precision clears the recorded bar (REQ-006)
- [x] CHK-033 [P1] Edge fact text + embeddings stay inside the local SQLite boundary, no new external capability or data egress (NFR-S01)
- [ ] CHK-034 [P1] Cross-pair invalidation never auto-closes a live edge while shadow-only (REQ-007)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized, candidate STATUS rows accurate
- [x] CHK-041 [P1] Module/migration comments name the WHY (durable intent), no ephemeral artifact labels per comment-hygiene
- [ ] CHK-042 [P2] `lib/storage/README.md` + `lib/graph/README.md` updated to list the edge-vector store + semantic-retrieval module
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp/benchmark scratch in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 7/16 |
| P1 Items | 19 | 10/19 |
| P2 Items | 6 | 1/6 |

**Verification Date**: 2026-06-19 (partial implementation, benchmark gates deferred until the gate-zero reindex lands)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented (plan.md ADR-001: substrate-first, consolidation-time, shadow-gated, five-as-one-initiative)
- [ ] CHK-101 [P1] ADR has a status (Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (five-as-quick-wins, insert-time embedding, episode-model adoption)
- [x] CHK-103 [P2] Edge-vector store mirrors the existing vector-store shape rather than creating a live-recall embedding stack
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Flag-off path adds zero measurable latency to insert/consolidation/recall/contradiction (NFR-P01)
- [ ] CHK-111 [P1] Consolidation-time embedding wall-time delta reported by the benchmark (NFR-P02)
- [ ] CHK-112 [P2] Edge-aware-triplet recall lift vs baseline documented (post-reindex)
- [ ] CHK-113 [P2] Dedup precision/recall + false-merge rate documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback documented (all flags default-off = no-op, revert consumers + embedder, optional down-migration of the inert column/collection)
- [x] CHK-121 [P0] All flags (`SPECKIT_SEMANTIC_EDGE_LAYER` + 4 consumers) configured default-off
- [x] CHK-122 [P1] Deterministic core (`hybrid-search.ts`, Stage-2 fusion) + synchronous `insertEdge` txn confirmed untouched
- [ ] CHK-123 [P2] Promotion runbook (when/how to flip each consumer flag on, gated on numbers) drafted
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Review pass (independent seat) attempts to refute the no-silent-merge guarantee and the flag-off isolation claim
- [x] CHK-131 [P2] No new dependency licenses introduced (edge embedding reuses the existing embed provider)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist)
- [ ] CHK-141 [P2] Research citations resolve (iter-19/21, roadmap `:329`, synthesis/06 New initiative A `:105-113,168`)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Independent review seat | QA / Adversarial | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
