---
title: "Implementation Plan: semantic communities"
description: "Implemented architecture for deterministic semantic communities and shadow concept-level novelty."
trigger_phrases:
  - "semantic communities implementation plan"
  - "concept-level novelty implementation"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:33:34Z"
    last_updated_by: "codex"
    recent_action: "Closed edge provenance, bridge-order, rebuild, and guard-test gaps"
    next_safe_action: "Retain shadow-only authority while production calibration data accumulates"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/semantic-communities/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/semantic-communities.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Semantic Communities

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime coverage graph |
| **Change class** | Additive semantic projection and shadow novelty signal |
| **Execution** | Ledger-replayable, namespace-scoped, non-authoritative until calibrated |

### Overview
The current coverage graph computes research novelty from post-snapshot `FINDING`/`SOURCE` nodes and `EVIDENCE_FOR` edges
(`.opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:715`). This plan adds a concept layer
without replacing that graph: claim nodes gain versioned semantic-equivalence edges, deterministic communities become a derived
projection, and novelty consumes community membership to distinguish a new idea from a new wording. The living claim-ledger
direction comes from `.opencode/specs/system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md:67`
and `:74`; the phase placement comes from
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:16`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Claim identity and ledger-event contracts from the parent program are frozen and available to the coverage graph
- [x] A labeled fixture corpus separates paraphrases, equivalent notation, adjacent concepts, contradictions, and bridge claims
- [x] Embedding model/version, normalization rules, metric, threshold policy, and candidate-retrieval bounds are pinned
- [x] Community ID, membership version, representative, merge lineage, split lineage, and ambiguity schemas are specified
- [x] Shadow-output fields and consumers are identified without changing convergence authority
- [x] Precision, recall, rebuild parity, latency, and recomputation budgets are declared before implementation

### Definition of Done
- [x] Equivalent claims share one replay-stable community and distinct claims remain separated at the frozen gate
- [x] Incremental updates equal an independent deterministic rebuild across six arrival orders, including bridge-first and bridge-middle
- [x] Community membership drives shadow concept novelty while evidence novelty remains independently measurable
- [x] Existing coverage-graph signals remain backward-compatible and the additive projection can be disabled or rebuilt
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Claim input adapter**: reads immutable claim IDs, raw text, normalized fingerprints, namespace, evidence links, and originating ledger positions; it never rewrites source claims.
- **Semantic encoder**: produces an embedding keyed by content fingerprint plus model/config version; cache entries and failures are explicit and replay-addressable.
- **Candidate retrieval**: searches only the claim's namespace and projection version, returning a bounded neighborhood before exact similarity scoring.
- **Edge admission**: writes canonical, symmetric semantic-equivalence edges only when the calibrated equivalence policy passes; pair-local candidate provenance and the lexically first endpoint event keep edge bytes independent of arrival direction, while the ledger observation retains the directional retrieval bundle.
- **Community reducer**: computes deterministic connected components over admitted edges with fixed ordering and a cross-community cohesion guard. Zero matches creates a community; one match joins; multiple matches merge only when cohesion passes; otherwise membership is `ambiguous`.
- **Stable lineage**: community identity derives from deterministic member content/claim keys, while each membership set has a version hash and predecessor lineage. Merge and split projections preserve old versions for replay.
- **Incremental projector**: on claim or edge arrival, recomputes the affected neighborhood/component as a pure function of final component content, then compares the result with an independently constructed whole-graph rebuild.
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
- Replay every fixture under multiple arrival orders and assert identical final semantic edges, communities, memberships, and novelty classes; fixed ledger order separately proves lineage replay.
- Compare incremental projection output with an independent whole-graph rebuild after every bridge, merge, split, and model-version fixture.
- Verify namespace isolation, missing/failed embedding behavior, bounded candidate work, atomic projection updates, and historical-version readability.
- Run existing coverage-graph tests and shadow-parity comparisons; verify legacy novelty values remain unchanged when the feature is disabled.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Round-trip claim ID, raw wording, normalized fingerprint, evidence links, namespace, and ledger position through projection rebuild |
| REQ-002 | Golden edge fixtures assert canonical endpoints, pair-local candidate provenance, canonical endpoint-event provenance, and byte equality under reversed arrival; topical-only pairs have no edge |
| REQ-003 | Six shuffled arrivals produce byte-equivalent edges, community IDs, representatives, and membership hashes; repeated fixed ledger replay preserves full bytes |
| REQ-004 | Per-arrival incremental snapshots equal the independently constructed whole-graph rebuild; affected-work counters stay inside declared bounds |
| REQ-005 | Bridge-first, bridge-middle, bridge-last, and adversarial-neighbor fixtures remain ambiguous or separate unless the frozen cross-community cohesion rule passes |
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

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
coverage claim nodes + scored assessments
                    |
                    v
       versioned edge admission
                    |
                    v
     affected community projection
          |                    |
          v                    v
typed ledger replay      shadow novelty
                               |
                               v
                 authoritative legacy delta
```

| Component | Depends On | Produces |
|-----------|------------|----------|
| Claim adapter | Coverage `CLAIM` node | Immutable semantic claim record |
| Edge admission | Config and scored candidate assessment | Canonical semantic-equivalence edge |
| Community reducer | Claims and admitted edges | Memberships, representatives, versions, lineage |
| Replay adapter | Event envelope and authorized ledger | Canonical rebuilt projection |
| Novelty adapter | Semantic result and coverage inputs | Shadow concept/evidence result plus legacy delta |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Preserve claim and namespace identity.
2. Validate config-bound candidate provenance before edge admission.
3. Recompute the arriving claim's affected component.
4. Derive canonical membership and lineage.
5. Replay the same ledger events and compare bytes.
6. Pair semantic classification with the unchanged legacy novelty functions.

Candidate retrieval and exact scoring may happen upstream in parallel, but projection commit waits for the complete bounded
assessment set.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Success Evidence |
|-----------|--------|------------------|
| M1 Admission | Complete | Provenance, threshold, and topical-only fixtures |
| M2 Projection | Complete | Independent incremental/full cross-check and six arrival-order parity fixtures |
| M3 Safety | Complete | Bridge-first/middle/last, namespace, duplicate identity/rank, and version-collision fixtures |
| M4 Integration | Complete | Ledger replay, replay component, snapshot, and legacy parity fixtures |
<!-- /ANCHOR:milestones -->

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read every frozen boundary before editing.
- Keep changes inside the semantic module, its leaf suite, and this packet.
- Capture the existing legacy suite result before claiming compatibility.

### Execution Rules

| Rule | Enforcement |
|------|-------------|
| TASK-SEQ | Admission, projection, replay, novelty, then verification |
| TASK-SCOPE | No coverage writer, database, signal, query, or substrate edits |
| TASK-VERIFY | Leaf tests, substrate tests, TypeScript, strict packet validation |

### Status Reporting Format

Report the invariant, executable fixture, observed count, and exit code. Distinguish full-worktree state from the scoped delta.

### Blocked Task Protocol

Mark a task `BLOCKED` only when an in-scope prerequisite cannot be satisfied. Record the failing command and preserve the last
green projection state; never weaken equivalence, namespace, replay, or legacy-authority rules to bypass the block.
