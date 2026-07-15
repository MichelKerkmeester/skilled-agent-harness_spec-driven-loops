---
title: "Feature Specification: Per-Mode Authority Flip"
description: "Plan the fail-closed switch that makes the dark spine canonical for one mode at a time, after current shadow-parity and rollback-drill evidence pass, while all other modes remain legacy-authoritative."
trigger_phrases:
  - "per-mode authority flip"
  - "deep-loop staged cutover"
  - "dark spine canonical authority"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the per-mode authority flip and rollback preconditions"
    next_safe_action: "Validate the cutover gate and mode-order planning contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Per-Mode Authority Flip

> Phase adjacency under `011-staged-state-migration-and-authority-cutover` (navigation order, not a hard runtime dependency): predecessor `001-inflight-state-migration`; successor `003-cutover-certificate-and-rollback-window`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Child 002 of the staged state migration and authority cutover phase |
| **Depends on** | None (`[]`); independent sibling planning contract within phase 011 |
| **Cutover role** | Makes the dark spine canonical for exactly one mode after parity and rollback evidence pass |
| **Authority posture** | Legacy remains authoritative for every non-selected mode and for the selected mode until the atomic flip |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The [parent program spec](../../spec.md) requires an additive-dark migration: the typed ledger and dark spine may
record and project in parallel, but legacy remains authoritative until compatibility, shadow parity, in-flight-state
handling, and rollback evidence are proven. Its sequencing invariants reserve authority changes for phase 011 and
require one mode at a time. The [phase-tree manifest](../../manifest/phase-tree.json) names the eight mode workstreams,
requires `010-mode-and-lane-migrations` to complete them, and gives phase 011 the outcome of classifying eligible state
and flipping authority behind a rollback window and cutover certificate.

This phase plans the authority switch itself. The runtime needs one durable, mode-keyed authority selector that makes an
unambiguous route decision at the mode write boundary: legacy before the flip and the dark spine after the flip. A
global flag, a process-local default, or a flag-only change is insufficient. A selector read must bind the mode,
authority epoch, selected writer, contract identities, and current state; the transition must pass the phase-001
[transition, versioning, and rollback policy](../../001-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md)
and record an authorized ledger event.

Every mode flip is gated independently. The mode must have a current, complete, zero-divergence parity certificate from
the phase-005 [shadow-parity harness](../../005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md),
a current passing mode-scoped rollback certificate from the phase-005 [rollback drills](../../005-compatibility-shadow-and-rollback-bridge/005-rollback-drills/spec.md),
and a resolved in-flight-state classification and migration result. A failed or stale gate leaves that mode on legacy and
does not prevent the other modes from being assessed independently. The flip is a recorded authority transition, not an
untracked configuration mutation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A durable authority record keyed by the canonical mode/workstream identity, containing the authority state, monotonic
  epoch, selected writer route, candidate identity, certificate identities, rollback-window state, and last transition.
- A single runtime authority selector used by each mode adapter at the canonical write boundary. Valid states select one
  route only; missing, malformed, stale, or cross-mode state fails closed rather than silently defaulting to a route.
- A fail-closed pre-flip gate that verifies the exact mode's phase-010 mode gate, current phase-005 parity certificate,
  current phase-005 rollback-drill certificate, in-flight-state classification, migration result, phase-001 policy
  version, candidate identity, and required rollback assets.
- An atomic cutover coordinator that obtains a transition-authorization decision, compare-and-swaps the expected
  authority epoch, appends a canonical authority-transition ledger event, and publishes the new selector state as one
  auditable transition. A partial flag/event update is not a successful flip.
- A mode-scoped reversible rollout state in which the dark spine is canonical, the legacy projection and rollback assets
  remain available, health and rollback evidence are collected, and stale legacy writers are denied by epoch.
- A deterministic ordering for the eight manifest workstreams: `001-deep-research`, `002-deep-review`,
  `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`,
  `007-skill-benchmark`, and `008-deep-alignment`. The shared deep-improvement workstream precedes its three variants.
- Immediate post-flip verification, independent mode telemetry, and handoff evidence for the successor phase's
  cutover certificate and rollback-window contract.

### Out of Scope
- Implementing the phase-005 shadow-parity harness, its divergence taxonomy, parity certificate, or rollback-drill
  runner. This phase consumes their current evidence and rechecks freshness.
- Defining the event envelope, transition vocabulary, authority state machine, or rollback duration. Those rules belong to
  the phase-001 transition policy and may not be weakened here.
- Reclassifying an in-flight packet or inventing a new migration disposition. Phase 011's state-migration sibling owns
  classification and migration evidence; this phase consumes the result at the gate.
- Retiring legacy writers, removing archival readers, or closing the rollback window. Phase 012 and the phase-011
  successor own those later actions.
- Flipping more than one mode in one transaction, using a global authority switch, or treating a successful dry run as a
  production authority change.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Authority is selected per mode | A selector lookup is keyed by the canonical mode/workstream identity and returns exactly one valid route for that mode; other mode records are not read as fallback authority. |
