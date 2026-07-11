---
title: "Decision Record: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Load-bearing decisions for the five PENDING temporal candidates: C3-A is a read-side build not a flag flip, lineage is the canonical supersede writer, C3-C Current reads alongside active_memory_projection, temporal-query-extraction must be additive with a non-temporal fallthrough and unforget-disjointness is deferred until both an unforget channel and erasure exist."
trigger_phrases:
  - "decision record edge presence currentness"
  - "c3-a read side build not flip"
  - "lineage canonical supersede writer"
  - "temporal mode current projection"
  - "unforget disjointness deferred"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/009-edge-presence-currentness"
    last_updated_at: "2026-07-04T17:51:03.395Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the load-bearing decisions for the five PENDING temporal candidates"
    next_safe_action: "Use these decisions as implementation constraints once C3-B substrate lands"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

> DELETED, superseded by measurement. The `SPECKIT_EDGE_PRESENCE_CURRENTNESS` flag and its code were removed in the flag-resolution reckoning because the reconciliation pass repaired 0 rows on the live graph, an integrity pass and not a recall lever. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat C3-A as a read-side build, not a flag flip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028 BROADENING addendum |

---

<!-- ANCHOR:adr-001-context -->
### Context

Pass-1 ranked C3-A as Ship-First #3, a "clean reversible flag flip" to make edge-presence currentness live. The 028 broadening pass refuted that: `SPECKIT_TEMPORAL_EDGES` is **already ON** (`ENV_REFERENCE.md:296`, `search-flags.ts:706`). The bi-temporal substrate (`temporal-edges.ts`, `contradiction-detection.ts:75-77, 99-110`) now carries the read-side wiring: the read-side filter plus store reconciliation shipped at cb92f2f211.

### Constraints

- No flag flip is available, the flag is already on.
- The lineage canonical writer and the causal-edge `invalid_at` projection must not fork into a third source of truth (`vector-index-schema.ts:184-185`).
- A superseded fact must be closed (History-readable), never physically destroyed.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Implement C3-A as a read-side `getValidEdges` filter (`AND invalid_at IS NULL`) on the recall path plus a lineage↔causal-edge store reconciliation, a BUILD (medium, med-high risk). Shipped at cb92f2f211 with a 241-line passing test.

**How it works**: Recall derives currentness from edge presence on the read side, the reconciliation keeps lineage canonical and the causal `invalid_at` projection derived, so there is exactly one supersede writer.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-side build + store reconciliation** | Honest, makes currentness actually live | Med-high effort, live retirement-path change | 10/10 |
| Flip `SPECKIT_TEMPORAL_EDGES` and trust the substrate | Cheap on paper | Flag is already ON, nothing flips, currentness stays read-unwired | 1/10 |
| Forget physical-deletion + retire via retention TTL | Familiar | Category-opposite of edge-presence currentness, destroys history | 2/10 |

**Why this one**: The broadening pass proved the flip is fictional, the read-side build is the only path that delivers the capability.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Currentness becomes a live, edge-presence-derived read-path property.
- A single canonical supersede writer (lineage) prevents store drift.

**What it costs**:
- C3-A is the riskiest item in the phase (live retirement-path change). Mitigation: keep the read-side filter and the reconciliation in separable hunks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reconciliation forks the store into a third source of truth | H | Lineage-canonical invariant + reconciliation test |
| Read-side filter changes Current-mode results | M | Byte-check Current recall against baseline |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The substrate is unwired, currentness is not live today |
| 2 | **Beyond Local Maxima?** | PASS | Flip and retention-TTL options rejected with evidence |
| 3 | **Sufficient?** | PASS | Read-side filter + reconciliation deliver the capability |
| 4 | **Fits Goal?** | PASS | Goal is live edge-presence currentness |
| 5 | **Open Horizons?** | PASS | Leaves C3-C / memory_history to build on the read path |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Read-side `getValidEdges` currentness filter on the recall path.
- Lineage↔causal-edge store reconciliation (lineage canonical).

