---
title: "Feature Specification: Shadow-Parity Harness"
description: "Plan the fail-closed harness that runs legacy and dark deep-loop paths on identical sealed inputs, compares verified replay-fingerprint components and projected legacy bytes, triages every divergence, and emits the parity certificate required before phase-011 authority cutover."
trigger_phrases:
  - "shadow parity harness"
  - "deep-loop legacy dark parity"
  - "parity certificate before cutover"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned shadow-parity harness contract"
    next_safe_action: "Implement sealed-input parity runs and certificate emission"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Shadow-Parity Harness

> Phase adjacency under `005-compatibility-shadow-and-rollback-bridge` (navigation order, not a hard runtime dependency): predecessor `002-legacy-projections`; successor `004-inflight-state-classification`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Shadow-parity child of the phase-005 compatibility, shadow, and rollback bridge |
| **Depends on** | None (`[]`); sibling planning contracts compose at the phase-005 parent gate |
| **Cutover role** | Hard precondition for every mode before phase-011 authority cutover |
| **Authority posture** | Shadow-only; legacy remains authoritative and this phase emits no cutover action |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The dark spine can append authorized events, replay deterministically, and render legacy-shaped artifacts while still
being behaviorally wrong. A valid ledger proves integrity, not equivalence with the shipped runtime. Conversely, two
paths can appear equivalent when they consumed different prompts, fixtures, configuration, evaluator material, or
prior state. The [phase-000 baseline](../../000-baseline-taxonomy-and-state-census/spec.md) defines the protected
behavior and known-defect census that supplies the oracle, and the [program phase tree](../../manifest/phase-tree.json)
requires phase 005 to prove shadow parity while legacy authority remains unchanged.

This phase plans a closed parity protocol. Each case binds one BASE scenario and initial-state fixture to the same
ordered, verified artifact-reference set from the [phase-004 sealed-reference-artifact contract](../../004-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md).
The harness clones that case into isolated legacy and dark execution roots, runs both paths without sharing mutable
outputs, captures the same declared observable boundary, and verifies each comparison through the
[phase-003 replay-fingerprint API](../../003-transition-authorized-ledger-core/003-replay-fingerprints/spec.md).
Because complete replay descriptors include run- and ledger-specific identity, parity compares their verified
replay-contract identities and observable component digests rather than pretending the final descriptor digests must
be equal. It also compares the dark path's projected bytes against the exact legacy bytes defined by sibling
[legacy projections](../002-legacy-projections/spec.md).

Any input mismatch, unverifiable fingerprint, semantic difference, byte difference, missing observation, crash,
timeout, side-effect-intent difference, or nondeterministic rerun is a blocking divergence. The harness records and
routes the first determinable mismatch without rewriting either result or promoting the new value. Only a closed,
mode-scoped case set with zero open divergences may emit an immutable parity certificate. Phase 011 must verify that
certificate and its bound code, contract, BASE, and sealed-input identities before moving authority: **no parity, no
cutover**.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A closed parity-case manifest derived from the phase-000 behavior baseline. Each row identifies mode/workstream,
  stable scenario ID, protected observable contract, initial-state fixture, sealed artifact set, legacy entry point,
  dark entry point, timeout/termination contract, replay contract, and legacy projection rows.
- A preflight that verifies identical ordered sealed-artifact references, descriptor versions, BASE anchor, initial
  state, and ledger-addressed configuration before either path starts. Input inequality blocks execution and is never
  reported as behavioral parity.
- Isolated execution roots cloned from one verified case capsule. The legacy path stays authoritative; dark effects
  are suppressed or routed through shadow-only sinks, and neither path may read the other's mutable output.
- A declared observable transcript covering terminal status, returned values, error and halt semantics, ordered state
  transitions, side-effect intents and receipts, budget/accounting observations, emitted artifacts, and reader-facing
  legacy JSONL/JSON surfaces named by the phase-000 census.
- Replay verification through the phase-003 registered API. Both paths must have verifiable comparison transcripts;
  parity requires matching replay-contract identity plus matching effective-event and canonical projection component
  digests at the declared observable boundary.
- Byte comparison of authoritative legacy artifacts against sibling-002 shadow projections, including field presence,
  key and row order, whitespace, newline policy, diff suppression, integrity fields, publication boundary, and reader
  results where the projection manifest declares them observable.
- A typed divergence taxonomy, immutable divergence record, deterministic rerun protocol, ownership routing, and a
  triage lifecycle that preserves expected and actual evidence without auto-rebaseline or comparison-time waivers.
- An immutable parity certificate bound to the mode, complete required case-set digest, BASE, code/build identity,
  sealed inputs, contract versions, fingerprint attestations, projection digests, and zero-divergence result.
