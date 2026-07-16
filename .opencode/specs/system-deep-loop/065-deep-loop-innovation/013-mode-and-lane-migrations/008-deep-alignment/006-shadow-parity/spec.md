---
title: "Feature Specification: Deep Alignment shadow parity"
description: "Plan the Deep Alignment shadow-parity harness for migration to the typed event-ledger substrate. The harness runs the new ledger path beside the legacy emitter, compares canonical events and public projections event-for-event, and blocks any authority cutover until parity, replay determinism, and fail-closed mismatch handling are green. It consumes the phase-014 shadow framework and reuses the shared review-loop contract frozen in phase 012."
trigger_phrases:
  - "Deep Alignment shadow parity"
  - "deep-alignment ledger migration parity"
  - "event-for-event shadow harness"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined event-for-event shadow parity before Deep Alignment authority cutover"
    next_safe_action: "Freeze paired runners and execute the parity fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment Shadow Parity

> Phase adjacency under the 008 deep-alignment parent (grouping order, not a runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Alignment mode migration) |
| **Origin** | Phase 009 of the Deep Alignment mode migration: shadow parity before authority cutover |
| **Inputs** | Parent program spec; phase tree; phase-014 shadow framework; shared review-loop contract frozen in phase 012; mode research registries for authority capsules, proof-carrying findings, applicability, deviations, receipts, and cross-epoch replay |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment performs per-lane conformance checks against a named authority and emits verify-first findings. Its migration cannot replace the legacy emitter in place: the typed ledger path, reducers, authority capsule, certificates, receipts, and resume adapter are being introduced as an additive substrate while legacy remains authoritative. A mode-specific parity harness is therefore needed to prove that the new path preserves the observable behavior of the existing loop before the later mode gate can consider a cutover.

The harness must run the new ledger path in shadow alongside the legacy emitter on the same frozen run inputs, authority material, lane assignments, and review-loop decisions. It must compare the resulting event streams and projections event-for-event, not merely compare final counts or a terminal pass bit. The comparison must expose missing, extra, reordered, stale, authority-mismatched, applicability-mismatched, and semantically changed observations as blocking parity failures. The phase-014 shadow framework supplies the paired execution boundary; this phase defines Deep Alignment's mode contract over that framework and reuses the shared review-loop contract frozen in phase 012.

The parity result is evidence for a future authority decision, not an authority decision itself. This phase plans no cutover, no rollback implementation, and no mutation of the legacy emitter. It establishes the acceptance evidence that `007-rollback-and-mode-gate` must consume and that the later staged cutover must require.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Alignment shadow runner contract over the phase-014 shadow framework: identical run manifest, target digest, authority capsule reference, lane configuration, review-loop contract, executor capabilities, and budget inputs for both paths.
- A canonical event comparator that pairs legacy and ledger events by stable logical identity, event type, causal parent, sequence position, authority epoch, lane, subject digest, and semantic payload; non-semantic fields are normalized only through a declared allowlist.
- Projection comparison for per-lane findings, applicability outcomes, evidence bindings, known-deviation dispositions, authority conflicts, terminal status, gauges, and other public mode outputs owned by this migration.
- Shadow capture, deterministic replay, late-event and retry fixtures, crash-boundary fixtures supplied by the shared framework, and mismatch reports with enough evidence to reproduce the first divergence.
- Fail-closed parity policy: missing inputs, invalid authority material, unpaired events, unknown event fields, projection drift, or unresolved comparator ambiguity produce `PARITY_BLOCKED` rather than an inferred pass.
- Mode-specific parity acceptance criteria and the handoff evidence required by `007-rollback-and-mode-gate`; the legacy path remains the authority throughout this phase.

