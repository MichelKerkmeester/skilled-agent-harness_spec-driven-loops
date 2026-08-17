---
title: "Tasks: Fleet Authority Cutover"
description: "Planned tasks for serial cutover of seven remaining mode roots, five-boundary production verification, rollback-window evidence, and telemetry-gated legacy-writer retirement."
trigger_phrases:
  - "fleet authority cutover tasks"
  - "remaining seven mode rollout tasks"
  - "legacy writer retirement tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed fleet cutover, production proof, and writer retirement"
    next_safe_action: "Verify the pilot receipt and inventory the residual fleet"
    blockers:
      - "Predecessor 003-pilot-mode-cutover must pass before fleet execution"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Mode-specific live symbols and telemetry policy require setup inventory"
    answered_questions: []
---
# Tasks: Fleet Authority Cutover

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

- [ ] T001 Verify `003-pilot-mode-cutover` evidence and derive exactly seven residual roots from the frozen order; stop on any identity, order, candidate, epoch, rollback, or receipt mismatch
- [ ] T002 Inventory and cite each target's real canonical write selector, persistence boundary, legacy writer registrations/calls, telemetry points, rollback switch, authority root, and shared-backend/helper dependencies without inventing symbols
- [ ] T003 Re-run the immutable recommendation-ledger verifier and map every applicable phase-013 adoption to one target root or an owned explicit non-applicability disposition; record source digests and produced counts
- [ ] T004 Freeze the residual fleet manifest, predecessor relations, shared authority domains, per-mode evidence identities, and allowed active-window policy
- [ ] T005 Define the seven-by-five production-boundary matrix and its positive, negative, crash/restart, cleanup, candidate-binding, and no-skip evidence schema
- [ ] T006 Define the legacy live-writer inventory, historical-reader retention set, shared-helper dependency map, telemetry event schema, positive controls, unknown-path denial, workload coverage, observation interval, and delayed-consumer horizon
- [ ] T007 Capture baseline authority records, epochs, selector routes, ledger heads, live writer paths, matrix state, telemetry controls, test/build results, and tracked workspace state before implementation
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Wire only the T002-confirmed `deep-review` live boundary to the existing typed selector and `AuthorityFlipCoordinator.requestCutover`; refresh evidence, approve one request, cut over, and pass its five production boundaries
- [ ] T009 After T008 immediate stabilization, wire and cut over only `deep-ai-council` through the same verified pattern with independent evidence, epoch, rollback assets, production matrix row set, and approval
- [ ] T010 After T009 immediate stabilization, wire and cut over only `deep-improvement-common`; prove its shared services change no variant authority record or route
- [ ] T011 After T010 immediate stabilization, wire and cut over only `agent-improvement` with a separate selector record, certificate, epoch, five-boundary evidence set, and rollback window
- [ ] T012 After T011 immediate stabilization, wire and cut over only `model-benchmark` with independent evidence and no inherited common/variant authority fact
- [ ] T013 After T012 immediate stabilization, wire and cut over only `skill-benchmark` with independent evidence and sibling record byte-isolation checks
- [ ] T014 After T013 immediate stabilization, wire and cut over only `deep-alignment` as the final residual root and prove its review-loop coupling stays inside its inventoried write set
- [ ] T015 For every T008-T014 transition, verify independently resolved identity, registered certificate-matching policy, current head/epoch/proof/fence state, authorized append, recoverable registry publication, stale-writer denial, and immutable receipt persistence
- [ ] T016 Execute a live rollback drill for every target, preserving events and receipts while proving admission freeze, writer fencing, state/effect reconciliation, legacy restoration at a new epoch, restart recovery, stale-epoch denial, and fresh-evidence re-cutover readiness
- [ ] T017 Instrument all T002-inventoried legacy live-writer paths before any removal, run positive controls, and exercise each mode's applicable dynamic, resume, retry, replay, repair, rollback, subprocess, and shared-backend routes
- [ ] T018 Evaluate mode-scoped rollback-window and zero-use eligibility from signed, candidate/epoch/interval-bound evidence; deny missing, empty, stale, duplicate, cross-mode, unknown-path, or unexercised-route inputs
- [ ] T019 Obtain separate approval for each eligible mode's exact delete-manifest slice, remove only its live legacy writer registrations/calls in residual order, and compare the actual diff to the approved slice
- [ ] T020 Retain historical readers, schemas, upcasters, projections, fixtures, receipts, certificates, rollback assets, and any shared helper still needed by another mode; remove shared helpers only after all dependents pass and their final manifest row is approved
- [ ] T021 Update the append-only production matrix and recommendation-composition ledger after each mode, preserving prior failures, rollback history, evidence identities, and explicit residual ownership
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Verify the pilot plus seven fleet targets account for all eight frozen roots in order, with zero skipped, duplicate, reordered, or batch transition
- [ ] T023 Verify all seven target authority records select the typed ledger at their approved epochs and every transition has one durable event, selector record, candidate binding, rollback chain, and immutable receipt set
- [ ] T024 Execute all 35 production-boundary cells and require zero skip or waiver; inject stale identity, policy, proof, epoch, fence, cross-mode, concurrent-transition, process-death, and restart faults
- [ ] T025 Reconcile ledger events, pending-transition markers, registry state, selectors, writer fences, rollback windows, health/parity/replay/receipt/budget signals, and telemetry by exact mode, epoch, candidate, and interval
- [ ] T026 Verify every retirement positive control fired before its zero-use interval, every declared workload route executed, zero qualifying use and zero unknown paths were observed, and no eligibility relied on missing telemetry
- [ ] T027 Verify every actual writer-removal diff equals its approved manifest, static/runtime inventories find zero retired live paths, retained archival surfaces remain readable and cannot append, and shared helpers were removed last
- [ ] T028 Re-run recommendation composition from the immutable source and require every applicable row to cite target production evidence or an owned explicit disposition; report final produced counts without reusing the inferred gap baseline
- [ ] T029 Run runtime TypeScript verification, targeted per-mode suites, five-boundary production tests, rollback/restart tests, telemetry controls, writer/reader inventories, comment hygiene, and scoped diff checks from the final candidate
- [ ] T030 Run strict validation for this phase and assemble the successor handoff with commands, exit codes, candidate and source digests, matrix, receipts, telemetry, retirement manifests, composition mapping, and owned residuals
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with candidate-bound evidence
- [ ] Seven of seven residual roots are cut over serially on the typed ledger
- [ ] All 35 production-boundary rows are green with zero skips or waivers
- [ ] Recommendation composition is reproduced from immutable sources with no unknown applicable row
- [ ] Every retired legacy writer has positive-control, zero-use, closed-window, approval, and exact-diff evidence
- [ ] Historical readers and required shared/rollback evidence remain available and non-authoritative
- [ ] Successor `005-closeout-and-drift-reconcile` accepts the immutable handoff without reconstructing mutable state
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Program cutover and retirement runbook**: See `../../goal.md:326-492`
- **Per-mode authority contract**: See `../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:80-97` and `:149-168`
- **Recommendation allocation evidence**: See `../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:125-146`
- **Identity and ownership limits**: See `../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md:60-76`
- **Durable write boundary**: See `../../005-blocker-closeout/004-durable-write-boundaries/build-spec.md:97-124`
- **Cutover coordinator**: See `../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:108-151`, `:256-288`, and `:345-409`
- **Authorization gateway**: See `../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:540-571` and `:747-751`
<!-- /ANCHOR:cross-refs -->
