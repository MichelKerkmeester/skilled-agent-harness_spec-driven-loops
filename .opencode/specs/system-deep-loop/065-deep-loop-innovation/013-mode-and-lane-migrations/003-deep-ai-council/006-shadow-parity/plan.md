---
title: "Implementation Plan: Deep AI Council — Shadow Parity"
description: "Implementation Plan for phase 006 of the Deep AI Council migration: run the typed ledger path beside the legacy emitter, compare canonical council projections event-for-event, and issue a cutover-blocking parity receipt."
trigger_phrases:
  - "deep ai council shadow parity implementation plan"
  - "council ledger projection diff plan"
  - "phase 006 council parity harness"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined paired legacy-ledger execution and canonical event comparison"
    next_safe_action: "Freeze the normalization profile and council parity fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council — Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop/deep-ai-council + shared ledger shadow substrate |
| **Change class** | Planning-only parity contract; dark non-authoritative migration evidence |
| **Execution** | Paired shadow runs from frozen BASE/candidate inputs under the phase-011 shadow framework |

### Overview
The current council lifecycle is observable through append-only state and packet-local artifacts: seats return, deliberation is synthesized, rounds close, completion is emitted, and failures preserve rollback evidence. The migration must prove that the typed ledger path produces the same canonical behavior history and projections before the mode can approach authority cutover. The plan therefore separates behavior-event parity from ledger control-plane validation, binds both to one frozen input boundary, and emits a receipt that fails closed on any unexplained difference.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-011 shadow framework contract, phase 012 shared mode contract, and the sibling `001-typed-ledger-schema` through `005-resume-adapter` interfaces are pinned
- [ ] A frozen input boundary includes BASE/candidate SHAs, council config, target version, seat manifests, recorded outputs, tool receipts, and fixture digests
- [ ] The canonical legacy-to-ledger event mapping and the versioned normalization profile are reviewed
- [ ] The parity matrix covers completion, multiple rounds, timeout/error, contradiction, non-convergence, rollback, resume, and mode-specific evidence fields
- [ ] Legacy remains authoritative and the shadow path has no permission to dispatch or commit external side effects

### Definition of Done
- [ ] Every parity fixture has equal ordered canonical behavior events with no unexplained legacy-only or ledger-only behavior event
- [ ] Council projections, artifacts, terminal decisions, resume, and rollback semantics match across both paths
- [ ] Ledger authorization, receipts, audit rows, and duplicate-effect checks are green
- [ ] Replays and supported completion-order permutations produce stable parity fingerprints
- [ ] A cutover-blocking parity receipt records zero unexplained diffs and leaves legacy authority unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen execution envelope**: capture candidate and BASE identity, council configuration, target version, seat manifests, recorded seat outputs, tool receipts, input digest, and normalization-profile digest. Both paths consume this envelope without re-dispatch.
- **Paired runner**: invoke the legacy emitter and ledger adapter as observers of one execution. The ledger path remains dark; it cannot become the source of prompts, side effects, completion authority, or resume state.
- **Canonical event mapper**: map legacy rows and typed events to behavior tuples keyed by logical run, round, seat, claim, artifact, and transition identity. Preserve raw rows for forensics.
- **Projection comparator**: compare event count, ordered kind, identity, required payload, lifecycle status, terminal result, artifact meaning, and projection fingerprint. Apply only the digest-bound normalization profile.
- **Control-plane verifier**: inspect ledger authorization, receipt references, audit events, effect IDs, and transition decisions separately. Extra control-plane events are required evidence but never compensate for missing behavior events.
- **Mismatch receipt**: classify the first divergence as mapping, payload, order, lifecycle, projection, artifact, failure, recovery, authorization, effect, or determinism drift; store both source coordinates and the remediation boundary.
- **Cutover boundary**: the parity receipt is an input to the later mode gate only. This phase never flips authority, migrates live state, deletes legacy writers, or resolves a mismatch by suppressing it.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the predecessor `005-resume-adapter` and phase-011 shadow framework contracts, while preserving the phase tree's independent-sibling planning relationship.
- Pin BASE and candidate identities, define the input envelope, freeze the normalization profile, and inventory the legacy state/output/failure/rollback events that require mapping.
- Assemble deterministic fixtures for normal completion, multiple rounds, seat timeout/error, contradictory high-confidence recommendations, max-round non-convergence, partial persistence, rollback, resume checkpoints, and council-specific independence/blinding/control evidence.

