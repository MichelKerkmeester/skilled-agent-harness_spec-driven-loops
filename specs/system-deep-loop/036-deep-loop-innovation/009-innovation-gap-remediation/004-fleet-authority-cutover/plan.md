---
title: "Implementation Plan: Fleet Authority Cutover"
description: "Implementation plan for serial typed-ledger cutover, five-boundary production proof, rollback-window governance, and telemetry-gated legacy-writer retirement across the seven remaining mode roots."
trigger_phrases:
  - "fleet authority cutover implementation plan"
  - "seven mode production boundary matrix"
  - "zero-use legacy writer retirement plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover"
    last_updated_at: "2026-08-14T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned serial fleet cutover and telemetry-gated retirement"
    next_safe_action: "Verify the pilot receipt and freeze the residual fleet inventory"
    blockers:
      - "Predecessor 003-pilot-mode-cutover must pass before fleet execution"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Live mode-adapter and telemetry symbols require implementation inventory"
    answered_questions: []
---
# Implementation Plan: Fleet Authority Cutover

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Seven remaining system-deep-loop mode roots and their canonical production write boundaries |
| **Change class** | Serial live authority wiring, production verification, rollback-window operation, and gated writer retirement |
| **Authority** | One selected mode changes at a time; all other pending roots remain legacy-authoritative |
| **Predecessor** | `003-pilot-mode-cutover` must provide a verified reusable pattern and residual-mode receipt |
| **Successor** | `005-closeout-and-drift-reconcile` consumes the final fleet matrix and residual ledger |

### Overview
Apply the pilot's proven pattern to the remaining seven roots in the frozen order. For each root, inventory its real
live boundaries, refresh parity and migration evidence, use the existing typed-ledger cutover coordinator, obtain
mode-specific approval, execute a recoverable transition, and pass a five-boundary production test. Keep rollback
assets and evidence until the mode's window closes. Instrument legacy writer use before deletion, prove positive
controls, complete a ratified zero-use interval, and retire only the approved mode-scoped live writer paths.

This plan does not accept the phase brief's `0/72` or empty-matrix measurements as independently verified baselines.
It first reproduces the immutable phase-013 recommendation allocation confirmed in
`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:125-135`
and then builds the production matrix from executed evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `003-pilot-mode-cutover` has a verified receipt covering live transition, five boundaries, rollback, evidence retention, and reusable failure handling
- [ ] The pilot receipt reconciles with the frozen eight-root order in `../../goal.md:326-343` and yields exactly seven residual targets
- [ ] Every target has a cited inventory of canonical write selection, legacy writer calls/registrations, telemetry points, rollback switch, persistence root, and shared dependencies
- [ ] The immutable recommendation ledger is reverified and its phase-013 adoption rows are mapped to target ownership without copying an unverified gap count
- [ ] Per-mode parity, migration, rollback, identity, policy, candidate, epoch, fence, and operator-approval evidence schemas are frozen
- [ ] The five-boundary matrix schema, test environment, negative controls, cleanup checks, and evidence locations are frozen
- [ ] Zero-use policy defines positive controls, qualifying events, unknown-path denial, workload coverage, duration, delayed-consumer horizon, and approval authority
- [ ] The delete/retain manifest distinguishes live writers from historical readers and shared helpers

### Definition of Done
- [ ] Seven unique target roots complete in the verified order with no skipped or batch transition
- [ ] Every target uses the typed authority ledger and retains one mode-bound transition, epoch, selector, and rollback evidence chain
- [ ] All 35 production-boundary rows are green on bound candidates with zero skips, waivers, or unexplained mutations
- [ ] The reproduced recommendation-composition map has no unknown or unowned applicable row
- [ ] Every retired live legacy writer has positive-control, zero-use, closed-window, approval, and exact-diff evidence
- [ ] Historical readers and required shared assets remain, and static/runtime checks find no retired live writer route
- [ ] The successor handoff contains the fleet matrix, receipts, telemetry, retirement manifests, composition map, and owned residuals
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Pilot receipt verifier**: validates the predecessor's mode, candidate, epoch, evidence, five-boundary result,
  rollback outcome, and reusable pattern before deriving the residual fleet. It fails on a missing, stale, duplicate, or
  wrong-mode pilot fact.
- **Residual fleet manifest**: subtracts the verified pilot from the frozen eight-root order and binds the resulting
  seven entries, predecessor relations, shared-backend domains, and per-mode evidence identities into one immutable
  execution manifest.
