---
title: "Feature Specification: Deep Review shadow parity"
description: "Plan the Deep Review migration from the legacy scope -> per-dimension passes -> P0/P1/P2 findings -> convergence -> review-report flow to the typed event-ledger substrate. The new path runs in shadow beside the legacy emitter, compares normalized projections event-for-event, and remains non-authoritative until every parity and fail-closed cutover criterion is green."
trigger_phrases:
  - "Deep Review shadow parity"
  - "deep-review event ledger migration"
  - "deep-review legacy emitter parity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
    last_updated_at: "2026-07-15T20:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Review shadow parity and event-level acceptance gates"
    next_safe_action: "Implement the parity fixture matrix after shared contracts are frozen"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review Shadow Parity
> Phase adjacency under the 013 parent (grouping order, not a runtime dependency): predecessor `005-resume-adapter`; successor `007-rollback-and-mode-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Review mode migration) |
| **Origin** | Phase 009 of the 013 per-mode migration workstream; operator brief for typed-ledger shadow parity |
| **Inputs** | Parent program spec; phase tree; phase-012 shared review-loop contract; phase-014 shadow framework; the two effectiveness/fan-out findings registries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Review currently follows a recognizable loop: establish review scope, run per-dimension passes, emit P0/P1/P2 findings, decide convergence, and write `review-report`. The migration must preserve that behavior while moving durable state and decisions onto the typed event-ledger substrate. A direct authority swap would risk losing finding lineage, changing severity or report ordering, or allowing a new reducer to treat an unverified candidate as a verdict.

This phase plans a **shadow-parity harness**, not an authority cutover. For the same frozen input, contract versions, source revision, dimension set, and execution manifest, the legacy emitter remains authoritative while the new ledger path records its typed events and projections beside it. A comparator normalizes only explicitly non-semantic fields and then diffs the two paths event-for-event and projection-for-projection. Every mismatch is retained as evidence and blocks promotion until classified and resolved.

The mode shares its loop backbone with deep-alignment. It must consume the shared review-loop contract frozen in phase 012 rather than fork a Deep Review-specific loop state machine. It also consumes the generic shadow framework from phase 014 for paired execution, replay, health evidence, and degeneration handling. Deep Review-specific work is limited to its finding lifecycle, severity/confidence separation, review-report projection, and parity gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep Review shadow runner that invokes the legacy emitter and typed-ledger path from the same immutable input envelope without changing legacy authority.
- A mode adapter mapping scope, dimension-pass, candidate, validation, severity, convergence, and review-report transitions into the shared typed event vocabulary.
- A canonical parity projection keyed by review lineage, stable finding fingerprint, dimension, evidence references, disposition, and report position.
- Event-for-event comparison with explicit handling for missing, extra, reordered, duplicated, stale, and payload-divergent events.
- Projection comparison for findings, P0/P1/P2 impact, independent confidence and evidence attributes, convergence state, report ordering, receipts, checkpoints, and replay fingerprints.
- Fixture coverage for clean reviews, multiple dimensions, duplicate candidates, finding updates, fixed and pre-existing findings, inconclusive validation, convergence, resumed runs, and deterministic replays.
- A fail-closed parity certificate and mode gate input consumed by `007-rollback-and-mode-gate`; no authority change is performed here.

### Out of Scope
- Flipping Deep Review authority from the legacy emitter to the ledger path; that belongs to the mode gate and later staged cutover.
- Implementing rollback mechanics, in-flight state migration, or the shared adapter framework; this phase supplies parity evidence to those contracts.
- Forking the review-loop backbone for Deep Review or changing deep-alignment's implementation.
- Re-running the research or adding new review capabilities beyond the findings and contracts assigned to this mode.
- Changing the meaning of P0/P1/P2 into a confidence score. Impact remains an independent axis; confidence, reachability, exploitability, evidence strength, and evidence scope remain separate fields.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Paired execution uses one frozen input and contract envelope | Legacy and shadow paths receive identical source revision, scope, dimension manifest, prompt/model/tool fingerprints, budget snapshot, and replay-compatibility fingerprint |
| REQ-002 | Deep Review transitions use the shared review-loop contract | The adapter consumes the phase-012 vocabulary and shared phase-014 shadow runner; no mode-local substitute state machine is introduced |
| REQ-003 | The full Deep Review lifecycle is represented | Scope, per-dimension pass, candidate, validation, impact classification, convergence, and review-report projection have typed lineage-preserving events |
| REQ-004 | Finding identity survives cross-pass and cross-revision comparison | The comparator uses versioned partial fingerprints from stable semantic anchors, normalized source context, program slices, and rename mapping; absolute line movement alone does not create a new finding |
| REQ-005 | Severity and evidence remain orthogonal | P0/P1/P2 is compared as impact; confidence, reachability, exploitability, evidence strength, evidence scope, and validation disposition are compared independently |
| REQ-006 | Shadow output matches legacy output event-for-event | After the declared normalization, every expected event has one matching type, causal position, identity, and payload; missing, extra, reordered, duplicate, and divergent events fail parity |
| REQ-007 | Materialized projections match | Findings, dispositions, convergence, report ordering, receipts, checkpoint state, and replay fingerprints are equal for every required fixture; no silent projection repair is allowed |
| REQ-008 | Replay and resume preserve parity | Replaying the same paired run and resuming from each supported checkpoint produce the same normalized event stream and projection as the original run |
| REQ-009 | Shadow failures are observable and non-authoritative | Every mismatch emits a typed discrepancy record with fixture, event sequence, projection, contract versions, and classification; the legacy result remains authoritative and the shadow path cannot publish a report |
| REQ-010 | Parity is a hard pre-cutover condition | The mode gate receives a signed or content-addressed parity certificate with zero unexplained diffs, complete fixture coverage, deterministic replay, and no open P0/P1 discrepancies; otherwise authority cutover is refused |
<!-- /ANCHOR:requirements -->

### Shadow-parity acceptance contract

The harness is green only when all required fixtures pass with **zero unexplained event or projection differences**. Normalization may remove transport timestamps, process-local paths, and generated attempt identifiers only when the shared contract declares them non-semantic and preserves their causal position. It must not normalize away event type, sequence, lineage, finding identity, severity, evidence, disposition, receipt references, convergence state, or report order.

The comparator reports four separate verdicts: event-stream parity, projection parity, replay/resume parity, and safety parity. Safety parity requires that both paths reject the same invalid transition class, that a shadow mismatch never authorizes a ledger transition, and that the legacy emitter remains the only publication authority. A failed or incomplete verdict is `PARITY_BLOCKED`, not an implicit pass. The mode gate may consume only a certificate whose fixture digest, contract fingerprints, comparator version, and candidate SHA match the run under review.
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep Review adapter runs legacy and typed-ledger paths from the same frozen input and shared review-loop contract without changing legacy authority.
- **SC-002**: Required lifecycle events compare event-for-event after only the declared semantic normalization; zero unexplained missing, extra, reordered, duplicate, or divergent events remain.
- **SC-003**: The ledger projection preserves stable finding identity, independent impact and evidence axes, finding lineage, convergence, receipts, checkpoints, and review-report ordering.
- **SC-004**: Clean, defective, duplicate, updated, inconclusive, resumed, and replayed fixtures pass event, projection, replay/resume, and safety parity.
- **SC-005**: A content-addressed parity certificate records the exact fixture and contract inputs and refuses issuance for any open P0/P1 discrepancy or incomplete coverage.
- **SC-006**: `007-rollback-and-mode-gate` can use this certificate as a blocking input, while no authority cutover occurs in this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False parity through over-normalization** — removing timestamps or IDs can accidentally hide causal or identity changes. Mitigation: maintain an allowlisted normalization schema and compare raw evidence references, fingerprints, sequence positions, and payload hashes separately.
- **Finding identity drift** — line movement, renames, or reformatted context can split one finding or merge two findings. Mitigation: use versioned partial fingerprints, program-slice anchors, and explicit introduced/fixed/pre-existing lineage fixtures.
- **Candidate/verdict collapse** — a review pass can emit a candidate before independent validation. Mitigation: preserve candidate, validation, impact, confidence, and publication dispositions as separate events and projections.
- **Shared-loop divergence** — Deep Review and deep-alignment could silently acquire different lifecycle semantics. Mitigation: consume the phase-012 shared review-loop contract and reject mode-local event vocabulary additions unless the shared contract owns them.
- **Shadow path becomes authoritative by accident** — a parity writer might publish a report or mutate legacy state. Mitigation: separate shadow output storage, deny publication capabilities, and assert legacy authority in every fixture.
- **Incomplete parity corpus** — happy-path equality can miss resume, duplicate, stale, or invalid-transition differences. Mitigation: make the phase-014 fault and replay matrix a required input and fail the certificate on missing fixture classes.
- **Dependencies**: phase-012 shared review-loop contract; phase-014 shadow framework; typed ledger, authorization, receipts, fingerprints, and projection contracts from the shared program; the adjacent `005-resume-adapter` and `007-rollback-and-mode-gate` folders are navigation points, not hard runtime dependencies for this planning contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which legacy transport fields are formally non-semantic and may be normalized, and which generated identifiers must remain comparable through a stable mapping?
- Does the shared event namespace require one Deep Review event per legacy emission, or may several legacy emissions map to one typed event when the projection retains a lossless source span?
- What exact fixture minimum does phase 014 require for mode-level shadow certificates, and which additional Deep Review cases are mandatory for P0/P1 evidence?
- Which report serialization fields are contractually ordered, and which may be compared as keyed sets while retaining a separate ordering check?
- What certificate signer or content-addressing mechanism is selected by the shared mode gate, and how is an invalidated comparator version represented?
<!-- /ANCHOR:questions -->
