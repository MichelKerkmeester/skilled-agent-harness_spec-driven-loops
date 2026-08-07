---
title: "Feature Specification: Sealed Reference Artifacts"
description: "Plan immutable, content-addressed reference artifacts whose bytes are sealed, verified on every read, retained by explicit lifecycle policy, and pinned into replay evidence."
trigger_phrases:
  - "sealed reference artifacts"
  - "deep-loop immutable artifact digest"
  - "reference artifact verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts"
    last_updated_at: "2026-07-21T01:33:45Z"
    last_updated_by: "codex"
    recent_action: "Hardened fixed hashing, immutable reads, and replay reference resolution"
    next_safe_action: "Carry the ordered-digest durability dependency into replay-fingerprint follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/sealed-reference-artifacts.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Sealed Reference Artifacts

> Phase adjacency under the shared-services parent (navigation order, not a hard runtime dependency): predecessor `001-receipts-and-effect-recovery`; successor `003-blinded-adjudication-service`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/002-sealed-reference-artifacts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Second child of the phase-007 shared evidence and control services parent |
| **Depends on** | None (`[]`); sibling planning contracts compose at the phase-007 parent gate |
| **Consumers** | Phase 006 replay fingerprints, phase 008 shadow parity, and phase 013 mode migrations |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep-loop runs currently may depend on prompts, fixtures, configuration, prior-run output, evaluator material, or
canaries whose path or logical name stays stable while the underlying bytes change. A run record that points to
`latest`, a mutable file, or an unverified cache cannot prove what it consumed. Replay may then execute against
different inputs without an observable contract violation, and shadow parity can compare two paths that only appear
equivalent because their reference inputs were never pinned.

The phase-004 spine ADR ratifies sealed reference artifacts addressed by digest as one of the shared primitives and
requires mutable or unversioned inputs to fail the replay contract
(`../../004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`). The phase-006
replay-fingerprint contract requires every replay-affecting artifact or configuration value to be ledger-addressable
by immutable digest and refuses trusted output when an input cannot be reconstructed
(`../../006-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`). The parent program and phase
manifest place this mechanism in the additive-dark shared-services layer before compatibility and shadow parity
(`../../spec.md`, `../../manifest/phase-tree.json`).

This phase plans one mechanism that canonicalizes an input, computes and records its content digest, freezes the exact
bytes, references the artifact only by that digest, recomputes the commitment on every read, and fails closed on
absence or mismatch. Lifecycle metadata may evolve append-only, but sealed bytes and their identity never do. Given
the same verified sealed-artifact set and the same registered phase-006 replay contract, a run must reproduce the same
effective events and projection bytes; a difference is a typed verification failure, never an implicit rebaseline.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed seal descriptor for prompt sets, fixtures, prior-run outputs, configuration, evaluator capsules, authority capsules, sealed canaries, independence batches, and later registered artifact kinds.
- Deterministic byte canonicalization with a registered canonicalization version, media type, byte length, digest algorithm identifier, content digest, artifact kind, and optional source-provenance digest.
- Fixed internal SHA-256 derivation over complete canonical bytes; caller-supplied digest functions or values cannot define artifact identity.
- Atomic sealing: stage bytes, canonicalize once, compute the digest, persist an immutable blob and descriptor, verify the persisted object, then publish the digest reference; partial seals remain unreachable.
- Reference-by-digest in run, event, receipt, certificate, replay, and shadow-parity records; mutable paths, aliases, tags, or `latest` selectors may aid discovery but cannot authorize consumption.
- A verified-read API that resolves the digest, reads the immutable object, recomputes length and digest over the returned bytes, validates descriptor compatibility, and yields either a verified handle or a typed failure with no bytes released to the consumer.
- Idempotent sealing of identical canonical bytes, explicit collision/conflict handling, corruption quarantine, and bounded diagnostics that never substitute a nearby artifact.
- Append-only lifecycle records for creation, reachability, retention class, audit or rollback holds, quarantine, garbage-collection eligibility, deletion receipts, and restoration of byte-identical content under the same digest.
- Fail-closed mark-and-sweep retention rooted in open or retained runs, replay attestations, receipts/certificates, rollback windows, archival-reader requirements, and explicit holds; deletion requires proof that no protected reference remains.
- Integration with phase-006 replay fingerprints and phase-008 shadow parity: ordered artifact-reference sets and verification results become fingerprint inputs and parity evidence.

