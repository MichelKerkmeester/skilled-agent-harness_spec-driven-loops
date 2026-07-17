---
title: "Implementation Plan: Deep Improvement Common Services - certificates and receipts"
description: "Implementation Plan for the Deep Improvement Common Services certificates and receipts phase: freeze shared attestations, replay fingerprints, offline verification, and evaluator/canary/promotion service boundaries."
trigger_phrases:
  - "deep improvement certificates and receipts implementation plan"
  - "deep improvement common services plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Specified the shared verifier layers and guarded promotion boundary"
    next_safe_action: "Resolve sealed-artifact bindings and freeze canonical fingerprint serialization"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Improvement Common Services - Certificates and Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement-common mode migration |
| **Change class** | Shared contract and verification service design; implementation follows the frozen plan |
| **Execution** | Additive dark path on the typed event-ledger substrate; no authority cutover in this phase |

### Overview
The phase establishes one contract for the evaluator-first loop shared by deep-improvement and its three benchmark
variants. It binds a run-level `CERTIFICATE` and transition-level `RECEIPTS` to sealed artifacts, evaluator/canary
epochs, raw evidence, policies, budgets, and a deterministic replay fingerprint. The offline verifier recomputes the
binding and policy results from immutable inputs instead of trusting a live process or a summary score. Evaluator,
canary, and promotion services are owned here and exposed through variant-neutral adapters; the later 010 migrations
reuse them after 009 freezes shared contracts and emits the write-set conflict graph.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `003-sealed-artifacts` certificate and receipt primitives are available with stable digest and reference semantics
- [ ] Sibling typed ledger and reducer contracts are frozen enough to name event, projection, and receipt boundaries
- [ ] The shared evaluator, canary, and promotion ownership boundary is agreed before variant adapters are designed
- [ ] The canonical fingerprint input set, serialization rules, and excluded environmental values are enumerated
- [ ] Hard veto, `INSUFFICIENT_EVIDENCE`, uncertainty, abort, restore, and unsupported-version outcomes are explicit
- [ ] The later 009 contract-freeze and write-set conflict-graph handoff is recorded for the 010 migration fan-out

### Definition of Done
- [ ] `CERTIFICATE` and `RECEIPT` schemas attest the required run and transition evidence
- [ ] The offline verifier can recompute fingerprints, receipt chains, raw-to-derived reductions, canaries, and hard gates
- [ ] Evaluator, canary, and promotion services have one shared source and a variant adapter contract
- [ ] Dark-path parity, tamper, missing-input, unknown-version, crash-window, and rollback evidence are specified
- [ ] The successor resume adapter has an explicit receipt replay, salvage, and block contract
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sealed-artifact boundary**: consume the immutable base/candidate, evaluator, canary, calibration, and policy
  references from `003-sealed-artifacts`; do not redefine signing or trust-root behavior in this phase.
- **Certificate layer**: produce one run-level attestation containing stable identities, content digests, evidence
  manifests, budget state, replay fingerprint, policy result, and explicit verdict. It references receipts instead of
  copying transition details.
- **Receipt layer**: produce one idempotent attestation for each effectful or authorization-relevant transition. The
  receipt chain records predecessor evidence, effect identity, service version, outcome, uncertainty, and transition
  fingerprint so recovery can distinguish committed, vetoed, and unknown effects.
- **Fingerprint layer**: canonicalize the complete semantic input tuple, including artifacts, task/canary/evaluator
  epochs, reducer and policy versions, executor capabilities, seeds, budgets, admission/retry decisions, and prior
  receipt references. Exclude storage-local and wall-clock values unless explicitly semantic.
- **Evaluator service**: expose raw observation capture, deterministic checks, normalization, calibration, and reduction
  as separately versioned steps. Preserve raw per-item evidence even when the service emits a compact score vector.
- **Canary service**: manage frozen epochs, deterministic ground truth, adversarial and metamorphic cases, leakage
  detection, and freshness. Return a typed result or veto without exposing secret canary content to the proposer.
- **Promotion service**: authorize only a typed transition after hard vetoes, integrity, regression, canary, and
  evidence sufficiency checks. Separate shadow, canary, promote, abort, and restore; a soft judge cannot rescue a hard
  failure.
- **Independent verifier**: run outside the live mode process, resolve immutable inputs, recompute hashes and derived
  values, validate receipt continuity, and issue a verifier receipt bound to its own ruleset and version.
- **Variant adapters**: let `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` provide candidate,
  task, and domain-specific evaluator adapters while the shared certificate fields, receipt vocabulary, fingerprint,
  vetoes, and promotion state machine remain common.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the sibling `003-sealed-artifacts` contract and the typed ledger/reducer interfaces without changing them.
- Inventory the shared deep-improvement evaluator, candidate, canary, scoring, and promotion paths and classify each
  as shared service logic, variant adapter, persisted evidence, or legacy projection.
- Pin the planning inputs and record the no-authority-cutover boundary, the 009 freeze handoff, and the 010 consumers.

