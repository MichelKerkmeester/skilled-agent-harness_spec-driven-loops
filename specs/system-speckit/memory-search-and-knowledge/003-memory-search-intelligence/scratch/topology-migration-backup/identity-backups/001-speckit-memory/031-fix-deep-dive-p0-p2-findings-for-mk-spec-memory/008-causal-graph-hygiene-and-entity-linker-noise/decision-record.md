---
title: "Decision Record: Phase 8: causal-graph-hygiene-and-entity-linker-noise"
description: "Three architecture decisions: entity co-occurrence edge disposition, community algorithm naming honesty, and surrogate regeneration strategy for placeholder-title rows."
trigger_phrases:
  - "entity cooccurrence relation decision"
  - "louvain naming decision"
  - "surrogate regeneration decision"
  - "causal graph hygiene adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise"
    last_updated_at: "2026-07-04T17:51:12.479Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Re-scored ADR-001: down-weight recommended (relocation needs CHECK rebuild); columns fixed"
    next_safe_action: "Ratify each ADR from dry-run evidence during execution"
    blockers: []
    key_files:
      - "decision-record.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-028-016-008-planning-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-001 down-weight-in-place recommended; ratify vs relocate (CHECK table rebuild) after dry-run counts + consumer inventory"
    answered_questions: []
---
# Decision Record: Phase 8: causal-graph-hygiene-and-entity-linker-noise

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Entity Co-occurrence Edge Disposition (Relocate vs Down-weight)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), executing seat |

---

<!-- ANCHOR:adr-001-context -->
### Context

The entity linker auto-creates a `'supports'` edge at fixed strength 0.7 for every memory pair that shares catalog entities (`entity-linker.ts:865`). Live measurement on 2026-07-03 (ledger L8, verified 🟢) counted 31,118 such edges out of 33,101 total rows in `causal_edges`: 94% of the "causal" graph is co-occurrence noise, and only about 1,983 edges express real causality. Any causal boost amplifies noise, the density guard counts these edges against its limits, and graph traversal walks them as if they were causal. We needed to choose between moving these edges out of the causal relation space and weakening them in place.

### Constraints

- The `causal_edges` CHECK constraint allows `relation` in only `('caused','enabled','supersedes','contradicts','derived_from','supports')` (verified live: `sqlite3 -readonly ... "SELECT sql FROM sqlite_master WHERE name='causal_edges'"`). `'entity_cooccurrence'` is not a legal value, so any relocation to a new relation requires a full table rebuild (SQLite cannot ALTER a CHECK).
- `memory_entities` holds 561,785 rows and `entity_catalog` 61,638 with no pruning path, so the co-occurrence signal keeps growing.
- Unknown consumers may read `'supports'` semantics; the consumer inventory (plan.md FIX ADDENDUM) must complete before the disposition runs.
- The disposition touches ~31,536 provenance-scoped rows (`created_by='entity_linker' AND relation='supports' AND strength=0.7`, measured on a DB copy) on a 1.3GB production DB and must be batched, idempotent, and reversible.
- Phase 007 owns the causal-boost consumer; this decision only controls what data that consumer sees.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose** (recommended default, pending dry-run): Down-weight the entity co-occurrence edges in place. They keep `relation = 'supports'` (a value the `causal_edges` CHECK already allows) and get a low strength; causal consumers exclude them by default using their provenance (`created_by = 'entity_linker'`) plus the low-strength band, with an explicit opt-in for consumers that want the co-occurrence signal. No schema migration runs.

**Why not relocate**: `causal_edges` declares `relation TEXT NOT NULL CHECK(relation IN ('caused','enabled','supersedes','contradicts','derived_from','supports'))` (verified live). `'entity_cooccurrence'` is not in that set, so both an `INSERT ... relation='entity_cooccurrence'` and an `UPDATE ... SET relation='entity_cooccurrence'` fail with `CHECK constraint failed` (reproduced on a DB copy, SQLite error 19). Adding the value means rebuilding the whole table (SQLite cannot ALTER a CHECK): create a new table with the widened CHECK, copy all 33,476 rows, swap, and rebuild all nine secondary indexes (including the partial-UNIQUE `derived_id` index and the partial open-currentness index, plus the UNIQUE autoindex) and the six bitemporal columns — a full 1.3GB table rebuild, not the "one-column UPDATE" the first draft assumed. Down-weight avoids the rebuild entirely.

