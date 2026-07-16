---
title: "Implementation Plan: Cross-Mode Closures"
description: "Implementation Plan for phase 005 of the 009 shared-mode-contracts-and-fixtures parent: hoist recurring mode behavior into reusable closures with typed override seams before phase 013."
trigger_phrases:
  - "cross-mode closures implementation plan"
  - "deep-loop shared closure plan"
  - "phase 012 closure implementation"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped five shared closures to runtime ports and mode override seams"
    next_safe_action: "Reconcile closure owners with interface versions and phase-007 service contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-Mode Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime, shared synthesis, and phase-013 mode adapters |
| **Change class** | Shared closure modules, typed adapters, and parity fixtures |
| **Execution** | Freeze against the phase-004 interface and phase-007 service ports; retain additive-dark authority |

### Overview
The plan creates one reusable implementation for each recurring cross-mode responsibility, then gives every phase-013 workstream a thin mode adapter. The five closures are evidence, receipts/effects, adjudication, budgets, and projections. Each closure accepts the frozen mode context and a mode-owned strategy, invokes the phase-007 port, and returns a typed result with evidence and provenance. The mode retains its schema, reducer fields, policy thresholds, artifact/certificate meaning, and convergence decision. The plan deliberately does not unify parser dialects or erase the deep-improvement variant boundaries documented in the shipped shared library.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent phase outcome, `depends_on: []`, and adjacency to `001-shared-mode-interfaces` and `003-mixed-version-fixtures` are recorded.
- [ ] The frozen `ModeContract` surface from `001-shared-mode-interfaces/spec.md` is reconciled with the phase-007 service child contracts and `manifest/phase-tree.json`.
- [ ] A recurrence matrix names every repeated evidence, receipt, adjudication, budget, and projection path across all eight phase-013 workstreams.
- [ ] The closure boundary distinguishes shared mechanics from mode schemas, reducers, policies, artifacts, certificates, and stop decisions.
- [ ] Shipped runtime seams and intentional divergences are classified before any helper is moved or copied.
- [ ] Closure write sets and handoff outputs are named without taking ownership from `004-write-set-conflict-graph`.

### Definition of Done
- [ ] One typed closure implementation exists for each of the five shared behavior families.
- [ ] All eight phase-013 workstreams have adapters and explicit override rows; deep-improvement-common is reused by its three variants.
- [ ] Closure fixtures prove evidence, receipts, adjudication, budgets, projections, bypass refusal, and additive-dark parity.
- [ ] Phase 013 receives the closure catalog, override matrix, call-path inventory, and fixture handoff without lifecycle or authority changes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared closure context**: Define one immutable context with `modeId`, interface version, lifecycle event, continuity identity, sealed input references, service ports, budget scope, write set, legacy/shadow posture, correlation IDs, and mode strategy. The context is created by the mode adapter and cannot be widened by a closure override.
- **Evidence closure**: Normalize the `evidence-contract.ts` fields, attach verified sealed-artifact references, retain raw mode evidence and source locators, bind the replay/configuration identity, and return `confirmed`, `inferred`, `hypothesis`, or `unknown` evidence status. It must preserve a mode's evidence payload rather than reclassifying domain claims.
- **Receipt/effect closure**: Use the phase-007 receipt and effect-recovery port for intent-before-effect, observed completion, recovery classification, and boundary certification. Compose the shipped `executor-audit.ts`, `receipt-crypto.ts`, `post-dispatch-validate.ts`, atomic state, and JSONL repair seams behind one adapter. Legacy receipts remain readable or parity inputs; no mode emits a second new receipt schema.
- **Adjudication closure**: Build the shared request from sealed candidates and a mode strategy, invoke blinded/counterfactual adjudication, retain raw judgments, probes, ties, minority evidence, and independence signals, and return the phase-007 verdict. The closure never decides review closure, council stop, promotion, model selection, or skill lift.
- **Budget closure**: Convert mode estimates and existing council/fan-out guard inputs into the phase-007 typed budget envelope, reserve all required dimensions before dispatch, settle from receipt-backed usage, and report typed exhaustion or uncertainty. `cost-guards.cjs` remains a compatibility input, not a second budget authority.
- **Projection closure**: Append or observe the authorized event, run deterministic stream-fold gauge updates, and apply mode-declared projection reducers under the phase-007 lock/fence and identity ports. The closure returns replay provenance and projected bytes; mode-specific fields remain owned by the mode reducer.
- **Shared versus mode-specific boundary**:

