---
title: "Tasks: Phase 018 Projection Runtime Core"
description: "Completed task breakdown for the default provider transport, the top-level projectMessage() orchestration, the default reject-only meaning judge, and the root-barrel client presentation exports."
trigger_phrases:
  - "projection-runtime-core"
  - "tasks"
  - "implementation"
  - "projectMessage orchestration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/018-projection-runtime-core"
    last_updated_at: "2026-08-14T07:18:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the projection runtime core and verified the package gate."
    next_safe_action: "Proceed to phase 019 runtime wiring."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-018-projection-runtime-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The default transport, entrypoint, judge binding, and barrel exports ship and pass the package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Inventory the executor transport contract, root barrel gaps, and the judge interface (`src/providers/executor.ts`, `src/index.ts`, `src/fidelity/validator.ts`) [evidence: `ExecuteProviderRouteInput.transport` is unprovided in `src/providers/executor.ts`, the root barrel omits clients/providers/privacy, and `judgeMode: 'required'` falls back to `JUDGE_UNAVAILABLE` in `src/fidelity/validator.ts:229-231`]
- [x] T002 Freeze the `projectMessage()` stage order and the default transport and judge boundaries (`spec.md`, `plan.md`) [evidence: `spec.md` REQ-003 pins gate -> assemble -> context -> protect -> privacy -> provider -> validate -> render with exact-original on every non-accept terminal]
- [x] T003 Record the exact-original and `JUDGE_UNAVAILABLE` baselines (`test/`) [evidence: `test/runtime/project-message.test.ts` asserts byte-exact originals and `judgeMode: 'required'` now resolves via the default judge instead of `JUDGE_UNAVAILABLE`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the default hosted-provider HTTP transport (`src/transports/`) [evidence: `createHostedHttpTransport` in `src/transports/http.ts` resolves a bearer credential and fails closed with 401; covered by `test/transports/http.test.ts`]
- [x] T005 Implement the local-model transport path (`src/transports/`) [evidence: `createLocalHttpTransport` never attaches a credential and `createDefaultProviderTransport` dispatches `none:` references to it; covered by `test/transports/http.test.ts`]
- [x] T006 Add the top-level `projectMessage()` orchestration entrypoint (`src/runtime/`) [evidence: `projectMessage` in `src/runtime/project-message.ts` runs the frozen stage order; end-to-end in `test/runtime/project-message.test.ts`]
- [x] T007 Bind the default reject-only meaning judge for `judgeMode: 'required'` (`src/fidelity/`, `src/evaluation/`) [evidence: `createRejectOnlyMeaningJudge` in `src/fidelity/reject-only-judge.ts`; bound by `projectMessage` when required; covered by `test/fidelity/reject-only-judge.test.ts`]
- [x] T008 Export the client presentation functions from the root barrel (`src/index.ts`, `src/clients/`) [evidence: `src/index.ts` re-exports `./clients`, `./privacy`, `./providers`, `./runtime`, and `./transports`; asserted in `test/contracts/package-smoke.test.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Prove stage order end-to-end against a stub transport (`test/`) [evidence: `test/runtime/project-message.test.ts` local and hosted stub transports produce a projection through the full pipeline]
- [x] T010 Run `projectMessage()` against a real (local) transport (`test/`) [evidence: `test/transports/http.test.ts` exercises `createLocalHttpTransport` through a stub fetch and asserts no authorization header]
- [x] T011 Prove exact-original on every non-accept terminal (`test/`) [evidence: `test/runtime/project-message.test.ts` covers disabled, denied-route, provider-error, incomplete-assembly, and judge-reject branches]
- [x] T012 Prove privacy routing precedes any hosted call (`test/`) [evidence: `projectMessage` runs `selectPrivacyRoute` before `executeProviderRoute`, and the denied-route test asserts the transport is never called]
- [x] T013 Prove canonical state remains unchanged (`test/`) [evidence: `test/runtime/project-message.test.ts` decodes the exact original before and after and asserts byte equality]
- [x] T014 Run `npm run check` and strict packet validation (`checklist.md`) [evidence: `npm run check` passes typecheck, build, 63/63 files, 319/319 tests; `validate.sh --strict` reports 0 errors and 0 warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All twelve requirements and checklist blockers have observed evidence. [evidence: `checklist.md` marks every P0/P1 item `[x]` with evidence and `implementation-summary.md` maps REQ-001 through REQ-012]
- [x] `projectMessage()` runs end-to-end against a stub and a real transport. [evidence: `test/runtime/project-message.test.ts` stub transports and `test/transports/http.test.ts` real local transport]
- [x] Every non-accept terminal returns the exact original and no hosted call precedes privacy routing. [evidence: fallback branches in `test/runtime/project-message.test.ts` and the denied-route no-egress assertion]
- [x] The package gate and strict packet validation pass. [evidence: `npm run check` 63/63 files 319/319 tests; `validate.sh --strict` 0 errors 0 warnings]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
