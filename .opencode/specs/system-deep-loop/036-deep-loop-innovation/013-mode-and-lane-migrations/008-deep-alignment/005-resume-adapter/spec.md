---
title: "Feature Specification: Deep Alignment - Resume Adapter"
description: "Plan the Deep Alignment resume adapter for interruption-safe recovery from the sealed typed event ledger. The adapter folds shared reducers, rebuilds the continuity ladder for authority-bound per-lane conformance, and defines idempotent re-entry without double-applying, losing, or replaying events."
trigger_phrases:
  - "deep alignment resume adapter"
  - "deep-alignment sealed-ledger resume"
  - "verify-first alignment recovery"
  - "idempotent conformance re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped ledger-only recovery for authority-bound alignment lanes"
    next_safe_action: "Map shared review events to the alignment continuity ladder"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Resume Adapter

> Phase adjacency under `008-deep-alignment` (independent planning contracts, not runtime dependencies): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Alignment mode migration) |
| **Origin** | Phase 013 Deep Alignment fan-out; resume-adapter concern from the typed ledger migration |
| **Planning authority** | Phase 012 shared review-loop contract, shared mode contracts, and the emitted write-set conflict graph |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Alignment evaluates each lane against a named authority. A run binds an authority capsule and epoch, resolves
applicability, discovers immutable subject snapshots, records raw observations, verifies candidate findings, evaluates proof
witnesses, applies visible deviations, and derives a conformance result. An interruption can occur between any of those
boundaries. A mutable last-action note or current authority file cannot establish whether an observation, proof, deviation,
or report projection was already committed, nor whether it remains comparable under a changed authority or verifier.

This phase plans a **Resume Adapter** whose only authoritative input is the sealed ledger frontier. It must validate the seal,
fold the accepted event prefix through the shared reducers, and rebuild the Deep Alignment continuity ladder from authority
binding through lane completion and terminal handoff. Re-entry must distinguish reusable compatible evidence from affected
re-execution, reconciliation, compensation, or rejection. It must preserve raw detector observations, proof-carrying
verification, authority compatibility, applicability, and deviation events as immutable facts while deriving lane verdicts and
conformance presentation from the folded state.

The adapter reuses the shared review-loop backbone frozen for Deep Review mode 002 in phase 012. The per-mode migration
execution lands only after the shared contracts and write-set conflict graph are frozen. This phase is planning only: it does
not define the shared backbone, implement the six sibling concerns, move authority, or solve the mode gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A sealed-frontier recovery contract that validates ledger ordering, event-chain integrity, schema and reducer versions,
  authority epoch references, subject digests, evidence receipts, and the replay-compatibility fingerprint before folding.
- A deterministic shared-reducer fold that reconstructs authority validity, lane plan and cursor, subject applicability,
  discovery and observation coverage, candidate and verification lifecycle, proof obligations, deviation overlays, convergence,
  and terminal handoff state without using mutable summaries as authority.
- A continuity-ladder mapping from run and authority identity through lane, rule, subject, observation, finding, proof,
  adjudication, deviation, convergence, and report or handoff state, with one owning logical identity and next safe action.
- An idempotent re-entry planner keyed by lineage, sealed frontier, manifest revision, authority epoch, verifier digest, and
  replay fingerprint, with stable logical IDs and changing attempt IDs.
- Explicit `reuse`, `reexecute`, `reconcile`, `compensate`, `migrate`, `pin-old-runtime`, `reject`, and `block` outcomes for
  compatible, changed, incomplete, unknown-effect, and incompatible evidence.
- Crash-boundary behavior before append, after append, during reducer application, after evidence or proof receipt, during
  adjudication or convergence, and during report or terminal projection.
- Compatibility with the phase-012 shared review-loop contract and the write-set conflict graph; Deep Alignment adds mode
  projections and payload bindings without introducing a second lifecycle.

### Out of Scope
- The Deep Alignment event union, reducer algorithms, projections, authority capsule compiler, sealed artifacts, certificates,
  receipts, shadow parity, rollback switch, or mode gate owned by the sibling concerns.
- Reimplementation of the transition-authorized ledger, replay registry, receipt/effect-recovery service, shared review-loop
  lifecycle, shared continuity identity, or write-set conflict graph.
