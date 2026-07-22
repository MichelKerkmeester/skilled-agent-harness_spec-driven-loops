---
title: "Tasks: Authored Structural-Fingerprint Cards"
description: "Planned task breakdown for authoring the Phase 3 structural-fingerprint cards, load-on-demand index, and stamp-based diversification check; nothing executed yet."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards"
    last_updated_at: "2026-07-22T18:01:08Z"

    last_updated_by: "spec-author"
    recent_action: "Authored the Phase 3 task breakdown (planned)"
    next_safe_action: "Await Phase 2 (002-evidence-envelopes) completion, then begin Phase 3 implementation per"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Authored Structural-Fingerprint Cards

<!-- ANCHOR:notation -->
## Task Notation

Tasks use `T00N` identifiers in execution order. Each task cites its grounding source in `[SOURCE: ...]`. All tasks below are unchecked (`- [ ]`) because this packet's status is Planned -- implementation has not started and is blocked on Phase 2 (`002-evidence-envelopes`).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read Hallmark's `structure.md` six axes and `macrostructures/*` leaf shape as architecture-only grounding (read-only; external MIT source). [SOURCE: `../../001-research/004-hallmark-design-skill-research/research/` syntheses]
- [ ] T002 Read both synthesis documents' Eliminated Alternatives sections (`lineages/sol-opencode/research.md`, `lineages/sol-codex/research.md`) to confirm the never-copy rationale before authoring. [SOURCE: `../../001-research/004-hallmark-design-skill-research/research/` syntheses]
- [ ] T003 Apply the responsive-collapse decision fixed in spec.md REQ-003 (single shared gate, not baked per card) when scaffolding the card template, so no card authors a bespoke collapse rule. [SOURCE: spec.md REQ-003]
- [ ] T004 Scaffold the `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/` directory. [SOURCE: spec.md Files to Change]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author 6-8 independently-authored abstract structural-fingerprint cards, each covering all seven required fields (regions/composition; remaining rhythm axes; nav+footer pairing; applicability guard; responsive-collapse per T003; failure modes; evidence/stamp requirement). [SOURCE: spec.md REQ-001, REQ-002]
- [ ] T006 Author the load-on-demand index (card id + one-line applicability hint per card; explicit instruction to read only the one selected card). [SOURCE: spec.md REQ-004]
- [ ] T007 Author the stamp-based diversification check (read existing stamp before selection; exclude already-used cards), coordinated with the Phase 2 (`002-evidence-envelopes`) stamp/evidence mechanism. [SOURCE: spec.md REQ-006]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Grep the authored cards, index, and schema for any Hallmark catalog terms (21 macrostructure titles, N1-N13/Ft1-Ft8 codes, 20-name theme catalog, literal HTML/CSS sketches) and confirm zero hits. [SOURCE: spec.md REQ-005]
- [ ] T009 Register the new index in `sk-design/SKILL.md` so modes can discover it. [SOURCE: plan.md Phase 3]
- [ ] T010 Run `validate.sh --strict` against this spec folder and reconcile `checklist.md` with evidence. [SOURCE: CLAUDE.md Completion Verification Rule]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of T001-T010 complete with evidence; 6-8 cards, the index, and the stamp check exist; the responsive-collapse decision is applied consistently; zero Hallmark catalog terms present anywhere in the authored files; `validate.sh --strict` reports 0 errors; `checklist.md` is fully checked.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` REQ-001 through REQ-006
- `plan.md` Phase 1 through Phase 3
- `checklist.md` CHK-001 through CHK-012
- `../../001-research/004-hallmark-design-skill-research/research/` (grounding syntheses)
- `../002-evidence-envelopes/` (stamp/evidence mechanism dependency)
<!-- /ANCHOR:cross-refs -->
