---
title: "Feature Specification: Deep Review resume adapter"
description: "Plan the Deep Review resume adapter for interruption-safe recovery from the sealed typed event ledger. The adapter folds the shared review-loop history through versioned reducers, maps the continuity ladder from scope through dimension passes, findings, convergence, and review-report, and re-enters idempotently without double-applying, losing, or replaying events."
trigger_phrases:
  - "deep review resume adapter"
  - "sealed ledger review resume"
  - "deep-review interruption recovery"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Framed sealed-ledger recovery around the shared review-loop contract"
    next_safe_action: "Resolve reducer and frontier bindings against the frozen shared contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review Resume Adapter

> Phase adjacency under the 002-deep-review parent (navigation/order only): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-review mode migration) |
| **Origin** | Phase 013 deep-review fan-out; resume-adapter concern from the typed ledger migration |
| **Planning authority** | Phase 012 shared review-loop contract, phase 012 mode contracts and write-set conflict graph |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Review runs a structured loop: establish review scope, execute per-dimension passes, emit candidate and proof evidence, converge, and materialize `review-report.md`. An interruption can currently leave the live process between an observation, a reducer application, a pass transition, or report materialization. Reconstructing state from a mutable summary or a last-completed marker can therefore repeat a pass, skip a committed finding, attach an event to the wrong revision, or publish a report that does not match the evidence.

This phase plans a **resume adapter** whose only authoritative input is the sealed event-ledger frontier. It must fold the accepted ledger through the shared reducers, rebuild the Deep Review continuity ladder, and return an explicit re-entry decision for the next safe operation. The adapter must preserve raw `FindingCandidate`, challenge, proof, disposition, convergence, and report events while keeping P0/P1/P2 as a derived presentation projection over orthogonal evidence fields. It must also distinguish compatible reuse from re-execution, compensation, or rejection when the replay fingerprint or artifact receipt does not match.

The adapter consumes the review-loop backbone frozen in phase 012 and the shared mode contract emitted by phase 012. It does not fork the loop for Deep Review, move authority, or solve the other six sibling concerns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A sealed-frontier recovery contract for Deep Review that validates ledger ordering, event-chain integrity, schema versions, reducer versions, and the replay-compatibility fingerprint before producing state.
- A deterministic reducer fold that reconstructs scope, dimension coverage, pass cursors, finding lifecycle, proof status, convergence inputs, and report materialization state without reading mutable live summaries as authority.
- A continuity-ladder mapping from `scope` to active dimension/cell, candidate and proof obligations, convergence, and `review-report`, including explicit incomplete, contested, blocked, and terminal states.
- An idempotent re-entry planner keyed by manifest revision and stable logical pass or effect identity, with no double-apply, lost event, or automatic replay of an already committed external effect.
- Crash-boundary behavior for interruption before append, after append, during reducer application, after proof receipt, during convergence, and during report projection.
- Compatibility with the shared review-loop contract from phase 012 and the phase-012 dependency/write-set conflict graph; this phase consumes those contracts rather than defining a Deep Review fork.

