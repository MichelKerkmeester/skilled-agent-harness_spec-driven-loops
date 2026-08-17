---
title: "Feature Specification: Skill Benchmark - Rollback & Mode Gate"
description: "Plan the Skill Benchmark mode's rollback switch and independent mode gate for migration to the typed event-ledger substrate. The mode owns skill scenario runs and scoring over the deep-improvement-common backbone, with fail-closed authority-cutover controls, a bounded rollback window, sealed artifacts, and a certificate that permits the mode to exit into phase 014."
trigger_phrases:
  - "skill benchmark rollback mode gate"
  - "skill-benchmark authority cutover rollback"
  - "skill benchmark migration gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Verified HEAD suite and reconciled rollback-gate completion evidence"
    next_safe_action: "Use this completed additive-dark leaf as phase-014 gate evidence"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark - Rollback & Mode Gate

> Phase adjacency under `007-skill-benchmark` (grouping order, not a runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/007-skill-benchmark/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Skill Benchmark mode over the deep-improvement-common backbone) |
| **Origin** | Phase 013 mode-and-lane-migrations, mode 007 `skill-benchmark`, rollback and mode-gate workstream |
| **Depends on** | `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts` are LANDED as additive-dark, non-authoritative substrate; sibling adjacency remains navigation rather than authority |
| **Consumes** | Planned certificate/receipt, resume-adapter, and required phase-009 shadow-parity evidence from `004` through `006`, plus deep-improvement-common mode 004 contracts, the real transition gateway, and the fencing coordinator |
| **Inputs** | 036 parent spec, `manifest/phase-tree.json`, and findings registries from 036/002 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Skill Benchmark evaluates skill scenario runs and scoring, but its migration must not turn a benchmark score into an
authority decision without preserved treatment identity, execution evidence, and rollback control. The research inputs
require a within-task, within-executor paired contrast; separate discovery, loading, instruction adherence, and verified
outcome stages; negative controls for near-neighbor and noise skills; environment and dependency compatibility metadata;
constraint coverage alongside outcome lift; and a versioned effect certificate with a validity domain rather than a
leaderboard row. Those measurements must remain reproducible when the mode moves from legacy behavior to the typed ledger.

This phase plans the mode-specific safety boundary after `006-shadow-parity`: a fail-closed ROLLBACK SWITCH for the
authority-cutover path, a bounded rollback window with explicit evidence and expiry, and an independent Skill Benchmark
GATE. The gate certifies that shadow parity is green, scenario and scoring artifacts are sealed, and a mode certificate is
emitted before this mode exits into phase 014. The phase is planning only; it does not authorize a live cutover.

The schema, reducer/projection, and sealed-artifact leaves are already LANDED but remain additive-dark and
non-authoritative. This Planned leaf consumes their contracts and the later receipt, resume, and parity evidence without
allowing any predecessor output to become an authority decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Skill Benchmark typed scenario-run and scoring contract layered on the deep-improvement-common services from mode 004.
- Scenario identity and treatment arms for off/auto/forced/placebo or their approved equivalent, paired task/executor contrasts, near-neighbor and noise-skill controls, and compatibility metadata.
- Stage-separated observations for discovery, loading, instruction adherence, trajectory compliance, deterministic outcome, dynamic reference evaluation, constraint coverage, cost, and latency.
- Skill-specific reducers that preserve raw observations, compute intention-to-treat lift and diagnostic mediation metrics, and reject invalid or unsupported comparisons.
- A content-addressed Skill Benchmark effect certificate containing the benchmark signature, validity domain, paired evidence, scoring-policy fingerprint, coverage evidence, and unresolved limitations.
- The Skill Benchmark ROLLBACK SWITCH: a fail-closed authority-cutover toggle, immutable decision record, bounded rollback deadline, stable legacy target, and recovery evidence requirements.
- The independent Skill Benchmark GATE: required phase-009 parity receipt, sealed artifact manifest, certificate verification, rollback readiness, scope checks, and phase-014 handoff evidence.
- An exception-safe caller boundary that authenticates the complete rollback request class, guards every caller-controlled digest and validator, snapshots validated primitives, and converts circular, non-finite, forbidden-prototype, non-plain, or wrong-shape input into a typed denial.
- Independent readiness derivation through the real `TransitionAuthorizationGateway` and deterministic ledger replay after the phase-009 parity receipt's integrity and bindings are re-verified.
- Tests and verifier fixtures for stale fingerprints, missing artifacts, partial scoring, incompatible environments, failed parity, expired windows, and rollback restoration.

