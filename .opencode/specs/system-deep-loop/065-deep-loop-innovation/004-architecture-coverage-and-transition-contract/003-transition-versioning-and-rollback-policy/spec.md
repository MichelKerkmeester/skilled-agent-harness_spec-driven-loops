---
title: "Feature Specification: Transition, Versioning & Rollback Policy"
description: "Freeze the event-envelope versioning and upcaster contract, deny-by-default transition authorization, per-mode authority cutover, and rollback-window policy before any typed event writer exists."
trigger_phrases:
  - "transition versioning rollback policy"
  - "deep-loop event envelope upcaster rules"
  - "per-mode authority cutover contract"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the transition, versioning, cutover, and rollback policy contract"
    next_safe_action: "Ratify this contract before phase 003 builds the first typed event writer"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Transition, Versioning & Rollback Policy

> Phase adjacency under the architecture-contract parent (navigation, not dependency): predecessor `002-recommendation-ledger-bijective-map`; successor program phase `006-transition-authorized-ledger-core`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Child 003 of the architecture, coverage, and transition planning gate |
| **Dependencies** | None; `depends_on: []` in the approved phase definition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The parent program's Sequencing Invariants require the transition-authority and event-compatibility contract to be frozen before the first typed writer lands, require the new substrate to remain additive, dark, and non-authoritative through compatibility and shadow parity, reserve authority changes for per-mode cutover, and prohibit legacy-writer retirement until rollback and mixed-version evidence exist (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/spec.md`). The phase-tree manifest states the migration model as additive-dark substrate, compatibility adapters and shadow parity, staged per-mode cutover behind a rollback window, then gated legacy retirement. It assigns the first writer to phase 003, compatibility and upcasters to phase 005, and authority cutover to phase 011 (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

Without one policy fixed before those phases begin, each writer could invent its own version field, compatibility behavior, authorization evidence, cutover switch, or rollback clock. That would make mixed-version replay non-deterministic, permit unknown transitions to slip through permissive fallbacks, and create split-brain risk during mode migration.

This phase writes the governing contract only; it implements no runtime code. Phases 003-012 inherit the event-envelope, upcaster, authorization, authority, and rollback rules below. A later phase may add a stricter constraint, but it may not weaken or redefine this contract without an explicit amendment that identifies every affected writer, reader, adapter, fixture, cutover certificate, and rollback anchor.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A mandatory event envelope with an explicit `event_type` discriminator and positive integer `event_version` scoped to that type, plus immutable identity, stream, ordering, time, producer, authority-epoch, correlation, causation, idempotency, and payload fields.
- Compatibility semantics: current writers emit only the latest registered version; current readers upcast every supported older version; old readers never guess at newer versions; mixed-version replay either resolves through a complete registered chain or fails closed.
- Upcaster rules: pure, deterministic, side-effect-free, one-version-at-a-time transforms that preserve source bytes and immutable envelope identity, emit no events, perform no I/O, and reject unknown types, unsupported future versions, missing links, lossy conversions, or ambiguous defaults.
- A deny-by-default transition-authorization gateway, the complete authorization-decision record, and a non-domain rejection receipt for every denied request.
- A per-mode authority state machine with exactly one authoritative writer, shadow-parity prerequisites, compare-and-swap authority epochs, and cutover certificates consumed by phase 011.
- A rollback window that remains open for at least 14 calendar days and five successful authoritative executions, whichever completes later, with explicit flip evidence, rollback triggers, execution steps, and closure evidence.
- A downstream conformance matrix binding phases 003-012 to the parts of this contract they implement, exercise, consume, or prove.