### Out of Scope
- The Deep Review typed ledger schema, reducer implementation, sealed artifacts, certificates, shadow parity, or mode gate owned by sibling concerns `001-typed-ledger-schema` through `004-certificates-and-receipts` and `006-shadow-parity`.
- The six other mode migrations, the shared mode contract itself, or changes to the phase-012 conflict graph.
- Authority cutover, in-flight state migration, legacy-writer retirement, or the whole-system gate.
- New review dimensions, new P0/P1/P2 semantics, or a second resume path based on mutable JSONL summaries.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recovery uses only the sealed ledger frontier and versioned reducers | A recovery run rejects an unsealed, truncated, hash-invalid, or incompatible frontier and never falls back to a mutable summary |
| REQ-002 | Reducer folding is deterministic and complete | Replaying the same sealed prefix produces the same state fingerprint, coverage cells, lifecycle states, and next action across process restarts |
| REQ-003 | The continuity ladder is explicit | Recovered state identifies the last sealed scope, pass/cell cursor, candidate and proof obligations, convergence status, and report status with no ambiguous cursor |
| REQ-004 | Re-entry is idempotent | Repeating a resume request for the same frontier and manifest revision produces one logical resume decision and no duplicate reducer application or report event |
| REQ-005 | Event loss and unsafe replay are fail-closed | Missing sequence, duplicate event ID with different content, replay-fingerprint drift, and unknown external-effect outcome produce a blocked or reconcile decision rather than silent progress |
| REQ-006 | Resume decisions use stable logical identities | Pass, finding, proof, and effect decisions retain stable logical IDs while attempt IDs may change; changed manifests cannot inherit success by label alone |
| REQ-007 | Deep Review findings preserve evidence semantics | Raw candidates and proof receipts remain immutable; impact, confidence, evidence kind, reachability, lifecycle, and P0/P1/P2 presentation remain distinguishable after recovery |
| REQ-008 | The adapter shares the frozen loop backbone | The design references the phase-012 review-loop contract and phase-012 write-set ownership, with no mode-local lifecycle or conflicting event application path |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sealed ledger interrupted after any committed review boundary folds to the same state and next safe action as an uninterrupted run.
- **SC-002**: A resume request never re-applies a committed event or report projection, and it never silently skips an event in the sealed frontier.
- **SC-003**: The continuity ladder exposes the exact unresolved dimension, candidate/proof obligation, convergence decision, or report projection that owns re-entry.
- **SC-004**: Re-entry refuses incompatible manifest or replay fingerprints and distinguishes reuse, re-execute, compensate, reconcile, and reject outcomes.
- **SC-005**: The adapter preserves the shared phase-012 loop semantics and the phase-012 write-set boundaries without introducing a Deep Review-only backbone.
- **SC-006**: The resume contract is ready for the later shadow-parity and mode-gate checks without moving authority or changing legacy behavior.

**Given** a sealed frontier ending after a dimension pass emitted candidates but before proof admission, **When** the adapter resumes, **Then** it reopens only the unresolved proof obligations and preserves the candidate events exactly once.

**Given** a crash after a proof receipt was committed and before convergence projection, **When** the same frontier is folded again, **Then** the proof remains committed, convergence is evaluated from the folded state, and no proof or finding is duplicated.

**Given** a changed manifest revision or replay fingerprint, **When** a prior successful pass is encountered, **Then** the adapter returns a compatibility decision instead of inheriting success by label.

**Given** a missing or conflicting event in the claimed sealed range, **When** recovery begins, **Then** it blocks before scheduling a new pass and emits an auditable refusal reason.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Reducer drift** — a reducer version change can reinterpret old events. Mitigation: bind the fold to the persisted reducer and replay fingerprints, and route incompatible histories to an explicit migrate, pin, or reject outcome.
- **False exactly-once claims** — a remote verifier may have run before its receipt was appended. Mitigation: preserve `unknown` effect state, require receipt lookup or compensation policy, and never infer completion from process position.
- **Cursor ambiguity** — a last-pass marker can hide partially committed cells or late proof events. Mitigation: derive the cursor from ordered logical IDs, event sequence, and the sealed frontier, not from a mutable summary.
- **Finding identity drift** — line movement, renames, or paraphrased descriptions can create duplicates or unsafe merges. Mitigation: consume reducer-owned versioned partial fingerprints and explicit introduced/fixed/preexisting lineage.
- **Backbone fork** — a mode-local resume state machine could diverge from shared loop semantics. Mitigation: phase 012 is the lifecycle authority and owns interface and write-set boundaries.
- **Report mismatch** — a report projection may be materialized before all required evidence is admitted. Mitigation: make report state a derived terminal projection with a sealed input frontier and a report idempotency key.

Dependencies are contract-level rather than sibling runtime dependencies: phase 012 must freeze the shared review-loop contract, publish mode interfaces, and publish the conflict graph, and the Deep Review sibling concerns must expose the typed events, reducers, and certificates consumed by this adapter. The required adjacency to `004-certificates-and-receipts` and `006-shadow-parity` is navigation and ordering only.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact sealed-frontier marker and chain-integrity receipt does phase 012 expose to mode adapters?
- Does the shared reducer contract return a typed continuity ladder directly, or does this adapter publish the Deep Review-specific projection from shared reducer primitives?
- Which replay-fingerprint mismatch outcomes are `pin-old-runtime`, `migrate`, `reconcile`, or `reject` for each proof and report effect?
- What minimum event set is required before `review-report` can be materialized, and which incomplete state is retained when a required proof remains contested?
- How does the phase-012 write-set graph serialize concurrent resume requests for the same review lineage while allowing independent lineages to proceed?
<!-- /ANCHOR:questions -->
