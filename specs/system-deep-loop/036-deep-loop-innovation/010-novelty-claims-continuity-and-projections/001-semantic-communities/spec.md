---
title: "Feature Specification: semantic communities"
description: "Deterministic semantic-community projection over claim nodes so paraphrases resolve to one concept while legacy graph novelty remains authoritative."
trigger_phrases:
  - "semantic communities"
  - "concept-level novelty"
  - "semantic claim deduplication"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:33:34Z"
    last_updated_by: "codex"
    recent_action: "Hardened edge provenance and arrival-order replay parity"
    next_safe_action: "Use the shadow output for calibration without changing legacy novelty authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/semantic-communities/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/semantic-communities.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Semantic Communities

> Phase adjacency under the 010 parent (grouping order, not a runtime dependency): predecessor none (first sibling); successor `002-contradiction-and-supersession-events`.

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This leaf adds deterministic semantic communities as an additive sidecar over existing claim nodes. Versioned exact-equivalence
edges form replay-stable communities, failed cross-community cohesion remains explicit ambiguity, and concept novelty is emitted
beside unchanged authoritative graph-growth novelty.

**Key Decision**: Use a config-addressed sidecar so semantic projection can be rebuilt or removed without modifying coverage
writers, relation unions, or convergence authority.

**Critical Dependencies**: Existing coverage graph boundaries, versioned event envelopes, typed authorized ledger, and replay
fingerprints.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First child of phase 010; the program manifest assigns semantic communities to novelty, claims, continuity, and projections |
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
not a terminal string list (`.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:67`,
`:74`, and `:219`). The program manifest places semantic communities in phase 010 before convergence consumes novelty
(`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:16`).
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
- Claim lifecycle continuity, next-focus scheduling, transactional projection plumbing, or convergence/termination thresholds owned by later phase-010 children and program phase 011.
- Replacing claim identity with community identity; raw claims, evidence locators, and event history remain independently addressable.
- Treating generic embedding proximity as proof of equivalence, or merging communities from a single uncalibrated nearest neighbor.
- Selecting a hosted embedding vendor, changing runtime authority, migrating historical packets, or removing the existing graph novelty metrics in this planning phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define claim-node inputs without destroying source wording or stable identity | Each community member retains claim ID, raw text, normalized fingerprint, evidence links, namespace, and originating ledger event |
| REQ-002 | Admit only versioned semantic-equivalence edges | Every edge records model/version, metric, score, threshold policy, canonical pair-local candidate provenance, and deterministic endpoint ordering; the directional candidate bundle remains in the ledger observation and topical-only fixtures remain disconnected |
| REQ-003 | Form replayable communities with stable lineage | Fixed claim content and configuration produce byte-identical edges, memberships, representatives, IDs, and membership-version hashes across arrival permutations; a fixed ledger replay also preserves lineage |
| REQ-004 | Update communities incrementally as claims arrive | A new claim rescans only its candidate neighborhood and affected components; the committed incremental result matches an independently constructed whole-graph rebuild |
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

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001 Determinism**: Canonical replay produces byte-identical semantic edges, community IDs, representatives, membership versions, and hashes across arrival permutations.
- **NFR-002 Bounded work**: Candidate count cannot exceed the config cap and incremental recomputation stays inside the affected connected component.
- **NFR-003 Isolation**: Namespace, session, and projection version are exact admission boundaries.
- **NFR-004 Compatibility**: Legacy coverage-graph novelty remains authoritative and its implementation is called directly.
- **NFR-005 Safety**: Malformed Unicode, oversized content, non-finite scores, forged candidate sets, and version conflicts fail before projection commit.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- High similarity with a `topical_only` decision never admits an edge.
- One claim touching two established communities remains ambiguous when cross-community cohesion fails.
- A distinct new claim remains a new concept even when candidate retrieval returns older claims.
- A model or threshold change creates a new retained projection version.
- A foreign namespace claim is excluded during retrieval and rejected during direct admission.
- Re-observed claim identity, invalid score, duplicate or malformed candidate-rank permutations, conflicting edge provenance, and projection-version/config-digest collisions fail explicitly without mutating committed projection bytes.
<!-- /ANCHOR:edge-cases -->

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | Six runtime modules plus an adversarial suite |
| Risk | 22/25 | Replay drift, false merges, novelty suppression, namespace leakage |
| Research | 10/20 | Existing graph, envelope, ledger, and fingerprint contracts |
| Multi-Agent | 0/15 | Single autonomous implementation stream |
| Coordination | 8/15 | Additive integration across four frozen boundaries |
| **Total** | **58/100** | **Level 3 documentation** |

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Topical false merge | High | Medium | Exact evaluator decision plus threshold and precision fixtures |
| Bridge chaining | High | Medium | Declared cohesion rule, explicit ambiguity, and bridge-first/middle/last permutation fixtures |
| Replay or arrival-order drift | High | Medium | Canonical pair-local edge provenance, independent rebuild, hashes, replay, and six arrival permutations |
| Evidence novelty suppression | High | Medium | Separate concept and evidence classifications |
| Cross-namespace leakage | High | Low | Exact namespace checks at retrieval and admission |
| Model drift rewrite | High | Medium | Digest-derived versions and immutable history |
<!-- /ANCHOR:risk-matrix -->

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Deduplicate paraphrased concepts

As a convergence consumer, I need paraphrased claims to share one concept so repeated wording does not look novel.

### US-002: Preserve evidentiary growth

As a research consumer, I need new evidence on an old concept to remain visible even when concept novelty is zero.

### US-003: Audit semantic decisions

As a replay verifier, I need every edge and membership version bound to the exact model, policy, canonical endpoint candidates,
and canonically selected endpoint ledger event, while the directional retrieval bundle remains auditable in the observation ledger.
<!-- /ANCHOR:user-stories -->

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None blocking for planning. Execution must calibrate the equivalence threshold, cohesion rule, candidate-neighborhood size,
embedding provider, and acceptable precision/recall on frozen fixtures before concept novelty can leave shadow mode. Those are
configuration and evidence decisions inside this contract, not permission to weaken replay, lineage, or ambiguity handling.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation plan**: `plan.md`
- **Task evidence**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Architecture decision**: `decision-record.md`
- **Completion record**: `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
