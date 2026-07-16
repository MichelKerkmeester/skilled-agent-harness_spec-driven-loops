---
title: "Feature Specification: Rollback Drills"
description: "Plan executable, mode-scoped rollback drills that simulate a test-lane authority flip, detect a controlled regression, restore legacy authority within the phase-004 rollback window, and prove state integrity before phase 014 may attempt a real cutover."
trigger_phrases:
  - "deep-loop rollback drills"
  - "legacy authority rollback rehearsal"
  - "rollback evidence before cutover"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned mode-scoped rollback-drill contract"
    next_safe_action: "Implement hermetic drills before any phase-014 authority flip"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Rollback Drills

> Phase adjacency under `008-compatibility-shadow-and-rollback-bridge` (navigation order, not a hard runtime dependency): predecessor `004-inflight-state-classification`; successor none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Final child of the phase-008 compatibility, shadow, and rollback bridge |
| **Depends on** | None (`[]`); sibling planning contracts compose at the phase-008 parent gate |
| **Cutover role** | Required mode-scoped rehearsal evidence before phase 014 may attempt a real authority flip |
| **Authority posture** | Test-lane simulation only; real legacy authority is never changed in phase 008 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

A rollback switch is not evidence that a live cutover is reversible. The system must prove, before phase 014, that a
mode can move forward in an isolated test lane, expose a controlled regression, freeze new work, fence the spine
writer, reconcile in-flight state, restore legacy authority at a new epoch, and resume the loop without losing or
duplicating state. The program manifest assigns that safety proof to phase 008 and explicitly forbids authority
cutover here (`../../manifest/phase-tree.json`).

The governing [transition, versioning, and rollback policy](../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md)
keeps each per-mode cutover reversible for at least 14 calendar days and five successful authoritative executions,
whichever completes later. It requires non-destructive rollback, admission freeze, spine-writer fencing, declared
in-flight reconciliation, a new legacy authority epoch, preserved events, and a rollback certificate. The sibling
[shadow-parity harness](../003-shadow-parity-harness/spec.md) supplies current, mode-scoped parity evidence and the
verified replay-component comparisons that make a forward test meaningful. The phase-007
[receipts and effect-recovery contract](../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md)
supplies durable intent, confirmation, reconciliation, and boundary evidence needed to prove that rollback neither
loses nor double-applies an effect.

This phase plans executable drills, not production authority changes. Each drill starts from one sealed, mode-scoped
rollback capsule and forks an isolated control lane and cutover lane. The cutover lane performs a simulated forward
flip, runs a bounded workload, injects one declared regression, detects it through the production-shaped guard, and
executes the rollback procedure. The resumed legacy result is then compared with the untouched control lane using
verified replay-fingerprint components, canonical legacy projections, receipts, authority epochs, and state counts.
Only a complete, current drill certificate with every integrity check green can satisfy the rollback-evidence input
of a later phase-014 cutover certificate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned drill manifest per mode binding BASE and candidate identities, parity certificate, sealed input set,
  initial-state digest, in-flight-state classification manifest, rollback anchor, adapter/projection/fingerprint
  versions, legacy and spine writer identities, starting authority epoch, rollback-window policy, injection point,
  declared observations, and evidence destination.
- A hermetic drill runner with independent control and cutover roots, isolated authority storage, synthetic or cassette
  effects, deterministic clock control, explicit timeouts, and a cleanup check that cannot mutate real mode authority.
- The executable sequence: preflight; legacy control continuation; simulated test-lane forward flip; bounded spine
  execution; controlled regression injection and detection; admission freeze; spine fencing; in-flight reconciliation;
  legacy restoration at a new epoch; legacy resume; integrity verification; certificate emission.
- Regression fixtures covering at least replay-fingerprint mismatch, legacy-projection mismatch, stale authority epoch,
  missing or conflicting receipt, unresolved effect intent, and crash/timeout at a declared cut point. Each invocation
  selects one fixture and proves the matching detector initiates or blocks rollback as specified.
- Post-rollback integrity checks over verified effective-event and canonical-projection fingerprint components,
  byte-exact legacy projection output and reader results, preserved ledger/event ranges, state and artifact counts,
  monotonic authority epochs, stale-writer denial, and receipt/effect lifecycle closure.
