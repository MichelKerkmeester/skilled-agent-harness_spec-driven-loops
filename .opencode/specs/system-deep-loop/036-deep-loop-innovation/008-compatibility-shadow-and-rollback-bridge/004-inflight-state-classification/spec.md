---
title: "Feature Specification: In-Flight State Classification"
description: "Implement a total, fail-closed classification of every frozen phase-003 in-flight state row into upcast, pin, fork, migrate, or block before any phase-014 authority cutover."
trigger_phrases:
  - "in-flight state classification"
  - "deep-loop cutover state disposition"
  - "upcast pin fork migrate block"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
    last_updated_at: "2026-07-21T03:35:32Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the total five-way in-flight state classifier"
    next_safe_action: "Consume the immutable classification and freshness gate during governed phase-014 cutover work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-classification/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-classification.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: In-Flight State Classification

> Phase adjacency under `008-compatibility-shadow-and-rollback-bridge` (navigation order, not a hard runtime dependency): predecessor `003-shadow-parity-harness`; successor `005-rollback-drills`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | In-flight-state child of the phase-008 compatibility, shadow, and rollback bridge |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop runtime persists state while work is active. At cutover, a packet may be between iterations, holding a
writer lock, waiting on fan-out results, paused at a checkpoint, mutating a council graph, or carrying pending effects.
Moving authority without understanding that live shape can duplicate work, lose ordering, orphan effects, split writer
authority, or make rollback reconstruct a state that never existed.

The [phase-003 census specification](../../003-baseline-taxonomy-and-state-census/spec.md) requires a row-addressable
inventory of packet state logs, iteration deltas, inboxes, council and improvement state, fan-out and failure records,
observability events, JSON/JSONL projections, locks and pause markers, packet-local directories, benchmark outputs, and
SQLite backends. That census is now frozen at 46 concrete rows and is consumed by exact bytes, SHA-256 digest, BASE
identity, and row closure. The implemented decision contract closes every row against one explicit policy entry.

The [phase-004 transition and rollback policy](../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md)
requires deterministic adjacent-version upcasters, exactly one authoritative writer, non-destructive rollback, and a
cutover certificate that binds classified in-flight state. The [program phase tree](../../manifest/phase-tree.json)
places this classification in the dark compatibility bridge and reserves state migration and authority movement for
phase 014. This phase therefore implements one exhaustive five-way disposition: `UPCAST`, `PIN`, `FORK`, `MIGRATE`, or
`BLOCK`. Missing, stale, ambiguous, corrupt, or unsafe evidence defaults to `BLOCK`; legacy remains authoritative.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A deterministic precedence order and evidence contract for the five disposition classes.
- A required baseline class for every persisted state family named by the phase-003 census specification.
- A row-level classification manifest that assigns exactly one class to every frozen census row and records the state
  digest, authority epoch, lifecycle position, active leases/effects, reason code, prerequisites, rollback anchor, and
  verifier evidence.
- Class-specific handling contracts for phase 014: logical upcast, legacy pin-to-completion, isolated dark fork,
  checkpointed ledger migration, or cutover refusal.
- A fail-closed freshness rule: a changed state digest, authority epoch, schema, lease, pending-effect set, or rollback
  anchor invalidates the prior classification before cutover.
- Handoffs to sibling shadow parity and rollback drills without granting either sibling authority to move live state.

### Out of Scope
- Executing the phase-003 census, fabricating census row IDs, or claiming that planned state families are observed
  runtime evidence.
- Implementing upcasters, adapters, state importers, ledger schemas, locks, fencing, or migration tooling.
- Forking live effects, mutating authoritative legacy state, changing a mode's writer, or moving runtime authority.
- Running rollback drills or issuing cutover/rollback certificates; sibling phase 008 and program phase 014 own those
  actions.
