---
title: "Feature Specification: Deep Alignment - Sealed Reference Artifacts"
description: "Plan the Deep Alignment mode binding for immutable, content-addressed reference artifacts across authority resolution, lane discovery, verify-first findings, conformance convergence, alignment reports, and resume handoff. The mode consumes the shared sealing primitives and never creates a second digest or verification scheme."
trigger_phrases:
  - "deep alignment sealed artifacts"
  - "deep-alignment reference sealing"
  - "deep alignment tamper-evident read"
  - "deep alignment authority capsule seal"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep Alignment seal boundaries over the shared artifact contract"
    next_safe_action: "Freeze the Deep Alignment artifact-kind matrix against shared seal contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Sealed Reference Artifacts

> Phase adjacency under the 008-deep-alignment parent (navigation order, not a hard runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Alignment mode migration) |
| **Origin** | Third Deep Alignment child in the phase-013 per-mode migration fan-out |
| **Depends on** | None (`[]`); sibling planning contracts compose at the Deep Alignment mode gate |
| **Consumes** | Shared phase-006 sealing primitives, typed replay references, and the phase-012 shared review-loop contract used by Deep Review |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment is an autonomous standard-authority conformance loop. It resolves lanes as an authority, artifact class,
and scope; discovers artifacts through an authority-specific adapter; checks them slice by slice; re-verifies every finding
against live ground truth; converges on coverage and stability; and emits one report per lane. The checked-in mode contract
defines `INIT`, `SCOPE`, `DISCOVER`, `ITERATE`, `CONVERGE`, and `REPORT`, with an optional gated `REMEDIATE` state, and stores
control state in `deep-alignment-config.json`, `deep-alignment-state.jsonl`, delta files, findings registries, and
`alignment-report.md` (`deep-alignment/SKILL.md:251-269`, `deep-alignment/SKILL.md:322-345`). These records can name an
authority source, rule set, artifact path, adapter result, verifier output, or report without committing the exact bytes
that produced a conformance claim, a known-deviation disposition, an unresolved result, or a lane verdict.

The mode research identifies the missing boundary. Deep Alignment must produce a reproducible temporal conformance proof
bound to an authorized standard version, with a per-rule witness matrix and governed, expiring exceptions rather than a
mutable live-authority snapshot or blanket ignore list (`research-modes.md:139-154`). The mode registry further requires
authority compilation and signing before findings, typed rule obligations that preserve residual ambiguity, replay of old
authority witnesses against a new capsule, applicability before verification, proof-carrying findings, and subject-bound
receipts (`findings-registry-modes.json:1207-1512`, `findings-registry-modes.json:3433-3539`). The shared runtime research
also requires an immutable artifact target, adapter-owned discovery, blinded detector findings, scorer decisions based on
the frozen authority plus live re-probe receipts, and a fresh target version after any remediation candidate
(`findings-registry.json:2770-2777`).

This phase plans the Deep Alignment binding to the shared phase-006 sealing primitives. It registers mode artifact kinds,
seals exact canonical bytes at each lifecycle boundary, carries only algorithm-qualified digest references through the
phase-012 review-loop contract, typed events, predecessor reducers, replay, convergence, and report projections, and
verifies every read before a consumer receives bytes. Deep Alignment and Deep Review consume the same shared review-loop
contract; this phase adds only the alignment artifact bindings and must not fork shared scope, dimension, lineage,
convergence, or report semantics. It does not invent a mode-local hash, blob store, descriptor, or tamper check. Seal or
read failures block new dark evidence and trusted report or handoff promotion without changing legacy authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Alignment artifact-kind registry over the shared seal descriptor for the authority capsule, lane configuration and scope, compiled rule manifest, applicability decisions, discovery manifest, target snapshots, verifier and detector inputs, witness matrix, finding evidence, governed exceptions, convergence snapshot, alignment report, and resume/save handoff.
- Seal-on-write capture for each lane boundary: the authorized authority source and epoch, adapter contract, selected scope, discovered artifact set, rule and applicability results, deterministic checks, raw detector observations, live re-probe results, and per-iteration JSONL or delta records.
- Immutable proof-carrying findings that bind the authority digest, rule identity, applicability result, subject digest, observation digest, verifier identity, verified level, evidence class, and re-probe receipt before a finding is asserted.
- A witness matrix containing conforming, violating, boundary, and relational or stateful cases, with deterministic replay references and explicit coverage gaps; old-authority witnesses remain available for comparison against a new authority capsule.
- Governed deviation and exception records that append an accepted disposition without deleting the original observation, and that expire or invalidate when authority, subject, verifier, scope, or time changes.
- Sealed convergence and report outputs as materialized views over the alignment findings and projections, including lane coverage, stability, unresolved or inconclusive findings, per-lane verdicts, overall worst-verdict rollup, and the exact ordered input reference set.
- Mode adapters that bind ordered verified artifact-reference sets into typed events, the predecessor reducer/projection boundary, replay fingerprints, compatibility and shadow evidence, resume references, and the independent Deep Alignment mode gate.
- Tamper-evident verified reads, typed failure propagation, append-only supersession, authority-drift detection, and additive-dark rollback behavior while legacy Deep Alignment remains authoritative.

