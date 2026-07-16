---
title: "Feature Specification: Upcasters & Dual-Read/Single-Write Adapters"
description: "Plan deterministic event and state upcaster chains plus dual-read/single-authoritative-write adapters that reconcile legacy state with the dark ledger while legacy remains canonical and every compatibility action stays reversible."
trigger_phrases:
  - "deep-loop upcasters and dual-read adapters"
  - "legacy and dark ledger reconciliation"
  - "single-authoritative-write shadow adapter"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
    last_updated_at: "2026-07-15T14:17:04Z"
    last_updated_by: "codex"
    recent_action: "Authored the upcaster and shadow adapter planning contract"
    next_safe_action: "Implement registries and adapters against frozen legacy and ledger fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Upcasters & Dual-Read/Single-Write Adapters

> Phase adjacency under the compatibility-shadow-and-rollback-bridge parent (navigation order, not a hard runtime dependency): predecessor none (first sibling); successor `002-legacy-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of the phase-008 compatibility, shadow, and rollback bridge |
| **Dependencies** | None; `depends_on: []` in the approved child definition |
| **Authority posture** | Legacy remains canonical; the dark ledger is parallel, observable, and non-authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 006 plans the canonical versioned envelope and typed append-only ledger, but the shipped runtime still reads and writes producer-native JSON snapshots and JSONL rows. The current atomic persistence layer accepts `unknown`, serializes caller-owned shapes, performs replace-style atomic writes, and offers diff-gated JSONL appends without imposing a domain schema or per-record compatibility contract (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`). New code therefore cannot safely consume historical events or state merely by switching readers: older records may have a supported schema, a missing version edge, an ambiguous unversioned shape, or a future version that current code must refuse.

The phase-004 transition policy fixes the compatibility rules: writers emit only the current registered event version; readers transform supported historical versions through pure adjacent `type@N -> type@N+1` upcasters; stored bytes and immutable identity remain available; and unknown types, future versions, missing links, lossy transforms, or ambiguous defaults fail closed (`.opencode/specs/system-deep-loop/034-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`). Phase 006 then defines the canonical envelope read boundary and dark ledger, including stored/effective versions and a verified typed stream (`.opencode/specs/system-deep-loop/034-deep-loop-innovation/006-transition-authorized-ledger-core/001-versioned-event-envelope/spec.md`; `.opencode/specs/system-deep-loop/034-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md`).

This phase plans the compatibility seam that makes those contracts usable during shadowing. It registers and chains event and state-record upcasters, reads comparable legacy and dark representations, normalizes both to a current read model, and reconciles them without moving authority. “Single-write” means one authoritative mutation: the command reaches the legacy writer exactly once, and the accepted transition may also produce one non-authoritative dark-ledger mirror. The adapter never treats the dark append as operational success, never falls back to dark state when legacy fails, and never writes reconciled data back to either store. That distinction preserves the parent program's additive-dark migration model and its rule that phase 008 performs no authority cutover (`.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md`; `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic upcaster registry keyed by record family and stable type discriminator, with one declared current version, every supported historical version, and exactly one adjacent transform for each supported non-current version.
- Pure event upcasters that preserve immutable stored envelope fields and source bytes while producing the current effective `event_version` and payload expected by phase-006 readers.
- Pure state-record upcasters for explicitly versioned legacy snapshot/JSONL families, producing a current normalized read model with source kind, source version, effective version, and ordered hop trace.
- Startup validation that rejects duplicate registrations, non-adjacent edges, gaps, cycles, multiple current versions, unsupported outer-envelope versions, and registry ordering that is not deterministic.
- A dual-read adapter that obtains legacy and dark observations for the same logical run/stream and comparison point, validates and upcasts each independently, and emits a typed reconciliation result.
- A reconciliation matrix for equivalent, divergent, lagging, missing, corrupt, and failed reads; the legacy value or legacy error contract remains operational in every shadow-period case.
- A single-authoritative-write boundary: invoke the legacy writer once, mirror the accepted transition to the dark ledger once as non-authoritative evidence, and expose no writeback, dark fallback, or second canonical mutation path.
- Reversibility controls: compatibility feature gates, immutable source records, no eager migration, no read-repair, bounded divergence evidence, and a direct legacy-only path that can be restored without data conversion.
- Fixtures covering supported multi-hop versions, current versions, unversioned/ambiguous legacy shapes, future versions, missing edges, non-comparable snapshots, dark lag, dark corruption, and mirror-append failure.

