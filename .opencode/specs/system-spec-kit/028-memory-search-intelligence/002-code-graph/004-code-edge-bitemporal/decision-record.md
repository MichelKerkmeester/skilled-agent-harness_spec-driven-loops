---
title: "Decision Record: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "Architectural decisions for the Code Graph schema-migration cluster. 2026-06-19 amendment: schema foundation shipped (SCHEMA_VERSION 6->7, code_edges valid_at/invalid_at, UP/DOWN/BACKFILL, default-off consumers); lifecycle/timeline consumers remain gated."
trigger_phrases:
  - "code edge bitemporal decisions"
  - "q1-c1 defer speculative"
  - "code graph live view chokepoint decision"
  - "edge lifecycle refuted standalone"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded schema-foundation implementation amendment"
    next_safe_action: "Hold temporal consumers behind explicit opt-in and benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

## 2026-06-19 Amendment

User approval unblocked the schema foundation while keeping consumer behavior gated. `code_edges.valid_at` / `invalid_at`, SCHEMA_VERSION 6->7, UP/DOWN/BACKFILL helpers, fail-closed idempotent migration tests, and fresh-init support are DONE. ADR-001 remains the decision for unbenchmarked temporal consumers: no default read/write behavior consumes these columns unless a future path explicitly opts into `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`.

<!-- ANCHOR:adr-001 -->
## ADR-001: The whole Q1-C1 cluster is DEFER-speculative — ship nothing this phase

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (200-iteration campaign, 006 sibling-revisit), Code Graph maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The cluster (Q1-C1 validity columns, Q1-C1-views live-view, CG-edge-bitemporal-lifecycle, CG-symbol-timeline-query) would make `code_edges` bi-temporally explicit so reads could serve as-of-last-green-scan results and answer "what did the call graph look like at commit X". The reindex is destructive DELETE+INSERT today with no temporal columns (`code-graph-db.ts:177-184`, SCHEMA_VERSION 5), so this is a genuine capability gap. But three independent findings across 200 iterations are deflationary: (1) **no consumer** wants as-of/time-travel reads — none was found anywhere in the codebase or the campaign; (2) the **safety case is redundant** with the already-shipped readiness gate (`code-graph-context.ts:313-321` blocks reads on `freshness !== 'fresh'`, degrading rather than serving stale); (3) it **does not fix the one real bug** — dependency-transitivity edge-staleness (a file whose dependency changed but whose own content-hash is stable leaves stale edges), which is owned by the sibling `002-edge-staleness-correctness`.