### Phase 2: Contract Definition
- Define the `CERTIFICATE` and `RECEIPT` schemas, required fields, digest references, status vocabulary, idempotency
  rules, unknown-field policy, and chain invariants.
- Define canonical fingerprint serialization and the complete input manifest, including explicit empty/absent tags,
  logical ordering, numeric representation, seeds, budgets, retry/admission choices, and version markers.
- Define the evidence boundary between raw observations, normalized scores, calibrated estimates, reducers, policy
  decisions, and verifier output; preserve `INSUFFICIENT_EVIDENCE` as a first-class result.

### Phase 3: Shared Service Design
- Specify the evaluator capsule interface and deterministic-first cascade, retaining raw observations independently from
  normalization and aggregation.
- Specify canary epoch creation, deterministic and adversarial/metamorphic fixture execution, leakage scanning,
  rotation, redaction, freshness, and verifier-facing evidence.
- Specify promotion transitions and hard veto ordering, including shadow/canary/promote/abort/restore and the uncertain
  effect recovery path.

### Phase 4: Verifier and Ledger Integration
- Define the offline verification sequence: resolve digests, validate schemas, recompute fingerprint, verify receipt
  chain, replay deterministic evaluation, check canaries and policy gates, and emit a verifier receipt.
- Define event and projection bindings without duplicating the sibling ledger schema or reducer ownership.
- Define dark-write and legacy-parity behavior, including missing evidence, tampered evidence, unsupported versions,
  duplicate receipts, out-of-order receipts, and process crash windows.

### Phase 5: Variant Handoff
- Publish the shared-service adapter contract and a reuse matrix for agent-improvement, model-benchmark, and
  skill-benchmark; reject variant-local copies of certificate, fingerprint, or promotion semantics.
- Hand the receipt replay and salvage cases to `005-resume-adapter`.
- Block the 010 migration fan-out until 009 has frozen shared contracts and emitted the executable dependency and
  write-set conflict graph.

### Phase 6: Verification
- Run deterministic schema, serialization, receipt-chain, raw-evidence, policy, canary, tamper, crash-window, and
  offline-replay fixtures against the pinned contracts.
- Verify identical inputs produce identical fingerprints and that each changed semantic input causes a mismatch.
- Verify hard vetoes cannot be rescued by soft scores and all three variants consume the same service contract.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Construct complete, partial, and contradictory run fixtures; require a certificate only for complete evidence and validate every digest and verdict field |
| REQ-002 | Replay each transition with duplicate, out-of-order, vetoed, aborted, restored, and crash-before-receipt cases; assert idempotency and explicit uncertainty |
| REQ-003 | Recompute fingerprints across processes and serialization orders; mutate each semantic input class and assert a mismatch while changing excluded storage values leaves the fingerprint stable |
| REQ-004 | Run an independent verifier with no live agent or network call; compare recomputed hashes, reductions, canary relations, hard gates, and verifier receipt against the source certificate |
| REQ-005 | Remove or alter one raw observation, normalization rule, calibration profile, or reducer input; require `INCOMPLETE`, `FAIL`, or mismatch rather than a substituted aggregate |
| REQ-006 | Exercise canary epochs, rotated epochs, deterministic ground truth, metamorphic failures, paraphrased leakage, redacted output, and stale fixtures; require typed freshness/leak vetoes |
| REQ-007 | Inject schema, build, security, regression, integrity, leakage, and evidence-sufficiency failures; assert hard vetoes remain non-rescuable and `INSUFFICIENT_EVIDENCE` is not promotion |
| REQ-008 | Run the same fixture through all three variant adapters; compare shared certificate fields, receipt vocabulary, fingerprint inputs, and promotion decisions for semantic parity |
| REQ-009 | Run dark writes beside the legacy path and assert no certificate or receipt alone changes authority; verify rollback leaves the legacy projection usable |
| REQ-010 | Verify the 009 freeze and write-set graph are required before the 010 migration harness accepts the shared service contract |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the sealed-artifact primitives from `003-sealed-artifacts`, typed ledger interfaces from
`001-typed-ledger-schema`, and reducer/projection interfaces from `002-reducers-and-projections`. It also depends on
the parent mode contract and the phase-012 shared-contract freeze plus write-set conflict graph before the later 010
fan-out. The successor `005-resume-adapter` consumes the receipt-chain, fingerprint, uncertain-effect, and verifier
receipt rules defined here. The three downstream variant folders consume the evaluator, canary, and promotion
services as adapters, not as independent implementations. The packet validator and the frozen parent success criteria
remain the documentation gates.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All future implementation changes remain additive and versioned. Revert the path-scoped contract/service commit to
remove a dark certificate or receipt writer while retaining the legacy authority and archival evidence. Do not delete
existing ledger events or mutate sealed artifacts; mark an invalid or superseded certificate through a new typed event
and let the verifier report the supersession. If a new fingerprint, evaluator, canary, or promotion version fails
parity, disable that version, restore the prior shared service version, and keep the failed receipts for audit. An
uncertain external effect is never replayed blindly: the effect-recovery policy resolves it before a retry or rollback
transition is accepted.
<!-- /ANCHOR:rollback -->
