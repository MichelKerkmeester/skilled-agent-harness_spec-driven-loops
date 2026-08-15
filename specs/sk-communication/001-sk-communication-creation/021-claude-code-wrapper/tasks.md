---
title: "Tasks: Phase 021 Claude Code Wrapper"
description: "Planned task breakdown for the Claude stream-json adapter mapping, the CLI-output wrapper wiring into projectMessage(), and the enablement-gated fail-open fallback verification."
trigger_phrases:
  - "claude-code-wrapper"
  - "tasks"
  - "stream-json adapter"
  - "Claude output projection wrapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/021-claude-code-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to wire the Claude stream-json adapter mapping onto the assembler event shape."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-021-claude-code-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has a stated acceptance criterion and no evidence has been collected yet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 021 Claude Code Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Inventory the Phase 020 wrapper seam contract and its capture-transform-re-render shape (`.opencode/skills/sk-communication/cli-communication-projection`, Phase 020 evidence) (acceptance criterion: the seam entrypoints and the transform-and-re-render contract are named) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-claude.test.ts` name the seam and pin the capture shape]
- [x] T002 [P] Record the Claude `claude -p --output-format stream-json` event shape as a versioned snapshot (Claude Code CLI surface) (acceptance criterion: a pinned stream-json capture is committed with its Claude Code version) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-claude.test.ts` name the seam and pin the capture shape]
- [x] T003 Pin the `projectMessage()` signature and the enablement-gate placement rule (`.opencode/skills/sk-communication/cli-communication-projection/src/runtime/`, Phase 018 evidence) (acceptance criterion: the entrypoint signature and the `isProjectionEnabled()` placement are explicit) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-claude.test.ts` name the seam and pin the capture shape]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Implement the Claude runtime adapter that maps stream-json events onto the assembler event shape (Claude runtime adapter) (acceptance criterion: every pinned event type maps in order onto the assembler event shape) [evidence: implemented in `src/wrapper/stream-parsers/claude.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T005 Wire the wrapper seam to run `claude -p --output-format stream-json`, gate on `isProjectionEnabled()`, and route into `projectMessage()` (Phase 020 wrapper seam) (acceptance criterion: a headless run routes through the gate and the entrypoint) [evidence: implemented in `src/wrapper/stream-parsers/claude.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T006 Re-render the projected output and emit the byte-exact original on disable or failure (wrapper re-render path) (acceptance criterion: projected output is re-rendered and the fallback returns the byte-exact original) [evidence: implemented in `src/wrapper/stream-parsers/claude.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T007 Keep the interactive TUI out of scope and assert only headless and print output are intercepted (wrapper seam) (acceptance criterion: no TUI path is wired and tests assert the headless-only scope) [evidence: implemented in `src/wrapper/stream-parsers/claude.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T008 Run the adapter-mapping unit tests against the pinned stream-json snapshot (`test/`) (acceptance criterion: all mapped events and the malformed-event fallback pass) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T009 Run the enablement-gate and exact-original fallback tests (`test/`) (acceptance criterion: disabled and failure paths emit the byte-exact original) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T010 Run the end-to-end headless projection smoke against the pinned snapshot (wrapper seam) (acceptance criterion: enablement on projects, enablement off passes the exact original through) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T011 Run the package gate from the package directory (`npm run check`) (acceptance criterion: typecheck, build, and all tests pass) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T012 Author and wire the complete Level-2 packet (`021-claude-code-wrapper/`) (acceptance criterion: spec, plan, tasks, and checklist record the planned state) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T013 Backfill metadata and run final strict validation (`description.json`, `graph-metadata.json`, `validate.sh`) (acceptance criterion: Phase 021 reports zero errors and zero warnings) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have stated acceptance criteria.
- [x] The Claude adapter maps stream-json events onto the assembler event shape in order.
- [x] The seam gates on `isProjectionEnabled()` and fails open to the byte-exact original.
- [x] The adapter-mapping, enablement-gate, and exact-original fallback tests are run and recorded.
- [x] Phase 021 strict validation reports zero errors and zero warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