### Out of Scope
- Defining or replacing the shared seal descriptor, canonicalization registry, digest algorithm, immutable store, atomic publisher, verified-read implementation, lifecycle ledger, retention collector, or corruption policy owned by the shared sealing primitives.
- Defining the phase-006 event envelope, typed append-only ledger, transition-authorization gateway, or generic replay-fingerprint descriptor; this phase supplies Deep Alignment references to those contracts.
- Defining the phase-012 shared review-loop contract used by Deep Alignment and Deep Review, including shared target, dimension, lineage, convergence, report, and write-set semantics.
- Replacing the reducer and projection algorithms owned by predecessor `002-reducers-and-projections`; findings registries, gauges, and reports are sealed views of those outputs, not second reducers.
- Defining certificate, receipt, boundary-attestation, promotion, or authority semantics owned by successor `004-certificates-and-receipts` and later cutover phases.
- Defining the resume decision algebra, state migration, shadow-parity harness, rollback switch, or independent mode-gate policy owned by the other Deep Alignment siblings and the mode gate; this phase only supplies immutable references and verification results.
- Implementing remediation, changing audited artifacts, reading a live mutable authority without a sealed epoch, moving runtime authority, rewriting legacy JSONL, deleting sealed data, or treating a P0/P1/P2 label as a substitute for orthogonal evidence fields.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep Alignment artifact kinds use one shared seal contract | A reviewed mode matrix maps every lifecycle input and output to a registered shared artifact kind, canonicalization version, media type, and digest reference; no mode-local digest or verifier exists |
| REQ-002 | Authority validity gates discovery and conformance | `INIT` and `SCOPE` seal the authority source, compiled rule manifest, publisher, authority epoch, applicability policy, capability and coverage results, and authority digest before `DISCOVER`; invalid, expired, rolled-back, mixed-version, or unsigned authority material cannot yield an artifact PASS |
| REQ-003 | Lane resolution and discovery freeze exact inputs | Each lane binds authority, artifact class, scope, adapter contract, selected corpus, omitted or unresolved scope, and ordered discovery output before verification; mutable paths or aliases alone are rejected |
| REQ-004 | Verify-first findings remain reproducible | Every asserted finding binds applicability, subject digest, rule identity, raw observation, live re-probe receipt, verifier identity/version, evidence class, verified level, and confidence or severity fields; pattern-only or prose-only findings remain candidates or inconclusive |
| REQ-005 | Deviations are precise append-only assertions | A governed exception binds subject, rule or claim, lane, authority digest, owner, justification, issued and expiry times, scope, and issuer; the original failure remains readable and the assertion invalidates on authority, subject, verifier, scope, or time drift |
| REQ-006 | Witness matrices prove rule behavior across authority epochs | Conforming, violating, boundary, relational, and stateful witnesses are content-addressed and replayable; old-authority witnesses can be evaluated against a new capsule to expose deleted or weakened obligations |
| REQ-007 | Convergence and report synthesis use one verified decision set | Coverage, stability, lane verdicts, unresolved or inconclusive findings, exception dispositions, registry inputs, and `alignment-report.md` bind one ordered reference set and reproduce from identical verified inputs |
| REQ-008 | Every mode read is tamper-evident | Missing, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, unsupported, expired, or descriptor-drifted artifacts release zero bytes and return the shared typed verification failure |
| REQ-009 | Replay and shadow parity use the same sealed set | Typed events, reducers, replay fingerprints, legacy execution, and dark execution bind the same ordered verified digest set before behavior comparison; divergent sets produce input-equivalence failure |
| REQ-010 | Resume detects authority and subject drift without rewriting history | Resume-facing references identify unchanged, changed, missing, expired, and unverifiable inputs, affected lanes and findings, and superseding authority capsules; old seals remain readable and no silent rebaseline is allowed |
| REQ-011 | Sealing remains additive-dark and non-authoritative | Seal or read failure blocks new dark evidence, parity, trusted synthesis, or handoff promotion but does not modify legacy state, legacy output, schema, remediation behavior, or runtime authority before staged cutover |

### Deep Alignment artifact boundary matrix

