---
title: "Implementation Plan: Deep Alignment - Sealed Reference Artifacts"
description: "Implementation plan for binding Deep Alignment authority capsules, lane inputs, verify-first evidence, witness matrices, exception assertions, convergence outputs, reports, and resume references to the shared seal-on-write and tamper-evident read contract."
trigger_phrases:
  - "deep alignment sealed artifacts implementation plan"
  - "deep-alignment seal-on-write plan"
  - "deep alignment verified read plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Alignment authority and evidence seal boundaries"
    next_safe_action: "Inventory Deep Alignment artifacts against the phase-012 shared contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-alignment |
| **Change class** | Mode-specific artifact registration and seal/read integration |
| **Execution** | Seal-on-write references across authority resolution, lane discovery, verify-first checks, witness and exception evidence, convergence, report, resume, and save; additive-dark |

### Overview
Plan one Deep Alignment adapter over the shared phase-006 sealing primitives. The adapter maps the existing alignment
lifecycle to registered artifact kinds, seals exact canonical bytes at each boundary, binds ordered digest references into
the shared phase-012 review-loop contract, typed events, predecessor reducers, replay fingerprints, convergence evidence,
and per-lane report views, and verifies every reference before release to a consumer. The plan preserves lane resolution,
authority-specific discovery, applicability-before-verification, verify-first re-probes, known-deviation visibility, the
read-only default, the `coverage AND stability` convergence rule, and one report per lane. It consumes the shared sealed
reference contract and does not implement shared storage, a second digest scheme, reducers, certificates, resume decisions,
shadow parity, remediation, or authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-012 shared review-loop contracts and the executable write-set conflict graph are frozen for the Deep Alignment lane
- [ ] The mode artifact matrix names every `init/scope`, `discover`, `iterate/check`, `witness/exception`, `convergence/report`, and `resume/save` input/output
- [ ] Each matrix row identifies a shared artifact kind, canonicalization version, media type, and ordered reference role
- [ ] Shared seal-on-write and verified-read seams are available without changing the legacy authoritative loop
- [ ] Authority validity, publisher and epoch checks, applicability results, witness coverage, and exception lifecycle are explicit before discovery or trusted findings
- [ ] Replay and shadow-parity consumers accept one ordered verified reference set rather than mode-local digests
- [ ] Typed failures, append-only supersession, authority drift, expired exception handling, legacy fallback refusal, and the additive-dark rollback switch are explicit

### Definition of Done
- [ ] Deep Alignment lifecycle artifacts are sealed and read only through the shared contract, with mode-gate fixtures green
- [ ] The dark path proves parity over identical verified inputs while legacy execution, lane reports, and authority remain unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared seal adapter**: accepts a typed Deep Alignment artifact request, delegates canonicalization, atomic publication, digest derivation, lifecycle handling, and verified reads to the phase-006 primitive, and exposes no alternate hash or blob identity.
- **Authority capsule binder**: seals the named authority source, compiled rule IR and manifest, publisher, epoch, capability and coverage results, applicability policy, and authority digest before `DISCOVER`; invalid authority yields a typed blocked result rather than an artifact pass.
- **Mode artifact registry**: registers lane configuration, scope and discovery manifest, target snapshot, rule/applicability result, detector and re-probe evidence, witness matrix, governed exception, convergence snapshot, report view, and resume/save handoff as Deep Alignment specializations of the shared descriptor.
- **Lane and discovery seal boundaries**: seal selected lane inputs, adapter contract, selected and omitted artifact identities, discovery watermarks, target bytes, rule inputs, and not-applicable or unresolved scope before checker or reducer consumption.
- **Finding and proof binder**: binds raw detector output, subject digest, rule and applicability identity, live re-probe receipt, verifier version, evidence class, verified level, orthogonal confidence and severity, witness references, and exception lineage without collapsing evidence into a verdict.
- **Witness and exception views**: seal positive, negative, boundary, relational, and stateful witnesses plus governed deviation assertions; preserve original failures and append later invalidation, expiry, or supersession records.
- **Convergence and report views**: seal one ordered state snapshot with coverage and stability, then seal findings, exception dispositions, per-lane `alignment-report.md`, overall worst-verdict metadata, and ordered input references after projection.
- **Tamper-evident read path**: resolves exact digest references, recomputes returned byte length and digest, validates descriptor, authority epoch, and artifact-kind compatibility, and releases no bytes on any failure.
- **Additive-dark integration**: seal or verification failure blocks new dark evidence, replay, parity, convergence promotion, report trust, or handoff promotion but leaves the legacy loop, state, output, and authority untouched until staged cutover.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-012 shared review-loop contract and write-set conflict graph; verify predecessor `002-reducers-and-projections` owns findings, lane verdict, registry, and report projections.
- Inventory current Deep Alignment lane config, authority and adapter references, `deep-alignment-state.jsonl`, delta files, discovered artifact manifests, rule outputs, live re-probe evidence, known-deviation records, witness or replay fixtures, convergence gates, `alignment-report.md`, resume state, and continuity-save handoffs against the pinned baseline.
- Freeze the mode artifact-kind matrix, reference roles, canonicalization profiles, media types, authority publisher and epoch identities, stable lane/artifact/rule/finding/witness/iteration identities, and ordered reference-set rules using the shared phase-006 primitive.
- Define typed seal/read failures, invalid-authority and expired-exception dispositions, mutable-target and authority-drift handling, append-only supersession, report/handoff refusal, and the additive-dark rollback switch.