### Out of Scope
- Defining the canonical envelope, ledger frame, authorization proof, replay-fingerprint algorithm, or ledger durability rules owned by phase 006.
- Implementing legacy projections owned by successor `002-legacy-projections` or the shadow-parity harness, state classification, and rollback drills owned by later phase-008 siblings.
- Rewriting historical JSONL rows, snapshots, checkpoints, or committed ledger bytes into a new version.
- Treating an unversioned legacy shape as a supported version without an explicit, fixture-backed discriminator and lossless mapping.
- Returning a dark value when the legacy read fails, allowing a dark append to change legacy success/failure semantics, or promoting dark state to canonical authority.
- Moving authority, issuing a cutover certificate, retiring a legacy writer, or weakening the phase-004 rollback-window policy; those actions remain in phases 011 and 012.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every supported event or state family has one deterministic version graph | Registry inspection shows one current version and one adjacent `N -> N+1` edge for each supported historical version; gaps, cycles, duplicates, and forks fail startup |
| REQ-002 | Upcasters are pure, deterministic, adjacent, and lossless over declared inputs | Repeated runs over canonical fixtures produce byte-identical current models and hop traces with no I/O, clock, randomness, mutation, event emission, or identity loss |
| REQ-003 | Historical evidence remains immutable and auditable | Results retain source bytes or their immutable reference, stored and effective versions, registry identity, and ordered hops; no compatibility read rewrites source storage |
| REQ-004 | Unsupported or ambiguous compatibility cases fail closed | Unknown families, unregistered versions, future versions, missing links, invalid hop output, lossy conversion, and ambiguous unversioned shapes yield typed failures and no effective model |
| REQ-005 | Dual reads compare one logical observation boundary | Each comparison binds mode, run/stream identity, authority epoch, legacy record/checkpoint identity, verified dark head/sequence, and correlation key; incomparable observations are classified, not compared as parity |
| REQ-006 | Reconciliation is deterministic and legacy-authoritative | Equivalent models return the legacy operational value plus parity evidence; divergence, dark lag/miss/failure, or dark-only success never replaces the legacy value or legacy error |
| REQ-007 | Shadow writes preserve one authoritative mutation | A command invokes the legacy writer exactly once; a successful accepted transition may append one idempotent dark mirror, but the mirror cannot decide the command result or mutate legacy state |
| REQ-008 | Dark failures are observable without becoming authority | Mirror append, verification, or read failures emit bounded typed evidence and block parity/cutover claims while preserving the authoritative legacy result and its error semantics |
| REQ-009 | The adapter performs no read-repair or reverse synchronization | No reconciliation outcome writes an upcast result, dark value, synthesized default, or divergence resolution back to legacy or committed ledger storage |
| REQ-010 | Adapter disablement is reversible and behavior-preserving | Disabling dual read and dark mirroring routes directly to the unchanged legacy reader/writer contracts; retained dark records remain audit-only and require no rollback migration |
| REQ-011 | The compatibility seam composes with phase-006 contracts | Event reads enter through the canonical envelope registry; dark reads consume verified ledger events; dark writes use current-version envelopes and authorized append; adapters do not bypass validation or authorization |
| REQ-012 | Current atomic persistence semantics remain explicit | Integration inventories `writeStateAtomic`, `writeStateIfChangedAtomic`, `appendJsonlIfChangedAtomic`, and deferred writers; adapters add codecs at call boundaries rather than treating generic serialization as a schema |

### Upcaster registration and chaining contract

| Contract element | Required behavior |
|------------------|-------------------|
| Registry key | Exact stable record family plus event/state type; case-sensitive and namespaced where the phase-006 envelope requires it. |
| Version edge | One adjacent transform from `N` to `N+1`; no skips, reverse edges, or runtime-selected alternatives. |
| Current write | Only the registered current event version may enter the dark append boundary; historical caller-selected writes are rejected. |
| Historical read | Validate stored form, resolve the exact chain, validate every hop, then validate the current effective form before exposing it. |
| Immutable evidence | Preserve source bytes/reference, identity, stream/order, timestamps, authority epoch, correlation, causation, and idempotency fields. |
| Failure | Return a typed compatibility error with family/type, stored version, failed edge, and bounded reason; expose no partial effective model. |

### Dual-read reconciliation rule

The adapter samples both sources under one comparison token. The token identifies the same mode/run/stream, authority epoch, legacy checkpoint or record position, and verified dark-ledger head. Each source is decoded and upcast independently before semantic comparison. A comparable pair uses the phase-006 replay/canonicalization contract rather than raw JSON key order; a pair that represents different causal points is `not_comparable` or `dark_lagging`, not a semantic divergence.

