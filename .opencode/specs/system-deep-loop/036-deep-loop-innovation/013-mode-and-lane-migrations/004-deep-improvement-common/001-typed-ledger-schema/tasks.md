---
title: "Tasks: Deep Improvement Common Services — Typed Ledger Schema"
description: "Tasks for planning the first Deep Improvement Common Services child: typed append-only envelope, evaluator/canary/promotion event vocabulary, field-level types, and versioned upcaster boundary."
trigger_phrases:
  - "deep improvement typed ledger schema tasks"
  - "common evaluator event vocabulary tasks"
  - "deep improvement upcaster tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T08:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed schema implementation and verification"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reducers and projections remain next-sibling work"
      - "Authorization proof persistence remains shared-substrate work"
---
# Tasks: Deep Improvement Common Services — Typed Ledger Schema

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

- [x] T001 Confirm the phase-006 transition-authorized ledger core and phase-012 shared event contracts are the authoritative inputs [Evidence: shared envelope imports at `deep-improvement-common-ledger-schema.ts:5`; real gateway append matrix at `deep-improvement-common-ledger-schema.vitest.ts:565`] [Test: Vitest 14/14 passed]
- [x] T002 Inventory the shared evaluator, canary, and promotion service boundaries and the common fields reused by all three downstream variants [Evidence: 35-stem payload and scope maps at `deep-improvement-common-ledger-types.ts:422`] [Test: Vitest 14/14 passed]
- [x] T003 Record the hard scope fence: event vocabulary only; reducers and projections remain with `002-reducers-and-projections` [Evidence: export audit and implementation-summary limitations] [Test: Vitest 14/14 passed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define `DeepImprovementCommonEventEnvelope<TStem>`, typed identity aliases, causal and sequence fields, artifact references, and replay-fingerprint inputs [Evidence: typed union at `deep-improvement-common-ledger-types.ts:638`; no mode-local authorization shadow fields] [Test: Vitest 14/14 passed]
- [x] T005 Define run lifecycle and candidate lineage/generation event payloads, including operator provenance and explicit rejection, pause, resume, abort, and quarantine outcomes [Evidence: run/candidate payload map and all-stem matrix] [Test: Vitest 14/14 passed]
- [x] T006 Define evaluator event payloads for epoch sealing, fixture execution, raw observations, normalization, uncertainty, verification escalation, insufficient evidence, and evaluator failure [Evidence: closed evaluator payload rules at `deep-improvement-common-ledger-schema.ts:224`] [Test: Vitest 14/14 passed]
- [x] T007 Define canary event payloads for suite sealing, execution, leakage, drift, invariant failure, veto, inconclusive analysis, and canary-gate completion [Evidence: closed canary payload rules and body-smuggling rejection] [Test: Vitest 14/14 passed]
- [x] T008 Define promotion event payloads for proposal, external authorization reference, shadow/canary rollout, pause, abort, baseline restoration, denial, and completion without embedding reducer state [Evidence: external transition-reference validation and authorized append test] [Test: Vitest 14/14 passed]
- [x] T009 Define field-level rules, event namespace, compatibility classes, independent versions, pure upcaster hooks, and fail-closed unknown-version behavior [Evidence: exhaustive rule dispatcher and compatibility tests] [Test: Vitest 14/14 passed]
- [x] T010 Define the common-service extension rule for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` [Evidence: closed three-value variant scope and rejection of unnamespaced common payload extensions] [Test: Vitest 14/14 passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify the envelope specialization is complete [Evidence: 35/35 authorized append and readback matrix with replay metadata] [Test: Vitest 14/14 passed]
- [x] T012 Verify the vocabulary covers the shared run and terminal families [Evidence: 35-stem event and wire-type maps] [Test: Vitest 14/14 passed]
- [x] T013 Verify raw evidence is immutable and separately addressable from normalized scores and promotion evidence [Evidence: separation, smuggling, and post-prepare mutation tests] [Test: Vitest 14/14 passed]
- [x] T014 Verify guarded promotion is fail-closed [Evidence: self-issued score reference and missing gateway proof both commit zero events] [Test: Vitest 14/14 passed]
- [x] T015 Verify upcasting is replay-safe [Evidence: deterministic legacy upcast retains source and upcaster digests; unknown event/version blocks] [Test: Vitest 14/14 passed]
- [x] T016 Verify the sibling handoff is clean [Evidence: module exports schema types, registry, preparation, digest, and compatibility hooks only] [Test: Vitest 14/14 passed]
- [x] T017 Verify downstream reuse is singular at the common boundary [Evidence: one exported evaluator/canary/promotion contract plus closed variant attribution] [Test: Vitest 14/14 passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: T001-T017 checked above] [Test: Vitest 14/14 passed]
- [x] All requirements in spec.md met with evidence [Evidence: targeted Vitest 14/14 and runtime TypeScript exit 0] [Test: Vitest 14/14 passed]
- [x] Phase gate green (strict validation and schema contract review as applicable) [Evidence: verification results recorded in `implementation-summary.md`] [Test: Vitest 14/14 passed]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: See `../002-reducers-and-projections/` for reducers and projections
- **Parent program**: See `../../../spec.md` for phase 013 sequencing and common-service ownership
<!-- /ANCHOR:cross-refs -->