### Phase 2: Implementation
- Register Deep Alignment authority capsule, lane scope, adapter, rule manifest, applicability policy, capability, and replay-input artifact kinds through the shared sealer; reject live-only, alias-only, expired, rolled-back, mixed-version, and unverified authority inputs at init.
- Add authority and scope seal-on-write and bind one verified lane reference set before discovery; preserve omitted, unresolved, and not-applicable scope as typed outcomes.
- Add discovery seal-on-write and verified-read gates for selected artifact identities, target snapshots, adapter output, discovery watermarks, corpus partitions, and rule inputs before checker or reducer consumption.
- Add per-iteration sealing for applicability decisions, deterministic checks, raw detector results, source locators, verifier inputs, live re-probe output, JSONL delta, and candidate evidence before finding activation.
- Add immutable proof-carrying finding sealing for authority and rule identity, subject digest, applicability, raw observation, re-probe receipt, verifier identity, verified level, evidence class, orthogonal severity/confidence, and counterevidence.
- Add witness matrix sealing for conforming, violating, boundary, relational, and stateful cases, shrink results, coverage gaps, and old-authority replay references; keep witness cases independently addressable.
- Add governed exception sealing for subject, rule or claim, lane, authority digest, owner, justification, issuer, scope, issued time, expiry, and invalidation reason without deleting the original failure or suppressing future verification.
- Seal the findings and exception materialized views, coverage and stability inputs, unresolved or inconclusive obligations, per-lane `alignment-report.md`, overall verdict metadata, and ordered input digest set after projection.
- Add resume-facing authority, subject, witness, and exception drift comparison plus save/handoff references that preserve prior seals, identify affected lanes and findings, and refuse trusted output on failed reads.
- Bind mode references into existing typed events, predecessor reducers and projections, replay fingerprints, compatibility adapters, shadow parity, and rollback handling without changing shared primitive ownership, phase-012 review-loop semantics, or read-only defaults.

