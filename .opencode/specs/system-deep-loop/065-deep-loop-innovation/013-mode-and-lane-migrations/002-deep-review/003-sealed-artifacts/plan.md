---
title: "Implementation Plan: Deep Review - Sealed Reference Artifacts (013 phase 002 child 003)"
description: "Implementation plan for binding Deep Review scope, per-dimension evidence, convergence witnesses, review-report outputs, and resume references to the shared seal-on-write and tamper-evident read contract."
trigger_phrases:
  - "deep review sealed artifacts implementation plan"
  - "deep-review seal-on-write plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Review seal boundaries and verified-read gates"
    next_safe_action: "Inventory Deep Review artifacts against the phase-009 shared contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-review (mode 002, child 003) |
| **Change class** | Mode-specific artifact registration and seal/read integration |
| **Execution** | Seal-on-write references across scope, dimension passes, adjudication, convergence, synthesis, resume, and save; additive-dark |

### Overview
Plan one Deep Review adapter over the shared phase-003 sealing primitives. The adapter maps the existing review lifecycle to
registered artifact kinds, seals exact canonical bytes at each boundary, binds ordered digest references into the shared
phase-009 review-loop contract, typed events, predecessor reducers, replay fingerprints, convergence evidence, and report
views, and verifies every reference before release to a consumer. The plan preserves candidate-first review, four configured
dimensions, required traceability protocols, nine legal-stop gates, orthogonal severity and evidential fields, and the
materialized `review-report.md` output. It consumes the shared sealed-reference contract and does not implement shared
storage, a second digest scheme, reducers, certificates, resume decisions, shadow parity, or authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-009 shared review-loop contracts and the executable write-set conflict graph are frozen for the Deep Review lane
- [ ] The mode artifact matrix names every scope/init, dimension-pass, candidate/adjudication, convergence, synthesis, resume, and save input/output
- [ ] Each matrix row identifies a shared artifact kind, canonicalization version, media type, and ordered reference role
- [ ] Shared seal-on-write and verified-read seams are available without changing the legacy authoritative loop
- [ ] Replay and shadow-parity consumers accept one ordered verified reference set rather than mode-local digests
- [ ] Candidate evidence, nine legal-stop gates, optional resource-map coverage, report outputs, and changed-input dispositions are explicit
- [ ] Typed failures, append-only supersession, legacy fallback refusal, and the additive-dark rollback switch are explicit

### Definition of Done
- [ ] Deep Review lifecycle artifacts are sealed and read only through the shared contract, with mode-gate fixtures green
- [ ] The dark path proves parity over identical verified inputs while legacy execution, report behavior, and authority remain unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared seal adapter**: accepts a typed Deep Review artifact request, delegates canonicalization, atomic publication, digest derivation, lifecycle handling, and verified reads to the phase-003 primitive, and exposes no alternate hash or blob identity.
- **Mode artifact registry**: registers the scope/reference set, dimension-pass evidence, candidate/adjudication packet, convergence witness, synthesis view, and resume/save handoff as Deep Review specializations of the shared descriptor.
- **Scope reference binder**: seals the target bytes or immutable target references, base/head or file set, review contract, dimensions, traceability protocols, context snapshot, capabilities, prompts, rubrics, and policy before the first pass.
- **Pass seal boundaries**: seal selected targets, depth/search ledger, deterministic diagnostics, raw analyzer/test/runtime observations, graph events, iteration markdown, JSONL delta, and candidate evidence before reducer or convergence consumption.
- **Candidate evidence binder**: binds intermediate path/data-flow facts, evidence classes, reproduction/refutation outputs, raw scores, confidence, impact, reachability, exploitability, evidence strength, and scope without collapsing them into P0/P1/P2.
- **Convergence and synthesis views**: seal one ordered state snapshot with coverage and nine gate results, then seal dashboard, optional resource-map coverage, findings-registry view, unresolved findings, verdict, and `review-report.md` as materialized outputs over predecessor projections.
- **Tamper-evident read path**: resolves exact digest references, recomputes returned byte length and digest, validates descriptor and artifact-kind compatibility, and releases no bytes on any failure.
- **Additive-dark integration**: seal or verification failure blocks new dark evidence, replay, parity, convergence promotion, report trust, or handoff promotion but leaves the legacy loop, state, output, and authority untouched until staged cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-009 shared review-loop contract and write-set conflict graph; verify predecessor `002-reducers-and-projections` owns findings, dashboard, strategy, and report projections.
- Inventory current Deep Review scope/config, target and diff references, context snapshot, dimension inputs, iteration files, JSONL records, graph events, findings registry, convergence gates, report sections, resource-map coverage, resume state, and continuity-save handoffs against the pinned baseline.
- Freeze the mode artifact-kind matrix, reference roles, canonicalization profiles, media types, stable session/generation/iteration identities, and ordered reference-set rules using the shared phase-003 primitive.
- Define typed seal/read failures, mutable-target and descriptor-drift dispositions, append-only supersession, changed-input handling, report/handoff refusal, and the additive-dark rollback switch.

