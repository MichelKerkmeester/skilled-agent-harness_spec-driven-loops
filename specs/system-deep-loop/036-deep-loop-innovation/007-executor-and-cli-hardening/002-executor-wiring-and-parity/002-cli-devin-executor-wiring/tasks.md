---
title: "Tasks: cli devin executor wiring"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-devin executor tasks"
  - "devin executor task list"
  - "tasks core"
  - "041 cli devin tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/002-cli-devin-executor-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked landed cli-devin executor tasks complete"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-041-cli-devin-executor-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli devin executor wiring

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

- [x] T001 Capture live `devin --help` and `devin models list` surface, recorded in `plan.md`
- [x] T002 Confirm `devin` on PATH and `devin auth status` reports authenticated
- [x] T003 [P] Read the `cli-cursor` adapter as the reference shape in `fanout-run.cjs`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `cli-devin` to `EXECUTOR_KINDS`, flag support, and capability row at `executor-config.ts:11`
- [x] T005 Add `DEVIN_SUPPORTED_MODELS`, `DEVIN_DEFAULT_MODEL`, `isDevinModelAllowed()` at `executor-config.ts:314`
- [x] T006 Add `buildDevinLineageCommand()` and `isDevinBinaryAvailable()`, registered and exported in `fanout-run.cjs:1994`
- [x] T007 Extend audit tables with binary, state-env, home-dir, and env-prefix entries at `executor-audit.ts:57`
- [x] T008 Repair fan-out dispatch for the current devin CLI in commit `88ffed2893`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add cli-devin unit coverage; `vitest run -t "devin"` reports 9 passed
- [x] T010 Run both adapter test files; `vitest run` reports 198 passed (198)
- [ ] T011 Live `devin -p` smoke dispatch on `glm-5-2` [Deferred: needs an authenticated Devin account, external run pending]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All landed tasks marked `[x]`; live smoke `T011` deferred to an authenticated account
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed [Deferred: live smoke dispatch pending]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
