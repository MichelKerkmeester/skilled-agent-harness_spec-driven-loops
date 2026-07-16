---
title: "Feature Specification: Replay Fingerprints"
description: "Define independently versioned replay fingerprints over closed typed-ledger ranges, canonical replay dependencies, and byte-stable outputs, with immutable attestation storage and fail-closed mismatch detection for shadow parity and whole-system verification."
trigger_phrases:
  - "replay fingerprints"
  - "deep-loop deterministic replay digest"
  - "ledger fingerprint mismatch"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the replay-fingerprint contract for deterministic ledger verification"
    next_safe_action: "Implement derivation, attestation storage, and fail-closed mismatch checks"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Replay Fingerprints

> Phase adjacency under `006-transition-authorized-ledger-core` (navigation order, not a hard runtime dependency): predecessor `002-typed-append-only-ledger`; successor `004-transition-authorization-gateway`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the phase-006 transition-authorized ledger-core parent |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-006 parent gate |
| **Consumers** | Phase 008 shadow-parity harness and phase 016 whole-system replay gate |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The typed append-only ledger defines immutable canonical event bytes, explicit sequence order, authorization linkage, and hash-chain integrity, but integrity alone does not identify the complete replay contract or prove that two executions derived the same effective events and projections. A ledger head can be valid while a changed envelope registry, upcaster chain, reducer version, projection schema, or canonicalization rule produces different bytes. Conversely, an output-only digest can hide a different event history that happens to collapse to the same projection (`../002-typed-append-only-ledger/spec.md`).

The phase-004 event contract separates `envelope_version` from per-type `event_version`, preserves stored bytes through upcasting, and requires deterministic registry and upcaster-chain identity. The upstream transition/versioning policy requires historical versions to replay through their registered rules and unknown versions or missing links to fail closed; replay fingerprints must therefore carry their own independent version and bind the exact compatibility machinery used rather than infer semantics from the current runtime (`../001-versioned-event-envelope/spec.md`, `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`).