### Phase 2: Implementation
- Register Deep Review scope, target snapshot, review-contract, context, capability, prompt/rubric, and replay-input artifact kinds through the shared sealer; reject path-only, alias-only, mutable cache, and unverified references at init.
- Add scope seal-on-write and bind one verified initial reference set before the first dimension dispatch.
- Add per-dimension seal-on-write and verified-read gates for selected targets, search/depth ledger, diagnostics, raw observations, graph events, iteration markdown, JSONL delta, and candidate evidence.
- Add immutable candidate/adjudication sealing for intermediate facts, evidence classes, reproduction/refutation outputs, raw scores, confidence, impact, reachability, exploitability, evidence strength, and evidence scope before P0/P1/P2 activation.
- Add a convergence witness binding one verified state and findings snapshot, dimension/protocol coverage, graph-convergence result, nine legal-stop gate results, and blocked-stop or recovery decision without redefining shared convergence policy.
- Seal the findings/dashboard materialized view, optional resource-map coverage, unresolved obligations, verdict metadata, `review-report.md`, and ordered input digest set after projection.
- Add resume-facing changed-input comparison and save/handoff references that preserve prior seals, identify affected finding/report views, and refuse trusted handoff evidence on failed reads.
- Bind mode references into existing typed events, predecessor reducers and projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling without changing shared primitive ownership or phase-009 review-loop semantics.

### Phase 3: Verification
- Prove equivalent scope, target, contract, prompt, rubric, and capability representations produce identical shared canonical bytes and algorithm-qualified digest references for each mode artifact kind.
- Prove every lifecycle boundary rejects missing, mutable-only, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, and unsupported references before consumer release.
- Prove per-dimension evidence preserves stable lineage, selected-target proof, search-ledger dispositions, graph identity, raw observations, candidate-first status, and deterministic reference ordering.
- Prove candidate activation retains orthogonal confidence, impact, reachability, exploitability, evidence strength, and scope while requiring typed adjudication before P0/P1/P2 severity is trusted.
- Prove convergence rejects mixed watermarks and synthesis reproduces identical dashboard, findings view, report, verdict metadata, and optional resource-map bytes from identical verified inputs and reducer versions.
- Prove resume-facing drift detects changed target or contract references, points to affected findings and report views, preserves historical seals, and never silently rebaselines the review.
- Prove replay and shadow parity compare only equivalent verified reference sets and that seal failure leaves legacy result, state, report behavior, and authority unchanged.
- Prove the independent Deep Review mode gate passes with certificate and authority semantics deferred to the successor and cutover phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Mode artifact manifest enumerates every lifecycle row and shows each delegates to the shared seal descriptor and verified reader |
| REQ-002 | Scope fixtures reject mutable-only inputs and persist one verified target, contract, context, capability, and policy reference set before dispatch |
| REQ-003 | Dimension-pass fixtures bind selected targets, search ledger, diagnostics, raw observations, graph events, iteration output, and JSONL delta to exact digests |
| REQ-004 | Candidate fixtures preserve intermediate facts, evidence classes, reproduction/refutation, orthogonal fields, and typed adjudication before P0/P1/P2 activation |
| REQ-005 | Convergence fixtures use one verified snapshot and return a typed mismatch or blocked result for mixed watermarks, changed inputs, or missing gate evidence |
| REQ-006 | Synthesis replay fixtures reproduce identical findings views, dashboard, report, verdict metadata, and optional resource-map bytes from identical sealed inputs and reducer versions |
| REQ-007 | Read-path mutation, corruption, truncation, wrong-kind, wrong-size, absence, and unsupported-version tests release zero bytes |
| REQ-008 | Replay and shadow fixtures bind identical ordered digest sets and report input-equivalence failure before comparing divergent sets |
| REQ-009 | Finding-lineage fixtures preserve original observations across moved lines, renamed symbols, resolutions, suppressions, and severity revisions |
| REQ-010 | Resume and handoff fixtures classify unchanged, changed, missing, and unverifiable references, preserve old seals, and refuse trusted output on failure |
| REQ-011 | Additive-dark fixtures show seal/read failure blocks dark evidence or trusted synthesis only and leaves legacy output, state, schema, report behavior, and authority unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` as an independent planning contract, while its implementation composes with the
phase-009 shared review-loop interfaces and write-set conflict graph. The shared phase-003 sealing primitive owns the
descriptor, canonicalization, content addressing, atomic publication, verified reads, lifecycle retention, and corruption
handling. The phase-003 event and replay contracts own outer envelopes and fingerprint derivation. Phase 009 owns the
shared review-loop target, dimension, lineage, convergence, report, and cross-mode compatibility semantics. Predecessor
`002-reducers-and-projections` owns findings, dashboard, strategy, and report projections. The compatibility and shadow
bridge supplies the parity boundary. Successor `004-certificates-and-receipts` consumes the verified reference set for
boundary evidence; later cutover changes authority. The existing Deep Review protocol, state JSONL, review contract, and
convergence references supply concrete legacy shapes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Land the adapter additively behind the dark Deep Review path. If a canonicalization, seal, verified-read, target-drift, or
reference-set defect appears, disable new mode sealing and trusted report or handoff promotion, quarantine affected
digests through the shared lifecycle contract, and continue only on the unchanged legacy path. Do not delete, overwrite,
re-seal, or rebaseline existing objects. Revert the mode-binding commits while retaining sealed artifacts and lifecycle
records for audit and replay. A rollback drill must prove that a failed dark seal cannot alter legacy state, output, report
behavior, or authority, and that a byte-identical restored object retains its original digest.
<!-- /ANCHOR:rollback -->
