---
title: "Tasks: Determinism + Content-ID Foundation"
description: "Task breakdown for the determinism + content-id foundation sub-phase: one task per candidate (5 shipped with Wave-0 commit evidence, 4 gated residue), plus verification and Level-3 documentation closeout."
trigger_phrases:
  - "tasks determinism content-id foundation"
  - "memory total comparator task breakdown"
  - "028 speckit-memory determinism tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/002-determinism-content-id-foundation"
    last_updated_at: "2026-07-04T17:51:02.224Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown: shipped pre-checked with commits, residue pending"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-determinism-foundation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Determinism + Content-ID Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (gated residue, not built this sub-phase) |
| `[x]` | Completed (shipped in Wave-0 with commit evidence) or explicitly gated-deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or closeout action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 | T001-T003 | Keystone (total-comparator tiebreaks + content-id primitives) |
| M2 | T004-T005 | Byte-identical-by-default seams |
| M3 | T006-T009 | Gated residue dispositioned |
| M4 | T010-T013 | Verification + Level-3 closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Keystone candidates (total-comparator tiebreaks + content-id primitives), shipped in Wave-0 / packet 030.

- [x] T001 two-content-id-primitives, centralize content-body + canonical-field SHA-256 into `lib/content-id.ts` (`hashContentBody`, `hashCanonicalJson`) [Done, commit `18c8582e33`, byte-identical proven by parity test, no behavior change].
- [x] T002 ANN-tie-stable-order, append `, m.id ASC` (COALESCE) to the 4 ranked ANN `ORDER BY distance` (`vector-index-queries.ts:169,199,458,570`) [Done, commit `bec0eed27f`].
- [x] T003 C5-B content-derived tiebreak, `content_hash`-asc tiebreak (COALESCE id) in the deterministic comparator + all 5 RRF output sorts (`ranking-contract.ts`, `rrf-fusion.ts`, `hybrid-search.ts`) [Done, commit `bec0eed27f`, primary order unchanged, verified].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Byte-identical-by-default seams (C-X1 `'active'`, C6-A clock), shipped in Wave-0 / packet 030.

- [x] T004 C-X1 `'active'`, expose the active-channel bonus denominator as the `bonusOverChannels` param, default `'active'` (`rrf-fusion.ts:296-371,345-388`) [Done, commit `65cfcea513`, byte-identical traced arithmetically, opus SHIP].
- [x] T005 C6-A rank-time decay clock, caller-`nowMs` rank-time decay vs the `trackAccess`-only path, restored the no-timestamp skip guard so it is a pure refactor (`stage2-fusion.ts:897-908`, `fsrs.ts:40-47`) [Done, commit `65cfcea513`, reinforcement stays a separate event].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:residue -->
## Gated residue (PENDING, dispositioned, not built this sub-phase)

- [x] T006 [B] C-X1-true-multichannel (`'configured'` mode) (`rrf-fusion.ts:345-388`) [Pending, gate: shared-infra-dep. Build alongside the Wave-1 C2-B per-class weight consumer, after the fusion-bonus unit test lands, default stays `'active'`. C-X1 confirmed from-scratch, aionforge has no bonus term, agreement is emergent (`../research/iterations/iteration-031.md` H31-02)].
- [x] T007 [B] C5-A render-order serialization stage (`formatters/search-results.ts:782`, `envelope.ts:99`) [Pending, gate: render-build. `serializationId = sha256(canonical fields)` re-sort at the render boundary, fuller-parity successor to the shipped C5-B stopgap, golden-file re-baseline once, render tiebreak separate from fusion tiebreak (`../research/iterations/iteration-003.md` C5-A, `iteration-031.md` H31-04)].
- [x] T008 [B] M-dual-class-identity (`memory-index.ts:281`, `idempotency-receipts.ts:81-97`, `causal-edges.ts:140`) [Pending, gate: multi-writer (single-tenant-refuted). iter-14 PROMOTE → iter-23 PARTIAL/NO-GO: the capture-vs-content distinction already exists informally, formalizing pays off only for distributed/multi-writer merge (`../research/iterations/iteration-014.md` → `iteration-023.md`)].
- [x] T009 [B] M-clock-skew-replay-window (`idempotency-receipts.ts:180,143-205`) [Pending, gate: multi-writer (single-tenant-refuted). iter-14 BUILD → iter-23 REFUTED/NO-GO: anti-replay clock-skew is a network/multi-writer threat, local writes have no adversarial replay + receipts already dedup (`../research/iterations/iteration-023.md`)].
<!-- /ANCHOR:residue -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-confirm shipped-candidate commits against `030` section 14 (`18c8582e33`, `bec0eed27f` ×2, `65cfcea513` ×2).
- [x] T011 Record the cross-subsystem byte-compare contract (`fuseResultsMulti` `'active'` default, consumers 002/003/004) in `spec.md` + `plan.md`.
- [x] T012 Author `plan.md`, `tasks.md`, `checklist.md` from the system-spec-kit Level-3 templates.
- [x] T013 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 9 candidates have a final status in `spec.md` section 13 (5 DONE-with-commit, 4 PENDING-with-gate).
- [x] All 5 shipped candidates trace to a Wave-0 commit.
- [x] Each gated residue task names its block reason and consuming sub-phase. None is disguised as incomplete in-flight work.
- [ ] Byte-identity of the shipped default seams is re-confirmed by the still-open fusion-bonus unit test before any `'configured'` promotion (downstream verification, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 13 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md` + `03`.
<!-- /ANCHOR:cross-refs -->
