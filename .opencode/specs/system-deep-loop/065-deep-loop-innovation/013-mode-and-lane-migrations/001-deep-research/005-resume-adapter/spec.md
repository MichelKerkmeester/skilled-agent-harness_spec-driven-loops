---
title: "Feature Specification: Deep Research - Resume Adapter"
description: "Plan the Deep Research resume adapter over the sealed typed event ledger: rebuild interrupted live state through the mode reducers, map the continuity ladder to typed lifecycle state, and re-enter idempotently without double-applying, losing, or replaying semantic events."
trigger_phrases:
  - "deep research resume adapter"
  - "deep-research ledger resume"
  - "deep research idempotent re-entry"
  - "deep research continuity ladder"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-15T19:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped resume reconstruction to sealed-ledger reducers and continuity decisions"
    next_safe_action: "Freeze re-entry identity and continuity mapping against the shared resume contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Resume Adapter

> Phase adjacency under the Deep Research parent (navigation order, not a hard runtime dependency): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-research mode migration) |
| **Origin** | Fifth Deep Research child in the phase-010 mode migration fan-out |
| **Depends on** | `[]` in `manifest/phase-tree.json`; sibling adjacency is navigation only |
| **Consumes** | Shared phase-009 mode/replay contracts, typed ledger events, reducers, sealed references, and certificate/receipt outputs |
| **Output** | A ratifiable resume-adapter contract, continuity-ladder mapping, recovery decision algebra, and idempotent re-entry fixture plan |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research is an autonomous loop with a live path of `init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff`. An interruption can occur after a side effect, after a ledger append, between a sealed artifact and its reference event, or while a reducer checkpoint is being advanced. The current continuity surface is distributed across configuration, JSONL state, iteration artifacts, reducer output, synthesis output, and memory handoff state. Reading whichever file looks newest cannot distinguish a committed semantic transition from an observed but uncommitted operation.

The shared migration contract changes the authority boundary: the sealed typed event ledger is the source of resumable facts, and the Deep Research reducers reconstruct the mode projection from that ledger. The adapter must map the existing continuity ladder to the reconstructed projection, choose a safe re-entry action for each logical branch and effect, and append the decision before work restarts. It must preserve stable logical identities across process restarts while keeping attempt identities distinct. A changed manifest, replay fingerprint, source version, or reducer contract must not inherit prior success by label alone.

The research inputs make this boundary concrete. Deep Research requires a versioned executable research-plan DAG, a claim-evidence-contradiction ledger, living-resume invalidation through dependency edges, evidence admission before trusted reducer state, and a materialized synthesis view over immutable claim history. The runtime findings require `reuse | reexecute | compensate | reject` resume decisions, a root `RunLease`, effect receipts with an explicit unknown state, and a versioned replay-compatibility registry. This phase plans the adapter that joins those contracts; it does not implement a second reducer, seal, certificate, shadow harness, or authority switch.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A ledger-only resume read path that verifies the sealed ledger tail, reducer checkpoint, projection fingerprint, and referenced sealed artifacts before constructing live state.
- A continuity-ladder mapping from `run_initialized`, plan/frontier, iteration/branch, evidence/claim, convergence, synthesis, and memory-save events to the state needed by the Deep Research entry points.
- A deterministic recovery planner with explicit `reuse`, `reexecute`, `compensate`, `reconcile`, `reject`, and `blocked` outcomes, including per-logical-branch and per-effect reasons.
- Replay-fingerprint compatibility decisions for the original manifest, reducer version, adapter version, schema and codec versions, source/reference set, and policy versions; changed-manifest execution is distinct from original-run replay.
- Stable root `RunLease` reuse through resume, logical branch and effect identity preservation, attempt identity allocation, and retry-history keys based on manifest revision plus logical identity.
- Idempotent re-entry rules for partial ledger appends, duplicate resume requests, completed branches, unknown effects, source mutations, interrupted convergence, incomplete synthesis, and memory-save handoff retries.
- Mode-specific fixtures and acceptance evidence for crash points, duplicate delivery, late events, source refresh, incompatible versions, and ledger-only reconstruction while the new path remains dark and non-authoritative.

