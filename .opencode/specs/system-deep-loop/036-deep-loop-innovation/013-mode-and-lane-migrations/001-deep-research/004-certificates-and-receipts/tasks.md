---
title: "Tasks: Deep Research - Certificates & Receipts"
description: "Tasks for the Deep Research per-run certificate, per-transition receipts, replay-fingerprint projection, offline verifier, and additive-dark mode gate."
trigger_phrases:
  - "deep research certificates and receipts tasks"
  - "deep-research run certificate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-22T04:29:33Z"
    last_updated_by: "codex"
    recent_action: "Completed the open-obligation, output-ownership, and projection-provenance fixes"
    next_safe_action: "Successor 005-resume-adapter can integrate the exported contracts"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Certificates & Receipts

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

- [x] T001 Pin the candidate SHA, the phase-007 receipt/certificate and certification digests, and the phase-006 ledger, authorization, and replay-contract digests — Evidence: implementation-summary.md:55 records the frozen shared-substrate dependencies.
- [x] T002 Inventory Deep Research init, gather, analyze, convergence, synthesis, memory-save, and resume/recovery transitions against the pinned mode contracts — Evidence: implementation-summary.md:55 records the closed transition surface.
- [x] T003 Map each logical transition to its shared receipt kind, prior/result event, input/output references, result dispositions, and ledger-head rule — Evidence: implementation-summary.md:115 records transition receipt facts.
- [x] T004 Freeze logical operation IDs, attempt IDs, idempotency keys, receipt ordering, duplicate behavior, and same-key/different-facts conflict behavior — Evidence: implementation-summary.md:88 records stable logical identity.
- [x] T005 Freeze the run-certificate body, receipt-chain digest, ordered sealed-reference set, status vocabulary, and required unresolved-obligation fields — Evidence: implementation-summary.md:118 records the body contract.
- [x] T006 Freeze replay-fingerprint semantic inputs, normalization rules, exclusions, contract versions, and unknown-field fail-closed behavior — Evidence: implementation-summary.md:143 records real replay derivation.
- [x] T007 Define the offline verifier bundle, certification trust policy, typed verdicts, and no-repair/no-rebaseline error contract — Evidence: implementation-summary.md:121 records the offline verifier interface.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Register Deep Research transition receipt and run-certificate profiles through the shared phase-007 primitives — Evidence: implementation-summary.md:55 records shared certification.
- [x] T009 Add the `init` receipt for the frozen objective, plan/frontier, recipes, capabilities, configuration, and initial ledger head
- [x] T010 Add per-logical-branch `gather` and `analyze` receipts for source/evidence/claim references, admission, validation, contradictions, abstentions, and attempt history
- [x] T011 Add convergence receipts for one verified frontier snapshot, raw/trusted signals, blockers, policy versions, budget/lease state, and typed decision — Evidence: implementation-summary.md:118 records convergence evidence in the certificate contract.
- [x] T012 Add synthesis and memory-save receipts for materialized-view inputs, output digests, unresolved claims, continuity payload, target route, and persistence result — Evidence: implementation-summary.md:102 records memory-save disposition behavior.
- [x] T013 Add resume/recovery receipts for reuse, re-execute, reconcile, compensate, `not_applied`, `applied`, `in_doubt`, and `conflict` outcomes
- [x] T014 Implement the per-run certificate builder over the complete verified receipt chain, event range, final heads, artifact set, outputs, and obligations
- [x] T015 Implement replay-fingerprint derivation from the registered semantic input projection and bind it to receipts and the run certificate — Evidence: implementation-summary.md:143 records the real replay walker.
- [x] T016 [P] Implement the offline verifier over local contract registries, receipt/certificate bytes, sealed artifacts, and provider evidence — Evidence: implementation-summary.md:121 records the offline verification contract.
- [x] T017 Bind dark receipt/certificate emission and verification into event, reducer, projection, compatibility, shadow-parity, and rollback seams without changing authority — Evidence: implementation-summary.md:76 records the additive-dark binding.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Verify each receipt is emitted after the authorized transition result and resulting ledger head are durable — Evidence: implementation-summary.md:104 records the authorized result and durable append path.
- [x] T019 Verify identical semantic inputs produce identical receipt body digests, replay fingerprints, and run-certificate body — Evidence: implementation-summary.md:137 records the passing real-substrate suite.
- [x] T020 Verify every registered replay-affecting input changes the fingerprint and excluded timing/process/attempt values do not — Evidence: implementation-summary.md:143 records the real replay implementation.
- [x] T021 Verify receipt and certificate tampering, omission, truncation, stale heads, wrong kinds, unsupported versions, duplicate IDs, and mixed reference sets fail closed — Evidence: deep-research-certificates.vitest.ts:920 proves persisted-byte tamper rejection.
- [x] T022 Verify exact-repeat retry is idempotent and same-key/different-facts reuse returns a typed conflict without false success — Evidence: deep-research-certificates.vitest.ts:859 proves both outcomes.
- [x] T023 Verify source refresh and claim supersession preserve prior receipts and append only affected revisions and dependent invalidations — Evidence: implementation-summary.md:76 records append-only ledger ownership.
- [x] T024 Verify recovery distinguishes `not_applied`, `applied`, `in_doubt`, and `conflict`, and retries only conclusive `not_applied` with the original key
- [x] T025 Verify the offline verifier reproduces registered digests, chain links, authorization, projections, synthesis, and handoff results without live execution — Evidence: implementation-summary.md:143 records the real offline substrate set.
- [x] T026 Verify failed or unknown memory-save persistence cannot receive trusted completion status — Evidence: deep-research-certificates.vitest.ts:899 proves retryable uncertainty remains untrusted.
- [x] T027 Verify the Deep Research mode gate compares only equivalent verified reference sets and leaves legacy state, output, writers, and authority unchanged — Evidence: implementation-summary.md:154 records the authority boundary.
- [x] T028 Verify repeatable gather and analyze cardinality without weakening once-per-run completeness, logical-identity conflict detection, or offline distribution checks — Evidence: targeted Vitest reports 15 passing tests, including multi-source gather acceptance, missing synthesis rejection, duplicate logical-operation conflict, and same-length missing-analyze rejection.
- [x] T029 Verify every registered result-event quality signal cannot be promoted through trusted receipts — Evidence: targeted Vitest covers all instruction scans, admission dispositions, contamination statuses, and claim statuses across their registered result event kinds.
- [x] T030 Verify prior receipt linkage remains durable and conflict detecting through the frozen shared receipt contract — Evidence: the durable signed `evidence_digest` equals the domain `receiptDigest`, and changing only the prior digest yields typed `RECEIPT_CONFLICT`.
- [x] T031 Verify trusted completion requires an empty reducer-derived obligation set — Evidence: the 23-test suite proves an unresolved coverage obligation yields lifecycle `incomplete`, while an empty final obligation set yields `trusted-completion` and an offline `valid` verdict.
- [x] T032 Verify sealed transition outputs have one certificate-wide logical owner — Evidence: two distinct gather operations claiming the same verified source-capture artifact fail with typed `ARTIFACT_INVALID` at `transition:gather:outputs`.
- [x] T033 Verify issuance and offline verification fold the exact authorized replay range — Evidence: a projection event differing only from the ledger envelope is rejected with `PROJECTION_INVALID` at `projection:ledger-events` in both paths.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
