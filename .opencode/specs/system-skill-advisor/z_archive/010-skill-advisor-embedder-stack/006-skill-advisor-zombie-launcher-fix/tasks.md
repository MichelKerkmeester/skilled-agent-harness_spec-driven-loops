---
title: "Tasks: Skill-Advisor Zombie Launcher Fix"
description: "Execution checklist for Phase 007 root-cause investigation, launcher guard implementation, regression testing, and verification handoff."
trigger_phrases:
  - "007 zombie launcher tasks"
  - "skill-advisor launcher tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/006-skill-advisor-zombie-launcher-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented launcher guard"
    next_safe_action: "Commit explicit scoped paths"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill-Advisor Zombie Launcher Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete with evidence
- `[!]` Blocked with reason
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Gate 3 packet path: `007-skill-advisor-zombie-launcher-fix/` supplied by user.
- [x] T002 Read target launcher files before edits: skill-advisor, code-index, spec-memory.
- [x] T003 Read daemon SQLite lease and lifecycle code before edits.
- [x] T004 Read existing `launcher-lease.vitest.ts` fixture and coverage.
- [x] T005 Check in-scope file worktree state before patching.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add local PID lease ownership to `mk-skill-advisor-launcher.cjs`.
- [x] T011 Preserve daemon SQLite lease probing and legacy path reporting.
- [x] T012 Serialize the pre-spawn acquisition window so duplicates cannot pass before the first owner writes the PID guard.
- [x] T013 Update the launcher test fixture so the launcher owns `.mk-skill-advisor-launcher.json`.
- [x] T014 Add `007-REQ-001` spawn-three zombie-prevention test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck`.
- [x] T021 Run `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease`.
- [x] T022 Run local spawn-three smoke check or document sandbox blocker.
- [x] T023 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <007> --strict`.
- [x] T024 Refresh metadata after final doc updates if needed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T030 Fill implementation-summary root cause, fix, verification, and limitations.
- [x] T031 Mark checklist items with evidence.
- [x] T032 Attempt explicit-path `git add` only after verification; documented sandbox blocker in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

| Item | Reference |
|------|-----------|
| Parent arc invariant | `../spec.md` Cross-Cutting Invariants |
| Phase 006 predecessor | `../006-lease-canonicalization-and-cleanup-ordering/spec.md` |
| Launcher implementation | `.opencode/bin/mk-skill-advisor-launcher.cjs` |
| Focused test | `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` |
<!-- /ANCHOR:cross-refs -->
