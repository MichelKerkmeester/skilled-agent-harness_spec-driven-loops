---
title: "Tasks: sk-design md-generator authoring boundary and family cleanup"
description: "Task list for the final 009 phase: added the md-generator authoring-boundary reference and source-of-truth router card, fixed the stale design-audit changelog pointer, and ran the family-wide closeout. All build tasks done, the family --check passes clean."
trigger_phrases:
  - "sk-design md-generator boundary tasks"
  - "design family validation closeout tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/013-mdgen-boundary-cleanup"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all build tasks and wired the two md-gen files into the SKILL.md router"
    next_safe_action: "Family build complete pending commit, advisor rebuild deferred and run anytime"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-013-mdgen-boundary-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design md-generator authoring boundary and family cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `../009-reference-asset-expansion/research/research.md` section 3.6 and section 7 as the grounding rationale
- [x] T002 Confirm the md-generator `references/` and `assets/` homes on the live `sk-design/` tree
- [x] T003 Confirm `design-audit/SKILL.md` section 8 cites the removed `changelog/v1.0.0.1.md` and that `changelog/v1.0.0.0.md` exists
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Authored `references/authoring_boundary.md` (121 lines) covering measured vs brief-provided vs inferred vs absent, protecting the cardinal fidelity rule, documentation only with forward-authoring explicitly out of scope, and wired into the md-generator SKILL.md router (`.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md`)
- [x] T005 [P] Authored `assets/source_of_truth_router_card.md` (82 lines), the quick card asking measured / brief-provided / inferred / missing to prevent fabricated values, and wired into the md-generator SKILL.md router (`.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md`)
- [x] T006 Repointed the section 8 changelog reference from `changelog/v1.0.0.1.md` to `changelog/v1.0.0.0.md`, zero stale refs remain (`.opencode/skills/sk-design/design-audit/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Ran `package_skill --check` on the hub and all five sk-design mode packets (design-interface, design-foundations, design-motion, design-audit, design-md-generator), exit 0, all design content across phases 010-013 HVR-clean
- [x] T008 Ran `validate.sh` across the family and recorded the closeout acceptance. The skill-advisor rebuild was deferred on purpose, not skipped: phases 010-013 added references and assets and wired routers but changed no mode advisor-routable identity (name, description, keywords), so the advisor index does not need rebuilding, and a rebuild was avoided to not collide with concurrent advisor work on this branch. The operator can run `advisor_rebuild` anytime if desired
- [x] T009 Confirmed the two flagged build-time decisions were settled in the earlier phases: three-dials ownership (VISUAL_DENSITY to foundations, DESIGN_VARIANCE and the dials intake to interface, MOTION_INTENSITY to motion) and N1/N2 owning home (interface-owned and authored once, audit references by path)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The family closeout (package-check, `validate.sh`) passes and is recorded as the acceptance evidence, with the advisor rebuild deferred on purpose

### Status note

This packet is EXECUTED. The md-generator gained `references/authoring_boundary.md` (121 lines, source-of-truth boundary documentation with forward-authoring explicitly out of scope) and `assets/source_of_truth_router_card.md` (82 lines, the four-question card), both wired into the md-generator SKILL.md router and byte-unchanged against the cardinal fidelity rule. The `design-audit/SKILL.md` section 8 stale changelog pointer `v1.0.0.1.md` was repointed to `v1.0.0.0.md`, the only changelog file that exists, and zero stale refs remain. The family closeout ran `package_skill --check` on the hub and all five mode packets (design-interface, design-foundations, design-motion, design-audit, design-md-generator) to exit 0, with all design content across phases 010-013 HVR-clean, and `validate.sh` passes across the family. The skill-advisor rebuild was deferred on purpose because phases 010-013 changed no mode advisor-routable identity and a rebuild was avoided to not collide with concurrent advisor work on this branch. The operator can run `advisor_rebuild` anytime.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See `../009-reference-asset-expansion/research/research.md` (section 3.6, section 7)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