- A machine-verifiable precondition consumed by each phase-010 mode gate and rechecked by phase 011 immediately before
  that mode's authority flip.

### Out of Scope
- Defining sealed artifact identity or retention, replay-fingerprint formats, upcasters, dual-read adapters, legacy
  projection algorithms, or in-flight-state dispositions owned by phases 004, 003, and adjacent phase-005 children.
- Fixing a dark-path or legacy-path divergence. This phase surfaces and routes evidence; the owning implementation
  phase changes behavior and must rerun the affected parity closure.
- Waiving known defects, weakening protected behavior, inventing tolerance bands, or dropping scenarios at comparison
  time. A baseline change requires the owning program contract to authorize and version it before parity reruns.
- Running both paths against live mutable state, duplicating external side effects, overwriting authoritative legacy
  files, or treating a shared cache as sealed input.
- Classifying or migrating in-flight state, executing rollback drills, flipping authority, issuing a phase-011 cutover
  certificate, or retiring legacy writers.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The parity case set is closed against the phase-000 baseline | Every protected behavior scenario, mode/workstream, observable surface, and legacy reader named by the executed baseline maps to a parity row or an explicit blocking gap; zero required rows are silently omitted |
| REQ-002 | Both paths consume exactly the same verified inputs | Before execution, the harness proves equality of BASE, initial-state digest, ordered sealed-artifact references, canonicalization versions, and ledger-addressed configuration; missing, mutable, reordered, or unverifiable input blocks the case |
| REQ-003 | Executions are isolated and non-authoritative | Legacy and dark runs start from independent clones of one case capsule, share no mutable outputs, duplicate no live effects, write only to declared test/shadow roots, and cannot change runtime authority |
| REQ-004 | Observable behavior is explicit and census-grounded | Each case declares terminal, value, error/halt, transition, effect/receipt, budget, artifact, and legacy-shape observations that apply; the harness rejects undeclared or missing observations rather than comparing an incomplete subset |
| REQ-005 | Replay comparison uses the phase-003 verification contract | Both comparison transcripts verify under registered fingerprint and replay-contract versions; parity requires equal declared effective-event and canonical-projection component digests, while final run-specific descriptor identities remain separately attested |
| REQ-006 | Projected legacy shapes are byte-identical | For every sibling-002 projection row, authoritative legacy bytes and shadow-projected bytes match the declared serializer, ordering, newline, suppression, integrity, timing, watermark, and unchanged-reader contract |
| REQ-007 | Divergence is fail closed and exhaustively classified | Input inequivalence, harness invalidity, replay-contract drift, execution outcome, effective-event, projection semantic, legacy-byte, side-effect, timing/termination, missing-observation, and nondeterminism failures each produce a typed blocking result |
| REQ-008 | Divergence evidence is immutable, bounded, and actionable | A record binds case ID, mode, BASE, code/build IDs, sealed inputs, ledger ranges, expected/actual component digests, legacy/projected artifact digests, mismatch class, earliest deterministic divergence point, and owning contract without mutating source evidence |
| REQ-009 | Triage cannot convert failure into parity | Triage may assign ownership, reproduce, fix, and close a divergence only after the affected case set reruns green; no suppression, ad hoc tolerance, skipped rerun, or auto-accepted baseline can produce a certificate |
| REQ-010 | Nondeterminism is itself a divergence | Required deterministic reruns over the same sealed case reproduce the same per-path transcripts, verified component digests, legacy bytes, projected bytes, and classification; inconsistent reruns block certification |
| REQ-011 | Certificates prove complete, current parity | A certificate is emitted only when every required case in the closed manifest passes and zero divergences remain; it binds the complete manifest digest, evidence set, contract versions, and all relevant build and artifact identities |
| REQ-012 | Certificate drift blocks cutover | Phase 011 rejects a missing, partial, superseded, unverifiable, wrong-mode, or stale certificate whenever code, BASE, case manifest, sealed inputs, replay contract, reducer, projection, adapter, or comparator identity differs |
| REQ-013 | Phase 005 never moves authority | Harness success creates parity evidence only; the legacy path remains authoritative and no flag, writer, reader, state, or cutover control is changed by this phase |

### Divergence taxonomy

