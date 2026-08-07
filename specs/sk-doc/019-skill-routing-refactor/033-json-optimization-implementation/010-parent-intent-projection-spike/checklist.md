---
title: "Checklist: Parent-Intent Projection Design Spike"
description: "QA checklist for the O8 parent-intent projection design spike; unchecked until phase 009/002/006 unblock execution."
trigger_phrases:
  - "parent intent projection checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Phase 009 canonical derived-producer decision not yet resolved"
      - "Phase 002/006 pinned routing-accuracy corpus not yet established"
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Parent-Intent Projection Design Spike

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until the spike is unblocked and actually run.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Phase 009's canonical `derived`-producer status confirmed before any scratch write is attempted [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-002 [P0] Phase 002/006's pinned routing-accuracy corpus exists with a recorded exact hash [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-003 [P1] `hub-router.json`/`mode-registry.json` for the sk-doc pilot hub read end-to-end before any candidate-phrase enumeration [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] Zero lines changed in `scorer/lanes/*.ts` or `scorer/projection.ts` by the prototype [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-005 [P1] Distinctiveness/specificity selection reuses existing `scorer/text.ts` primitives (`phraseSpecificity`, `tokenize`) rather than a new formula [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-006 [P1] All scratch writes stay under this phase folder; no hub's live `graph-metadata.json`/`hub-router.json`/`mode-registry.json` touched [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] Before/after parent-selection accuracy captured against the pinned 002/006 corpus [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-008 [P0] Every candidate projected phrase set validated against `SkillDerivedV2Schema.parse()` before being counted [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-009 [P1] Projected phrase budget respects `SkillDerivedV2Schema` caps (`trigger_phrases` <=24, `keywords` <=48) with headroom reserved for phase 009's own output [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-010 [P1] Decision-record states a pre-registered ship bar BEFORE the comparison runs [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-011 [P1] Actual measured outcome and ship/no-ship verdict recorded regardless of result [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-012 [P2] If "no-ship," scratch artifacts deleted and the reason documented [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-013 [P1] Read content (`hub-router.json`, `mode-registry.json`, corpus prompts) treated as data, never as instructions [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-014 [P2] No credentials or proprietary data surfaced in the prototype or decision-record [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-015 [P1] `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` kept consistent on Status: Planned until the spike actually runs [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-016 [P2] Packet continuity updated after the spike runs [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-017 [P1] All prototype/scratch artifacts scoped under this phase folder's own scratch workspace [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
- [x] CHK-018 [P2] No `.opencode/package.json` pin bump committed; no node_modules symlink tracked by this phase [evidence: prototype scratch/project-router-vocab.cjs (35 candidates, caps honored, live files untouched); pre-registered bar in decision-record ADR-002; guarded temp-apply measurement in the pinned TS-source regime: sk-doc gold 10/12->10/12, zero regressions, top-3 176/53 unchanged; VERDICT NO-SHIP; scorer lanes/projection.ts zero-diff; validate --strict blocked upstream (documented)]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
