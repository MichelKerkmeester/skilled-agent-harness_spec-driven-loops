---
title: "Checklist: Agent Improvement - Resume Adapter"
description: "Blocking verification checklist for the Agent Improvement Resume Adapter: sealed-ledger reconstruction, AgentIR continuity, idempotent re-entry, uncertain-effect handling, common-service reuse, and dark-mode safety."
trigger_phrases:
  - "agent improvement resume adapter checklist"
  - "agent improvement replay verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined blocking resume, lineage, and idempotency checks for Agent Improvement"
    next_safe_action: "Run the sealed-ledger replay and duplicate-delivery matrix after implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Agent Improvement - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Agent Improvement Resume Adapter. The verifier runs against a
candidate SHA and pinned BASE, records the sealed-ledger corpus, event-range and checkpoint digests, reducer/upcaster/common
service identities, commands, exit codes, projection fingerprints, receipt identities, and authority-write assertions. Any
missing, ambiguous, stale, leaked, unsupported, or non-evaluable evidence blocks the phase; no zero-test or zero-event result
is accepted as a pass.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The common certificate, receipt, replay-fingerprint, effect-recovery, and resume contracts are frozen and their identities are recorded in the candidate report
- [ ] CHK-002 [P0] Agent Improvement event, reducer, projection, and sealed-reference inputs are available from sibling phases `001` through `003`
- [ ] CHK-003 [P1] The continuity-ladder matrix covers run, AgentIR, candidate, behavior experiment, evaluation, scoring, canary, promotion, and terminal or blocked states
- [ ] CHK-004 [P2] Candidate SHA, BASE SHA, event-range digest, checkpoint digest, reducer/upcaster identity, and common-service fingerprints are pinned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Resume reads sealed ledger events and immutable references only; no current AgentIR file, process memory, mutable checkpoint, evaluator asset, clock, randomness, network, or hidden fixture is consulted
- [ ] CHK-006 [P0] Agent Improvement adds only variant resume bindings; evaluator, canary, certificate, receipt, promotion, sealing, replay, and effect-recovery semantics are reused from deep-improvement-common
- [ ] CHK-007 [P1] Logical event, candidate, branch, effect, resume-request, and attempt identity rules are explicit and no event or receipt is mutated during replay
- [ ] CHK-008 [P1] Changes are scoped to the resume adapter and its fixtures; no adjacent sibling concern, authority cutover, or legacy-writer cleanup is included
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] The same sealed event range folds to byte-identical AgentIR lineage, candidate frontier, behavior coverage, common-service status, receipt references, and resume fingerprint in independent processes
- [ ] CHK-010 [P0] Full replay and valid checkpoint-plus-tail replay produce identical projections; malformed, stale, incompatible, or partial checkpoints fail closed
- [ ] CHK-011 [P0] Every continuity-ladder row resolves to a sealed evidence set, reducer projection, explicit action, and reason code; unmapped or ambiguous state returns `REJECT` or `QUARANTINE`
- [ ] CHK-012 [P0] Exact duplicate resume requests return the existing re-entry receipt without a second event application or external effect
- [ ] CHK-013 [P0] Reusing a request key with changed payload, manifest, or replay fingerprint fails closed and does not inherit prior success
- [ ] CHK-014 [P0] Candidate and AgentIR lineage preserves component/locus IDs, inherited clauses, parent candidates, operator IDs, profile scope, first-divergent traces, and raw trial references across interruption
- [ ] CHK-015 [P0] Completed branch-local candidate, behavior-family, and evaluator work remains reusable while only missing compatible work is re-executed
- [ ] CHK-016 [P0] Crash injection before effect start, after effect start, after receipt, and before logical commit yields no duplicate logical commit; missing receipts remain `UNKNOWN`
- [ ] CHK-017 [P0] Manifest, AgentIR closure, evaluator capsule, fixture epoch, executor, tool schema, topology, reducer, and upcaster changes produce the declared reuse, revision, fork, quarantine, or rejection result
- [ ] CHK-018 [P0] Candidate-facing reads redact hidden fixtures, exact terminal evidence, evaluator internals, and promotion authority; access violations are blocking evidence
- [ ] CHK-019 [P0] Critical family regression, canary veto, stale artifact, evaluator leak, insufficient evidence, and rollback ambiguity cannot become a successful resume or promotion state
- [ ] CHK-020 [P0] The adapter emits no authority write, legacy-state mutation, candidate dispatch, evaluator mutation, or production promotion before phase 017
- [ ] CHK-021 [P1] Common evaluator, canary, certificate, receipt, promotion, redaction, and effect-recovery fixture identities match the deep-improvement-common contract without a variant fork
- [ ] CHK-022 [P1] Duplicate, late, reordered, missing, extra, unsupported-version, and malformed event fixtures preserve prior evidence and return deterministic mismatch identities
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] The resume state matrix maps every Agent Improvement event family and in-flight state to its ledger inputs, reducer output, re-entry action, and blocking reason
- [ ] CHK-024 [P1] The handoff report exposes the replay corpus, idempotency evidence, unknown-effect evidence, redaction evidence, and dark-authority assertion for `006-shadow-parity`
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-025 [P0] An unknown or incomplete external effect cannot be auto-retried as success, and a quarantined lineage cannot authorize its own recovery or promotion
- [ ] CHK-026 [P1] No hidden evaluator fixture, exact terminal score, private rationale, mutable policy, or current-process state crosses the candidate-facing resume boundary
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-027 [P2] The phase outcome, common-service reuse boundary, continuity-ladder matrix, and unresolved execution decisions are reflected in the packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Resume adapter and fixture changes land in dependency-closed, path-scoped commits without modifying sibling phase folders or generated metadata by hand
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the candidate report proves ledger-only deterministic reconstruction,
AgentIR lineage preservation, idempotent re-entry, explicit unknown-effect handling, common-service reuse, and zero authority
mutation. The replay and checkpoint fingerprints must match, while every incompatible or non-evaluable case remains blocked.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms all P0 resume and dark-mode checks, the evidence report pins the corpus and service
identities, and `validate.sh --strict` passes for this folder with only tooling-generated metadata exclusions if applicable.
<!-- /ANCHOR:sign-off -->
