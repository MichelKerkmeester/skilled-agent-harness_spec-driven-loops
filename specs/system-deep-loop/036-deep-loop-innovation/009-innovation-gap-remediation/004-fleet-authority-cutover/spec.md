---
title: "Feature Specification: Fleet Authority Cutover"
description: "Plan the serial cutover of the seven remaining mode roots onto the typed ledger, prove five production boundaries per mode, preserve rollback windows, and retire legacy writers only after mode-scoped zero-use telemetry."
trigger_phrases:
  - "fleet authority cutover"
  - "remaining mode root cutover"
  - "legacy writer zero-use retirement"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "opencode"
    recent_action: "Authored the planned fleet authority cutover contract"
    next_safe_action: "Confirm the pilot receipt and inventory seven live mode boundaries"
    blockers:
      - "Predecessor 003-pilot-mode-cutover must pass before fleet execution"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which live adapter symbol owns each target mode's canonical write boundary?"
      - "What ratified interval and workload prove zero legacy use per mode?"
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Fleet Authority Cutover

> Phase adjacency under `009-innovation-gap-remediation`: predecessor `003-pilot-mode-cutover`; successor `005-closeout-and-drift-reconcile`. The predecessor is a hard execution dependency, not merely navigation order.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/004-fleet-authority-cutover |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Fleet rollout child of the innovation-gap-remediation packet |
| **Depends on** | `003-pilot-mode-cutover` passing with a verified pilot receipt and reusable rollback evidence |
| **Successor** | `005-closeout-and-drift-reconcile` |
| **Gap closure** | Remaining F3/F4 slices and recommendations rec4/rec5 supplied by the phase brief |
| **Authority posture** | One target mode may change authority at a time; all other not-yet-cut-over modes remain legacy-authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program architecture requires an additive, dark-first migration followed by per-mode authority cutover behind
rollback windows and legacy-writer retirement only after measured zero use
(`../../goal.md:23-29`). The frozen runbook identifies eight ordered roots, from `deep-research` through
`deep-alignment` (`../../goal.md:326-343`), and the authority-flip contract requires a separate selector record,
epoch, evidence set, and blast radius for each mode
(`../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:149-168`).
The predecessor proves the pattern on the first root. This phase must apply that pattern to the seven roots left by
the verified pilot receipt without converting serial cutover into a batch transition.

The phase brief reports two residual gaps: no composition evidence for the 72 mode-specific recommendations and an
empty production-boundary matrix. Those exact gap measurements are **inferred planning inputs** because the gap
analysis was not persisted for this run. What is confirmed is that the immutable recommendation ledger assigns 72
adopted rows to phase 013
(`../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:125-135`).
Implementation must therefore reproduce the row-to-mode composition inventory and the matrix baseline before claiming
either gap closed.

The runtime already contains the dark cutover seam. `AuthorityFlipCoordinator.requestCutover` rejects multi-mode
requests, derives predecessors from the durable registry, requires mode binding, and runs fail-closed identity and
policy checks before preflight or durable writes
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:108-151`).
It then prepares, appends, compare-and-swaps, and reconciles a pending transition
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:256-288`,
`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:345-409`).
The phase purpose is to wire and prove that established pattern at every remaining live root, not to invent a second
authority mechanism.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the predecessor's pilot receipt, derive the exact residual target set, and freeze the remaining order as
  `deep-review`, `deep-ai-council`, `deep-improvement-common`, `agent-improvement`, `model-benchmark`,
  `skill-benchmark`, and `deep-alignment`. If the pilot receipt names a different completed root, stop and reconcile
  the target set against the eight-root manifest before any cutover.
- Inventory and cite each target mode's real canonical write boundary, authority selector integration point, legacy
  writer registration/call path, telemetry point, rollback switch, and shared-backend dependencies before editing it.
  A missing or uncited live symbol is a blocking inventory gap.
- Cut over exactly one target mode at a time through the typed authority ledger and the existing
  `AuthorityFlipCoordinator.requestCutover` path. Each transition uses fresh mode-bound parity, migration, rollback,
  identity, policy, candidate, epoch, and operator-approval evidence.
- Preserve an independent rollback window and rollback asset set for every cut-over mode. No later transaction may
  start while a cutover or rollback transaction is active; the prior mode must pass immediate stabilization first.
- Require current shadow parity for each mode before its authority transition. Any missing, stale, wrong-mode, or
  divergent certificate leaves that mode on legacy.
- Build and execute one five-boundary production test per mode: (1) live adapter/canonical-write selection,
  (2) transition authorization and verified identity/policy, (3) authorized ledger append plus durable authority
  publication and recovery, (4) post-flip canonical dark write with stale-legacy denial and sibling-mode isolation,
  and (5) live rollback, restart, reconciliation, and re-cutover readiness.
