---
title: "Decision Record: Relation-Backfill Review Remediation"
description: "Architectural decisions for remediating the relation-inference backfill review findings: suppress conflicting emission vs alter the detector, a relation-agnostic conflict guard, delta-based honest counting, and a strict inner backfill schema."
trigger_phrases:
  - "relation backfill remediation decision"
  - "suppress contradicts emission vs detector"
  - "relation agnostic conflict guard decision"
  - "backfill delta counting decision"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation"
    last_updated_at: "2026-06-04T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001..004"
    next_safe_action: "Strict-validate packet"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Decision Record: Relation-Backfill Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Suppress the conflicting backfill emission, do not change the contradiction-detection labeling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

The supersession collector emits `contradicts` for predecessor->successor, and the lineage collector emits `caused` for the SAME directed pair because lineage is reciprocal. When `contradicts` commits, contradiction-detection treats `caused` and `contradicts` as a conflicting pair and invalidates the just-created `caused` edge. The `contradicts` direction/labeling is itself correct and intentional (a successor records the supersession); the problem is that promoting BOTH structural facts for the same pair makes the backfill fight itself.

### Constraints

- Must not relabel an evolution (`caused`) as a contradiction or corrupt traversal.
- Must not weaken the contradiction-detection rules that serve manual edges.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the `contradicts` direction/labeling and the detector untouched; instead, the backfill SKIPS a conflict-prone candidate when the pair already carries a VALID conflicting-relation edge. A `caused` edge already present (from the lineage collector or from a prior run) suppresses the supersession `contradicts` on that pair.

**How it works**: The non-conflicting collectors insert first; then each conflict-prone candidate is checked via `hasConflictingValidEdge` against the live, in-transaction edge set, and dropped if a conflicting valid edge exists.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Suppress conflicting emission (chosen)** | Protects all valid edges; detector unchanged; auditable | Supersession `contradicts` is not auto-created when a `caused` exists | 9/10 |
| Exempt the backfill from contradiction-detection | Both edges persist | Two contradictory edges on one pair corrupt traversal; defeats the detector's purpose | 3/10 |
| Stop emitting lineage `caused` for superseded pairs | One edge per pair | Loses the recorded evolution link, which is the more useful traversal signal | 4/10 |
| Change the `contradicts` direction | — | Direction is correct; would not fix the same-pair collision | 1/10 |

**Why this one**: A `caused` evolution link is the more valuable, correctly-directed signal for that pair; suppressing the contradictory auto emission keeps the graph coherent and protects pre-existing manual/higher-strength edges too.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No committed backfill silently invalidates an established valid edge.
- An evolution stays labeled `caused`, so traversal is not corrupted.

**What it costs**:
- Supersession `contradicts` is not auto-created on pairs that already have a conflicting `caused`. Mitigation: `memory_causal_link` remains available for an explicit `contradicts` if ever warranted.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator expects a `contradicts` edge that was skipped | L | `skippedConflicting` count + hint make the suppression visible |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Confirmed repro: caused 20->21 was invalidated |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed; suppress-emission chosen |
| 3 | **Sufficient?** | PASS | Guard covers auto-vs-auto and manual-vs-auto |
| 4 | **Fits Goal?** | PASS | Preserves data integrity + correct traversal |
| 5 | **Open Horizons?** | PASS | Explicit `contradicts` still possible via manual link |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: `hasConflictingValidEdge` + `insertNonConflictingEdges`; transaction reordered so non-conflicting edges insert first.

**How to roll back**: `git revert`; rebuild dist + recycle. Additive guard, no data migration.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make the conflict guard relation-agnostic by reusing `relationsConflict`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-002-context -->
### Context

The defect surfaced as a `caused`/`contradicts` collision, but the same hazard applies to any conflicting pair the detector knows about (`supports`/`contradicts`, `enabled`/`contradicts`) and to pre-existing manual edges, not just the lineage/supersession case.

### Constraints

- One source of truth for what "conflicts" means.
- Must protect manual edges, not only auto edges.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Export `relationsConflict` from contradiction-detection and have the guard consult it, so the backfill suppresses ANY candidate whose pair already has a VALID edge with a relation that conflicts per the shared rules — regardless of `created_by`.

**How it works**: `hasConflictingValidEdge` queries valid edges on the pair and returns true if any existing relation conflicts with the candidate's relation per `relationsConflict`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse `relationsConflict` (chosen)** | Single rule source; covers all conflicting pairs + manual edges | Requires exporting one helper from another module | 9/10 |
| Hard-code "skip contradicts if caused exists" | Minimal | Misses other conflicting pairs; drifts from the detector | 4/10 |
| Duplicate the conflict table in the backfill | Local | Two sources of truth that can diverge | 2/10 |

**Why this one**: It guarantees the guard and the detector can never disagree about what conflicts.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The guard protects every conflicting-relation case and every existing valid edge (manual + auto).

