---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Self-healing model consolidation is scaffolded with spec, plan, tasks and checklist. No code is built yet."
trigger_phrases:
  - "self-healing model consolidation"
  - "suspect queue sole confirmation funnel"
  - "runSuspectConfirmation one confirmer"
  - "orphan sweep discoverer not deleter"
  - "drift suspect queue size cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/023-self-healing-model-consolidation"
    last_updated_at: "2026-07-09T20:30:10.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded plan, tasks and checklist, status PLANNED"
    next_safe_action: "Wait for 017/018/019 to land, re-verify cited line numbers, then build per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-self-healing-model-consolidation |
| **Status** | PLANNED, not yet implemented |
| **Completed** | Not completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks and checklist are authored and the
work is PLANNED. Per the parent packet's own framing this is a real design improvement but not urgent —
scheduled to start after sibling packets 017, 018 and 019 land, since none of those exist as spec folders yet
at the time of writing (the parent's newest built child is `016-cross-package-flag-governance`).

### Planned: Self-Healing Model Consolidation

The planned change touches two existing call sites inside `mcp_server/handlers/memory-index.ts`:
`runGlobalOrphanSweep` and the marker-triggered scoped-delete branch inside `handleMemoryIndexScan`. Both
currently call the shared delete primitive (`deleteIndexedRecordIds` / `deleteStaleIndexedRecords`) directly
on first detection. The plan converts both to call the existing `appendMemoryDriftSuspects` instead, so
`runSuspectConfirmation` — which already owns confirming Layer 1's query-time-filter suspects — becomes the
sole place that verifies-and-tombstones for all three self-healing layers. Two watch-list items ride along:
a size cap/metric on the suspect queue, and a reconsideration of the queue-write busy-timeout now that more
callers feed it. None of this exists in code yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Records the problem (grounded in real file:line citations against the live tree), scope, and requirements |
| plan.md | Created | Records the technical approach, five architecture decisions, and phase plan |
| tasks.md | Created | Records the task breakdown, T001 blocked on 017/018/019 |
| checklist.md | Created | Records the QA checklist, all items unchecked |

No source code has been written. `memory-index.ts`, `memory-drift-healing.ts`, and (conditionally)
`memory-search.ts` remain unmodified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. This is a planning scaffold. No tests were run and no code changed. Delivery starts when
Phase 1 of plan.md begins, which is itself gated on 017/018/019 landing per the declared sequencing
dependency.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the suspect queue the sole confirmation funnel for all three self-healing layers, not just Layer 1 | Only Layer 1's query-time filter currently gets a time-separated confirmed second look before delete; Layer 3's orphan sweep and Layer 2's marker-triggered scoped delete both decide-and-delete on first detection today, even though `runSuspectConfirmation` already exists and already owns confirming Layer 1's candidates |
| Keep the out-of-scope full-corpus `filesToDelete` stale-delete path as a direct delete | It is a ground-truth corpus diff from an explicit file walk, not a heuristic candidate, so it does not need the same transient-absence protection the other two paths do |
| Recommend swapping the orphan-sweep / suspect-confirmation phase-call order (confirmation first, orphan-sweep second) | Without the swap, an orphan-sweep-enqueued id would be confirmed by the very next line of the same function call — zero time separation, defeating the transient-absence protection the suspect-queue model exists for |
| Add a size cap/metric to the suspect queue rather than leaving it unbounded | Layer 3's orphan sweep can page up to 200,000 candidate ids per invocation; routing that volume through the same queue and the same unbounded `WHERE id IN (...)` confirmation query that previously only saw Layer 1's ~10-50-id-per-query trickle changes a theoretical risk into a real one |
| Reconsider (not blindly reuse) the 25ms drift-suspect-write busy-timeout for the two new callers | That timeout was tuned specifically for a read-hot-path search-response caller; the two new callers run inside an already-serialized scan/write phase where a longer wait is more likely to succeed and less costly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| spec, plan, tasks, checklist authored | PASS, `validate.sh --strict` exits 0 on the scaffold |
| Orphan-sweep and scoped-delete call-site conversions built | NOT STARTED |
| Phase-order and size-cap/metric changes built | NOT STARTED |
| Busy-timeout policy decision implemented | NOT STARTED |
| Updated/extended vitest suites passing | NOT STARTED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code exists.** This phase is a planning scaffold only. Every file:line citation in spec.md and
   plan.md was verified against the live tree at authoring time (2026-07-09) but must be re-verified before
   implementation, since sibling packets 017/018/019 have not yet landed and may shift line numbers in the
   same files this packet touches.
2. **Three open questions remain**, all deferred to implementation-time decisions in plan.md: the exact
   same-cycle-vs-next-cycle confirmation choice for orphan-discovered suspects (a recommended default is
   stated but not mechanically enforced by this scaffold), the concrete size-cap number or metric-only
   approach, and whether the busy-timeout constant relocates out of `memory-search.ts` or stays caller-local.
3. **017/018/019 do not exist as spec folders yet.** The sequencing dependency is recorded as declared by
   the parent packet's own scope framing, not verified against those packets' (not-yet-written) content.
<!-- /ANCHOR:limitations -->