| REQ-002 | Selector failure is fail closed | Missing, malformed, stale-epoch, unknown-state, wrong-mode, or contract-incompatible selector data blocks the write and emits bounded diagnostic evidence without choosing legacy or dark implicitly. |
| REQ-003 | Legacy remains authoritative before the flip | `legacy_authoritative`, `shadowing`, and `cutover_ready` states route canonical writes to legacy; dark observations remain shadow-only and cannot change authority. |
| REQ-004 | Dark becomes canonical only in the reversible state | `new_authoritative_reversible` and `new_authoritative_final` route canonical writes to the dark spine, while legacy remains available only through the declared projection and rollback path. |
| REQ-005 | Parity is a hard precondition | The selected mode has a complete, current, mode-bound phase-005 parity certificate with zero open divergences and matching BASE, candidate, contract, input, comparator, and projection identities. |
| REQ-006 | Rollback rehearsal is a hard precondition | The selected mode has a current passing phase-005 rollback-drill certificate proving forward detection, admission freeze, writer fencing, state reconciliation, legacy restoration, stale-writer denial, and integrity checks. |
| REQ-007 | In-flight state is eligible for authority change | The mode's state census, classification, and migration evidence are complete, current, and bound to the candidate and rollback assets; unresolved or blocked state denies the flip. |
| REQ-008 | The flip is authorized and atomic | One transition-authorization decision, expected authority epoch, selector update, and canonical authority-transition ledger event commit atomically; a compare-and-swap conflict leaves legacy authority unchanged. |
| REQ-009 | Every flip is recorded in the ledger | The event binds mode, previous and next authority states, previous and next epochs, candidate identity, policy version, parity and drill certificate IDs, state-migration identity, rollback-window policy, actor, request digest, and timestamp. |
| REQ-010 | The blast radius is one mode | A cutover changes only the selected mode's authority record, writer route, mode streams, projections, and telemetry; every other mode remains legacy-authoritative with its previous epoch and writer. |
| REQ-011 | Flips follow the manifest order | The coordinator processes the eight modes in the manifest order, never flips a benchmark variant before `004-deep-improvement-common`, and rejects a batch request containing multiple modes. |
| REQ-012 | Rollback remains available after the flip | The reversible state preserves the legacy adapter, rollback anchor, classified state policy, and phase-001 minimum window of 14 calendar days and five successful authoritative executions, whichever completes later. |
| REQ-013 | Drift blocks authority | A changed BASE, code/build, mode contract, parity case set, sealed input, state classification, rollback asset, selector policy, or certificate identity invalidates readiness and leaves the mode on legacy or triggers the declared rollback path. |
| REQ-014 | Cutover evidence is handoff-ready | The phase emits an immutable transition record and mode-scoped evidence bundle sufficient for phase `003-cutover-certificate-and-rollback-window` to issue or reject the cutover certificate without reconstructing hidden selector state. |
<!-- /ANCHOR:requirements -->

### Authority-selection contract

| Authority state | Canonical route | Allowed transition in this phase | Required behavior |
|-----------------|-----------------|----------------------------------|-------------------|
| `legacy_authoritative` | Legacy writer | None | Continue legacy; parity and drill evidence may be refreshed without changing authority. |
| `shadowing` | Legacy writer | None | Compare dark output without publication; no selector mutation is permitted. |
| `cutover_ready` | Legacy writer | `cutover_ready` -> `new_authoritative_reversible` | Run all gates, authorize the exact request, CAS the epoch, append the transition event, and publish dark authority atomically. |
| `new_authoritative_reversible` | Dark spine writer | None | Keep legacy projections and rollback assets available; deny stale legacy writes and collect window evidence. |
| `new_authoritative_final` | Dark spine writer | None | Enter only through the governed window-closure contract; this phase does not close the window. |
| `rollback_pending` | No new canonical admission | `rollback_pending` -> legacy authority | Consume the rollback drill/runbook, freeze admission, fence the dark writer, reconcile declared state, and restore legacy at a new epoch. |

The selector must be evaluated at the canonical persistence boundary, not only at process startup. A cached selector is
valid only while its mode, authority epoch, policy version, and record digest match the durable authority record. The
selector may expose a shadow route for observation, but it must expose only one canonical writer. An authority event is
the durable audit fact for the transition; a process flag or environment variable is never the source of truth.

### Mode order and isolation

The manifest order is the default cutover order and is intentionally explicit:

