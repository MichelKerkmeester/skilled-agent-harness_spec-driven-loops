---
title: "Design Spike Tasks: Parent-Intent Projection"
description: "Tasks for prototyping and measuring the O8 parent-intent projection design against the pinned routing-accuracy corpus."
trigger_phrases:
  - "parent intent projection tasks"
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
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Design Spike Tasks: Parent-Intent Projection

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm phase 009's canonical `derived`-producer decision status; if still open, define and label an explicit scratch-only writer so this spike never becomes a third or fourth production writer of the `derived` block
- [ ] T-02 Confirm phase 002/006's pinned routing-accuracy corpus is available with a recorded exact hash, per research.md's warning that un-pinned baselines are version-sensitive and contradictory (research.md:89)
- [ ] T-03 Read `hub-router.json:36-49` (`vocabularyClasses`) and `mode-registry.json` for the sk-doc pilot hub end to end; enumerate every candidate phrase
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Build a fleet-wide phrase-frequency index across every hub's `hub-router.json.vocabularyClasses` and `mode-registry.json.modes[].aliases`
- [ ] T-05 Implement the specificity filter (`phraseSpecificity(phrase) >= 0.88`, i.e. 2+ tokens) and the distinctiveness filter (fleet-wide frequency indicates hub-exclusivity), reusing `scorer/text.ts` primitives rather than a new formula
- [ ] T-06 Rank survivors and truncate to a budget that respects `SkillDerivedV2Schema`'s `trigger_phrases` (<=24) / `keywords` (<=48) caps, with headroom reserved for phase 009's own generation output
- [ ] T-07 Write the selected phrases into a SCRATCH copy of the sk-doc hub's `graph-metadata.json.derived` only (never the live file), validated by `SkillDerivedV2Schema.parse()`
- [ ] T-08 Rebuild the skill-graph SQLite projection for the scratch copy and confirm zero lines changed in `scorer/lanes/*.ts` / `scorer/projection.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-09 Run the pinned 002/006 routing-accuracy corpus once against the current graph and once against the scratch-augmented graph; diff the two result sets for the sk-doc pilot hub
- [ ] T-10 Write `decision-record.md` recording the pre-registered ship bar, the measured outcome, and the ship/no-ship verdict
- [ ] T-11 If "no-ship," delete the scratch artifacts and record why the O8 hypothesis did not hold; if "ship," hand off scope to a new operator-gated implementation phase rather than wiring it in here
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Prototype exists only under this phase's scratch workspace; before/after parent-selection accuracy delta measured on the pinned corpus with an exact hash recorded; zero diff in `scorer/lanes/*.ts` / `scorer/projection.ts`; `decision-record.md` carries an explicit ship/no-ship verdict with rationale.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Decision `decision-record.md`
<!-- /ANCHOR:cross-refs -->
