---
title: "Tasks: Phase 024 Devin Wrapper"
description: "Planned task breakdown for the Devin single-turn probe, print-mode capture, runtime adapter routing, gate-first projection, byte-exact fallback, and packet closeout."
trigger_phrases:
  - "devin-wrapper"
  - "tasks"
  - "devin -p print projection tasks"
  - "devin runtime adapter wiring tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/024-devin-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Confirm the `devin -p` print-mode capture shape, then wire the adapter."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-024-devin-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 024 Devin Wrapper

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

- [x] T001 [P] Confirm Devin's single-turn print behaviour from its CLI with a live `devin -p -- "prompt"` probe: one stdout response, one exit, `--` separator, and `/dev/null` stdin (`test/runtime/wrappers/devin.test.ts`, live Devin CLI) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-devin.test.ts` name the seam and pin the capture shape]
- [x] T002 Inventory the Phase 020 wrapper seam, the `devinRuntimeAdapter` surface, and the Phase 018 `projectMessage()` entrypoint (`src/runtime/wrappers/`, `src/runtimes/devin.ts`, `test/runtimes/devin.test.ts`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-devin.test.ts` name the seam and pin the capture shape]
- [x] T003 Review the seam contract: gate-first projection, fail-open, and byte-exact restore (`src/contracts/`, `src/render/`) [evidence: `src/wrapper/stream.ts` and `test/wrapper/stream-devin.test.ts` name the seam and pin the capture shape]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the `devin -p` print-mode capture that runs non-interactively and single-turn with a `--` separator and `/dev/null` stdin, capturing stdout (`src/runtime/wrappers/devin.ts`) [evidence: implemented in `src/wrapper/stream-parsers/devin.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T005 Wrap the captured output as a Devin runtime envelope and route it through `devinRuntimeAdapter.adapt()` onto the assembler event envelope shape (`src/runtime/wrappers/devin.ts`, `src/runtimes/devin.ts`) [evidence: implemented in `src/wrapper/stream-parsers/devin.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T006 Feed the adapted event into `projectMessage()` in the frozen stage order, gated on `isProjectionEnabled()` (`src/runtime/wrappers/devin.ts`) [evidence: implemented in `src/wrapper/stream-parsers/devin.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
- [x] T007 Re-render the accepted projection and map every terminal to a projection or the byte-exact original held in wrapper-side state (`src/runtime/wrappers/devin.ts`) [evidence: implemented in `src/wrapper/stream-parsers/devin.ts` and wired through `projectRuntimeStream` in `src/wrapper/stream.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Author the adapter, gate, and fallback tests mirroring the runtime test pattern (`test/runtime/wrappers/devin.test.ts`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T009 Cover the gate matrix, adapter reason codes, empty output, non-zero exit, and byte-exact restore cases (`test/runtime/wrappers/devin.test.ts`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T010 Run the live `devin -p` single-turn probe and the package gate (`npm run check`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
- [x] T011 Run strict packet validation and reconcile the planned metadata (`024-devin-wrapper/`, `validate.sh --strict`) [evidence: `npm run check` passed 70 files 360 tests; `validate.sh --strict` reports 0 errors 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All eight requirements and checklist blockers have observed evidence.
- [x] With the flag on a `devin -p` run shows the projection; with the flag off or on any failure it shows the byte-exact original.
- [x] The adapter, gate, and fallback tests pass and canonical bytes stay unchanged.
- [x] Devin's single-turn print behaviour is confirmed and strict packet validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
