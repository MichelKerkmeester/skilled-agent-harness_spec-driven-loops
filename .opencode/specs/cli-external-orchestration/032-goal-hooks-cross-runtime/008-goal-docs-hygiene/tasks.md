---
title: "Tasks: Goal docs hygiene + cross-runtime contracts"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal docs hygiene tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 1 tasks for phase 008"
    next_safe_action: "Implement after phases 001-007 land, per phase-dependency order"
    blockers:
      - "Depends on phases 001-007 landing first."
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

- [ ] T001 [B] Confirm phases 001-007 have landed; re-read their real artifact paths (goal core, manage CLI, capability matrix, per-runtime adapters).
- [ ] T002 Grep-confirm the current line numbers/state of the 4 stale rename-fallout references, since they may have shifted since this spec was authored.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Fix the stale `goal_opencode`/flat-path reference in `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md`.
- [ ] T004 [P] Fix the stale `goal_opencode.md` references in `.opencode/skills/system-spec-kit/feature-catalog/ux-hooks/goal-opencode-plugin.md`.
- [ ] T005 [P] Fix the stale `/goal_opencode` reference at `README.md:1063`.
- [ ] T006 [P] Fix the `*goal*.md` glob instruction in `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` to account for the `commands/goal/` subfolder.
- [ ] T007 Repoint `.opencode/plugins/tests/mk-goal-tool-path.test.cjs:123` (and its related assertions) to the real current command path.
- [ ] T008 Add the devin/cursor/pi goal-hook entries to `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md` (verbatim `[active_goal]` block text + per-runtime visibility classification).
- [ ] T009 Update `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md`, or author `goal-cross-runtime.md`, with the shared-file state model and the phase 002 capability matrix.
- [ ] T010 Add the new per-runtime routing rows to `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` (devin/cursor/pi -> manage CLI + hook adapter).
- [ ] T011 Author `.opencode/hooks/goal/README.md` in the behavioral concern-README style (WHAT IT DOES AND INJECTS, verbatim text, visibility classes per runtime).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run `node --test` on `mk-goal-tool-path.test.cjs`, confirm pass.
- [ ] T013 Repo-wide grep for `goal_opencode` and the retired flat `commands/goal-opencode.md` form, confirm zero live hits outside git history.
- [ ] T014 Run `validate_document.py` on every touched/new documentation file, confirm 0 issues.
- [ ] T015 Update this packet's own `implementation-summary.md` with the real verification evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (test run, grep sweep, doc validation)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
