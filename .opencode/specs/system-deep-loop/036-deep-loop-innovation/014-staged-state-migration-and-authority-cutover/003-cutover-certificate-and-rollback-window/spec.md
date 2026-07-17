---
title: "Feature Specification: Cutover Certificate & Rollback Window"
description: "Plan the signed evidence bundle that authorizes a per-mode authority flip and the monitored rollback window that keeps the flip reversible until clean closure. The certificate is a ledger event binding parity, rollback, migration, and policy evidence."
trigger_phrases:
  - "cutover certificate rollback window"
  - "deep-loop authority flip certificate"
  - "per-mode rollback window enforcement"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined certificate contents and monitored rollback-window gates"
    next_safe_action: "Plan certificate verification and window enforcement before authority cutover"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Cutover Certificate & Rollback Window

> Phase adjacency under `014-staged-state-migration-and-authority-cutover` (navigation, not a hard runtime dependency): predecessor `002-per-mode-authority-flip`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the staged state-migration and authority-cutover phase parent |
| **Depends on** | None (`[]`); sibling planning contracts are independent |
| **Program substrate** | Phase 013 per-mode gates, phase-004 rollback policy, phase-007 receipts, and sibling `002-per-mode-authority-flip` |
| **Authority posture** | Certificate and window enforcement are cutover controls; legacy remains authoritative until sibling 002 completes a gated flip |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program parent makes phase 014 the only place where canonical authority may move. Its handoff requires each mode's flip to be backed by shadow parity, a rollback drill, a cutover certificate, and a monitored rollback window; phase 015 may retire the legacy writer only after that evidence is clean (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/spec.md`). The manifest gives this phase the outcome of flipping authority one mode at a time behind a rollback window and cutover certificate (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json`).

Sibling `002-per-mode-authority-flip` owns the one-mode-at-a-time compare-and-swap that changes the authority epoch. This child owns the evidence bundle that may authorize that operation and the control loop that keeps the resulting `new_authoritative_reversible` state reversible. Without a certificate, a flip can rely on unbound claims; without a monitored window, a timer can close while parity drift, health regressions, missing receipts, or state-reconciliation failures remain undetected.