| Legacy observation | Dark observation | Operational result during shadowing | Evidence outcome |
|--------------------|------------------|------------------------------------|------------------|
| Valid | Valid and equivalent | Return the legacy value | `parity` with both fingerprints and comparison token |
| Valid | Valid but divergent | Return the legacy value | `divergence`; block parity/cutover evidence |
| Valid | Missing, lagging, invalid, or failed | Return the legacy value | Typed dark gap/failure; block parity/cutover evidence |
| Failed | Valid | Preserve the legacy failure; never fail over | `legacy_failure_dark_success` for diagnosis only |
| Failed | Failed or missing | Preserve the legacy failure | Combined bounded evidence with legacy error primary |
| Valid or failed | Causal point not comparable | Preserve the legacy outcome | `not_comparable`; exclude from parity numerator and denominator |

### Single-authoritative-write invariant

The legacy mutation remains the only operation allowed to determine accepted state, returned value, retry semantics, or domain failure. After a legacy transition is accepted, the dark path receives the current-version canonical envelope under the phase-006 authorization and idempotency contracts. The adapter may record a mirror failure, but it cannot retry the legacy mutation, infer success from the dark append, project dark data back into legacy, or expose a mode switch that changes authority. This is one authoritative write with a parallel shadow record, not dual authority.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Registry fixtures prove current, one-hop, and multi-hop reads for every declared event/state family, with stable output and complete hop traces.
- **SC-002**: Gap, cycle, duplicate edge, future version, ambiguous unversioned shape, invalid hop, and identity mutation fixtures all fail closed before a model reaches a consumer.
- **SC-003**: The reconciliation matrix returns legacy outcomes for every shadow-period case and classifies parity, divergence, lag, failure, and non-comparability deterministically.
- **SC-004**: Instrumented write fixtures prove exactly one legacy mutation and at most one idempotent dark mirror per accepted command, with no dark-to-legacy writeback.
- **SC-005**: Disabling the adapter restores the direct legacy path without rewriting or deleting legacy or dark records.
- **SC-006**: A dark read or append failure blocks parity/cutover evidence but cannot change the authoritative legacy value, failure, retry contract, or stored shape.

**Given** a supported `type@1` record whose current version is `type@3`, **When** the adapter reads it, **Then** the registry applies exactly `1 -> 2 -> 3`, validates each hop, preserves source evidence, and exposes only the validated current model.

**Given** valid legacy and dark observations at the same causal point with different semantic fingerprints, **When** reconciliation runs, **Then** the runtime returns the legacy value, emits a bounded divergence record, and marks the comparison ineligible for cutover evidence.

**Given** a legacy write succeeds and the dark mirror append fails, **When** the adapter completes, **Then** legacy success remains the operational result, the failure is observable, and no retry re-executes the legacy mutation.

**Given** the compatibility adapter is disabled, **When** the same legacy read and write fixture executes, **Then** its result and error semantics match the pre-adapter baseline and no dark read or append occurs.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Split-brain semantics hidden by “single-write”** — two durable sinks could be mistaken for two authorities. Mitigation: name legacy as the only operational writer, keep dark append results out of command decisions, and test one legacy invocation plus zero-or-one idempotent mirror.
- **False divergence from skewed observations** — legacy and dark reads may represent different causal points. Mitigation: compare under a token binding both positions and classify lag/non-comparability before semantic comparison.
- **Upcasters invent history** — defaults or skipped versions could fabricate evidence. Mitigation: adjacent fixture-backed transforms, per-hop validation, immutable source evidence, and fail-closed ambiguous/lossy mappings.
- **Generic persistence mistaken for a schema** — `atomic-state.ts` accepts arbitrary serializable data and its integrity check is warning-only. Mitigation: explicit codecs and version discriminators at adapter call boundaries; no shape inference from serialization utilities.
- **Dark fallback leaks authority** — a dark success after a legacy failure could tempt availability-oriented fallback. Mitigation: preserve the legacy error as primary in every matrix row and treat dark-only success as diagnostic evidence.
- **Dependencies**: the child declares `depends_on: []`, but implementation consumes the frozen phase-004 transition/versioning policy and the phase-006 envelope, verified ledger, authorization, and replay contracts. Successor `002-legacy-projections` and later phase-008 parity/rollback children consume this adapter contract. The program manifest remains the ordering and outcome source.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the exact inventory of legacy state families, their version discriminators, comparison-token fields, and divergence reason codes against the pinned phase-003 state census. A legacy family without a lossless fixture-backed discriminator remains unsupported and must be classified by the later in-flight-state phase rather than admitted through a guessed upcaster.
<!-- /ANCHOR:questions -->