### Out of Scope
- Defining the shared event envelope, transition vocabulary, ledger storage, replay fingerprint primitive, seal descriptor, receipt schema, or reducer algebra; those are owned by earlier shared or sibling phases.
- Re-implementing Deep Research reducers, projections, claim admission, semantic clustering, convergence policy, synthesis generation, source refresh, or memory persistence; the adapter consumes their typed outputs and handoff contracts.
- Creating or validating sealed artifacts, certificates, boundary receipts, shadow-parity comparisons, rollback drills, the independent mode gate, or the phase-011 authority cutover.
- Rewriting legacy JSONL, migrating arbitrary in-flight packets, deleting legacy readers, or treating a mutable iteration file, report, URL, or cache entry as resume authority.
- Adding new Deep Research behavior beyond the recommendations assigned to this mode and the shared resume/replay contracts.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resume rebuilds live Deep Research state from the sealed ledger through the mode reducers | A ledger-only fixture reconstructs the run, frontier, branch states, evidence/claim references, convergence status, synthesis status, and memory handoff status without consulting mutable files as authority |
| REQ-002 | The continuity ladder maps every resumable lifecycle boundary to typed state | A mapping covers initialization, plan/frontier, gather, analyze, convergence, synthesis, memory-save, and terminal/incomplete outcomes with the owning event family, reducer field, and re-entry action |
| REQ-003 | Replay compatibility is explicit and fail-closed | Exact, compatible, migrate, pin-old-runtime, and blocked outcomes are evaluated from persisted fingerprints; the selected outcome is appended as an immutable resume decision and unknown versions never fall through to reuse |
| REQ-004 | Re-entry decisions use stable logical identity and manifest revision | Each logical branch receives one of `reuse`, `reexecute`, `compensate`, or `reject`, retry history is keyed by `manifestRevision + logicalLeafId`, and only approved reexecute branches enter the execution pool |
| REQ-005 | External effects cannot be silently duplicated or lost | The adapter folds effect receipts and adapter capabilities into `reconcile`, `reexecute`, `compensate`, or `blocked`; an unknown irreversible effect is never automatically retried and every decision retains effect and attempt references |
| REQ-006 | Resume is idempotent under duplicate requests and crash windows | Repeating the same resume request produces no second semantic application, preserves `lastAppliedSeq` and seen event identities, and creates no duplicate branch, claim, synthesis, or memory-save transition |
| REQ-007 | The root lease and continuity identity survive process restart | Resume reuses the persisted `RunLease`, remaining deadline, lineage, generation, and replay fingerprint; it never allocates a fresh lease or silently starts a new lineage for the same run |
| REQ-008 | Evidence and claim drift reopens only affected work | A changed source digest, retraction, admission revision, or claim dependency invalidates affected claim versions and dependent synthesis inputs while unaffected branches remain reusable and historical evidence stays append-only |
| REQ-009 | Original-run replay and changed-manifest execution are distinct | A fixture proves the original frozen manifest can resume under compatible fingerprints, while a changed manifest produces an explicit fork/restart/reject decision and cannot inherit old retry credit or success by label |
| REQ-010 | The adapter remains additive-dark and non-authoritative | The plan contains no legacy-writer deletion or authority flip; resume failure blocks or quarantines the dark path without mutating legacy state or presenting a dark result as production completion |
<!-- /ANCHOR:requirements -->

### Continuity-ladder mapping

| Continuity step | Ledger evidence folded by reducers | Resume adapter action |
|-----------------|-------------------------------------|-----------------------|
| `init` | `run_initialized`, configuration/replay references, root lease, lineage and generation | Verify compatibility and references; emit one `run_resumed` decision or a blocked result |
| Plan/frontier | Research-plan DAG revisions, questions, branch plans, reservations, branch lifecycle | Reconstruct pending, active, finalized, and invalidated branches with stable logical IDs |
| Gather/analyze | Source versions, evidence admission, claim/evidence relations, contradictions, and effect receipts | Reuse verified observations; reexecute only missing or invalidated work; quarantine untrusted inputs |
| Convergence | Finalized frontier, trusted evidence yield, blockers, policy fingerprint, and convergence decision | Continue, recover, or remain incomplete from the persisted decision; never infer convergence from iteration count |
| Synthesis | Selected claim-version set, projection fingerprint, synthesis revision, unresolved claims, and report reference | Reuse a matching committed synthesis or re-enter synthesis with a new revision when dependencies changed |
| Memory-save | Handoff request/completion/failure, continuity fingerprint, offered content and persistence receipt | Reconcile an uncertain handoff or retry only under its stable idempotency key; never duplicate trusted completion |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An interrupted Deep Research run reconstructs its resumable state from the sealed ledger, reducer checkpoint, projection fingerprint, and verified references without treating mutable files as authority.
- **SC-002**: The continuity-ladder mapping covers the complete `init -> gather/analyze -> convergence -> synthesize -> memory-save` path and identifies a deterministic re-entry action for every persisted state.
- **SC-003**: Compatibility and recovery decisions are explicit, immutable, fingerprint-bound, and fail closed for unknown or incompatible event, reducer, adapter, codec, manifest, or reference versions.
- **SC-004**: Repeated resume requests, duplicate event delivery, process restart, and crash-window fixtures produce no double-applied semantic event, lost committed event, or replayed side effect.
- **SC-005**: Logical branch, effect, lease, claim, synthesis, and memory-handoff identities remain stable across retries while attempt IDs and forensic history remain distinct.
- **SC-006**: Source or claim changes invalidate only dependent work, preserve prior evidence, and produce an auditable revision path rather than a silent rebaseline.
- **SC-007**: The mode gate can consume the adapter contract for later shadow parity without this phase moving authority, deleting legacy state, or owning certificates or rollback.

