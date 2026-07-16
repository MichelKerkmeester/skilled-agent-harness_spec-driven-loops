---
title: "Feature Specification: Deep Alignment - Typed Ledger Schema"
description: "Plan the typed append-only event vocabulary for Deep Alignment: per-lane conformance checks against a named authority, verify-first findings, authority epochs, applicability, proof witnesses, adjudication, and versioned envelope/upcaster hooks over the shared review-loop contract. Reducers and projections belong to the next sibling."
trigger_phrases:
  - "deep alignment typed ledger schema"
  - "deep-alignment event vocabulary"
  - "deep alignment append-only events"
  - "typed authority conformance ledger"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep Alignment event ownership and shared review-loop handoff"
    next_safe_action: "Freeze authority, lane, and finding events against phase-012 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Typed Ledger Schema

> Child adjacency under `001-typed-ledger-schema` (independent planning contracts, not runtime dependencies): predecessor none (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-alignment |
| **Origin** | Deep Alignment mode migration after the phase-006 transition-authorized ledger core and phase-012 shared event contracts |
| **Inputs** | `034-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`, and the shared review-loop contract used by deep-review |
| **Output** | A ratifiable Deep Alignment event union, field-level payload contract, and version/upcaster hook plan; no reducer or projection implementation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment checks each lane against a named authority and must preserve a verify-first distinction between an observed
condition, a candidate finding, an independently verified result, and a conformance decision. The run also crosses several
identity boundaries: an authority source is compiled into a versioned capsule and epoch, rules resolve applicability against
subject snapshots, lanes emit raw observations, and independent validators produce proof or uncertainty. Without one typed
append-only vocabulary, replay can confuse a changed authority with a changed subject, treat a missing observation as a pass,
or let a detector-produced candidate become a blocking finding without a verification record.

The research inputs require authority validity before artifact conformance, a typed rule IR with deterministic, schema,
relational, and reasoning-required obligations, first-class `not_applicable` and unresolved outcomes, digest-bound evidence,
chronological deviations that never erase the original observation, cross-epoch compatibility classes, and proof-carrying
findings. The mode-specific findings in `findings-registry-modes.json` and the cross-mode recommendations in
`findings-registry.json` also require blinded detector output, separate scorer identity, raw score retention, and replayable
positive, negative, boundary, and stateful witnesses.

This phase plans the Deep Alignment typed event vocabulary over the phase-006 transition-authorized ledger core. It reuses
the shared event and review-loop contract frozen in phase 012, including the backbone shared with Deep Review mode 002.
It defines only event envelopes, immutable payloads, field-level types, and compatibility hooks. The next sibling owns
reducers and projections; later siblings own sealed alignment artifacts, certificates, resume, shadow parity, rollback, and
the mode gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `DeepAlignmentEventEnvelope<TType, TPayload>` specialization over the phase-012 shared review-loop envelope, with inherited identity, causation, authorization, sequence, integrity, receipt, branch, and replay fields kept in one shared owner.
- A closed Deep Alignment event namespace for authority binding and validation, authority-epoch compatibility, lane planning and execution, subject snapshots, applicability, raw observations, blinded candidate findings, independent verification, proof witnesses, adjudication, deviations, coverage, convergence, continuity, and terminal handoff.
- Field-level types and requiredness rules for authority capsules, epochs, rule IR nodes, profiles, applicability predicates, lanes, subjects, observations, evidence receipts, candidates, findings, verifiers, proof witnesses, deviations, compatibility outcomes, and conformance dispositions.
- Separate immutable facts for raw detector observations, verifier results, confidence and impact, evidence classes, authority compatibility, and adjudication; no event may rewrite or delete an earlier observation.
- Independent envelope and payload versioning, compatibility classes, pure upcaster hooks, source-to-target paths, replay-fingerprint inputs, and fail-closed handling for unknown, ambiguous, expired, rolled-back, mixed-version, or lossy conversions.
- Reuse of the shared review-loop lifecycle and shared event names for run, resume, scope, pass, convergence, blocked-stop, continuity, and terminal behavior; Deep Alignment adds only mode-specific payloads and event extensions.

### Out of Scope
- Reducer algorithms, lane folds, findings registries, applicability or coverage projections, dashboards, claim graphs, materialized gauges, report views, and projection fingerprints; these belong to `002-reducers-and-projections`.
- Reimplementation of the phase-006 authorization gateway, append-only ledger, replay fingerprint primitive, phase-012 shared event envelope, shared review-loop lifecycle, receipts, branch identity, or budget contracts.
- Deep Alignment sealed artifacts, authority capsules as a shared artifact implementation, conformance certificates, resume adapters, shadow parity, rollback switches, mode gates, authority cutover, legacy-writer retirement, production code, and implementation tests.
- New conformance policy, authority sources, verifier algorithms, or remediation behavior beyond the Deep Alignment lifecycle and recommendations mapped in the cited registries.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep Alignment specializes the phase-012 shared envelope without duplicate identity, authorization, lineage, receipt, or replay fields | A contract comparison lists inherited fields, mode extensions, and rejected duplicates; the event union validates against the shared contract |
| REQ-002 | The event namespace covers the complete verify-first run from authority validation through lane execution, proof, adjudication, convergence, and handoff | A vocabulary matrix names a typed event for each lifecycle boundary and its required causal or predecessor reference |
| REQ-003 | Authority validity is a prerequisite to artifact conformance | Authority parse, type, capability, rule-test, coverage, expiry, rollback, signature, and mix-and-match results are separately typed; invalid authority blocks conformance and never emits artifact PASS |
| REQ-004 | Applicability and unknown coverage remain first-class outcomes | Applicability records support `applicable`, `not_applicable`, `unresolved`, and `blocked`; conformance records distinguish `conformant`, `non_conformant`, `inconclusive`, `not_applicable`, `untested`, and `blocked` |
| REQ-005 | Raw observations, candidate findings, verification, adjudication, and deviations remain separate append-only facts | Schema fixtures reject in-place finding updates and require evidence, verifier, and authority references before a candidate can become a typed conformance decision |
| REQ-006 | Proof-carrying findings preserve authority, subject, evidence, and verifier identity | Every verified finding binds an immutable authority epoch, subject snapshot digest, applicability decision, evidence receipt set, verifier digest, proof witness references, and explicit verification mode |
| REQ-007 | Cross-epoch and cross-version replay is explicit and safe | Compatibility covers exact, compatible, migrate, pin-old-runtime, degraded, and blocked outcomes; unsupported, ambiguous, expired, rolled-back, mixed, or lossy input fails closed |
| REQ-008 | Known deviations are visible adjudication overlays, not destructive suppression | Deviation events carry scope, authority epoch, verifier digest, issuer, rationale, expiry or invalidation conditions, and the original finding reference; revalidation can reactivate the finding |
| REQ-009 | Shared review-loop behavior is reused with no Deep Alignment fork | Run, resume, scope, pass, convergence, blocked-stop, continuity, and terminal contract comparisons identify shared fields and mode payload extensions; no shadow lifecycle is introduced |
| REQ-010 | The schema boundary is limited to event vocabulary and handoff contracts | A scope audit finds no reducer, projection, sealed artifact, certificate, resume adapter, shadow parity, rollback, authority-cutover, or mode-gate implementation |
<!-- /ANCHOR:requirements -->

The envelope uses a typed `scope` object rather than repeating identifiers in every payload. `scope.runId`, `scope.sessionId`,
and `scope.authorityEpochId` are required on every mode event. `scope.laneId`, `scope.subjectId`, `scope.ruleId`,
`scope.observationId`, `scope.candidateId`, `scope.findingId`, `scope.verificationId`, `scope.deviationId`, and
`scope.proofId` are required only when the event stem needs them. Event payloads carry selectors, references, and digests,
not authority prose, subject bodies, source trees, transcripts, reports, or mutable artifact contents.

### Envelope field contract

| Field group | Planned type | Contract |
|-------------|--------------|----------|
| Event identity | `EventId`, `DeepAlignmentEventType`, `SchemaVersion`, `PayloadVersion` | Branded identifiers; event type is a closed union; envelope and payload versions are independent |
| Time and order | `Timestamp`, `Sequence`, `Hash`, `PrevEventHash` | RFC3339 time, monotonic producer sequence, content hash, and previous-tail hash come from the imported core |
| Shared run scope | `RunId`, `SessionId`, `Generation`, `CausationId`, `CorrelationId` | Shared review-loop identity and causal links are inherited; mode payloads cannot introduce aliases |
| Authority | `AuthorityId`, `AuthorityCapsuleId`, `AuthorityEpochId`, `RuleId`, `RuleIrRef` | Authority identity is digest-bound; an epoch pins source, compiler, profile, applicability, and signature metadata |
| Lane and subject | `LaneId`, `LaneKind`, `SubjectId`, `SubjectSnapshotRef`, `ApplicabilityRef` | Lane kinds are `deterministic`, `schema`, `relational`, or `reasoning-required`; subject snapshots are immutable references |
| Observation and evidence | `ObservationId`, `EvidenceRef[]`, `ReceiptRef[]`, `VerifierRef`, `ArtifactRef[]` | Raw observations, evidence classes, freshness, verifier identity, and external bodies remain separately addressable |
| Findings and decisions | `CandidateId`, `FindingId`, `VerificationId`, `ConformanceStatus`, `Confidence`, `Impact` | Candidate, verification, impact, confidence, and conformance are independent fields; no scalar score substitutes for them |
| Deviations and compatibility | `DeviationId`, `CompatibilityClass`, `CompatibilityDecision`, `UpcastPath[]` | Deviation is an append-only overlay; compatibility records authority and verifier changes without mutating history |
| Replay and authorization | `ReplayFingerprint`, `TransitionAuthorizationRef`, `BudgetRef?` | Fingerprint includes shared core fields, authority epoch, rule IR, subject digest, verifier, policy, and ordered upcast path |
| Payload | `DeepAlignmentPayload` | Closed discriminated union selected by `eventType`; unknown extensions are rejected unless explicitly namespaced |

### Concrete event families

| Family | Event types | Deep Alignment responsibility |
|--------|-------------|-------------------------------|
| Shared review lifecycle | Phase-012 review-loop run, resume/restart, scope, pass, convergence, blocked-stop, continuity, and terminal events | Reuse the shared contract with Deep Alignment payload discriminants; do not copy Deep Review lifecycle definitions |
| Authority and epoch | `deep_alignment.authority_reference_bound`, `deep_alignment.authority_validation_recorded`, `deep_alignment.authority_epoch_compatibility_recorded` | Bind named authority, compiler and profile digests; record valid, invalid, expired, rolled-back, mixed, and compatibility outcomes before lane work |
| Lane and subject | `deep_alignment.lane_plan_recorded`, `deep_alignment.lane_started`, `deep_alignment.subject_snapshot_bound`, `deep_alignment.lane_completed` | Record ordered lane identity, rule subset, verifier policy, target snapshot, budget reference, and execution status without folding a projection |
| Applicability | `deep_alignment.applicability_evaluated` | Resolve authority-specific predicates before expensive checks and preserve `applicable`, `not_applicable`, `unresolved`, or `blocked` with required target facts |
| Observation | `deep_alignment.observation_recorded`, `deep_alignment.evidence_receipt_bound`, `deep_alignment.observation_reconciled` | Keep analyzer output, tool receipt, freshness, source digest, evidence class, and causal relevance as immutable facts |
| Candidate and verification | `deep_alignment.finding_candidate_emitted`, `deep_alignment.finding_verification_recorded` | Separate blinded detector candidates from independent verifier results; retain raw impact, confidence, severity, and evidence strength |
| Proof and adjudication | `deep_alignment.proof_witness_recorded`, `deep_alignment.claim_adjudication_recorded`, `deep_alignment.conformance_assessment_recorded` | Record minimized positive, negative, boundary, or stateful witnesses, counterevidence, assessor mode, and discrete conformance outcome |
| Deviations | `deep_alignment.known_deviation_recorded`, `deep_alignment.known_deviation_invalidated` | Append scoped, justified, expiring overlays while retaining and reactivating the original observation or finding |
| Coverage and epoch replay | `deep_alignment.applicability_coverage_recorded`, `deep_alignment.authority_witness_replayed` | Compare declared applicability edges and old-authority witnesses against the pinned epoch; preserve affected-rule references and compatibility class |
| Handoff | Shared review-loop convergence, blocked-stop, continuity, and terminal events with Deep Alignment payloads | Expose raw gate inputs, unresolved scope, and final event-tail references to the next sibling without creating a reducer-owned result |

The planned event union must preserve the distinction between an authority definition, a compiled rule, an applicability
decision, a raw observation, a candidate, a proof, a verification judgment, a deviation, and a conformance assessment.
`not_applicable`, `unresolved`, `inconclusive`, and `blocked` are not failures to be normalized away. A deviation changes
the interpretation of a finding through a new event; it never edits or deletes the original fact. A remediation proposal,
if introduced by a later mode concern, creates a new subject version and is not part of this schema.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep Alignment event union covers authority validation, epoch compatibility, lane execution, applicability, observations, candidates, proof, verification, adjudication, deviations, coverage, convergence, continuity, and terminal handoff.
- **SC-002**: Every event payload has field-level types, requiredness, identity links, digest rules, authority and subject references, and an independent payload version.
- **SC-003**: The vocabulary preserves raw observations and evidence while representing candidates, verification, proof, adjudication, deviations, and conformance as new immutable events.
- **SC-004**: Authority invalidity, not-applicable, unresolved, inconclusive, untested, and blocked outcomes remain explicit and cannot be coerced to PASS or `conformant`.
- **SC-005**: Every verified finding is proof-carrying and binds the authority epoch, applicability decision, subject digest, evidence receipts, verifier identity, and verification mode.
- **SC-006**: The compatibility plan maps supported historical payloads through pure upcasters, records the ordered conversion path in replay fingerprints, and blocks unknown or lossy input.
- **SC-007**: Deep Alignment reuses the phase-012 review-loop backbone shared with Deep Review and introduces no duplicated lifecycle contract.
- **SC-008**: The phase contains no reducer, projection, sealed artifact, certificate, resume, shadow-parity, rollback, authority-cutover, or mode-gate implementation.

**Given** a valid phase-012 envelope, **When** a Deep Alignment event is encoded, **Then** its mode payload validates without redefining shared identity, authorization, receipt, branch, or replay fields.

**Given** an authority capsule fails parse, capability, rule-test, coverage, signature, expiry, rollback, or mix-and-match validation, **When** a lane attempts conformance evaluation, **Then** the event stream records `authority_invalid` and does not emit a conformance PASS.

**Given** a rule is evaluated against a subject, **When** applicability cannot be resolved or the rule does not apply, **Then** the event records `unresolved` or `not_applicable` before expensive verification and does not manufacture a finding.

**Given** a detector emits a possible finding, **When** independent verification runs, **Then** raw observation, proof witness, verifier result, and conformance assessment remain separate events with orthogonal impact and confidence.

**Given** a known deviation is active, **When** the same subject is rechecked under a changed authority epoch, verifier digest, scope, or expiry, **Then** the deviation is re-evaluated or invalidated while the original failure remains replayable.

**Given** a supported historical event is read, **When** the pure upcaster chain runs, **Then** it returns a current typed payload with original digest, compatibility class, and ordered upcast path retained.

**Given** an event type or version has no registered decoder, **When** the ledger reader encounters it, **Then** replay returns a blocked compatibility result and does not guess a payload shape.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-contract drift** - phase 012 may rename envelope fields, review-loop lifecycle stems, lane fields, or transition tokens. Mitigation: treat inherited members as shared, run a contract diff before implementation, and reject mode-local aliases.
- **Authority invalidity leakage** - a readable or parseable authority file may be expired, rolled back, mixed across epochs, or incompletely tested. Mitigation: make authority validation a typed prerequisite and block conformance on any required invalid result.
- **Applicability collapse** - missing target facts or broken discovery can appear as perfect coverage. Mitigation: record declared applicability edges, `not_applicable`, unresolved, and untested states separately from observed artifacts.
- **Candidate/verdict conflation** - detector output can be mistaken for verified non-conformance. Mitigation: require independent verifier identity, proof witnesses, evidence receipts, and a typed adjudication event before a blocking outcome.
- **Suppression erasure** - a deviation or resolution can hide the original failure and prevent reactivation after drift. Mitigation: append chronological deviation overlays bound to authority, verifier, subject, scope, issuer, and expiry.
- **Mutable evidence leakage** - storing authority prose, subjects, source trees, or reports in payloads breaks replay and retention. Mitigation: store safe references, selectors, content digests, and immutable receipt metadata only.
- **Cross-epoch replay loss** - old witnesses may not map to a new authority without direction-sensitive comparison. Mitigation: retain epoch compatibility classes, affected rule IDs, old witness references, and blocked/degraded outcomes.
- **Review/alignment fork** - a mode-local review loop would diverge from Deep Review and invalidate shared write-set assumptions. Mitigation: import the phase-012 review-loop contract and keep only Deep Alignment payload extensions.
- **Cross-phase scope creep** - reducers, certificates, sealed artifacts, and authority changes are tempting to embed in this schema. Mitigation: use the adjacency contract and explicit ownership handoff as implementation blockers.
- **Dependencies**: phase-006 transition-authorized ledger core, phase-012 shared event and review-loop contracts, the 065/002 findings registries, the Deep Review shared-backbone contract, the later `002-reducers-and-projections` sibling, and the later Deep Alignment mode-gate children.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-012 envelope field names, event identity algorithm, transition tokens, receipt shape, and shared review-loop stems are frozen for the first implementation pass?
- Does phase 012 provide generic authority, subject snapshot, applicability, evidence, verifier, proof, deviation, and conformance reference types, or should Deep Alignment define digest-only extensions?
- Which legacy Deep Alignment state rows and lane outputs map directly to current events, and which require `degraded` or `blocked` compatibility because stable identities are absent?
- Which authority capsule validation results are shared control-service events versus Deep Alignment payload extensions?
- Which proof witness minimization and verifier identity fields remain stable enough for schema version one without coupling this phase to a reducer or a specific verifier implementation?
- Which coverage facts are immutable lane observations and which are derived projections owned by `002-reducers-and-projections`?

These questions are deliberately left for contract ratification and implementation planning. They do not authorize a reducer,
projection, sealed artifact, certificate, resume adapter, shadow-parity harness, rollback switch, authority decision, or mode gate
in this phase.
<!-- /ANCHOR:questions -->
