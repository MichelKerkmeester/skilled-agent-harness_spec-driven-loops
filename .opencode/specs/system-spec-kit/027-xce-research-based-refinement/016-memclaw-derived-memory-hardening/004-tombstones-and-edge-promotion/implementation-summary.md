---
title: "Implementation Summary: Phase 4: tombstones-and-edge-promotion [template:level_1/implementation-summary.md]"
description: "Planned-stub summary for Phase 4 tombstones-and-edge-promotion. Nothing implemented yet: this records the intended first-timestamp tombstone idempotence, natural-key skip-manual edge promotion, active/purgeable partial indexes, and the entity-not-causal invariant before any code is written."
trigger_phrases:
  - "tombstone soft-delete idempotent deleted_at"
  - "causal edge promotion skip manual created_by"
  - "active purgeable partial index split"
  - "entity co-occurrence not causal truth invariant"
  - "tombstones edge promotion phase summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-memclaw-derived-memory-hardening/004-tombstones-and-edge-promotion"
    last_updated_at: "2026-06-06T10:10:49Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffold Phase 4 planned-stub impl doc"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-tombstones-and-edge-promotion |
| **Completed** | Not started — plan only |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

Nothing is implemented yet. This is a planned stub for Phase 4: it records the intended soft-delete and causal-edge lifecycle hardening before any code is written. When delivered, a repeat delete will keep the first tombstone moment (retention stops silently extending), auto causal-edge promotion will never clobber a manually-authored edge, recall and purge will each run against their own partial index, and the entity-not-causal boundary will be a recorded invariant.

### First-timestamp-idempotent soft-delete (planned)

You will be able to delete the same memory more than once without extending its retention. The transactional soft-delete writer in `memory-crud-delete.ts` (and the bulk path in `memory-bulk-delete.ts`) will write `deleted_at = COALESCE(deleted_at, <now>)`, so the original tombstone moment wins and a repeat delete is a no-op on the timestamp. Retention is then always computed from the first delete (REQ-001, P0).

### Manual-preserving causal-edge promotion (planned)

Auto-promoted causal edges will never overwrite a manually-authored one. `insertEdge` in `causal-edges.ts` already dedups on the natural key `(source_id, target_id, relation, source_anchor, target_anchor)`; its on-conflict branch currently runs `created_by = ?` unconditionally. The change makes that branch skip-manual: when the matched row is manual provenance, it skips the `created_by`/evidence overwrite (or adds parallel low-strength evidence only). Auto-promotion callers (`causal-graph.ts`, `causal-links-processor.ts`) will pass provenance and report "skipped manual edge"; unknown provenance is treated conservatively as manual (REQ-002, P0).

### Active/purgeable partial indexes (planned)

Recall and the retention sweep will each scan only their own partition. `vector-index-schema.ts` will add an active partial index (`WHERE deleted_at IS NULL`) for default recall and a purgeable partial index (`WHERE deleted_at IS NOT NULL`) for the sweep, with a forward migration; `memory-retention-sweep.ts` will use the purgeable index and report tombstone/edge state with no triage prompt (REQ-003, P1).

### Entity-not-causal invariant (planned)

The boundary that entity and co-occurrence signals are recall evidence only — never causal truth — will be recorded as an advisory constitutional rule (`constitutional/entity-cooccurrence-is-not-causal.md`), so an auto-promoter cannot quietly turn co-occurrence into causal `created_by` (REQ-004, P1).

### Files Changed (planned)

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` | Modify (planned) | COALESCE-preserve the first `deleted_at` on single-row soft-delete so a repeat delete does not extend retention. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` | Modify (planned) | Apply the same first-timestamp tombstone idempotence to the bulk soft-delete path. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify (planned) | Make `insertEdge` natural-key idempotent and skip-manual: never overwrite a manual `created_by`/evidence. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modify (planned) | Pass provenance from the auto-promotion entry point and report "skipped manual edge". |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Modify (planned) | Route post-insert enrichment promotions through the skip-manual path; keep entity/co-occurrence as recall evidence only. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify (planned) | Add active (`deleted_at IS NULL`) and purgeable (`deleted_at IS NOT NULL`) partial indexes plus a forward migration. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts` | Modify (planned) | Use the purgeable partial index for the sweep and report tombstone/edge state (no triage prompt). |
| `.opencode/skills/system-spec-kit/constitutional/entity-cooccurrence-is-not-causal.md` | Create (planned) | Record the invariant: entity/co-occurrence signals are recall evidence only, never causal truth. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Not yet delivered — plan only. The intended approach: land the additive partial indexes and forward migration first, then make the single-row and bulk soft-delete writers COALESCE-preserve the first `deleted_at`, then make `insertEdge` skip-manual on a natural-key match, then register the entity-not-causal constitutional rule. Verification will be vitest unit and integration tests (repeat-delete idempotence single + bulk, auto-promote against manual/auto/unknown edges, query-plan coverage for both indexes) plus one manual MCP end-to-end check, before any completion claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Preserve the first tombstone via `COALESCE(deleted_at, <now>)` rather than guarding in handler code | Keeps the first-timestamp rule inside the single SQL UPDATE, so both the single and bulk paths get it without branching logic, and the change stays a one-line revert. |
| Skip-manual on the existing `insertEdge` natural key instead of a new edge table | The natural unique key and bounded auto-edge caps already exist (schema v18); reusing them avoids new schema and keeps this incremental hardening, not a redesign. |
| Treat unknown/absent provenance as manual | Fails safe toward never clobbering human meaning — the worst case becomes a skipped auto edge, never a lost manual edge. |
| Split active vs purgeable into two partial indexes | Recall (`deleted_at IS NULL`) and the retention sweep (`deleted_at IS NOT NULL`) never scan each other's partition, so both stay fast as tombstones accumulate. |
| Record entity-not-causal as an advisory constitutional rule, not a hard gate | Mirrors phase 001's approach and makes the boundary explicit/checkable without blocking writes; entity/co-occurrence stays recall evidence only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| vitest unit (tombstone idempotence single + bulk) | Not started — plan only |
| vitest unit (`insertEdge` skip-manual on natural-key match) | Not started — plan only |
| vitest integration (auto-promote vs manual/auto/unknown edges) | Not started — plan only |
| Query-plan coverage (active + purgeable partial indexes) | Not started — plan only |
| Manual MCP end-to-end (repeat delete; "skipped manual edge" + tombstone state report) | Not started — plan only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Not implemented.** This is a planning stub; no code, schema, or constitutional rule has been written yet. Every claim above is intended behavior, not shipped behavior.
2. **Open questions remain (see spec.md §7).** Whether an auto-promoter skips silently or always adds a parallel low-strength evidence edge on a manual-edge match, and whether the entity-not-causal boundary is a full constitutional rule file or a lighter in-code note, are not yet decided. Defaults: skip-and-report, and a narrow advisory constitutional rule.
3. **Depends on phase 001 provenance.** The skip-manual rule is most precise when phase 001's `source_kind` distinguishes manual vs auto; absent it, the rule still keys off `causal_edges.created_by` (default `'manual'`, schema v18) but is coarser.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