- A pass/fail bar requiring rollback completion before the declared phase-004 window closes, successful legacy resume
  from the rollback anchor, zero lost or duplicated durable facts, zero unresolved `in_doubt` effects, and no residual
  writer with authority under the superseded epoch.
- An immutable, mode-scoped drill certificate consumed by phase 013 mode gates and revalidated by phase 014 against
  current code, contracts, parity evidence, state classification, rollback assets, and authority policy.

### Out of Scope
- Changing real runtime authority, running a drill against live mutable packet state, or invoking an irreversible live
  effect. Phase 008 remains additive, dark, and non-authoritative.
- Defining the parity certificate, replay-fingerprint algorithm, legacy projection format, effect-recovery protocol,
  in-flight-state taxonomy, authority state machine, or rollback-window duration; this phase consumes those contracts.
- Repairing a failed parity case, inventing a new state disposition during rollback, or weakening a regression detector
  to make a drill pass. The owning phase fixes the contract and the complete affected drill reruns.
- Issuing a real cutover certificate, closing a live rollback window, retiring a legacy writer, or proving zero-use
  telemetry. Those actions belong to phases 011 and 012.
- Treating elapsed time alone as proof. A fast rollback with fingerprint, projection, receipt, state, or epoch mismatch
  fails, as does an integrity-clean rollback completed after its declared window.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every drill is mode-scoped, reproducible, and isolated from real authority | The manifest binds all code, contract, state, parity, policy, and evidence inputs; preflight rejects mutable, missing, stale, cross-mode, or production-targeted inputs before any simulated flip |
| REQ-002 | The drill exercises the complete forward-detect-rollback-resume path | One invocation records a legal test-lane forward epoch change, bounded spine work, declared regression, detector result, admission freeze, spine fence, state reconciliation, legacy restoration, and resumed legacy step |
| REQ-003 | Regression detection is real and fail closed | The selected fault enters through a declared injection point, the expected production-shaped detector observes it, and a missing, late, wrong-class, or manually asserted detection fails the drill |
| REQ-004 | Rollback follows the phase-004 authority contract | The runner freezes admission, fences the spine writer, applies only predeclared state dispositions, restores legacy authority by compare-and-swap at a new monotonic epoch, preserves all ledger evidence, and denies stale writers |
| REQ-005 | Rollback completes inside the governed window | The certificate records window-open and rollback-complete instants plus the governing policy version; completion precedes closure under the later-of-14-days-and-five-runs rule and any stricter declared mode deadline |
| REQ-006 | Replay integrity survives rollback | Both control and resumed-legacy transcripts verify under the registered replay contract and match on the declared effective-event and canonical-projection component digests; stored cutover-lane events remain preserved and auditable |
| REQ-007 | Legacy projection integrity survives rollback | The resumed legacy artifacts and unchanged-reader results match the control lane under the sibling projection serializer, ordering, newline, suppression, watermark, and integrity contract |
| REQ-008 | State and effects are neither lost nor duplicated | Durable fact, artifact, and state counts reconcile to the control plus explicitly retained shadow evidence; every effect has one intent and one confirmed/reconciled terminal outcome, with no conflict or unresolved `in_doubt` result |
| REQ-009 | Drill evidence is complete, immutable, and freshness-bound | The certificate binds the manifest, injected fault, timeline, epoch transitions, fences, state reconciliation, fingerprint/projection results, receipt IDs, preserved ranges, pass/fail decision, and verifier identity; any bound-input drift invalidates it |
| REQ-010 | Phase 014 cannot cut over without current drill evidence | A missing, failed, partial, wrong-mode, stale, unverifiable, or policy-incompatible drill certificate blocks the real authority flip while legacy remains authoritative |
| REQ-011 | Phase 008 never moves real authority | All authority mutations target an isolated test authority store; real mode flags, writer leases, packet state, and external effects remain unchanged before, during, and after every drill |
<!-- /ANCHOR:requirements -->

### Drill certificate minimum

