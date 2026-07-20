---
title: "Feature Specification: Deep Improvement Common Services - certificates and receipts"
description: "Plan the shared Deep Improvement Common Services certificate and receipt contract over the typed event-ledger substrate: per-run certificates, per-transition receipts, replay fingerprints, independent offline verification, and the evaluator, canary, and promotion services reused by agent-improvement, model-benchmark, and skill-benchmark."
trigger_phrases:
  - "deep improvement certificates and receipts"
  - "deep improvement common services"
  - "offline verification of promotion receipts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped shared run certificates and transition receipts to replay inputs"
    next_safe_action: "Freeze verifier inputs and receipt schemas after sibling 003 artifacts land"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Certificates and Receipts

> Phase adjacency under the deep-improvement-common parent (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (owns the shared deep-improvement backbone and its typed event-ledger contracts) |
| **Origin** | Child 004 of the deep-improvement-common mode migration: certificates, receipts, replay fingerprints, and offline verification |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep Improvement workflow is an evaluator-first loop: generate candidates, score them, run guarded checks,
and promote only after evidence passes. Its three benchmark variants will reuse the same evaluator, canary, and
promotion services. If each variant defines its own evidence record, replay inputs, or promotion receipt, the shared
backbone will have incompatible audit semantics and a later resume or authority cutover will not know whether two
apparently successful runs are comparable.

The shared ledger and sealed-artifact primitives are established by the earlier common-service phases. This phase
plans the attestations that sit on those primitives. A per-run `CERTIFICATE` must state what the run evaluated, which
immutable inputs and policies it used, what evidence was retained, and what verdict the evidence authorizes. A
per-transition `RECEIPT` must state what state transition was attempted, what predecessor evidence authorized it,
what effect occurred, and whether the transition completed, was vetoed, or remains uncertain. Both must be bound to
a canonical replay fingerprint so an independent verifier can re-check them without invoking the live agent loop.

This phase also establishes the single shared source for the evaluator, canary, and promotion services. It does not
choose variant-specific candidate schemas or silently turn a certificate into authority. The certificate and receipt
contract remains additive and verifiable while the ledger is dark; authority changes belong to the later cutover
workstream.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Per-run `CERTIFICATE`**: a typed attestation for a complete evaluator-first run, including run lineage, base and
  candidate artifact digests, evaluator capsule, canary epoch, raw-observation manifest, reduced evidence, vetoes,
  budget use, replay fingerprint, and the declared verdict.
- **Per-transition `RECEIPT`**: a typed attestation for each evaluator, canary, scoring, promotion, abort, rollback,
  or guarded-promotion transition, including predecessor receipt references, effect identity, outcome, uncertainty,
  and the evidence boundary used by the transition gate.
- **Replay-fingerprint contract**: canonical ordered inputs, normalization rules, version fields, exclusion rules,
  and mismatch behavior for offline replay. Wall-clock timestamps and storage offsets are not semantic evidence.
- **Independent verifier**: an offline verifier that loads content-addressed inputs, recomputes hashes and derived
  scores, checks receipt-chain continuity, reruns deterministic checks, and fails closed on missing or unknown inputs.
- **Shared evaluator service**: a frozen evaluator capsule boundary that separates raw observations from normalization,
  scoring, calibration, and reduction, with deterministic checks before expensive adjudication.
- **Shared canary service**: versioned canary epochs with deterministic ground truth where available, adversarial and
  metamorphic fixtures, leakage checks, and immutable evidence references; canary results are not hidden promotion
  authority by themselves.
- **Shared promotion service**: guarded shadow, canary, promote, abort, and restore transitions using hard vetoes,
  uncertainty-aware evidence, lower-bound or policy thresholds, and explicit `INSUFFICIENT_EVIDENCE` outcomes.
- **Reuse contract**: the single shared service boundary consumed by `005-agent-improvement`, `006-model-benchmark`,
  and `007-skill-benchmark`, with variant code supplying typed candidate and task adapters only.

### Out of Scope
- Implementing the sealed-artifact primitives owned by `003-sealed-artifacts`; this phase consumes their immutable
  references and binding rules.
- Implementing the typed ledger schema or reducers owned by `001-typed-ledger-schema` and `002-reducers-and-projections`.
- Implementing the `005-resume-adapter`; this phase publishes the receipt and fingerprint contract that resume consumes.
- Variant-specific candidate generation, benchmark task schemas, or skill-specific scoring rubrics.
- Authority cutover, legacy-writer retirement, or the later 010 per-mode fan-out implementation.
- Re-running the research registries or adding capabilities outside the deep-improvement common-services boundary.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A completed evaluator-first run emits one typed `CERTIFICATE` | The certificate identifies the run, lineage, base/candidate digests, evaluator capsule, canary epoch, raw evidence manifest, policy versions, budget record, replay fingerprint, and verdict; omitted required evidence blocks certification |
| REQ-002 | Every state-changing evaluator, canary, score, promotion, abort, or rollback transition emits a `RECEIPT` | Each receipt names the transition, predecessor receipt(s), actor/service version, effect identity, input evidence boundary, outcome, and uncertainty state; duplicate delivery is idempotent by receipt identity |
| REQ-003 | Certificates and receipts share a deterministic replay fingerprint | Recomputing the fingerprint from the same canonical inputs yields the same value across processes; changed artifact, fixture, evaluator, policy, reducer, environment, seed, budget, or predecessor evidence yields a mismatch |
| REQ-004 | An independent verifier can validate the evidence offline | The verifier resolves digests, recomputes canonical serialization and derived values, checks receipt-chain continuity and hard vetoes, reruns deterministic checks, and returns typed pass, fail, or insufficient-evidence results without live agent calls |
| REQ-005 | The evaluator preserves evidence layers | Raw per-item observations and metadata remain immutable and separately addressable from normalization, calibration, aggregation, and final policy decisions; a summary score cannot replace the raw evidence |
| REQ-006 | The canary service is versioned, isolated, and freshness-aware | Canary fixtures are bound to an epoch digest, include deterministic and adversarial/metamorphic cases, detect proposer-visible leakage, and rotate or retire before repeated adaptation makes them stale |
| REQ-007 | Promotion is guarded by independent evidence and hard vetoes | Schema, build, security, regression, canary-leak, and integrity failures veto promotion; soft score aggregation cannot rescue a hard failure; `INSUFFICIENT_EVIDENCE` is not `PASS` |
| REQ-008 | The services remain shared and variant-neutral | The three downstream variants call one evaluator/canary/promotion contract and cannot fork certificate fields, fingerprint inputs, or promotion semantics without a versioned shared-contract change |
| REQ-009 | The contract is additive and dark before authority cutover | Certificates and receipts can be emitted and verified beside the legacy path; they do not authorize a production change until the later mode cutover contract accepts their evidence |
| REQ-010 | The later fan-out is sequence-safe | The plan records that the 010 migrations consume this source only after 009 freezes shared contracts and emits the write-set conflict graph; this phase does not invent competing write ownership |

### Certificate and receipt evidence boundary

The `CERTIFICATE` is the run-level statement. It attests that a named evaluator epoch observed a named candidate and
base under a named policy, that the required raw observations and guard results are present, and that the declared
verdict follows the policy. It is not a claim that the candidate is globally correct. The certificate must include
the content digests for the base, candidate, task corpus, evaluator capsule, canary epoch, calibration profile,
normalizer/reducer, environment descriptor, and all referenced receipts. It must also include raw-observation and
derived-result manifests, the budget ledger, the stable run and candidate identities, the canonical replay fingerprint,
and an explicit `PASS`, `FAIL`, `ABORT`, or `INSUFFICIENT_EVIDENCE` verdict.

The `RECEIPT` is the transition-level statement. It attests the attempted operation and its causal evidence rather
than repeating the whole run. At minimum, the shared vocabulary covers `evaluation_started`, `candidate_scored`,
`canary_checked`, `promotion_proposed`, `promotion_blocked`, `promoted`, `aborted`, and `restored`. A receipt records
the transition authorization result, effect idempotency key, predecessor receipt ids, input and output digests,
attempt number, service version, replay fingerprint, and an explicit `completed`, `vetoed`, `uncertain`, or
`recovered` outcome. An effect that may have run before its receipt became durable remains `uncertain` until the
effect-recovery policy resolves it; it is never inferred successful from a process exit alone.

### Replay-fingerprint input contract

The canonical fingerprint input is an ordered, length-delimited serialization of: the shared contract and schema
versions; stable run, lineage, candidate, and base identities; base and candidate artifact digests; evaluator capsule
digest; task and canary epoch digests; calibration and rubric digests; normalizer, reducer, and promotion-policy
versions; executor/runtime/model/tool capability descriptors; raw-observation manifest and deterministic ordering;
random seeds; budget, deadline, admission, and retry decisions; predecessor receipt and sealed-artifact references;
and the exact verifier ruleset. The serializer normalizes maps by key, arrays by declared logical order, numeric values
by the contract's representation, and absent values by explicit tags. It excludes wall-clock time, local paths,
database row offsets, process ids, network addresses, and signature-envelope bytes unless a service explicitly declares
one of them semantic. A verifier reports the first mismatching input class and refuses a substituted or partial input.

### Offline verification contract

An independent verifier first checks schema support and content-addressed retrieval, then recomputes the certificate
fingerprint, receipt-chain links, raw-observation manifest, normalization and reduction, canary and metamorphic
relations, policy hard gates, and declared transition outcome. It must distinguish `PASS`, `FAIL`, `VETOED`,
`INCOMPLETE`, and `UNSUPPORTED_VERSION`; it may not downgrade missing evidence to a score of zero or treat an unknown
field as an ignored extension. The verifier emits its own verification receipt bound to the certificate fingerprint,
verifier version, ruleset digest, and evidence digests, allowing later audits to identify verifier drift.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A run-level `CERTIFICATE` and transition-level `RECEIPTS` have a frozen shared schema, explicit outcome vocabulary, and content-addressed evidence references.
- **SC-002**: An independent offline verifier reproduces the replay fingerprint and accepts only when raw evidence, reducers, hard gates, and receipt-chain continuity all match.
- **SC-003**: The evaluator, canary, and promotion services are defined once and can be consumed by all three benchmark variants without semantic forks.
- **SC-004**: Promotion evidence separates deterministic hard vetoes, canary results, calibrated soft scores, and insufficient evidence; reward success alone cannot authorize promotion.
- **SC-005**: The contract remains additive and dark, consumes the `003-sealed-artifacts` primitives, and hands a stable receipt/fingerprint boundary to `005-resume-adapter`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate becomes a score summary** - A scalar or aggregate can hide localized reward hacking and judge disagreement. Mitigation: retain item-level raw observations, transition evidence, vetoes, and reduction inputs in the certificate manifests.
- **Evaluator feedback becomes an attack surface** - Candidates may optimize visible evaluator behavior or leak canaries. Mitigation: blind candidate aliases, isolate proposer access, scan for semantic canary leakage, rotate epochs, and record leak vetoes without exposing matching canary text.
- **Shared services drift across variants** - Three benchmark variants may add incompatible fields or thresholds. Mitigation: one service owner, versioned shared contracts, adapter-only variant extensions, and a reuse matrix in the plan.
- **Offline replay is falsely deterministic** - Stable sorting alone does not stabilize admission, retry, deadline, environment, or partial-failure decisions. Mitigation: include those decisions and all declared nondeterministic inputs in the fingerprint and retain their receipts.
- **Promotion is rescued by a soft judge** - A strong aggregate can mask schema, security, regression, or integrity failure. Mitigation: hard vetoes are evaluated before soft scoring and cannot be overturned by adjudication.
- **Unknown effect outcome is mistaken for success** - A crash after an external effect but before its receipt creates an uncertain state. Mitigation: use the phase-007 effect/receipt primitive and require explicit recovery policy before another promotion transition.
- **Ordering mismatch** - The manifest records no dependency for this child while the content consumes phase-006 primitives. Mitigation: preserve the required sibling adjacency as navigation/ordering and fail closed during implementation if the phase-006 contract is unavailable.
- **Dependencies**: `003-sealed-artifacts` primitives; the typed ledger and reducers in sibling phases 001-002; the parent shared-mode contract and write-set conflict graph; the phase-012 contract freeze before later 010 migrations; and the spec-kit validator for this planning packet.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen shared contracts:
- Which signature, key-rotation, and trust-root mechanism is selected by the sealed-artifact primitive without duplicating certificate semantics here?
- Which evaluator observations are portable offline and which require an explicit `UNAVAILABLE_OFFLINE` result rather than a replay approximation?
- What minimum canary epoch size, rotation rule, and leakage detector threshold are required before a candidate can enter shadow or canary evaluation?
- Which promotion policies use conservative lower bounds, paired deltas, or five-dimensional Pareto/lexicase evidence for each downstream variant while preserving the shared decision vocabulary?
- Which fields are public to the proposer, which remain verifier-only, and which are redacted while preserving digest-bound auditability?
- Which receipt recovery states must the successor `005-resume-adapter` replay, salvage, or block?
<!-- /ANCHOR:questions -->