### Out of Scope
- Re-implementing receipts, sealed-artifact storage, adjudication, typed budgets, gauges, locks, continuity identities, or other shared services owned by deep-improvement-common and phases 006-012.
- Replacing the shared fan-out/fan-in, event ledger, transition-authorization gateway, upcasters, or shadow-parity harness.
- Flipping production authority or removing legacy writers; phase 014 alone owns staged authority cutover after all mode gates pass.
- Defining the six sibling concerns in this mode workstream; this packet covers only Skill Benchmark rollback and mode-gate planning.
- Re-running the 036 research or inventing a new leaderboard metric outside the frozen mode contracts.
- Re-running the phase-009 parity harness, adopting its computed `exitStatus` as the gate verdict, or claiming provenance beyond the substrate-handle boundaries accepted by the golden 007 decision record.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill Benchmark reuses deep-improvement-common services | The mode contract names shared event, receipt, artifact, budget, gauge, lock, continuity, and parity services without duplicating their implementations |
| REQ-002 | Scenario runs have durable typed identity | Every run binds task, executor, skill treatment, registry context, environment/dependency compatibility, scenario recipe, seed, and benchmark signature to immutable event evidence |
| REQ-003 | Causal skill treatments are preserved | Paired within-task and within-executor contrasts separate intention-to-treat lift from invocation, loading, adherence, and outcome mediation; near-neighbor and noise-skill controls are represented |
| REQ-004 | Scoring is replayable and layered | Reducers retain raw observations, deterministic final-state checks, milestone diagnostics, dynamic reference results, constraint coverage, and scoring-policy fingerprints before deriving a result |
| REQ-005 | The mode emits one versioned effect certificate | The certificate binds provenance, paired evidence, validity domain, compatibility metadata, coverage, score deltas, uncertainty, cost, and limitations to content-addressed sealed artifacts |
| REQ-006 | ROLLBACK SWITCH never throws and fails closed | An absent, stale, conflicting, unauthorized, expired, unverifiable, circular, non-finite, forbidden-prototype, non-plain, or wrong-shape caller input selects the stable legacy path and records a typed refusal; every caller-input digest and validator is guarded and no exception escapes |
| REQ-007 | Rollback is bounded and evidence-driven | The switch records window start, expiry, stable target, cutover fingerprint, triggering evidence, recovery action, and verification result; unknown effects remain quarantined rather than retried blindly |
| REQ-008 | Phase-009 shadow parity is required evidence, not the gate verdict | The gate re-verifies receipt integrity, mode/frontier/manifest binding, and typed dispositions, ignores the receipt's computed `exitStatus` as authority, does not re-run the parity harness, and independently re-derives readiness through the real `TransitionAuthorizationGateway` plus deterministic ledger replay |
| REQ-009 | The gate hands off to phase 014 without hidden authority movement | The phase-014 handoff contains the certificate, artifact manifest, parity receipt, rollback decision record, and residual-risk disposition; only phase 014 may perform a later authority transition |
| REQ-010 | Cross-artifact evidence is complete and referentially verified | Every named reference resolves through the real substrate to its expected KIND and, where present, matches EPOCH, LIFECYCLE, freshness, real STATE, VISIBILITY/role redaction, and AUTHORITY liveness; existence or shape alone cannot pass |
| REQ-011 | Rollback-request authentication is structurally complete | A closed request schema classifies every field as gateway-authenticated, independently re-derived, cross-checked against verified evidence, a validated closed value, or a deterministic constant; unknown or inert fields fail closed, and only snapshotted validated values reach authorization and certificate emission |
| REQ-012 | Fencing and rollback anchoring use re-verified substrate state | A stale token is accepted only when it is a positive safe integer strictly below the canonical writer resource's durable coordinator high-water mark and newly issued rollback token; the requested rollback anchor must equal the anchor in the independently re-verified migration certificate |

