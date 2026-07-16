---
title: "Feature Specification: Versioned Event Envelope"
description: "Define the canonical wire envelope, type/version registry, per-type required-field contracts, and deterministic read-time upcaster entry points that every future deep-loop ledger event uses while the new substrate remains additive, dark, and non-authoritative."
trigger_phrases:
  - "versioned event envelope"
  - "deep-loop event type registry"
  - "read-time event upcaster"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Level 2 planning contract for the canonical versioned event envelope"
    next_safe_action: "Implement the registry, validators, and upcaster seams behind the dark ledger path"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Versioned Event Envelope
> Phase adjacency under the transition-authorized-ledger-core parent (navigation, not dependency): predecessor none (first sibling); successor `002-typed-append-only-ledger`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the phase-006 transition-authorized ledger core |
| **Dependencies** | None; `depends_on: []` in the approved phase definition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program requires one typed append-only event spine to serve every deep-loop mode, but the shipped runtime currently persists several producer-native JSONL shapes. The observability writer emits `schema_version`, `event`, and `status`; council round state creates a second `schema_version` envelope with its own timestamps; executor audit writes `type` plus `event`; and the fan-out status ledger accepts an arbitrary serializable entry (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`). The generic repair helper safely appends and repairs JSONL records, but it does not impose a domain schema (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/jsonl-repair.ts`). These are valid shipped contracts, not yet one replayable event protocol.

The phase-004 transition policy fixes the compatibility direction before any typed writer exists: every stored domain event has a stable namespaced discriminator and positive per-type version; current writers emit only the latest registered version; current readers upcast supported historical versions through pure adjacent transforms; source bytes and immutable identity remain available; and an unknown type, future version, missing link, lossy transform, or ambiguous default fails closed (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`). The program parent additionally requires the phase-006 substrate to land additive, dark, and non-authoritative, with legacy behavior remaining authoritative (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md`).

This phase plans the common outer record, the registry that binds each event type/version to a required payload contract, and the read boundary where an upcaster chain produces the current in-memory shape. It does not append records, rewrite legacy JSONL, move authority, or define every mode payload. The typed ledger successor consumes this contract rather than inventing another envelope.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One strict stored wire envelope with required fields: `envelope_version`, `event_id`, `event_type`, `event_version`, `stream_id`, `stream_sequence`, `occurred_at`, `recorded_at`, `producer`, `authority_epoch`, `correlation_id`, `causation_id`, `idempotency_key`, and `payload`.
- Field semantics: positive integer versions and sequence/epoch values; stable namespaced event types; UTC timestamps; non-empty immutable identifiers; nullable-but-present correlation and causation fields; an object payload; and no producer-specific fields outside `payload`.
- A deterministic registry keyed by `event_type` with the current version, every supported historical version, the required payload-field contract for each version, and exactly one adjacent `N -> N+1` upcaster for every supported non-current version.
- Write-side validation entry points that accept only the current registered type/version and return a validated canonical envelope for the typed-ledger append boundary.
- Read-side entry points that parse stored bytes, validate the stored envelope and historical payload, resolve the registry, apply the complete upcaster chain, validate every hop and the current payload, and return stored/effective versions plus an auditable upcast trace.
- Typed fail-closed errors for unknown envelope versions, unknown event types, unsupported future event versions, duplicate registrations, missing upcaster links, invalid required fields, non-deterministic transforms, lossy identity changes, and ambiguous defaults.
- Fixtures that represent the shipped JSONL producer families without changing those writers; they prove the new envelope can carry their domain content under `payload` while the new path remains dark.

### Out of Scope
- The append-only storage engine, locking, fsync, sequence allocation, duplicate suppression, and append authorization; sibling `002-typed-append-only-ledger` owns the persistence boundary and consumes this envelope.
- Transition-authorization policy or gateway behavior. The phase-004 policy is normative; another phase-006 child implements the gateway that must co-land with the first writer.
- Replay fingerprint calculation, projections, reducers, compatibility adapters, dual reads, legacy projections, shadow parity, in-flight migration, authority cutover, or legacy-writer retirement.
- Rewriting historical JSONL rows or wrapping them in place. Legacy records stay byte-identical and authoritative until the later compatibility and cutover phases govern them.
- Defining all mode-specific payload schemas. Later shared-mode and per-mode phases register their types against this contract.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every new spine domain event uses one canonical outer envelope | Contract tests reject a missing required key, unknown outer key, wrong scalar type, non-UTC timestamp, empty identifier, non-object payload, or non-positive version/sequence/epoch before append |
| REQ-002 | Outer and per-type schema evolution are explicit | `envelope_version` versions the outer wire contract; `event_version` is a positive integer scoped independently to `event_type`; neither field is inferred from payload shape or producer |
| REQ-003 | Event discrimination is stable and namespaced | `event_type` follows the frozen deep-loop namespace grammar, duplicate or aliased type registrations fail startup, and persisted discriminators are never renamed in place |
| REQ-004 | Every registered type/version has a required-field contract | Registry inspection can enumerate required payload fields and validators for every supported version; missing, invalid, or unexpected fields fail with a typed validation error |
| REQ-005 | Writers emit only the current registered event version | The write entry point rejects historical, future, unknown, and caller-selected versions and returns only a canonical current-version envelope |
| REQ-006 | Readers upcast supported old events at one explicit boundary | The read entry point validates stored bytes, applies `type@N -> type@N+1` until current, validates each hop, and returns the current effective shape before reducers or mode code run |
| REQ-007 | Upcasters are deterministic, adjacent, and side-effect-free | Each registered upcaster is pure and total over its declared input, performs no I/O or event emission, preserves immutable envelope fields, and produces byte-stable canonical output for repeated inputs |
| REQ-008 | Stored evidence remains immutable and auditable | Read results expose the untouched stored bytes/envelope, stored and effective versions, registry/upcaster-chain identity, and ordered hop trace; no read path overwrites historical rows |
| REQ-009 | Compatibility failures are fail-closed | Unknown types, unsupported outer/future versions, registry gaps, cycles, duplicate edges, invalid intermediate output, lossy conversions, or ambiguous defaults return typed failures and no effective event |
| REQ-010 | The envelope composes with authorization and ledger siblings | The append-preflight result includes the exact canonical bytes/digest inputs, type/version, stream, sequence, authority epoch, and idempotency identity needed by the authorization gateway and typed ledger without either sibling reparsing producer payloads |
| REQ-011 | The implementation remains additive and dark | Existing runtime writers and JSONL formats are unchanged; new envelope fixtures and APIs are unused by authoritative legacy paths until later bridge and cutover phases authorize adoption |
| REQ-012 | Representative shipped producer shapes are generalizable | Fixtures for observability, council round state, iteration/audit events, and fan-out status fit under the canonical envelope payload with no producer-native key promoted into a second outer format |

