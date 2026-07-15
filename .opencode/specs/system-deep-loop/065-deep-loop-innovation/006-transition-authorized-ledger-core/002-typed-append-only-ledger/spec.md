---
title: "Feature Specification: Typed Append-Only Ledger"
description: "Define the immutable typed ledger writer and reader over versioned envelope events, including monotonic ordering, idempotent append, hash-chain integrity, deterministic reduction, and additive-dark coexistence with the authoritative legacy JSONL path."
trigger_phrases:
  - "typed append-only ledger"
  - "deep-loop dark ledger"
  - "monotonic event append"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
    last_updated_at: "2026-07-15T13:43:04Z"
    last_updated_by: "codex"
    recent_action: "Defined the typed append-only ledger contract and dark coexistence boundary"
    next_safe_action: "Implement the locked writer, verified reader, reducers, and dark legacy adapter"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Typed Append-Only Ledger

> Phase adjacency under `006-transition-authorized-ledger-core` (navigation order, not a hard runtime dependency): predecessor `001-versioned-event-envelope`; successor `003-replay-fingerprints`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Second child of the phase-003 transition-authorized ledger-core parent |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-003 parent gate |
| **Authority posture** | Additive-dark through phase 010; legacy JSONL remains canonical until phase 011 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program parent requires one typed, append-only event ledger as the shared spine's durable record, but the shipped
runtime currently spreads persistence across several contracts. `runtime/lib/deep-loop/jsonl-repair.ts` exposes a raw
append helper and a repair path that can truncate or atomically rewrite a JSONL file; `runtime/lib/deep-loop/atomic-state.ts`
adds fsync and diff-gated appends but explicitly leaves per-record JSONL integrity unresolved; and
`runtime/lib/council/round-state-jsonl.cjs` has a stronger locked append with generated metadata while remaining a
council-specific schema. `runtime/scripts/fanout-pool.cjs` and `runtime/lib/deep-loop/observability-events.cjs` append
other uncoordinated ledgers, while `runtime/scripts/fanout-run.cjs` maintains replace-style wait checkpoints.

Those paths are shipped behavior and must not be destabilized. They do not yet provide a single contract for a typed
event, a conflict-detecting idempotency key, an authoritative sequence, per-event and whole-log integrity, or a reader
that refuses malformed, reordered, deleted, duplicated-with-different-content, or unknown-version records. Existing
reducers such as `runtime/scripts/reduce-state.cjs`, `runtime/scripts/reduce-alignment-state.cjs`, and
`runtime/scripts/verify-iteration.cjs` also parse mode-native JSONL independently and may tolerate malformed rows.

This phase defines the ledger writer/reader over the envelope planned in sibling `001-versioned-event-envelope`: one
immutable ordered event stream, exact-repeat idempotency, fail-closed conflict handling, a verifiable hash chain, typed
decode, and pure deterministic reduction. It is the source of truth for the new spine, but it runs **dark** beside the
legacy writers and is non-authoritative for runtime decisions until the staged cutover in phase 011. The architecture
and migration posture come from the program `spec.md`, `manifest/phase-tree.json`, and the phase-001
`001-spine-architecture-adr/spec.md`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed ledger writer that accepts only a validated envelope plus an authorization proof supplied by the phase-003 gateway composition.
- Monotonic per-ledger sequence assignment under an exclusive writer lock; timestamps are metadata, never order authority.
- Idempotent append keyed by stable `event_id`: an exact canonical repeat returns the original receipt, while changed content under the same ID fails closed.
- An immutable record frame carrying sequence, previous-record hash, canonical event hash, and append receipt data.
- Whole-log integrity from the genesis record through the current verified head; any deletion, insertion, reordering, mutation, fork, or torn tail is detectable.
- A typed reader that verifies framing, sequence continuity, the hash chain, envelope version/type, and authorization linkage before yielding an event.
- Pure typed reducers that consume the verified stream in sequence order and produce rebuildable projections without mutating ledger history.
- Additive-dark adapters at existing state/checkpoint emission boundaries; legacy writes remain authoritative and retain their current schemas and failure behavior.
- Tests for concurrency, crash boundaries, corruption, idempotency, ordering, typed decode, deterministic reduction, and dark-path isolation.