**How it works**: The entity-linker insert at `entity-linker.ts:865` writes `relation='supports'` at the ratified low strength (not 0.7). A batched, idempotent migration UPDATEs strength on existing rows selected strictly by provenance (`created_by = 'entity_linker'`, relation `supports`, strength 0.7). Causal boost, typed traversal, and the density guard exclude the down-weighted `created_by='entity_linker'` edges by default; co-occurrence stays available behind an explicit opt-in for consumers that want it. This stays Proposed until the dry-run counts and the consumer inventory confirm the blast radius; ratify (or flip to relocation, accepting the table-rebuild cost) at that point.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Down-weight in place (recommended)** | Keeps `relation='supports'` (CHECK-legal); no schema migration; a single-column strength UPDATE scoped by `created_by='entity_linker'`; reversible by restoring strength; consumers exclude via provenance + strength band | Histogram still shows `supports`, so a "sane" read is measured via strength/provenance, not relation alone; every consumer must honor the exclusion convention | 8/10 |
| Relocate to own relation (`entity_cooccurrence`) | Honest relation histogram; adjacency preserved for opt-in consumers | `'entity_cooccurrence'` violates the live CHECK — needs a full table rebuild (new table + copy 33,476 rows + swap + rebuild 9 indexes incl. the partial-UNIQUE `derived_id` + 6 bitemporal columns), NOT a one-column UPDATE; consumers reading `'supports'` literals still need inventory | 3/10 |
| Separate table (`entity_cooccurrence`) | Strongest isolation; causal table shrinks 94% | New table, indexes, and query changes across every co-occurrence consumer; heaviest migration and rollback | 4/10 |

**Why this one**: Down-weight is the only option with no schema migration and no CHECK fight. The relation rename the first draft scored 8/10 as a "trivial one-column UPDATE" is actually a 1.3GB table rebuild (the CHECK blocks the value), so its true cost is far higher; down-weight delivers the same consumer-facing outcome — co-occurrence excluded from causal reads by default — at a fraction of the risk, and keeps the signal available instead of destroying it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Causal consumers (boost, typed traversal, density guard) read real memory-to-memory causality by default: the down-weighted `created_by='entity_linker'` edges fall below the strength band and are excluded unless opted in (SC-001).
- No schema migration, so the 1.3GB table and its nine indexes are never rebuilt and the partial-UNIQUE `derived_id` index is untouched.
- Phase 007's causal boost amplifies actual causality instead of shared-entity noise.
- The density guard counts real memory-to-memory causal edges, so cross-doc linking stops silently disabling itself.

