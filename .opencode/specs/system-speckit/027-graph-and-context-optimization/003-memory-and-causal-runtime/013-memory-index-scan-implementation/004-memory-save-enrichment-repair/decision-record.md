---
title: "Decision Record: memory_save Replay Enrichment Repair"
description: "Architectural choices for the durable enrichment-completion marker, its 4-column shape, deferred semantics, and the synchronous-dedup constraint."
trigger_phrases:
  - "memory_save enrichment repair decisions"
  - "enrichment marker shape adr"
  - "repair on replay vs in-transaction"
  - "deferred enrichment semantics"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored enrichment-repair packet plan from follow-up research"
    next_safe_action: "Implement schema v30 marker + repair-on-replay via gpt-5.5-fast xhigh"
    blockers: []
    key_files:
      - "mcp_server/lib/search/vector-index-schema.ts"
      - "mcp_server/handlers/memory-save.ts"
      - "mcp_server/handlers/save/enrichment-state.ts"
      - "mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "enrichment-repair-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: memory_save Replay Enrichment Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Durable marker + repair-on-replay (not in-transaction enrichment, not scan-only)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | claude-opus, operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The primary row commits before secondary enrichment runs. A kill in that window leaves a committed-but-unenriched row that dedup replay never repairs, so the memory stays invisible to FTS/vector/graph search until an unrelated scan re-indexes it.

### Constraints

- The hot save path must not regress: enrichment (embedding, entity, summary, graph) cannot hold the SQLite writer.
- Any repair must be idempotent because more than one call site can trigger it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a durable completion marker written `pending` inside the primary transaction, then repaired idempotently on dedup replay and as a bounded scan-lease backfill.

**How it works**: the marker commits atomically with the row, enrichment runs outside the transaction and records the outcome, and a non-`complete` marker triggers repair on the next replay or under the scan lease. Scan-only backfill is folded in as the secondary safety net.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Durable marker + repair on replay (+ scan backfill)** | Keeps current latency model; repairs exactly the replay hole; immediate fix on replay | One schema bump; repair must be idempotent | 9/10 |
| Move enrichment into the primary transaction | Eliminates the window outright | Holds the SQLite writer through async enrichment - real save-latency + writer-contention regression | 3/10 |
| Scan-only backfill, no replay repair | Simple | Leaves the row unenriched until the next scan; a replay right after the kill still returns `unchanged` with no enrichment | 5/10 |

**Why this one**: it fixes immediate replay idempotency without paying the in-transaction latency cost, and keeps the marker write as the only new work inside the primary transaction.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A killed-mid-enrichment row becomes searchable on the next replay instead of waiting for a full scan.
- Only a cheap marker write joins the primary transaction, so save latency is unchanged.

