---
title: "Tasks: Phase 025 Cursor Output Wrapper"
description: "Planned task breakdown for wiring Cursor into the Phase 020 CLI-output wrapper, confirming the cursor-agent print flag, and verifying the adapter mapping, enablement gate, and fail-open fallback."
trigger_phrases:
  - "cursor-wrapper"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/025-cursor-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 by confirming the cursor-agent non-interactive print flag from its CLI."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-cursor-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 025 Cursor Output Wrapper

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
## Phase 1: Setup

- [x] T001 Confirm the `cursor-agent` non-interactive print flag and the pinned version from its CLI (`cursor-agent` CLI) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-cursor.test.ts` name the seam and pin the capture shape]
- [x] T002 Inventory the Phase 020 wrapper seam, the Cursor adapter mapping, and the `projectMessage()` terminal set (Phase 020 wrapper, `cursorRuntimeAdapter`, `projectMessage()`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-cursor.test.ts` name the seam and pin the capture shape]
- [x] T003 Freeze the captured-stdout event shape against the assembler event contract (`spec.md`, `plan.md`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-cursor.test.ts` name the seam and pin the capture shape]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Wire the Cursor seam into the Phase 020 wrapper: capture non-interactive stdout as the canonical original (Phase 020 wrapper Cursor seam) [evidence: implemented in `src/wrapper/stream-parsers/cursor.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T005 Route the captured stdout through `cursorRuntimeAdapter` onto the assembler event shape (Phase 020 wrapper Cursor seam) [evidence: implemented in `src/wrapper/stream-parsers/cursor.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T006 Gate projection behind `isProjectionEnabled()` and call `projectMessage()` for every accepted capture (Phase 020 wrapper Cursor seam) [evidence: implemented in `src/wrapper/stream-parsers/cursor.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T007 Re-render the projected message on accept and the byte-exact original on every other terminal (Phase 020 wrapper Cursor seam) [evidence: implemented in `src/wrapper/stream-parsers/cursor.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify the adapter maps captured stdout onto the assembler event shape (`cursorRuntimeAdapter` tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T009 Verify the flag-off path returns the byte-exact original without an entrypoint call (enablement-gate tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T010 Verify capture, adapter, gate, and entrypoint error terminals re-render the byte-exact original (fail-open-fallback tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T011 Run the Phase 020 wrapper gate and confirm no canonical or transcript change (Phase 020 wrapper) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T012 Run strict packet validation and backfill graph metadata (`checklist.md`, `graph-metadata.json`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] The flag-on run renders the projected output; the flag-off or failed run renders the byte-exact original.
- [x] The confirmed `cursor-agent` print flag backs the capture invocation.
- [x] The wrapper gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
