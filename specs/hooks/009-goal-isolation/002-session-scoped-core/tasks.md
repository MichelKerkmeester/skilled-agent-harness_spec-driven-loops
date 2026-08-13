---
title: "Tasks: Session-Scoped Goal Core"
description: "Test-first tasks for the shared core, CLI, and isolated persistence contract."
trigger_phrases:
  - "goal core tasks"
  - "session scope implementation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation/002-session-scoped-core"
    last_updated_at: "2026-08-10T14:12:18Z"
    last_updated_by: "codex"
    recent_action: "Completed all scoped-core tasks and objective verification"
    next_safe_action: "Hand the stable scope contract to Phase 3 runtime adapters"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Session-Scoped Goal Core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete with evidence |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reconcile requirements with Phase 1 synthesis.
  - Evidence: scope is `{workspace, runtime, sessionId}`; filenames use opaque SHA-256 identity; missing identity and legacy-only state never fall back to an active record.
- [x] T002 Inventory every core export and CLI command.
  - Evidence: every lifecycle export now consumes `rawOptions.scope`; `doctorStats` is the only aggregate-only operation, and every CLI current-session action validates explicit binding first.
- [x] T003 Record baseline test counts and singleton failure.
  - Evidence: baseline core suite was 29/29; the negative control was 29 pass and 7 fail across 36 tests, including unbound writes, shared replacement, and legacy fallback.
- [x] T004 Add failing two-session, namespace, missing-id, resume/fork, malicious-id, malformed, and legacy-only rows.
  - Evidence: the final focused suite contains 42 passing tests, including all required identity and state boundaries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement the shared scope resolver and opaque path derivation.
  - Evidence: `resolveGoalScope()` validates runtime/session identity and derives full SHA-256 state and archive keys.
- [x] T006 Convert active state, history, and every lifecycle operation to scope.
  - Evidence: the 42/42 focused suite exercises scoped set, read, show, record, pause, resume, complete, clear, and history operations.
- [x] T007 Preserve atomic writes and restrictive modes.
  - Evidence: active/archive files are `0600`, directories are `0700`, concurrent writers leave valid JSON and no `.tmp` residue.
- [x] T008 Convert CLI identity parsing, errors, and diagnostics.
  - Evidence: `--runtime`, `--session`, and `--workspace` are parsed independently of action order; missing bindings return stable codes and no writes.
- [x] T009 Add legacy detection without automatic ownership binding.
  - Evidence: legacy-only state returns no scoped goal, remains byte-equivalent, and appears only as `legacy_state_present` in aggregate diagnostics.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove non-owner byte equivalence through all mutations.
  - Evidence: the 42/42 focused suite proves the Session B file remains byte-equivalent while Session A is recorded, paused, resumed, completed, replaced, and cleared.
- [x] T011 Run concurrency, permission, malformed-state, and privacy checks.
  - Evidence: 42/42 tests pass the twelve-writer, mode, corruption recovery, opaque-path, and aggregate-output cases.
- [x] T012 Run the existing core and OpenCode plugin regression suites.
  - Evidence: scoped core/CLI 42/42; OpenCode plugin 119/119 after repairing its stale moved-reference test path.
- [x] T013 Record test counts and hand off the stable core contract to Phase 3.
  - Evidence: `node --check` passes for four targets; alignment drift, comment hygiene, diff review, and both test suites also pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are complete and no identity path guesses.
- [x] Two concurrent session goals remain independent.
- [x] No passive singleton fallback remains.
- [x] Focused validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-goal-isolation-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