**How to roll back**: Revert the read-side filter, unwind the reconciliation hunk separately.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: C3-C Current reads alongside active_memory_projection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028 027-REVISIT edit #4 |

---

<!-- ANCHOR:adr-002-context -->
### Context

TemporalMode (Current / AsOf / AsKnownAt / History) needs a "Current" provider. The real current-memory read store is `active_memory_projection` (~12 JOIN sites / 2 writers). If "Current" replaces the projection with causal edge-presence reads, the cost crosses from M to L. AsKnownAt (transaction-time) is gated on the C3-B four-timestamp window, which is owned by a sibling phase.

### Constraints

- Current-mode recall must stay byte-identical to today unless an explicit projection migration is approved.
- AsKnownAt must not return a silently-wrong answer before C3-B lands.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Default C3-C "Current" to read alongside `active_memory_projection` (M), not to replace it (L), gate AsKnownAt on C3-B, ship Current/AsOf/History first.

**How it works**: Current preserves the existing projection read, AsOf/History select the closed-window edge set by `invalid_at`, AsKnownAt returns a typed gated-capability error until C3-B's transaction-time columns exist.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Current alongside the projection (M)** | Byte-identical default, lower blast radius | Two read stores coexist | 10/10 |
| Current replaces the projection with edge-presence reads (L) | Single source of truth | ~12 JOIN sites / 2 writers, high blast radius | 4/10 |
| Ship AsKnownAt before C3-B | Feature-complete sooner | Silently-wrong transaction-time answers | 1/10 |

**Why this one**: Lowest-blast default that still surfaces the temporal-mode capability.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- TemporalMode ships at M effort with byte-identical Current behavior.

**What it costs**:
- AsKnownAt is gated until C3-B. Mitigation: typed gated-capability error, ship the other three modes now.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Projection vs edge-presence drift under Current | M | Reconciliation from ADR-001 keeps lineage canonical |
| Open question (replace vs alongside) reopened later | L | Treat projection replacement as a separate decision |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Temporal recall has no UX today |
| 2 | **Beyond Local Maxima?** | PASS | Replace-projection and ship-AsKnownAt-early options rejected |
| 3 | **Sufficient?** | PASS | Three modes ship, AsKnownAt gated cleanly |
| 4 | **Fits Goal?** | PASS | Goal is temporal-mode recall without recall regression |
| 5 | **Open Horizons?** | PASS | Projection migration stays an open, separable decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `TemporalMode` enum + `current-support` provider, Current via `active_memory_projection`.
- AsKnownAt gated on C3-B (typed error pre-migration).

**How to roll back**: Remove the `TemporalMode` enum and provider, recall falls back to Current-only.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: temporal-query-extraction must be additive with a non-temporal fallthrough

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 028 MEMORY-SYSTEMS addendum |

---

<!-- ANCHOR:adr-003-context -->
### Context

The Memory MCP has no query-time temporal parsing, recency is only a decay/boost weight, and records carry timestamps that are never searched by an extracted range (007 iter-013, iter-008:16). The Cognee `temporal_retriever` pattern extracts a structured `QueryInterval` from the NL query, filters events by range, then vector-ranks. The candidate carries a "CG-" prefix but is Memory-home (NO-TRANSFER cross-cut, not Code Graph / Deep Loop).

### Constraints

- A non-temporal query must be byte-identical to today (the feature is additive).
- A false-positive range parse must not narrow a non-temporal query.
- The precision win over the existing recency boost is unmeasured (needs-benchmark).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Build the extractor as an additive pre-rank filter with a strict bounds-detection gate and a fallthrough to the existing search when no bounds are found, treat the go decision as benchmark-gated for range-filter precision.

**How it works**: When the parser finds explicit bounds, events are filtered by the `QueryInterval` before vector ranking, otherwise the path is byte-identical to baseline.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive extractor + non-temporal fallthrough** | Zero regression for non-temporal queries | Needs a precision benchmark before go | 10/10 |
| Replace the recency boost with range filtering globally | Conceptually cleaner | Regresses every non-temporal query | 2/10 |
| Skip the candidate | No work | Leaves a confirmed capability gap | 4/10 |

