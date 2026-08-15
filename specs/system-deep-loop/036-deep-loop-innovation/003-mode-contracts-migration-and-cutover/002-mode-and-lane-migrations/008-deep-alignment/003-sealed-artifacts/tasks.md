---
title: "Tasks: Deep Alignment - Sealed Reference Artifacts"
description: "Tasks for binding Deep Alignment authority capsules, lane inputs, verify-first evidence, witnesses, governed exceptions, convergence outputs, reports, resume references, and save handoffs to the shared sealed-artifact contract."
trigger_phrases:
  - "deep alignment sealed artifacts tasks"
  - "deep-alignment verified read tasks"
  - "deep alignment authority capsule tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-08-15T16:12:18Z"
    last_updated_by: "codex"
    recent_action: "Verified the cited suite and reconciled closeout evidence"
    next_safe_action: "No leaf-local closeout action remains"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase-012 shared review-loop contract and write-set conflict graph, and verify predecessor `002-reducers-and-projections` owns findings, lane verdict, and report projections [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T002 Inventory Deep Alignment lane, authority, adapter, scope, discovery, rule, finding, witness, exception, convergence, report, resume, and save state and output shapes against the pinned baseline [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T003 Freeze the mode artifact-kind matrix, shared descriptor fields, canonicalization profiles, media types, authority epochs, digest-reference roles, and deterministic reference ordering [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T004 Define typed seal/read failures, invalid-authority and expired-exception dispositions, target and authority drift handling, append-only supersession, report/handoff refusal, and the additive-dark rollback switch [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T005 Confirm the mode consumes the phase-007 sealing primitives and does not introduce a mode-local digest, blob store, descriptor, or verification path [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Register Deep Alignment authority capsule, lane scope, adapter, rule manifest, applicability policy, capability, and replay-input artifact kinds through the shared sealer [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T007 Add authority and scope seal-on-write and bind one verified lane reference set before discovery; reject live-only, expired, rolled-back, mixed-version, and unverified authority inputs [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T008 Add discovery sealing for selected artifacts, target snapshots, adapter output, corpus partitions, omission and unresolved scope, not-applicable results, and discovery watermarks [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T009 Add per-iteration sealing for applicability, deterministic checks, raw detector output, source locators, verifier inputs, live re-probe results, JSONL delta, and candidate evidence [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T010 Add proof-carrying finding sealing for authority and rule identity, subject digest, applicability, raw observation, re-probe receipt, verifier identity, verified level, evidence class, and orthogonal severity/confidence [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T011 Add witness-matrix sealing for conforming, violating, boundary, relational, and stateful cases, shrink results, coverage gaps, and old-authority replay references [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T012 Add governed exception sealing for subject, rule or claim, lane, authority digest, owner, justification, issuer, scope, issued time, expiry, and invalidation reason without deleting the original failure [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T013 Seal findings and exception views, coverage and stability inputs, unresolved or inconclusive obligations, per-lane `alignment-report.md`, overall verdict metadata, and ordered input digest set [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T014 Add resume-facing authority, target, witness, and exception drift comparison plus the verified continuity-save or handoff reference package [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T015 Bind mode artifact references into typed events, predecessor reducers and projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling without changing shared review-loop semantics [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify every mode artifact kind uses shared canonicalization, seal-on-write, algorithm-qualified digest references, and the shared verified reader [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T017 Verify authority fixtures reject invalid, expired, rolled-back, mixed-version, unsigned, coverage-incomplete, missing, changed, corrupted, and unsupported inputs before discovery [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T018 Verify lane and discovery fixtures preserve selected scope, target identity, omission, unresolved, not-applicable, adapter, corpus, and watermark evidence [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T019 Verify check and finding fixtures preserve raw observations, live re-probe receipts, applicability, evidence classes, orthogonal fields, verifier identity, and append-only supersession [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T020 Verify witness fixtures reproduce positive, negative, boundary, relational, and stateful cases and detect deleted or weakened obligations across authority epochs [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T021 Verify exception fixtures preserve original failures, expose scoped dispositions, and invalidate assertions on authority, subject, verifier, scope, or time drift [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T022 Verify convergence and report fixtures reject mixed watermarks and reproduce identical findings, exception views, per-lane reports, rollups, and metadata from identical verified inputs [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T023 Verify resume and continuity-save fixtures classify drift, preserve historical seals, identify affected lanes and findings, and release no trusted content after a failed seal or read [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T024 Verify replay and shadow parity require the same ordered verified reference set before comparing effective events, projections, reports, or verdicts [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T025 Verify seal/read failure blocks dark evidence and leaves legacy output, state, schema, report behavior, read-only posture, remediation posture, and authority unchanged [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T026 Verify the independent Deep Alignment mode gate and rollback switch without invoking certificate, receipt, remediation, or authority semantics owned by later phases [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] All requirements in spec.md met with evidence [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] Phase gate green (validate/build/test as applicable) [Test: all five Deep Alignment closeout suites PASS 17+92+13+10+87; `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
