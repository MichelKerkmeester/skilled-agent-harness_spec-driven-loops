---
title: "Feature Specification: Transactional Projections & Gauges"
description: "Plan deterministic transactional projections that apply each verified ledger event atomically across dashboards, registries, claim tables, and stream-fold gauges, with idempotent resume and isolated replay rebuilds."
trigger_phrases:
  - "transactional projections and gauges"
  - "atomic ledger-derived views"
  - "rebuild projections from ledger"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the transactional projection and atomic gauge planning contract"
    next_safe_action: "Implement atomic projection apply and replay-safe generation rebuilds"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Transactional Projections & Gauges

> Phase adjacency under `010-novelty-claims-continuity-and-projections` (navigation order, not a hard runtime dependency): predecessor `004-next-focus-semantics`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/005-transactional-projections-and-gauges |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fifth and final child of phase 007, composing claim intelligence with ledger-derived views |
| **Depends on** | None (`[]`); sibling contracts compose at the phase-007 parent gate |
| **Authority posture** | Additive-dark; derived views remain non-authoritative until staged cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase-007 parent requires deterministic transactional projections and gauges as the final intelligence-layer
contract before convergence can consume novelty, claim, continuity, and next-focus signals. Its role and ordering are
fixed by `../../spec.md` and `../../manifest/phase-tree.json`: phase 007 produces coherent derived signals over the
ledger and durable fan-in substrate, while phase 008 owns the policies that interpret those signals.

The source contracts solve only part of that problem. The typed append-only ledger in
`../../006-transition-authorized-ledger-core/002-typed-append-only-ledger/spec.md` provides immutable verified order,
idempotent append, integrity linkage, and deterministic reduction. The stream-fold gauge contract in
`../../007-shared-evidence-and-control-services/005-stream-fold-gauges/spec.md` defines versioned pure folds and
replay-bound gauge checkpoints. Neither contract yet defines one commit boundary across related materializations. A
claim table could advance to sequence 42 while its novelty registry, dashboard row, and convergence gauge remain at
sequence 41; a crash or retry could then expose a half-applied event even though every individual reducer is pure.

The shipped `runtime/lib/deep-loop/observability-events.cjs` illustrates the current integration surface: it appends
producer-native payloads in a shared JSONL envelope, generates an event ID and timestamp when absent, and does not
coordinate downstream views or a replay cursor. That behavior remains a legacy observability source during the dark
period. Projection order and identity must come from verified ledger sequence, canonical event bytes, and registered
projection definitions rather than ambient UUIDs, wall time, process memory, or the last published snapshot.

This phase plans a projection bundle as one versioned transactional unit. For each accepted ledger event, the bundle
computes all affected dashboard rows, registries, claim tables, indexes, and phase-004 gauges against one prior
watermark, then commits the complete change set, apply receipt, and next watermark in one atomic storage transaction.
Failure exposes the old committed state; retry is an exact no-op or completes the same transition. Full rebuild writes
an isolated generation from ledger genesis or a verified cutoff and publishes it with one atomic generation-pointer
swap, making partial rebuilds invisible and the ledger the only recovery authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A projection-bundle registry with stable bundle/view IDs, semantic versions, accepted ledger event schemas, reducer and configuration digests, dependency order, canonical schemas, and unknown-input policy.
- One apply unit per verified ledger event, or a declared contiguous batch with equivalent all-or-nothing semantics; all affected related views and gauges commit with the receipt and watermark.
- A canonical projection store whose transaction boundary covers dashboard materializations, registries, claim tables, indexes, gauge accumulators, provenance, apply receipts, and the active generation pointer.
- Conflict-detecting idempotency keyed by ledger identity, projection generation, bundle version, sequence, and canonical event hash.
- Resumable processing from a committed watermark bound to ledger ID, sequence, record hash, projection version, reducer/configuration digest, and generation ID.
- Cross-projection consistency rules: readers observe one committed generation and ledger cutoff; dependencies apply in a declared acyclic order; a failure in any view aborts the unit.
- Deterministic rebuild from the verified ledger into an isolated generation, canonical hash comparison, atomic publication, and retention of the prior generation as a bounded rollback target.
- Transactional composition of the phase-004 stream-fold gauges without redefining their gauge IDs, arithmetic, event ownership, or pure reducer semantics.
- Canonical committed-snapshot publication for external dashboards or sinks that cannot share the local transaction; exports occur only after commit and never participate as projection authority.
- Crash, retry, duplicate, conflict, corruption, schema-version, restart, concurrent-worker, snapshot-isolation, replay-parity, and generation-swap fixtures.
- Additive-dark comparison with `runtime/lib/deep-loop/observability-events.cjs` and existing views without changing legacy schemas, decisions, or failure semantics.

