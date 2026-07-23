---
title: "Feature Specification: Deep Research - Rollback and Mode Gate"
description: "Implements the Deep Research mode's fail-closed rollback switch and independent migration gate over the typed event-ledger substrate while keeping authority with the legacy path until phase 014."
trigger_phrases:
  - "Deep Research rollback and mode gate"
  - "deep-research authority rollback switch"
  - "deep-research migration gate"
  - "mode 010 rollback window"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the fail-closed rollback switch and independent migration gate"
    next_safe_action: "Consume the readiness certificate in phase 014 without treating it as cutover authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Rollback and Mode Gate

> Phase adjacency under `013-mode-and-lane-migrations/001-deep-research` (independent planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-research mode migration) |
| **Origin** | Final Deep Research child in the phase-013 mode migration fan-out |
| **Depends on** | `[]` in the mode workstream contract; sibling adjacency is navigation only |
| **Outcome** | A fail-closed rollback switch and independent exact-evidence migration gate for the typed event-ledger migration |
| **Inputs** | Parent `036-deep-loop-innovation/spec.md`; `manifest/phase-tree.json`; `findings-registry.json`; `findings-registry-modes.json`; Deep Research phase 009 shadow-parity contract; shared transition and rollback policy |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research is a stateful autonomous loop with the lifecycle `init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff`. Its migration cannot end at a typed schema or a green shadow comparator. The mode needs a separate, fail-closed decision boundary that proves the ledger path is safe to enter the staged authority process and a rollback control that can restore the legacy path without deleting evidence or allowing the failing lineage to authorize its own recovery.

The parent program requires an additive, dark, non-authoritative substrate, shadow parity before authority changes, one mode at a time during cutover, and a rollback window before legacy retirement (`036-deep-loop-innovation/spec.md`). The shared transition policy fixes deny-by-default authorization, one writer per mode, monotonic authority epochs, a minimum rollback window of 14 calendar days and five successful authoritative executions, and certificate-backed non-destructive rollback (`004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`). Phase 009 supplies the mode's event-for-event parity receipt; it explicitly does not authorize a cutover.

The research inputs identify why this gate must be evidence-led. Deep Research requires a versioned executable plan, claim-evidence-contradiction history, pre-reducer evidence admission, dependency-aware resume invalidation, and a synthesis view over immutable claim history (`findings-registry-modes.json`). The runtime findings require an external recovery authority, explicit `transition_authorized` or `transition_denied` decisions, immutable health alarms, and precommitted rollback or quarantine rules (`findings-registry.json`). This phase implements the mode-local rollback switch, the independent gate that evaluates those inputs, and the certificate handoff into phase 014; it does not implement a second ledger, reducer, shadow harness, or authority cutover.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Research authority and rollback switch contract with explicit fail-closed states, default behavior, guarded transitions, monotonic epoch handling, and an external transition-authorization dependency.
- A bounded rollback window for the mode, inheriting the shared minimum of 14 calendar days and five successful authoritative executions, with extension rules for low traffic, unresolved parity, replay drift, receipt gaps, health alarms, budget violations, and state-reconciliation uncertainty.
- A non-destructive rollback runbook: freeze admission, fence the ledger writer, classify and reconcile in-flight work through the resume adapter, restore legacy authority at a new epoch, preserve all ledger events and sealed artifacts, and emit a rollback certificate.
- An independent Deep Research mode-gate checklist that requires green shadow parity, sealed mode artifacts, complete receipts and certificates, deterministic replay, resume evidence, and a clean failure/uncertainty disposition before producing a mode-migration certificate.
- Certificate and receipt fields bound to the exact candidate SHA, shared-contract digests, mode schema/reducer/projection versions, parity fixture set, stream and artifact digests, authority state, rollback anchor, window state, and verifier outcome.
- Mode-gate fault fixtures covering missing or stale evidence, unexplained parity differences, malformed seals, certificate mismatch, replay nondeterminism, crash-resume ambiguity, source or claim drift, health degeneration, budget exhaustion, stale epochs, duplicate requests, and low-traffic window extension.
- A phase-014 handoff contract that distinguishes this mode's migration certificate from the later authority cutover and cutover certificate.