This phase plans a versioned fingerprint descriptor derived from a closed ledger range. It commits both the immutable input sequence and the deterministic replay result, stores that descriptor as a typed attestation after the covered range, and defines a verifier that refuses to yield trusted output when any component differs. The phase-tree assigns those attestations to the phase-008 shadow-parity harness and the phase-016 whole-system replay gate, so neither consumer may generate a fresh expected value during verification or accept an unversioned digest (`../../manifest/phase-tree.json`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical replay-fingerprint descriptor with an independent positive `fingerprint_version`, explicit hash and canonicalization algorithms, ledger identity, covered sequence range, event count, genesis/head hashes, and ordered event-sequence digest.
- Replay-contract inputs: envelope registry identity, observed type/version set, upcaster registry and ordered chain identities, reducer identity/version, projection schema version, and every replay-affecting configuration value represented by ledger evidence.
- Separate component digests for stored record bytes, effective upcast event bytes, and byte-stable projection output, plus one final digest over the canonical descriptor.
- A streaming derivation algorithm that consumes only the ledger reader's verified sequence in ascending order and rejects gaps, forks, unchecked events, unknown versions, unresolved upcasters, nondeterministic inputs, or unregistered replay components.
- Independent fingerprint-version registration alongside the event-envelope registry: historical fingerprints remain recomputable by their registered version; new attestations emit only the current fingerprint version; unsupported future or missing versions fail closed.
- Storage as a typed `deep-loop.replay.fingerprint-recorded` attestation appended after its closed covered range. The attestation contains or content-addresses the canonical descriptor and never includes its own ledger record in the digest it records.
- Rebuildable lookup indexes or prefix caches for discovery and diagnostics, with the ledger attestation and covered immutable bytes remaining authoritative.
- Verification and mismatch reporting that returns a typed non-zero failure with the ledger/range, fingerprint version, expected and actual component digests, and earliest divergent sequence or replay stage when determinable.
- Consumption gates that prevent mismatched or unverifiable replay output from becoming projection state, phase-008 shadow-parity evidence, cutover evidence, or a phase-016 whole-system pass.

### Out of Scope
- Redefining envelope fields, registry semantics, ledger frames, sequence allocation, hash-chain integrity, append durability, or authorization proof requirements owned by siblings 001, 002, and 004.
- Implementing upcasters, compatibility adapters, legacy projections, the shadow-parity comparison policy, or in-flight-state migration owned by phase 008.
- Defining mode-specific reducers and projection schemas; later phases must register their stable identities and versions as fingerprint inputs.
- Treating host paths, process IDs, wall-clock time, object insertion order, locale, runtime discovery order, or mutable environment state as valid replay inputs.
- Silently regenerating, overwriting, or accepting a new expected fingerprint after a mismatch. Rebaselining requires a new authorized attestation over an explicitly identified ledger range and contract version.
- Moving runtime authority from legacy state to the ledger; the fingerprint path remains additive, dark, and non-authoritative until the staged phase-014 cutover.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fingerprint commits the exact verified ledger range | The descriptor binds ledger ID, inclusive start/end sequence, event count, genesis/head hashes, each canonical record hash in order, and an ordered sequence digest; changing, deleting, inserting, or reordering any covered record changes verification output |
| REQ-002 | Replay semantics are part of the fingerprint | The descriptor binds envelope registry, observed type/version set, upcaster registry and chain identities, reducer identity/version, projection schema version, and canonicalization algorithm; an unregistered or missing component blocks derivation |
| REQ-003 | Stored, effective, and projected bytes are independently verifiable | Derivation emits component digests for immutable stored frames, effective post-upcast events, and canonical projection bytes before computing the final descriptor digest |
| REQ-004 | Fingerprint evolution is explicit and independent | `fingerprint_version` is a positive registered version distinct from `envelope_version` and `event_version`; current writers emit only the latest fingerprint version while verifiers retain registered historical implementations |
| REQ-005 | Derivation is deterministic and platform-neutral | Repeated derivation over the same verified range and registered replay contract produces byte-identical descriptor bytes and digest across supported processes and platforms, without timestamps, paths, locale, discovery order, or mutable environment input |
| REQ-006 | Attestation storage avoids recursive self-inclusion | A fingerprint attestation is appended after the covered range, names that closed range explicitly, and is excluded from its own digest; duplicate exact attestations are idempotent while conflicting attestations for the same run/range/version fail closed |
| REQ-007 | Verification fails closed before trusted consumption | Ledger corruption, range drift, unsupported fingerprint version, contract-digest drift, stored/effective/projection mismatch, or missing attestation returns a typed failure and yields no trusted replay result, parity certificate, cutover evidence, or whole-system pass |
| REQ-008 | Mismatch evidence is precise and non-destructive | The verifier reports bounded expected/actual component digests and the earliest divergent sequence or replay stage when determinable, never mutates the ledger, never rewrites the attestation, and never auto-accepts the new value |
| REQ-009 | Replay-affecting configuration must be ledger-addressable | A reducer or mode cannot produce a valid fingerprint when its result depends on configuration, artifacts, or policy not committed by an event, immutable referenced digest, or registered replay-contract identity |
| REQ-010 | Downstream consumers use the same verification API | Phase 008 consumes verified fingerprint results for shadow parity and phase 016 consumes them for mixed-version and whole-system replay; neither consumer implements an alternative digest or bypasses a typed mismatch |
| REQ-011 | Dark coexistence preserves legacy authority | Fingerprint generation or verification failure is observable and blocks later evidence, but it does not alter the current legacy result, state, schema, or authority before phase 014 |

### Canonical fingerprint descriptor

| Component | Required inputs |
|-----------|-----------------|
| Identity and version | `fingerprint_version`, hash algorithm, canonicalization version, ledger/run ID, inclusive sequence range, and event count |
| Stored sequence | Genesis hash, terminal head hash, ordered record/frame hashes, canonical stored bytes digest, and authorization-linkage digest |
| Effective sequence | Envelope registry digest, observed `event_type@event_version` set, upcaster registry digest, ordered upcaster-chain identities, and canonical effective-event digest |
| Replay result | Reducer identity/version, projection schema version, ledger-addressed configuration/artifact digests, and canonical projection digest |
| Final commitment | Digest of the canonical descriptor with the final-digest field omitted; the descriptor bytes and final digest are retained together |

The canonical serializer uses explicit field order and length-delimited values; arrays preserve ledger or declared registry order, while unordered maps are normalized by the registered canonicalization version. The verifier first validates the ledger and the fingerprint attestation, then reconstructs each component from raw stored bytes through the registered read and reduction boundaries. A descriptor is valid only when every component and the final commitment match.

### Mismatch contract

A mismatch is a verification failure, not a candidate baseline. The verifier returns a typed error containing the fingerprint version, ledger identity, covered range, failing component, expected digest, actual digest, and the earliest divergent sequence, upcaster hop, reducer stage, or projection section available from deterministic comparison. It exposes no trusted projection and produces no success receipt. Diagnostic reporting uses a separate bounded audit channel when the protected ledger cannot safely accept another record.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One registered descriptor format commits the closed stored range, effective event sequence, replay contract, and byte-stable projection output.
- **SC-002**: The same verified ledger range and replay-contract versions reproduce byte-identical descriptor bytes and final digest across supported platforms.
- **SC-003**: Mutation, deletion, insertion, reordering, registry drift, upcaster drift, reducer drift, projection drift, and missing replay inputs each produce a typed fail-closed mismatch.
- **SC-004**: A typed attestation records the fingerprint after the covered range without recursive self-inclusion, silent replacement, or a second source of authority.
- **SC-005**: Phase 008 and phase 016 consume the same verified result and cannot create or accept an expected fingerprint during the comparison path.
- **SC-006**: Fingerprint failures remain observable but non-authoritative while the ledger is dark and legacy execution remains canonical.

**Given** identical verified ledger bytes and registered replay dependencies, **When** two supported processes derive a fingerprint, **Then** every component descriptor byte and final digest is identical.

**Given** a covered record is changed, removed, inserted, or reordered, **When** verification recomputes the stored-sequence component, **Then** it fails closed and yields no effective events or projection.

**Given** stored bytes are unchanged but an envelope registry, upcaster, reducer, projection schema, or ledger-addressed configuration digest differs, **When** replay is verified, **Then** the responsible component mismatch is surfaced and no parity or gate certificate is produced.

**Given** an attestation uses an unknown future `fingerprint_version` or references an unavailable historical implementation, **When** a current reader evaluates it, **Then** the reader refuses verification without inferring semantics from the envelope version.

**Given** a verifier observes a mismatch, **When** diagnostics are emitted, **Then** the expected attestation and ledger remain immutable and the actual digest is not promoted to a new baseline.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase declares `depends_on: []`, but the contract composes with the sibling versioned envelope and typed ledger at the phase-006 parent gate. Its primary risk is an incomplete commitment: hashing only the ledger head proves stored history while missing replay-code drift, and hashing only a final projection can hide different histories. The descriptor therefore binds stored, effective, and projected bytes plus every registered replay dependency.

Canonicalization drift is equally dangerous. Native JSON serialization, filesystem discovery, timestamps, locale, object insertion order, or mutable environment values would make a digest machine-dependent. The fingerprint version must own an explicit serializer and reject replay-affecting input that is not ledger-addressed or content-addressed. Algorithm agility is handled by registration, not silent replacement; historical fingerprints retain their exact implementation.

Storage can also create recursion or split authority. The attestation is appended only after its inclusive covered range is closed, never hashes itself, and remains an event-level commitment over immutable ledger bytes. Rebuildable indexes are caches. Mismatch handling never truncates, repairs, rewrites, or rebaselines the ledger. These constraints preserve the additive-dark posture required by the program spec and provide the stable evidence that `../../manifest/phase-tree.json` assigns to phases 005 and 013.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution may choose the concrete hash primitive and module names after confirming runtime support, but it must register the algorithm under `fingerprint_version`, preserve historical verification, use an explicit canonical serializer, retain component digests, exclude the attestation from its own range, and fail closed on every unverifiable dependency or mismatch.
<!-- /ANCHOR:questions -->
