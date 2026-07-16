---
title: "Decision Record: Relation-Inference Backfill"
description: "Architectural decisions for the bounded relation-inference backfill: deterministic-signal selection, entry-point wiring, the strict-schema touch, and the dry-run-default safety posture."
trigger_phrases:
  - "relation backfill decision"
  - "causal backfill wiring choice"
  - "deterministic inference signals"
  - "memory_causal_stats backfill entry point"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill"
    last_updated_at: "2026-06-04T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001..004"
    next_safe_action: "Commit + deploy"
    blockers: []
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Decision Record: Relation-Inference Backfill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Infer from deterministic structural signals, not a semantic heuristic

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

The honest stat from packet 019 needed to become true: some real command had to create typed relation edges. The brief allowed similarity and contradiction signals but warned this is an MVP against a just-recovered 9252-doc production DB, not a research project. We needed inference that is safe, auditable, and reversible.

### Constraints

- Must reuse strong EXISTING signals; no speculative ML/semantic guessing.
- Must be deterministically testable in a unit fixture (no live embeddings).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Infer typed edges from two deterministic structural signals only: spec-document chains (reusing the `createSpecDocumentChain` pairing rules) and `memory_lineage` predecessor-to-successor `caused` links.

**How it works**: The backfill groups scanned `memory_index` rows by `spec_folder`, maps `document_type` to id, and emits the same caused/supports pairs the spec-doc chain creator uses; it also promotes recorded lineage predecessor pointers into `caused` edges. Every edge is `created_by='auto'`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Deterministic signals (chosen)** | Safe, auditable, reproducible, unit-testable | Does not cover every relation type | 9/10 |
| Embedding-cosine 'supports' neighbors now | Broader coverage | Needs sqlite-vec; not deterministic in a fixture; risk on recovered DB | 5/10 |
| Wait for a full semantic engine | Most complete | Out of MVP scope; blocks the honest stat indefinitely | 3/10 |

**Why this one**: It satisfies REQ-001..006 with edges that come from real recorded structure, and it is fully testable without embeddings. Similarity/contradiction edges remain a documented best-effort extension.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `caused`/`supports` coverage rises from real structure, not guesses.
- The advertised backfill command is genuinely callable and effective.

**What it costs**:
- `contradicts` and similarity-`supports` are not yet auto-created. Mitigation: documented as best-effort extensions; `memory_causal_link` still available for explicit typed edges.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Coverage still below `caused` target on sparse DBs | L | Bounded by available structure; hint stays accurate while below target |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The honest stat from 019 had no real backfill behind it |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed; deterministic chosen for safety + testability |
| 3 | **Sufficient?** | PASS | Two signals satisfy all four P0 requirements |
| 4 | **Fits Goal?** | PASS | Directly makes `implemented:true` truthful |
| 5 | **Open Horizons?** | PASS | Similarity/contradiction extensions slot in without rework |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `lib/causal/relation-backfill.ts` with `collectSpecChainEdges` + `collectLineageEdges`.
- All writes flow through `insertEdgesBatch` with `createdBy:'auto'`.

**How to roll back**: `git revert` the commit; rebuild dist + recycle the daemon. Committed auto edges are strength- and count-bounded and removable via `memory_causal_unlink` / orphan cleanup.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Wire the entry point onto `memory_causal_stats`, not a new MCP tool

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-002-context -->
### Context

The backfill needs a real, callable entry point whose name appears in the honest hint's `command` field. The brief explicitly prefers extending an existing maintenance surface over adding a brand-new public MCP tool.

### Constraints

- The `command` string must name something callable end-to-end.
- Avoid public-tool surface growth.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Extend `handleMemoryCausalStats` with an optional `backfill` argument and surface `memory_causal_stats({ backfill: { dryRun: false } })` as the command.

**How it works**: When `backfill` is present, the handler runs `backfillRelationInference` before computing stats, surfaces the summary under `data.backfill`, and adds a hint. The stats response then reflects the just-inferred edges.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend `memory_causal_stats` (chosen)** | No new tool; backfill + stats read in one call; matches brief | Slightly overloads the stats handler | 8/10 |
| New `memory_causal_backfill` MCP tool | Single-purpose | Grows public tool surface against the brief's preference | 5/10 |
| Maintenance-only handler (no tool exposure) | Minimal surface | Command not callable through MCP; honest hint would be misleading again | 3/10 |

**Why this one**: It keeps the command genuinely callable through the existing public tool while respecting the no-new-tool preference.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One call both backfills and reports the resulting coverage.