- Authority cutover, in-flight state migration, legacy-writer retirement, whole-system verification, or production code.
- New authority sources, verifier algorithms, rule semantics, remediation behavior, or a Deep Alignment-specific review loop.
- A fallback that rebuilds control state from current authority files, mutable summaries, filesystem discovery, or process memory.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recovery uses only the sealed ledger frontier and versioned reducers | Unsealed, truncated, hash-invalid, authority-incompatible, or reducer-incompatible input blocks before new work is scheduled; mutable summaries are never an authority fallback |
| REQ-002 | Reducer folding is deterministic and complete | The same sealed prefix produces the same authority, lane, evidence, obligation, terminal state, projection fingerprint, and next action across process restarts |
| REQ-003 | The continuity ladder is explicit | Recovery identifies the owning authority epoch, lane, rule or subject cursor, unresolved evidence, proof obligation, convergence state, and terminal or handoff state with no ambiguous cursor |
| REQ-004 | Re-entry is idempotent | Repeating a resume request for the same lineage and frontier returns one logical decision with no duplicate reducer application, event, proof, or report projection |
| REQ-005 | Event loss and unsafe replay fail closed | Missing sequence, conflicting duplicate, replay-fingerprint drift, stale receipt, unknown external effect, and uncovered applicability edge produce block, reconcile, migrate, or reject rather than silent progress |
| REQ-006 | Stable identities survive attempts and authority changes | Logical lane, epoch, rule, subject, observation, finding, proof, effect, and resume-request identities remain stable; attempt IDs may change only for an authorized re-entry |
| REQ-007 | Verify-first alignment semantics survive recovery | Authority invalidity blocks conformance; `not_applicable`, `unresolved`, `inconclusive`, `untested`, and `blocked` remain explicit; detector candidates cannot become blocking findings without independent proof |
| REQ-008 | Deviations remain visible chronological facts | A deviation is an append-only overlay bound to authority epoch, subject, scope, verifier, issuer, evidence, and expiry; it never erases the original observation and can reactivate after drift |
| REQ-009 | Shared review-loop behavior is reused | Deep Alignment consumes the phase-012 run, resume, scope, pass, convergence, blocked-stop, continuity, and terminal semantics with namespaced payloads, not a mode-local lifecycle |
| REQ-010 | The adapter is ready for shadow parity without authority movement | Resume decisions, projection fingerprints, receipts, and refusal reasons are deterministic inputs for `006-shadow-parity`; the adapter cannot authorize cutover or rewrite legacy state |
<!-- /ANCHOR:requirements -->

### Deep Alignment continuity-ladder mapping

| Ladder level | Sealed evidence | Reducer projection | Re-entry rule |
|--------------|-----------------|--------------------|---------------|
| Authority and run identity | Run, manifest, authority capsule, epoch, compiler, verifier, and replay references | Stable lineage, authority validity, epoch compatibility, and run status | Reuse only with exact compatible identity; otherwise migrate, pin, or block |
| Lane and scope | Lane plan, rule subset, subject-set digest, applicability and budget references | Ordered lane cursor, scope closure, applicability status, and required obligations | Reuse complete compatible lane; re-enter only unresolved or affected logical work |
| Observation and evidence | Discovery manifest, subject snapshot, raw observation, content-bound receipt, freshness, and source digest | Evidence index, coverage, freshness, and unresolved evidence | Reuse verified receipts; reconcile stale or unknown observations before re-probe |
| Finding and proof | Candidate, verifier result, witness matrix, proof receipt, impact, confidence, and counter-evidence | Verify-first finding lifecycle and proof obligations | Reuse proof only when authority, subject, verifier, and replay fingerprints match |
| Adjudication and deviation | Conformance assessment, deviation assertion, issuer, expiry, invalidation, and compatibility references | Visible verdict overlay, exception status, and reactivation triggers | Preserve original facts; re-adjudicate after relevant epoch, verifier, scope, or subject drift |
| Convergence and handoff | Shared convergence, blocked-stop, continuity, report, and terminal events | Lane and mode terminal status, blockers, next action, and handoff frontier | Reuse sealed projection; create a new immutable projection for a changed frontier |
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An interrupted Deep Alignment run folds from its sealed frontier to the same authority, lane, evidence, proof,
  deviation, convergence, and next-action state as an uninterrupted replay.
- **SC-002**: A resume request never re-applies a committed event, proof, deviation, effect, or projection, and it never
  silently skips an event in the sealed frontier.
