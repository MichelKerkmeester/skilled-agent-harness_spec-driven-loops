---
title: "Tasks: Rewire the relocated skill and give it a standalone identity"
description: "Task breakdown for the rewire + standalone-metadata phase."
trigger_phrases:
  - "rewire standalone tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/003-standalone-rewire-and-metadata"
    last_updated_at: "2026-08-19T05:51:14Z"
    last_updated_by: "spec-author"
    recent_action: "Fixed relocation path bugs, authored standalone metadata, proved 173/173 tests"
    next_safe_action: "Phase 004: fold the condensed design-knowledge layer"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Rewire the relocated skill and give it a standalone identity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scan the moved skill for depth-dependent path computation — found two: `output-policy.ts` `SKILLS_ROOT` (up-two, now wrong) and `corpus-baseline-v3.test.ts` manifest path (`../../../styles`).
- [x] T002 Confirm `styles` kept its relative depth under the skill — `styles/lib/paths.mjs` resolves self-relatively; no styles-side fix needed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Fix `backend/scripts/output-policy.ts` `SKILLS_ROOT` — `resolve(PACKAGE_ROOT, '..', '..')` → `resolve(PACKAGE_ROOT, '..')` (skill is one level shallower post-move).
- [x] T004 Fix `backend/tests/corpus-baseline-v3.test.ts:19` styles manifest path — `../../../styles/...` → `../../styles/...`.
- [x] T005 Author `graph-metadata.json` (advisor identity: skill_id, family, edges, domains, trigger_phrases spanning extraction + condensed design knowledge).
- [x] T006 Author `leaf-manifest.config.json` (leafRoots: references/assets/feature-catalog/manual-testing-playbook).
- [x] T007 Generate `leaf-manifest.json` + `leaf-aliases.json` via `generate-leaf-manifest.cjs --write` then `ci-skill-root-metadata.cjs --fix`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Backend suite green — `npm test` in `backend/` = 173/173 pass (19 files); the two fixes are a negative control (4/173 failed pre-fix, 0 after).
- [x] T009 Styles engine resolves — node import asserts `STYLES_ROOT` ends `sk-design-md-generator/styles`, retrieval manifest exists, DB root resolves.
- [x] T010 Class-S contract passes — `ci-skill-root-metadata.cjs` reports `sk-design-md-generator [S]` PASS; forbidden hub files (`description.json`/`mode-registry.json`/`hub-router.json`) absent. Only fleet failure is the doomed `sk-design` hub (expected transient).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] 173/173 backend tests pass from the standalone root
- [x] `ci-skill-root-metadata` passes Class-S for the new skill
- [x] `validate.sh --strict` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