- Retiring legacy writers or archival readers; phase 015 owns retirement after the rollback window and zero-use proof.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Classification is total over the frozen phase-003 in-flight-state census | Every census row appears exactly once in the classification manifest; the manifest reports zero missing, duplicate, or unrecognized row IDs |
| REQ-002 | Every row receives one and only one five-way disposition | The allowed enum is `UPCAST` / `PIN` / `FORK` / `MIGRATE` / `BLOCK`; overlap, an empty class, or an unknown value fails validation |
| REQ-003 | The decision is evidence-led and fail closed | Each row records the state digest, shape/version, lifecycle point, authority epoch, mutability, leases/locks, pending effects, identity/order coverage, rollback anchor, reason code, and verifier; any missing safety input yields `BLOCK` |
| REQ-004 | `UPCAST` is limited to pure shape conversion | The registered adjacent-version chain is deterministic, complete, side-effect-free, preserves stored source bytes and immutable identity, and produces replay-equivalent effective state |
| REQ-005 | `PIN` keeps active work wholly legacy-authoritative | Admission routes the row to the legacy path until a declared terminal boundary; no dark writer consumes authority, and timeout or unavailable legacy completion escalates to `BLOCK` |
| REQ-006 | `FORK` creates an isolated non-authoritative copy | The dark branch uses distinct execution/effect namespaces, cannot publish live effects or mutate the source, and exists only for parity or diagnostic evidence |
| REQ-007 | `MIGRATE` requires a quiescent, complete, reversible checkpoint | Import preserves logical identity, order, idempotency, budgets, receipts, pending-work semantics, and rollback anchors; source authority stays fenced until verification succeeds |
| REQ-008 | `BLOCK` is the safest default and a hard cutover veto | Unknown, ambiguous, corrupt, stale, actively locked, non-quiescent, lossy, effect-uncertain, or rollback-unanchored state prevents the affected mode's cutover while legacy remains authoritative |
| REQ-009 | Family baselines cover every persisted shape named by phase 003 | Every concrete census row inherits one baseline below or records an evidence-backed override reviewed by the owning state contract and rollback verifier |
| REQ-010 | Classification remains fresh through phase-014 compare-and-swap | Phase 014 re-verifies the row digest, authority epoch, leases, pending effects, prerequisites, parity evidence, and rollback anchor immediately before migration or cutover; drift invalidates the row and returns it to `BLOCK` |
| REQ-011 | The handoff is machine-verifiable and certificate-addressable | A mode cutover certificate binds the complete classification-manifest digest, all non-blocked row evidence, every pinned-row terminal receipt, migration receipts, parity forks, and zero live `BLOCK` rows |

### Five-way decision precedence

| Order | Class | Decision criterion |
|-------|-------|--------------------|
| 1 | `BLOCK` | Apply first as a veto when evidence is incomplete, state is corrupt or stale, a live lock/effect cannot be reconciled, conversion would be lossy, or rollback is not executable. |
| 2 | `PIN` | Use for a healthy active legacy execution that can finish within a bounded terminal contract but cannot be safely transformed or moved mid-step. |
| 3 | `FORK` | Use when an isolated dark copy is useful for parity or diagnosis and must never publish effects or become authoritative. |
| 4 | `MIGRATE` | Use when canonical state must move to the ledger from a quiescent checkpoint with complete identity, ordering, idempotency, pending-work, and rollback evidence. |
| 5 | `UPCAST` | Use when only the effective shape/version changes and a registered pure chain can preserve stored bytes and replay semantics without moving authority. |

The first matching safety veto wins. A row never carries a fallback list. If no positive class is proven, its class is
`BLOCK`, not the most convenient conversion.

### Phase-003 state-family baseline map