**Given** a sealed ledger ending after an iteration crash, **When** the adapter folds the ledger and re-enters Deep Research, **Then** it resumes from the last committed frontier and schedules only branches whose persisted decision is `reexecute`.

**Given** a duplicate resume request with the same run, manifest revision, ledger tail, and idempotency key, **When** the adapter evaluates it twice, **Then** the second evaluation produces the same decision without appending a duplicate semantic transition or dispatching a second effect.

**Given** an effect has `effect_prepared` and `effect_dispatched` but no verified result, **When** resume runs, **Then** the adapter follows the declared adapter capability and unknown-effect policy, records `reconcile`, `compensate`, or `blocked`, and never blindly retries an irreversible effect.

**Given** a source digest changes after a prior claim was admitted, **When** the ledger is resumed, **Then** only claims and synthesis inputs reachable through the dependency edges are reopened and prior source, claim, and report revisions remain readable.

**Given** the installed reducer or manifest fingerprint differs from the persisted run fingerprint, **When** resume compatibility is evaluated, **Then** the adapter returns an explicit migrate, pin-old-runtime, fork, or blocked outcome and does not reuse prior branch success by label.

**Given** memory-save was interrupted after dispatch but before a persistence receipt, **When** the handoff is re-entered, **Then** the adapter reconciles the stable handoff identity or retries it once under the declared idempotency contract without emitting a second trusted completion.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Ledger tail is not the full trusted frontier** - A complete line may not have a verified seal, reducer checkpoint, or finalized frontier. Mitigation: resume reads only sealed references and treats cursor gaps, hash-chain failures, and projection mismatches as blocked or rebuild-required.
- **Crash window around external effects** - A provider may have acted before `effect_result` was appended. Mitigation: persist `effect_prepared`, retain stable effect/idempotency identity, consult adapter capabilities, and make unknown outcomes explicit rather than automatically retrying.
- **Fingerprint drift causes unsafe reuse** - Model, prompt, tool policy, reducer, codec, manifest, or source changes can preserve labels while changing semantics. Mitigation: canonical compatibility classification is persisted before branch dispatch and changed manifests use an explicit fork/restart path.
- **Continuity mapping loses semantic state** - A shortcut from the latest iteration number can omit open contradictions, invalidated claims, or unresolved synthesis obligations. Mitigation: map each ladder step to reducer-owned fields and require dependency-aware fixtures.
- **Duplicate re-entry races** - Two processes can both observe a resumable branch before either decision is committed. Mitigation: use the shared authorization/idempotency boundary, stable decision keys, and append-before-dispatch ordering.
- **Dark-path leakage** - A reconstructed dark projection could be mistaken for a production completion or mutate legacy state. Mitigation: preserve explicit dark/non-authoritative status and leave cutover and shadow parity to later phases.
- **Dependencies**: phase-009 shared mode/replay contracts and conflict graph; Deep Research siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, and `004-certificates-and-receipts`; the shared phase-003 ledger/effect primitives; and the research registries under `002-deep-loop-effectiveness-and-fanout`. The manifest declares `depends_on: []`; adjacency references remain navigation only.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-009 idempotency key and append-before-dispatch contract does the adapter use for resume decisions and handoff retries?
- Which reducer checkpoint fields are sufficient for bounded replay, and which cursor or projection changes require a full rebuild before re-entry?
- Which adapter capability combinations permit effect reuse, receipt lookup, compensation, or safe re-execution for each Deep Research side effect?
- Does a changed research manifest always fork a new lineage, or may a registered compatible migration preserve the original lineage with an explicit revision event?
- Which source refresh and claim dependency index is exposed to the adapter without making it a second semantic reducer?
- What exact memory-save idempotency and reconciliation receipt does the shared continuity service expose for an interrupted handoff?

These decisions are resolved against the frozen shared contracts and reducer outputs before implementation. They do not authorize a new ledger schema, a mutable continuity shortcut, a certificate decision, a shadow-parity verdict, or an authority cutover in this Planned phase.
<!-- /ANCHOR:questions -->