### Out of Scope
- Implementing the typed ledger schema, Deep Alignment reducers, sealed artifacts, certificates, receipts, or resume adapter; those are sibling concerns `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, `004-certificates-and-receipts`, and `005-resume-adapter`.
- Changing the shared review-loop contract or the phase-014 shadow framework; this phase consumes those contracts and adds the Deep Alignment comparator and acceptance policy.
- Flipping authority, deleting legacy writers, changing production defaults, or implementing rollback; authority cutover belongs to the staged cutover program and rollback behavior belongs to `007-rollback-and-mode-gate`.
- Treating a matching terminal verdict, aggregate score, or artifact count as sufficient parity without event and projection evidence.
- Re-authoring the named authority, silently accepting an invalid or stale authority capsule, or suppressing raw findings to make the shadow result match.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shadow run uses identical frozen inputs for the legacy and ledger paths | A paired-run manifest binds the run ID, target digest, authority capsule digest and epoch, lane set, review-loop contract version, executor capability snapshot, budget snapshot, and fixture seed; a mismatch aborts the comparison |
| REQ-002 | The harness compares events one-for-one | Every legacy event has exactly one ledger counterpart and every ledger event has exactly one legacy counterpart; missing, extra, duplicate, or unpaired events fail the gate |
| REQ-003 | Event identity and causal order are preserved | Paired events agree on logical event ID, event type, lane, subject and authority references, causal parent, sequence/barrier position, and terminal transition; arrival-time differences are not treated as semantic order changes when the declared causal order is identical |
| REQ-004 | Semantic event payloads are equivalent | Canonicalized payloads match after applying only a versioned, explicit non-semantic field allowlist; unknown fields, dropped fields, changed verdict semantics, changed applicability, and changed evidence references fail closed |
| REQ-005 | Deep Alignment projections are equivalent | Per-lane finding lifecycle, authority validity, applicability, evidence bindings, deviation disposition, authority conflict state, terminal outcome, and public gauges match by stable projection identity; raw evidence and original findings remain observable in both paths |
| REQ-006 | Authority and replay provenance are part of parity | Both paths use the same immutable authority capsule and verifier identity; replay checks reject expired, rolled-back, mixed-version, stale, or unbound authority material rather than comparing outputs from different rulers |
| REQ-007 | The comparator is deterministic and reproducible | Repeating the same paired run and replaying captured streams produce the same first-divergence location, diff class, projection digest, and parity disposition |
| REQ-008 | Shadow failures are actionable and fail closed | The harness emits a typed mismatch report with paired event references, canonical diff, lane, subject, authority epoch, first divergence, and replay command; missing evidence or comparator ambiguity yields `PARITY_BLOCKED`, never `PARITY_PASS` |
| REQ-009 | Green parity is a prerequisite, not an authority flip | The phase produces a parity receipt proving the acceptance matrix is green while legacy remains authoritative; any future cutover consumes this receipt and cannot be authorized by this phase alone |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase-014 shadow framework can execute Deep Alignment legacy and ledger paths from one frozen paired-run manifest without changing the legacy result path.
- **SC-002**: Event-for-event comparison is green across deterministic, replay, retry, late-completion, authority-change, applicability, known-deviation, and authority-conflict fixtures; no unexplained missing, extra, duplicate, or reordered event remains.
- **SC-003**: Projection parity is green for every Deep Alignment lane and public output, including verify-first finding lifecycle, authority validity, applicability, evidence, deviations, conflicts, terminal state, and gauges.
- **SC-004**: The harness rejects invalid or mixed authority capsules and distinguishes `PARITY_BLOCKED` from a clean parity result.
- **SC-005**: Repeated runs produce identical diff classifications and projection fingerprints, and a seeded injected mismatch is detected at the first divergent event.
- **SC-006**: A mode-scoped parity receipt records the exact inputs, comparator version, fixture matrix, event and projection digests, mismatch count, and legacy-authoritative status for handoff to `007-rollback-and-mode-gate`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity from final-state comparison** — two paths can converge on the same terminal result while dropping evidence, changing applicability, or suppressing a finding. Mitigation: compare canonical event streams and projection identities before terminal-result comparison.
- **Authority drift during a paired run** — a live authority file can change or mix epochs, making the comparison meaningless. Mitigation: bind both paths to one immutable authority capsule digest and fail closed on expiry, rollback, or mixed-version material.
- **Ordering noise mistaken for semantic drift** — concurrent lane completion can differ while causal semantics remain equal. Mitigation: compare stable logical identity and declared causal/barrier order, with no silent order relaxation outside the versioned comparator policy.
- **Comparator normalization hides a real change** — broad ignored-field lists can turn a regression into a pass. Mitigation: keep an explicit small allowlist, reject unknown fields, and test allowlist expansion as a parity-contract change.
- **Known-deviation suppression masks a regression** — treating an exception as a filter removes the evidence needed to detect changed scope or authority. Mitigation: compare the raw finding and the appended deviation/adjudication event separately.
- **Shared review-loop drift** — Deep Alignment and deep-review may stop producing comparable execution events if the shared contract changes. Mitigation: pin the phase-012 contract version and include it in the paired-run manifest and receipt.
- **Dependencies**: phase-014 shadow framework; phase-012 shared review-loop contract; sibling Deep Alignment outputs for typed schema, reducers, sealed artifacts, certificates, and resume; the legacy Deep Alignment emitter; the spec-kit validator; and the later `007-rollback-and-mode-gate` handoff.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which Deep Alignment event fields are semantically observable versus transport metadata, and what is the initial versioned normalization allowlist?
- Which public gauges are required in the projection parity set, and which are explicitly diagnostic-only in the phase-014 framework?
- What minimum fixture count and confidence rule make a green shadow sample representative of every active lane and authority disposition?
- Which cross-epoch authority changes must be replayed in this phase versus deferred to `007-rollback-and-mode-gate`?
- What receipt schema and expiry window does the later mode gate require from this phase's parity evidence?

These questions are planning inputs for implementation. They must be resolved in the paired-run contract and fixture matrix before a parity receipt can be considered eligible for the mode gate; unresolved questions cannot be converted into permissive comparator behavior.
<!-- /ANCHOR:questions -->
