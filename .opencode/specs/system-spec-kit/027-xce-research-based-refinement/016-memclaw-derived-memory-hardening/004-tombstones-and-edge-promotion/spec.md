---
title: "Feature Specification: Phase 4: tombstones-and-edge-promotion [template:level_1/spec.md]"
description: "Repeat soft-deletes rewrite deleted_at and extend retention, auto edge promotion can overwrite a manually-authored causal edge via insertEdge's on-conflict update, and entity/co-occurrence signals risk being treated as causal truth. This phase makes soft-delete first-timestamp-idempotent, makes auto edge promotion natural-key idempotent and skip-manual, splits active/purgeable indexes, and records the entity-not-causal invariant."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "entity co-occurrence not causal truth invariant"
  - "natural-key edge upsert preserve manual provenance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-06T10:10:49Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 4 tombstones-and-edge-promotion planning spec"
    next_safe_action: "Plan or implement T001 active/purgeable partial indexes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-tombstones-and-edge-promotion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `scaffold/004-tombstones-and-edge-promotion` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-feedback-log-and-008-reframe |
| **Successor** | 005-stale-audit-and-tool-ownership |
| **Handoff Criteria** | Repeat soft-delete preserves the first `deleted_at` (retention not extended), auto edge promotion is natural-key idempotent and never overwrites a manual `created_by`/evidence, active/purgeable partial indexes are in place, and the entity-not-causal invariant is recorded. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Memclaw-derived memory hardening: provenance, idempotency, feedback reframe, tombstones, edges, stale audit, tool ownership specification.

**Scope Boundary**: Soft-delete lifecycle correctness and causal-edge promotion safety only. This phase makes a repeat soft-delete preserve the first tombstone timestamp via COALESCE, splits the memory index into active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes, makes auto causal-edge promotion natural-key idempotent while skipping rows with manual provenance, and records the invariant that entity/co-occurrence signals are recall evidence only and never causal truth. It does NOT add an entity-graph recall feature, any fleet/distributed lifecycle machinery, or idempotency receipts (those are phase 002).

**Dependencies**:
- Phase 001 (provenance-and-audit) supplies the provenance signal that distinguishes a manually-authored edge from an auto-promoted one. The skip-manual edge logic keys off manual provenance — `causal_edges.created_by` already defaults to `'manual'` (schema migration v18), and `source_kind` from phase 001 is the program-wide provenance distinguisher the auto-promoter consults.
- Builds on substrate that already exists: `causal_edges` has a natural unique key `(source_id, target_id, relation, source_anchor, target_anchor)` and bounded auto-edge caps; the retention sweep already reports ledger state; `memory.supersedes_id` is the only memory-to-memory link.

**Deliverables**:
- COALESCE-preserve the first tombstone timestamp on repeat delete so a second delete never extends retention; the first `deleted_at` wins.
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
Soft-delete currently rewrites `deleted_at` on a repeat delete, which silently extends retention every time a row is deleted again instead of preserving the original tombstone moment. `insertEdge` updates `created_by` (and via COALESCE, evidence) on an existing row when the natural key matches, so an auto-promoter can clobber a manually-authored causal edge's provenance and meaning. And entity/co-occurrence signals — which are recall evidence — could be mistaken for causal truth if nothing records the boundary.

### Purpose
Soft-delete is first-timestamp-idempotent, auto causal-edge promotion is natural-key idempotent and never overwrites manual provenance, recall and purge are kept fast by split partial indexes, and the entity-not-causal boundary is recorded as an invariant.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- COALESCE-preserve the first tombstone timestamp on repeat delete (the transactional soft-delete writer keeps the original `deleted_at`).
- Active/purgeable partial indexes: an active index over `deleted_at IS NULL` for recall and a purgeable index over `deleted_at IS NOT NULL` for the retention sweep.
- Natural-key auto edge promotion that skips rows with manual provenance: never overwrite a manual `created_by`/evidence; skip or add parallel low-strength evidence only.
- The entity-not-causal boundary invariant recorded as a constitutional/rule note (entity/co-occurrence is recall evidence only, never causal truth).

### Out of Scope
- An entity-graph recall feature - deferred; over-engineering for a local single-user system.
- Fleet/distributed lifecycle machinery - out of program scope (local single-user system, ruled out as negative knowledge by the 008 research).
- Idempotency receipts - belongs to phase 002.

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
| REQ-001 | First-timestamp-idempotent soft-delete. | A repeat delete does not extend retention; the first `deleted_at` is preserved via COALESCE so a second delete leaves the original tombstone moment unchanged. |
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

- **SC-001**: Deletes are idempotent and audit-preserving — a repeat soft-delete keeps the first `deleted_at`, so retention is computed from the original tombstone and is never silently extended.
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