The phase-004 transition, versioning, and rollback policy fixes the certificate precondition, one-writer authority states, and minimum rollback window of 14 calendar days and five successful authoritative executions, whichever completes later (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`). Phase 007 defines durable receipts, certification metadata, and effect recovery that this certificate must consume rather than replace (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/001-receipts-and-effect-recovery/spec.md`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A canonical `cutover_certificate` ledger event with a stable certificate ID, mode identity, candidate SHA, authority epochs, transition digest, policy identity, issuer, issuance time, and certification metadata.
- Evidence bindings for the mode gate, shadow-parity proof, rollback-drill result, mixed-version replay, classified in-flight state, migration receipts, and the approving policy; each reference is content-addressed or otherwise verifier-bound.
- Certificate verification rules that validate completeness, signatures or registered certification scheme, exact candidate identity, policy version, current authority epoch, single-writer state, and zero unresolved pre-cutover blockers before sibling `002-per-mode-authority-flip` may flip.
- A per-mode rollback-window record opened by the successful authority compare-and-swap, with start time, required minimum duration, successful authoritative-run count, retained rollback assets, monitoring state, and closure evidence.
- Health, parity-drift, receipt, authorization, budget, replay, and state-reconciliation monitoring signals with explicit severity and escalation semantics.
- Revert triggers and a non-destructive rollback sequence: freeze admissions, fence the spine writer, reconcile in-flight work, restore legacy authority at a new epoch, preserve ledger events, and emit a rollback certificate using phase-007 receipt semantics.
- Window closure only after at least 14 calendar days and five successful authoritative executions have completed, no unresolved safety signal remains, and the closure decision is recorded as ledger evidence for phase 015.

### Out of Scope
- Implementing the per-mode authority compare-and-swap or selecting the mode order; sibling `002-per-mode-authority-flip` owns the flip operation and phase 013 supplies the migrated mode gates.
- Re-proving shadow parity, rollback drills, or in-flight-state classification; phase 008 produces those inputs and this phase verifies their bindings.
- Defining generic receipt cryptography or the effect-recovery adapter contract; phase 007 owns those shared services.
- Retiring legacy writers or archival readers; phase 015 consumes clean closure, zero-use telemetry, and archival-read evidence.
- Shortening the phase-004 minimum window or treating elapsed time without sufficient authoritative executions as clean closure.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every authority flip is authorized by one canonical certificate event | A certificate identifies exactly one mode, candidate SHA, source and target authority states, prior and new epoch, approving policy, and transition digest before the flip is accepted |
| REQ-002 | The certificate bundles complete, verifiable readiness evidence | Verification rejects a missing or mismatched shadow-parity proof, rollback-drill result, migration receipt, in-flight-state classification, mixed-version replay result, mode gate, or policy approval |
| REQ-003 | Certificate evidence is bound to the exact candidate and authority epoch | A changed artifact digest, candidate SHA, policy version, signer metadata, request digest, or stale epoch invalidates the certificate and leaves legacy authority unchanged |
| REQ-004 | The certificate is itself an auditable ledger event | The certificate uses the canonical envelope and authorization gateway, preserves its evidence digests and issuer metadata, and cannot be replaced by an unrecorded control-plane flag |
| REQ-005 | A successful flip opens a monitored reversible window | The window starts at the successful compare-and-swap and records its rollback anchor, retained adapters/state, monitoring cursor, and authoritative-run count |
| REQ-006 | Window duration follows the phase-004 later-of rule | Closure is impossible until both 14 calendar days and five successful authoritative executions are complete; low traffic keeps the window open rather than silently satisfying the run count |
| REQ-007 | Monitoring detects health and parity regressions | The monitor evaluates authoritative health, shadow-versus-authoritative parity drift, replay mismatches, authorization failures, receipt gaps, budget breaches, and state-reconciliation failures against ratified thresholds |
| REQ-008 | Revert triggers fail safe and preserve evidence | A trigger freezes admission, fences the spine writer, reconciles in-flight work under the declared policy, restores legacy at a new epoch, preserves all events, and emits a rollback certificate |
| REQ-009 | Clean closure produces durable handoff evidence | Closure records the final window facts, signal status, successful-run count, retained archival/rollback references, and a receipt or certificate that phase 015 can use as a retirement gate |
| REQ-010 | Certificate and window control are single-mode and single-writer safe | A multi-mode flip, duplicate certificate with different facts, stale monitor decision, or stale writer request fails closed without advancing authority |
| REQ-011 | Phase ownership remains explicit | Phase 008 remains the source of parity and rollback-drill evidence, sibling 002 remains the flip owner, this child owns certificate/window enforcement, and phase 015 remains the retirement owner |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A verifier can reconstruct one cutover certificate for a mode from the exact candidate SHA, policy digest, parity proof, rollback-drill result, migration receipts, and mode gate without relying on mutable ambient state.
- **SC-002**: Sibling `002-per-mode-authority-flip` cannot complete a mode flip when any certificate input is absent, stale, unverifiable, or contradictory.
- **SC-003**: Every successful flip has a durable window record that exposes the rollback anchor, 14-day minimum, five-run minimum, monitored signals, retained assets, and current closure state.
- **SC-004**: Any health regression, parity drift, replay mismatch, authorization or receipt failure, budget breach, or state-reconciliation failure inside the window reaches a deterministic rollback decision or an explicit operator stop.
- **SC-005**: A clean window closes only after the later-of duration/run rule and records evidence that phase 015 can consume without reinterpreting this policy.

**Given** a mode with complete parity, rollback-drill, migration-receipt, policy, and mode-gate evidence, **When** the certificate is verified against the candidate SHA and current authority epoch, **Then** the certificate ledger event is accepted and sibling `002-per-mode-authority-flip` may perform its single-mode compare-and-swap.

**Given** a certificate whose shadow proof, rollback drill, migration receipt, policy digest, or candidate SHA differs from the referenced artifact, **When** verification runs, **Then** the certificate is rejected and legacy authority remains active.

**Given** a mode in `new_authoritative_reversible` with 14 days elapsed but fewer than five successful authoritative executions, **When** closure is evaluated, **Then** the rollback window remains open and the mode stays reversible.

**Given** a parity drift or health regression crosses its ratified revert threshold during the open window, **When** the monitor records the trigger, **Then** admissions freeze, the spine writer is fenced, legacy authority resumes at a new epoch, and a rollback certificate records reconciliation without deleting events.

**Given** all required time, run-count, health, parity, replay, authorization, receipt, budget, and state signals are clean, **When** the window closes, **Then** closure evidence is appended and phase 015 remains blocked until its independent zero-use and archival-read gates also pass.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Evidence substitution** — a certificate could point to a later or different artifact than the candidate being flipped. Mitigation: bind every input to a digest, candidate SHA, policy version, mode identity, and authority epoch; verify all bindings before the CAS.
- **Window closure by clock alone** — a low-traffic mode could appear clean without five real authoritative executions. Mitigation: use the later of 14 calendar days and five successful authoritative executions, and extend for unresolved signals as required by phase 004.
- **Monitoring blind spot** — health may remain green while shadow parity, replay, receipt, budget, or reconciliation evidence drifts. Mitigation: treat health and parity as separate required signal families and include the phase-007 receipt/effect evidence in the monitor.
- **Split-brain rollback** — the legacy and spine writers could both accept during a revert. Mitigation: freeze admissions, fence the spine, restore legacy at a new epoch, and require stale-epoch rejection at the authorization boundary.
- **Certificate recursion or false trust** — certificate metadata could be mistaken for a domain result or a process-local MAC could be treated as restart-verifiable proof. Mitigation: emit a typed ledger event through phase-006 authorization and consume phase-007's registered certification scheme and verifier policy.
- **Ownership drift** — this child could duplicate the flip or retirement logic. Mitigation: preserve the sibling 002, phase 008, and phase 015 boundaries in the conformance matrix and checklist.
- **Dependencies**: phase-004 supplies the normative rollback-window policy; phase 007 supplies durable receipts and certification/effect recovery; sibling `002-per-mode-authority-flip` performs the authority CAS; `manifest/phase-tree.json` defines the phase outcome and `depends_on: []` planning posture.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block the planning contract. Ratification must choose the registered certificate event name and certification provider, define per-mode health and parity thresholds, specify the authoritative-run success predicate, and identify the retained rollback artifacts. Those choices may tighten the policy but may not weaken the phase-004 14-day/five-run minimum, fail-closed verification, evidence preservation, or single-writer rollback sequence.
<!-- /ANCHOR:questions -->