- **Live-boundary inventory**: resolves real adapter, canonical persistence, legacy writer, telemetry, rollback, and
  shared-helper symbols before edits. Only `AuthorityFlipCoordinator.requestCutover` and
  `TransitionAuthorizationGateway.authorize` are named in advance because they were confirmed in the inspected runtime
  (`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:108-151`,
  `../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:540-571`).
- **Mode cutover executor**: composes current mode evidence, independently resolved identity, the registered policy,
  expected durable epoch, and one operator-approved request through the existing coordinator. Durable predecessor
  derivation and pending-transition reconciliation remain owned by the coordinator rather than caller claims.
- **Five-boundary production harness**: runs the same five declared boundaries for each mode while allowing
  mode-specific fixtures and entry points from the inventory. It records candidate, BASE, commands, cases, skips,
  before/after authority state, durable events, receipts, cleanup, and verdict per cell.
- **Rollback-window monitor**: binds execution, health, parity, replay, receipt, budget, and reconciliation signals to
  the mode, authority epoch, candidate, observation interval, and rollback assets. It denies closure on absent, stale,
  duplicate, cross-mode, or unresolved signals.
- **Legacy-use telemetry and retirement gate**: inventories every live writer route, separates archival readers,
  proves instrumentation with positive controls, records qualifying use and unknown paths, and emits a mode retirement
  decision only after zero use and rollback eligibility.
- **Evidence and composition ledger**: maps verified phase-013 recommendation rows to target modes and production
  evidence, then supplies the successor with an append-only matrix and explicit residual dispositions.

The execution order is fixed: verify pilot -> freeze residual fleet -> inventory live boundaries -> reproduce
recommendation ownership -> instrument telemetry -> refresh one mode's evidence -> approve one request -> cut over ->
verify durable state -> run five boundaries and live rollback -> stabilize and monitor -> evaluate zero use -> approve
and retire eligible mode writers -> repeat -> remove shared helpers last -> hand off. Any failed step stops that mode at
the earliest safe authority state and prevents advancement.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Verify the predecessor receipt and derive exactly seven residual modes from the frozen order.
- Reproduce the phase-013 recommendation inventory from the immutable ledger and assign target ownership or explicit non-applicability.
- Inventory each mode's live adapter, persistence boundary, legacy writer, telemetry, rollback, and shared-helper symbols; stop on any uncited boundary.
- Freeze the residual fleet manifest, five-boundary matrix, per-mode evidence schema, zero-use policy, delete/retain manifest, and rollback/open-window policy.
- Capture baseline authority records, ledger heads, live writer routes, telemetry positive controls, production matrix state, and tracked workspace state.

### Phase 2: Implementation
- Wire the inventoried canonical write boundary for one mode to the existing selector and cutover coordinator without changing sibling routes.
- Refresh mode-bound shadow parity, migration, rollback, identity, policy, candidate, epoch, fence, and operator evidence immediately before each transition.
- Execute the seven target transitions serially in residual manifest order, recording pending-transition recovery and sibling-state isolation.
- Run the five-boundary production test and live rollback drill for each target; use fresh evidence and approval for any re-cutover after restoration.
- Instrument every inventoried legacy live-writer path, prove positive controls, exercise the ratified workload, and retain telemetry through each mode's eligibility interval.
- Approve and remove only eligible mode-scoped legacy writer registrations/calls; preserve historical readers and defer shared-helper removal until all dependents pass.
- Maintain the recommendation-composition ledger and production matrix after each mode without rewriting prior evidence.