### Phase 2: Implementation
- Build the paired runner around one frozen execution so legacy and ledger observers receive identical inputs, recorded seat outputs, target versions, and tool receipts.
- Implement the event mapping and canonical behavior tuple comparison; report the first ordered divergence and retain raw legacy and ledger rows.
- Compare derived convergence, minority and hard-constraint outcomes, artifact references, audit checksums, and projection fingerprints without treating a graph projection as canonical state.
- Verify ledger transition authorization, receipt completeness, side-effect identity, and shadow isolation; fail the run on unauthorized or duplicate work.
- Emit a parity report and receipt bound to SHAs, input digests, mapping version, normalization profile, fixture ID, raw event digests, canonical projection digest, and control-plane result.

### Phase 3: Verification
- Run the full fixture matrix and supported completion-order permutations through both paths.
- Assert zero unexplained behavior-event diffs, zero projection or artifact semantic diffs, stable replay fingerprints, and identical failure/resume/rollback decisions.
- Confirm mismatches are cutover-blocking, legacy remains authoritative, failed rounds remain auditable, and no tracked implementation authority changes are hidden by the shadow harness.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Replay each fixture from one frozen input envelope; compare BASE/candidate, config, target, seat-output, tool-receipt, and normalization digests in the parity receipt |
| REQ-002 | Normalize legacy and ledger rows into ordered behavior tuples and require equal cardinality, kind, logical IDs, required payload, lifecycle, and first/last sequence |
| REQ-003 | Compare convergence state, majority/minority and hard-constraint outcomes, counterfactual results, independence evidence, artifact set, and projection fingerprint where exercised |
| REQ-004 | Exercise timeout/error, quorum failure, contradiction, max-round non-convergence, partial persistence, each resume boundary, rollback, and post-rollback resume; require the same canonical outcome |
| REQ-005 | Validate transition authorization, receipt references, effect IDs, audit rows, and zero shadow-owned external effects; reject missing, unauthorized, or duplicate control-plane evidence |
| REQ-006 | Mutate a non-semantic field covered by the profile and a semantic field outside it; only the first is tolerated, and a profile digest change invalidates prior receipts |
| REQ-007 | Produce a final report with zero unexplained diffs, deterministic replay evidence, fixture coverage, and explicit legacy-authority status; any blocker prevents cutover eligibility |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The execution consumes the phase-011 shadow framework named by the phase brief, the phase 012 shared mode contracts and write-set conflict graph, the shared compatibility/shadow bridge, and the Deep AI Council sibling contracts for typed ledger schema, reducers, sealed artifacts, certificates, and resume. It also relies on the existing `deep-ai-council` state format, output schema, failure handling, one-CLI-per-round invariant, packet-local artifact boundary, and derived-graph rule. The phase-tree entry declares `depends_on: []`; this plan records the named contract inputs without adding a hard dependency edge or changing sibling sequencing.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If shadow parity fails, leave the legacy emitter authoritative, disable the ledger observer at the shadow boundary, and preserve the raw paired histories plus mismatch receipt for diagnosis. Revert only the phase's path-scoped implementation changes or discard the disposable shadow runner worktree; never rewrite legacy JSONL, delete failed-round artifacts, or mark a mismatched receipt as green. A later retry must use a new candidate digest and a new parity receipt so evidence from the failed run remains immutable.
<!-- /ANCHOR:rollback -->