**What it costs**:
- One schema version bump (29 → 30). Mitigation: narrow defaulted columns + an idempotent migration tested on fresh + upgraded DBs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Repair runs from two paths and could double-write | M | Idempotent causal/graph upserts; FTS/vector replaced not appended; repeated-repair test asserts stable counts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Closes the last known replay-idempotency hole in `memory_save` |
| 2 | **Beyond Local Maxima?** | PASS | In-transaction and scan-only alternatives evaluated and rejected |
| 3 | **Sufficient?** | PASS | Marker + idempotent repair covers replay and backfill |
| 4 | **Fits Goal?** | PASS | On the critical path for durable memory enrichment |
| 5 | **Open Horizons?** | PASS | `_version` column allows future enrichment-logic changes without a schema bump |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/search/vector-index-schema.ts`: schema v30 columns + idempotent migration + partial index.
- `handlers/save/enrichment-state.ts` + `handlers/memory-save.ts` + `handlers/memory-index.ts`: marker writes and repair entrypoints.

**How to roll back**: revert the branch before any deploy; if a deploy already ran, the additive defaulted columns sit inert with no readers, and the partial index can be dropped independently.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-2 -->
## ADR-2: Marker shape - 4 columns, default `complete`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | claude-opus, operator |

---

<!-- ANCHOR:adr-2-context -->
### Context

The marker has to support targeted, idempotent repair and observability without triggering a mass re-enrichment of the existing corpus on upgrade.

### Constraints

- Existing v29 rows are already enriched and must not be treated as a repair backlog.
- Repair should redo only the missing steps, not blindly re-run everything.
<!-- /ANCHOR:adr-2-context -->

---

<!-- ANCHOR:adr-2-decision -->
### Decision

**We chose**: four columns rather than one status flag - `post_insert_enrichment_status` (TEXT NOT NULL DEFAULT 'complete'), `post_insert_enrichment_state` (TEXT JSON of completed steps), `post_insert_enrichment_completed_at` (TEXT ISO), `post_insert_enrichment_version` (INTEGER).

**How it works**: `_status` is the verdict, `_state` records which steps finished (fts/vector/entity/graph) so repair redoes only the missing ones, `_completed_at` gives observability + a stable ordering key for bounded backfill, and `_version` is the enrichment-logic version so a future logic change can force re-enrichment without a schema bump.
<!-- /ANCHOR:adr-2-decision -->

---

<!-- ANCHOR:adr-2-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **4 columns, default `complete`** | Targeted repair; observability; tiny partial index; no upgrade storm | Slightly wider row | 9/10 |
| Single status flag, default `pending` | Minimal schema | Marks the entire historical corpus as a repair backlog → mass re-enrichment storm on first scan | 3/10 |

**Why this one**: defaulting to `complete` treats history as done so only rows saved after v30 go through the pending→complete lifecycle, which keeps the partial index on `status != 'complete'` tiny.
<!-- /ANCHOR:adr-2-alternatives -->

---

<!-- ANCHOR:adr-2-consequences -->
### Consequences

**What improves**:
- Repair is surgical (per-step) and the partial index stays small.
- Upgrade is safe: no re-enrichment storm because pre-existing rows default to `complete`.

**What it costs**:
- Repair MUST be safe to run repeatedly regardless of `_state`. Mitigation: causal/graph edge writes use upsert/dedup, FTS/vector rows are replaced not appended, and a repeated-repair test asserts row/edge counts are stable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Defaulting to `pending` (if changed) would storm re-enrichment | H | Default stays `complete`; only post-v30 rows enter the lifecycle |
<!-- /ANCHOR:adr-2-consequences -->

---

<!-- ANCHOR:adr-2-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Targeted repair + safe upgrade both require this shape |
| 2 | **Beyond Local Maxima?** | PASS | Single-flag alternative evaluated and rejected |
| 3 | **Sufficient?** | PASS | Four columns cover verdict, steps, ordering, and logic version |
| 4 | **Fits Goal?** | PASS | Directly enables idempotent per-step repair |
| 5 | **Open Horizons?** | PASS | `_version` future-proofs enrichment-logic changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-2-five-checks -->

---

<!-- ANCHOR:adr-2-impl -->
### Implementation

**What changes**:
- `lib/search/vector-index-schema.ts`: adds the four columns to both the fresh schema and the v30 migration, plus the partial index on `status != 'complete'`.

**How to roll back**: the columns are additive and defaulted; reverting code leaves them inert. Drop the partial index to fully reverse.
<!-- /ANCHOR:adr-2-impl -->
<!-- /ANCHOR:adr-2 -->

---

<!-- ANCHOR:adr-3 -->
## ADR-3: `deferred` is intentional, not a repair target

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | claude-opus, operator |

---

<!-- ANCHOR:adr-3-context -->
### Context

Some rows are intentionally left unenriched by the planner-first path or a disabled-feature path. Repair must not undo that intent.

### Constraints

- Normal replay and backfill must skip `deferred` rows.
- Only an explicit operator backfill may process `deferred`.
<!-- /ANCHOR:adr-3-context -->

---

<!-- ANCHOR:adr-3-decision -->
### Decision

**We chose**: treat `deferred` as a terminal, intentional state that normal replay and backfill skip.

**How it works**: `needsEnrichmentRepair` returns true only for `pending`/`partial`/`failed`; `deferred` (and `complete`) are excluded, so the system never enriches rows it deliberately left unenriched unless an operator forces it.
<!-- /ANCHOR:adr-3-decision -->

---

<!-- ANCHOR:adr-3-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skip `deferred` on normal replay/backfill** | Honors planner-first / feature-disabled intent | Requires explicit backfill to ever process them | 9/10 |
| Treat `deferred` like `pending` | Simpler enum handling | Re-enriches rows the system deliberately skipped | 2/10 |

**Why this one**: it preserves the deliberate "do not enrich" decision and avoids fighting the planner-first path.
<!-- /ANCHOR:adr-3-alternatives -->

---

<!-- ANCHOR:adr-3-consequences -->
### Consequences

**What improves**:
- Intentional non-enrichment is respected across replay and backfill.

**What it costs**:
- `deferred` rows need an explicit operator backfill to ever be enriched. Mitigation: documented as the only path that processes `deferred`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A genuinely stuck row is mislabeled `deferred` | L | `deferred` is set only by planner-first / disabled-feature paths, not by failures |
<!-- /ANCHOR:adr-3-consequences -->

---

<!-- ANCHOR:adr-3-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents repair from overriding intentional skips |
| 2 | **Beyond Local Maxima?** | PASS | Considered treating `deferred` as `pending` and rejected it |
| 3 | **Sufficient?** | PASS | Status enum + repair guard fully express the rule |
| 4 | **Fits Goal?** | PASS | Keeps repair scoped to actual gaps |
| 5 | **Open Horizons?** | PASS | Explicit operator backfill remains available |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-3-five-checks -->

---

<!-- ANCHOR:adr-3-impl -->
### Implementation

**What changes**:
- `handlers/save/enrichment-state.ts`: `needsEnrichmentRepair` excludes `deferred` and `complete`; only an explicit backfill path may target `deferred`.

**How to roll back**: revert the guard so the enum is treated uniformly; no schema change is involved.
<!-- /ANCHOR:adr-3-impl -->
<!-- /ANCHOR:adr-3 -->

---

<!-- ANCHOR:adr-4 -->
## ADR-4: Dedup helpers stay synchronous

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | claude-opus, operator |

---

<!-- ANCHOR:adr-4-context -->
### Context

The dedup pre-check returns the `unchanged`/`duplicate` verdict on the hot path; the repair it now triggers is async (it awaits enrichment).

### Constraints

- The dedup verdict path must stay cheap and synchronous.
- Making `dedup.ts` async would ripple through every caller.
<!-- /ANCHOR:adr-4-context -->

---

<!-- ANCHOR:adr-4-decision -->
### Decision

**We chose**: keep `dedup.ts` synchronous and run the async repair in the caller (`memory-save.ts`) after the sync dedup verdict returns a row id.

**How it works**: dedup returns its verdict + row id synchronously; the caller then checks `needsEnrichmentRepair` and awaits `repairEnrichmentOnReplay` only when needed, so the dedup pre-check itself never becomes async.
<!-- /ANCHOR:adr-4-decision -->

---

<!-- ANCHOR:adr-4-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sync dedup, async repair in caller** | Keeps the verdict path cheap; no caller ripple | Caller owns the repair branch | 9/10 |
| Make dedup helpers async | Repair co-located with the verdict | Async ripples through every dedup caller; verdict path slows | 3/10 |

**Why this one**: it isolates the async work to the one caller that needs it and keeps the widely-used dedup pre-check synchronous.
<!-- /ANCHOR:adr-4-alternatives -->

---

<!-- ANCHOR:adr-4-consequences -->
### Consequences

**What improves**:
- The dedup verdict path stays synchronous and fast for all callers.

**What it costs**:
- The repair branch lives in `memory-save.ts` rather than inside dedup. Mitigation: it is a small, well-scoped block after the verdict returns.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Caller forgets to repair on one return path | M | Both `duplicatePrecheck` and `dupResult` returns are wired + tested |
<!-- /ANCHOR:adr-4-consequences -->

---

<!-- ANCHOR:adr-4-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Avoids an async ripple through every dedup caller |
| 2 | **Beyond Local Maxima?** | PASS | Async-dedup alternative evaluated and rejected |
| 3 | **Sufficient?** | PASS | Caller-side repair covers both replay return paths |
| 4 | **Fits Goal?** | PASS | Keeps the hot dedup path cheap |
| 5 | **Open Horizons?** | PASS | Repair logic stays reusable from the scan backfill too |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-4-five-checks -->

---

<!-- ANCHOR:adr-4-impl -->
### Implementation

**What changes**:
- `handlers/save/dedup.ts`: stays synchronous.
- `handlers/memory-save.ts`: runs `repairEnrichmentOnReplay` in the async caller on the `duplicatePrecheck` and `dupResult` returns when `needsEnrichmentRepair`.

**How to roll back**: remove the caller-side repair branch; dedup is unchanged so there is nothing to revert there.

### Open question for the operator (deploy gate)

The v30 migration runs against the shared production DB only on the next daemon deploy. Confirm the deploy window separately; concurrent v29 sessions must drain or the upgrade must be confirmed safe under the launcher's single-writer lease before restart.
<!-- /ANCHOR:adr-4-impl -->
<!-- /ANCHOR:adr-4 -->
