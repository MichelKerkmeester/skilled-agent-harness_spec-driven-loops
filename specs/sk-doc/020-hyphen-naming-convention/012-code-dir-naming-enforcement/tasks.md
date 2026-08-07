---
title: "Tasks: code-directory naming enforcement (020 phase 012)"
description: "Task breakdown for the code-dir naming-enforcement phase, mapped to REQ-001..006."
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement"
    last_updated_at: "2026-07-20T10:42:52Z"
    last_updated_by: "spec-author"
    recent_action: "Break the phase into planned tasks"
    next_safe_action: "Execute tasks in phase order"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py"
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

# Tasks: code-directory naming enforcement (020 phase 012)

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` planned (nothing built) · each task cites its phase + REQ.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Extend `filesystem-naming-convention.md`: leading-underscore clause + runner-dependent `__tests__/` rule. (REQ-001)
- [ ] T002 [P0] Build the shared code-dir naming checker in `shared/scripts/` with exemption-boundary fixtures. (REQ-002)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P0] Invoke the shared checker from `package_skill.py` over code dirs, not only `references/`/`assets/`. (REQ-002)
- [ ] T004 [P0] Extend `check_no_new_snake_case.py` to fail closed on non-exempt leading-underscore subdirs. (REQ-003)
- [ ] T005 [P1] Forward-point the 5 per-mode SKILL.md naming restatements at the shared canon. (REQ-004)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [P1] Rename `styles/{_db,_engine,_harness,__tests__}` -> `{db,engine,harness,tests}`; update all imports/refs. (REQ-005)
- [ ] T007 [P0] Run the DB + engine `node --test` suites green after the rename. (REQ-005)
- [ ] T008 [P1] Prove exempt classes still pass and a fresh `_x` dir is rejected. (REQ-006)

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Canon extended, shared checker wired into packaging + the repo-wide gate, `styles/` renamed with green tests, exempt classes preserved. All PLANNED until built.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements: `spec.md` §4. Plan: `plan.md` §4. Parent program: `../spec.md`. Canon: `../../../skills/sk-doc/shared/references/filesystem-naming-convention.md`.

<!-- /ANCHOR:cross-refs -->