**Why this one**: Additive + fallthrough is the only shape that cannot regress the common (non-temporal) path.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A temporal NL query filters by the named range instead of a soft recency boost.

**What it costs**:
- The go decision waits on a precision benchmark. Mitigation: ship behind the benchmark or keep PENDING.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False-positive range parse narrows a non-temporal query | M | Strict bounds detection + non-temporal byte-check |
| Unmeasured precision win | M | Benchmark before promoting to go |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No query-time temporal parsing exists (confirmed gap) |
| 2 | **Beyond Local Maxima?** | PASS | Global-replace option rejected |
| 3 | **Sufficient?** | PASS | Additive filter + fallthrough covers the capability |
| 4 | **Fits Goal?** | PASS | Adds temporal recall without regressing normal recall |
| 5 | **Open Horizons?** | PASS | Benchmark gate keeps the precision question open and honest |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- A query-time `QueryInterval` parser + event range-filter + non-temporal fallthrough.

**How to roll back**: Remove the parser and filter, recall is byte-identical to baseline.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Defer M-unforget-channel-disjointness until both an unforget channel and erasure exist

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | Re-plan author, grounded in 001 iter-012 / iter-016 |

---

<!-- ANCHOR:adr-004-context -->
### Context

M-unforget-channel-disjointness extends the C3-D 2-channel revision base to a 4-channel matrix so the channels leave disjoint `(expired_at, status, edge)` fingerprints and `unforget(id)` is a safe bare-key removal. The research verdict is NEEDS-BENCHMARK (defer): it is a cross-channel invariant that depends on **both** an unforget channel AND erasure, only one half of which is present today (001 iter-016:13). C3-D itself is a pure decision note (not a deny-list registry), and it does not collide with the erasure "no deny-list" GDPR invariant (001 iter-016:15-16).

### Constraints

- The disjointness invariant cannot be proven safe while only one of {unforget channel, erasure} exists.
- C3-D must stay a decision note codifying the 3-way separation (erasure vs tombstone-sweep vs temporal-close), never a persisted deny-list.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Keep the candidate PENDING (defer) within this phase: author the 4-channel invariant + a property test against the channels that exist, but do not claim R5 complete until both halves are present.

**How it works**: The status-ownership write-refusal guard and the disjointness property test land against the existing channels, the full bare-key `unforget(id)` safety is gated on the erasure/unforget pair.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer with a partial invariant + property test** | Honest, banks the testable half | Full unforget safety waits | 10/10 |
| Build the full 4-channel unforget now | Feature-complete | Unprovable while erasure/unforget half is absent | 2/10 |
| Drop the candidate entirely | No work | Loses the disjointness reasoning the matrix needs | 3/10 |

**Why this one**: Banks the provable half without overclaiming a safety property that cannot yet hold.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The revision matrix has a documented 4-channel disjointness target and a property test.

**What it costs**:
- Full `unforget(id)` bare-key safety is not delivered this phase. Mitigation: gate it on the erasure packet, keep C3-D a decision note.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| C3-D mistaken for a deny-list registry | M | Keep C3-D a pure decision note (3-way separation + no persisted erased-id list) |
| Disjointness claimed complete prematurely | M | Mark PENDING until both halves exist |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The matrix needs the disjointness reasoning |
| 2 | **Beyond Local Maxima?** | PASS | Build-now and drop options rejected with evidence |
| 3 | **Sufficient?** | PASS | Partial invariant + property test banks the provable half |
| 4 | **Fits Goal?** | PASS | Goal is safe unforget under disjoint channels |
| 5 | **Open Horizons?** | PASS | Erasure packet remains the path to full safety |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- A 4-channel disjointness invariant + status-ownership guard + property test against existing channels (PENDING for full bare-key safety).

**How to roll back**: Remove the guard, the revision matrix reverts to the 2-channel base.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
