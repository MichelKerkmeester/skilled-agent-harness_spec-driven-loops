---
title: "Tasks: Deep Improvement Common Services - certificates and receipts"
description: "Tasks for planning and implementing the shared Deep Improvement Common Services certificate, receipt, replay-fingerprint, offline-verifier, evaluator, canary, and promotion contracts."
trigger_phrases:
  - "deep improvement certificates and receipts tasks"
  - "deep improvement common service tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced certificate, receipt, verifier, and shared-service work"
    next_safe_action: "Inspect phase-006 primitives and enumerate shared evaluator write boundaries"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Certificates and Receipts

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

- [x] T001 Confirm the `003-sealed-artifacts` primitives, typed ledger interfaces, and reducer boundaries before designing new fields [EVIDENCE: real same-lane imports in certificate implementation]
- [x] T002 [P] Inventory shared evaluator, canary, promotion, candidate, scoring, and legacy projection paths [EVIDENCE: `spec.md` dependency and transition inventory]
- [x] T003 Record the additive-dark boundary, the phase-012 contract-freeze handoff, and the later 010 migration consumers [EVIDENCE: `implementation-summary.md` delivery and successor sections]
- [x] T004 Define the shared-versus-variant ownership matrix for agent-improvement, model-benchmark, and skill-benchmark [EVIDENCE: `DEEP_IMPROVEMENT_COMMON_SHARED_CERTIFICATE_CONTRACT`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the run-level `CERTIFICATE` schema, required evidence, verdict vocabulary, digest references, and supersession rules [EVIDENCE: exported run certificate types and issuer]
- [x] T006 Define the transition-level `RECEIPT` schema, predecessor links, effect identity, idempotency, uncertainty, and recovery outcomes [EVIDENCE: exported receipt types, identity, and issuer]
- [x] T007 Define canonical replay-fingerprint serialization, semantic input classes, excluded storage values, and mismatch diagnostics [EVIDENCE: ordered composite over real `deriveReplayFingerprint`]
- [x] T008 Define the evaluator capsule interface with raw observation retention, deterministic-first checks, normalization, calibration, and reduction [EVIDENCE: deep-improvement-common-certificates.ts:839 verifies raw-to-normalized reduction]
- [x] T009 Define canary epochs, deterministic ground truth, adversarial/metamorphic fixtures, leakage vetoes, rotation, freshness, and redaction [EVIDENCE: deep-improvement-common-certificates.vitest.ts:1071 exercises real stale-canary rejection]
- [x] T010 Define promotion service transitions for shadow, canary, promote, abort, restore, veto, and `INSUFFICIENT_EVIDENCE` [EVIDENCE: exported transition and verdict vocabulary]
- [x] T011 Define the independent offline verifier sequence and its verifier receipt bound to certificate fingerprint, ruleset, and verifier version [EVIDENCE: `verifyDeepImprovementCommonCertificateOffline`]
- [x] T012 Define ledger event/projection bindings, dark-write behavior, duplicate/out-of-order handling, and crash-window recovery without duplicating sibling ownership [EVIDENCE: deep-improvement-common-certificates.ts:1427 binds real gateway reads and reducer replay]
- [x] T013 Define the adapter contract that prevents downstream variants from forking shared certificate, receipt, fingerprint, or promotion semantics [EVIDENCE: deep-improvement-common-certificates.ts:111 freezes the shared consumer contract]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify complete, incomplete, contradictory, superseded, and tampered run fixtures produce the correct certificate outcome [EVIDENCE: targeted Vitest pass, mutation, and unsupported-version fixtures]
- [x] T015 Verify duplicate, out-of-order, vetoed, aborted, restored, and uncertain transition fixtures preserve receipt-chain integrity and idempotency [EVIDENCE: deep-improvement-common-certificates.vitest.ts:1083 and deep-improvement-common-certificates.vitest.ts:1100]
- [x] T016 Verify identical semantic inputs reproduce the same fingerprint across processes and every semantic mutation causes a mismatch [EVIDENCE: deep-improvement-common-certificates.vitest.ts:981 verifies reproducible receipt identity]
- [x] T017 Verify the offline verifier runs without live agent or network access and independently recomputes hashes, reductions, canaries, and hard gates [EVIDENCE: deep-improvement-common-certificates.vitest.ts:966 drives the offline verifier]
- [x] T018 Verify raw observations remain available when normalized scores or reducers change and missing evidence cannot become a substituted score [EVIDENCE: deep-improvement-common-certificates.ts:855 rejects raw-to-normalized mismatch]
- [x] T019 Verify canary leakage, stale epoch, metamorphic failure, and evaluation-context twin fixtures veto or block promotion as specified [EVIDENCE: deep-improvement-common-certificates.vitest.ts:1071 proves stale-canary rejection]
- [x] T020 Verify hard schema, build, security, regression, integrity, and evidence vetoes cannot be rescued by soft evaluator scores [EVIDENCE: offline verifier hard-gate ordering]
- [x] T021 Verify all three benchmark variants use the same shared service fixtures and produce semantic parity through adapter boundaries [EVIDENCE: deep-improvement-common-certificates.vitest.ts:998 asserts the exact shared-consumer tuple]
- [x] T022 Verify dark-path emissions do not change authority and the 005 resume adapter receives explicit replay, salvage, and block cases [EVIDENCE: `dark-evidence-only` authority mode and successor contract]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: completed T001-T022 rows]
- [x] All requirements in spec.md met with evidence [EVIDENCE: `implementation-summary.md` verification]
- [x] Shared evaluator, canary, promotion, certificate, receipt, fingerprint, and offline verifier gates are green [EVIDENCE: targeted Vitest, whole-runtime TypeScript, and strict packet validation]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor contract**: See `../003-sealed-artifacts/`
- **Successor consumer**: See `../005-resume-adapter/`
<!-- /ANCHOR:cross-refs -->
