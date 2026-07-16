---
title: "Decision Record: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Architectural decisions for the bi-temporal window phase: lineage as canonical event-time writer, retention-TTL exclusion from the bi-temporal consumer set and the tombstone-sweep vs temporal-close separation of concerns (C3-D)."
trigger_phrases:
  - "bitemporal window memory decisions"
  - "lineage canonical event-time writer"
  - "retention ttl excluded bitemporal"
  - "tombstone sweep vs temporal close"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-07-04T17:51:08.870Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window decision record from 028/001 research"
    next_safe_action: "Implement spearhead per ADR-001 (lineage event-time)"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Decision Record: Bi-temporal Window for Spec-Kit Memory Causal + Lineage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> DELETED, superseded by measurement. The `SPECKIT_BITEMPORAL_RECALL` flag and its code were removed in the flag-resolution reckoning because the validity window had zero callers and no point-in-time consumer ever read it. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lineage is the canonical event-time writer, causal `invalid_at` is a derived projection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/001 research (005-revisit-027 iter-019/024/035), Memory MCP maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The spearhead candidate `MEM-fact-invalidation-event-time` must close a superseded edge at the fact's real-world event-time, not at `now()`. Today `invalidateEdge()` writes `invalid_at = new Date().toISOString()` (`lib/graph/temporal-edges.ts:81,86,94`), so the graph records when we *noticed* a fact died rather than when it *actually* died. There are two stores that could own event-time: the causal-edge projection and the lineage store. We needed to decide which one is the source of truth, because sourcing the timestamp from the wrong store reintroduces the same bi-temporal error one layer down.

### Constraints
- The change must stay reader-transparent: all three current-edge readers use a binary `invalid_at IS NULL` test, and adding a `WHERE invalid_at < now()` reader would forfeit the H/S rating.
- Lineage is already ~3/4 bi-temporal (carries event-time fields, missing only `expired_at` per 005 iter-019/024/035). The causal edge carries zero transaction-time columns.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: derive the edge-close timestamp from the lineage store's event-time. Treat the causal `invalid_at` as a derived projection of that event-time, not an independent source.

**How it works**: `invalidateEdge()` takes/derives the superseding fact's lineage event-time and stamps it into the close column. When no lineage event-time is available it falls back to `now()` (fail-open). Readers are untouched and keep filtering `invalid_at IS NULL`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Lineage canonical (chosen)** | Single source of event-time truth, lineage already ~3/4 bi-temporal, reader-transparent | Requires plumbing lineage event-time to the close site | 9/10 |
| Causal projection as source | Closest to the existing write site | Causal has no transaction-time columns. Reintroduces the same conflation one layer down | 4/10 |
| Keep `now()` (status quo) | Zero work | Bi-temporal history stays wrong. "As of date X" queries lie | 1/10 |

**Why this one**: lineage is the only store that already models event-time, so making it canonical removes the conflation at the source rather than papering over it in the projection.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- "What did we believe as of date X" lineage queries return the belief-state correct for X.
- The close timestamp reflects real-world event-time, fixing the transaction-time conflation (H leverage, structural inference, no benchmarked number exists per research §6).

