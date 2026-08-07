---
title: "Tasks: Deep Alignment - Sealed Reference Artifacts"
description: "Tasks for binding Deep Alignment authority capsules, lane inputs, verify-first evidence, witnesses, governed exceptions, convergence outputs, reports, resume references, and save handoffs to the shared sealed-artifact contract."
trigger_phrases:
  - "deep alignment sealed artifacts tasks"
  - "deep-alignment verified read tasks"
  - "deep alignment authority capsule tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced Deep Alignment authority and evidence sealing"
    next_safe_action: "Build the Deep Alignment lifecycle artifact matrix from the pinned baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Alignment - Sealed Reference Artifacts

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

- [ ] T001 Confirm the phase-012 shared review-loop contract and write-set conflict graph, and verify predecessor `002-reducers-and-projections` owns findings, lane verdict, and report projections
- [ ] T002 Inventory Deep Alignment lane, authority, adapter, scope, discovery, rule, finding, witness, exception, convergence, report, resume, and save state and output shapes against the pinned baseline
- [ ] T003 Freeze the mode artifact-kind matrix, shared descriptor fields, canonicalization profiles, media types, authority epochs, digest-reference roles, and deterministic reference ordering
- [ ] T004 Define typed seal/read failures, invalid-authority and expired-exception dispositions, target and authority drift handling, append-only supersession, report/handoff refusal, and the additive-dark rollback switch
- [ ] T005 Confirm the mode consumes the phase-007 sealing primitives and does not introduce a mode-local digest, blob store, descriptor, or verification path
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Register Deep Alignment authority capsule, lane scope, adapter, rule manifest, applicability policy, capability, and replay-input artifact kinds through the shared sealer
- [ ] T007 Add authority and scope seal-on-write and bind one verified lane reference set before discovery; reject live-only, expired, rolled-back, mixed-version, and unverified authority inputs
- [ ] T008 Add discovery sealing for selected artifacts, target snapshots, adapter output, corpus partitions, omission and unresolved scope, not-applicable results, and discovery watermarks
- [ ] T009 Add per-iteration sealing for applicability, deterministic checks, raw detector output, source locators, verifier inputs, live re-probe results, JSONL delta, and candidate evidence
- [ ] T010 Add proof-carrying finding sealing for authority and rule identity, subject digest, applicability, raw observation, re-probe receipt, verifier identity, verified level, evidence class, and orthogonal severity/confidence
- [ ] T011 Add witness-matrix sealing for conforming, violating, boundary, relational, and stateful cases, shrink results, coverage gaps, and old-authority replay references
- [ ] T012 Add governed exception sealing for subject, rule or claim, lane, authority digest, owner, justification, issuer, scope, issued time, expiry, and invalidation reason without deleting the original failure
- [ ] T013 Seal findings and exception views, coverage and stability inputs, unresolved or inconclusive obligations, per-lane `alignment-report.md`, overall verdict metadata, and ordered input digest set
- [ ] T014 Add resume-facing authority, target, witness, and exception drift comparison plus the verified continuity-save or handoff reference package
- [ ] T015 Bind mode artifact references into typed events, predecessor reducers and projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling without changing shared review-loop semantics
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Verify every mode artifact kind uses shared canonicalization, seal-on-write, algorithm-qualified digest references, and the shared verified reader
- [ ] T017 Verify authority fixtures reject invalid, expired, rolled-back, mixed-version, unsigned, coverage-incomplete, missing, changed, corrupted, and unsupported inputs before discovery
- [ ] T018 Verify lane and discovery fixtures preserve selected scope, target identity, omission, unresolved, not-applicable, adapter, corpus, and watermark evidence
- [ ] T019 Verify check and finding fixtures preserve raw observations, live re-probe receipts, applicability, evidence classes, orthogonal fields, verifier identity, and append-only supersession
- [ ] T020 Verify witness fixtures reproduce positive, negative, boundary, relational, and stateful cases and detect deleted or weakened obligations across authority epochs
- [ ] T021 Verify exception fixtures preserve original failures, expose scoped dispositions, and invalidate assertions on authority, subject, verifier, scope, or time drift
- [ ] T022 Verify convergence and report fixtures reject mixed watermarks and reproduce identical findings, exception views, per-lane reports, rollups, and metadata from identical verified inputs
- [ ] T023 Verify resume and continuity-save fixtures classify drift, preserve historical seals, identify affected lanes and findings, and release no trusted content after a failed seal or read
- [ ] T024 Verify replay and shadow parity require the same ordered verified reference set before comparing effective events, projections, reports, or verdicts
- [ ] T025 Verify seal/read failure blocks dark evidence and leaves legacy output, state, schema, report behavior, read-only posture, remediation posture, and authority unchanged
- [ ] T026 Verify the independent Deep Alignment mode gate and rollback switch without invoking certificate, receipt, remediation, or authority semantics owned by later phases
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
