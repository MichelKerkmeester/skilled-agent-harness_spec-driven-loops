---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. The shared safe-fix engine is scaffolded with spec, plan, tasks and checklist. No code is built yet."
trigger_phrases:
  - "shared safe-fix engine"
  - "detector registry"
  - "fixClass allow-list"
  - "dq-engine runDetectors"
  - "content_hash idempotency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/026-shared-safe-fix-engine"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded plan tasks and checklist, status PLANNED"
    next_safe_action: "Build the registry and engine then verify"
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
| **Spec Folder** | 026-shared-safe-fix-engine |
| **Status** | PLANNED, not yet implemented |
| **Completed** | Not completed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is scaffolded only. The spec, plan, tasks and checklist are authored and the work is PLANNED. The engine is the foundation the program builds first, right after the Stage-0 census, so the front doors A1, B1 and B2 wait on it.

### Planned: Shared Safe-Fix Engine

The planned engine is two new files under `scripts/dq/`. `detector-registry.ts` is the single source of truth for detectors and the frozen safe-class allow-list, deny-by-default. `dq-engine.ts` is a pure `runDetectors(target, opts)` that returns `{issues, applied, skipped}`, writes nothing in report mode and applies only safe-class fixes behind content_hash idempotency and atomic writes. It reuses the shipped scorers verbatim and never calls the destructive runQualityLoop. None of this exists in code yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| spec.md | Created | Records the problem, scope, requirements and verified seams |
| plan.md | Created | Records the implementation approach and phase plan |
| tasks.md | Created | Records the task breakdown |
| checklist.md | Created | Records the QA checklist, all items unchecked |

No source code has been written. The two files named in spec.md scope (`detector-registry.ts` and `dq-engine.ts`) are planned, not created.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. This is a planning scaffold. No tests were run and no apply executed. Delivery starts when Phase 2 of plan.md begins, since the engine carries no upstream build dependency of its own.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the registry the single source of truth, deny-by-default | The keystone consumers must not fork the detector list or the notion of a safe fix, so one frozen registry holds both |
| Reuse the shipped scorers verbatim, add none of the engine's own | A parallel scorer would risk divergent verdicts, so the engine imports computeMemoryQualityScore and reviewPostSaveQuality and defines no scorer |
| Quarantine the destructive runQualityLoop budget-trim to memory-save | Its 8000-char substring trim would amputate any doc larger than the budget, so the engine never calls it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| spec, plan, tasks, checklist authored | PASS, `validate.sh --strict` exits 0 on the scaffold |
| Registry and engine built | NOT STARTED |
| Report-path behavior tested | NOT STARTED |
| Safe-class apply tested | NOT STARTED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code exists.** This phase is a planning scaffold only. The registry and the engine are planned, not built.
2. **INV-2 points at an unbuilt gate.** The 015-c2 prod-mode recall gate is not built here, so retrieval-class detectors stay suggest-only until it lands.
3. **Two open questions remain.** The exact `scripts/dq/` directory location and whether the content_hash guard reuses the stored cache key or computes a fresh per-target hash are still open in spec.md.
<!-- /ANCHOR:limitations -->
