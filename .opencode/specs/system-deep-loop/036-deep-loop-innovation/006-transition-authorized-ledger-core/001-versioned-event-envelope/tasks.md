---
title: "Tasks: Versioned Event Envelope"
description: "Ordered tasks for the canonical envelope schema, event-definition registry, write validation, read-time upcasting, shipped-producer fixtures, and fail-closed verification."
trigger_phrases:
  - "versioned event envelope tasks"
  - "deep-loop upcaster implementation tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
    last_updated_at: "2026-07-20T21:40:26Z"
    last_updated_by: "codex"
    recent_action: "Completed all envelope, registry, upcast, and verification tasks"
    next_safe_action: "Hand the canonical APIs to the next scoped sibling"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Versioned Event Envelope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the implementation worktree to the phase-003 BASE and record the phase-004 transition-policy digest. [evidence: BASE `576a7401b1d2f8b328b7713ead428599894a03d4`; policy SHA-256 `329ad7ad1c4f8eaedb531887b00ed29c3413fef00e7c8532941ad07f033b634d`; verification receipt: targeted Vitest 56/56 passed.]
- [x] T002 Inventory representative observability, council, iteration/audit, fan-out status, and generic JSONL writer records without modifying authoritative runtime files. [evidence: five census-derived fixtures cover the required four families plus iteration state; final git status contains no modified legacy file; verification receipt: targeted Vitest 56/56 passed.]
- [x] T003 Freeze contract tests for outer fields, event namespace, version semantics, canonical bytes, typed errors, registry invariants, and sibling API ownership. [evidence: `runtime/tests/unit/event-envelope.vitest.ts` discovers 56 passing tests; verification receipt: targeted Vitest 56/56 passed.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the closed canonical envelope type/schema with explicit outer and per-event versions plus immutable identity, stream, time, producer, epoch, correlation, causation, idempotency, and payload fields. [evidence: `event-envelope.ts` exports the exact fourteen-field type and validator; verification receipt: targeted Vitest 56/56 passed.]
- [x] T005 Add strict stored-envelope and current-envelope validators with stable field-scoped error codes. [evidence: table-driven missing, unknown, scalar, timestamp, nullability, payload, Unicode, prototype-key, and limit tests pass; verification receipt: targeted Vitest 56/56 passed.]
- [x] T006 Add the deterministic event-definition registry with per-version required-field contracts, validator-bound schema identity, immutable inspection, and current-version ownership. [evidence: validator-digest divergence, deep-freeze, function-free resolution, and stable digest tests pass; verification receipt: targeted Vitest 56/56 passed.]
- [x] T007 Add registry startup validation for duplicates, aliases, unsupported versions, non-adjacent edges, missing links, cycles, and incomplete definitions. [evidence: startup rejection matrix passes with typed codes; verification receipt: targeted Vitest 56/56 passed.]
- [x] T008 Add the current-only write-preflight and canonical serialization result for the authorization and typed-ledger append boundary. [evidence: current write returns bytes, SHA-256 digest, registry digest, and full append identity; versions 1, 2, and 4 reject; verification receipt: targeted Vitest 56/56 passed.]
- [x] T009 Add the read entry point that preserves stored bytes, resolves exact type/version, validates historical payloads, and returns stored/effective forms. [evidence: stored version 1 reaches version 3 while exact source bytes remain equal; verification receipt: targeted Vitest 56/56 passed.]
- [x] T010 Add controlled adjacent upcaster execution, registration-time input-mutation and deterministic-output checks, per-hop validation, immutable-field guards, deterministic chain identity, and ordered provenance traces. [evidence: registration probes, two-hop trace, repeat stability, nondeterminism, identity, loss, default, and invalid-output tests pass; verification receipt: targeted Vitest 56/56 passed.]
- [x] T011 [P] Add dark representative fixtures for observability, council round state, audit/iteration, and fan-out status producer shapes under one `payload` boundary. [evidence: five producer-family fixtures pass the same outer envelope; verification receipt: targeted Vitest 56/56 passed.]
- [x] T012 [P] Document the exported envelope, registry, write-preflight, read-result, and error contracts consumed by later phase-006 siblings. [evidence: runtime TSDoc plus `implementation-summary.md` module, grammar, error, and handoff sections; verification receipt: targeted Vitest 56/56 passed.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify all required outer fields, scalar/nullability rules, UTC timestamps, positive versions/sequences/epochs, closed-key posture, and object payload constraints. [evidence: strict outer-schema test matrix passes; verification receipt: targeted Vitest 56/56 passed.]
- [x] T014 Verify exact namespaced discriminator lookup, per-type required-field enumeration, current-only writes, and canonical byte stability. [evidence: registry and write-boundary tests pass with a stable 64-hex digest; verification receipt: targeted Vitest 56/56 passed.]
- [x] T015 Verify supported multi-hop historical reads reach the current shape deterministically while stored bytes and immutable fields remain unchanged. [evidence: repeated `1 -> 2 -> 3` reads yield identical bytes, trace, and chain identity; verification receipt: targeted Vitest 56/56 passed.]
- [x] T016 Verify unknown envelope/type versions, future event versions, gaps, cycles, duplicate definitions, invalid hops, identity mutation, lossy transforms, and ambiguous defaults fail closed. [evidence: every named case asserts a typed machine code and returns no result; verification receipt: targeted Vitest 56/56 passed.]
- [x] T017 Verify sibling consumers use the canonical write/read boundaries without producer-payload reparsing or direct upcaster access. [evidence: the handoff test consumes preflight identity/digest and bytes, while the public registry exposes no `chain`, callable upcaster, or mutable `Map`; verification receipt: targeted Vitest 56/56 passed.]
- [x] T018 Verify representative shipped producer fixtures use one outer envelope and no authoritative runtime writer or reader changed. [evidence: five fixture cases pass; scoped status shows only new runtime files and leaf docs; verification receipt: targeted Vitest 56/56 passed.]
- [x] T019 Run typecheck, targeted unit/integration tests, deterministic repeat fixtures, strict packet validation, and tracked-mutation checks on the exact candidate SHA. [evidence: commands and results are retained in `implementation-summary.md`; the branch tip is pinned and the dirty candidate is path-scoped; verification receipt: targeted Vitest 56/56 passed.]
- [x] T020 Run the blocking SOL verifier and retain its candidate-bound commands, exit codes, fixture counts, and failure-path evidence. [evidence: the 56-test executable checklist, strict validator, alignment verifier, comment-hygiene gate, and additive-dark diff check are recorded in `implementation-summary.md`; verification receipt: targeted Vitest 56/56 passed.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T020 are checked above; verification receipt: targeted Vitest 56/56 passed.]
- [x] All requirements in spec.md met with evidence. [evidence: the 56-test suite covers the twelve requirements and six success criteria; verification receipt: targeted Vitest 56/56 passed.]
- [x] Phase gate green (validate/typecheck/test/SOL as applicable). [evidence: targeted Vitest, typecheck, alignment, comment hygiene, additive-dark, and strict spec gates pass; verification receipt: targeted Vitest 56/56 passed.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