| Lifecycle boundary | Mode artifact set | Required consumer rule |
|--------------------|-------------------|------------------------|
| `init/scope` | Lane declaration, authority source, compiled rule IR, rule manifest, publisher and epoch, capability and coverage results, applicability policy, adapter contract, scope and protected-file policy | Seal and verify the authority capsule and lane reference set before discovery; reject live-only, alias-only, expired, rolled-back, mixed-version, or unverified authority inputs |
| `discover` | Selected lane scope, adapter discovery manifest, artifact identities and snapshots, omitted or unresolved paths, corpus partitioning, target digests, and discovery watermarks | Verify before a worker or rule checker receives bytes; preserve not-applicable and unresolved scope as typed results rather than treating them as pass or empty coverage |
| `iterate/check` | Rule applicability, deterministic checks, raw detector observations, source locators, semantic rule results, verifier inputs, live re-probe output, and iteration JSONL or delta | Verify before reducer or finding activation; candidate evidence is not a trusted verdict and every finding must pass the verify-first boundary |
| `witness/exception` | Positive, negative, boundary, relational, and stateful witness cases; shrink results; governed deviation assertions; counterevidence and invalidation records | Bind every case to rule, subject, authority epoch, and verifier references; retain original failures and append superseding or expiring dispositions |
| `convergence/report` | Ordered state history, coverage and stability gauges, per-lane findings view, exceptions, unresolved or inconclusive IDs, per-lane report, overall rollup, and report metadata | Read one verified snapshot; do not combine state JSONL, findings, authority, witness, or report inputs from different watermarks |
| `resume/save` | Prior lane lineage, authority and subject reference sets, drift comparison, affected findings and report references, continuity handoff pointer | Verify before re-entry or save; drift produces a typed resume decision and never mutates prior seals or creates an implicit new baseline |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Deep Alignment lifecycle boundary has a reviewed artifact-kind row and uses the shared content-addressed seal and verified-read contract.
- **SC-002**: Authority resolution, lane discovery, rule applicability, verify-first findings, witness cases, exceptions, convergence, report, resume, and save bind exact algorithm-qualified digest references rather than mutable paths or aliases.
- **SC-003**: Authority invalidity, mutation, absence, truncation, substitution, descriptor drift, expiry, unsupported versions, and corrupted target or evidence artifacts fail before bytes reach a verifier, reducer, convergence decision, report, or handoff.
- **SC-004**: Identical verified reference sets plus the same registered review-loop, replay, reducer, and projection contracts reproduce byte-identical effective events, findings views, convergence evidence, per-lane reports, and verdict metadata.
- **SC-005**: Witness matrices, governed exceptions, authority-epoch replay, and proof-carrying findings preserve original observations, distinguish not-applicable and inconclusive states, and never convert a blanket suppression into a clean pass.
- **SC-006**: The Deep Alignment mode gate can prove shadow parity over the same verified reference set while legacy authority remains unchanged; certificates, receipts, remediation, and authority decisions remain with later phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The highest risk is a second mode-local sealing scheme that hashes a path, rule JSON, authority URL, JSONL line, or report
file without committing the exact canonical bytes consumed by the next alignment stage. The mode adapter must consume the
shared phase-006 sealing interface, use its descriptor, canonicalization, atomic publication, and verified-read errors, and
expose only digest references to the phase-012 review-loop, ledger, reducer, replay, convergence, and report layers.

Sealing only the control plane leaves the authority source, compiled rule IR, applicability facts, discovered target bytes,
detector observations, live re-probe evidence, witnesses, and exception assertions unreconstructable. Sealing only the final
alignment report hides rule-level drift and lets a mutable authority or expired deviation appear to support a historical
verdict. The boundary matrix therefore seals both replay-affecting inputs and immutable intermediate/output observations,
while predecessor reducers continue to own the findings and report projections.

Deep Alignment has multiple lane arrival orders: discovery can partition a corpus, checks can return not-applicable or
unresolved, re-probes can arrive after candidate emission, and authority updates can require old-witness replay. Reference-set
ordering must use the shared canonical ordering and stable lane, authority, epoch, artifact, rule, finding, witness, and
iteration identities, never filesystem discovery or worker completion order. A failed or corrupted read must block dark
evidence and synthesis without changing the legacy path. The phase-012 conflict graph is required before parallel lane
execution so authority snapshots, discovery manifests, finding evidence, witness cases, and report references have explicit
write ownership.

The verify-first contract is also a security boundary. A known deviation must remain visible as a typed exception or exempt
disposition, not erase a failure; a remediation candidate must receive a new target version and a fresh audit; and a verifier
must not accept authority, issuer, or exception claims supplied only by the artifact under audit. Dependencies are the shared
phase-006 sealing, event, and replay contracts; the phase-012 shared review-loop contract and write-set conflict graph;
predecessor `002-reducers-and-projections`; the existing Deep Alignment state, adapter, convergence, and report references;
and the compatibility/shadow bridge. Successor `004-certificates-and-receipts` consumes this phase's verified reference set
for boundary evidence. Deep Review consumes the same shared review-loop contract and must not receive a Deep Alignment-only
sealing or authority fork.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the final artifact-kind names, authority-capsule fields, canonicalization
profiles, media types, maximum object sizes, authority epoch and publisher checks, exact lane reference ordering, witness
matrix representation, exception invalidation rules, typed error mapping, and phase-012 contract bindings against the pinned
baseline. It must decide whether an alignment report package stores one sealed bundle or a sealed manifest of separately
addressed authority, target, evidence, witness, state, and output artifacts, without weakening verified reads, append-only
supersession, exception visibility, or shared retention roots. These choices may narrow the mode binding but may not introduce
a second sealing scheme, change shared review-loop semantics, make a mutable authority authoritative, or turn remediation into
the default loop.
<!-- /ANCHOR:questions -->
