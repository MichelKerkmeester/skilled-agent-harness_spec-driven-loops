---
title: "Feature Specification: Deep AI Council - Sealed Reference Artifacts"
description: "Plan the Deep AI Council sealing boundary for immutable inputs and outputs across seats deliberate, critique rounds, convergence, ai-council artifacts, and the council test gate. Reuse the phase-006 sealing primitives and phase-012 shared contracts for content-addressed digests, seal-on-write, replay identity, and tamper-evident reads; do not create a second sealing scheme."
trigger_phrases:
  - "Deep AI Council sealed reference artifacts"
  - "deep-ai-council seal-on-write"
  - "deep-ai-council tamper-evident artifact reads"
  - "content-addressed council artifacts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-07-15T22:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated artifact sealing from reducer-owned reference indexing"
    next_safe_action: "Define seal-on-write and tamper-evident read invariants"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact phase-006 seal record and verification receipt fields are frozen?"
      - "Which council inputs require private sealed access versus public digest references?"
      - "Which artifact read failures emit shared tamper evidence before phase 007 certification?"
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council - Sealed Reference Artifacts
> Phase adjacency under the 003-deep-ai-council parent (grouping order, not a hard runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-ai-council |
| **Origin** | Phase 006 of the 013 per-mode migration program; sealed reference artifacts concern |
| **Depends on** | `[]` in the phase manifest; sibling references are navigation only |
| **Output** | A mode-specific sealing contract and verification plan; no certificate or authority-cutover implementation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep AI Council run produces evidence at several boundaries: immutable task and policy inputs, independent seat
proposals, critique material, blinded candidate bundles, pairwise judgments, convergence decisions, synthesized council
outputs, minority records, and the council test-gate evidence. The current packet-local `ai-council/**` artifacts and
`ai-council-state.jsonl` references do not by themselves define which bytes are immutable, how an input set is reproduced,
or how a reader proves that a path still contains the bytes that were admitted to deliberation. A mutable path, a replaced
report, or a stale prompt/configuration can therefore look like the original council result during replay or audit.

This phase plans the Deep AI Council sealing boundary over the shared substrate. It consumes the phase-006 content-addressed
sealing primitives and the phase-012 identity, artifact-reference, replay, receipt, authorization, and write-set contracts.
The plan defines seal-on-write for the immutable input and output reference sets, then defines a read path that verifies the
content digest and seal linkage before a reducer, resume adapter, test gate, or later certificate can use the bytes. The
sealing boundary must reproduce the multi-seat lifecycle without making a second mode-local cryptographic or persistence
scheme. Sealing is evidence integrity; certification and authority remain later concerns.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep AI Council artifact inventory covering immutable run inputs, private seat inputs and outputs, critique rounds,
  blinded candidate packages, pairwise and bias judgments, convergence evidence, synthesized reports, minority records,
  council artifacts, and council test-gate inputs and outputs.
- A seal-on-write contract that canonicalizes the declared bytes, computes the shared content-addressed digest, writes the
  immutable object and manifest exactly once, and appends the authorized shared seal/reference record without embedding large
  bodies in the ledger.
- A seal manifest linking artifact kind, logical identity, run/round/seat scope, source event range, schema and policy
  versions, replay fingerprint, content digest, byte or canonicalization metadata, and supersession lineage.
- A tamper-evident read path that resolves by digest, verifies the object and manifest, checks the expected scope and replay
  fingerprint, and returns an explicit missing, mismatch, stale, quarantined, or verified result with no mutable-path fallback.
- Reproduction and resume rules for reusing sealed inputs and outputs only when the shared replay contract permits reuse;
  changed inputs produce a new seal and never overwrite an old object.
- Shadow-parity fixtures that compare the sealed reference set with legacy Deep AI Council artifacts while the typed path is
  additive, dark, and non-authoritative.

### Out of Scope
- Defining or changing the phase-006 sealing primitives, digest algorithm, shared storage protocol, transition gateway, or
  phase-012 envelope, receipt, artifact-reference, replay, or write-set contracts.
- Reducers, projections, artifact-index ownership, deliberation state, independence calculations, plural outcomes, or status
  folds owned by `002-reducers-and-projections`.
- Seat execution, critique generation, judge calibration, pairwise adjudication, synthesis, convergence policy, or council
  test execution; this phase seals their declared inputs and outputs after their owning events authorize them.
- Certificates, human or automated sign-off, mode-gate authority, staged cutover, rollback switching, or legacy-writer
  retirement owned by `004-certificates-and-receipts` and later migration phases.
- A second seal format, private digest namespace, mutable cache that can satisfy a verification read, or a new mode-local
  artifact store that bypasses the shared substrate.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mode reuses the phase-006 sealing primitives and phase-012 shared contracts | A contract map names inherited digest, seal, reference, replay, authorization, receipt, and write-set fields; no duplicate seal scheme or mode-local authority path exists |
| REQ-002 | Every reproducibility-critical council input is identified and sealed before dependent work consumes it | An inventory covers target, task class, strategy, prompt/tool/model capability, seat roster, policy, fixture, budget, contract, and control-arm inputs with scope and digest rules |
| REQ-003 | Every reproducibility-critical council output is sealed on write | Seat, critique, blinded candidate, judgment, convergence, synthesis, minority, council, and test-gate outputs have content-addressed objects and authorized seal references |
| REQ-004 | Seal-on-write is immutable and idempotent | A repeated write for the same canonical bytes returns the same digest and does not mutate the original object; changed bytes create a new digest and append lineage |
| REQ-005 | A seal binds content to council identity and replay context | The manifest binds logical artifact identity, run/round/seat scope, source event range, schema/policy versions, replay fingerprint, content digest, and predecessor or supersession references |
| REQ-006 | Reads are tamper-evident and fail closed | Digest mismatch, manifest mismatch, missing object, unsafe path, stale replay fingerprint, or quarantined artifact yields an explicit non-verified result and cannot fall back to a mutable path |
| REQ-007 | Private and blinded information surfaces remain separated | Private seat evidence and identity mappings are sealed under declared access scope; scorer, judge, and gate reads receive only the references and bytes allowed by their typed information surface |
| REQ-008 | Reproduction and resume use sealed references rather than current files | Resume distinguishes compatible reuse, re-execution, compensation, and rejection using the shared replay fingerprint and seal manifest; historical seals remain readable |
| REQ-009 | Sealed artifacts remain evidence, not certification | A seal proves content integrity and provenance linkage only; certificate inputs, certificate issuance, gate sign-off, and authority decisions remain available to the successor phase |
| REQ-010 | Shadow parity proves integrity without moving authority | Legacy artifact paths and typed sealed references are compared by logical identity, digest, scope, and required content while legacy remains authoritative |
<!-- /ANCHOR:requirements -->

The sealing inventory must distinguish immutable inputs from derived outputs. Inputs include the target snapshot, council
strategy and protocol policy, prompt and tool capability descriptors, seat roster and reasoning-method declarations, budget
and convergence policy, shared contract revisions, control-arm definitions, and the test fixture manifest. Outputs include
private proposals, critique records, blinded candidate packages, pairwise judgments, bias probes, stance and convergence
evidence, synthesis, minority or unresolved-value records, council-facing artifacts, and test-gate evidence. The inventory
stores digest-bound references and safe metadata; it does not move prompts, transcripts, or report bodies into typed event
payloads.

The shared seal record is the only integrity authority. A mode adapter may choose which council bytes to present to a seat,
judge, reducer, resume planner, or test gate, but it cannot reinterpret a digest, replace a missing object with the current
path, or create a local seal that the shared reader does not understand. Supersession is an append-only relation between
sealed references. It never edits or deletes the prior object, and a failed replacement leaves the prior verified evidence
available for replay.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase has a complete artifact inventory for the `seats deliberate -> critique rounds -> converge -> ai-council artifacts -> council test gate` lifecycle, including immutable inputs and outputs.
- **SC-002**: Every inventory row maps to the phase-006 seal primitive and phase-012 shared reference, identity, replay, receipt, and authorization contracts without introducing a second scheme.
- **SC-003**: Seal-on-write is idempotent for identical canonical bytes, creates a new digest for changed bytes, preserves supersession lineage, and never overwrites an earlier seal.
- **SC-004**: A tamper-evident reader verifies digest, manifest, scope, and replay compatibility before returning bytes; missing, changed, unsafe, or stale data produces an explicit blocked result.
- **SC-005**: Private seat evidence, blinded candidate identity, judge inputs, minority records, and test-gate inputs retain their declared information boundaries through sealing and reads.
- **SC-006**: Resume and reproduction fixtures distinguish safe reuse from re-execution or rejection and preserve historical sealed inputs and outputs.
- **SC-007**: Shadow parity compares legacy and typed references without changing authority, while certificates and mode-gate decisions remain owned by the successor and later phases.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Second sealing scheme** - a mode-local digest, manifest, or read verifier could diverge from the shared substrate. Mitigation:
  treat phase-006 sealing primitives and phase-012 contracts as the sole authority and reject local aliases in the contract map.
- **Mutable-path substitution** - a current packet file could replace the originally sealed bytes during resume or verification.
  Mitigation: resolve by content digest, verify the seal manifest and scope, and fail closed without path fallback.
- **Incomplete input capture** - a council output can be digest-stable while its prompt, tool policy, model capability, or fixture
  input drifted. Mitigation: inventory all replay-critical inputs and bind them to the input manifest and replay fingerprint.
- **Information-surface leakage** - a seal reader could expose private seat identity, peer scores, or unblinded candidate data to a
  judge or scorer. Mitigation: make access scope and visible digest set explicit in every read request and fixture.
- **Seal mistaken for certificate** - downstream code could treat an integrity-verified object as a certified or authoritative
  outcome. Mitigation: keep certificate references, test-gate sign-off, and authority transitions outside this phase.
- **Concurrent writer collision** - seats, critiques, or gates may attempt to seal related objects concurrently. Mitigation: use the
  phase-012 write-set conflict graph and shared atomic seal-on-write operation; do not coordinate through a local global lock.
- **Late or superseding evidence** - a later critique or gate result may make a prior artifact stale without invalidating history.
  Mitigation: append supersession or quarantine lineage and preserve the earlier verified object for as-of replay.
- **Dependencies**: phase-006 sealing and transition-authorized ledger primitives, phase-012 shared artifact/reference and write-set
  contracts, `001-typed-ledger-schema`, `002-reducers-and-projections`, the Deep AI Council findings registries, legacy artifact
  fixtures, the shared replay and resume contract, and successor `004-certificates-and-receipts`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-006 seal record, canonicalization metadata, digest algorithm, and verification receipt fields are frozen for
  mode adapters, and which are intentionally opaque shared primitives?
- Which private input objects require access-controlled sealed storage, and which can be represented as public digest-only
  references without weakening reproducibility or auditability?
- Does the shared read path emit a typed verification receipt, a tamper observation, or both when bytes are missing or changed?
- Which artifact kinds are required for a successful Deep AI Council mode gate, and which are diagnostic sealed outputs that may be
  absent without blocking a non-authoritative shadow run?
- How does phase `004-certificates-and-receipts` consume the sealed manifest without rehashing, recertifying, or replacing the
  phase-006 sealing authority?

These questions are contract-ratification inputs. They do not authorize a local digest format, artifact store, certificate,
authority cutover, or mutable repair path in this Planned phase.
<!-- /ANCHOR:questions -->