| Shared closure responsibility | Mode-owned strategy or override |
|-------------------------------|---------------------------------|
| Evidence normalization, sealed-reference verification, provenance envelope | Evidence field vocabulary, claim semantics, artifact/certificate kind, required source locators |
| Intent/result/recovery ordering, receipt identity, idempotency, certification port | Effect adapter parameters, boundary kind, mode result code, retry policy within the shared safety limits |
| Blinding, counterfactual registration, raw-score retention, verdict envelope | Candidate construction, rubric, required probes, quorum interpretation, domain transition |
| Typed reservation, settlement, exhaustion, and admission refusal | Cost estimate, budget scope, eligible work, escalation request |
| Authorized event-to-projection sequencing, gauge fold, replay provenance | Event schema, reducer ownership, projection fields, mode-specific derived views |

- **Override rules**: Overrides are registered strategies with typed inputs and outputs. They may select mode data, policy parameters, and domain reducers; they may not replace authorization, sealed reads, receipt ordering, fence validation, budget admission, raw-evidence retention, or fail-closed errors. A missing override uses an explicit `unsupported` result, never a guessed default.
- **Adapter topology**: The eight manifest rows call the same closure package. `004-deep-improvement-common` owns the shared evaluator/promotion/benchmark mechanics once; `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` supply only variant schemas and policies. `002-deep-review` and `008-deep-alignment` reuse the declared review-loop closures while retaining their own findings, authority, and standard-conformance decisions. `001-deep-research`, `003-deep-ai-council`, and the common improvement lane register their own domain strategies.
- **Existing seam placement**: Reuse `shared/synthesis/resource-map.cjs` for synthesis output, `runtime/lib/deep-loop/continuity-thread.cjs` for continuity strategy input, `runtime/lib/deep-loop/permissions-gate.ts` for permission decisions, `runtime/lib/council/multi-seat-dispatch.cjs` for seat-level outcome capture, `adjudicator-verdict-scoring.cjs` for compatibility evidence, and `convergence.cjs`/`cost-guards.cjs` as legacy parity inputs. Do not treat any one existing helper as the complete new closure contract.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the phase parent, `001-shared-mode-interfaces/spec.md`, `manifest/phase-tree.json`, and each phase-007 service contract; record the non-negotiable ports and additive-dark invariants.
- Inventory repeated call paths in the eight phase-013 mode packets and the shipped `runtime/lib/deep-loop/`, `runtime/lib/council/`, `runtime/scripts/`, `shared/`, and deep-improvement common library.
- Build the recurrence and override matrix, including one owner, inputs, outputs, write set, failure result, and parity source for every row.
- Mark intentional divergence such as deep-improvement parser dialects and mode-local convergence formulas so the hoist does not change behavior.

### Phase 2: Implementation
- Define the immutable closure context, typed strategy interfaces, common result envelope, provenance fields, and explicit unsupported/failed outcomes.
- Implement the evidence closure and attach verified artifacts, raw evidence, claim status, scope, and replay inputs.
- Implement the receipt/effect closure and route intent, result, recovery, and boundary receipt emission through phase-007 ports and the shipped audit seams.
- Implement the adjudication closure and mode strategy registry; preserve raw scoring, counterfactual probes, effective-independence evidence, and fail-closed verdict classes.
- Implement the budget closure and admission adapter; map current council/fan-out limits to typed reservations and receipt-backed settlement without creating a second authority.
- Implement the projection closure and replay-provenance envelope; apply stream-fold gauges and mode-owned reducers under shared locks, fencing, and continuity identities.
- Add adapters for all eight workstreams, with deep-improvement-common shared by its three variants and review closures shared by deep-review and deep-alignment where the matrix permits.
- Add closure call-path guards and parity hooks. Keep mixed-version corpus authoring and the executable conflict graph in the successor/sibling phases.

