---
title: "Decision Record: Semantic Relation Inference"
description: "Architectural decisions for the two deferred OPT-IN collectors: reading the cached related_memories column instead of a live vector scan; driving contradicts from structural supersession instead of embedding similarity; and the opt-in default-off posture that keeps the recovered production DB safe."
trigger_phrases:
  - "semantic relation inference decision"
  - "cached related_memories over live vec"
  - "supersession contradicts over semantic"
  - "opt-in collector posture"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference"
    last_updated_at: "2026-06-04T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001..003"
    next_safe_action: "Commit + deploy"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: Semantic Relation Inference

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Read the cached related_memories column, not a live vector scan

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

The similarity `supports` collector was deferred from packet 021 because a live `vector_search`/sqlite-vec scan is not deterministically reproducible in a unit fixture, and an all-pairs comparison is O(n^2). The DB was just recovered, so the collector must be safe, bounded, and testable without embeddings.

### Constraints

- No live `vector_search`/sqlite-vec call; no O(n^2) all-pairs work.
- Must be deterministically testable in an in-memory sqlite fixture.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Read ONLY the pre-computed `memory_index.related_memories` column (a JSON `[{ id, similarity }]` list, similarity on a 0-100 scale, written by `link_related_on_save` / `populateRelatedMemories`).

**How it works**: For each scanned row, parse the cached column, keep neighbours `similarity >= threshold` (default 75, configurable 1-100), take the top K<=5 by similarity, exclude self-loops and any pair already produced by the spec-chain collector, and emit `supports` at strength ~0.35. Bare numeric ids carry no score and are dropped (they can never clear a >=1 threshold).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Cached column read (chosen)** | Deterministic, bounded, unit-testable, no sqlite-vec dependency | Only as fresh as the cached column | 9/10 |
| Live `vector_search` per row | Always fresh | Non-deterministic in a fixture; sqlite-vec dependency | 4/10 |
| All-pairs cosine over the index | Most complete | O(n^2); dangerous on a recovered DB | 2/10 |

**Why this one**: The cached column already encodes the neighbour relationship deterministically, so the collector satisfies the bounded-and-testable constraint with zero new dependencies.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `supports` coverage can grow from existing cached neighbours, opt-in and bounded.

**What it costs**:
- Freshness is bounded by the cached column. Mitigation: acceptable for a maintenance backfill; re-runs pick up updated caches.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stale cached neighbours produce slightly outdated edges | L | Edges are low-strength auto, reversible, and re-run idempotently |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The deferred similarity signal needed a safe, testable source |
| 2 | **Beyond Local Maxima?** | PASS | Live scan + all-pairs weighed and rejected |
| 3 | **Sufficient?** | PASS | The cached column fully supplies candidates |
| 4 | **Fits Goal?** | PASS | Grows `supports` without sqlite-vec |
| 5 | **Open Horizons?** | PASS | A future fresh-scan variant can slot in behind the same flag |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: `collectSimilarityEdges` + `parseRelatedNeighbors` + `columnExists` + `pairKey`; gated by `options.similarity`.

**How to roll back**: `git revert` the commit; rebuild dist + recycle. Committed auto edges are strength + count bounded and removable via `memory_causal_unlink` / orphan cleanup.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Drive contradicts from structural supersession, not embedding similarity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-002-context -->
### Context

A `contradicts` edge asserts that two memories conflict — a strong claim. Deriving it from embedding similarity has a severe false-positive risk (similar text is usually agreement, not contradiction). The system already records a structural conflict signal: `memory_lineage.superseded_by_memory_id`, set when a memory is replaced by a successor.

### Constraints

- Do NOT derive `contradicts` from embedding similarity.
- Do NOT call `detectContradictions` to find candidates — it is an insert-time guard, not a candidate source.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Promote `memory_lineage.superseded_by_memory_id` into a predecessor->successor `contradicts` edge at strength ~0.3, `created_by='auto'`.

