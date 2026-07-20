---
title: "Feature Specification: Mixed-Version Fixtures"
description: "Plan a sealed fixture corpus that mixes old and new event and state versions within one deep-loop run, exercising upcasters, mode reducers, replay, and shadow parity across realistic version drift."
trigger_phrases:
  - "mixed-version deep-loop fixtures"
  - "old and new state replay fixtures"
  - "version-change shadow parity"
  - "interrupted migration fixtures"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined mixed-version fixture scenarios and replay sealing boundaries"
    next_safe_action: "Freeze old-new event-state fixtures against upcaster and parity contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Mixed-Version Fixtures

> Phase adjacency under `012-shared-mode-contracts-and-fixtures` (navigation order, not a hard runtime dependency): predecessor `002-cross-mode-closures`; successor `004-write-set-conflict-graph`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the phase-012 shared mode contracts and fixtures parent |
| **Depends on** | None (`[]`) in the phase-tree contract; execution consumes the phase-007 and phase-008 interfaces |
| **Parent outcome** | Provide deterministic mixed-version fixtures before the phase-013 mode fan-out |
| **Authority posture** | Fixture and verification planning only; legacy remains authoritative and no cutover is permitted |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shared mode contract names interface versioning, resume outcomes, reducer ownership, sealed artifacts, and shadow
parity, but a single-version fixture corpus cannot prove that those contracts hold while a real loop crosses a release
boundary. A deep-loop run can contain old events, a newly written event, an old checkpoint, and a newly shaped state
record at the same causal time. Testing only a fully old or fully new stream hides exactly the drift that the migration
bridge must handle.

The phase-008 upcaster and dual-read contract requires adjacent, deterministic, lossless transforms, immutable source
evidence, and fail-closed handling of future, ambiguous, or unsupported versions (`../../008-compatibility-shadow-and-
rollback-bridge/001-upcasters-and-dual-read-adapters/spec.md`). Its shadow-parity child requires both legacy and dark
paths to consume one identical sealed case capsule, compare verified replay components and legacy projections, and keep
authority on the legacy path (`../../008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`).
The phase-007 sealed-reference-artifact contract supplies the only trusted way to freeze the prompt set, initial state,
configuration, prior outputs, and evaluator material used by a replay (`../../007-shared-evidence-and-control-services/
002-sealed-reference-artifacts/spec.md`).

This phase plans the fixture corpus that makes version drift explicit. Each case composes old and new event versions,
old and new state snapshots, and a declared version boundary inside one sealed run. The corpus must exercise the
upcaster chain, mode reducers, resume adapter, replay fingerprint, and shadow-parity comparator without changing any
production authority. Pure-old and pure-new cases remain controls; mid-upgrade and interrupted-migration cases are the
load-bearing cases for realistic coexistence.

The parent program requires phase 012 to freeze shared mode interfaces, cross-mode closures, mixed-version fixtures, and
the write-set conflict graph before phase 013 begins. The parent spec and `manifest/phase-tree.json` therefore make this
fixture set a shared input to all eight phase-013 workstreams, not a private test owned by one mode. The manifest records
the phase-012 outcome and the phase-008 outcome as the compatibility and parity boundary:
`../../manifest/phase-tree.json`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned fixture envelope containing mode/workstream, scenario ID, interface and event/state versions, causal
  boundary, initial state, event stream, expected reducer state, replay inputs, and expected parity classification.
- Four required scenario families: pure-old control, pure-new control, mid-upgrade coexistence, and interrupted
  migration with a restart or resume from a partially advanced boundary.
- Independent versioning of event records and persisted state records so a case can contain old events with new state,
  new events with old state, and a valid mixed state at a declared migration boundary.
- Fixture construction that invokes the phase-008 upcaster registry and dual-read semantics without reimplementing
  their production algorithms or accepting a guessed version mapping.
- Fixture sealing through the phase-007 artifact service: canonical bytes, ordered digest references, descriptor
  versions, initial state, configuration, evaluator material, and replay-affecting environment are immutable inputs.
- Expected outcomes for upcast, direct current read, reducer acceptance, replay parity, legacy projection parity,
  resume classification, typed failure, and certificate eligibility.
- Deterministic replay and shadow-parity execution for every phase-013 workstream named in
  `manifest/phase-tree.json`, including deep-improvement-common before its three variants.
- Negative fixtures for unsupported future versions, missing adjacent edges, lossy transforms, malformed mixed state,
  seal mismatch, wrong causal boundary, missing observations, and nondeterministic reruns.
- Fixture identifiers, source references, seal identities, and expected outcomes suitable for the phase-012 conformance
  runner and the phase-008 parity certificate input.

### Out of Scope
- Implementing the upcaster registry, dual-read/single-write adapter, legacy projections, shadow-parity harness, or
  rollback drills owned by phase 008.
- Implementing the phase-007 seal store, canonicalizers, verified-read API, retention policy, or artifact lifecycle.
- Defining the shared `ModeContract` surface owned by `001-shared-mode-interfaces` or hoisting common implementations
  owned by `002-cross-mode-closures`.