### Out of Scope
- Flipping Deep Research authority from legacy to the ledger path; phase 014 alone performs staged authority cutover.
- Reimplementing the shared event envelope, transition gateway, upcasters, reducers, projections, sealed-artifact primitives, receipt primitives, resume adapter, or shadow-parity harness; this phase consumes their contracts and evidence.
- Removing or rewriting the legacy emitter, legacy readers, iteration Markdown, archival packet behavior, or any historical JSONL evidence.
- Choosing final convergence thresholds, changing evidence-admission semantics, changing next-focus selection, or adding research capabilities outside the assigned mode recommendations.
- Defining rollback policy for another mode, batching mode cutovers, or allowing Deep Research to self-authorize unquarantine, rollback, verifier replacement, or certificate acceptance.
- Treating a final report, terminal score, or a parity receipt alone as proof that the mode gate is green.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rollback switch is mode-scoped and fail-closed | Missing configuration, unknown state, stale authority epoch, absent gate certificate, gateway failure, or incomplete evidence leaves legacy authority active and denies ledger authority |
| REQ-002 | Rollback transitions are externally authorized | The mode cannot authorize its own rollback, unquarantine, verifier replacement, or authority restoration; every transition carries policy version, mode, epoch, request digest, evidence digest, reason, and decision ID |
| REQ-003 | The rollback window is bounded and cannot close early | The window remains open until both 14 calendar days and five successful authoritative executions complete, whichever is later; unresolved evidence or low traffic extends it |
| REQ-004 | Rollback is non-destructive and certificate-backed | Admission freezes, the ledger writer is fenced, in-flight work is classified, legacy authority resumes at a new epoch, no event or artifact is deleted, and a rollback certificate records the result |
| REQ-005 | The independent mode gate requires the complete Deep Research evidence set | Green phase-009 shadow parity, sealed mode artifacts, valid receipts and certificates, deterministic replay, resume evidence, and zero unexplained semantic divergence are all required |
| REQ-006 | The gate preserves fail-closed uncertainty | Missing, stale, contradictory, malformed, unsupported, or indeterminate evidence yields `blocked`, `not_ready`, or `rollback_required`; it never yields a successful migration certificate |
| REQ-007 | Gate evidence is reproducible and exact-SHA bound | The mode certificate binds candidate SHA, BASE, shared-contract and write-set digests, event/schema/reducer/projection versions, fixture IDs, stream/artifact digests, verifier identity, and all dispositions |
| REQ-008 | The gate covers the complete mode lifecycle | Init, gather/analyze, convergence, synthesis, memory-save handoff, crash-resume, source refresh, evidence quarantine, contradiction, and incomplete-run behavior are represented in the evidence matrix |
| REQ-009 | The mode gate is independent of the authority decision | A mode-gate verifier evaluates immutable receipts and sealed references through the shared transition boundary; a passing mode gate only permits phase 014 to consider cutover |
| REQ-010 | Phase 014 receives an unambiguous handoff | The emitted mode-migration certificate names readiness, rollback anchor, window policy, unresolved risks, and exact evidence without claiming that authority has moved or the rollback window has closed |
<!-- /ANCHOR:requirements -->

### Rollback and mode-gate acceptance contract

Deep Research is migration-ready only when the independent gate can verify the complete mode evidence chain without consulting mutable reports as authority. The chain starts with a parity-green receipt from phase 009, continues through sealed typed artifacts and certificate/receipt references for the full lifecycle, and ends in a mode-migration certificate bound to the exact candidate and shared-contract fingerprints. Any missing link is a blocking result.

The rollback switch is evaluated before every authority-sensitive admission and recovery transition. It accepts only a current, externally authorized request whose mode, epoch, policy version, and evidence digest match the persisted authority record. A trigger inside the open window freezes new ledger admissions, fences stale writers, and routes in-flight work through the declared resume/reconciliation policy. It restores the legacy path at a new epoch only after the transition gateway authorizes the restoration and then records a rollback certificate. The switch never truncates the ledger, rewrites sealed artifacts, or treats non-reproduction as proof of safety.