| Census state family | Baseline class | Required interpretation at execution |
|---------------------|----------------|--------------------------------------|
| Packet state logs and checkpointed JSON/JSONL state | `MIGRATE` | Import only a quiescent, integrity-verified checkpoint with complete stream identity and a retained legacy snapshot. |
| Per-iteration deltas and completed iteration event records | `UPCAST` | Resolve through a pure registered version chain; source bytes, order, and iteration identity remain auditable. |
| Research inbox entries awaiting consumption | `PIN` | Let the legacy consumer finish or reach a declared handoff boundary; do not duplicate dequeue or external work. |
| Council session and active round state | `PIN` | Keep the whole live round on the legacy authority until a terminal round/session boundary. |
| Improvement state and lifecycle journal for an active evaluation | `PIN` | Preserve evaluator state, lifecycle ordering, and pending effects on the legacy path until terminal. |
| In-progress fan-out dispatches, result waits, and executor-failure recovery | `PIN` | Preserve the legacy orchestrator's leases and retry ownership until the branch set reaches a bounded terminal state. |
| Completed observability events and immutable gauge inputs | `UPCAST` | Convert only the effective schema; do not rewrite historical evidence or recompute protected raw values. |
| Live shadow telemetry and benchmark comparison outputs | `FORK` | Copy into isolated shadow sinks for parity evidence; the copy cannot affect authority, budgets, or live effects. |
| Active lock markers and writer locks | `BLOCK` | Never translate ownership in place; drain or release under the owning lock protocol, then reclassify the resulting state. |
| Pause markers paired with a verified quiescent checkpoint | `MIGRATE` | Preserve pause intent and resume identity while importing the complete checkpoint and rollback anchor. |
| Prompt, log, delta, and iteration directories forming one active packet bundle | `PIN` | Keep path resolution and writes on the legacy artifact root until the packet reaches its declared terminal boundary. |
| SQLite coverage or council graphs at a transactionally frozen checkpoint | `MIGRATE` | Snapshot under the database's consistency boundary, verify graph/coverage integrity, import atomically, and retain restore evidence. |
| Dynamically resolved packet-local state not closed to a known census family | `BLOCK` | Treat an unresolved, mixed, missing, corrupt, or newly discovered shape as a census gap that vetoes cutover. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The frozen phase-003 census closes to a one-row/one-class manifest with zero coverage gaps.
- **SC-002**: Every class has explicit entry, handling, verification, failure, and rollback evidence requirements.
- **SC-003**: `BLOCK` is enforced as the default and as a per-mode cutover veto.
- **SC-004**: Phase 014 can deterministically select handling from the manifest without inferring policy at runtime.
- **SC-005**: Classification freshness is rechecked immediately before state handling and authority compare-and-swap.
- **SC-006**: Legacy authority remains unchanged throughout phase 008.

**Given** a frozen census row with missing identity, lock, effect, or rollback evidence, **When** classification runs,
**Then** the row is `BLOCK` and the affected mode cannot cut over.

**Given** an active council round with a healthy legacy completion path, **When** cutover preparation evaluates it,
**Then** the complete round is `PIN` and remains legacy-authoritative through its terminal receipt.

**Given** a versioned completed delta with a complete pure upcaster chain, **When** current code resolves it, **Then**
the effective shape is `UPCAST` deterministically while stored source bytes and identity remain unchanged.

**Given** a quiescent checkpoint with complete identity, ordering, pending-work, and rollback evidence, **When** phase 014
imports it, **Then** the row follows `MIGRATE`, verifies ledger equivalence, and retains a usable legacy anchor.

**Given** any row changes after classification, **When** phase 014 rechecks its digest or authority epoch, **Then** the
classification is stale, reverts to `BLOCK`, and no authority compare-and-swap occurs.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The child declares `depends_on: []` in the sibling planning tree; adjacency is navigation, not a hard runtime
dependency. Execution nevertheless consumes the frozen row evidence required by the
[phase-003 census](../../003-baseline-taxonomy-and-state-census/spec.md), inherits deterministic upcasting and
rollback constraints from the [phase-004 policy](../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md),
and supplies the state-disposition digest required by phase 014 under the
[program manifest](../../manifest/phase-tree.json).

The highest risks are classifying a family instead of every concrete row, treating an active lock as transferable,
duplicating pending effects through a fork, importing a partial SQLite or directory snapshot, allowing a pinned run to
outlive its bounded completion contract, and accepting a stale classification after the state or authority epoch has
changed. Total row closure, `BLOCK` precedence, source preservation, isolated effect namespaces, transactional
snapshots, terminal receipts, and immediate pre-cutover freshness checks are mandatory mitigations.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The frozen row IDs, immutable manifest bytes, bounded pin proof, class-specific receipts, rollback anchors, and
read-only phase-014 handling plan are implemented. Persisting a manifest through an authorized dark-ledger consumer
and executing authority compare-and-swap remain owned by later phases.
<!-- /ANCHOR:questions -->