### Out of Scope
- Choosing the storage backend, compression format, encryption scheme, or access-control provider before runtime constraints are measured; none may weaken the fixed SHA-256 content identity.
- Defining the replay descriptor, ledger frame, event envelope, or transition-authorization vocabulary owned by phase 006.
- Implementing shadow comparison, upcasters, compatibility adapters, rollback orchestration, or authority cutover owned by phases 008 and 014.
- Defining mode-specific artifact schemas or certificate semantics; phase 013 mode children specialize the shared descriptor without replacing its seal and verified-read invariants.
- Treating a signature, filename, object-store version, database row ID, timestamp, or access-control decision as a substitute for the canonical content digest.
- Mutating, overwriting, auto-repairing, or silently re-sealing bytes under an existing digest after publication.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sealing commits deterministic canonical bytes | The registered canonicalization version produces one byte sequence for an artifact kind; repeated sealing of equivalent input emits the same descriptor bytes and content digest |
| REQ-002 | Publication is atomic and publish-once | A digest reference becomes discoverable only after blob and descriptor persistence plus post-write verification; the service never overwrites an identity, and out-of-band mutation is detected and quarantined before use |
| REQ-003 | Every consumable reference is content-addressed | Run and ledger records carry an algorithm-qualified content digest and artifact kind; a mutable path, alias, tag, or `latest` selector alone is rejected before execution |
| REQ-004 | Every read verifies before release | The reader recomputes byte length and fixed SHA-256, validates descriptor and artifact-kind compatibility, and returns a frozen byte copy or no consumable bytes on failure |
| REQ-005 | Duplicate and conflicting seals are explicit | Identical canonical bytes are idempotent; an existing digest with different bytes or incompatible identity metadata is quarantined and reported as a typed collision/conflict |
| REQ-006 | Replay fingerprints bind the exact artifact set | Before replay input exists, every ordered reference is resolved through the store and authorized ledger, rehashed with SHA-256, and matched to its claimed verification and ledger fields; unresolved or forged input blocks a trusted fingerprint |
| REQ-007 | Shadow parity compares equivalent sealed inputs | Legacy and dark executions must cite the same verified artifact-reference set before parity is evaluated; differing, missing, or unverifiable seals produce an input-equivalence failure rather than a behavior comparison |
| REQ-008 | Lifecycle changes never rewrite artifact identity | Retention, holds, quarantine, deletion eligibility, and restoration are append-only lifecycle records separate from the immutable blob and seal descriptor |
| REQ-009 | Retention preserves every protected replay root | Garbage collection marks references from live runs, replay attestations, receipts/certificates, rollback windows, archival requirements, and explicit holds; any reachable or indeterminate digest is retained |
| REQ-010 | Deletion is fail closed and auditable | Sweep requires a complete reachability pass, elapsed retention horizon, no hold, and a deletion receipt; interrupted or incomplete analysis deletes nothing, and later reads return a typed tombstone/missing-artifact failure |
| REQ-011 | Restoration cannot change history | A deleted artifact may be restored under its original digest only when recomputed canonical bytes match exactly; different bytes require a new digest and new reference |
| REQ-012 | The service remains additive and non-authoritative | Seal, read-verification, or retention failure is observable and blocks dark replay/parity evidence, but does not mutate legacy state or transfer runtime authority before phase 014 |

### Verification model

**Given** the same prompt set is presented in equivalent source representations, **When** the registered canonicalizer
seals each input, **Then** both produce byte-identical canonical content, the same algorithm-qualified digest, and one
idempotent immutable object.

**Given** a run cites a digest whose stored bytes were changed, truncated, replaced, or paired with an incompatible
descriptor, **When** the artifact is read, **Then** verification fails before any bytes reach the run and no replay,
parity, receipt, or certificate can treat the input as trusted.

**Given** legacy and dark executions cite the same verified artifact-reference set and the same registered replay
contract, **When** phase 008 evaluates shadow parity, **Then** the executions must reproduce the same effective events
and projection bytes or surface a deterministic mismatch bound to the sealed inputs.

**Given** a digest remains reachable from a protected run, fingerprint attestation, receipt, rollback window, archival
reader, or hold, **When** retention evaluates it, **Then** the object is retained; an incomplete reachability scan also
retains it.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One registered seal descriptor identifies canonical artifact bytes by algorithm-qualified digest, kind, size, media type, and canonicalization version.
- **SC-002**: Atomic sealing publishes no partial artifact and never changes bytes under an existing digest.
- **SC-003**: Every consumer receives bytes only through verified read; corruption, absence, collision, or incompatible versions fail closed with typed diagnostics.
- **SC-004**: Phase-006 fingerprints and phase-008 parity evidence bind the same ordered sealed-artifact references and reject mutable or unverifiable input.
- **SC-005**: Lifecycle and retention records preserve replay, audit, rollback, and archival roots without mutating the sealed object or descriptor.
- **SC-006**: Garbage collection deletes only proven-unreachable, horizon-expired, unheld artifacts and emits a durable deletion receipt; uncertainty retains data.
- **SC-007**: The service stays additive-dark and does not move authority from the legacy runtime.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase declares `depends_on: []`, but its contract composes with the phase-006 replay fingerprint and ledger
contracts at the integrated program gate. Canonicalization is the highest identity risk: platform-dependent newlines,
object-key order, locale, archive metadata, filesystem traversal order, or implicit decoding can make equivalent
inputs hash differently. Each artifact kind therefore requires a registered, versioned canonicalizer, and unknown
versions fail closed rather than falling back to host behavior.

The opposite risk is false equivalence: hashing only a mutable pointer, compressed representation, or incomplete
manifest can claim two inputs match while relevant bytes differ. The seal commits the canonical consumable bytes and
their descriptor; storage transforms remain outside identity unless their decoded output verifies. Read verification
must cover the exact bytes returned to the consumer to prevent time-of-check/time-of-use substitution.

Retention has asymmetric failure costs. Deleting a reachable artifact can make historical replay permanently
unverifiable, while retaining an extra immutable object costs storage. The lifecycle therefore prefers retention on
uncertainty, roots reachability in ledger evidence, separates quarantine from deletion, and requires auditable sweep
receipts. Concrete storage, digest, encryption, and access-control choices remain execution decisions, but none may
weaken immutable content identity, verified reads, replay binding, or additive-dark authority discipline.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The runtime fixes SHA-256 internally, registers `deep-loop-json@1`, `application/json`, and a dedicated
filesystem-backed store for prompt sets, fixtures, prior-run outputs, and configuration. Later artifact kinds may add
canonicalization profiles without weakening fixed SHA-256 references, deterministic canonical bytes, atomic
publication, verification before release, append-only lifecycle evidence, conservative retention, or byte-identical
restoration.
<!-- /ANCHOR:questions -->
