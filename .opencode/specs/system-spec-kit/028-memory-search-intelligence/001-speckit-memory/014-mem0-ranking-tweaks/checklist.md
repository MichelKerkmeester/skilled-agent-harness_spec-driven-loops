---
title: "Verification Checklist: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)"
description: "Verification checklist for the 06 external-memory-systems cheap ranking + extraction bundle. Planning-state - implementation not started, all items unverified pending the gate-zero reindex and per-candidate build."
trigger_phrases:
  - "mem0 ranking tweaks checklist 028"
  - "bm25 calibration verification"
  - "cascade extraction checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored planning-state checklist"
    next_safe_action: "Run gate-zero corpus reindex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-014-mem0-ranking-tweaks"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Mem0 Ranking + Extraction Bundle (028 Memory impl phase 014)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

> **Planning-state checklist.** Implementation has NOT started, this is a re-plan deliverable. Every item is `[ ]` unverified. The phase's gate-zero (corpus reindex) precedes any recall-candidate verification.

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md authored (8 candidates, research-cited acceptance criteria)
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md authored (gate-zero, sequencing, shared-infra deps)
- [ ] CHK-003 [P0] Gate-zero corpus reindex run + reindexed baseline captured
  - **Evidence**: PENDING - precondition for all recall candidates (1-3, 7)
- [ ] CHK-004 [P1] Per-candidate STATUS confirmed (all PENDING, zero 030 commit coverage)
  - **Evidence**: PENDING - per-ID grep of 030 §14 returns zero matches for every requested ID
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes typecheck/build
  - **Evidence**: typecheck 0 errors, 81 affected tests pass (commit `0cf96409d8`)
- [ ] CHK-011 [P1] Each ranking tweak default-off path byte-identical to current ranking
  - **Evidence**: PENDING - snapshot equivalence for candidates 1-3
- [x] CHK-012 [P1] Config refactor (candidate 4) reproduces the inline 5 rules exactly
  - **Evidence**: parity test green, byte-identical extraction (commit `0cf96409d8`)
- [ ] CHK-013 [P1] Extraction changes (5-6) additive, single-pass / post-hoc-linking paths preserved
  - **Evidence**: PENDING
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Reindexed before/after recall baseline captured per ranking tweak (1-3)
  - **Evidence**: PENDING - regression-baseline rule, promote default-on only on positive delta
- [x] CHK-021 [P1] Cardinality penalty unit-tested at n=0, n=1 (→1.0) and high-n damping
  - **Evidence**: `tests/mem0-ranking-tweaks.vitest.ts` (T018), commit `0cf96409d8`
- [ ] CHK-022 [P1] Cascade refine-pass-failure fallback preserves the broad-pass result
  - **Evidence**: PENDING
- [ ] CHK-023 [P1] Lemmatizer-unavailable path degrades, does not throw
  - **Evidence**: PENDING
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P0] All 8 distinct candidates resolved (built, deferred-with-gate or NO-TRANSFER) - none left ambiguous
  - **Evidence**: PENDING
- [ ] CHK-025 [P1] Every ranking tweak default-on decision is backed by a reindexed positive recall delta (or stays default-off)
  - **Evidence**: PENDING
- [ ] CHK-026 [P1] Gated candidates (7 shared-infra, 8 verify-first) have a recorded disposition, not silent drop
  - **Evidence**: PENDING
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Malformed entity-config JSON fails closed to the built-in 5 rules (no crash)
  - **Evidence**: `loadEntityExtractionRules()` fail-closed fallback to built-ins (T004), commit `0cf96409d8`
- [ ] CHK-031 [P2] No new untrusted-content path introduced by write-time linking
  - **Evidence**: PENDING - memory-ID-graph reframe respected
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: three docs authored this re-plan
- [x] CHK-041 [P1] Candidate 8 resolved to build OR NO-TRANSFER with cited evidence
  - **Evidence**: NO-TRANSFER - `post-insert.ts:332` re-derives entities/embeddings on changed save (T013/T014), commit `0cf96409d8`
- [ ] CHK-042 [P2] Candidate 7 entity-vector-index dependency decision recorded
  - **Evidence**: PENDING - shared-infra / semantic-edge-layer
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: PENDING
- [ ] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: PENDING
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 13 | 0/13 |
| P2 Items | 3 | 0/3 |

**Verification Date**: Not started (planning-state)
**Verified By**: Pending implementation phase
<!-- /ANCHOR:summary -->