**What it costs**:
- The stats handler gains a write path (guarded; default dry run). Mitigation: default `dryRun=true`; bounded `limit`; all writes inherit `insertEdge` guards.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Accidental write via stats call | M | Write requires explicit `backfill.dryRun:false` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The command must be callable to be honest |
| 2 | **Beyond Local Maxima?** | PASS | New-tool vs handler-extension weighed |
| 3 | **Sufficient?** | PASS | One optional arg makes it callable |
| 4 | **Fits Goal?** | PASS | Realizes the `command` field truthfully |
| 5 | **Open Horizons?** | PASS | Extensible without a tool migration |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `handlers/causal-graph.ts`: optional `backfill` arg + result surfacing.
- `schemas/tool-input-schemas.ts`: optional `backfill` added to `memoryCausalStatsSchema` (ADR-003).

**How to roll back**: `git revert`; the optional arg disappears on recycle. No state migration.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Add `backfill` to the strict tool-input schema

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-003-context -->
### Context

`memoryCausalStatsSchema` is built with `.strict()` by default (`SPECKIT_STRICT_SCHEMAS !== 'false'`), so any unknown key is rejected. With the schema empty, the MCP tool path would reject `{ backfill: ... }` and the advertised command would not be callable, re-introducing exactly the dishonesty packet 019 removed.

### Constraints

- `schemas/tool-input-schemas.ts` was outside the original scope list; touch it only to add the minimal field needed to make the command real.
- Must not loosen rejection of other unknown params (e.g. the input-validation test feeds `{ specFolder: 123 }` and expects rejection).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add an optional `backfill` object (`dryRun?`, `limit?` bounded to 2000, `actor?`) to `memoryCausalStatsSchema` and list `backfill` in the tool's allowed-params.

**How it works**: The strict schema now accepts `backfill` and still rejects every other unknown key, so the command is callable end-to-end while the input-validation contract holds.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Add optional `backfill` to schema (chosen)** | Command callable; other keys still rejected | Touches one file outside the original list | 8/10 |
| Leave schema empty | No extra file touched | Command not callable; honest hint becomes misleading | 2/10 |
| Disable strict schemas | Accepts anything | Removes a safety net for all tools | 1/10 |

**Why this one**: It is the minimal additive change that makes the wired command genuinely callable without weakening validation.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The advertised command works through the real MCP tool path.

**What it costs**:
- One schema file beyond the original scope list. Mitigation: change is additive, optional, and bounded; covered by `mcp-input-validation.vitest.ts` staying green.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema drift vs handler arg shape | L | Both validated by the same tests; `limit` bounded identically (2000) |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Strict schema would otherwise reject the command |
| 2 | **Beyond Local Maxima?** | PASS | Considered leaving it empty / loosening strictness |
| 3 | **Sufficient?** | PASS | One optional field is enough |
| 4 | **Fits Goal?** | PASS | Makes the honest command real |
| 5 | **Open Horizons?** | PASS | Field can carry future backfill options |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `schemas/tool-input-schemas.ts`: `memoryCausalStatsSchema` gains optional `backfill`; allowed-params list gains `backfill`.

**How to roll back**: `git revert`; the schema returns to empty-strict. Rebuild dist + recycle.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Default to a dry run and explicitly invalidate the entity-density cache

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-04 |
| **Deciders** | claude-opus |

---

<!-- ANCHOR:adr-004-context -->
### Context

The DB was just recovered. A write path must not surprise an operator, and raising outgoing-edge counts changes the entity-density routing signal (memory rows with >=3 outgoing edges feed the graph-channel router), whose cache no causal mutation invalidates today.

### Constraints

- No accidental mass writes.
- Routing must see fresh edge counts immediately after a real run.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Default `dryRun=true` (writes only on explicit `dryRun:false`) and call `invalidateEntityDensityCache()` after committing edges (never on a dry run).

**How it works**: A dry run scans, infers, and reports candidate counts with zero writes. A committed run batches edges in one transaction, then invalidates both the degree cache (via the edge writers) and the entity-density cache (explicitly here).
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dry-run default + explicit cache invalidation (chosen)** | Safe; routing stays fresh | Operator must opt in to writes | 9/10 |
| Write by default | One-step | Dangerous on a recovered DB | 2/10 |
| Rely on the 60s entity-density TTL | No code | Stale routing for up to a minute after a backfill | 4/10 |

**Why this one**: It is the safe posture for a recovered DB and guarantees correct routing immediately after writes.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Previews are free and safe; routing signal is never stale after a backfill.

**What it costs**:
- An extra cache rebuild on the next routing read. Mitigation: negligible; bounded by high-degree row count.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Forgetting the invalidation in a future edit | M | Covered by a dedicated freshness test that spies the call |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Recovered-DB safety + routing-signal freshness both required |
| 2 | **Beyond Local Maxima?** | PASS | TTL-only and write-by-default rejected |
| 3 | **Sufficient?** | PASS | Dry-run default + one invalidation call covers it |
| 4 | **Fits Goal?** | PASS | Matches the brief's FRESHNESS requirement |
| 5 | **Open Horizons?** | PASS | Pattern reusable by future causal mutations |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `relation-backfill.ts`: `dryRun` defaults true; `invalidateEntityDensityCache()` called after commit.

**How to roll back**: `git revert`; behavior reverts on recycle.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
