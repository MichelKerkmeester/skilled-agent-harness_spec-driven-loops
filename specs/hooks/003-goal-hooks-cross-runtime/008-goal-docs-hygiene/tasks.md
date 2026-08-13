---
title: "Tasks: Goal docs hygiene + cross-runtime contracts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal docs hygiene tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-29T07:06:08Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete; docs updated, refs fixed, test repaired"
    next_safe_action: "Commit phase 008; final packet --recursive validate"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/mk-goal-tool-path.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
---
# Tasks: Goal docs hygiene + cross-runtime contracts

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirmed phases 001-007 landed; re-read the real artifact paths (goal core, `bin/goal.cjs`, capability matrix, devin/cursor/pi adapters).
- [x] T002 Grep-confirmed the stale references — found the 4 named plus 4 more (`SKILL.md`, `feature-catalog.md`, `hook-system.md`, manual-testing playbook) carrying the same form.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Fixed the stale flat-path reference in `goal-plugin.md` (3 occurrences + the dead RELATED packet path).
- [x] T004 [P] Fixed the stale `goal_opencode.md` references in `feature-catalog/ux-hooks/goal-opencode-plugin.md`.
- [x] T005 [P] Fixed `README.md:1063` `/goal_opencode` -> `/goal:goal-opencode`.
- [x] T006 [P] Fixed the `*goal*.md` glob in `goal-prompting-runtime-specific.md` to the `commands/goal/` subfolder + added the fifth-move history note.
- [x] T007 Repointed `mk-goal-tool-path.test.cjs` — test 8 regex to the subfolder path, test 9 to the archived `026-goal-opencode-plugin` graph. (Tests 1-6 stay env-gated on the absent `@opencode-ai/plugin` dep; unchanged.)
- [x] T008 Added the cross-runtime goal-hook entry to `injection-contract.md` (verbatim `[active_goal]` block + per-runtime channel/visibility: Devin/Cursor `[SYS]`, Pi `[MSG]`).
- [x] T009 Added the "Cross-Runtime Relationship" section to `goal-plugin.md` (shared-file model + capability tiers). No separate sibling doc was needed.
- [x] T010 Added the Devin/Cursor/Pi routing section to `goal-prompting-runtime-specific.md` (manage CLI + hook adapters + parity tiers).
- [x] T011 Updated `.opencode/hooks/goal/README.md` (authored earlier) — corrected the stale "no adapter wiring yet" Status/§2 to the built state.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 `node --test mk-goal-tool-path.test.cjs`: the 3 file-read tests (7/8/9) now pass; tests 1-6 fail only on the absent `@opencode-ai/plugin` dep (env-gated, unchanged, documented baseline confirms they pass with deps).
- [x] T013 Repo-wide grep: zero live `goal_opencode` / flat `commands/goal-opencode.md` hits outside the intentional constitutional history narrative and `z_archive`.
- [x] T014 `validate_document.py` on the substantively-edited docs: `injection-contract.md`, `goal/README.md`, both `ux-hooks` docs = 0 issues; `goal-plugin.md` and the constitutional file carry a PRE-EXISTING "missing overview section" warning (identical at HEAD; not introduced here).
- [x] T015 Updated `implementation-summary.md` with the real verification evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (test run, grep sweep, doc validation)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
