---
title: "Decision Record: semantic communities"
description: "Architecture decisions for deterministic semantic communities and additive shadow novelty."
trigger_phrases:
  - "semantic communities architecture"
  - "semantic projection decision"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:00:48Z"
    last_updated_by: "codex"
    recent_action: "Accepted the version-addressed additive sidecar architecture"
    next_safe_action: "Preserve shadow authority and config-addressed history"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/semantic-communities/index.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Semantic Communities

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a version-addressed sidecar projection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Codex implementation agent |

<!-- ANCHOR:adr-001-context -->
### Context

The coverage graph already owns node, edge, namespace, snapshot, and novelty authority. Concept grouping needs richer edge
provenance and membership history, but changing the shipped relation unions or writers would violate the additive-dark boundary.

### Constraints

- Legacy `FINDING`/`SOURCE` and `EVIDENCE_FOR` novelty remains authoritative.
- A semantic edge is invalid without exact-equivalence evidence and complete versioned provenance.
- Replay state cannot contain wall-clock measurements or provider-dependent fallback behavior.
- Every candidate and community operation is namespace-local and bounded.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a typed sidecar module that reuses coverage-graph boundary shapes and the shipped event, ledger, and replay APIs.

The config digest defines the projection version. Candidate assessments record the model, metric, threshold policy, retrieval
provenance, exact-equivalence evaluator, and evidence digest. Only `equivalent` decisions above the pinned threshold admit an
edge. The reducer recomputes the arriving claim's connected component, emits canonical community and membership hashes, retains
lineage, and exposes concept novelty beside direct calls to the unchanged legacy novelty functions.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Versioned sidecar projection** | Additive, replayable, removable | Consumers must opt into shadow output | 9/10 |
| Extend coverage relation unions and writers | Direct persistence | Breaks frozen writers and legacy contract | 2/10 |
| Use embedding distance as membership | Small implementation | Topical false merges and silent model drift | 1/10 |

**Why this one**: it adds concept semantics without changing the existing authority or storage contract.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Equivalence admission is auditable and config-addressed.
- Community identity, membership versions, representatives, ambiguity, and lineage replay deterministically.
- New evidence remains visible even when concept novelty is deduplicated.

**What it costs**:

- Exact scoring remains an upstream responsibility. The module rejects missing, malformed, or mismatched assessments.
- Historical versions consume memory until a future persistence child defines retention.

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bridge chaining | High | Cross-community cohesion guard and explicit ambiguous membership |
| Model drift | High | New digest-derived projection version and retained history |
| Cross-namespace leakage | High | Exact namespace checks in retrieval, admission, and projection |
| Replay drift | High | Canonical JSON, deterministic ordering, typed ledger replay |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Raw graph growth cannot deduplicate paraphrased concepts |
| 2 | **Beyond Local Maxima?** | PASS | Storage mutation, unversioned proximity, and sidecar options were compared |
| 3 | **Sufficient?** | PASS | The public API covers admission, projection, replay, drift, and novelty |
| 4 | **Fits Goal?** | PASS | Legacy novelty authority is unchanged |
| 5 | **Open Horizons?** | PASS | Config-addressed history permits later calibrated versions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

The implementation lives under `runtime/lib/semantic-communities/`; its sole leaf suite is
`runtime/tests/unit/semantic-communities.vitest.ts`.

**How to roll back**: stop importing the sidecar module and remove its new files. No shipped writer, table, signal, or authority
requires reversal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
