---
title: "Tasks: Phase 2 subagent-handoff"
description: "Task ledger for the env-based subagent handoff added to pi-fast-mode-w-subagent-support."
trigger_phrases:
  - "002-subagent-handoff"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff"
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
# Tasks: Phase 2: subagent-handoff

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

- [ ] T101 [P] Add `HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"` export (src/types.ts)
- [ ] T102 Create `src/handoff.ts`: `readHandoff(env)` (`"1"`→true, `"0"`→false, else undefined) and `writeHandoff(desired, env)` (`"1"`/`"0"`), mutating the passed env in place (src/handoff.ts)
- [ ] T103 Create `tests/handoff.test.ts`: read/write round-trip, invalid/unset → undefined (tests/handoff.test.ts)
- [ ] T104 Run env-name collision grep (`PI_FAST_MODE_W_SUBAGENT_SUPPORT` vs existing vars) and record result
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T105 Write handoff env after `/fast` toggle handler persists config (src/index.ts)
- [ ] T106 Write handoff env when `--fast` flag applies on session_start (src/index.ts)
- [ ] T107 Implement session_start precedence: `--fast` flag > inherited handoff env > persisted config; write resolved value back to env; persist when env/persisted differ (src/index.ts)
- [ ] T108 Add precedence unit tests (flag override, env override, unset fallback, invalid-as-unset) (tests/handoff.test.ts)
- [ ] T109 Document handoff contract + precedence in README with an example (README.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T110 Run `npm run typecheck`; capture exit 0 (evidence → checklist.md)
- [ ] T111 Run `npm test`; capture exit 0 (evidence → checklist.md)
- [ ] T112 Manual two-process check: parent fast mode on → spawned child sees `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applies it on a supported model; record output
- [ ] T113 Record all evidence in `checklist.md` and mark phase docs complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Handoff criteria met: handoff tests pass; two-process propagation verified manually
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
