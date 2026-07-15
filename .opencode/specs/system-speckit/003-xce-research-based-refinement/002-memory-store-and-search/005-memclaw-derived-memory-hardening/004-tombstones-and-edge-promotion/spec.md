---
title: "Feature Specification: Phase 4: tombstones-and-edge-promotion"
description: "Default hard-delete remains active while opt-in SPECKIT_SOFT_DELETE_TOMBSTONES preserves first tombstone timestamps, auto edge promotion skips manual causal edges, active/purgeable indexes are additive, and entity/co-occurrence signals remain non-causal recall evidence."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "entity co-occurrence not causal truth invariant"
  - "natural-key edge upsert preserve manual provenance"
  - "SPECKIT_SOFT_DELETE_TOMBSTONES default off"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-10T13:58:30Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped tombstones and skip-manual edges"
    next_safe_action: "Monitor targeted canaries for drift"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/004-tombstones-and-edge-promotion` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-feedback-log-and-005-reframe |
| **Successor** | 005-stale-audit-and-tool-ownership |
| **Handoff Criteria** | Repeat soft-delete preserves the first `deleted_at` (retention not extended), auto edge promotion is natural-key idempotent and never overwrites a manual `created_by`/evidence, active/purgeable partial indexes are in place, and the entity-not-causal invariant is recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification.

**Scope Boundary**: Delete lifecycle correctness and causal-edge promotion safety only. The shipped default remains the existing hard-delete path. The opt-in `SPECKIT_SOFT_DELETE_TOMBSTONES=true` path makes a repeat tombstone preserve the first timestamp via COALESCE, while active/purgeable partial indexes remain additive until recall filtering lands. This phase also makes auto causal-edge promotion natural-key idempotent while skipping rows with manual provenance, and records the invariant that entity/co-occurrence signals are recall evidence only and never causal truth. It does NOT add recall-surface tombstone filtering, an entity-graph recall feature, fleet/distributed lifecycle machinery, or idempotency receipts.

**Dependencies**:
- Phase 001 (provenance-and-audit) supplies the provenance signal that distinguishes a manually-authored edge from an auto-promoted one. The skip-manual edge logic keys off manual provenance — `causal_edges.created_by` already defaults to `'manual'` (schema migration v18), and `source_kind` from phase 001 is the program-wide provenance distinguisher the auto-promoter consults.
- Builds on substrate that already exists: `causal_edges` has a natural unique key `(source_id, target_id, relation, source_anchor, target_anchor)` and bounded auto-edge caps; the retention sweep already reports ledger state; `memory.supersedes_id` is the only memory-to-memory link.

**Deliverables**:
- Keep hard-delete as default behavior; when `SPECKIT_SOFT_DELETE_TOMBSTONES=true`, COALESCE-preserve the first tombstone timestamp on repeat delete so a second delete never extends retention.
- Active/purgeable partial indexes (active `deleted_at IS NULL` for recall, purgeable `deleted_at IS NOT NULL` for the retention sweep) so both the recall and cleanup paths stay fast.
- Natural-key auto edge promotion that skips rows carrying manual provenance: an auto-promoter never overwrites a manual `created_by`/evidence and instead skips or adds parallel low-strength evidence only.
- The entity-not-causal invariant recorded as a constitutional/rule note: entity and co-occurrence signals are recall evidence only, never causal truth.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found the prior soft-delete premise was false: delete was a hard delete via `vectorIndex.deleteMemory`, not a soft-delete writer. A tombstone path without recall filters would leave deleted memories searchable, so tombstones must be default-off until recall surfaces filter `deleted_at IS NULL`. `insertEdge` updates `created_by` (and via COALESCE, evidence) on an existing row when the natural key matches, so an auto-promoter can clobber a manually-authored causal edge's provenance and meaning. And entity/co-occurrence signals, which are recall evidence, could be mistaken for causal truth if nothing records the boundary.

### Purpose
Default delete behavior stays byte-identical hard-delete. Opt-in tombstones are first-timestamp-idempotent behind `SPECKIT_SOFT_DELETE_TOMBSTONES`, auto causal-edge promotion is natural-key idempotent and never overwrites manual provenance, split partial indexes are in place for the future tombstone lifecycle, and the entity-not-causal boundary is recorded as an invariant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Default-off tombstone flag: `SPECKIT_SOFT_DELETE_TOMBSTONES` keeps hard-delete behavior when unset and enables COALESCE first-timestamp tombstones only when set to `true`.
- Active/purgeable partial indexes: an active index over `deleted_at IS NULL` for recall and a purgeable index over `deleted_at IS NOT NULL` for the retention sweep.
- Natural-key auto edge promotion that skips rows with manual provenance: never overwrite a manual `created_by`/evidence; skip or add parallel low-strength evidence only.
- The entity-not-causal boundary invariant recorded as a constitutional/rule note (entity/co-occurrence is recall evidence only, never causal truth).

### Out of Scope
- An entity-graph recall feature - deferred; over-engineering for a local single-user system.
- Fleet/distributed lifecycle machinery - out of program scope (local single-user system, ruled out as negative knowledge by the 008 research).
- Idempotency receipts - belongs to phase 002.
- Recall-surface tombstone filtering - follow-up required before enabling `SPECKIT_SOFT_DELETE_TOMBSTONES`; search/list/get/context/triggers must filter `deleted_at IS NULL`, caches must invalidate tombstoned rows, and tombstone-on-expiry reaping must be specified.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modify | First-timestamp-idempotent soft-delete: a repeat delete COALESCE-preserves the original `deleted_at` instead of rewriting it. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modify | Apply the same first-timestamp tombstone idempotence to the bulk-delete path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Make `insertEdge` natural-key idempotent and skip-manual: never overwrite a manual `created_by`/evidence on the on-conflict path. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modify | Auto-promotion callers pass provenance so manual edges are preserved; report "skipped manual edge" on the response envelope. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Modify | Post-insert enrichment promotes edges through the skip-manual path; entity/co-occurrence stays recall evidence only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add the active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes plus a forward migration. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modify | Use the purgeable partial index for the sweep and report tombstone/edge state (no triage prompt). |
| `.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md` | Create | Record the invariant: entity/co-occurrence signals are recall evidence only, never causal truth. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Default-off first-timestamp tombstones. | With `SPECKIT_SOFT_DELETE_TOMBSTONES` unset, delete hard-removes the row through the existing path; with the flag set to `true`, repeat delete preserves the first `deleted_at` via COALESCE. |
| REQ-002 | Auto edge promotion preserves manual edges. | An auto-promoter never overwrites a manual `created_by`/evidence; on a natural-key match against a manual row it skips, or adds parallel low-strength evidence only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Active/purgeable partial indexes keep recall and cleanup fast. | An active partial index (`deleted_at IS NULL`) serves recall and a purgeable partial index (`deleted_at IS NOT NULL`) serves the retention sweep; both paths use their index (query plan confirms). |
| REQ-004 | The entity-not-causal invariant is recorded. | A constitutional/rule note exists stating entity/co-occurrence signals are recall evidence only and never causal truth; it surfaces as advisory in validation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Default delete behavior remains hard-delete and byte-identical; opt-in tombstones keep the first `deleted_at`, so retention is computed from the original tombstone when the flag is enabled.
- **SC-002**: Auto edges never clobber manual meaning — auto promotion is natural-key idempotent and a manual `created_by`/evidence is never overwritten; the worst case is a skipped or parallel low-strength edge.
- **SC-003**: Recall and purge paths are both fast — the active partial index serves default recall and the purgeable partial index serves the retention sweep, each without scanning the other partition.
- **SC-004**: The entity-not-causal boundary is explicit — entity/co-occurrence is recorded as recall evidence only and cannot be treated as causal truth, surfaced as an advisory invariant.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 provenance (`source_kind`) and `causal_edges.created_by` (default `'manual'`, schema v18) distinguish manual vs auto edges. | Low — substrate already exists; the skip-manual rule keys off provenance already present. | Build the skip-manual check on the existing manual-provenance marker; treat absent/unknown provenance conservatively as manual to avoid clobbering. |
| Risk | Transaction-boundary changes in the delete handlers could alter delete semantics or leave inconsistent tombstone state. | High | Make only the minimal COALESCE-preserve change inside the existing transactional writer; keep the transaction boundary intact; cover with a repeat-delete unit test. |
| Risk | Auto promotion clobbering manual meaning — the existing `insertEdge` on-conflict path overwrites `created_by`/evidence on a natural-key match. | High | Natural-key dedup must preserve manual provenance: skip the update when the existing row is manual, or add parallel low-strength evidence only; never overwrite manual `created_by`/evidence. |
| Risk | Entity/co-occurrence signals leaking into causal truth. | Med | Record the entity-not-causal invariant as an advisory constitutional/rule note so the boundary is explicit and checkable; keep entity/co-occurrence as recall evidence only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The first-timestamp tombstone change adds no extra round-trip — `deleted_at = COALESCE(deleted_at, <now>)` is the same single UPDATE as before, so a repeat soft-delete (single or bulk) stays within the existing delete latency and the bulk path's per-row cost is unchanged.
- **NFR-P02**: Default recall and the retention sweep each scan only their own partition — the active partial index (`deleted_at IS NULL`) serves recall and the purgeable partial index (`deleted_at IS NOT NULL`) serves the sweep, so neither path scans the other partition and recall p95 does not regress as tombstones accumulate.

### Security
- **NFR-S01**: A manually-authored causal edge is structurally protected from automated overwrite — an auto-promoter cannot mutate a manual `created_by`/evidence through the `insertEdge` on-conflict path, not merely by caller convention; the skip-manual branch refuses the overwrite at the storage writer.
- **NFR-S02**: The manual-vs-auto distinction is server-derived from the existing row's provenance (`causal_edges.created_by` default `'manual'`; `source_kind` from phase 001) and is never taken from a client-asserted strength or flag, so an auto edge cannot forge manual standing to win the on-conflict update.

### Reliability
- **NFR-R01**: The skip-manual rule fails safe — an existing edge with absent or unknown provenance is treated as manual, so the worst case is a skipped or parallel low-strength auto edge, never a clobbered manual edge.
- **NFR-R02**: The first-timestamp tombstone is idempotent under repeat delivery — delete → delete → delete leaves `deleted_at` and therefore the retention deadline unchanged after the first, so a re-delivered delete never silently extends retention.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Repeat soft-delete on an already-tombstoned row**: the second delete writes `deleted_at = COALESCE(deleted_at, <now>)`, which is a no-op on the timestamp, so the original tombstone moment and its retention deadline are preserved.
- **Natural-key edge match where the existing row is manual**: `insertEdge` keeps the manual `created_by`/evidence; the auto-promoter skips the overwrite and at most appends a parallel low-strength evidence edge, never mutating the manual row.
- **Edge with absent or unknown provenance on a natural-key match**: treated conservatively as manual, so the auto-promoter skips rather than overwriting — an unresolved origin is protected like a manual edge.
- **Entity/co-occurrence signal proposed as a causal edge**: it stays recall evidence only and never sets a causal `created_by`; the entity-not-causal invariant keeps it out of the causal partition.

### Error Scenarios
- **Repeat delete races a concurrent retention purge**: the COALESCE-preserve keeps the first `deleted_at` regardless of delete ordering, so the purge computes retention from a stable tombstone moment rather than a rewritten one.
- **Auto-promoter proposes a stronger edge than an existing manual edge**: the higher proposed strength does not win — the manual row is preserved and the stronger auto signal is dropped or recorded as parallel low-strength evidence, with a "skipped manual edge" hint on the response.
- **Partial-index migration runs against legacy rows**: the active and purgeable partial indexes are additive over the existing `deleted_at` column, so existing tombstoned and active rows are indexed into the correct partition with no data rewrite.

### State Transitions
- **Manual edge later targeted by an auto-promoter**: the edge remains manual; the on-conflict path skips the `created_by`/evidence overwrite, so a manual edge never transitions to auto provenance.
- **Active row transitions to tombstoned**: the first delete moves the row from the active partial index to the purgeable partial index, and a subsequent repeat delete does not move it back or restamp it.
- **Re-running the same auto-promotion against a manual edge**: the second run hits the same natural key and the same skip-manual decision, so the manual edge is unchanged and no duplicate overwrite occurs (idempotent).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 8 files: two delete handlers, `insertEdge` storage, two auto-promotion callers, the schema + partial-index migration, the retention sweep, and one constitutional rule; ~150-250 LOC plus vitest coverage. |
| Risk | 17/25 | Touches the live soft-delete transaction and the `insertEdge` on-conflict path, adding a skip branch that can drop an auto edge — a wrong COALESCE or skip-manual condition can corrupt tombstone state or block legitimate auto promotion. |
| Research | 6/20 | Design is settled in research/008 integration; remaining unknowns are narrow (skip vs parallel-evidence on a manual match, unknown-provenance handling) and confirmable against the live `causal_edges` schema during Setup. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- When an auto-promoter hits a natural-key match against a manual edge, should it skip silently or always add a parallel low-strength evidence edge? (Default assumption: skip and report "skipped manual edge"; add parallel evidence only if strength/evidence would materially differ.)
- Should an edge with absent or unknown provenance be treated as manual (conservative, never clobbered) or as auto (eligible for update)? (Default assumption: treat unknown as manual to avoid overwriting human meaning.)
- Should the entity-not-causal boundary be a constitutional rule file or a lighter in-code/doc invariant note? (Default assumption: a narrow constitutional rule, mirroring phase 001's approach, surfaced as advisory.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
