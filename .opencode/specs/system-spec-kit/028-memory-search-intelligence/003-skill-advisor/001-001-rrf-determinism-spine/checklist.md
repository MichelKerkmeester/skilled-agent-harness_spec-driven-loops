---
title: "Verification Checklist: RRF Determinism Spine (Skill Advisor)"
description: "QA checklist for the advisor RRF determinism-spine sub-phase: the fuseResultsMulti import (C3), the folded byte-stable tiebreak (C2), the post-fusion conflict-suppression carrier, the routing-agreement benchmark gate, and strict packet validation. All implementation items PENDING (nothing shipped in Wave-0/030)."
trigger_phrases:
  - "verification checklist advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import QA"
  - "advisor conflict re-rank checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 verification checklist for the advisor RRF determinism spine"
    next_safe_action: "Run validate.sh --strict on this sub-phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: RRF Determinism Spine (Skill Advisor)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot close the spine until complete or explicitly gated with evidence |
| **[P1]** | Required | Must be verified or documented as a gated residual follow-up |
| **[P2]** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spine scope is documented and bounded to C3 (RRF import) + C2 (folded) + the conflict-suppression carrier.
  - **Evidence**: `spec.md` sections 2, 3, and 13 define the 3-candidate set and exclude C5/C4/QCR and the full (dormant) C1.
- [x] CHK-002 [P0] 028 research is treated as roadmap input; the shipped record is traced to packet 030.
  - **Evidence**: `spec.md` METADATA + section 13 cite `../research/research.md` and `../../../030-memory-search-intelligence-impl/spec.md` section 14 (NO advisor candidate shipped; dependency `65cfcea513`).
- [x] CHK-003 [P0] The shared `fuseResultsMulti` dependency is confirmed shipped and shape-compatible before any import.
  - **Evidence**: `030` §14 cand 5 (`65cfcea513`) extended the API; `001` iter-2 F17 confirms `LaneMatch{skillId}` → `RrfItem{id}` 1:1.
- [x] CHK-004 [P0] The signed-score conflict-suppression caveat is named as a requirement before implementation.
  - **Evidence**: `spec.md` REQ-003; `001` iter-2 F16 (`fuseResultsMulti` elides negative/zero-weight lanes).
- [x] CHK-005 [P1] Candidate seams identified before implementation.
  - **Evidence**: `spec.md` section 3 + `plan.md` affected-surfaces list `fusion.ts:366,372,409,425-433`, `graph-causal.ts:18,70-103`, and the shared primitive.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Advisor MCP typecheck passes after the lane → `RankedList` adapter + RRF import.
  - **Evidence**: PENDING — `npm run typecheck` in `system-skill-advisor/mcp_server` (run at implementation time).
- [ ] CHK-011 [P0] Advisor MCP build passes.
  - **Evidence**: PENDING — `npm run build` in the same package.
- [ ] CHK-012 [P0] The advisor imports the shared `fuseResultsMulti`; it does NOT re-implement or fork RRF.
  - **Evidence**: PENDING — import from `shared/algorithms/rrf-fusion.ts`; no second RRF in the advisor (`003` iter-2 C3).
- [ ] CHK-013 [P1] The advisor passes its OWN smaller `k` (not Memory's corpus-tuned `DEFAULT_K`).
  - **Evidence**: PENDING — `FuseMultiOptions.k` supplied and justified against skill count (`001` iter-2 F18).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] C3 RRF import: lanes fuse via `fuseResultsMulti`; the `weightedScore`-sum (`fusion.ts:366,372`) is gone.
  - **Evidence**: PENDING — advisor scorer/fusion Vitest; REQ-001.
- [ ] CHK-021 [P0] C2 byte-stable order: identical inputs produce byte-identical recommendation order; the `toFixed(6)`+`localeCompare` tiebreak is removed.
  - **Evidence**: PENDING — fusion-determinism Vitest; RRF fixed-order rank sum + `compareFusionResults` (`rrf-fusion.ts:163-176`); REQ-004 (C2 folds into C3).
- [ ] CHK-022 [P0] Conflict-suppression carrier: a populated `conflicts_with` fixture is demoted via the post-fusion re-rank, NOT dropped.
  - **Evidence**: PENDING — graph-causal lane + re-rank Vitest (dormant + populated fixtures); REQ-003.
