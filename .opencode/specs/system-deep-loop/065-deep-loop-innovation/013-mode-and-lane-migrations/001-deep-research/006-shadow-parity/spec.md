---
title: "Feature Specification: Deep Research shadow parity"
description: "Plan the Deep Research mode's shadow-parity harness over the typed event-ledger substrate. The harness runs the ledger path beside the legacy emitter for init, iterative gather/analyze, convergence detection, synthesis, resume, and memory-save handoff; canonicalizes only declared transport volatility; diffs the mode projection event-for-event; and blocks authority cutover on any unexplained semantic difference. This is planning only and does not authorize a ledger cutover or remove the legacy writer."
trigger_phrases:
  - "Deep Research shadow parity"
  - "deep-research ledger migration"
  - "deep-research event parity"
  - "mode 010 shadow harness"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity"
    last_updated_at: "2026-07-15T15:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Read the leaf mold and Deep Research shadow-parity inputs"
    next_safe_action: "Freeze the mode event map and parity oracle against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research Shadow Parity

> Phase adjacency under `013-mode-and-lane-migrations` (independent planning contracts, not a hard runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 013 Deep Research mode fan-out; shadow-parity planning after the shared mode contracts and compatibility work |
| **Inputs** | Parent `065-deep-loop-innovation/spec.md`; `manifest/phase-tree.json`; `findings-registry.json`; `findings-registry-modes.json`; the phase-014 shadow framework named by the phase brief |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research currently runs a stateful autonomous loop whose observable lifecycle is `init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff`. The migration must add a typed event-ledger path without changing the behavior of packets already in flight or allowing a new writer to become authoritative before parity is proven. The parent program makes this additive, dark, non-authoritative rule explicit and assigns authority changes to the later staged cutover phase.

The research inputs identify the mode-specific risk. The current reducer reads the complete state log and reparses iteration markdown rather than performing the documented delta refresh (`findings-registry.json`, the reducer and deep-research command anchors cited at the finding). The mode findings also require a durable research-plan DAG, claim-evidence-contradiction history, living-resume invalidation, evidence admission before trusted reduction, and a synthesis view over versioned atomic claims (`findings-registry-modes.json`, deep-research recommendations). A shadow comparison that checks only the final report would miss event ordering, rejected evidence, contradiction history, resume decisions, and memory handoff drift.

This phase plans a mode-owned harness that invokes the legacy emitter and the new ledger adapter on the same frozen input and compares their canonical event projections event-for-event. It consumes the shared phase-014 shadow framework named in the phase brief and the compatibility bridge from the parent program, but owns only Deep Research's event map, fixtures, comparator, parity receipt, and gate inputs. No authority cutover occurs here.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Research lifecycle event map covering initialization, research-plan creation or revision, branch/query acquisition, source capture, evidence admission, claim and contradiction updates, reducer projection, next-focus selection, convergence evaluation, synthesis, resume, and memory-save handoff.
- A legacy-side adapter and ledger-side shadow adapter that execute against the same frozen run manifest, source snapshot, prompt/model/tool fingerprints, budget lease, and input state.
- A canonical comparison tuple for each mode event: event type, logical run and branch identity, step key, producer sequence, causal links, stable payload digest, and resulting projection fingerprint. Transport-only fields must be declared in an allowlist rather than silently ignored.
- Event-for-event diff reports that classify missing, extra, reordered, duplicated, payload, causal-link, receipt, artifact, projection, and terminal-decision differences.
- Fixtures for fresh runs, multi-branch research, rejected or quarantined evidence, contradiction and supersession, max-iteration incomplete runs, converged runs, crash and resume boundaries, source mutation refresh, synthesis, and memory-save handoff.
- A parity receipt bound to BASE, the run manifest, event-schema versions, reducer/projection versions, comparator configuration, fixture IDs, both stream digests, and all diff dispositions.
- A mode-gate input contract for successor `007-rollback-and-mode-gate`: parity must be green before any authority decision is considered.

### Out of Scope
- Flipping Deep Research authority from the legacy emitter to the ledger path; authority belongs to the later cutover work, not this shadow phase.
- Removing, rewriting, or deprecating the legacy emitter, legacy readers, existing iteration markdown, or archival packet behavior.
- Reimplementing the shared event envelope, transition-authorization gateway, upcasters, generic shadow transport, rollback controller, or other sibling mode schemas.
- Choosing final convergence thresholds, replacing the existing legal-stop behavior, or adding new research capabilities beyond the frozen phase-004 ledger and Deep Research recommendations.
- Treating a final `research.md` or terminal quality score as sufficient evidence when event history, claim provenance, resume state, or handoff receipts differ.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The harness runs both paths from identical frozen inputs | The legacy and ledger paths receive the same BASE, run manifest, source snapshot, prompt/model/tool fingerprints, initial state, and budget lease; the run is non-authoritative on both comparison sides |
| REQ-002 | The Deep Research lifecycle has a complete typed event map | Every transition from init through gather/analyze, convergence, synthesis, resume, and memory-save has a named mode event or an explicit shared-framework event mapping; no lifecycle step is compared only through prose |
| REQ-003 | Mode events compare event-for-event | After the declared canonicalization, event type, logical identity, sequence, causal links, stable payload, and projection fingerprint match at every position; missing, extra, reordered, duplicate, and payload differences fail parity |
| REQ-004 | Canonicalization cannot hide semantic drift | Volatile transport fields have a versioned allowlist and are excluded only with a reason; claim, evidence, contradiction, branch, next-focus, convergence, artifact, receipt, and handoff fields remain comparable |
| REQ-005 | Trusted research state has projection parity | Claim/evidence/contradiction versions, admission dispositions, active research-plan nodes, branch status, next-focus choice, convergence state, synthesis inputs, and final materialized outputs have identical canonical projections and fingerprints |
| REQ-006 | Resume behavior has parity with a fresh continuation | Crash or handoff fixtures compare legacy and ledger resume decisions, reuse/research choices, source-delta propagation, claim invalidation, branch IDs, event tails, and final projections without allocating an untracked new lease |
| REQ-007 | Failure and uncertainty remain fail-closed | Poisoned, malformed, unsupported, contradictory, stale, or insufficiently supported evidence produces the same quarantine, contested, incomplete, or blocked disposition on both paths; max-iteration exhaustion is not upgraded to converged |
| REQ-008 | Synthesis and memory-save handoff are auditable | The synthesized artifact, claim-edge set, citations, artifact digests, memory-save request, receipt references, and handoff terminal event match; no shadow-only output is mistaken for canonical authority |
| REQ-009 | Parity evidence is reproducible and bound | Each run records BASE, schema and reducer versions, comparator configuration, fixture ID, stream digests, projection fingerprints, exit status, and unexplained-diff disposition in a parity receipt |
| REQ-010 | Authority remains protected until the gate is green | The harness has an explicit non-authoritative mode, and any unexplained semantic diff, missing receipt, nondeterministic replay, or fixture failure blocks the successor mode gate and all cutover work |
<!-- /ANCHOR:requirements -->

### Shadow-parity acceptance contract

The mode is parity-green only when every required fixture produces a canonical legacy stream and ledger stream with equal event count, event order, event type, logical identity, stable payload, causal links, receipt references, and projection fingerprint. The comparator may ignore only fields named in the versioned volatility allowlist, such as process-local timing or transport correlation values; a field is not volatile merely because it is inconvenient to compare. Any allowlisted field must still be checked for presence, type, and non-interference with semantic identity.

The gate requires zero unexplained differences across the fresh-run, branch, evidence-admission, contradiction, convergence, synthesis, memory-save, crash-resume, and source-refresh fixtures. A tolerated difference is not a green result until it has a typed disposition, an owner, a reason, and proof that it cannot change trusted state or downstream authority. A missing or malformed parity receipt is a failure, not an empty result. The receipt is evidence for the later mode gate; it is not a cutover certificate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep Research event map covers the full `init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff` lifecycle and its resume and failure branches.
- **SC-002**: Legacy and ledger shadow streams match event-for-event after only the declared canonicalization, with zero unexplained semantic differences.
- **SC-003**: Claim, evidence, contradiction, plan, branch, convergence, synthesis, receipt, and memory-save projections are fingerprint-equivalent on every required fixture.
- **SC-004**: Crash/resume, source mutation, evidence quarantine, contradiction, and incomplete-run cases preserve fail-closed legacy behavior and deterministic ledger replay.
- **SC-005**: A parity receipt is reproducible, BASE-bound, and accepted by the successor mode-gate contract while explicitly leaving authority with the legacy path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity from terminal-only comparison** — a matching report can conceal different claim admission, contradiction, next-focus, or resume events. Mitigation: compare the canonical mode event stream and intermediate projection fingerprints.
- **Over-broad canonicalization** — excluding IDs, timestamps, or payload fields can hide duplicate work, branch drift, or altered evidence. Mitigation: maintain a reviewed allowlist and fail on unknown volatile fields.
- **Nondeterministic web and model inputs** — replaying live sources or fresh model calls invalidates the comparison. Mitigation: freeze source captures, prompt/model/tool fingerprints, run manifest, and input state for each fixture.
- **Legacy reducer behavior is more complete than its stated contract** — the findings record full-log and iteration-markdown rescans. Mitigation: use observed legacy output as the oracle while separately recording the intended typed projection.
- **Resume divergence** — a crash between effect, receipt, and state append can produce an uncertain handoff. Mitigation: include boundary fixtures, receipt matching, lease continuity, and explicit block/reconcile outcomes.
- **Cross-mode contract drift** — the 009 write-set conflict graph and shared event/schema contracts may change while this child is planned. Mitigation: bind the parity receipt to exact contract digests and reopen on relevant drift.
- **Authority leakage** — a shadow writer or projection accidentally changes the live path. Mitigation: assert non-authoritative flags, read-only comparison inputs, separate output paths, and no cutover mutation in this phase.
- **Dependencies**: the parent phase-012 shared mode contracts and write-set conflict graph; the compatibility and shadow framework from the parent program; the phase-014 shadow framework named in the phase brief; the existing Deep Research reducer, command, state, and artifact fixtures; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which shared phase-014 shadow-framework event envelope and comparator extension points are mandatory for a mode adapter, and which transport events remain outside the Deep Research stream?
- Which legacy fields are genuinely volatile, and which must become stable logical IDs or content digests before parity can be measured?
- What exact source snapshot, model response fixture, and memory-save transport fixture constitute the minimum reproducible corpus for live web and model nondeterminism?
- Which evidence-admission, contradiction, and source-refresh dispositions are protected legacy behavior versus deliberate defects to be addressed by later mode implementation phases?
- How should a ledger stream represent a legacy full-log rescan while preserving equivalent incremental projection semantics without treating implementation strategy as a tolerated mismatch?
- What parity receipt fields and failure severities does `007-rollback-and-mode-gate` require before it can authorize rollback readiness or any later cutover review?

These questions are planning boundaries, not permission to weaken parity. Until answered against the shared contracts and frozen fixtures, the safe disposition is blocked or indeterminate and the legacy path remains authoritative.
<!-- /ANCHOR:questions -->