- Migrating any production mode, changing reducer authority, changing the phase-006 event envelope, or moving runtime
  authority from legacy to the dark ledger.
- Rewriting historical events or state, auto-rebaselining expected outputs, accepting unversioned records by inference,
  or using mutable paths, caches, clocks, or live external services as trusted fixture inputs.
- Creating or hand-writing generated `description.json` or `graph-metadata.json` metadata for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every fixture has a stable versioned identity | A fixture envelope records mode/workstream, scenario family, case ID, fixture-schema version, interface version, event/state versions, and source contract identities; duplicate IDs with different bytes fail closed |
| REQ-002 | Pure-old is a valid legacy control | A pure-old case reads and reduces the old event and state forms through the declared legacy/current compatibility path, preserves immutable source evidence, and reproduces the pinned legacy expectation |
| REQ-003 | Pure-new is a valid current control | A pure-new case uses only current event and state forms, proves no unnecessary upcast, and produces the current reducer and replay expectation under the same sealing contract |
| REQ-004 | Mid-upgrade coexistence is explicit | A case interleaves old and new events or state records around one declared version boundary and records the exact adjacent upcaster hops, reducer inputs, and expected effective state |
| REQ-005 | Interrupted migration is restartable and classifiable | A case stops after a partial transition, seals the pre-stop state and pending inputs, resumes from the boundary, and expects one declared `upcast`, `pin-legacy`, `fork`, `migrate`, or `block` result |
| REQ-006 | Event and state versions are independently exercised | The matrix includes old-event/new-state, new-event/old-state, old-event/old-state, and new-event/new-state combinations where the contracts permit them; unsupported combinations are typed failures |
| REQ-007 | Upcaster behavior is lossless and fail closed | Supported cases apply only adjacent registered transforms, preserve source bytes and identity, produce stable hop traces, and reject gaps, cycles, future versions, ambiguous shapes, and lossy output |
| REQ-008 | Every replay input is sealed before execution | A case capsule references verified phase-007 digest descriptors for initial state, event stream, configuration, prompts, evaluator material, prior outputs, and version policy; mutable aliases alone are rejected |
| REQ-009 | Sealing makes replay deterministic | Repeated reads of the same case use identical ordered bytes and descriptors; the same replay contract yields identical effective-event, reducer-state, projection, and classification outputs |
| REQ-010 | Shadow parity consumes one case capsule | Legacy and dark executions receive the same verified sealed inputs and causal boundary, run in isolated roots, compare declared replay components and legacy-shaped bytes, and never use fixture data to grant authority |
| REQ-011 | Reducer expectations are explicit | Each case names the expected accepted events, rejected events, state transitions, terminal result, pending effects, receipts, and output artifacts; no expected state is inferred from the implementation under test |
| REQ-012 | The corpus covers every phase-013 workstream | The manifest-derived matrix covers `001-deep-research`, `002-deep-review`, `003-deep-ai-council`, `004-deep-improvement-common`, `005-agent-improvement`, `006-model-benchmark`, `007-skill-benchmark`, and `008-deep-alignment` |
| REQ-013 | Failures block trusted evidence | Seal mismatch, input inequality, missing observation, unsupported version, reducer divergence, replay mismatch, projection mismatch, or nondeterministic rerun blocks parity and certificate eligibility with bounded evidence |
| REQ-014 | Fixture evolution is versioned and additive | Changing a fixture schema, scenario expectation, or version policy creates a new fixture or contract identity; existing sealed evidence is not mutated or silently rebaselined |

### Required scenario matrix

| Scenario | Constructed inputs | Expected compatibility outcome | Expected reducer and parity outcome |
|----------|--------------------|--------------------------------|-------------------------------------|
| `pure-old` | Old event versions, old state snapshot, legacy serializer, one sealed old-version input set | Read through the declared compatibility path; no missing-edge or future-version error; source bytes and hop trace retained | Legacy baseline remains authoritative; dark replay and legacy projection match the declared control or emit a diagnosed divergence |
| `pure-new` | Current event versions, current state snapshot, current serializer, one sealed new-version input set | Direct current read with zero unnecessary hops; current envelope and state validations pass | Current reducer output and replay components are stable; legacy projection comparison uses the registered compatibility projection |
| `mid-upgrade` | Old records before boundary, a current-version write at the boundary, new records after boundary, mixed old/new state observations | Each old record takes its exact adjacent chain; current records do not downcast; comparable observations share one causal token | Reducer reaches the expected mixed effective state; legacy and dark paths compare the same declared components and bytes |
| `interrupted-migration` | Sealed pre-stop old/new mix, pending transition, restart metadata, and resumed input set | Resume classification is the declared outcome; unsupported or ambiguous state blocks rather than guessing | Restart is deterministic, pending effects remain bounded, and parity/certificate evidence is blocked until the complete case reruns green |

### Version-mixing rules