- [ ] CHK-023 [P0] Routing-agreement baseline captured before any live flip; `explicit_author` stays dominant.
  - **Evidence**: PENDING — top-1/top-3 agreement RRF vs weighted sum over a representative prompt set (needs-benchmark, `synthesis/03` §B); REQ-005.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a final disposition.
  - **Evidence**: `spec.md` section 13 — 0 DONE, 3 PENDING (all gated); no advisor candidate shipped in Wave-0/030.
- [x] CHK-FIX-002 [P0] C2 is recorded as folding into C3, not double-counted as a separate change.
  - **Evidence**: `spec.md` section 3 + 13; the byte-stable order is C3's mechanism (`003` iter-2 C2, iter-4 ranking note).
- [x] CHK-FIX-003 [P0] The conflict carrier is scoped distinct from the full (dormant) C1.
  - **Evidence**: `spec.md` section 3 + REQ-006 — ship the re-rank seam (conflict-safe import); defer the populated split-conflict signal because `conflicts_with` is DORMANT (`003` iter-10 O10-01).
- [x] CHK-FIX-004 [P0] The signed-score caveat is carried into the port, not assumed away.
  - **Evidence**: `spec.md` REQ-003 + risk R-001; positive propagation → RRF, negative `conflicts_with` → post-fusion re-rank (`001` iter-2 F16, `003` iter-6 F6-02).
- [x] CHK-FIX-005 [P1] The needs-benchmark gate is recorded (the import changes fused ordering — it is not byte-identical-by-default).
  - **Evidence**: `spec.md` REQ-005 + section 2 critical context; `plan.md` Phase 1 baseline.
- [x] CHK-FIX-006 [P1] Evidence is pinned to research citations and the dependency commit.
  - **Evidence**: `tasks.md` + `spec.md` cite per-iteration deltas (iter-2/6/10) and the dependency commit `65cfcea513`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets introduced.
  - **Evidence**: Candidate changes are fusion/ranking logic over already-loaded lane outputs; no secret-bearing files in scope.
- [x] CHK-041 [P1] No new trust boundary or external data sink.
  - **Evidence**: `spec.md` NFR-S01 — internal fusion/ranking only; the shared primitive is imported, not networked.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `plan.md` covers all 3 candidates + the baseline gate and the sequencing.
  - **Evidence**: `plan.md` phases, effort, and rollback tables list C3, C2 (folded), the conflict carrier, and the baseline.
- [x] CHK-051 [P1] `tasks.md` has one task per candidate plus baseline/verification/docs.
  - **Evidence**: T001 (baseline), T002-T004 (C3+C2), T005-T007 (carrier), T008-T013 (verification + docs).
- [x] CHK-052 [P1] No leakage into packet 030 or sibling-subsystem code.
  - **Evidence**: Only this sub-phase's docs are authored; the shipped record (030) and the shared `rrf-fusion.ts` are referenced/imported, not modified here.
- [x] CHK-053 [P2] Research provenance is cited per candidate.
  - **Evidence**: `spec.md` RELATED DOCUMENTS maps each candidate to its iteration/delta evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only scoped sub-phase docs are authored.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` under this sub-phase folder.
- [x] CHK-061 [P1] Unrelated and shipped-record files remain untouched.
  - **Evidence**: No edits to packet 030, the 028 parent, the shared `rrf-fusion.ts`, or sibling research children.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 8/12 (4 PENDING — implementation-time) |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: Claude (re-plan author)
**Scope**: Advisor RRF determinism-spine sub-phase: C3 (RRF import) + C2 (folded byte-stable tiebreak) + the post-fusion conflict-suppression carrier — all PENDING (nothing shipped in Wave-0/030). Planning/documentation items verified; implementation/test items (CHK-010..013, CHK-020..023) are PENDING and verified at implementation time.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS

- **Specification**: `spec.md` (section 13 candidate status).
- **Plan**: `plan.md`.
- **Tasks**: `tasks.md`.
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md` + `03`; deltas `iter-002.jsonl` / `iter-006.jsonl` / `iter-010.jsonl`.
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 (dependency commit `65cfcea513`).