### Constraints
- The cluster is a high-blast-radius schema migration (the whole read/resolve/prune surface, not the 4 DELETE lines).
- It depends on Q6-C1 (the hard generation watermark) landing first — the generation is the value stamped into `invalid_at`.
- "A built-behind-a-flag feature is a bet not yet cashed in" (027-revisit's own deflation principle).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: DEFER the entire cluster. This phase ships no schema migration and marks all five candidates PENDING (gated). The cluster is un-deferred ONLY when a real as-of/time-travel consumer is named AND Q6-C1 has shipped.

**How it works**: the gated plan, the atomic co-ship boundary, the live-view keystone, and the aionforge schema reference are preserved here so the work is ready IF a consumer appears. Until then, the real edge-staleness bug is routed to the sibling phase, and nothing migrates.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **DEFER-speculative (chosen)** | No speculative spend; routes the real bug correctly; plan ready IF a consumer appears | The capability stays unbuilt | 9/10 |
| Build the cluster now | Closes the bi-temporal gap | No consumer; redundant safety; doesn't fix the real bug; high blast-radius for zero realized value | 2/10 |
| Build a partial (columns only, no views/lifecycle) | Smaller | Q1-C1 without the live-view leaks the migration across the read surface; still no consumer | 3/10 |

**Why this one**: a high-blast-radius schema migration with no consumer, a redundant safety story, and no fix for the actual bug is the textbook speculative build the campaign was designed to catch.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero speculative migration cost; engineering effort routes to the real staleness bug (sibling phase).
- The plan is legible and ready IF demand materializes.

**What it costs**:
- The as-of/time-travel capability stays unbuilt. Mitigation: the gated plan + aionforge reference are preserved; un-deferring is a known, sequenced path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer appears and the plan has rotted | M | The seams are file:line-pinned; refresh the trace (dangling-prune `:957-968`) at un-defer time |
| The cluster is mistaken for a staleness fix | M | ADR + spec route the real bug to `002-edge-staleness-correctness` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No consumer; safety redundant; doesn't fix the real bug (200-iter finding) |
| 2 | **Beyond Local Maxima?** | PASS | Build-now and build-partial alternatives weighed and scored |
| 3 | **Sufficient?** | PASS | The DEFER decision + the gated plan are the deliverable |
| 4 | **Fits Goal?** | PASS | Keeps the 028 program honest (deflationary; no speculative spend) |
| 5 | **Open Horizons?** | PASS | The plan is ready IF a consumer appears; un-defer path is sequenced |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- No code — the cluster is deferred. The candidate STATUS table marks all five PENDING (gated); the real bug routes to the sibling phase.

**How to roll back**: N/A — a non-coding DEFER decision; "reversal" is a future, evidence-backed decision to un-defer.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Q1-C1 + Q1-C1-views co-ship atomically; the live-view is the read chokepoint

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (002 iter-018 schema reference, iter-023 build sequence), Code Graph maintainers |

---

<!-- ANCHOR:adr-002-context -->
### Context

IF the cluster is ever un-deferred, the validity columns (Q1-C1) and the live current-view (Q1-C1-views) must not land separately. Q1-C1 alone would mean every default reader has to learn the `invalid_at IS NULL` filter, leaking the migration across the whole read surface — high blast-radius, easy to get wrong, easy to forget a site. The aionforge reference (`relates_to.rs:313-332`, `store.rs:894-927`, 002 iter-018) solves this with a single live-view chokepoint: define "current" exactly ONCE as a SQL VIEW (`WHERE invalid_at IS NULL AND status NOT IN (superseded, quarantined)`), force all default reads through it, and let as-of/audit readers deliberately bypass. The migration shares ONE `code-graph-db.ts` transaction boundary (the reindex DELETE+INSERT swap), one `d.transaction()` on the serialized WAL connection (`:511`).

### Constraints
- SCHEMA_VERSION 5->6 (`:142`); `ensureSchemaMigrations()` has ONE call site (`:511`); the body is purely additive today (no table-rebuild pattern exists yet — closed-vocab adds the first).
- The generation must bump atomically with the swap (Q6-C1 dependency); `invalid_at` holds the generation value.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Q1-C1 columns AND the `code_*_live` views land in ONE atomic SCHEMA_VERSION 5->6 migration; the live-view is THE read chokepoint that localizes the migration; the four reindex DELETE sites (`:941,:985,:1012,:1031`) become `UPDATE ... SET invalid_at = <generation>` + INSERT in the same transaction.

**How it works**: default reads query `code_*_live`; only the CG-symbol-timeline-query as-of reader bypasses to the base tables; a rescan of unchanged content is a no-op (apply-once G2 invariant); the generation bumps in the same commit.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Atomic co-ship + live-view chokepoint (chosen)** | Migration localized to one VIEW; one atomic commit; low chance of a missed read site | More upfront design | 9/10 |
| Columns first, views later | Smaller first commit | Every reader must learn `invalid_at IS NULL`; leaks across the read surface; partial-current state | 3/10 |
| No view, filter inline at every reader | No view object | The exact high-blast-radius failure the chokepoint avoids | 2/10 |

**Why this one**: the live-view is the de-risk prerequisite — it is the single definition of "current" the aionforge reference is built around (002 iter-018 keystone).
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The migration is localized; default reads change in exactly one place (the view).
- The apply-once G2 invariant keeps a no-change rescan a no-op (no write amplification).

**What it costs**:
- The atomic migration is a larger single commit. Mitigation: one `d.transaction()` makes partial application impossible — it either applied or it did not.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A default reader bypasses the live-view by mistake | H | grep gate: default reads query `_live`; only the timeline reader bypasses |
| `invalid_at` stamped with wall-clock, not generation | M | Q6-C1 first; stamp the generation value |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Q1-C1 without the view leaks the migration across the read surface |
| 2 | **Beyond Local Maxima?** | PASS | Columns-first and no-view alternatives weighed |
| 3 | **Sufficient?** | PASS | One VIEW + one atomic migration + the G2 invariant |
| 4 | **Fits Goal?** | PASS | The aionforge-referenced keystone (002 iter-018) |
| 5 | **Open Horizons?** | PASS | The as-of reader (timeline) bypasses cleanly once a consumer exists |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes (IF un-deferred)**:
- `code-graph-db.ts`: add `valid_at`/`invalid_at` (`:177-184`) + `CREATE VIEW code_*_live`; reindex DELETEs (`:941,:985,:1012,:1031`) → `UPDATE ... SET invalid_at = <generation>` + INSERT; SCHEMA_VERSION 5->6.
- `code-graph-context.ts`: default reads route through the live-view; the timeline reader bypasses.

**How to roll back**: revert the single atomic migration commit; columns are additive/nullable, views droppable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Standalone CG-edge-bitemporal-lifecycle is REFUTED; it survives only as a layer on Q1-C1 columns

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (002 iter-013 Round E verify), Code Graph maintainers |

---

<!-- ANCHOR:adr-003-context -->
### Context

CG-edge-bitemporal-lifecycle proposed edge-granularity versioning: a `RELATES_TO`-style edge carrying `valid_from`/`valid_to` + `ingested_at`/`expired_at`, one current edge per ordered pair, with a relabel becoming a close-and-replace revision. As a STANDALONE candidate it was REFUTED in adversarial verification (002 iter-013): the code-graph reindex rebuilds edges every scan (DELETE-by-source + re-INSERT, `replaceEdges:985`), so a "never-delete + supersede" model fundamentally fights the core write model; and the existing tombstone machinery (`:247-260`) already records edge deletion-history, so standalone lifecycle would duplicate it.

### Constraints
- The per-scan DELETE+INSERT rebuild is the core model; edge identity is not preserved across scans without the Q1-C1 columns.
- Tombstones (opt-in, off by default, `SPECKIT_CODE_GRAPH_TOMBSTONES`) already cover deletion-history.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: CG-edge-bitemporal-lifecycle ships ONLY as the edge-granularity layer ON TOP OF Q1-C1's validity columns + atomic supersede (002 iter-023 Phase 3) — never as a standalone. It is not duplicated against the tombstone deletion-log; lifecycle is versioning, tombstones are a deletion-history.

**How it works**: once Q1-C1 provides cross-scan edge identity + the validity window, the edge-write path can do close-and-replace on relabel (`structural-indexer.ts`). Without Q1-C1, no edge-versioning is attempted.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Layer on Q1-C1 columns only (chosen)** | Works with the rebuild model once edge identity is preserved; no tombstone duplication | Depends on Q1-C1 landing first | 8/10 |
| Standalone edge-versioning | Independent of Q1-C1 | REFUTED — fights the per-scan rebuild; duplicates tombstones (002 iter-013) | 2/10 |

**Why this one**: the rebuild model only supports versioning once Q1-C1 gives edges cross-scan identity; standalone is structurally incompatible.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No structurally-doomed standalone build; lifecycle correctly sequenced after Q1-C1.
- No duplication of the tombstone deletion-history.

**What it costs**:
- The lifecycle layer is gated behind Q1-C1 (itself deferred). Mitigation: that is the correct sequencing, not a cost.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone attempts standalone versioning | M | This ADR records the REFUTATION; review gate |
| Lifecycle duplicates the tombstone log | L | Reconcile: lifecycle = versioning, tombstones = deletion-history |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents a structurally-doomed standalone build |
| 2 | **Beyond Local Maxima?** | PASS | Standalone alternative weighed and refuted (iter-013) |
| 3 | **Sufficient?** | PASS | Sequencing rule: layer on Q1-C1 only |
| 4 | **Fits Goal?** | PASS | Keeps the cluster's build order honest |
| 5 | **Open Horizons?** | PASS | Lifecycle becomes feasible once Q1-C1 lands |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes (IF un-deferred)**:
- `structural-indexer.ts` edge-write: close-and-replace on relabel, layered on Q1-C1 columns; reconciled with tombstones (no duplication).

**How to roll back**: N/A this phase (deferred); IF built, the lifecycle layer reverts with the Q1-C1 migration it depends on.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The `code_edges` validity-window shape is shared with Memory C3-B (build once, reconcile, do not fork)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028 cross-subsystem research (roadmap shared-infra row, synthesis 01 §Shared infrastructure), Memory + Code Graph maintainers |

---

<!-- ANCHOR:adr-004-context -->
### Context

The bi-temporal validity-window (the four-timestamp / `valid_*`+`invalid_at` shape) is a shared-infrastructure item across two subsystems: Memory's causal + lineage edges (C3-B, `007-bitemporal-window`) and Code Graph's `code_edges` (Q1-C1). The roadmap's shared-infra row and synthesis 01 both flag this as "build once, reuse N": the same column shape should be reconciled so Memory's causal-edge store and Code Graph's edge table share it rather than forking into two divergent temporal schemas. Retention TTL is explicitly EXCLUDED from the consumer set (physical deletion is the opposite of edge-presence currentness — Memory ADR-002).

### Constraints
- Memory's C3-B is itself additive-and-UNVERIFIED against `active_memory_projection` (no migration spec exists); the shape is the shared artifact, not a shipped schema.
- aionforge's four-timestamp window (`fact.rs:203-239`) is the external reference for both: `{valid_from, valid_to}` event-time + `{ingested_at, expired_at}` txn-time, with valid_to/expired_at OMITTED while open (absence = current).
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: align the `code_edges` validity-window column shape with Memory's C3-B; reconcile the two rather than forking a third temporal schema. Retention TTL is excluded from the consumer set on both sides.

**How it works**: the column names and semantics (`valid_*`+`invalid_at`, absence = current) match across causal/lineage (Memory) and `code_edges` (Code Graph); the aionforge four-timestamp window is the common reference.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Share the shape with C3-B (chosen)** | One validity-window shape across subsystems; no schema fork | Requires cross-subsystem coordination | 8/10 |
| Fork a code-graph-specific shape | No coordination | Two divergent temporal schemas; the exact fork the shared-infra row warns against | 3/10 |

**Why this one**: the validity-window shape is the most-transferable cross-subsystem artifact; forking it would defeat the build-once intent.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One validity-window shape, reconciled across Memory and Code Graph; no divergent temporal schema.

**What it costs**:
- Cross-subsystem coordination at build time (both are deferred today). Mitigation: the shape is documented here and in the Memory sibling.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two subsystems fork the shape under time pressure | M | This ADR + the Memory sibling record the shared shape; reconcile at build |
| C3-B's additivity is itself unverified | M | The shape is the shared artifact; the migration is confirmed per-subsystem at build |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents a divergent temporal-schema fork across subsystems |
| 2 | **Beyond Local Maxima?** | PASS | Fork alternative weighed and rejected |
| 3 | **Sufficient?** | PASS | A shape-sharing decision; per-subsystem migration confirmed at build |
| 4 | **Fits Goal?** | PASS | Realizes the roadmap's build-once shared-infra intent |
| 5 | **Open Horizons?** | PASS | The shared shape underpins both Memory C3-B and Code Graph Q1-C1 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes (IF un-deferred)**:
- `code-graph-db.ts` declares `valid_at`/`invalid_at` matching Memory's C3-B column shape; the aionforge four-timestamp window is the common reference; retention TTL excluded.

**How to roll back**: N/A this phase (deferred); IF built, the shape is part of the Q1-C1 migration and reverts with it.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
