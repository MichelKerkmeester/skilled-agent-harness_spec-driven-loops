---
title: "Tasks: Phase 015 - Design Commands Router+Assets Implementation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 015 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/015-design-commands-implementation"
    last_updated_at: "2026-07-06T19:40:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All 30 tasks completed"
    next_safe_action: "Commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-commands-impl-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 015 - Design Commands Router+Assets Implementation

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read Phase 013's plan.md, decision-record.md, checklist.md in full
- [x] T002 Read all five current `/design:*` command files in full
- [x] T003 Read `create-command` SKILL.md and `command_presentation_template.md`
- [x] T004 Read the reference shape (`speckit/plan.md` + `speckit_plan_presentation.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Interface (reference shape)

- [x] T005 Write `interface.md` thin router
- [x] T006 Write `assets/design_interface_auto.yaml` - revised in place to add the procedure-card trigger table and Two-Pass Process steps after the initial shallow pass was corrected
- [x] T007 Write `assets/design_interface_confirm.yaml` - same revision applied
- [x] T008 Write `assets/design_interface_presentation.txt`

### Foundations

- [x] T009 [P] Write `foundations.md` thin router
- [x] T010 [P] Write `assets/design_foundations_auto.yaml` - revised in place with the procedure-card trigger table and Static-System Workflow
- [x] T011 [P] Write `assets/design_foundations_confirm.yaml` - same revision applied
- [x] T012 [P] Write `assets/design_foundations_presentation.txt`

### Motion

- [x] T013 [P] Write `motion.md` thin router
- [x] T014 [P] Write `assets/design_motion_auto.yaml` - revised in place with the procedure-card trigger table and Motion Design Workflow
- [x] T015 [P] Write `assets/design_motion_confirm.yaml` - same revision applied
- [x] T016 [P] Write `assets/design_motion_presentation.txt`

### Audit

- [x] T017 [P] Write `audit.md` thin router
- [x] T018 [P] Write `assets/design_audit_auto.yaml` - built with the procedure-card trigger table and 5-dimension Audit Workflow from the start
- [x] T019 [P] Write `assets/design_audit_confirm.yaml`
- [x] T020 [P] Write `assets/design_audit_presentation.txt`

### md-generator

- [x] T021 [P] Write `md-generator.md` thin router (Write/Edit/Bash tool surface preserved)
- [x] T022 [P] Write `assets/design_md-generator_auto.yaml` - names the real backend entrypoints (extract.ts/build-write-prompt.ts/validate.ts/report-gen.ts/preview-gen.ts/proof.ts) and guided-run.ts orchestrator
- [x] T023 [P] Write `assets/design_md-generator_confirm.yaml`
- [x] T024 [P] Write `assets/design_md-generator_presentation.txt`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T025 Structural diff: trace every original section to its destination asset, all 5 modes - sibling-discriminator bullets, deliverable fields, NEXT_OPTIONS, Cannot-run/Escalate/Route-instead conditions, register dials, task-projection verbs, and EXAMPLE usage all confirmed via targeted grep against `git show HEAD:<original>`
- [x] T026 Frontmatter diff: `description`/`argument-hint`/`allowed-tools` unchanged per mode - `description`/`allowed-tools` identical, `argument-hint` extended as a superset
- [x] T027 Confirm `git status` shows no edit under `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` - confirmed; the sk-doc dirty state present is pre-existing concurrent-session activity
- [x] T028 Run `validate.sh --strict` on this phase folder - PASSED after downgrading the folder from Level 3 to Level 2 (see plan.md Key Decisions)
- [x] T029 Update Phase 013's `implementation-summary.md` cross-reference to this phase
- [x] T030 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Structural diff confirms no behavior drift
- [x] `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design Source**: `../013-design-commands-asset-refactor/plan.md`, `../013-design-commands-asset-refactor/decision-record.md`
<!-- /ANCHOR:cross-refs -->
