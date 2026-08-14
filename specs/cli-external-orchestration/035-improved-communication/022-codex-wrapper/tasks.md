---
title: "Tasks: Phase 022 Codex Wrapper"
description: "Planned task breakdown for wiring Codex output through the Phase 020 CLI-output wrapper, the Codex envelope mapping, and the gate and fallback verification."
trigger_phrases:
  - "codex-wrapper"
  - "tasks"
  - "codex output projection"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/022-codex-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Confirm the Codex headless/JSON-stream flag from its CLI, then author the adapter."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-022-codex-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 022 Codex Wrapper

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

- [x] T001 Identify Codex's actual headless and JSON-stream flags from `codex exec --help` and pin the CLI version (Codex CLI) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-codex.test.ts` name the seam and pin the capture shape]
- [x] T002 [P] Capture a byte-exact `codex exec --json` stream fixture and record its event envelope shape (`test/fixtures/`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-codex.test.ts` name the seam and pin the capture shape]
- [x] T003 Inventory the Phase 020 wrapper entry, the Codex adapter surface, and the test gate (`spec.md`, `plan.md`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-codex.test.ts` name the seam and pin the capture shape]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the Codex executor entry that runs `codex exec` headless in JSON-stream mode (Phase 020 wrapper) [evidence: implemented in `src/wrapper/stream-parsers/codex.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T005 Verify and extend the Codex runtime adapter mapping to the CLI JSON-stream envelope (`src/runtimes/codex.ts`) [evidence: implemented in `src/wrapper/stream-parsers/codex.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T006 Route the assembled message through `projectMessage()` (`Phase 020 wrapper`) [evidence: implemented in `src/wrapper/stream-parsers/codex.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T007 Gate the re-render on `isProjectionEnabled()` and fail open to the byte-exact original (Phase 020 wrapper) [evidence: implemented in `src/wrapper/stream-parsers/codex.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Test the Codex envelope mapping against the captured stream fixture (`test/`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T009 Test the enablement gate on and off paths (Phase 020 wrapper) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T010 Test the fail-open fallback for malformed events, rejected mappings, and projection errors (`test/`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T011 Confirm a headless Codex run projects when enabled and shows the byte-exact original when off or on failure (`test/`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T012 Run the wrapper test gate and strict packet validation (`checklist.md`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] A headless Codex run projects when enabled and shows the byte-exact original otherwise.
- [x] Canonical bytes, transcripts, and the captured stream are unchanged.
- [x] The wrapper test gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
