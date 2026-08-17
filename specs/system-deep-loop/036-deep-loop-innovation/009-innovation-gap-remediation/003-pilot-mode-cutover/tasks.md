---
title: "Tasks: Pilot Mode Authority Cutover"
description: "Tasks for the deep-research production authority wiring, shadow-parity gate, five-boundary matrix, and rollback-window drill."
trigger_phrases:
  - "pilot mode authority cutover tasks"
  - "deep-research cutover implementation tasks"
  - "five-boundary production test tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/003-pilot-mode-cutover"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed pilot wiring, production matrix, and rollback work"
    next_safe_action: "Confirm predecessor gates and complete the production-root census"
    blockers:
      - "Predecessor 002-substrate-identity-fail-closed must pass before live wiring"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts"
    completion_pct: 0
    open_questions:
      - "Which shared construction seam owns both deep-research command variants?"
      - "What rollback-window policy will be declared?"
    answered_questions:
      - "deep-research is the sole pilot mode"
---
# Tasks: Pilot Mode Authority Cutover

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

- [ ] T001 Verify `../002-substrate-identity-fail-closed` is complete for the exact pilot root, including mandatory deployment identity, policy binding, append fencing, and fresh lock ownership
- [ ] T002 Freeze `deep-research` as the sole pilot and record the exact candidate SHA, BASE SHA, policy tuple, actor/capability binding, authority roots, and one-open-window policy
- [ ] T003 Census both deep-research command variants, reducer writes, canonical state appenders, ledger adapters, retries, resume/repair paths, subprocess routes, and rollback entry points
- [ ] T004 Name and cite the one real shared production construction seam; do not create implementation work until its imports, durable roots, writer paths, and consumers are confirmed
- [ ] T005 Capture the current composition and production-matrix baseline, distinguishing independently verified counts from the gap brief's inferred `0/72` and empty-matrix claims
- [ ] T006 Verify current mode-gate, migration, cutover-certificate, rollback-asset, and zero-divergence shadow-parity evidence against the frozen candidate
- [ ] T007 Declare the rollback-window duration, restoration-time objective, health triggers, retained assets, operator approval stop, and isolated production-shaped test roots
- [ ] T008 Freeze the five-row production test manifest for selector admission, intent persistence, producer death, fresh-process restart, and authority CAS plus rollback
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Add the smallest shared production composition adapter used by both deep-research command variants and construct the existing registry, ledger, gateway, policy, identity-resolver, coordinator, and selector dependencies
- [ ] T010 Route every canonical deep-research admission and persistence attempt through `selectAuthorityRoute`, with explicit legacy and typed-ledger branches and no implicit fallback
- [ ] T011 Connect current shadow-parity and predecessor evidence to cutover preflight so missing, stale, divergent, partial, or wrong-candidate evidence stops before intent persistence
- [ ] T012 Connect the production request path to `AuthorityFlipCoordinator.requestCutover` without bypassing its single-mode, identity, policy, pending-intent, authorized-append, or CAS checks
- [ ] T013 Preserve and expose durable pending intent so a new process can complete or abort a transition from registry and ledger facts without the original request object
- [ ] T014 Bind the existing deep-research rollback gate to `AuthorityRegistry.compareAndSwapRollback` on the same durable authority record
- [ ] T015 Preserve the legacy adapter, rollback anchor, historical readers, migration/classification evidence, events, receipts, and stale-writer denial assets for the full declared window
- [ ] T016 Add candidate-bound cutover/rollback evidence capture and before/after byte digests for every non-pilot authority record and shared-backend namespace
- [ ] T017 Add guards that reject operator/live paths from the production-boundary test and prevent this phase from exposing a fleet cutover action
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run the selector-admission row through both production command variants across legacy, shadow, cutover-ready, reversible-dark, rollback-pending, malformed, wrong-mode, stale-policy, and stale-digest cases
- [ ] T019 Run the intent-persistence row and prove the complete CAS intent is durable before append, malformed intent fails closed, and no authority is published from marker state alone
- [ ] T020 Run the producer-death row with real child-process termination after intent persistence and after ledger append but before registry CAS
- [ ] T021 Run the fresh-process row with empty in-memory state and prove deterministic resume, clean abort when no event landed, and fail-loud conflict on inconsistent durable facts
- [ ] T022 Run the authority-CAS row and prove one deep-research event, one epoch increment, one dark canonical route, and byte-identical non-pilot records
- [ ] T023 Run the rollback row and prove admission freeze, dark-writer fencing, rollback-pending denial, legacy restoration at a newer epoch, stale dark/legacy denial, and preserved event/artifact counts
- [ ] T024 Execute bounded dark and legacy canaries around the rollback drill, measure restoration against the declared objective/window, and record process exits, heads, epochs, digests, and verdict
- [ ] T025 Inject missing/stale parity, unresolved identity, policy mismatch, stale proof/fence, CAS conflict, malformed marker, duplicate request, and cross-mode fixtures; verify zero partial authority mutation
- [ ] T026 Verify the executed five-row matrix equals the frozen manifest with zero skipped rows and all evidence binds to one candidate/BASE pair
- [ ] T027 Run runtime TypeScript verification, targeted unit and production-root suites, unauthorized-append and selector-bypass scans, and scoped diff/status checks
- [ ] T028 Run strict spec validation and reconcile planned-vs-implemented packet evidence only after implementation actually completes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete with candidate-bound evidence
- [ ] All requirements in `spec.md` are met through the real deep-research production root
- [ ] Shadow parity is green before the exact pilot flip and every fail-closed negative control leaves legacy authoritative
- [ ] The five-boundary production matrix is green with zero skipped rows
- [ ] The rollback drill restores legacy within the declared window and passes the legacy canary
- [ ] Stale dark and stale legacy writers are denied after rollback
- [ ] Every non-pilot mode remains byte-identical and legacy-authoritative
- [ ] Runtime gates, scoped final-state checks, and strict packet validation pass
- [ ] No fleet cutover, legacy retirement, or automated operator-authority mutation is included
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent remediation packet**: See `../spec.md`
- **Program execution order and cutover runbook**: See `../../goal.md:326-424`
- **Per-mode authority contract**: See `../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md`
- **Dark/unwired implementation evidence**: See `../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/implementation-summary.md:119-129,169-173`
- **Coordinator**: See `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:5-11,61-81,108-147,256-280,345-409`
- **Selector**: See `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:62-109`
- **Registry forward/reverse recovery**: See `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-registry.ts:90-113,261-337,428-452`
- **Identity dependency evidence**: See `../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md:64-68`
- **Recommendation-ledger baseline**: See `../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:98-103,125-135`
<!-- /ANCHOR:cross-refs -->
