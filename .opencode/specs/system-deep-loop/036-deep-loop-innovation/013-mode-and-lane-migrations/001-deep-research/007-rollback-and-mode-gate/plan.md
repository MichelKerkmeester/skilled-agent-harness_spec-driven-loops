---
title: "Implementation Plan: Deep Research - Rollback and Mode Gate"
description: "Implementation record for the Deep Research mode's fail-closed rollback switch, bounded rollback window, independent migration gate, and phase-014 certificate handoff."
trigger_phrases:
  - "Deep Research rollback and mode gate implementation plan"
  - "deep-research authority switch plan"
  - "deep-research migration certificate plan"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the rollback switch, migration gate, and focused adversarial verification"
    next_safe_action: "Hand the readiness-only certificate contract to phase 014"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research - Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Research mode migration |
| **Change class** | Additive-dark runtime contract and verification |
| **Execution** | Pinned BASE with shared phase-012 and phase-014 contract digests |

### Overview
This phase turns the parent migration invariants into a Deep Research-specific rollback and mode-gate implementation. It authenticates the phase-009 parity receipt against real authorized-ledger audit evidence, joins sealed artifacts, certificates, receipts, resume evidence, replay fingerprints, classification, and rollback rehearsal, and emits the mode-migration certificate that phase 014 may consume. It does not flip authority, retire the legacy writer, or replace any sibling implementation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase-012 shared mode interfaces, write-set conflict graph, transition gateway, and rollback vocabulary are frozen for this mode
- [x] Deep Research sibling outputs from typed schema through shadow parity identify their artifacts, receipts, fingerprints, and failure dispositions
- [x] The switch has explicit deny-by-default states, epoch rules, external authorization, and no mode-owned recovery authority
- [x] The rollback window inherits the 14-day and five-successful-run minimum and defines extension and closure evidence
- [x] The independent gate lists every required parity, seal, certificate, receipt, replay, resume, lifecycle, and rollback input
- [x] The phase-014 handoff distinguishes a mode-migration certificate from a later cutover certificate

### Definition of Done
- [x] The rollback switch and non-destructive runbook are implemented against the shared transition policy
- [x] The independent Deep Research gate blocks incomplete or stale evidence and emits an exact-SHA-bound migration certificate only when green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Mode-scoped switch.** Maintain one Deep Research authority record with the shared states `legacy_authoritative`, `shadowing`, `cutover_ready`, `new_authoritative_reversible`, `new_authoritative_final`, and `rollback_pending`; use a guarded rollback request rather than a second authority source.
- **Fail-closed admission.** A ledger-authority or recovery-sensitive transition requires a current mode, policy version, authority epoch, gate certificate digest, request digest, and evidence digest. Missing, unknown, stale, or mismatched input denies before append, projection, effect, or authority change.
- **Independent gate.** A verifier reads immutable parity receipts, sealed references, certificates, effect and handoff receipts, reducer/projection fingerprints, and fixture results. It does not trust the mutable report or the mode's own recovery judgment and cannot directly flip authority.
- **Rollback path.** On an authorized trigger, freeze new ledger admission, fence the ledger writer, preserve the event and artifact history, classify in-flight branches and effects through the resume adapter, restore legacy authority at a new epoch, and emit a rollback certificate with unresolved states.
- **Window policy.** Open the reversible window at the eventual cutover boundary; close only after both 14 calendar days and five successful authoritative executions complete and all parity, replay, receipt, budget, health, and reconciliation evidence is resolved. Extend on low traffic or any open obligation.
- **Certificate handoff.** Produce a mode-migration certificate that proves readiness and rollback availability. Phase 014 separately issues the cutover certificate and owns the authority flip; this phase never treats its own certificate as a cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and the shared phase-012 contract, write-set graph, transition policy, rollback policy, and phase-014 handoff schema.
- Build a Deep Research evidence inventory from siblings `001` through `006`, including lifecycle event versions, projection fingerprints, sealed artifacts, certificates, receipts, resume decisions, and parity dispositions.
- Mark the authority boundary: phase 009 remains non-authoritative, this phase gates readiness, and phase 014 alone changes authority.