### Out of Scope
- Defining envelope fields or the type registry owned by `001-versioned-event-envelope`.
- Defining replay fingerprint composition owned by successor `003-replay-fingerprints`.
- Implementing the transition vocabulary or authorization decision engine owned by the phase-003 gateway sibling; this ledger only enforces a required valid proof at append.
- Upcasters, dual-read compatibility, legacy projections, shadow-parity policy, in-flight-state classification, or rollback drills owned by phase 005.
- Replacing, rewriting, truncating, or deleting any legacy JSONL/state/checkpoint file.
- Making ledger reads authoritative, cutting over a mode, or retiring a legacy writer; those actions belong to phases 011 and 012.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Append is immutable and monotonic within one ledger identity | Successful appends receive contiguous sequences; no public API can update, delete, truncate, repair, or overwrite a committed ledger record |
| REQ-002 | Append is idempotent and detects identity conflicts | Repeating the same `event_id` and canonical bytes returns the original sequence/hash receipt without a new record; the same ID with different bytes is rejected |
| REQ-003 | Ordering is explicit and race-safe | An exclusive writer lock plus expected-head comparison serializes concurrent writers; wall-clock timestamps never break ties or determine replay order |
| REQ-004 | Every record and the complete log are integrity-verifiable | Each record binds ledger ID, sequence, previous hash, canonical envelope bytes, authorization reference, and its own hash; full verification reaches one unambiguous head |
| REQ-005 | Reads fail closed before yielding untrusted data | Torn frames, sequence gaps, forks, hash mismatch, reordered/deleted rows, unknown versions/types, or invalid authorization linkage return typed errors and yield no unchecked event |
| REQ-006 | Typed reduction is deterministic and rebuildable | The same verified stream plus reducer version produces byte-identical projection state; derived checkpoints are disposable and never become ledger authority |
| REQ-007 | Dark coexistence preserves legacy authority | Existing legacy writers run unchanged as the operational source; a dark-ledger failure is observable and blocks later cutover evidence but does not alter the legacy result |
| REQ-008 | Typed events cannot bypass transition authorization | Missing, malformed, unknown, expired, or event-mismatched authorization proof is rejected before sequence allocation or durable append |
| REQ-009 | Crash behavior never edits committed history | A crash before fsync produces no committed receipt; a torn tail is detected and quarantined or followed by a new linked segment without truncating prior bytes |
| REQ-010 | Implementation remains traceable to shipped persistence surfaces | The writer/reader inventory covers `atomic-state.ts`, `jsonl-repair.ts`, `round-state-jsonl.cjs`, `fanout-pool.cjs`, `fanout-run.cjs`, reducers, and observability emission boundaries |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A locked append API proves contiguous order and conflict-detecting idempotency under concurrent writers.
- **SC-002**: Integrity verification detects mutation, deletion, insertion, reordering, forked heads, and crash-torn tails.
- **SC-003**: Typed read/reduce rejects unknown or invalid records and reproduces byte-identical projection output from the same ledger and reducer version.
- **SC-004**: Every durable append carries a valid authorization linkage and a receipt bound to the committed sequence and event hash.
- **SC-005**: Dark integration records alongside all inventoried legacy state/checkpoint writers without changing their canonical authority, schemas, outputs, or error semantics.
- **SC-006**: No ledger API or recovery path mutates committed bytes; any derived head/checkpoint is rebuildable from the immutable log.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase has `depends_on: []` as a planning leaf, but its implementation composes with the sibling envelope,
authorization, and replay-fingerprint contracts at the phase-003 parent gate. The highest risk is accidental authority
drift: treating the dark ledger as canonical before phase 011, or allowing a dark append failure to change legacy
behavior. A second risk is importing mutable legacy recovery semantics; `repairJsonlTail` and merge-by-rewrite are valid
legacy tools but cannot operate on committed ledger bytes. The ledger therefore fails closed on corruption and uses an
explicit linked-segment recovery path rather than silent truncation.

Concurrency and durability are also coupled. A process-local cache, timestamp, or bare `appendFileSync` cannot prove
global order; the writer needs an exclusive lock, expected-head check, canonical bytes, fsync, and a receipt issued
only after durability. Log-level integrity must remain independently recomputable, so mutable sidecars are treated as
caches rather than authority. These constraints are required by the parent program's additive-dark invariant and the
spine ADR's immutable, versioned, fail-closed contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may choose the exact module names and frame serialization after the
`001-versioned-event-envelope` contract is materialized, but it must preserve canonical bytes, explicit sequence,
hash-chain integrity, typed errors, exclusive append, immutable recovery, and dark non-authority. Storage choices that
require rewriting committed records, use timestamps as order, or let unknown records pass through are outside the
authorized solution space.
<!-- /ANCHOR:questions -->