| Gate input | Required evidence | Blocking disposition |
|------------|-------------------|----------------------|
| Shadow parity | Phase-009 receipt with zero unexplained semantic differences across lifecycle, failure, resume, synthesis, and handoff fixtures | `blocked` on missing receipt, unexplained diff, nondeterministic replay, or untyped tolerance |
| Sealed artifacts | Deep Research mode artifacts have valid seals, references, digests, schema versions, and no stale or mixed-version dependency | `not_ready` on missing, malformed, expired, or mismatched seal |
| Certificates and receipts | Every side effect, reducer checkpoint, handoff, and mode decision has a verifiable receipt or explicit safe failure | `blocked` on missing, duplicate, stale, or unverifiable receipt |
| Lifecycle and resume | Init through memory-save plus crash, source-refresh, quarantine, contradiction, and incomplete-run fixtures preserve typed state and fail-closed recovery | `blocked` on lost identity, unsafe reuse, duplicate effect, or silent convergence |
| Rollback readiness | External authorization path, writer fencing, new-epoch legacy restore, retained evidence, and rollback rehearsal are proven | `rollback_required` when any recovery step is unavailable or unproven |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A mode-scoped rollback switch is specified with deny-by-default behavior, explicit triggers, external authorization, writer fencing, epoch changes, and non-destructive reconciliation.
- **SC-002**: The rollback window is specified as at least 14 calendar days and five successful authoritative executions, with extension and closure evidence that cannot be satisfied by elapsed time alone.
- **SC-003**: The independent Deep Research mode gate requires green shadow parity, sealed artifacts, complete certificates and receipts, deterministic replay, resume coverage, and full-lifecycle evidence before issuing a migration certificate.
- **SC-004**: Every missing, stale, contradictory, malformed, or nondeterministic input fails closed and keeps legacy authority active; the mode cannot self-authorize recovery.
- **SC-005**: Phase 014 receives an exact-SHA-bound mode-migration certificate that proves readiness without performing or implying an authority cutover.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Self-authorized recovery** - A quarantined or degraded Deep Research lineage could approve its own rollback or unquarantine. Mitigation: keep recovery authority outside the mode and require the shared transition gateway plus an independent verifier.
- **False green from terminal-only evidence** - A matching final report could hide claim admission, contradiction, branch, receipt, resume, or memory-save drift. Mitigation: require phase-009 event and projection parity plus lifecycle fixtures.
- **Rollback window closes under low traffic** - Fourteen days can elapse without five meaningful authoritative executions. Mitigation: close only after both conditions and extend for insufficient sample coverage or unresolved evidence.
- **Split-brain after rollback** - A stale ledger writer could continue accepting events after legacy restoration. Mitigation: fence the writer, increment the authority epoch, and reject stale-epoch transitions at the gateway.
- **Unsafe in-flight reconciliation** - Effects or memory handoffs may be unknown at the rollback boundary. Mitigation: consume resume-adapter decisions, preserve unknown states, and block when adapter capability or receipt evidence is insufficient.
- **Certificate freshness drift** - Shared contracts, write-set ownership, schema versions, or reducer fingerprints may change after gate evidence is produced. Mitigation: bind every gate output to exact digests and reopen on relevant drift.
- **Dependencies**: phase-012 shared mode contracts and write-set conflict graph; Deep Research siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, `004-certificates-and-receipts`, `005-resume-adapter`, and `006-shadow-parity`; shared transition and rollback policy; phase 014 cutover contract; and the spec-kit validator. The mode workstream declares no hard child dependency; sibling references are navigation only.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No questions remain open. The implementation resolved the planning questions as follows.

- The real `TransitionAuthorizationGateway` remains the only authorization source; the switch does not project or persist independent authority.
- Registered Deep Research lifecycle artifacts are read through the sealed-artifact store, while the existing offline run-certificate verifier checks receipt completeness and deterministic replay.
- Non-healthy and non-recovered health aggregates block rollback readiness. Unresolved evidence and low traffic extend the window.
- Only a `trusted-completion` under `new_authoritative_reversible` with a valid certificate digest counts toward the five-run minimum. Incomplete and abstained runs do not count.
- The real in-flight classification manifest decides reconciliation eligibility. Missing or invalid classification blocks the switch and gate.
- `DeepResearchModeMigrationCertificate` is the readiness handoff. Its closed fields state `authorityMutation: false`, `rollbackWindowClosed: false`, and `cutoverCertificate: false`; phase 014 performs any authority transition separately.
<!-- /ANCHOR:questions -->
