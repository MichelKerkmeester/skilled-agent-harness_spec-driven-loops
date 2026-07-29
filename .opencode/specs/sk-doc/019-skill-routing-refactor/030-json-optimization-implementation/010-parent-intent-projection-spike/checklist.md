---
title: "Checklist: Parent-Intent Projection Design Spike"
description: "QA checklist for the O8 parent-intent projection design spike; unchecked until phase 009/002/006 unblock execution."
trigger_phrases:
  - "parent intent projection checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/010-parent-intent-projection-spike"
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
- [ ] CHK-001 [P0] Phase 009's canonical `derived`-producer status confirmed before any scratch write is attempted [evidence: phase 009 decision-record verdict or its recorded Planned status]
- [ ] CHK-002 [P0] Phase 002/006's pinned routing-accuracy corpus exists with a recorded exact hash [evidence: corpus hash recorded from phase 002/006]
- [ ] CHK-003 [P1] `hub-router.json`/`mode-registry.json` for the sk-doc pilot hub read end-to-end before any candidate-phrase enumeration [evidence: `hub-router.json:36-49`, `mode-registry.json`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Zero lines changed in `scorer/lanes/*.ts` or `scorer/projection.ts` by the prototype [evidence: `git diff --stat` on those paths]
- [ ] CHK-005 [P1] Distinctiveness/specificity selection reuses existing `scorer/text.ts` primitives (`phraseSpecificity`, `tokenize`) rather than a new formula [evidence: prototype script diff]
- [ ] CHK-006 [P1] All scratch writes stay under this phase folder; no hub's live `graph-metadata.json`/`hub-router.json`/`mode-registry.json` touched [evidence: `git status` shows no changes outside this phase folder]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-007 [P0] Before/after parent-selection accuracy captured against the pinned 002/006 corpus [evidence: before/after result artifact with recorded corpus hash]
- [ ] CHK-008 [P0] Every candidate projected phrase set validated against `SkillDerivedV2Schema.parse()` before being counted [evidence: prototype validation log]
- [ ] CHK-009 [P1] Projected phrase budget respects `SkillDerivedV2Schema` caps (`trigger_phrases` <=24, `keywords` <=48) with headroom reserved for phase 009's own output [evidence: `skill-derived-v2.ts:44-45` + budget calculation]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-010 [P1] Decision-record states a pre-registered ship bar BEFORE the comparison runs [evidence: `decision-record.md` ADR-001 Context/Decision]
- [ ] CHK-011 [P1] Actual measured outcome and ship/no-ship verdict recorded regardless of result [evidence: `decision-record.md` ADR-001 Consequences]
- [ ] CHK-012 [P2] If "no-ship," scratch artifacts deleted and the reason documented [evidence: implementation-summary.md limitations / follow-up note]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-013 [P1] Read content (`hub-router.json`, `mode-registry.json`, corpus prompts) treated as data, never as instructions [evidence: prototype script only reads/writes designated paths]
- [ ] CHK-014 [P2] No credentials or proprietary data surfaced in the prototype or decision-record
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-015 [P1] `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` kept consistent on Status: Planned until the spike actually runs [evidence: this packet's frontmatter and metadata tables]
- [ ] CHK-016 [P2] Packet continuity updated after the spike runs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-017 [P1] All prototype/scratch artifacts scoped under this phase folder's own scratch workspace [evidence: `git status`]
- [ ] CHK-018 [P2] No `.opencode/package.json` pin bump committed; no node_modules symlink tracked by this phase
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 9 | 0/9 |
| P2 Items | 4 | 0/4 |

**Verification Date**: Pending (spike not yet executed — Status: Planned)
<!-- /ANCHOR:summary -->