### Out of Scope
- Implementing the ledger, gateway, upcasters, adapters, parity harness, cutover switch, or retirement logic; those belong to program phases 003-012.
- Choosing per-event payload schemas beyond the mandatory envelope and version-registration rules.
- Moving authority in this phase. Phase 005 proves compatibility and shadow parity without cutover; phase 011 alone changes authority.
- Removing legacy writers or archival readers. Phase 012 owns retirement after the rollback window and zero-use evidence.
- Shortening the minimum rollback window for a mode. A mode may extend the window when traffic, anomalies, or evidence coverage require it.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every persisted domain event uses the canonical envelope and registered type/version pair | Envelope validation rejects a missing discriminator, non-positive version, unknown type, or unregistered version before append |
| REQ-002 | Compatibility is asymmetric and explicit | New code reads supported old events through upcasters; old code is not required to interpret new events and must reject or route them to a compatible reader |
| REQ-003 | Upcasters form a deterministic adjacent-version chain | Replay from every supported historical version reaches the current in-memory shape byte-for-byte deterministically, while a gap or lossy transform fails closed |
| REQ-004 | Transition authorization defaults to deny | No domain event, stream sequence, projection, receipt, or side effect changes unless the gateway returns an allow decision for the exact request digest and authority epoch |
| REQ-005 | Every authorization decision is complete and auditable | The decision records decision ID, allow/deny, reason code, policy version, mode, stream, prior state/version, requested type/version, actor/capability, authority epoch, request digest, evidence digest, and timestamp |
| REQ-006 | Denied transitions are rejected without becoming domain history | A denial advances no domain sequence and produces an immutable rejection receipt containing bounded metadata and the request digest; sensitive payload content is not copied into the receipt |
| REQ-007 | Authority moves one mode at a time with one writer | The per-mode state machine and compare-and-swap epoch prevent simultaneous legacy and spine authority; a stale writer is denied after every flip or rollback |
| REQ-008 | Shadow parity is a hard cutover precondition | No mode enters `new_authoritative_reversible` until its certificate binds the exact candidate SHA, supported version range, classified in-flight state, mixed-version replay, live shadow window, zero unresolved divergences, mode gate, and successful rollback rehearsal |
| REQ-009 | Every cutover remains reversibly governed | The legacy rollback path, adapters, rollback anchor, and retained state remain usable for at least 14 days and five successful authoritative runs, whichever completes later |
| REQ-010 | Rollback is non-destructive and certificate-backed | Rollback freezes admission, fences the spine writer, reconciles in-flight work under the declared policy, restores legacy authority at a new epoch, preserves all events, and emits a rollback certificate |
| REQ-011 | Contract ownership is traceable through retirement | A conformance matrix shows how phases 003-012 consume this policy and blocks phase 012 until every mode exits its rollback window with zero-use telemetry and archival-read evidence |
<!-- /ANCHOR:requirements -->

### Frozen contract vocabulary

| Domain | Required vocabulary and rule |
|--------|------------------------------|
| Envelope | `event_type` is a stable namespaced discriminator; `event_version` is a positive integer versioned independently per type; envelope field meaning changes require an envelope-contract revision, not silent reuse. |
| Compatibility | Backward read compatibility is provided by upcasting. Forward safety is explicit refusal or routing to a compatible reader; unknown future versions are never guessed, dropped, or partially decoded. |
| Upcasting | Each transform is `type@N -> type@N+1`, pure and total over its declared input. Chains preserve original bytes for audit and expose both stored and effective versions in replay evidence. |
| Authorization | The gateway evaluates the exact request against current state, policy version, actor capability, invariant evidence, and authority epoch. Missing input, stale state, unknown rule, or gateway failure is a denial. |
| Denial record | A rejection receipt is audit evidence, not a domain event. It cannot advance the aggregate, trigger projections, consume an idempotency success, or authorize effects. |
| Authority | Per mode: `legacy_authoritative` -> `shadowing` -> `cutover_ready` -> `new_authoritative_reversible` -> `new_authoritative_final`; rollback moves the reversible state through `rollback_pending` to `legacy_authoritative` at a new epoch. |
| Rollback window | Opens when the cutover compare-and-swap succeeds; closes only after both 14 calendar days and five successful authoritative executions, with no unresolved parity, replay, authorization, receipt, budget, or state-reconciliation failure. |

