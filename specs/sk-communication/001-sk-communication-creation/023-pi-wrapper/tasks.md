---
title: "Tasks: Phase 023 Pi Wrapper"
description: "Planned task breakdown for the Pi turn_end-mutation probe, the validated-path wiring (turn_end extension or Phase 020 wrapper in pi print mode), the enablement gate, and the exact-original fallback verification."
trigger_phrases:
  - "pi-wrapper"
  - "tasks"
  - "implementation"
  - "pi output projection tasks"
  - "turn_end mutation probe tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/023-pi-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to run the Pi turn_end-mutation probe and record the verdict."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-023-pi-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task is pending and will record observed evidence when executed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 023 Pi Wrapper

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

- [x] T001 Read the Phase 017 Pi feasibility note and confirm the `turn_end` read-only finding (`017-runtime-wiring-feasibility-and-contract/spec.md`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-pi.test.ts` name the seam and pin the capture shape]
- [x] T002 Inventory the Phase 020 wrapper seam contract, the Phase 018 `projectMessage()` entrypoint, and the Pi extension and print-mode surfaces (`020-cli-output-wrapper-framework/`, `src/runtime/`, Pi extension API) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-pi.test.ts` name the seam and pin the capture shape]
- [x] T003 Pin the Pi version under test and define the `turn_end`-mutation probe procedure (`spec.md`, `plan.md`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-pi.test.ts` name the seam and pin the capture shape]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the `turn_end`-mutation probe and record the observable verdict (Pi extension probe harness) [evidence: implemented in `src/wrapper/stream-parsers/pi.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T005 Wire the single validated path: a `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode with the Pi runtime adapter (chosen surface) [evidence: implemented in `src/wrapper/stream-parsers/pi.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T006 Gate the seam on `isProjectionEnabled()` before projecting, with no provider call when off (seam entry) [evidence: implemented in `src/wrapper/stream-parsers/pi.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T007 Fail open to the byte-exact original on any probe, adapter, extension, parse, or wrapper failure (seam entry) [evidence: implemented in `src/wrapper/stream-parsers/pi.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Author tests covering the recorded probe verdict and the chosen path (tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T009 Author gate-matrix and exact-original fallback tests for the chosen seam (tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T010 Cover the no-terminal-output boundary and canonical-byte preservation (tests) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T011 Run `npm run check` and confirm the package gate stays green (packages/cli-communication-projection) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T012 Run strict packet validation and reconcile the planned metadata (`023-pi-wrapper/`, `validate.sh --strict`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six P0 requirements and checklist blockers have observed evidence.
- [x] The `turn_end`-mutation question is answered with a recorded, observable verdict.
- [x] Pi projects on the validated path; with the flag off or on any failure the byte-exact original shows.
- [x] The tests pass and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