### Phase 3: Verification
- Verify each closure has one implementation owner and every mode row calls it through the typed adapter.
- Verify shared closures preserve phase-006 authorization and every phase-007 service invariant without copying service logic.
- Verify mode overrides cannot bypass sealing, receipt ordering, adjudication blinding, budget admission, projection fencing, or additive-dark authority.
- Verify repeated inputs and fixed service responses produce deterministic closure outputs, replay provenance, and typed errors.
- Verify shipped council/deep-loop outputs remain parity-observable and legacy authority remains unchanged.
- Verify the phase-013 handoff includes the catalog, override matrix, call-path inventory, fixture names, and write-set inputs.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest-derived recurrence matrix proves one owner and one adapter row for each closure and all eight workstreams |
| REQ-002 | Evidence fixtures compare equivalent mode payloads, sealed references, provenance, malformed partial contracts, and preserved raw evidence |
| REQ-003 | Receipt fixtures inject crashes before intent, after intent, after outcome, and during recovery; retries return one receipt and ambiguous effects stop |
| REQ-004 | Adjudication fixtures require blinding, A/B and B/A, configured probes, raw judgments, and stable/unstable/inconclusive outcomes without local re-reduction |
| REQ-005 | Budget fixtures exercise atomic multi-dimensional denial, reservation races, receipt-backed settlement, exhaustion, stale pricing, and missing usage |
| REQ-006 | Projection fixtures compare full replay, incremental fold, fenced update, mode reducer output, and provenance under identical event prefixes |
| REQ-007 | Override fixtures attempt to bypass each safety port and require typed refusal; valid mode-specific strategies pass through the shared closure |
| REQ-008 | Adapter conformance runs all eight manifest rows, checks common-before-variant ordering, and asserts no duplicated closure implementation |
| REQ-009 | Shadow parity compares closure outputs with shipped evidence, council, deep-loop, and legacy projection behavior without changing decisions |
| REQ-010 | Determinism and handoff checks repeat closure calls, record fixture identifiers, and validate successor-consumable catalog and write-set inputs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The closure layer consumes the frozen contract in `001-shared-mode-interfaces/spec.md`, the parent outcome and sequencing rules in `../spec.md`, and the eight workstream rows in `../manifest/phase-tree.json`. Its service ports are defined by `../../007-shared-evidence-and-control-services/spec.md` and the child contracts for receipts/effect recovery, sealed artifacts, blinded adjudication, hierarchical budgets, stream-fold gauges, locks/fencing, and continuity identities. The shipped implementation anchors are `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/`, `.opencode/skills/system-deep-loop/runtime/lib/council/`, `.opencode/skills/system-deep-loop/shared/`, and `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/`. `003-mixed-version-fixtures` consumes closure inputs for old/new-state cases, while `004-write-set-conflict-graph` consumes closure ownership and write-set declarations; neither sibling changes this phase's closure boundary.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The closure layer is additive and reversible. If a closure changes parity or violates a mode invariant, disable that mode adapter's closure call through its phase-local compatibility switch, retain the legacy path as authority, and record the failed parity fixture. Revert only the closure module and its adapter commits; do not delete legacy receipts, projections, state, or artifacts. If a shared interface must change, publish a new closure/interface version with the old adapter retained and fail closed for unsupported consumers. No in-flight state migration, legacy-writer retirement, or authority cutover is permitted in this phase.
<!-- /ANCHOR:rollback -->
