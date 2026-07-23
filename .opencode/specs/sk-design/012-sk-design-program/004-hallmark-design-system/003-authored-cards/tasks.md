---
title: "Tasks: Authored Structural-Fingerprint Cards"
description: "Completed task breakdown for the seven structural-fingerprint cards, load-on-demand index, and evidence-envelope diversification check."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards"
    last_updated_at: "2026-07-22T18:39:18Z"

    last_updated_by: "implementation-agent"
    recent_action: "Completed all authored-card implementation tasks"
    next_safe_action: "Load one unused card through the registered index when structure work begins"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/shared/references/structural-fingerprint-cards/index.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Authored Structural-Fingerprint Cards

<!-- ANCHOR:notation -->
## Task Notation

Tasks use `T00N` identifiers in execution order. Each task cites its grounding source and completed evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Ground the six structural axes and leaf-card shape in the two research syntheses without reading the unavailable raw clone. [SOURCE: `../../001-research/004-hallmark-design-skill-research/research/` syntheses] [EVIDENCE: both lineage `research.md` files read before authoring]
- [x] T002 Read both synthesis documents' Eliminated Alternatives sections to confirm the never-copy rationale before authoring. [SOURCE: `../../001-research/004-hallmark-design-skill-research/research/` syntheses] [EVIDENCE: both sections reject catalog import and permit only clean-room loading architecture]
- [x] T003 Apply the responsive-collapse decision fixed in spec.md REQ-003 (single shared gate, not baked per card) when scaffolding the card template. [SOURCE: spec.md REQ-003] [EVIDENCE: `schema.md` section 3 and field 5 in every card delegate to the shared gate]
- [x] T004 Scaffold the `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/` directory. [SOURCE: spec.md Files to Change] [EVIDENCE: directory contains `schema.md`, `index.md`, and seven card files]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author seven independently-authored abstract structural-fingerprint cards, each covering all seven required fields. [SOURCE: spec.md REQ-001, REQ-002] [EVIDENCE: seven `card-*.md` files; conformance audit reports PASS 7/7 for every card]
- [x] T006 Author the load-on-demand index with card id, one-line applicability hint, and a read-only-the-selected-card rule. [SOURCE: spec.md REQ-004] [EVIDENCE: `index.md` sections 1 and 2]
- [x] T007 Author the diversification check by reusing the Phase 2 evidence-envelope shape. [SOURCE: spec.md REQ-006] [EVIDENCE: `index.md` sections 3-6 define one versioned `structuralFingerprintSelections` collection, field contract, validation, and authority boundary]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the required exclusion grep across the authored cards, index, and schema. [SOURCE: spec.md REQ-005] [EVIDENCE: `grep -rniE 'N[0-9]{1,2}\\b|Ft[0-9]|hallmark'` returned no lines and exit 1, meaning zero matches]
- [x] T009 Register the new index in `sk-design/SKILL.md` so modes can discover it. [SOURCE: plan.md Phase 3] [EVIDENCE: one new Structural decisions bullet in `SKILL.md` names the index, stamp exclusion, and load-one-card rule]
- [x] T010 Run `validate.sh --strict` against this spec folder and reconcile `checklist.md` with evidence. [SOURCE: completion verification rule] [EVIDENCE: final strict validation output recorded in `implementation-summary.md` Verification]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All of T001-T010 are complete with evidence. Seven cards, the index, and the shared evidence-envelope diversification check exist; the shared responsive gate is applied consistently; the exclusion grep has zero matches; and the strict validator is the final completion gate.
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
