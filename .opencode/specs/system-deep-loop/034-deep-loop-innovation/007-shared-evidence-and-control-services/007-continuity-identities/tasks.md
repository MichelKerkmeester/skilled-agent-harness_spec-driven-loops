---
title: "Tasks: continuity identities"
description: "Tasks for stable continuity identity minting, ledger persistence, resume and handover restoration, cross-mode references, and replay verification."
trigger_phrases:
  - "continuity identities tasks"
  - "stable deep-loop identity tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Mapped implementation and verification tasks for durable continuity identities"
    next_safe_action: "Execute the runtime census and freeze identity fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Continuity Identities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin the phase-006 envelope, transition gate, event version, append idempotency, and replay cursor contracts on the candidate BASE
- [ ] T002 Inventory every shipped lineage, claim/finding, candidate, mode-session, resume, handover, fan-out, and graph identifier producer/consumer under `runtime/`
- [ ] T003 Freeze legacy fixtures and a lifecycle matrix for new, retry, resume, handover, restart, fork, and cross-mode reference semantics
- [ ] T004 Confirm the local child contract remains `depends_on: []` and document the inherited parent integration boundary without converting adjacency into dependency
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the versioned `lineage`, `claim`, `candidate`, and `mode_session` identity registry, opaque mint format, parser, kind checks, and typed errors
- [ ] T006 Add durable mint-request idempotency, collision handling, non-reuse enforcement, and retry-safe resolution through the transition-authorized append path
- [ ] T007 Add versioned identity-mint, alias-bind, relationship-bind, and cross-mode-reference events plus a deterministic replay fold
- [ ] T008 Thread stable refs through continuity reduction and logical mode-session state while separating attempt, iteration, label, path, timestamp, and content metadata
- [ ] T009 Persist and restore the typed identity frontier, ledger cursor, and replay fingerprint through resume and handover; reject unresolved or wrong-kind refs before dispatch
- [ ] T010 Add explicit `continues_from` and `forked_from` relationships for true restarts/forks while keeping retry/resume on the original logical identity
- [ ] T011 Add cross-mode typed-reference validation and boundary events that preserve the original entity ID and source provenance
- [ ] T012 Add a dark legacy alias observer for current session IDs, lineage labels/run IDs, graph IDs, finding fallbacks, candidate IDs, and text-derived continuity keys
- [ ] T013 Publish stable identity fixtures and consumer contracts for program phase 010 claim continuity and phase 014 per-mode authority cutover
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify: identity shape and kind safety — valid kinds round-trip; malformed, unknown-kind, and cross-kind substitutions fail closed
- [ ] T015 Verify: mint idempotency — crash/retry and concurrent duplicate requests return one accepted logical identity
- [ ] T016 Verify: stability — reorder, rename, path/text/timestamp change, and replay retain the original ID
- [ ] T017 Verify: resume and handover — the same frontier is restored; missing, ambiguous, stale, and wrong-kind refs stop before execution
- [ ] T018 Verify: lifecycle distinction — retry/resume keeps the ID; restart/fork mints one linked child without mutating or reusing the parent
- [ ] T019 Verify: cross-mode matrix — receiving modes resolve the source ID and cannot clone, remint, or change its kind
- [ ] T020 Verify: replay — identical authorized event prefixes reconstruct identical registry, alias, and relationship state; tampering fails explicitly
- [ ] T021 Verify: dark compatibility — legacy alias resolution matches shipped behavior and changes no authoritative runtime output
- [ ] T022 Run targeted unit/integration tests, build/typecheck gates, replay fixtures, and strict phase validation on the exact candidate SHA
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