- Reproduce the 72-row composition inventory from the immutable ledger and map every applicable adopted row to a
  target mode, an executed production-boundary row, or an explicit owned non-applicability rationale.
- Instrument mode-scoped legacy live-writer use before removal, prove positive controls, then observe zero qualifying
  use for the ratified interval and workload. Unknown or uninstrumented paths fail closed.
- Retire only the eligible mode's live legacy writer registrations and calls after its rollback window and zero-use
  gate close. Retain historical readers, schemas, upcasters, projections, evidence, and rollback assets as required.
  Shared helpers remain until every dependent mode is eligible and their final removal has its own manifest row.
- Emit a complete production-boundary matrix, mode cutover receipts, rollback-window evidence, telemetry reports,
  retirement manifests, and recommendation-composition mapping for successor closeout.

### Out of Scope
- Re-executing or relabeling the predecessor pilot, changing the eight-root order without a reconciled manifest
  amendment, or cutting over two modes in one request or transaction.
- Replacing the event envelope, transition-authorization gateway, append-only ledger, authority registry, selector,
  cutover coordinator, parity protocol, or rollback state machine with a parallel mechanism.
- Inventing mode-adapter symbols, telemetry emitters, production test counts, observation durations, or workload
  sufficiency before implementation inventory and operator ratification.
- Retiring archival readers, decoders, schemas, upcasters, projections, historical fixtures, or shared helpers still
  used by an uncut-over or non-eligible mode.
- Treating a pre-cutover certificate, unit test, dry run, elapsed timer, or absence of telemetry as proof of a live
  authority transition, rollback-window closure, or zero legacy use.
- Performing packet-wide drift reconciliation or final epic closeout; successor `005-closeout-and-drift-reconcile`
  owns those actions.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The residual fleet is derived from durable evidence | The verified pilot receipt is subtracted from the frozen eight-root order, yielding exactly seven unique target roots in order; any mismatch blocks execution and is reconciled before a mode changes authority |
| REQ-002 | Cutover is serial and mode-scoped | Each request names one mode, only one cutover or rollback transaction is active, the selected mode alone changes epoch and route, and all sibling authority records remain byte-identical during that transition |
| REQ-003 | Shadow parity and migration evidence are fresh per mode | Before each flip, the selected mode has current zero-divergence parity, eligible in-flight-state evidence, rollback assets, candidate identity, and exact epoch bindings; missing, stale, unresolved, or cross-mode evidence denies the request |
| REQ-004 | Every transition uses the typed authorized-ledger path | Live wiring reaches the existing cutover coordinator, authorization gateway, authorized append seam, durable authority registry, and recovery protocol; no global flag, direct legacy bypass, or second authority store can publish dark authority |
| REQ-005 | Identity, policy, proof, epoch, and fence state fail closed | The production construction supplies independently resolved identity, matches the certificate's registered policy tuple, and rechecks current head, epoch, proof freshness, and writer fence before commit; null, partial, stale, or mismatched facts produce no authority mutation |
| REQ-006 | Every target passes its five-boundary production test | For each of seven modes, all five declared boundaries execute on one bound candidate with positive and negative controls, recorded commands and results, no skipped boundary, and no unexplained production-state mutation |
| REQ-007 | The 72-row composition gap is closed by reproducible mapping | A fresh inventory verifies the immutable phase-013 adoption set and maps every applicable row to one target mode plus concrete production evidence or an owned, justified non-applicability disposition; counts and source digests are recorded rather than copied from the phase brief |
| REQ-008 | Rollback remains real and independently evidenced | Each mode has an open, mode/epoch-bound rollback window and a live drill that restores legacy at a new epoch, denies stale writers after restart, reconciles effects, and preserves events and receipts before the mode can advance toward retirement |
| REQ-009 | Zero-use telemetry is proved, not assumed | Each legacy live-writer path is inventoried and instrumented, positive controls fire before the interval, the ratified workload exercises dynamic, resume, retry, replay, repair, rollback, subprocess, and shared-backend routes that apply, and the interval reports zero qualifying use and zero unknown paths |
| REQ-010 | Legacy retirement is gated and minimal | A mode's live legacy writer registrations/calls are removed only after its window and telemetry gates pass under a separately approved manifest; historical readers and still-shared helpers remain, and the actual deletion diff equals the approved mode slice |
| REQ-011 | Evidence is complete for closeout | The final matrix has seven mode rows by five boundaries, all rows are green, all target modes select the typed ledger, retirement dispositions are explicit, and successor `005-closeout-and-drift-reconcile` can verify the result without reconstructing mutable process state |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A verified pilot receipt plus the frozen order produces seven unique target modes with no skip, duplicate,
  reorder, or batch transition.