| Evidence group | Required bindings |
|----------------|-------------------|
| Identity | Mode, BASE, candidate SHA/build, drill-manifest digest, parity-certificate digest, classification-manifest digest, contract and policy versions |
| Forward path | Starting epoch, simulated cutover decision/receipt, test writer identity, bounded workload, produced ledger range, and effect intents |
| Regression | Fixture ID, injection point and time, expected detector and threshold, observed detector result, and first rollback-trigger record |
| Rollback | Admission-freeze receipt, spine fence, in-flight disposition counts, legacy compare-and-swap receipt, restored epoch, stale-writer denial, and preserved event ranges |
| Integrity | Verified replay component digests, legacy projection bytes/readers, state/artifact counts, effect terminal states, control comparison, and cleanup result |
| Timing and verdict | Window-open, detection, rollback-start, rollback-complete, legacy-resume instants, elapsed durations, pass/fail reason codes, and verifier identity |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every cutover-eligible mode has an executable drill manifest and a current passing drill certificate.
- **SC-002**: The runner performs a simulated forward flip, detects the declared regression, and restores legacy authority at a new epoch without touching real authority.
- **SC-003**: Rollback completes before the governed window closes and any stricter mode deadline expires.
- **SC-004**: Verified replay components and byte-exact legacy projections match the isolated control continuation after legacy resume.
- **SC-005**: State, artifacts, event ranges, receipts, and effects reconcile with zero loss, duplication, conflict, or unresolved ambiguity.
- **SC-006**: Phase 014 rejects absent, failed, stale, wrong-mode, or unverifiable drill evidence.

**Given** a current parity certificate, sealed rollback capsule, and complete state classification, **When** the test lane
performs its simulated forward flip, **Then** only the isolated authority store advances and real legacy authority is unchanged.

**Given** a declared regression fixture is injected after bounded spine work, **When** the expected detector evaluates
the evidence, **Then** it records the typed trigger and starts or blocks rollback without a manual success assertion.

**Given** rollback begins inside the open policy window, **When** admission is frozen and the spine writer is fenced,
**Then** legacy authority resumes at a new epoch before window closure and every stale-epoch spine write is denied.

**Given** legacy has resumed from the rollback anchor, **When** the control and resumed lanes are verified, **Then** their
declared replay components, legacy projections, reader results, and durable state match with all shadow evidence retained.

**Given** any fingerprint, projection, receipt, effect, state, epoch, timing, isolation, or freshness check fails, **When**
certificate issuance is requested, **Then** the drill fails and phase 014 remains blocked for that mode.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The child declares `depends_on: []` because it is an independent sibling planning contract. Execution nevertheless
consumes current outputs from the phase-004 rollback policy, sibling shadow-parity harness, predecessor in-flight-state
classification, phase-007 receipt/effect-recovery service, replay-fingerprint verifier, and legacy projections. Those
are evidence inputs, not graph-level planning dependencies, and every consumed identity is bound into the drill
manifest and certificate.

The highest risk is a theatrical rollback: toggling a flag back while leaving new writes, unresolved effects, divergent
projections, or stranded state behind. The drill therefore requires a control continuation, production-shaped failure
detection, admission freeze, writer fencing, monotonic authority epochs, state reconciliation, stale-writer rejection,
and component-level integrity comparisons. A second risk is a dangerous rehearsal that touches real authority or live
effects; hermetic roots, a dedicated test authority store, synthetic clock, effect cassettes, and post-run cleanup
attestation are hard preconditions.

Other risks are stale parity evidence, an incomplete state classification, rollback assets that no longer match the
candidate, false equality from comparing only final state, hidden duplicate effects, and a certificate that survives
code or policy drift. Fail-closed preflight, immutable receipts, replay-component plus byte-level comparisons, complete
state/effect accounting, and phase-014 freshness validation are mandatory mitigations. Controlling sources are
`../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`,
`../003-shadow-parity-harness/spec.md`,
`../../007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`, and
`../../manifest/phase-tree.json`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must resolve concrete runner modules, mode-specific regression fixtures, the
stricter operational deadline when a mode defines one, synthetic-clock implementation, evidence storage, and bounded
diagnostic payloads from the materialized phase-006/004/005 contracts. Those choices may not weaken the phase-004
window, isolation boundary, complete forward-detect-rollback-resume sequence, integrity checks, receipt closure,
certificate freshness, or the rule that phase 008 never changes real authority.
<!-- /ANCHOR:questions -->
