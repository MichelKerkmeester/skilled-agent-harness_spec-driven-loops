---
title: "Task Breakdown: Parent-Hub Vocabulary Compatibility Measurement"
description: "Task breakdown for the three read-only measurement assets (collision report, projection-surface coverage, labeled ambiguity fixture) plus scaffold and integration. Read-only; no vocab/metadata/scorer change."
trigger_phrases:
  - "parent hub vocab compat tasks"
importance_tier: "medium"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/009-parent-hub-vocab-compat"
    last_updated_at: "2026-07-07T18:33:59.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Task breakdown authored; scaffold + fixture done, 2 assets in flight"
    next_safe_action: "Integrate agent assets; generate metadata; validate --strict; commit"
---
# Task Breakdown: Parent-Hub Vocabulary Compatibility Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done · `[ ]` pending · `[~]` in progress. Each task names its deliverable file.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Author `spec.md` (Level-2, 10 anchors).
- [x] T002 Author `plan.md`.
- [x] T003 Author `tasks.md`.
- [x] T004 Author `checklist.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T005 `collision-report.md` — cross-hub collision matrix (four-class taxonomy) + demotion shortlist. 4 stale surfaces, 0 symmetric collisions.
- [x] T006 `projection-coverage.md` — per-mode alias→projected-field coverage + typed-but-unprojected flags. 38 of 155 aliases dark.
- [x] T007 `ambiguity-fixture.md` — labeled dataset (25 cross-hub rows + gold-none slice), baseline 15/25 = 0.60.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T008 Reconcile agent assets for accuracy + consistency with the shared hub-ownership basis. Spec R2 updated to defer to the report's authoritative 4-surface list.
- [ ] T009 Generate `description.json` + `graph-metadata.json` (daemon-free backfill); register 009 under the 012 parent.
- [ ] T010 `validate.sh --strict` → Errors 0; finalize `implementation-summary.md` evidence.
- [ ] T011 Commit via isolated scratch-index push, blast-radius gated to this folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
Done when all three assets exist + are evidence-anchored, `validate.sh --strict` is Errors 0, and the packet is registered under the parent and pushed. Fixture wiring + vocab patch are explicitly gated (WU-3), not part of this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-references
- `spec.md` (requirements R1–R5), `plan.md` (phases), `checklist.md` (verification).
- Downstream gated: WU-3 Layer-1b vocab patch on `deep-loop-workflows/{graph-metadata.json,mode-registry.json}`.
<!-- /ANCHOR:cross-refs -->
