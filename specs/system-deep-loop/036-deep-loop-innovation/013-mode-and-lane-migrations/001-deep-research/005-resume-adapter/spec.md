---
title: "Feature Specification: Deep Research - Resume Adapter"
description: "The Deep Research resume adapter rebuilds interrupted live state from the sealed typed ledger through the frozen reducers, maps continuity to typed lifecycle state, and re-enters idempotently without replaying semantic work."
trigger_phrases:
  - "deep research resume adapter"
  - "deep-research ledger resume"
  - "deep research idempotent re-entry"
  - "deep research continuity ladder"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter"
    last_updated_at: "2026-07-22T09:15:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark resume adapter"
    next_safe_action: "Consume the closed decision and continuity contracts in 006-shadow-parity"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-resume-adapter.vitest.ts"
    completion_pct: 100
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
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-research mode migration) |
| **Origin** | Fifth Deep Research child in the phase-013 mode migration fan-out |
| **Depends on** | `[]` in `manifest/phase-tree.json`; sibling adjacency is navigation only |
| **Consumes** | Shared phase-012 mode/replay contracts, typed ledger events, reducers, sealed references, and certificate/receipt outputs |
| **Output** | A closed resume-adapter contract, continuity projection, recovery decision algebra, and full-pipeline adversarial fixtures |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Research is an autonomous loop with a live path of `init -> iterate: gather/analyze -> convergence detection -> synthesize -> memory-save handoff`. An interruption can occur after a side effect, after a ledger append, between a sealed artifact and its reference event, or while a reducer checkpoint is being advanced. The current continuity surface is distributed across configuration, JSONL state, iteration artifacts, reducer output, synthesis output, and memory handoff state. Reading whichever file looks newest cannot distinguish a committed semantic transition from an observed but uncommitted operation.

The shared migration contract changes the authority boundary: the sealed typed event ledger is the source of resumable facts, and the Deep Research reducers reconstruct the mode projection from that ledger. The adapter must map the existing continuity ladder to the reconstructed projection, choose a safe re-entry action for each logical branch and effect, and append the decision before work restarts. It must preserve stable logical identities across process restarts while keeping attempt identities distinct. A changed manifest, replay fingerprint, source version, or reducer contract must not inherit prior success by label alone.

The research inputs make this boundary concrete. Deep Research requires a versioned executable research-plan DAG, a claim-evidence-contradiction ledger, living-resume invalidation through dependency edges, evidence admission before trusted reducer state, and a materialized synthesis view over immutable claim history. The runtime findings require `reuse | reexecute | compensate | reject` resume decisions, a root lease, effect receipts with an explicit unknown state, and a versioned replay-compatibility registry. This phase implements the adapter that joins those contracts; it does not implement a second reducer, seal, certificate, shadow harness, or authority switch.
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
- Creating or validating sealed artifacts, certificates, boundary receipts, shadow-parity comparisons, rollback drills, the independent mode gate, or the phase-014 authority cutover.
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
- **Dependencies**: phase-012 shared mode/replay contracts and conflict graph; Deep Research siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`, and `004-certificates-and-receipts`; the shared phase-006 ledger/effect primitives; and the research registries under `002-deep-loop-effectiveness-and-fanout`. The manifest declares `depends_on: []`; adjacency references remain navigation only.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions remain. The six implementation questions resolved as follows.

- Resume decisions use the shared authorization gateway, `AppendOnlyLedger.appendAuthorized`, the caller's bounded idempotency key, and append-before-dispatch ordering. An exact retry reconstructs the pre-decision prefix and reuses the same event and authorization identity.
- Bounded replay accepts the frozen reducer checkpoint projection, authenticated source-tail sequence, and checkpoint integrity digest. The adapter independently derives the real tail from verified ledger frames; cursor or projection disagreement returns `rebuild_required` before append.
- Effect recovery uses the shared effect-intent adapter descriptor plus verified confirmation, recovery, reconciliation, conflict, and operator-resolution events. Only replay-safe, proven-not-applied effects reexecute; an unresolved irreversible effect blocks because the shared descriptor exposes no compensation executor.
- A registered compatible or migrate manifest revision keeps the persisted lineage but takes an explicit `restart` disposition with new attempt identities and manifest-scoped retry keys. Unregistered changes reject. A fresh lineage is never minted during same-run resume.
- Source refresh and claim invalidation are derived from the frozen reducer projection's source identity and content digests, evidence links, claim relations, gap obligations, and supersession history. The adapter computes reachability only; it does not own semantic reduction.
- Memory-save continuity comes from the reducer's `continuity-save` artifact state and real effect evidence. Valid completion is reused, uncertain persistence reconciles, and safe retry requires the shared stable effect idempotency contract.

These resolutions consume frozen contracts and do not authorize a new ledger schema, mutable continuity shortcut, certificate decision, shadow-parity verdict, or authority cutover.
<!-- /ANCHOR:questions -->