### Downstream conformance ownership

| Program phase | Contract obligation inherited from this phase |
|---------------|----------------------------------------------|
| 003 | Implement the canonical envelope, version registry, append boundary, replay fingerprint inputs, authorization gateway, decision log, and rejection receipt together; remain dark and legacy-authoritative. |
| 004 | Ensure effect receipts, budgets, locks, and continuity identities consume authorized event identity and authority epochs without bypassing the gateway. |
| 005 | Implement registered upcasters, dual-read/single-write adapters, mixed-version replay, state classification, shadow parity, and rollback rehearsal; move no authority. |
| 006-008 | Emit only registered current event versions and prove deterministic replay through orchestration, projections, and convergence consumers. |
| 009-010 | Freeze shared and per-mode schemas, fixtures, mode gates, adapters, rollback switches, and write ownership against this policy. |
| 011 | Execute the per-mode cutover state machine, issue cutover and rollback certificates, and enforce the full rollback window. |
| 012 | Retire legacy live writers only after window closure, zero-use telemetry, rollback evidence, and retained archival-reader verification. |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One canonical envelope and compatibility matrix is frozen before phase 003 authors a writer.
- **SC-002**: One deny-by-default decision contract covers allow, deny, stale epoch, unknown type/version, and gateway-failure paths.
- **SC-003**: One per-mode authority state machine names every legal transition, precondition, certificate, and rollback edge.
- **SC-004**: One rollback policy fixes the minimum reversible duration, retained assets, trigger evidence, runbook, and closure gate.
- **SC-005**: Phases 003-012 have explicit conformance obligations and no downstream phase owns a conflicting policy definition.

**Given** a stored supported `event_type@1`, **When** current code replays it through a complete registered upcaster chain, **Then** the effective current event is deterministic and the stored bytes remain available for audit.

**Given** an event with an unknown type, future version, missing upcaster link, stale authority epoch, or incomplete authorization input, **When** a writer or reader evaluates it, **Then** the operation fails closed without a domain append, sequence advance, projection, or side effect.

**Given** a mode whose shadow output has any unresolved divergence or incomplete in-flight-state classification, **When** phase 011 requests cutover, **Then** the compare-and-swap is denied and legacy remains authoritative.

**Given** a mode in `new_authoritative_reversible`, **When** a rollback trigger fires inside the open window, **Then** admissions freeze, the spine writer is fenced, legacy authority resumes at a new epoch, no event is deleted, and a rollback certificate records the reconciliation.

**Given** 14 days have elapsed but fewer than five successful authoritative executions exist, **When** window closure is evaluated, **Then** the rollback window remains open.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Policy drift before implementation** — phase 003 could encode a convenient local rule. Mitigation: this packet is a P0 handoff gate and every downstream phase must trace conformance to its requirement IDs.
- **Compatibility overclaim** — “forward compatible” can be misread as old code understanding new payloads. Mitigation: forward safety is refusal or compatible-reader routing; only backward reads are guaranteed through upcasters.
- **Authorization/audit recursion** — recording a denial as a domain event could itself mutate the protected stream. Mitigation: rejection receipts live in a non-domain decision log and never advance domain state.
- **Split-brain authority** — legacy and spine writers could both accept. Mitigation: one per-mode authority record, monotonic epochs, compare-and-swap flips, and stale-epoch rejection at the gateway.
- **Rollback in name only** — a timer could expire without enough real executions. Mitigation: the window closes on the later of 14 days and five successful authoritative runs and extends for unresolved evidence.
- **Dependencies**: no predecessor dependency is declared for this planning child. Its normative inputs are the parent program Sequencing Invariants and the phase-tree `migration_model` plus phases 003, 005, and 011 outcomes. Its consumers are phases 003-012.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Ratification must confirm the 14-day/five-run minimum and the exact rejection-receipt storage boundary before the phase is marked complete; changing either value after a writer exists requires a governed amendment and downstream impact review.
<!-- /ANCHOR:questions -->