**What it costs**:
- The relation histogram still shows `supports`, so "sane causal read" is measured by strength/provenance, not by relation alone. Mitigation: the SC-001 probe groups by `relation, created_by, strength`, and every causal consumer honors the provenance+strength exclusion (recorded here at ratification).
- Every reader of `'supports'` semantics must be classified. Mitigation: the plan.md FIX ADDENDUM consumer inventory runs before the code change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Down-weight UPDATE hits non-linker `supports` edges | H | WHERE scoped to `created_by='entity_linker' AND relation='supports' AND strength=0.7`; dry-run count assertion on a DB copy (31,536 such rows measured) before production |
| A causal consumer ignores the exclusion convention and reads the low-strength edges | M | rg inventory over relation/strength/provenance literals; each reader's action recorded; opt-in flag is explicit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 94% noise measured live 2026-07-03 (ledger L8 🟢); 31,536 `supports`@0.7 `created_by='entity_linker'` rows confirmed on a DB copy; boost consumers read them today |
| 2 | **Beyond Local Maxima?** | PASS | Three options re-scored on true cost; the relocate option's CHECK-rebuild cost is now explicit |
| 3 | **Sufficient?** | PASS | Down-weight plus provenance+strength exclusion achieves the causal-read goal with no schema migration |
| 4 | **Fits Goal?** | PASS | Directly gates SC-001 and the Phase 007 boost-truthfulness gate |
| 5 | **Open Horizons?** | PASS | Co-occurrence data survives at low strength for future opt-in features; relocation stays available if a later CHECK rebuild is justified |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/search/entity-linker.ts:865`: co-occurrence insert writes `relation='supports'` at the ratified low strength (not 0.7); density guard counts numeric-endpoint causal relations only.
- `mcp_server/lib/search/vector-index-schema.ts`: forward migration is a provenance-scoped strength UPDATE (`created_by='entity_linker' AND relation='supports' AND strength=0.7`), batched and idempotent, plus a reverse migration that restores strength 0.7. No table rebuild, no CHECK change.
- Causal consumers: default exclusion of the down-weighted `created_by='entity_linker'` edges with an explicit opt-in parameter (consumer list finalized at ratification).

**How to roll back**: Run the reverse migration (restore strength 0.7 on `created_by='entity_linker'` rows), then `git revert` the cluster A commit and rebuild dist.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Community Detection Naming (Honest Label vs Real Modularity)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (amended 2026-07-04 — lifecycle fixes shipped; naming rename deferred) |
| **Date** | 2026-07-03 (amended 2026-07-04) |
| **Deciders** | Michel Kerkmeester (operator), executing seat |

---

<!-- ANCHOR:adr-002-context -->
### Context

The community subsystem calls itself "Louvain", but the implementation is unweighted label propagation (Agent D P2, 🟡 confirm during Phase 1). Memberships freeze at the last checkpoint-restore, community fingerprints can collide because they sum member ids, and the module cache survives DB rebinds. We needed to decide whether the fix is naming honesty or an actual modularity implementation, because docs, telemetry, and future tuning all hang off that name.

### Constraints

- Edge strengths only become meaningful after the ADR-001 relocation and the ratchet removal land; a weighted modularity algorithm before that would optimize over noise.
- Phase 006 owns eval parity; ranking-relevant algorithm changes are not measurable until that harness exists.
- The lifecycle bugs (cadence, stable IDs, fingerprint collision, rebind reset, phantom members) must be fixed regardless of the naming outcome.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Originally proposed**: Rename honestly to label propagation everywhere the name surfaces (code identifiers, docs, telemetry labels), fix the lifecycle bugs, and defer a real weighted modularity implementation until post-006 measurement exists.

**Amended (as shipped)**: Ship the lifecycle fixes now; **keep** the existing "Louvain" identifiers, env, and telemetry labels for external-consumer compatibility and document the misnomer in place; defer both the naming rename and the real weighted-modularity implementation until post-006 measurement exists.

**Why amended**: The original ADR itself flagged the dominant risk of a rename — "rename misses a telemetry consumer parsing the old label." Because the algorithm's behavior is unchanged, the standing lie is a documentation problem, not a live defect. The live defects were the lifecycle bugs, and those are fixed. A broad identifier/telemetry rename mid-remediation expands this phase's blast radius beyond graph hygiene into every dashboard and doc that keys on the label, for zero behavior benefit. Documenting the misnomer where it surfaces removes the "silent lie" harm at no churn risk, and the honest rename rides along with the real-modularity decision once 006's harness can measure the whole subsystem.

**How it works**: The algorithm keeps its current behavior and its current names. The lifecycle fixes (rebuild cadence beyond checkpoint-restore and stable community IDs across rebuilds) shipped. A real modularity algorithm and the naming rename both become candidate follow-ups once 006's eval harness can measure whether they help.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename honestly + fix lifecycle (chosen)** | Zero behavior risk; docs and telemetry stop lying; lifecycle bugs fixed now | The algorithm stays simple label propagation | 8/10 |
| Implement real weighted Louvain modularity | Name becomes true; potentially better communities | Unmeasurable before 006 eval parity; optimizes over noisy strengths until ADR-001 and the ratchet fix settle; large blast radius | 5/10 |
| Keep the "Louvain" name as-is | No work | Dishonest naming misleads every future tuning decision | 2/10 |

**Why this one**: Naming honesty costs nothing and removes a standing lie; a real algorithm change without a measurement harness is unverifiable churn.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Docs, telemetry, and code agree on what the algorithm is; future tuning starts from the truth.
- Communities update between checkpoint-restores; IDs stay stable for unchanged communities; caches respect DB identity.

**What it costs**:
- A follow-up decision remains open for real modularity. Mitigation: record it as a post-006 candidate in the phase closeout notes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rename misses a telemetry consumer parsing the old label | L | rg inventory over "louvain" (case-insensitive) across code, docs, and dashboards |
| Rebuild cadence change churns community IDs | M | Stable-ID mapping keyed on collision-proof membership fingerprints; rebuild test asserts stability |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The false name steers tuning and debugging today; lifecycle bugs are live |
| 2 | **Beyond Local Maxima?** | PASS | Real-modularity option scored and consciously deferred, not ignored |
| 3 | **Sufficient?** | PASS | Rename plus lifecycle fixes address every confirmed finding without behavior risk |
| 4 | **Fits Goal?** | PASS | Phase goal is hygiene and truthfulness, not algorithm redesign |
| 5 | **Open Horizons?** | PASS | Leaves a clean measured path to real modularity after 006 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/graph/community-detection.ts`: naming, rebuild cadence, stable IDs, fingerprint collision fix, DB-rebind cache reset, phantom-member filtering.
- Docs/telemetry surfaces that print the algorithm name.