An event version describes the stored event payload and a state version describes the persisted state representation;
neither may be inferred from the other. A fixture may combine them only when the phase-008 registry and the shared mode
contract declare the pair comparable. The fixture records stored version, effective version, ordered upcaster hops,
source identity, and causal position for every record. A current writer never emits an old version to make a mixed case
look realistic; realism comes from sealed historical records followed by a current-version boundary write.

An interrupted case is not a cleanup exercise. The stop point, pending effects, lease/fencing state, receipt set, and
continuity identity are part of the sealed input. A restart either restores the declared continuity or returns a typed
classification. The case cannot pass by discarding the partial run, repairing state in place, or treating a dark success
as a legacy success.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fixture corpus contains the four required scenario families and a manifest-derived row for every
  phase-013 workstream.
- **SC-002**: Pure-old and pure-new controls establish stable version-specific expectations before mixed cases run.
- **SC-003**: Mid-upgrade fixtures prove old and new events/state coexist across a declared causal boundary with exact
  upcaster hops and deterministic effective reducer state.
- **SC-004**: Interrupted-migration fixtures preserve sealed stop inputs and yield deterministic resume classification,
  pending-effect handling, and restart output.
- **SC-005**: Every trusted case consumes phase-007 verified sealed artifacts and rejects mutable, missing, or altered
  bytes before reducer or parity execution.
- **SC-006**: Repeated execution of a sealed case reproduces effective events, reducer state, projections, parity class,
  and evidence identity; nondeterminism blocks certification.
- **SC-007**: The shadow-parity harness can compare the same capsule through legacy and dark paths without authority
  movement, live side effects, or fixture-time rebaselining.
- **SC-008**: Unsupported versions, missing upcaster edges, lossy transforms, malformed mixed state, and seal mismatch
  fail closed with typed evidence and no trusted partial result.

**Given** a sealed `pure-old` case with a supported `type@1` record and current version `type@3`, **When** the case is
replayed, **Then** the exact `1 -> 2 -> 3` chain is applied, source evidence remains immutable, and the control result is
stable across reruns.

**Given** a sealed `mid-upgrade` case with old events before a current-version boundary write and new events after it,
**When** both paths reduce the case, **Then** each path observes the same causal boundary, old records are upcast once,
current records are not downcast, and declared parity components match or produce one blocking divergence.

**Given** an `interrupted-migration` case with a pending effect and a sealed restart point, **When** resume executes,
**Then** the declared classification is returned deterministically, pending work is not duplicated, and no certificate
is eligible until the complete affected case set passes.

**Given** a case whose sealed event bytes or descriptor digest changes, **When** the parity runner starts, **Then** the
phase-007 verified read fails before either path executes and the case is classified as input-inequivalent.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False compatibility from correlated versions** - Treating state version as an event-version proxy can hide an
  unsupported pair. Mitigation: record and validate event and state versions independently and require a declared
  comparable boundary.
- **Fixtures that encode implementation output** - Generating expected state by calling the reducer under test makes
  every case pass vacuously. Mitigation: author expected transitions and outcomes from the phase-008 contracts and
  immutable control evidence, then compare implementation output to those expectations.
- **Unsealed drift** - A mutable prompt, configuration, evaluator input, or environment value can produce false parity.
  Mitigation: require phase-007 verified digest references and block any unledgered replay-affecting input.
- **False parity across causal points** - Old and new observations can be semantically equal while representing
  different positions. Mitigation: bind comparison tokens to mode, run/stream, authority epoch, checkpoint, and dark
  head as required by the phase-008 parity contract.
- **Interrupted restart duplicates effects** - A restart can replay an accepted effect without its receipt. Mitigation:
  seal receipt, lease/fencing, pending-effect, and continuity evidence and expect the phase-008 resume classification.
- **Mode-specific fixture drift** - Eight workstreams may invent private version combinations. Mitigation: derive the
  matrix from `mode_workstreams_phase_013`, use one fixture envelope, and reject unregistered exceptions.
- **Dependencies**: the child declares `depends_on: []` in `manifest/phase-tree.json`, but its implementation consumes
  the phase-007 sealed-reference-artifact contract, phase-008 upcaster and shadow-parity contracts, the phase-012
  shared-mode interface, and the parent sequencing rules. The phase-013 mode migrations consume this fixture set; phase
  014 consumes its parity evidence but remains the sole authority-cutover owner.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete event and state families from the phase-003 census require mixed cases for every mode, and which shared
  families can use one cross-mode fixture row?
- What exact causal boundary fields are mandatory for each mode's event stream, snapshot, lease, receipt, and continuity
  identity in an interrupted-migration case?
- Which phase-008 resume classifications can be asserted by a fixture without importing mode-specific migration policy?
- Which legacy projection fields are observable for each mode when the dark path has upcast old records into a current
  effective model?
- What rerun count and supported process/platform matrix is required before a mixed case can contribute to a parity
  certificate?

These decisions are resolved while freezing the fixture schema and manifest-derived matrix. They do not authorize
implementation, state rewrite, authority movement, or a waiver for an unsupported version in this Planned phase.
<!-- /ANCHOR:questions -->