### Out of Scope
- Defining the phase-003 envelope, ledger writer, sequence allocation, integrity chain, transition authorization, or replay fingerprint.
- Redefining semantic communities, contradiction/supersession events, claim continuity, or next-focus semantics owned by phase-007 siblings 001-004.
- Redefining progress, novelty, cost, or health gauge folds owned by phase 004; this phase owns their transactional application with related views.
- Distributed transactions across unrelated databases, dashboard services, caches, or network sinks; the canonical projection store and committed snapshot are the authority boundary.
- Upcasters, dual-read compatibility, shadow-parity orchestration, rollback-window policy, authority cutover, or legacy-writer retirement owned by phases 005, 011, and 012.
- Choosing convergence thresholds, health verdicts, degeneration policy, or stop decisions owned by phase 008.
- Treating a dashboard, export, mutable checkpoint, observability JSONL row, or projection snapshot as a substitute for ledger replay.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Projection bundles are registered and versioned | The registry records bundle/view IDs, input event schemas, dependency order, initial state, reducers, finalizers, schema versions, digests, and unknown-input policy |
| REQ-002 | One ledger event applies atomically across related projections | The event's dashboard, registry, claim-table, index, gauge, receipt, and watermark writes become visible in one commit or none become visible |
| REQ-003 | Related projections expose one consistent cutoff | A snapshot query returns one generation ID and inclusive ledger sequence/hash shared by every view in the bundle; mixed-cutoff reads are rejected |
| REQ-004 | Apply is conflict-detecting and idempotent | Repeating the same generation/bundle/sequence/event-hash tuple is a no-op with the original receipt; changed bytes or version under the same identity abort before mutation |
| REQ-005 | Processing resumes only from a verified committed watermark | Restart validates ledger ID, sequence/hash, generation, bundle version, and reducer/configuration digest, then continues at the next sequence or starts a rebuild |
| REQ-006 | A failed view aborts the entire apply unit | Reducer, validation, constraint, serialization, fencing, or storage failure rolls back every view write, receipt, and watermark for that event |
| REQ-007 | Projection concurrency is serialized and fenced | One active writer owns a generation/bundle lease or fence; expected-watermark comparison rejects stale or concurrent commits without partial effects |
| REQ-008 | Rebuild is deterministic and isolated | Replaying the same verified ledger prefix into a fresh generation produces byte-identical canonical view and gauge hashes across repeated runs and supported platforms |
| REQ-009 | Rebuild publication is atomic | Readers see the complete old generation or the complete verified new generation; one committed pointer swap changes visibility after replay and validation succeed |
| REQ-010 | Gauges retain the phase-004 fold contract | Gauge definitions, exact arithmetic, event filters, and canonical output remain versioned pure folds; this phase changes only their transaction and publication boundary |
| REQ-011 | Projection state carries replay provenance | Every committed generation and snapshot names ledger ID, inclusive sequence/hash, bundle/view versions, digests, canonical state hashes, apply receipt, and rebuild provenance |
| REQ-012 | Unsupported or corrupt inputs fail closed | Unknown schemas, sequence gaps, hash mismatch, invalid canonical values, stale fences, dependency cycles, and constraint violations produce typed errors and no trusted advance |
| REQ-013 | External publication cannot expose partial canonical state | Dashboards and sinks read a committed snapshot or generation manifest; delivery retries cannot advance the canonical projection watermark or invent projection state |
| REQ-014 | Additive-dark integration preserves legacy authority | New projections and gauges can be compared with shipped observability and view outputs, but mismatches are evidence and cannot change legacy runtime decisions in this phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Failure injection before each commit boundary proves one event is visible in every affected projection and gauge or in none of them.
- **SC-002**: Duplicate delivery, crash-after-commit, restart, and stale-worker fixtures produce one apply receipt and one committed watermark advance without drift.
- **SC-003**: Snapshot readers never observe mixed generation IDs, bundle versions, ledger cutoffs, or partially rebuilt view sets.
- **SC-004**: Genesis replay and verified-watermark resume produce byte-identical canonical hashes for every dashboard, registry, claim table, index, and gauge at the same ledger head.
- **SC-005**: A fresh rebuild stays invisible until validation succeeds; the generation swap is atomic and the retained prior generation can be restored without replay ambiguity.
- **SC-006**: Dark comparison covers the shipped observability-event surface and phase-004 gauge outputs without changing legacy authority, schemas, or control flow.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The child has `depends_on: []` as an independent planning contract, but implementation composes the verified typed
reader and immutable order from phase 003, the versioned gauge reducers from phase 004, and the domain events planned
by phase-007 siblings. The main risk is false atomicity: committing each table independently, or updating a cursor
before every view is durable, can label a half-applied event complete. The receipt, all view mutations, gauges, and
watermark therefore share one storage transaction and one expected prior watermark.

Heterogeneous dashboards and remote sinks create a second trap. A network publish cannot participate reliably in the
canonical database transaction. The design instead commits a canonical snapshot plus publication manifest, then
delivers or retries exports after commit. External lag is observable, but it cannot make the canonical projection
partially applied or move its ledger cutoff.

Rebuild and concurrency also interact. Replaying in place would expose intermediate states, while two workers could
advance the same generation from different heads. Rebuilds use isolated generation IDs; live apply uses fencing and
expected-watermark comparison; publication changes one pointer only after canonical hash and prefix verification.
The prior generation is retained for bounded rollback, but neither generation can become a substitute event source.

Finally, `runtime/lib/deep-loop/observability-events.cjs` uses `randomUUID()` and current time when callers omit those
fields. Those values are acceptable legacy envelope metadata but cannot determine projection ordering, replay cutoffs,
or reducer output. Ledger sequence, canonical event hashes, registered versions, and exact phase-004 numeric rules are
the only trusted replay inputs.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation may select the canonical transactional store, table layout, transaction
batch size, lease mechanism, rebuild retention count, and publication transport after the phase-003 ledger and
phase-007 event schemas are materialized. Any choice must provide one atomic boundary for related projections,
conflict-detecting idempotency, fenced resume, isolated deterministic rebuild, atomic generation publication, and
ledger-only recovery. A design that relies on distributed best-effort writes, wall-clock order, or mutable snapshots
for recovery is outside the authorized solution space.
<!-- /ANCHOR:questions -->