### Phase 2: Implementation
- Freeze the mode-scoped switch states, request schema, deny-by-default guards, external authorization dependency, monotonic epoch rules, and stale-writer rejection.
- Define rollback triggers for unexplained parity, seal or certificate invalidity, replay mismatch, state or receipt integrity failure, health degeneration, budget breach, unsafe resume, source or claim drift, and duplicate or stale authority requests.
- Define the rollback runbook and evidence order: freeze admission, fence the ledger writer, classify in-flight state, reconcile safe effects, restore legacy at a new epoch, preserve append-only history, and issue the rollback certificate.
- Define the 14-day/five-successful-run window, successful-run semantics, low-traffic extension, unresolved-obligation extension, closure evidence, and retained rollback assets.
- Define the independent gate matrix over parity, seals, certificates, receipts, deterministic replay, resume, lifecycle fixtures, failure dispositions, and rollback rehearsal.
- Define the mode-migration certificate fields, exact digest bindings, verifier identity, result enum, unresolved-risk list, rollback anchor, and phase-014 acceptance handoff.
- Challenge the contract with missing evidence, stale fingerprints, mixed versions, unknown effects, crash boundaries, source changes, health alarms, low traffic, and split-brain attempts.

### Phase 3: Verification
- Confirm the switch denies unknown, stale, incomplete, or gateway-failed requests without changing authority or appending semantic events.
- Confirm every rollback fixture preserves evidence, fences stale writers, changes the epoch, restores legacy through external authorization, and records a certificate.
- Confirm the gate cannot pass without phase-009 green parity, sealed artifacts, complete receipts and certificates, deterministic replay, resume evidence, and full lifecycle coverage.
- Confirm the window cannot close on elapsed time or run count alone and remains open when traffic or obligations are insufficient.
- Confirm the certificate is exact-SHA and contract-digest bound, names every fixture and disposition, and makes no cutover claim.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Switch state-machine fixtures prove default legacy authority, deny-by-default behavior, stale epoch rejection, and no semantic append on denied requests |
| REQ-002 | Authorization fixtures prove Deep Research cannot self-authorize rollback, unquarantine, verifier replacement, or authority restoration |
| REQ-003 | Window fixtures prove closure waits for both 14 calendar days and five successful authoritative executions and extends for low traffic or unresolved obligations |
| REQ-004 | Fault-injection rollback rehearsal proves admission freeze, writer fencing, resume classification, new-epoch legacy restore, event preservation, and rollback certificate emission |
| REQ-005 | Gate matrix requires phase-009 parity green, valid seals, complete certificates and receipts, deterministic replay, resume evidence, and no unexplained semantic divergence |
| REQ-006 | Missing, stale, contradictory, malformed, and nondeterministic inputs produce `blocked`, `not_ready`, or `rollback_required`, never a migration certificate |
| REQ-007 | Certificate verifier checks exact SHA, BASE, contract digests, versions, fixture IDs, stream/artifact digests, verifier identity, and dispositions |
| REQ-008 | Lifecycle matrix exercises init, gather/analyze, convergence, synthesis, memory-save, crash-resume, source refresh, quarantine, contradiction, and incomplete-run cases |
| REQ-009 | Independence fixture separates immutable evidence verification from mode execution and confirms no direct authority mutation is available to the gate |
| REQ-010 | Phase-014 handoff fixture accepts the migration certificate while rejecting any artifact that claims authority has already moved or the window has closed |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan inherits the parent program's additive-dark migration model and the shared transition/versioning/rollback policy. It consumes phase-012's shared mode interfaces and executable write-set conflict graph; Deep Research's typed-ledger, reducer/projection, sealed-artifact, certificate/receipt, resume-adapter, and shadow-parity sibling contracts; and phase 014's staged authority-cutover handoff. The research basis is the Deep Research section of `findings-registry-modes.json` plus the runtime recovery and authorization recommendations in `findings-registry.json`. No child hard dependency is introduced by this planning contract; the stated predecessor is adjacency for navigation.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation is additive and dark. Reverting the new module, focused test, and this leaf's documentation removes the readiness layer without changing production authority. After downstream artifacts consume the contract, an amendment must identify the changed state, trigger, window, evidence field, certificate, fixture, and phase-014 consumer; reopen stale gates; and rerun parity, replay, rollback, and handoff verification. Runtime rollback remains non-destructive: preserve ledger history and sealed artifacts, fence the ledger writer, restore legacy authority at a new epoch through the external transition gateway, reconcile in-flight work under the resume policy, and emit a rollback certificate.
<!-- /ANCHOR:rollback -->