| Class | Trigger | Triage owner |
|-------|---------|--------------|
| `input-inequivalent` | BASE, initial state, ordered seals, or replay-affecting configuration differ or cannot verify | Sealed-artifact or case-manifest owner |
| `harness-invalid` | Isolation, capture completeness, comparator version, timeout mechanism, or evidence persistence is invalid | Shadow-parity harness owner |
| `replay-contract-drift` | Fingerprint version, registry, upcaster chain, reducer, projection schema, or canonicalizer differs or is unavailable | Replay-fingerprint or compatibility-contract owner |
| `execution-outcome` | Terminal state, return value, error/halt class, crash, timeout, or ordered transition differs | Owning dark-path mode/runtime implementation |
| `effective-event` | Verified observable event transcript or side-effect/receipt intent differs | Ledger adapter, transition, or mode-schema owner |
| `projection-semantic` | Canonical reader-facing projection digest or declared reader result differs | Reducer or legacy-projection owner |
| `legacy-byte` | JSONL/JSON bytes, order, formatting, suppression, integrity, watermark, or publication boundary differs | Legacy-projection owner |
| `missing-observation` | A required transcript, artifact, fingerprint, reader result, or receipt was not captured | Harness or producing-path owner after boundary diagnosis |
| `nondeterministic` | Repeated sealed-case execution yields a different result or classification | First differing path/contract owner; certificate remains blocked |

An input-inequivalent or harness-invalid case does not prove behavioral divergence, but it still fails the parity gate.
Every class is blocking until the evidence is repaired and the complete affected closure reruns. Triage never edits the
expected attestation, source ledger, sealed artifacts, or authoritative legacy output.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase-000 baseline closes to a mode-addressable parity manifest with zero unexplained coverage gaps.
- **SC-002**: Every parity case proves input equivalence before isolated legacy and dark execution begins.
- **SC-003**: Verified replay component digests and sibling-002 legacy-shaped bytes match for every declared observable.
- **SC-004**: Each mismatch produces one typed, reproducible divergence record with an owner and no evidence mutation.
- **SC-005**: Deterministic reruns reproduce the same transcripts, component digests, bytes, and classification.
- **SC-006**: A certificate is emitted only for a complete mode case set with zero open divergences.
- **SC-007**: Phase 011 rejects absent or stale parity evidence and cannot move authority on a failed mode.

**Given** two path executions cite the same BASE, initial-state digest, and ordered verified sealed-artifact set, **When**
the parity coordinator starts them in independent roots, **Then** both consume identical immutable inputs without
sharing mutable outputs or duplicating live side effects.

**Given** both paths complete under the same registered replay contract, **When** their verified observable components
are compared, **Then** effective-event and canonical-projection digests match or one typed divergence blocks the case.

**Given** the dark ledger renders a sibling-002 legacy projection, **When** it is compared with the authoritative legacy
artifact, **Then** bytes, ordering, formatting, suppression, integrity, watermark, and reader-visible semantics match.

**Given** any required case fails, is skipped, is unverifiable, or changes across deterministic reruns, **When**
certificate issuance is requested, **Then** issuance fails and preserves the mismatch evidence without rebaselining.

**Given** a mode has a complete parity certificate, **When** phase 011 observes drift in any bound code, contract,
manifest, BASE, or artifact identity, **Then** the certificate is stale and authority remains on the legacy path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The child declares `depends_on: []` as an independent sibling planning contract, but execution consumes the frozen
phase-000 behavior baseline, phase-003 replay-fingerprint verifier, phase-004 sealed-reference-artifact service, and
sibling-002 legacy projections. The highest risk is false parity from unequal inputs or an incomplete observable
boundary. The protocol therefore verifies the ordered sealed-input set first and treats missing observations as a
failure rather than comparing the available subset.

Replay identity also needs precision. Phase-003 final descriptors bind ledger and run identity, so blindly requiring
their final digests to match would reject valid isolated executions. Comparing only a final state would miss trace or
effect differences. The harness instead verifies both complete descriptors and compares the registered observable
component digests declared by the case, retaining each run-specific attestation for audit.

Other risks are duplicate live effects, shadow writes colliding with authoritative paths, timeout races, dynamic
configuration escaping the seal set, known defects being silently normalized away, stale certificates surviving code
drift, and triage turning an unexplained difference into a waiver. Isolation guards, census closure, immutable evidence,
zero-tolerance certification, and phase-011 freshness checks are mandatory mitigations. The controlling sources are
`../../000-baseline-taxonomy-and-state-census/spec.md`,
`../../003-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`,
`../../004-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`,
`../002-legacy-projections/spec.md`, and `../../manifest/phase-tree.json`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must close concrete module names, case-manifest rows, supported deterministic
rerun cardinality, bounded diagnostic payloads, and mode-certificate storage from the executed phase-000 census and
registered runtime contracts. Those choices may not weaken sealed-input equality, comparison completeness,
zero-divergence certification, certificate freshness, or the rule that phase 005 never moves authority.
<!-- /ANCHOR:questions -->