### Phase 3: Verification
- Verify seven of seven target roots hold the intended typed-ledger authority state and the pilot plus fleet account for all eight frozen roots.
- Verify all 35 matrix cells execute and pass, including stale-identity, stale-policy, stale-proof, stale-epoch, stale-fence, crash/restart, rollback, and sibling-isolation negatives.
- Reconcile transition events, registry records, authority epochs, selector routes, rollback windows, receipts, and telemetry by mode and candidate.
- Verify positive controls preceded every zero-use interval and every applicable runtime route was exercised with zero qualifying use and zero unknown path before retirement.
- Compare each actual writer-removal diff to its approved manifest; prove required archival readers and shared assets remain and cannot perform canonical writes.
- Rerun the recommendation inventory and require every applicable row to resolve to concrete fleet evidence or an owned explicit disposition.
- Run type/build, targeted per-mode tests, production-boundary tests, static writer/reader inventories, comment hygiene, scoped diff checks, and strict packet validation from the final state.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Pilot-subtraction test verifies one completed pilot plus seven unique residual entries equals the frozen eight-root set and order; wrong, duplicate, absent, or extra pilot identities fail |
| REQ-002 | Single-mode admission, concurrent request, out-of-order request, and sibling-record byte comparison tests prove one transaction and one-mode blast radius |
| REQ-003 | Mutate each parity, migration, rollback, candidate, epoch, or asset binding independently and require denial with zero transition event or selector change |
| REQ-004 | Integration tests trace a live mode request through the inventoried adapter, existing coordinator, gateway, authorized append, registry publication, and recovery; direct/global bypass inventory must be empty |
| REQ-005 | Null, partial, throwing, forged, stale, or certificate-mismatched identity/policy/proof/epoch/fence fixtures fail before durable authority mutation |
| REQ-006 | A seven-by-five manifest requires executed count to equal 35 with zero skip; each row records candidate, inputs, command, result, before/after state, receipts, cleanup, and verdict |
| REQ-007 | Re-run the immutable-ledger verifier, derive the phase-013 set, and reject missing, duplicate, unowned, or evidence-free applicable mappings; final counts come from produced artifacts |
| REQ-008 | Per-mode live rollback drills prove admission freeze, writer fencing, effect reconciliation, legacy restoration at a new epoch, stale-writer denial after restart, preserved events, and clean re-cutover readiness |
| REQ-009 | Positive controls must emit expected events before the clock starts; workload tests cover every applicable declared route, and injected unknown or hidden paths block eligibility |
| REQ-010 | Retirement tests compare actual deletions to approved mode slices, find zero remaining retired live registrations/calls, retain named readers/assets, and prove archival surfaces cannot append |
| REQ-011 | Evidence-schema and replay tests reconstruct every matrix and retirement verdict from immutable artifacts, while successor intake rejects incomplete or mutable-only handoff state |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hard predecessor is `003-pilot-mode-cutover`; no fleet wiring or authority transition begins until its receipt
passes. The frozen program order and retirement policy come from `../../goal.md:326-343` and
`../../goal.md:441-492`. The typed selector and per-mode isolation contract come from
`../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:80-97`
and `:149-168`. The immutable recommendation source and confirmed 72-row phase-013 allocation come from
`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:125-146`.

Runtime execution depends on the confirmed `AuthorityFlipCoordinator` order, identity, policy, append, CAS, and
pending-transition recovery contract in
`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:108-151`,
`:256-288`, and `:345-409`; the authorization boundary in
`../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:540-571`;
and the fenced write-boundary contract in `../../005-blocker-closeout/004-durable-write-boundaries/build-spec.md:97-124`.
Mode-specific adapter, telemetry, rollback-switch, and shared-helper symbols remain intentionally unnamed until the
implementation inventory confirms them.

Downstream `005-closeout-and-drift-reconcile` depends on complete immutable receipts rather than narrative completion.
Operator approvals are external dependencies for every authority transition, every re-cutover after a live rollback,
and every legacy-writer deletion manifest.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is mode-scoped and must remain available throughout each governed window. Before a transition, retain the
mode's legacy adapter, source anchor, prior authority record, classified in-flight-state policy, rollback switch,
reconciliation procedure, writer-fence evidence, and all certificates and receipts. If preflight, authorization,
append, publication, production testing, stabilization, or monitoring fails, stop admissions where required and leave
or restore that mode to legacy at a new monotonic epoch. Other mode records and routes must remain unchanged.

A crash between durable steps uses the existing pending-transition reconciliation rather than deleting an event or
guessing authority. A live rollback preserves ledger events and receipts, fences the dark writer, reconciles admitted
work and effects, restores legacy, restarts, proves a bounded legacy write, and denies stale dark and legacy epochs.
Returning the mode to dark requires fresh mode-bound evidence and a new approval.

Legacy-writer retirement is separately irreversible at the working-tree/runtime surface. Before deletion, preserve a
source restoration anchor and exact delete/retain manifest, rehearse restoration, and verify the telemetry and window
evidence. A mismatch or later legacy-use signal halts deletion. If removal has occurred, source restoration may restore
the code path, but authority epochs, state, evidence compatibility, and delayed consumers must be reassessed before it
is enabled; rollback is never represented as a blind file revert. Historical readers and immutable evidence are not
deleted by this phase.
<!-- /ANCHOR:rollback -->