**How it works**: For each lineage row with a non-null `superseded_by_memory_id`, emit `contradicts` from the superseded predecessor (`memory_id`) to its successor (the recorded supersession direction), with self-loop guard. Graceful no-op if the table/column is absent.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structural supersession (chosen)** | Recorded fact; no false positives; deterministic | Only covers superseded pairs | 9/10 |
| Embedding-cosine 'contradicts' | Broader coverage | Severe false-positive risk; brief forbids it | 1/10 |
| `detectContradictions` as a candidate source | Reuses existing code | It is an insert-time guard, not a discovery scan; brief forbids it | 2/10 |

**Why this one**: Supersession is a recorded structural fact, so the edge carries no semantic guesswork.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- `contradicts` coverage grows from a trustworthy structural signal.

**What it costs**:
- Coverage is limited to recorded supersession pairs. Mitigation: acceptable; explicit `memory_causal_link` remains available for other contradictions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Direction mismatch (predecessor vs successor) | L | Direction taken straight from the recorded `superseded_by_memory_id` pointer; asserted by test |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The deferred contradicts signal needed a non-semantic source |
| 2 | **Beyond Local Maxima?** | PASS | Embedding + detectContradictions weighed and rejected |
| 3 | **Sufficient?** | PASS | Supersession supplies trustworthy contradicts pairs |
| 4 | **Fits Goal?** | PASS | Grows `contradicts` without false positives |
| 5 | **Open Horizons?** | PASS | A richer conflict signal can later supplement it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: `collectSupersessionEdges`; gated by `options.contradicts`.

**How to roll back**: `git revert`; behavior reverts on recycle.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Ship both collectors OPT-IN (default off)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-003-context -->
### Context

The shipped backfill (021) runs its two deterministic collectors whenever invoked (still dry-run-default). These two new collectors rest on softer signals — cached similarity and structural supersession — and write to a recently recovered ~9258-edge production DB. Turning them on unconditionally would change the behaviour of every existing `memory_causal_stats({ backfill })` caller.

### Constraints

- No behaviour change for existing callers.
- Keep the recovered DB safe; preserve the dry-run-default + bounded posture.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Gate each new collector behind its own option (`options.similarity`, `options.contradicts`), both defaulting to `false`; expose `options.similarityThreshold` (clamped 1-100, default 75) for the similarity collector. Both collectors run inside the existing transaction and reuse the existing post-commit `invalidateEntityDensityCache()` (no extra invalidation).

**How it works**: A caller must explicitly pass `similarity:true` / `contradicts:true` to enable the new edges; otherwise the backfill behaves exactly as before. The collectors still inherit `dryRun` default true and the bounded `limit`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in default off (chosen)** | No behaviour change; safe on recovered DB; reversible | Caller must opt in | 9/10 |
| On by default | Immediate coverage gains | Surprises existing callers; risk on recovered DB | 3/10 |
| Separate handler/tool | Isolated | Grows surface; duplicates the bounded-backfill plumbing | 4/10 |

**Why this one**: Opt-in is the conservative posture for softer signals on a recovered DB and keeps the existing contract intact.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Existing callers are unaffected; new coverage is available on explicit opt-in.

**What it costs**:
- Operators must know to pass the flags. Mitigation: the honest hint in `relation-coverage.ts` now advertises the exact opt-in command.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators unaware of the new collectors | L | Hint surfaces the `{ similarity:true, contradicts:true }` command |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Softer signals on a recovered DB demand a conservative gate |
| 2 | **Beyond Local Maxima?** | PASS | On-by-default and separate-tool weighed |
| 3 | **Sufficient?** | PASS | Two boolean flags + a threshold cover the need |
| 4 | **Fits Goal?** | PASS | Adds the deferred collectors without disturbing the shipped contract |
| 5 | **Open Horizons?** | PASS | Flags can default to true later once trust is established |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: `BackfillRelationInferenceOptions` gains `similarity?`/`contradicts?`/`similarityThreshold?`; collectors gated.
- `schemas/tool-input-schemas.ts`, `tools/types.ts`, `handlers/causal-graph.ts`: thread the 3 options.
- `relation-coverage.ts`: hint advertises the opt-in command.

**How to roll back**: `git revert`; the options + collectors disappear on the next dist rebuild + recycle.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