- **SC-003**: The continuity ladder exposes the exact authority, lane, subject, evidence, proof, adjudication, convergence,
  or handoff boundary that owns re-entry.
- **SC-004**: Authority, subject, verifier, artifact, reducer, schema, or manifest drift selects an explicit compatibility or
  recovery outcome rather than inheriting prior conformance by label.
- **SC-005**: Branch-local lane successes and valid receipts survive recovery; only missing or affected work is selected for
  re-entry, and unknown external effects remain blocked or reconciled.
- **SC-006**: The adapter preserves phase-012 shared review-loop semantics and produces the deterministic inputs required by
  later shadow parity and mode-gate checks without moving authority.

**Given** a sealed frontier ending after a lane records observations and candidates but before independent proof admission,
**When** the adapter resumes, **Then** it preserves each raw observation once and reopens only unresolved proof obligations.

**Given** a proof receipt and conformance assessment are committed before a crash during convergence, **When** the same frontier
is folded again, **Then** proof and assessment remain committed and no external verifier or proof effect is repeated.

**Given** the authority epoch, subject digest, or verifier fingerprint changes after an earlier successful lane, **When** resume
encounters that lane, **Then** it returns an affected, migrate, pin, or reject decision instead of inheriting conformance.

**Given** a missing or conflicting event in the claimed sealed range, **When** recovery begins, **Then** it blocks before lane
execution and emits an auditable refusal reason tied to the last valid frontier.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Authority drift** - A readable authority path may be expired, rolled back, mixed across epochs, or incompletely compiled.
  Mitigation: bind recovery to the sealed authority capsule, epoch, compiler, verifier, expiry, and compatibility records.
- **Reducer drift** - A changed reducer can reinterpret an old observation or deviation. Mitigation: persist reducer and replay
  fingerprints and route incompatible histories to migrate, pin, reconcile, or reject.
- **False exactly-once claims** - An external re-probe or proof may have run before its receipt was appended. Mitigation: retain
  an explicit unknown effect state and use receipt lookup or compensation policy; never infer completion from process position.
- **Applicability collapse** - A missing discovery edge can look like perfect coverage. Mitigation: fold declared applicability,
  unresolved obligations, and authoritative versus observed coverage separately.
- **Finding identity drift** - Subject, rule, verifier, or authority changes can duplicate or incorrectly merge findings.
  Mitigation: use stable logical identities, content digests, impact components, and explicit compatibility classes.
- **Deviation erasure** - A current exception can hide a historical failure or obsolete verifier. Mitigation: append visible,
  expiring deviation overlays and replay affected witnesses after relevant drift.
- **Review/alignment fork** - A local lifecycle would violate shared write-set assumptions. Mitigation: phase 012 owns review-loop
  transitions; this adapter owns only mode-specific projection and re-entry mapping.
- **Scope creep** - Resume planning can absorb certificates, shadow parity, or cutover behavior. Mitigation: enforce sibling
  ownership and keep this phase non-authoritative.

Dependencies are contract-level: the phase-006 ledger core, phase-012 shared event and review-loop contracts, the shared mode
contract and write-set graph emitted before the per-mode migration fan-out, Deep Alignment siblings `001-typed-ledger-schema`
through `004-certificates-and-receipts`, the Deep Review shared-backbone contract, and later `006-shadow-parity`. The required
adjacency is navigation and ordering, not a hard runtime dependency.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-012 seal marker, frontier digest, reducer registry, and terminal event fields are exposed to both Deep Review
  and Deep Alignment adapters?
- Which shared reducer outputs are sufficient for the alignment continuity ladder, and which mode projection fields must remain
  namespaced without duplicating lifecycle semantics?
- Which authority, subject, verifier, and evidence changes classify a prior lane as reusable, affected, migratable, pinned, or
  blocked, and how does the write-set graph serialize same-lineage resume requests?
- Which external re-probe and proof adapters support idempotency-key lookup or compensation, and which must remain unknown until
  an explicit recovery decision is recorded?
- What minimum closure evidence is required before a lane or mode handoff can be projected, and which unresolved applicability,
  witness, deviation, or authority conditions force `INCONCLUSIVE` or `BLOCKED`?

These questions are implementation inputs for the frozen shared contracts and sibling concerns. They do not authorize a local
Deep Alignment loop, a mutable-summary fallback, authority movement, or a best-effort replay.
<!-- /ANCHOR:questions -->
