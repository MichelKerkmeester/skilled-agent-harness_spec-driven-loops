---
title: "Tasks: Phase 5: comment-extraction"
description: "Extract instructional template comments into sidecars, preserve level markers, enforce measured byte budgets, and verify the reviewed snapshot reduction."
trigger_phrases:
  - "comment extraction tasks"
  - "instructional comment sidecars"
  - "template byte budget"
  - "marker preservation"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 5: comment-extraction

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-001, REQ-002] Inventory instructional comments and load-bearing markers (`.opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl`); done when every targeted comment class is listed separately from `SPECKIT_LEVEL` and `SPECKIT_TEMPLATE_SOURCE`.
- [ ] T002 [REQ-003] Recompute rendered baselines with the real renderer (`.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh`, `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`); done when the 3,852 B, 3,028 B, and 5,964 B ceilings are confirmed or corrected from measured output.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [REQ-001, REQ-004] Create sidecar guidance and link it from the author guide (`.opencode/skills/system-spec-kit/templates/manifest/guidance/`, `.opencode/skills/system-spec-kit/references/templates/template-guide.md`); done when each removed instructional block has discoverable guidance.
- [ ] T004 [REQ-001, REQ-002] Strip instructional comments while retaining required markers (`.opencode/skills/system-spec-kit/templates/manifest/*.md.tmpl`); done when the renderer receives no SELF-CHECK, FAILURE-MODES, voice-guide, or footer-size comments and marker resolution remains intact.
- [ ] T005 [REQ-003] Add per-document byte-budget assertions and rebaseline snapshots (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`, `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`); done when output above any ceiling fails and the snapshot records only intended reductions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [REQ-001, REQ-002] Render fresh scaffolds at every supported level (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`, `.opencode/skills/system-spec-kit/templates/manifest/`); done when no targeted instructional comment appears and both required markers still resolve.
- [ ] T007 [REQ-003] Run the snapshot and byte-budget suite (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`); done when all measured documents meet their ceilings and the reviewed diff contains no unrelated output change.
- [ ] T008 [REQ-004] Verify sidecar discoverability and unchanged renderer scope (`.opencode/skills/system-spec-kit/references/templates/template-guide.md`, `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh`); done when the guide links the sidecars and the renderer has no phase change.
- [ ] T009 [REQ-001, REQ-002, REQ-003, REQ-004] Record the phase acceptance evidence (`005-comment-extraction/spec.md`); done when all four requirements have evidence and the measured reduction is tied to the real renderer output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001 through REQ-004 each have a completed mapped task and evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../004-continuity-single-source/`
<!-- /ANCHOR:cross-refs -->
