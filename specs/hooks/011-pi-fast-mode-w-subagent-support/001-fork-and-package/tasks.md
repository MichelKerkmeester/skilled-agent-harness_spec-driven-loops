---
title: "Tasks: Phase 1 fork-and-package"
description: "Task ledger for the identity-only fork of pi-openai-fast-mode into pi-fast-mode-w-subagent-support."
trigger_phrases:
  - "001-fork-and-package"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs"
    next_safe_action: "Execute phase plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 1: fork-and-package

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Decide fork layout (repo root vs `packages/` subdir) and create the working directory
- [ ] T002 Copy upstream source from `context/pi-openai-fast-mode/` excluding `.git` (src/, tests/, tsconfig.json, package.json, package-lock.json, README.md, LICENSE, .gitignore)
- [ ] T003 [P] Run `npm install` in the fork and confirm the lockfile is generated
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename `package.json`: name → `pi-fast-mode-w-subagent-support`, description, keywords, repository (package.json)
- [ ] T005 Rename `PACKAGE_NAME` and `STATUS_KEY` in `src/types.ts` (src/types.ts)
- [ ] T006 Grep tests and src for identity literals (`pi-openai-fast-mode`, `openai-fast-mode`); update deliberately if present, flag any test expectation changes (tests/, src/)
- [ ] T007 Rewrite README: new identity, install/usage wording, provenance section citing upstream commit `9b28456` (README.md)
- [ ] T008 Confirm `pi` extension entry still points at `./src/index.ts` (package.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `npm run typecheck`; capture exit 0 (evidence → checklist.md)
- [ ] T010 Run `npm test` (unmodified upstream suite); capture exit 0 (evidence → checklist.md)
- [ ] T011 Run `rg -n "pi-openai-fast-mode" src/ tests/ README.md`; confirm only provenance hits remain
- [ ] T012 Run `npm pack --dry-run`; confirm tarball name and file list
- [ ] T013 Record all evidence in `checklist.md` and mark phase docs complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Handoff criteria met: typecheck 0, upstream tests 0, rename greps clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