**What it costs**:
- A new export from contradiction-detection. Mitigation: the function is pure and already tested.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future conflict-rule changes affect the backfill | L (desired) | Single source of truth means the backfill tracks the detector automatically |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Manual edges + other pairs need the same protection |
| 2 | **Beyond Local Maxima?** | PASS | Hard-code vs duplicate vs reuse weighed |
| 3 | **Sufficient?** | PASS | Covers every conflicting pair the detector knows |
| 4 | **Fits Goal?** | PASS | One rule source for conflict semantics |
| 5 | **Open Horizons?** | PASS | New conflict rules propagate for free |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `contradiction-detection.ts`: `relationsConflict` exported.
- `relation-backfill.ts`: guard imports + uses it.

**How to roll back**: `git revert`; the export becomes internal again.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Report `written`/`byRelation` from the committed valid-auto-edge delta

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-003-context -->
### Context

`insertEdgesBatch` counts any non-null rowid as inserted (including upserts of pre-existing edges), and `countWrittenByRelation` re-tallied ALL `created_by='auto'` edges for the candidate pairs without filtering `invalid_at`. So a re-run over-reported `written`, and an edge silently invalidated during the same run could still be counted.

### Constraints

- `written` must reflect NEWLY-inserted valid edges only.
- Must stay honest across re-runs and immune to invalidation.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Snapshot the per-relation count of VALID `created_by='auto'` edges before the write, snapshot again after the commit, and report the positive DELTA as `written` (and as `byRelation`).

**How it works**: `countValidAutoEdgesByRelation` runs before/after the transaction; the caller bumps `byRelation` and `written` only by the positive per-relation delta. Upserts contribute zero; an invalidated edge drops out of the valid count, so it is never reported as written.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Valid-auto-edge delta (chosen)** | Honest on re-run + immune to invalidation; minimal | Two extra aggregate queries per committed run | 9/10 |
| Add an `isNew` flag to `insertEdge` (INSERT vs ON CONFLICT) | Precise per-edge | More invasive to a widely-shared storage primitive; back-compat risk | 6/10 |
| Keep re-tallying all auto edges | No change | Over-reports upserts; ignores invalidation (the original bug) | 1/10 |

**Why this one**: It is the minimal honest fix and naturally handles both the re-run and the invalidation cases without touching the shared `insertEdge` primitive.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- `written` and `byRelation` are honest; `byRelation` equals the live valid-auto distribution.

**What it costs**:
- Two grouped aggregates per committed run. Mitigation: negligible; only on commit, not dry run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Concurrent auto-edge writes between snapshots skew the delta | L | The backfill runs the writes inside its own transaction window |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Re-runs over-reported; invalidation mis-counted |
| 2 | **Beyond Local Maxima?** | PASS | isNew-flag vs delta weighed |
| 3 | **Sufficient?** | PASS | Delta covers re-run + invalidation |
| 4 | **Fits Goal?** | PASS | Summary now matches committed reality |
| 5 | **Open Horizons?** | PASS | Pattern reusable by other counters |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: before/after `countValidAutoEdgesByRelation`; delta drives `written`/`byRelation`; `countWrittenByRelation` removed.
- `handlers/causal-graph.ts`: hint says "wrote N new auto edges" and surfaces `skippedConflicting`.

**How to roll back**: `git revert`; the prior counting returns.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Make the inner `backfill` schema strict

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-004-context -->
### Context

The outer `memoryCausalStatsSchema` is strict via `getSchema`, but the nested `backfill` object was a plain `z.object({...}).optional()` — not strict. A typo'd opt-in key (e.g. `contradict` for `contradicts`, or `threshold` for `similarityThreshold`) was silently accepted and dropped, so an operator's intended collector never ran.

### Constraints

- Unknown inner keys must be rejected, matching the outer schema.
- Valid keys must still pass.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Build the inner object via the same `getSchema` helper so it inherits the strict/unknown-key rejection (honoring `SPECKIT_STRICT_SCHEMAS`).

**How it works**: `getSchema({...})` applies `.strict()` when strict schemas are on, so `{ backfill: { contradict: true } }` throws `ToolSchemaValidationError` while every valid key still validates.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Build inner via getSchema (chosen)** | Matches outer behavior incl. the strict toggle | None material | 9/10 |
| Append `.strict()` directly | Strict | Ignores the `SPECKIT_STRICT_SCHEMAS=false` passthrough mode | 6/10 |
| Leave it non-strict | No change | Silent typo acceptance persists | 1/10 |

**Why this one**: It reuses the exact strictness policy the rest of the tool schemas use, including the passthrough escape hatch.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Typo'd opt-in keys are rejected loudly instead of silently ignored.

**What it costs**:
- A stricter contract for the `backfill` arg. Mitigation: only unknown keys are rejected; all documented keys pass.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An existing caller passed an undocumented inner key | L | No such caller exists; only the dry-run/commit/collector keys are used |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Silent typo acceptance defeated opt-in collectors |
| 2 | **Beyond Local Maxima?** | PASS | getSchema vs raw .strict() weighed |
| 3 | **Sufficient?** | PASS | One change closes the gap |
| 4 | **Fits Goal?** | PASS | Inner now matches outer strictness |
| 5 | **Open Horizons?** | PASS | Future inner keys inherit the policy |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `schemas/tool-input-schemas.ts`: inner `backfill` built via `getSchema`.

**How to roll back**: `git revert`; the inner object returns to non-strict.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