**How to roll back**: `git revert` the cluster F commit; the rename and lifecycle fixes carry no data migration, so no data reversal is needed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Surrogate Regeneration Strategy (Batched Backfill vs Lazy)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (operator), executing seat |

---

<!-- ANCHOR:adr-003-context -->
### Context

`generateSurrogates` receives the placeholder title `Memory ${id}` instead of the document title (`graph-lifecycle.ts:532`, code-verified 🟢). All 7,108 rows in `memory_surrogates` were generated against those placeholders, so the question channel asks "What is Memory 4821?", which retrieves nothing useful. After the title fix lands for new writes, we needed a strategy for the 7,108 existing rows: regenerate them all in a controlled backfill, regenerate lazily on access, or drop them.

### Constraints

- The embedding queue already carries an 8.7k pending backlog at a default drain of 5 rows per 5 minutes; Phase 004 owns the drain-rate fix.
- Usage data shows 65 of 33,101 memories were ever accessed (🟢), so access-triggered work almost never fires.
- Regeneration must run off the save path (NFR-P01) and stay batched.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Fix title generation first, then run a one-shot batched backfill that regenerates all 7,108 placeholder-title surrogate rows through the async queue, capped per batch and sequenced with the Phase 004 drain-rate fix.

**How it works**: The generation call passes the real document title. A maintenance task selects surrogate rows whose question text matches the placeholder pattern, regenerates them in bounded batches through the existing async embedding queue, and soft-replaces rows so the prior surrogate stays recoverable until verification passes. Alias duplicate provenance is fixed in the same pass.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One-shot batched backfill (chosen)** | Deterministic completion; verifiable end state (zero placeholder surrogates); runs off-peak through the queue | Adds 7,108 jobs to a backlogged queue; needs sequencing with Phase 004 | 8/10 |
| Lazy regeneration on access/save | No bulk queue load | 65/33,101 rows ever accessed, so nearly all rows stay stale forever; end state unverifiable | 4/10 |
| Drop surrogates, regenerate on demand | Immediate table cleanup | Destroys working non-placeholder signal paths; on-demand generation puts cost on the query path | 3/10 |

**Why this one**: Only the backfill produces a verifiable end state, and the measured access rate kills the lazy option outright.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The surrogate question channel asks real questions about real titles; REQ-010's zero-placeholder probe becomes checkable.
- New surrogates are correct at generation, so the problem cannot regrow.

**What it costs**:
- 7,108 regeneration jobs on a backlogged embedding queue. Mitigation: batch caps, off-peak scheduling, and sequencing after or alongside the Phase 004 drain-rate fix.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Queue starvation delays fresh-save embeddings | M | Batch cap plus queue-priority ordering that favors fresh saves |
| Placeholder pattern match hits a legitimate title | L | Match on the exact generated pattern and the generation provenance, not on free text |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 7,108 useless question surrogates measured live (🟢 L8 section) |
| 2 | **Beyond Local Maxima?** | PASS | Lazy and drop options scored with usage data |
| 3 | **Sufficient?** | PASS | Title fix plus one backfill closes the whole class |
| 4 | **Fits Goal?** | PASS | Restores a graph-adjacent retrieval channel this phase owns |
| 5 | **Open Horizons?** | PASS | Provenance-scoped soft-replace keeps rollback and audit open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/search/graph-lifecycle.ts:532`: pass the real document title to `generateSurrogates`.
- Maintenance/migration path: batched regeneration of placeholder-title rows through the async queue; alias dup provenance fix.

**How to roll back**: Stop the backfill task; soft-replaced rows restore from their retained predecessors; `git revert` the cluster G commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