- **SC-002**: All seven target modes are in their approved typed-ledger authority state with one durable transition
  event, monotonic epoch, mode-bound selector record, and retained rollback evidence per mode.
- **SC-003**: The production-boundary matrix contains 35 required rows (seven modes by five boundaries), and every row
  is green on its bound candidate with no skip, waiver, or unexplained mutation.
- **SC-004**: A reproduced recommendation inventory accounts for every applicable phase-013 adoption with a target,
  production evidence, or an explicit owned non-applicability rationale; the result, not the unpersisted gap estimate,
  supplies the final count.
- **SC-005**: Every legacy writer retirement has positive-control evidence, a completed mode-scoped zero-use interval,
  zero unknown paths, a closed required rollback window, separate approval, and an exact manifest-matching diff.
- **SC-006**: Historical readers and required schemas, upcasters, projections, receipts, certificates, and rollback assets
  remain available, while static and runtime checks find no retired live writer route.
- **SC-007**: The successor receives a green fleet matrix, mode receipts, telemetry and retirement evidence, the
  composition map, and explicit residuals with owners.

**Given** the pilot receipt confirms the first root and the residual order, **When** the fleet coordinator admits a
target, **Then** exactly that mode may enter a cutover transaction and no later mode starts before immediate
stabilization or rollback completes.

**Given** a target lacks fresh parity, migration, identity, policy, epoch, fence, rollback, or operator evidence,
**When** its transition is requested, **Then** the request fails closed with no ledger event, selector publication, or
sibling-mode change.

**Given** one mode has changed authority, **When** its five-boundary production test runs, **Then** a real canonical dark
write succeeds, stale legacy and stale dark epochs are denied, rollback survives restart, and every other mode remains
on its prior route and epoch.

**Given** a legacy writer appears unused, **When** retirement eligibility is evaluated, **Then** deletion remains
blocked until positive controls, workload coverage, zero-use telemetry, rollback-window evidence, and the approved
manifest all match the exact mode and candidate.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The hard predecessor is `003-pilot-mode-cutover`; this phase cannot safely derive the residual fleet or reuse the
cutover pattern until the pilot supplies a verified transition, rollback, production-boundary, and evidence receipt.
The successor is `005-closeout-and-drift-reconcile`, which consumes this phase's final matrix and residual ledger.

The main runtime dependencies are the per-mode authority selector and cutover contract
(`../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:80-97`),
the existing coordinator's durable predecessor/order, identity, policy, pending-transition, append, and CAS behavior
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:108-151`,
`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:256-288`),
and the transition gateway's default-deny boundary
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:540-571`).
The generic gateway checks identity only when an `identityResolver` is configured
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:747-751`),
whereas the cutover coordinator requires its own resolver and denies unresolved identity before durable work
(`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:48-84`,
`../../../../../.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:291-317`).

Key risks are cross-mode authority bleed through shared backends, stale evidence authorizing a changed candidate,
crash splits between ledger and registry publication, telemetry blind spots producing false zero use, deletion of a
shared helper while another mode still depends on it, and treating the reported gap counts as verified facts. The
mitigations are durable predecessor derivation, one-mode transactions, per-mode epochs and evidence, pending-transition
reconciliation, positive telemetry controls, a closed-world delete/retain manifest, shared-helper-last ordering, and a
fresh composition/matrix inventory before implementation claims closure.

The write-boundary history also requires all new ledger writes to stay behind the fenced authorized seam; the grounded
build contract identifies the gateway-only boundary and standing bypass checks
(`../../005-blocker-closeout/004-durable-write-boundaries/build-spec.md:97-124`,
`../../005-blocker-closeout/004-durable-write-boundaries/build-spec.md:152-174`).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete live adapter and persistence-boundary symbol owns authority selection for each of the seven target
  roots? Implementation must answer this with a cited call-site inventory before wiring; no symbol is inferred here.
- What observation duration, workload sufficiency rule, positive-control cadence, and delayed-consumer horizon will the
  operator ratify for mode-scoped zero-use telemetry?
- How many reversible rollback windows may overlap after immediate stabilization? The safe planning default is one,
  consistent with the program runbook (`../../goal.md:241-250`), until the operator approves a larger cap.
- Which shared deep-improvement helpers remain live until all common and variant modes pass retirement eligibility?
  The dependency inventory, not naming similarity, must answer this before deletion.
<!-- /ANCHOR:questions -->