| Order | Mode/workstream | Ordering and isolation rule |
|------:|-----------------|-----------------------------|
| 1 | `001-deep-research` | First candidate; its own parity, drill, state, writer, and rollback evidence are required. |
| 2 | `002-deep-review` | Flip only after the first transition transaction is complete and no earlier rollback is active. |
| 3 | `003-deep-ai-council` | Remains independent from review authority and uses its own selector record and evidence identities. |
| 4 | `004-deep-improvement-common` | Must precede the three shared-backend variants named below. |
| 5 | `005-agent-improvement` | Uses the already-flipped common services but retains a separate mode authority record and blast radius. |
| 6 | `006-model-benchmark` | Uses the common services but cannot inherit the common parity or rollback certificate. |
| 7 | `007-skill-benchmark` | Uses the common services but cannot share a selector epoch or cutover event with the other variants. |
| 8 | `008-deep-alignment` | Last manifest workstream; its review-loop coupling is isolated by its own write set and selector state. |

Only one cutover transaction or rollback transaction may be active at a time. The rollback window remains independently
tracked per mode, and a later flip may not reuse an earlier mode's certificates, state, epoch, or writer lease. The
implementation gate must record whether the operational policy permits already-flipped modes to remain reversible while
the next mode is cut over; the conservative default is to close the prior mode's immediate post-flip verification before
starting the next transaction.
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A valid authority record and selector choose legacy or dark per mode with no implicit fallback, and all
  non-selected modes remain legacy-authoritative during a flip.
- **SC-002**: Missing, partial, stale, wrong-mode, drifted, or unresolved parity, rollback, or state evidence blocks the
  selected mode without changing any authority record.
- **SC-003**: A successful flip commits one authorized authority-transition ledger event, one monotonic epoch change,
  and one selector route change as an atomic per-mode transition.
- **SC-004**: The dark spine is canonical only for the selected mode in `new_authoritative_reversible`; legacy readers,
  projections, rollback assets, and stale-writer fencing remain available.
- **SC-005**: The eight modes are processed in manifest order, with `004-deep-improvement-common` before its three
  variants and no multi-mode cutover transaction.
- **SC-006**: The resulting evidence bundle lets the successor phase verify the flip, its exact inputs, and its open
  rollback window without reconstructing mutable process state.

**Given** a mode whose parity certificate, rollback-drill certificate, state classification, migration identity, and
candidate identity are all current, **When** the authority coordinator evaluates the cutover request, **Then** it
authorizes one expected epoch, appends the transition event, and selects the dark writer only for that mode.

**Given** any required certificate is missing, stale, wrong-mode, incomplete, or bound to a different candidate, **When**
the mode requests authority, **Then** the request is denied, legacy remains authoritative, and no cutover event is emitted.

**Given** a valid cutover for one mode, **When** another mode executes a canonical write, **Then** its selector and
authority epoch still route to legacy and its state is unchanged.

**Given** a reversible dark-authority mode receives a rollback trigger, **When** the declared rollback procedure starts,
**Then** admission freezes, the dark writer is fenced, legacy resumes at a new epoch, events remain preserved, and stale
dark writes are denied.

**Given** two modes are included in one cutover request or two writers present the same expected epoch, **When** the
coordinator evaluates the request, **Then** it rejects the batch or CAS conflict without a partial authority change.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Flag-only authority change** - A process flag could select dark without a durable epoch or ledger fact. Mitigation:
  require the selector, transition authorization, epoch CAS, and authority event to commit together.
- **Stale evidence opens authority** - A parity or drill certificate may remain green while a reducer, adapter, BASE,
  state classification, or candidate changes. Mitigation: bind every identity and revalidate freshness immediately
  before the CAS; any drift leaves legacy authoritative.
- **Split-brain writers** - Legacy and dark writers could both accept after a flip. Mitigation: one mode-keyed epoch,
  gateway checks at the write boundary, stale-writer denial, and post-flip negative fixtures.
- **Cross-mode blast radius** - A global flag or shared deep-improvement backend could change sibling modes accidentally.
  Mitigation: per-mode authority records, mode-tagged ledger events, explicit write sets, and the manifest order that
  flips common services before their variants.
- **Unsafe rollback window** - A timer could close before five authoritative executions or while reconciliation is open.
  Mitigation: consume the phase-001 later-of-14-days-and-five-runs rule and retain rollback assets until successor evidence
  proves closure.
- **In-flight inconsistency** - A selected mode could contain state that was not safely upcast, pinned, forked, migrated,
  or blocked. Mitigation: phase-011 state-migration evidence is a hard precondition, not an operator override.
- **Dependencies**: the normative sources are the parent program spec, `manifest/phase-tree.json`, the phase-001
  transition policy, the phase-005 shadow-parity and rollback-drill specs, and the phase-010 mode gates. The child
  declares `depends_on: []` as an independent planning contract; these are consumed evidence and ownership boundaries.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Implementation must resolve the concrete authority-record storage, the registered
authority-transition event name, the selector cache invalidation mechanism, the operational policy for overlapping
reversible windows, the exact post-flip health thresholds, and the evidence destination. Those choices may not weaken
per-mode isolation, fail-closed gates, the manifest order, the phase-001 rollback minimum, or the requirement that the
flip is a ledger-recorded atomic transition.
<!-- /ANCHOR:questions -->