The phase-009 receipt is mandatory evidence only. The gate authenticates its integrity, mode, frontier, manifest, and typed dispositions, then independently replays the deterministic ledger and asks the real transition gateway to evaluate locally re-derived evidence. The receipt's computed `exitStatus` never becomes the verdict, and this leaf does not re-run the parity harness.

The complete rollback request is authenticated structurally before authorization. Every named reference must resolve through the real substrate and satisfy its kind, epoch/lifecycle/freshness/state, visibility, and authority obligations. Stale-writer denial compares the caller-attested predecessor token with the coordinator's durable high-water mark and newly issued rollback token; rollback anchoring compares the request with the independently re-verified migration certificate. The accepted limits on retained-store observation, lifecycle-label semantics, health/resume/window/risk authenticity, and historical lease identity come from the golden leaf's [decision record](../../001-deep-research/007-rollback-and-mode-gate/decision-record.md). Their provenance must be verified before propagation, and phase 014 must correlate those bounded sources before relying on the readiness certificate.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Skill Benchmark mode plan references deep-improvement-common services as dependencies and adds only scenario- and scoring-specific logic.
- **SC-002**: A typed scenario matrix proves paired skill treatments, executor/task matching, negative controls, compatibility metadata, and stage-separated outcomes.
- **SC-003**: Raw scenario observations and score components replay under a pinned benchmark signature and scoring-policy fingerprint.
- **SC-004**: A content-addressed Skill Benchmark effect certificate is sealed with validity-domain, coverage, uplift, uncertainty, provenance, and limitation fields.
- **SC-005**: The ROLLBACK SWITCH has a fail-closed default, bounded rollback window, stable legacy target, explicit expiry, and auditable recovery evidence.
- **SC-006**: The independent Skill Benchmark GATE refuses missing, stale, partial, conflicting, or unsealed evidence and treats phase-009 parity as required evidence rather than the verdict.
- **SC-007**: The phase-014 handoff is complete while phase 014 remains the sole staged authority-cutover owner.
- **SC-008**: Malformed request objects never throw; class-wide authentication, referential-integrity checks, independent gateway/replay derivation, strict coordinator supersession, and rollback-anchor equality all fail closed with typed evidence.
- **SC-009**: The phase checklist's P0 verifier rows pass on the exact candidate commit without unexpected tracked mutation.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is treating absolute assisted-task score as skill value. The mode must preserve paired contrasts and
stage-level mediation so executor strength, retrieval success, loading, adherence, and outcome are not conflated. A second
risk is allowing stale skills, environments, graders, or treatment recipes to share a certificate; every such component
belongs in the benchmark and replay fingerprints. A third risk is allowing a benchmark gate to authorize itself: the
mode gate may certify migration readiness, but the shared transition-authorization gateway and phase 014 control live
authority.

The schema, reducer/projection, and sealed-artifact predecessors are LANDED additive-dark; certificate, resume, and parity
evidence remains Planned. Caller-supplied health, historical lease, retention, resume, window, or risk evidence may look
internally consistent without real source handles, so the gate preserves the golden 007 decision-record boundaries and
requires phase-014 correlation against authoritative stores and coordinator history.

Dependencies are the frozen shared mode contracts from phase 012; deep-improvement-common mode 004; the typed ledger and
transition gateway from phases 006-007; compatibility, shadow parity, and rollback services from phase 011; durable
fan-out/fan-in and projections from phases 009-011; predecessor `006-shadow-parity`; the phase-013 write-set conflict
graph; and the existing packet-033 behavior benchmark harness extended for skill treatments. The parent program's
ordering invariant requires deep-improvement-common before this mode's variant-specific work.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact shared artifact-sealing and certificate-signing interface is frozen by mode 004 and which fields are mode-owned?
- What minimum paired sample and effective coverage thresholds make the Skill Benchmark certificate decision-grade for each validity domain?
- Which rollback triggers are hard vetoes, which are advisory, and which require an explicit transition-authorized recovery event?
- How is the bounded rollback window measured across paused runs, crashed workers, expired leases, and mixed-version replay?
- Which phase-014 consumer contract names the required handoff fields while preserving the independent authority transition?

These questions are planning inputs for execution against the pinned shared contracts. No question permits a permissive
fallback, an unbounded rollback window, or a duplicated deep-improvement-common service.
<!-- /ANCHOR:questions -->
