---
title: "Implementation Plan: Phase 4: tombstones-and-edge-promotion [template:level_1/plan.md]"
description: "Makes soft-delete first-timestamp-idempotent by COALESCE-preserving the original deleted_at in the transactional delete writer, makes auto causal-edge promotion natural-key idempotent and skip-manual in causal-edges.ts, and adds active/purgeable partial indexes plus the entity-not-causal invariant."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "natural-key edge upsert preserve manual provenance"
  - "tombstones edge promotion plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-06T10:10:49Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Populate Phase 4 tombstones-and-edge-promotion plan"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: tombstones-and-edge-promotion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node |
| **Framework** | Spec Kit Memory MCP server (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite + vector store |
| **Testing** | vitest |

### Overview
This phase fixes three soft-delete and causal-edge lifecycle hazards. The transactional soft-delete writer COALESCE-preserves the original `deleted_at` so a repeat delete cannot extend retention. `insertEdge` in `causal-edges.ts` becomes natural-key idempotent and skip-manual: its on-conflict path stops overwriting a manual `created_by`/evidence and instead skips or adds parallel low-strength evidence only. Two partial indexes (active `deleted_at IS NULL`, purgeable `deleted_at IS NOT NULL`) keep recall and the retention sweep fast, and the entity-not-causal boundary is recorded as an advisory invariant. Most substrate already exists (`causal_edges` natural unique key, bounded auto-edge caps, retention-sweep ledger reporting), so this is incremental hardening.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-phase write split (program-wide architectural rule). Each invariant lives in the correct phase of the memory write path: the first-timestamp tombstone belongs to the transactional writer (the soft-delete UPDATE itself), the natural-key skip-manual decision belongs to the transactional writer in `causal-edges.ts` (`insertEdge`), and the partial indexes are schema. Post-mutation hooks (cache invalidation, audit append, advisory enrichment) stay out of these integrity decisions; the retention sweep and post-insert enrichment only consume the results.

### Key Components
- **First-timestamp tombstone (`handlers/memory-crud-delete.ts`, `handlers/memory-bulk-delete.ts`)**: The soft-delete UPDATE sets `deleted_at = COALESCE(deleted_at, <now>)` so the first tombstone moment wins; a repeat delete is a no-op on the timestamp and therefore on retention. The bulk path applies the same COALESCE-preserve.
- **Natural-key skip-manual edge promotion (`lib/storage/causal-edges.ts`)**: `insertEdge` already dedups on the natural key `(source_id, target_id, relation, source_anchor, target_anchor)`; its on-conflict branch currently runs `created_by = ?` unconditionally. The change: when the existing row is manual provenance, skip the `created_by`/evidence overwrite (skip the update, or add parallel low-strength evidence only). New auto edges still respect the bounded auto-edge caps.
- **Partial indexes (`lib/search/vector-index-schema.ts`)**: Add an active partial index (`WHERE deleted_at IS NULL`) for default recall and a purgeable partial index (`WHERE deleted_at IS NOT NULL`) for the retention sweep, with a forward migration. Each path scans only its partition.
- **Promotion callers + sweep (`handlers/causal-graph.ts`, `handlers/causal-links-processor.ts`, `lib/governance/memory-retention-sweep.ts`)**: Auto-promotion callers pass provenance so the skip-manual rule has the signal; the retention sweep uses the purgeable index and reports tombstone/edge state. Entity/co-occurrence stays recall evidence only.
- **Entity-not-causal invariant (`constitutional/entity-cooccurrence-is-not-causal.md`)**: Records that entity/co-occurrence signals are recall evidence only and never causal truth; advisory in validation.

### Data Flow
A delete request reaches `memory-crud-delete.ts` (or `memory-bulk-delete.ts`). Inside the existing transaction, the soft-delete UPDATE writes `deleted_at = COALESCE(deleted_at, <now>)`, so a row already tombstoned keeps its original timestamp and retention is computed from the first delete. Separately, post-insert enrichment in `causal-links-processor.ts`/`causal-graph.ts` proposes causal edges; each goes through `insertEdge`. On a natural-key match, `insertEdge` checks the existing row's provenance: a manual edge is preserved (the `created_by`/evidence overwrite is skipped; at most a parallel low-strength evidence edge is added), while an auto edge updates as before under the bounded caps. Recall queries hit the active partial index; the retention sweep hits the purgeable partial index and reports tombstone/edge state without prompting for triage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/memory-crud-delete.ts` | Producer: soft-deletes a single memory row (writes `deleted_at`). | update — write `deleted_at = COALESCE(deleted_at, <now>)` inside the existing transaction. | Repeat-delete vitest keeps the first `deleted_at`; `rg -n 'deleted_at|COALESCE' handlers/memory-crud-delete.ts`. |
| `handlers/memory-bulk-delete.ts` | Producer: soft-deletes many rows in one pass. | update — apply the same COALESCE-preserve to the bulk UPDATE. | Bulk repeat-delete vitest; `rg -n 'deleted_at|COALESCE' handlers/memory-bulk-delete.ts`. |
| `lib/storage/causal-edges.ts` | Producer/storage: `insertEdge` upserts on the natural key; on-conflict runs `created_by = ?`. | update — skip the `created_by`/evidence overwrite when the existing row is manual provenance. | Skip-manual vitest; `rg -n 'insertEdge|created_by|ON CONFLICT|UPDATE causal_edges' lib/storage/causal-edges.ts`. |
| `handlers/causal-graph.ts` | Consumer: auto-promotion entry point that calls into edge insert. | update — pass provenance so skip-manual has the signal; report "skipped manual edge". | `rg -n 'insertEdge|insertEdgesBatch|created_by|skipped' handlers/causal-graph.ts`; skipped-edge hint in vitest. |
| `handlers/causal-links-processor.ts` | Consumer: post-insert enrichment that proposes/promotes edges. | update — route promotions through the skip-manual path; keep entity/co-occurrence as recall evidence only. | `rg -n 'insertEdge|promote|created_by|entity|co-occur' handlers/causal-links-processor.ts`. |
| `lib/search/vector-index-schema.ts` | Owns the memory index schema and migrations. | update — add active (`deleted_at IS NULL`) + purgeable (`deleted_at IS NOT NULL`) partial indexes + forward migration. | Migration runs clean; query plan uses each index; `rg -n 'deleted_at|CREATE INDEX|WHERE' lib/search/vector-index-schema.ts`. |
| `lib/governance/memory-retention-sweep.ts` | Consumer: retention sweep that reports ledger/tombstone state. | update — use the purgeable partial index; report tombstone/edge state (no triage prompt). | `rg -n 'deleted_at IS NOT NULL|purge|retention|index' lib/governance/memory-retention-sweep.ts`. |
| `constitutional/` loader + validation | Loads constitutional rules and surfaces them in validation. | update (add-only) — register the entity-not-causal rule; advisory surfacing. | Rule appears in validation output; loader picks up the new file. |

Required inventories:
- Same-class producers (soft-delete writers): `rg -n 'deleted_at' .opencode/skills/system-spec-kit/mcp_server/handlers .opencode/skills/system-spec-kit/mcp_server/lib`.
- Same-class producers (edge upserts): `rg -n 'insertEdge|insertEdgesBatch|created_by|ON CONFLICT' .opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts .opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts .opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`.
- Consumers of changed symbols: `rg -n 'deleted_at|insertEdge|created_by' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: operation (`single delete | bulk delete`) x prior state (`never deleted | already tombstoned`); and edge promotion source (`auto`) x existing-row provenance (`manual | auto | unknown`). Required rows: a repeat delete on both paths, and an auto-promote against each provenance class.
- Algorithm invariant: a repeat soft-delete MUST NOT change `deleted_at` (COALESCE keeps the first value); an auto edge promotion MUST NOT overwrite a manual `created_by`/evidence (skip or parallel low-strength evidence only); entity/co-occurrence MUST stay recall evidence and never set causal `created_by`. Adversarial cases: delete → delete → delete (timestamp stable), auto-promote onto a manual edge with stronger proposed strength, and an existing edge with unknown provenance (treated as manual).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add the active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes to `vector-index-schema.ts` with a forward migration.
- [ ] Confirm the soft-delete writer location and the exact `deleted_at` UPDATE statement in `memory-crud-delete.ts` / `memory-bulk-delete.ts`.
- [ ] Confirm the manual-provenance signal the skip-manual rule will key off (`causal_edges.created_by` default `'manual'`; `source_kind` from phase 001).

### Phase 2: Core Implementation
- [ ] Make single-row soft-delete first-timestamp-idempotent: `deleted_at = COALESCE(deleted_at, <now>)` inside the existing transaction in `memory-crud-delete.ts`.
- [ ] Apply the same COALESCE-preserve to the bulk soft-delete in `memory-bulk-delete.ts`.
- [ ] Make `insertEdge` skip-manual in `causal-edges.ts`: on a natural-key match against a manual row, skip the `created_by`/evidence overwrite (skip the update, or add parallel low-strength evidence only).
- [ ] Pass provenance from the auto-promotion callers (`causal-graph.ts`, `causal-links-processor.ts`) and report "skipped manual edge"; keep entity/co-occurrence as recall evidence only.
- [ ] Point the retention sweep at the purgeable partial index and report tombstone/edge state (no triage prompt).
- [ ] Add the entity-not-causal constitutional rule file under `constitutional/`.

### Phase 3: Verification
- [ ] vitest: a repeat delete (single and bulk) preserves the first `deleted_at` and does not extend retention.
- [ ] vitest: an auto edge promotion against a manual edge never overwrites `created_by`/evidence (skips, or adds parallel low-strength evidence only).
- [ ] vitest / query-plan check: recall uses the active partial index and the retention sweep uses the purgeable partial index.
- [ ] Update the memory-system docs to describe first-timestamp tombstones, the skip-manual edge rule, and the entity-not-causal invariant.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | First-timestamp tombstone idempotence (single + bulk soft-delete) and `insertEdge` skip-manual on a natural-key match. | vitest |
| Integration | Delete → repeat delete round-trip via the handlers (retention unchanged); auto-promote against manual/auto/unknown edges through `causal-graph.ts` / `causal-links-processor.ts`. | vitest |
| Manual | One end-to-end check that a repeat delete does not extend retention and that `/memory:manage` / causal search reports "skipped manual edge" and tombstone state. | MCP call / `/memory:manage` / `/doctor memory` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 provenance (`source_kind`) as the manual-vs-auto distinguisher | Internal | Green | Skip-manual can still key off `causal_edges.created_by` alone, but is less precise without `source_kind`. |
| `causal_edges` natural unique key + `created_by` column (schema v18) | Internal | Green | REQ-002 blocked — the skip-manual rule has no natural-key match or provenance marker to branch on. |
| Existing soft-delete writer (`memory-crud-delete.ts`, `memory-bulk-delete.ts`) | Internal | Green | REQ-001 blocked — the COALESCE-preserve change has no transactional writer to land in. |
| Retention sweep (`memory-retention-sweep.ts`) + bounded auto-edge caps | Internal | Green | Purgeable-index wiring (REQ-003) and cap-respecting promotion lose their existing host; idempotence still possible. |
| Constitutional rule loader + validation surface | Internal | Green | REQ-004 blocked — the entity-not-causal invariant cannot be registered or surfaced as advisory. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The COALESCE-preserve change breaks delete semantics or leaves inconsistent tombstone state, the skip-manual rule wrongly blocks legitimate auto promotion, or the partial-index migration degrades recall/sweep performance.
- **Procedure**: The COALESCE change is a one-line revert in each delete handler (drop back to a plain `deleted_at = <now>` write) and is behaviorally reversible. The partial indexes are additive and droppable via the migration's down path with no data change. The skip-manual branch in `insertEdge` can be reverted to the prior unconditional `created_by = ?` on-conflict update; treat unknown provenance as manual while the rule is active so the failure mode is "too cautious" (a skipped auto edge), never "manual edge clobbered". Revert the handler/storage/schema edits and re-run the migration's down path.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

