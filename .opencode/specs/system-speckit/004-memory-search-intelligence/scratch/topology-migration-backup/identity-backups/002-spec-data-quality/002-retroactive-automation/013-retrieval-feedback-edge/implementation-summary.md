---
title: "Implementation Summary: B3 Retrieval-Learning Feedback Edge"
description: "PLANNED scaffold for the retrieval-learning feedback edge. The impression capture, gap detector, and refinement queue are designed and not yet built."
trigger_phrases:
  - "retrieval feedback edge status"
  - "impression capture scaffold"
  - "recall gap detector scaffold"
  - "refinement queue scaffold"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/002-retroactive-automation/013-retrieval-feedback-edge"
    last_updated_at: "2026-07-06T18:49:42.694Z"
    last_updated_by: "markdown-agent"
    recent_action: "Scaffolded PLANNED retrieval-feedback-edge docs"
    next_safe_action: "Start T001 grep of the result-assembly seam"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-implsummary-005-013-retrieval-feedback-edge"
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
| **Spec Folder** | 013-retrieval-feedback-edge |
| **Status** | PLANNED |
| **Completed** | not yet implemented |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This phase is a PLANNED scaffold. The spec, plan, tasks, and checklist describe the intended impression-signal feedback edge, and no code is written. The detector module, the seam capture, and the `refinement_queue` table do not exist yet.

### Planned: Impression Capture (not yet built)

The plan adds an aggregate impression capture at the result-assembly seam in `hybrid-search.ts`, recording an `impression_count` and a per-doc `min_rank_seen` before truncation narrows the set, all behind the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` flag. With the flag off the search path stays unchanged.

### Planned: Gap Detector and Refinement Queue (not yet built)

The plan adds a `detect-retrieval-gaps.ts` detector that splits a never-retrieved doc into edge (a) recall-gap versus edge (b) below-floor truncation using `min_rank_seen`, then queues edge-tagged rows report-only into a new `refinement_queue` table that mirrors the `learned_feedback_audit` governance. The edge-a action is suggest-only and the edge-b row is advisory pending the `015-prodmode-recall-gate` unblock.

### Files Changed

No files changed yet. The table below lists the planned changes from the spec scope.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` | Planned Modify | Add aggregate impression capture behind the default-off flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts` | Planned Create | Classify never-retrieved docs into recall-gap versus below-floor edges |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts` | Planned Modify | Add the `refinement_queue` table DDL |
| `.opencode/skills/system-spec-kit/mcp_server/tests/detect-retrieval-gaps.vitest.ts` | Planned Create | Edge-discriminator and report-only governance tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Nothing is tested or shipped. The intended rollout keeps every change behind the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` flag and emits refinement actions report-only so the loop never auto-applies a change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Capture at the pre-truncation assembly point | Recorded `min_rank_seen` after truncation would misclassify a truncation casualty as a recall gap |
| Mirror the `learned_feedback_audit` governance | Copying the four safeguards avoids a second un-governed audit surface |
| Keep edge-b advisory only | Acting on below-floor rows needs the prod-mode completeRecall@3 proof from `015-prodmode-recall-gate` which does not exist yet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification run yet. The phase is PLANNED.

| Check | Result |
|-------|--------|
| Vitest detector suite | Not run, tests not written yet |
| Flag-off no-op assertion | Not run, capture not written yet |
| spec.md validate strict | PASS for the scaffold doc set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a PLANNED scaffold. No code exists for the capture, the detector, or the `refinement_queue` table.
2. **Edge-b is blocked.** Acting on below-floor rows waits on `015-prodmode-recall-gate`. Edge-b rows stay advisory until that gate ships.
<!-- /ANCHOR:limitations -->
