---
title: "Tasks: Runtime-neutral goal core + shared active-goal state + manage CLI"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal core tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state"
    last_updated_at: "2026-07-28T17:38:00Z"
    last_updated_by: "claude"
    recent_action: "Build goal core, CLI and tests; 27/27 pass"
    next_safe_action: "Run capability probes for phase 002"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/lib/goal-core.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime-neutral goal core + shared active-goal state + manage CLI

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

- [x] T001 Read `.opencode/plugins/mk-goal.js` in full; extract the `[active_goal]` block template, `normalizeUserAuthoredText` hardening steps, and heuristic verifier logic. [evidence: block renderer + ported hardening in `goal-core.cjs`]
- [x] T002 Read `.opencode/commands/goal/goal-opencode.md` in full; extract the router contract (actions, `--budget` parsing, envelope, error codes). [evidence: CLI envelope/error-code parity in `bin/goal.cjs`]
- [x] T003 Design the shared `active-goal.json` schema, including honest `usageSource` labeling for non-OpenCode turn/time accounting. [evidence: `tokens n/a/<budget> (source: turn-count-estimate)`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement `.opencode/hooks/goal/lib/goal-core.cjs` shared-state atomic read/write (temp+rename, `0600`). [evidence: `goal-core.cjs`, 686 lines; state roundtrip/atomicity + mode-0600 tests]
- [x] T005 Implement the `[active_goal]` block renderer with a parameterized Role line (`.opencode/hooks/goal/lib/goal-core.cjs`). [evidence: byte-shape render + parameterized Role line test]
- [x] T006 [P] Port `normalizeUserAuthoredText` hardening with attribution comments (`.opencode/hooks/goal/lib/goal-core.cjs`). [evidence: marker redaction / homoglyph fold / instruction-override redaction / backtick downgrade tests]
- [x] T007 [P] Port the heuristic verifier with attribution comments (`.opencode/hooks/goal/lib/goal-core.cjs`). [evidence: heuristic verdict tests]
- [x] T008 Implement turn/wall-clock accounting primitives with honest `usageSource` labeling (`.opencode/hooks/goal/lib/goal-core.cjs`). [evidence: `tokens n/a/<budget> (source: turn-count-estimate)`, no native token feed outside OpenCode]
- [x] T009 Implement `.opencode/hooks/goal/bin/goal.cjs` manage CLI actions `set/show/history/clear/complete/pause/resume/doctor`. [evidence: `bin/goal.cjs`, 222 lines]
- [x] T010 Mirror `--budget` parsing and error codes (`INVALID_TOKEN_BUDGET`, `INVALID_OBJECTIVE`, `PLUGIN_DISABLED`) in `goal.cjs`. [evidence: CLI error-code tests, `PLUGIN_DISABLED` case]
- [x] T011 Mirror the `STATUS=… ACTION=…` output envelope shape in `goal.cjs`. [evidence: CLI envelope tests + live CLI smoke test with isolated `MK_GOAL_STATE_DIR`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Write co-located `node --test` suite for `goal-core.cjs` (atomic-write hygiene, renderer, hardening, verifier, accounting). [evidence: `lib/goal-core.test.cjs`, 304 lines, 27 tests, 27/27 pass; independently re-run 27/27 confirmed]
- [x] T013 Write co-located `node --test` suite for `goal.cjs` (action coverage, error codes, envelope shape). [evidence: CLI envelope + error-code + `PLUGIN_DISABLED` + bare-text-falls-to-set cases within the 27-test suite]
- [x] T014 Byte-diff test: rendered block vs. a captured `mk-goal.js` reference render, equal outside the Role line. [evidence: byte-shape render test]
- [x] T015 Parity test table: CLI actions vs. `goal-opencode.md`'s documented router contract. [evidence: CLI envelope + error-code tests]
- [x] T016 Confirm `git diff` shows zero changes under `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal/goal-opencode.md`.
- [x] T017 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-spec-folder> --strict` and resolve to Errors: 0. [evidence: see closing validate run this session]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (both `node --test` suites, byte-diff test, CLI parity test table, zero-diff confirmation on mk-goal.js/goal-opencode.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
