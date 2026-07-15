---
title: "Implementation Plan: semantic communities (007 phase 001)"
description: "Implementation plan for deterministic semantic communities and concept-level novelty in phase 007 child 001."
trigger_phrases:
  - "semantic communities implementation plan"
  - "concept-level novelty implementation"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-15T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the incremental community architecture and shadow novelty projection"
    next_safe_action: "Freeze semantic-equivalence fixtures and calibrate the edge admission policy"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Semantic Communities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime coverage graph (phase 007 child 001) |
| **Change class** | Additive semantic projection and shadow novelty signal |
| **Execution** | Ledger-replayable, namespace-scoped, non-authoritative until calibrated |

### Overview
The current coverage graph computes research novelty from post-snapshot `FINDING`/`SOURCE` nodes and `EVIDENCE_FOR` edges
(`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:715`). This plan adds a concept layer
without replacing that graph: claim nodes gain versioned semantic-equivalence edges, deterministic communities become a derived
projection, and novelty consumes community membership to distinguish a new idea from a new wording. The living claim-ledger
direction comes from `.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:67`
and `:74`; the phase placement comes from
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json:16`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Claim identity and ledger-event contracts from the parent program are frozen and available to the coverage graph
- [ ] A labeled fixture corpus separates paraphrases, equivalent notation, adjacent concepts, contradictions, and bridge claims
- [ ] Embedding model/version, normalization rules, metric, threshold policy, and candidate-retrieval bounds are pinned
- [ ] Community ID, membership version, representative, merge lineage, split lineage, and ambiguity schemas are specified
- [ ] Shadow-output fields and consumers are identified without changing convergence authority
- [ ] Precision, recall, rebuild parity, latency, and recomputation budgets are declared before implementation

### Definition of Done
- [ ] Equivalent claims share one replay-stable community and distinct claims remain separated at the frozen gate
- [ ] Incremental updates equal deterministic full rebuilds for every arrival-order and merge/split fixture
- [ ] Community membership drives shadow concept novelty while evidence novelty remains independently measurable
- [ ] Existing coverage-graph signals remain backward-compatible and the additive projection can be disabled or rebuilt
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Claim input adapter**: reads immutable claim IDs, raw text, normalized fingerprints, namespace, evidence links, and originating ledger positions; it never rewrites source claims.
- **Semantic encoder**: produces an embedding keyed by content fingerprint plus model/config version; cache entries and failures are explicit and replay-addressable.
- **Candidate retrieval**: searches only the claim's namespace and projection version, returning a bounded neighborhood before exact similarity scoring.
- **Edge admission**: writes canonical, symmetric semantic-equivalence edges only when the calibrated equivalence policy passes; general topical proximity remains a candidate signal, not an admitted edge.
- **Community reducer**: computes deterministic connected components over admitted edges with fixed ordering and a cross-community cohesion guard. Zero matches creates a community; one match joins; multiple matches merge only when cohesion passes; otherwise membership is `ambiguous`.
- **Stable lineage**: community identity derives from deterministic member content/claim keys, while each membership set has a version hash and predecessor lineage. Merge and split projections preserve old versions for replay.
- **Incremental projector**: on claim or edge arrival, recomputes the affected neighborhood/component in one transaction, then compares the result with periodic full rebuilds.
- **Novelty adapter**: emits `new_community`, `existing_community_member`, `ambiguous`, and `new_evidence` classifications plus assignment confidence and projection version. The existing node/edge novelty delta stays visible for shadow comparison.
- **Observability**: records candidate count, admitted-edge count, assignment path, merge/cohesion decision, model/config version, projection latency, rebuild drift, and false-merge/fragmentation fixture results.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze labeled semantic-equivalence fixtures from real claim shapes, including paraphrases, near-neighbor distinctions, contradictions, bridge claims, notation variants, and repeated evidence.
- Inventory coverage-graph node/edge/snapshot schemas and claim-ledger boundaries; pin the baseline output of `computeGraphNoveltyDelta` and `computeWindowedGraphNoveltyDelta`.
- Select and record the semantic model/config, normalization, candidate bounds, admission threshold, cohesion rule, and deterministic tie-breaks.

### Phase 2: Implementation
- Add versioned claim-embedding and semantic-equivalence edge records behind the existing namespace boundary.
- Implement bounded candidate retrieval and exact edge admission with explicit failure and ambiguity outcomes.
- Implement deterministic full community reduction, stable IDs, membership-version hashes, representatives, and merge/split lineage.
- Implement affected-component incremental updates with transactional writes and a rebuild-parity audit path.
- Add the shadow concept-novelty adapter while preserving graph-growth and evidence-novelty observations.
- Expose projection/version telemetry and a disable/rebuild path; do not move convergence authority.

### Phase 3: Verification
- Measure equivalence precision/recall against the frozen corpus; fail on topical false merges and paraphrase fragmentation beyond the declared thresholds.
- Replay every fixture under multiple arrival orders and assert identical semantic edges, community memberships, lineage, and novelty classes.
- Compare incremental projection output with a full deterministic rebuild after every bridge, merge, split, and model-version fixture.
- Verify namespace isolation, missing/failed embedding behavior, bounded candidate work, atomic projection updates, and historical-version readability.
- Run existing coverage-graph tests and shadow-parity comparisons; verify legacy novelty values remain unchanged when the feature is disabled.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Round-trip claim ID, raw wording, normalized fingerprint, evidence links, namespace, and ledger position through projection rebuild |
| REQ-002 | Golden edge fixtures assert canonical endpoints and complete model/metric/score/threshold/candidate provenance; topical-only pairs have no edge |
| REQ-003 | Repeated and shuffled full replays produce byte-equivalent community IDs, representatives, membership hashes, and lineage |
| REQ-004 | Per-arrival incremental snapshots equal the corresponding full rebuild; affected-work counters stay inside declared bounds |
| REQ-005 | Bridge and adversarial-neighbor fixtures remain ambiguous or separate unless the frozen cross-community cohesion rule passes |
| REQ-006 | Paraphrase additions emit `existing_community_member`; first concepts emit `new_community`; added evidence remains `new_evidence` |
| REQ-007 | Existing coverage-graph signal suites pass unchanged; disabled-feature and shadow-mode outputs match the pinned baseline |
| REQ-008 | Model/config changes create a new projection version, retain prior membership, and rebuild only through an explicit version transition |
| REQ-009 | Fixture report records precision, recall, arrival-order parity, rebuild parity, latency, and false-merge/fragmentation counts |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares no sibling dependency (`depends_on: []`); its predecessor entry is `none`, and successor
`002-contradiction-and-supersession-events` is navigation only. It consumes the parent program's typed ledger, stable claim and
branch identities, replay fingerprints, compatibility bridge, and durable fan-in outcomes. Runtime integration depends on the
existing coverage-graph database and signal snapshot contracts. Model/config selection and threshold calibration must use frozen
fixtures before the semantic projection can become authoritative for later convergence work.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The community layer lands additive and shadow-only. Rollback disables community writes and the concept-novelty adapter, retains
the existing graph-growth novelty path, and discards only rebuildable projection rows for the affected version. Immutable claims,
evidence edges, ledger events, and earlier membership versions remain untouched. A corrected model or threshold creates a new
projection version and deterministic rebuild; it never edits historical membership in place.
<!-- /ANCHOR:rollback -->