**What it costs**:
- The close site must read the lineage event-time. Mitigation: fail-open fallback to `now()` keeps the close working when event-time is unavailable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Event-time sourced from the causal projection by mistake | M | This ADR fixes lineage as canonical. Code review checks the source |
| A reader compares `invalid_at` to a clock, breaking transparency | H | Readers stay on `IS NULL`, grep gate (REQ-002) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `invalidateEdge()` stamps `now()` today, making bi-temporal history wrong |
| 2 | **Beyond Local Maxima?** | PASS | Causal-projection and status-quo alternatives weighed and scored |
| 3 | **Sufficient?** | PASS | Single-site writer change, no read-path rewrite |
| 4 | **Fits Goal?** | PASS | The H/S spearhead of the 028 Memory primary subsystem |
| 5 | **Open Horizons?** | PASS | Lineage-canonical also underpins C3-B / C3-A / Code-Graph Q1-C1 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/graph/temporal-edges.ts` `invalidateEdge()`: stamp lineage event-time, fall back to `now()`.
- Readers unchanged (`temporal-edges.ts:108-138`, `contradiction-detection.ts:75-77,99-110`, `frontmatter-promoter.ts` `openEdgeClause`).

**How to roll back**: `git revert` the spearhead's scoped commit. `invalidateEdge()` returns to writing `now()`. No schema change in this ADR, so no down-migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Retention TTL is EXCLUDED from the bi-temporal consumer set

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/001 research (005-revisit-027 edit #4), Memory MCP maintainers |

---

<!-- ANCHOR:adr-002-context -->
### Context

The four-timestamp window (C3-B) is shared by causal edges, lineage and (in the sibling subsystem) `code_edges`. A natural-but-wrong instinct is to also fold retention TTL into the same model. Retention TTL physically deletes rows on expiry. The bi-temporal window keeps superseded facts as closed-but-readable history. Treating them as the same concern would fork a third temporal store and corrupt the "currentness = edge presence" model.

### Constraints
- 027 already sweeps purely on TTL (`memory-retention-sweep.ts:177,185-193,542-566`). That subsystem is shipped and orthogonal.
- The bi-temporal consumers are causal + lineage (+ `code_edges` in the sibling). Retention is not one of them.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: scope the bi-temporal window to causal + lineage (+ `code_edges` in the sibling) and explicitly EXCLUDE retention TTL.

**How it works**: physical deletion (TTL) and edge-presence currentness (temporal-close) stay separate code paths and separate stores. The four-timestamp window is never applied to the retention sweep.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclude retention TTL (chosen)** | Keeps currentness = edge-presence coherent, no third store | Two temporal-ish concepts must be explained as distinct | 9/10 |
| Fold TTL into the window | One "temporal" surface | Category error, physical deletion is the opposite of closed-but-readable. Forks a third store | 2/10 |

**Why this one**: edge-presence currentness and physical forgetting are opposite operations. Unifying them would make "is this fact current" unanswerable after a TTL purge.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The bi-temporal model stays coherent: a closed edge is History-readable. A TTL-purged row is gone.
- No third temporal store is introduced.

**What it costs**:
- Maintainers must keep the distinction clear in docs. Mitigation: ADR-003 records the tombstone-sweep vs temporal-close split explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future change wires TTL into the window | M | This ADR + ADR-003 record the exclusion, review gate |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents a category error that would fork a third store |
| 2 | **Beyond Local Maxima?** | PASS | The "fold TTL in" alternative was considered and rejected |
| 3 | **Sufficient?** | PASS | A scoping decision, no code beyond keeping paths separate |
| 4 | **Fits Goal?** | PASS | Keeps the bi-temporal substrate's invariant intact |
| 5 | **Open Horizons?** | PASS | Aligns with 027's already-shipped TTL subsystem |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- No code change, a scoping boundary: the C3-B window declaration (`vector-index-schema.ts`) covers causal + lineage only. The retention sweep is untouched.

**How to roll back**: N/A, this is a non-coding scoping decision. Reversal would mean a deliberate future decision to fold TTL in (discouraged).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Tombstone-sweep and temporal-close are separate concerns (C3-D), skip-closed is defensive hardening, not a gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/001 research (005-revisit-027 iter-032), Memory MCP maintainers |

---

<!-- ANCHOR:adr-003-context -->
### Context

C3-D is the separation-of-concerns note for the bi-temporal program. Two distinct lifecycle operations are easy to conflate: tombstone-sweep ("off-state forgetting", `lib/causal/sweep.ts:68-100`) physically retires edges, while temporal-close ("not current", `lib/graph/temporal-edges.ts:64-80`) marks an edge closed but readable. The original framing treated the `skip-closed-in-sweep` guard as a hard gate that C3-A (the live edge-presence retirement path) depended on. Adversarial verification (005 iter-032) downgraded that: no automatic producer creates the `contradicts`-on-a-frontmatter-pair collision the guard protects against, and the sweep tombstones before deleting, so the fork is theoretical and tombstone-recoverable.

### Constraints
- The `skip-closed-in-sweep` guard (`frontmatter-promoter.ts` `openEdgeClause`, `AND invalid_at IS NULL`) is already SHIPPED (030 commit `e1c6a3c793`).
- It must ship as cheap defensive hardening *before* C3-A, but must not be treated as a data-loss blocker.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: document tombstone-sweep and temporal-close as separate concerns, and classify `skip-closed-in-sweep` as defensive hardening, not a hard C3-A gate.

**How it works**: the promoter cleanup keeps the `AND invalid_at IS NULL` open-edge clause so closed generated edges are not re-touched. This is hygiene that runs ahead of C3-A, but C3-A is not blocked on it (the collision it guards is theoretical and recoverable from tombstones).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defensive hardening, not a gate (chosen)** | Matches the adversarial finding, unblocks C3-A sequencing | Requires explaining the nuance | 9/10 |
| Treat skip-closed as a hard C3-A data-loss gate | Conservative | Over-claims: no automatic producer creates the collision. Sweep is tombstone-recoverable (iter-032) | 4/10 |

**Why this one**: the verified record shows the collision is theoretical and tombstone-recoverable, so gating C3-A on it would be unfounded conservatism.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- C3-A sequencing is unblocked while still getting the cheap hardening.
- The lifecycle model is legible: forgetting (delete) vs not-current (close) are clearly distinct.

**What it costs**:
- The nuance ("hardening, not gate") must be carried forward. Mitigation: recorded here and in spec.md REQ-006.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future producer DOES create the collision | L | The shipped guard already handles it defensively. Revisit if a producer appears |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents over-gating C3-A on a theoretical collision |
| 2 | **Beyond Local Maxima?** | PASS | Hard-gate alternative weighed against the iter-032 finding |
| 3 | **Sufficient?** | PASS | A classification + the already-shipped guard |
| 4 | **Fits Goal?** | PASS | Keeps the bi-temporal program's sequencing honest |
| 5 | **Open Horizons?** | PASS | Leaves room to re-gate if a real producer emerges |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- No new code, the `skip-closed-in-sweep` guard is SHIPPED (`e1c6a3c793`). This ADR records its classification and the separation note.

**How to roll back**: N/A, classification + an already-shipped guard. Reverting the guard is `git revert e1c6a3c793` but is not recommended (cheap, harmless hardening).
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