### Canonical wire-field contract

| Field | Required contract |
|-------|-------------------|
| `envelope_version` | Positive integer identifying the outer wire contract; current writers emit the latest supported value. |
| `event_id` | Globally unique immutable identifier preserved across every upcast. |
| `event_type` | Stable namespaced discriminator; registry lookup is exact and case-sensitive. |
| `event_version` | Positive integer scoped to `event_type`; stored value remains audit-visible after upcast. |
| `stream_id` / `stream_sequence` | Non-empty stream identity plus positive monotonic position supplied by the ledger boundary. |
| `occurred_at` / `recorded_at` | UTC ISO-8601 instants for domain occurrence and durable recording; upcasters cannot rewrite them. |
| `producer` | Required object identifying producer name and version; capability detail belongs in the payload or authorization evidence. |
| `authority_epoch` | Positive monotonic epoch evaluated by the transition-authorization gateway. |
| `correlation_id` / `causation_id` | Required keys containing a non-empty ID or `null`; absence is invalid and invented defaults are forbidden. |
| `idempotency_key` | Non-empty caller-stable key used by the authorized append boundary; preserved across upcasts. |
| `payload` | Event-type/version-specific object validated by the registry; all producer-native domain content lives here. |

### Upcast boundary contract

The stored row is parsed once into a strict historical envelope. Registry resolution uses the exact stored `event_type` and `event_version`. A current-version event bypasses transforms but still receives current payload validation. An older supported event traverses one registered adjacent edge at a time; each hop may change only `payload` and the effective `event_version`. The returned read model carries both the immutable stored form and the effective current form. Reducers, projections, replay, and mode code receive only the validated effective form plus explicit provenance; they never call an upcaster directly or guess defaults.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One field table and executable validator define the only outer wire shape accepted by the future spine append boundary.
- **SC-002**: One deterministic registry enumerates every type/version contract and rejects duplicate, incomplete, cyclic, or non-adjacent registrations.
- **SC-003**: A supported `type@1` fixture reaches the current shape through a complete adjacent chain with stable output, preserved stored bytes, and a recorded hop trace.
- **SC-004**: Unknown type, future version, missing link, invalid intermediate payload, identity mutation, and ambiguous-default fixtures all fail closed before ledger append or consumer dispatch.
- **SC-005**: Representative observability, council, audit/iteration, and fan-out status fixtures use the same outer envelope without modifying the shipped authoritative writers.
- **SC-006**: The typed-ledger successor can consume one validated canonical-byte result and one validated current read result without defining envelope fields or compatibility rules itself.

**Given** a valid stored historical event with a complete registered upcaster chain, **When** current code reads it, **Then** the stored bytes remain unchanged and the effective event validates at the current version.

**Given** a stored event with an unknown type, unsupported future outer/event version, missing adjacent edge, or invalid hop output, **When** the read boundary evaluates it, **Then** it returns a typed failure and exposes no effective event to reducers, projections, or mode code.

**Given** a caller requests a historical or caller-selected event version, **When** the write boundary validates the request, **Then** the request is rejected before authorization or append and the current registered version remains the only writable version.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Two version fields become conflated** — consumers could treat outer `envelope_version` as the payload schema. Mitigation: separate validators, names, fixtures, and error codes; `event_version` is always resolved with `event_type`.
- **Permissive upcasting invents history** — optional defaults could hide missing evidence. Mitigation: required per-version contracts, adjacent pure transforms, explicit default provenance, and fail-closed ambiguous/lossy conversions.
- **Registry nondeterminism changes replay** — discovery order or duplicate registrations could alter the chosen chain. Mitigation: exact keys, deterministic ordering, duplicate/cycle/gap rejection, and a registry/upcaster-chain identity included in replay inputs.
- **Envelope becomes a second authority path** — a convenient writer could bypass the transition gate. Mitigation: this child exposes validation and serialization only; sibling ledger append requires a co-landed authorization decision and legacy remains authoritative.
- **Legacy format churn** — generalizing current writers could accidentally rewrite shipped state. Mitigation: representative fixtures are copies of shapes, not migrations; `.opencode/skills/system-deep-loop/runtime/` writers remain unchanged in this child.
- **Dependencies**: no sibling predecessor is declared. Normative inputs are the phase-004 transition/versioning policy, the program parent invariants, and `manifest/phase-tree.json`; runtime consumers begin with successor `002-typed-append-only-ledger`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Execution must freeze the exact namespace grammar and error-code vocabulary before the first registry entry is merged; either may be made stricter later, but persisted discriminators, version meaning, immutable field semantics, and the adjacent upcaster rule cannot be weakened without a governed amendment to the phase-004 transition policy.
<!-- /ANCHOR:questions -->
