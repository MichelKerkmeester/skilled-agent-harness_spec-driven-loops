---
title: "Tasks: Phase 016 - Hub Routing Optimization"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 016 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/016-hub-routing-optimization"
    last_updated_at: "2026-07-06T21:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed; verification in progress"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hub-routing-optimization-016"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 016 - Hub Routing Optimization

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

- [x] T001 Read `mode-registry.json`/`hub-router.json` for sk-design, sk-code, sk-doc in full
- [x] T002 Read `command-metadata.json` in full
- [x] T003 Read live command frontmatter (`argument-hint`) for all 5 `/design:*` commands
- [x] T004 Confirm `defaultMode: "interface"` divergence is intentional per sk-design's own `SKILL.md` §2 (out of scope)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### mode-registry.json

- [x] T005 Version bump `1.2.0.0` -> `1.3.0.0`
- [x] T006 Add `advisorRoutingContract.command` doc string
- [x] T007 [P] Add `"command": "/design:interface"` to the interface mode
- [x] T008 [P] Add `"command": "/design:foundations"` to the foundations mode
- [x] T009 [P] Add `"command": "/design:motion"` to the motion mode
- [x] T010 [P] Add `"command": "/design:audit"` to the audit mode
- [x] T011 [P] Add `"command": "/design:md-generator"` to the md-generator mode

### hub-router.json

- [x] T012 Version bump `1.1.0.0` -> `1.2.0.0`
- [x] T013 [P] Add `"hub-identity"` to interface's `classes`
- [x] T014 [P] Add `"hub-identity"` to foundations' `classes`
- [x] T015 [P] Add `"hub-identity"` to motion's `classes`
- [x] T016 [P] Add `"hub-identity"` to audit's `classes`
- [x] T017 [P] Add `"hub-identity"` to md-generator's `classes`

### command-metadata.json

- [x] T018 [P] Sync `argumentHint`/`argumentGrammar` for `/design:audit`
- [x] T019 [P] Sync `argumentHint`/`argumentGrammar` for `/design:foundations`
- [x] T020 [P] Sync `argumentHint`/`argumentGrammar` for `/design:interface`
- [x] T021 [P] Sync `argumentHint`/`argumentGrammar` for `/design:md-generator`
- [x] T022 [P] Sync `argumentHint`/`argumentGrammar` for `/design:motion`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 JSON parse check on all 3 edited files
- [x] T024 Diff review confirming only additive changes (no removed/reordered field, weight, alias, or keyword)
- [x] T025 Run `validate.sh --strict` on this phase folder
- [x] T026 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Diff review confirms additive-only changes
- [x] `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Reference Pattern**: `.opencode/skills/sk-doc/mode-registry.json`, `.opencode/skills/sk-doc/hub-router.json`, `.opencode/skills/sk-code/hub-router.json`
<!-- /ANCHOR:cross-refs -->