### Phase 3: Verification
- Prove equivalent authority, lane, scope, rule, adapter, target, witness, and exception representations produce identical shared canonical bytes and algorithm-qualified digest references for each mode artifact kind.
- Prove every lifecycle boundary rejects missing, mutable-only, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, expired, mixed-epoch, and unsupported references before consumer release.
- Prove authority-capsule invalidity cannot produce an artifact PASS and that applicability resolves before expensive verification, preserving not-applicable and unresolved outcomes.
- Prove per-lane evidence preserves stable identities, selected-target proof, rule coverage, raw observations, live re-probe receipts, verify-first status, exception lineage, and deterministic reference ordering.
- Prove witness replay detects deleted or weakened obligations across authority epochs and that governed exceptions expire or invalidate on authority, subject, verifier, scope, or time drift.
- Prove convergence rejects mixed watermarks and report synthesis reproduces identical findings views, exception dispositions, lane reports, worst-verdict rollup, and metadata from identical verified inputs and reducer versions.
- Prove resume-facing drift detects changed authority, target, rule, witness, exception, or contract references, points to affected lanes and findings, preserves historical seals, and never silently rebaselines.
- Prove replay and shadow parity compare only equivalent verified reference sets and that seal failure leaves the legacy result, state, report behavior, read-only posture, and authority unchanged.
- Prove the independent Deep Alignment mode gate and rollback switch without invoking certificate, receipt, remediation, or authority semantics owned by later phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Mode artifact manifest enumerates every lifecycle row and shows each delegates to the shared seal descriptor and verified reader |
| REQ-002 | Authority fixtures reject invalid, expired, rolled-back, mixed-version, unsigned, or coverage-incomplete capsules and persist one verified authority reference before discovery |
| REQ-003 | Lane and discovery fixtures bind scope, adapter, corpus, target, omission, unresolved, and not-applicable outcomes to exact ordered digests |
| REQ-004 | Check fixtures preserve applicability, raw detector output, live re-probe receipt, verifier identity, evidence class, verified level, and orthogonal fields before finding assertion |
| REQ-005 | Exception fixtures preserve the original failure, append a scoped expiring assertion, and invalidate it when authority, subject, verifier, scope, or time changes |
| REQ-006 | Witness fixtures reproduce positive, negative, boundary, relational, and stateful cases and detect weakened or deleted obligations across authority capsules |
| REQ-007 | Convergence and report replay fixtures reproduce identical findings views, exception dispositions, per-lane reports, rollups, and metadata from identical sealed inputs and reducer versions |
| REQ-008 | Read-path mutation, corruption, truncation, wrong-kind, wrong-size, absence, expiry, mixed-epoch, and unsupported-version tests release zero bytes |
| REQ-009 | Replay and shadow fixtures bind identical ordered digest sets and report input-equivalence failure before comparing divergent sets |
| REQ-010 | Resume and handoff fixtures classify unchanged, changed, missing, expired, and unverifiable references, preserve old seals, and refuse trusted output on failure |
| REQ-011 | Additive-dark fixtures show seal/read failure blocks dark evidence or trusted synthesis only and leaves legacy output, state, schema, report behavior, remediation posture, and authority unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` as an independent planning contract, while its implementation composes with the
phase-012 shared review-loop interfaces and write-set conflict graph. The shared phase-006 sealing primitive owns the
descriptor, canonicalization, content addressing, atomic publication, verified reads, lifecycle retention, and corruption
handling. The phase-006 event and replay contracts own outer envelopes and fingerprint derivation. Phase 012 owns the shared
review-loop lane, target, dimension, lineage, convergence, report, and cross-mode compatibility semantics. Predecessor
`002-reducers-and-projections` owns findings, coverage, exception, lane-verdict, and report projections. The compatibility
and shadow bridge supplies the parity boundary. Successor `004-certificates-and-receipts` consumes the verified reference
set for boundary evidence; later phases own resume, rollback, remediation, and authority decisions. The existing
Deep Alignment state machine, adapter, known-deviation, convergence, and report references supply concrete legacy shapes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Land the adapter additively behind the dark Deep Alignment path. If an authority-capsule, canonicalization, seal,
verified-read, target-drift, witness, exception, or reference-set defect appears, disable new mode sealing and trusted
finding, report, or handoff promotion, quarantine affected digests through the shared lifecycle contract, and continue only
on the unchanged legacy path. Do not delete, overwrite, re-seal, expire, or rebaseline existing objects. Revert the
mode-binding commits while retaining sealed artifacts and lifecycle records for audit and replay. A rollback drill must
prove that a failed dark seal cannot alter legacy state, output, report behavior, read-only posture, or authority, and that a
byte-identical restored object retains its original digest.
<!-- /ANCHOR:rollback -->
