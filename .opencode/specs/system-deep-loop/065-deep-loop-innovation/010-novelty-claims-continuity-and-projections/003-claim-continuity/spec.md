---
title: "Feature Specification: claim continuity"
description: "Plan one durable claim identity across iterations so support, contradiction, supersession, lifecycle, and recomputed status accumulate on the same claim through replay and resume."
trigger_phrases:
  - "claim continuity"
  - "stable claim lifecycle"
  - "replayable claim status"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity"
    last_updated_at: "2026-07-15T15:08:14Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned claim-continuity lifecycle and replay contract"
    next_safe_action: "Implement claim minting, matching, event folding, and resume fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Claim Continuity

> Phase adjacency under the 007 parent (grouping order, not a runtime dependency): predecessor `002-contradiction-and-supersession-events`; successor `004-next-focus-semantics`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/003-claim-continuity |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of phase 010; the program manifest assigns stable claim lifecycle tracking to the novelty, claims, continuity, and projections intelligence layer |
| **Child depends_on** | `[]` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase-007 continuity service defines a typed `claim` identity that survives resume, handover, replay, reorder, rename,
and cross-mode reference. It deliberately leaves claim lifecycle, contradiction, supersession, and semantic novelty to phase
007 (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities/spec.md`).
Without a claim-specific consumer of that contract, each iteration can still mint a near-duplicate record for a paraphrase,
attach new support to the latest wording, or replace status in place. The result is fragmented evidence, lost contradiction
history, and resume behavior that treats an old claim as newly discovered.

Sibling `001-semantic-communities` plans replay-stable semantic equivalence and concept-level novelty, while sibling
`002-contradiction-and-supersession-events` owns the typed events that relate claims without erasing prior history
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities/spec.md`
and `.opencode/specs/system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events/spec.md`).
The program manifest fixes phase 010's outcome as semantic communities, contradiction and supersession events, claim
continuity, next-focus semantics, and deterministic projections over the ledger
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`).

This phase plans the joining contract. Every durable claim is minted once under the phase-007 identity schema. Later
observations are matched through exact aliases and sibling-001 semantic-community candidates, then support, contradiction,
supersession, and lifecycle events attach to that one identity. Claim status is a deterministic projection of the authorized
event prefix, never a mutable last-writer-wins field. Resume restores the claim frontier and replay cursor, validates them
against the ledger fingerprint, and continues the same claim histories without reminting from summaries or current wording.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A claim-continuity record keyed by the phase-007 typed `claim` identity, with immutable mint provenance, canonical namespace, raw observations, aliases, semantic-community memberships, evidence references, lifecycle state, derived epistemic status, and last-applied ledger cursor.
- Idempotent claim minting for a genuinely new durable assertion and deterministic reuse of the original ID after crash, retry, replay, or resume.
- A matching pipeline that checks exact namespaced aliases and normalized fingerprints, queries sibling-001 semantic-community candidates, applies a versioned equivalence policy, and records match provenance.
- Fail-closed ambiguity handling: zero qualifying matches may mint a new claim; one qualifying match reuses it; multiple or conflicting matches remain unresolved until an explicit resolution event.
- A lifecycle model separating durable existence (`proposed`, `active`, `superseded`, `retracted`) from derived epistemic status (`unassessed`, `supported`, `contested`, `refuted`).
- Deterministic status recomputation as support, qualification, contradiction, refutation, supersession, retraction, correction, and adjudication events arrive.
- Preservation of claim identity when wording, sources, iteration, attempt, lineage label, path, or semantic-community representative changes.
- New identity plus a typed relationship when a materially different claim supersedes or continues an earlier claim; supersession never rewrites the predecessor into the successor.
- A resume frontier containing active claim IDs, unresolved match/contradiction work, projection version, ledger cursor, and replay fingerprint, with fail-closed validation before execution continues.
- Additive, dark integration and fixtures for paraphrase, distinct-neighbor claims, ambiguous candidates, duplicate sources, contradictory evidence, supersession, correction, crash/retry, resume, handover, and deterministic replay.

### Out of Scope
- Semantic edge scoring, community formation, merge/split lineage, and novelty classification owned by `001-semantic-communities`.
- The authoritative contradiction, qualification, refutation, and supersession event vocabulary owned by `002-contradiction-and-supersession-events`.
- Next-region selection owned by `004-next-focus-semantics`, transactional projection plumbing owned by `005-transactional-projections-and-gauges`, and convergence thresholds owned by program phase 011.
- Minting or changing the shared identity shape, typed event envelope, append-only ledger, authorization gateway, replay fingerprint, compatibility adapters, or durable fan-in contracts.
- Collapsing all claims in one semantic community into one claim identity; community membership proposes candidates, while claim equivalence remains versioned, evidenced, and explicit.
- Mutating historical events, deleting contradicted claims, making the dark projection authoritative, or migrating historical packets during this planning phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Use the phase-007 typed continuity identity as the sole durable claim key | Every claim record and claim-bearing event resolves one valid `claim` ID; array indexes, iteration numbers, paths, text, timestamps, hashes, and community IDs are never substituted for it |
| REQ-002 | Mint each genuinely new claim exactly once through an idempotent authorized operation | Retrying the same mint request returns the original claim ID; concurrent equivalent requests produce one accepted identity or an explicit conflict |
| REQ-003 | Match later observations to existing claims through a deterministic, versioned policy | Exact alias/fingerprint checks and sibling-001 candidate scoring record policy version, candidate set, decision, and provenance; fixed inputs produce the same decision on replay |
| REQ-004 | Fail closed on ambiguous or unsafe matches | Multiple qualifying claims, cross-namespace collisions, weak similarity, or community disagreement creates an unresolved match record and neither remints nor attaches evidence silently |
| REQ-005 | Separate lifecycle state from epistemic status | Each projection exposes one lifecycle state from `proposed`, `active`, `superseded`, or `retracted` and one epistemic status from `unassessed`, `supported`, `contested`, or `refuted` |
| REQ-006 | Recompute claim state from the append-only event history | A versioned reducer folds the authorized event prefix in canonical order; corrections append compensating events, and no consumer overwrites stored history or trusts a mutable status field |
| REQ-007 | Accumulate support without fragmenting the claim | New sources, evidence, qualifications, and duplicate-source observations attach to the existing claim ID with provenance and independence metadata; repeated wording does not create a second durable claim |
| REQ-008 | Attach contradiction and supersession to stable claim identities | Sibling-002 events reference typed source and target claim IDs; contradiction preserves both histories, and supersession gives the successor its own ID plus an auditable relationship |
| REQ-009 | Preserve continuity across resume and handover | The saved frontier restores the same claim IDs, unresolved work, reducer version, cursor, and fingerprint; missing, ambiguous, stale, or wrong-kind references stop before new claim work begins |
| REQ-010 | Make replay and incremental application converge | Replaying a fixed ledger prefix and incrementally applying the same events produce identical claim records, lifecycle states, epistemic statuses, relationship sets, and projection hashes |
| REQ-011 | Keep the claim-continuity path additive and non-authoritative | Shadow output is comparable with legacy claim/finding behavior, divergence is observable, and no shipped reader, writer, convergence rule, or authority boundary changes in this phase |
<!-- /ANCHOR:requirements -->

### Claim identity, lifecycle, and status-fold contract

At first durable observation, the matcher resolves a namespaced exact alias or fingerprint before consulting the committed
semantic-community projection. No qualifying candidate mints one phase-007 `claim` identity through an idempotency key bound
to the source event. Exactly one qualifying candidate reuses that identity and records the match decision. Multiple candidates,
conflicting aliases, or an unversioned semantic result produce an unresolved match; the system must not guess, merge, or mint a
parallel identity. Semantic community is therefore a candidate-discovery and novelty boundary, not the claim's primary key.

The lifecycle fold begins at `proposed`, advances to `active` after the declared admission event, and can terminate at
`superseded` or `retracted` without deleting the claim. A materially revised successor is a new claim linked to its predecessor,
not a mutation of the old identity. Epistemic status is orthogonal: no effective evidence yields `unassessed`; accepted support
with no unresolved counterevidence yields `supported`; an unresolved typed contradiction yields `contested`; and an authorized
adjudication or refutation result yields `refuted`. Lifecycle outcomes take presentation precedence but retain the last epistemic
status and all contributing events for audit. The exact event names come from sibling 002; this phase owns the versioned fold,
precedence table, provenance retention, and replay parity.

The resume frontier is a compact reference set, not a replacement snapshot. It carries active and unresolved claim IDs, the
claim-fold policy version, last committed ledger cursor, and replay fingerprint. Resume replays or verifies through that cursor,
resolves every typed reference, compares the reconstructed projection hash, and only then accepts new events. Summaries, current
wording, community representatives, and legacy finding keys may aid display or alias lookup, but none may remint identity.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A claim retains one typed continuity ID across paraphrase, added support, contradiction, supersession linkage, iteration changes, crash/retry, replay, handover, and resume.
- **SC-002**: Equivalent observations converge on one claim while distinct neighbors stay separate and ambiguous matches stop without silent attachment or duplicate minting.
- **SC-003**: Incremental folding and full replay produce identical lifecycle state, epistemic status, provenance, relationships, cursor, and projection hash for every fixture.
- **SC-004**: The resume frontier restores the same claim set and unresolved work under the replay fingerprint, and the dark projection changes no legacy authority or convergence behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child has no sibling hard dependency (`depends_on: []`); the predecessor and successor references are navigation and
contract adjacency only. It consumes the phase-007 continuity identity schema, the phase-006 authorized ledger and replay
fingerprint, the phase-008 compatibility/shadow boundary, and the phase-009 durable fan-in substrate. It integrates with the
planned interfaces of sibling 001 for semantic candidates and sibling 002 for contradiction/supersession events without taking
ownership of either contract.

The principal risks are false equivalence collapsing distinct claims, conservative matching fragmenting paraphrases, alias
collisions across namespaces, status oscillation from order-sensitive folds, accidental identity reuse for a materially changed
claim, duplicated support from correlated sources, resume from a stale cursor, and a projection becoming authoritative before
shadow parity. Mitigations are versioned decisions, explicit ambiguity, typed event ordering, source-independence metadata,
append-only corrections, replay-hash comparison, and a dark feature boundary with a rebuildable derived projection.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must freeze the claim-equivalence threshold, namespace policy, lifecycle transition table,
status precedence, duplicate-source treatment, and unresolved-match service level against pinned fixtures before the projection
can leave shadow mode. Those calibration choices may tighten the contract but cannot replace stable identity, explicit ambiguity,
append-only history, or replay-equivalent resume.
<!-- /ANCHOR:questions -->
