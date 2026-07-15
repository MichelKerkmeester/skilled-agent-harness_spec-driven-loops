---
title: "Feature Specification: semantic communities (007 phase 001)"
description: "Plan a deterministic semantic-community projection over claim nodes so paraphrases resolve to one concept and novelty measures new ideas rather than new strings."
trigger_phrases:
  - "semantic communities"
  - "concept-level novelty"
  - "semantic claim deduplication"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-15T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the semantic-community planning contract and concept-level novelty boundary"
    next_safe_action: "Implement claim similarity edges and the incremental community projection"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Semantic Communities

> Phase adjacency under the 007 parent (grouping order, not a runtime dependency): predecessor none (first sibling); successor `002-contradiction-and-supersession-events`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/001-semantic-communities |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of phase 007; the program manifest assigns semantic communities to novelty, claims, continuity, and projections |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped coverage graph already persists typed nodes, typed edges, and convergence snapshots. Its current novelty signal counts
eligible `FINDING`/`SOURCE` nodes and `EVIDENCE_FOR` edges created after a prior snapshot, optionally against a sliding window
(`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:321`,
`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:726`, and
`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:757`). That measures graph growth, but it
cannot tell whether two differently worded claims express the same idea. Repeated paraphrases can therefore look novel, inflate
dedup counts, and keep later convergence logic active without adding a new concept.

Run-2 research identifies the durable unit as a living claim-evidence ledger with stable claim identity and dependency edges,
not a terminal string list (`.opencode/specs/system-deep-loop/065-deep-loop-innovation/005-deep-loop-effectiveness-and-fanout/research/research-modes.md:67`,
`:74`, and `:219`). The program manifest places semantic communities in phase 007 before convergence consumes novelty
(`.opencode/specs/system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/manifest/phase-tree.json:16`).
This phase plans the missing concept layer: immutable claim nodes connected by versioned semantic-equivalence edges, grouped
into deterministic communities, and projected into a concept-level novelty signal while retaining evidence-level growth as a
separate observation.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A community model whose nodes are stable claim identities and whose weighted, symmetric edges mean calibrated semantic equivalence, not merely topical relatedness.
- Versioned edge provenance: normalized claim fingerprints, embedding model/version, similarity metric, score, admission threshold, candidate-retrieval method, and creation event.
- Deterministic community formation over admitted equivalence edges, including stable community identity, representative selection, membership versions, and merge/split lineage.
- Incremental assignment when a claim arrives: candidate retrieval, exact scoring, edge admission, affected-component recomputation, atomic membership projection, and replay parity.
- A bridge/cohesion guard that prevents one ambiguous similarity edge from chaining two distinct concepts into a single community.
- Novelty projection fields that distinguish a new claim string, a new member of an existing concept, a genuinely new semantic community, and new evidence for an existing concept.
- Shadow-mode integration with the existing coverage graph so current graph-growth signals remain available for parity and later convergence calibration.
- Fixtures for paraphrases, near-neighbor but distinct claims, multilingual or notation variants where supported, bridge claims, incremental arrival order, model-version drift, and replay.

### Out of Scope
- Contradiction, qualification, and supersession event semantics; owned by successor `002-contradiction-and-supersession-events`.
- Claim lifecycle continuity, next-focus scheduling, transactional projection plumbing, or convergence/termination thresholds owned by later phase-007 children and program phase 008.
- Replacing claim identity with community identity; raw claims, evidence locators, and event history remain independently addressable.
- Treating generic embedding proximity as proof of equivalence, or merging communities from a single uncalibrated nearest neighbor.
- Selecting a hosted embedding vendor, changing runtime authority, migrating historical packets, or removing the existing graph novelty metrics in this planning phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define claim-node inputs without destroying source wording or stable identity | Each community member retains claim ID, raw text, normalized fingerprint, evidence links, namespace, and originating ledger event |
| REQ-002 | Admit only versioned semantic-equivalence edges | Every edge records model/version, metric, score, threshold policy, candidate provenance, and deterministic endpoint ordering; topical-only fixtures remain disconnected |
| REQ-003 | Form replayable communities with stable lineage | Fixed inputs and configuration produce identical memberships, representatives, IDs, and membership-version hashes across replay |
| REQ-004 | Update communities incrementally as claims arrive | A new claim rescans only its candidate neighborhood and affected components; the committed incremental result matches a full deterministic rebuild |
| REQ-005 | Prevent semantic chaining and unsafe merges | A bridge claim cannot merge established communities unless the declared cross-community cohesion rule passes; ambiguous membership stays explicit |
| REQ-006 | Feed community membership into novelty without erasing evidence novelty | Novelty output distinguishes `new_community`, `existing_community_member`, `ambiguous`, and `new_evidence`; paraphrases do not increment concept novelty |
| REQ-007 | Extend rather than duplicate the shipped coverage graph | Community edges and membership projections use the existing namespace, node, edge, snapshot, and replay boundaries; legacy novelty remains shadow-comparable |
| REQ-008 | Make model and threshold drift observable and recoverable | A model/config change creates a new projection version, never silently rewrites prior membership, and supports bounded recomputation from ledger events |
| REQ-009 | Prove semantic behavior with adversarial fixtures | Paraphrase, distinct-neighbor, bridge, arrival-order, replay, and version-drift suites pass with declared precision/recall and parity thresholds |
<!-- /ANCHOR:requirements -->

### Community and novelty contract

For each arriving claim, the reducer normalizes without overwriting the raw claim, computes a versioned embedding, retrieves
namespace-local candidates, and admits only edges above the calibrated equivalence policy. Zero admitted edges creates a new
community. One qualifying community assigns the claim to a new membership version. Multiple qualifying communities trigger a
deterministic cohesion check; failure records ambiguous membership rather than forcing a merge. A successful merge emits new
community lineage and preserves the superseded membership versions for replay.

The novelty consumer reads the committed membership projection, not raw text equality. A first stable member contributes concept
novelty; a paraphrase joining an existing community does not. New sources or evidence edges may still contribute evidence novelty,
so concept dedup never suppresses genuine evidentiary growth. The initial release stays additive and shadow-only, consistent with
the parent program's dark-substrate invariant.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Semantically equivalent paraphrases resolve to one replay-stable community while adjacent but distinct claims remain separate at the declared fixture thresholds.
- **SC-002**: Incremental assignment and a full deterministic rebuild produce identical community IDs, membership versions, and novelty classifications.
- **SC-003**: Concept novelty increments once for a new community, not once per wording, while evidence novelty remains independently visible.
- **SC-004**: The feature lands as an additive coverage-graph projection with versioned provenance, shadow parity, and no authority or convergence-threshold change.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level additive-dark, replay-determinism, stable-identity, and mixed-version constraints. Phase-specific risks
are false merges from topical similarity, fragmentation from thresholds that are too strict, order-dependent incremental results,
embedding-model drift, cross-namespace leakage, bridge-claim chaining, recomputation cost, and accidental suppression of new
evidence attached to an old concept. Mitigations and verification gates are enumerated in this phase's plan.md. This child has no
sibling `depends_on`; it still consumes the parent program's ledger, stable logical identities, and durable fan-in prerequisites.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must calibrate the equivalence threshold, cohesion rule, candidate-neighborhood size,
embedding provider, and acceptable precision/recall on frozen fixtures before concept novelty can leave shadow mode. Those are
configuration and evidence decisions inside this contract, not permission to weaken replay, lineage, or ambiguity handling.
<!-- /ANCHOR:questions -->
