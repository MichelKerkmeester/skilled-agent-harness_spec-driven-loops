---
title: "Tasks: Phase 002 Contracts and Fixtures"
description: "Implementation task breakdown for the standalone package bootstrap, shared contracts, reference corpus, and golden fixtures."
trigger_phrases:
  - "contracts-and-fixtures"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:21:48Z"
    last_updated_by: "codex"
    recent_action: "Completed T001 through T012 with final-state evidence."
    next_safe_action: "Begin Phase 003 from its boundary preflight."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 002 Contracts and Fixtures

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
## PHASE 1: SETUP

- [x] T001 Confirm 001-research-strategy evidence, verify the standalone package boundary, and capture workspace plus benchmark baselines (`spec.md`, `plan.md`). [evidence: Phase 001 strict evidence read; package-absence negative control failed before bootstrap; benchmark environment recorded]
- [x] T002 Freeze event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, error, exact-original, and matrix-axis contracts (`spec.md`, `plan.md`). [evidence: 11 registered contract kinds and version policy]
- [x] T003 Bootstrap package-local install, build, type-check, import, and Vitest commands (`packages/cli-communication-projection/package.json`, `tsconfig.json`, `vitest.config.ts`). [evidence: `npm run check` exit 0]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Implement the v1 schema registry, validators, compatibility rules, and typed exact-original outcomes (`packages/cli-communication-projection/src/contracts/`, `src/versioning/`). [evidence: package type-check, build, and import smoke pass]
- [x] T005 [P] Author and sanitize the six-runtime, bounded-context, prompt-profile, and reference-parity fixture matrices (`packages/cli-communication-projection/test/fixtures/`). [evidence: 8 JSON files and 100 declared synthetic cases]
- [x] T006 Implement validation for failure, cancellation, timeout, unsupported controls, privacy denial, inconclusive evaluation, and exact-original fallback (`packages/cli-communication-projection/src/contracts/`, `src/versioning/`). [evidence: negative-control tests pass]
- [x] T007 Define content-free telemetry with rotating keyed digests and the reproducible benchmark profile (`packages/cli-communication-projection/src/contracts/`). [evidence: closed allowlist, keyed-digest rejection tests, and measured benchmark record]
- [x] T008 [P] Build package smoke, schema, round-trip, prompt/context, privacy, evaluation-manifest, telemetry, benchmark, and golden-output tests (`packages/cli-communication-projection/test/contracts/`). [evidence: 7 test files and 30 tests pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`). [evidence: public exports, registry, validators, fixtures, and all package-local consumers inventoried; no external code consumer exists]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`). [evidence: `npm run test:contracts` passes 30/30]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`). [evidence: final command receipts recorded in `implementation-summary.md`]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 003-core-normalization-and-assembly handoff (`checklist.md`). [evidence: completion docs and successor handoff agree]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative package gate, and recursive strict validation pass.
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [x] The package builds and tests independently, and the frozen prompt/context/evaluation contracts reproduce the reference baseline inputs.
- [x] Parent and successor handoff metadata agree with the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Research basis**: `../001-research-strategy/research/research.md`
<!-- /ANCHOR:cross-refs -->
