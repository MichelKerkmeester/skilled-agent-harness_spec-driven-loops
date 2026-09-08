---
title: "Implementation Summary"
description: "Cross-lane synthesis of the visual-upgrade research: luna complete, glm one of five, eight ranked items, and a containment incident recorded."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/021-visual-upgrade-research"
    last_updated_at: "2026-09-08T15:38:35Z"
    last_updated_by: "claude-conductor"
    recent_action: "Luna lane complete, glm lane stopped after one angle; synthesis written"
    next_safe_action: "Rerun the glm lane in an isolated worktree, then close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-021-visual-upgrade-research"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-visual-upgrade-research |
| **Completed** | 2026-09-08 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The luna lane finished all five angles and the glm lane one; both agree the shipped shell stays and that the one anatomy gap is a prominent metric with a delta. Luna adds three new micro-forms and two per-form policies; glm adds a figure-aspect question and a contract discrepancy.

### deep research on the external reference library for visual upgrades

`research/research.md` is the backlog for the next build phase. Read it first; the lineage files hold the evidence per angle.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/dispatch-prompt.md` | Created | The brief |
| `research/lineages/luna/**` | Created | Five iterations, synthesis, state |
| `research/lineages/glm/**` | Created | Iteration one, state |
| `research/research.md` | Created | Cross-lane synthesis |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out runner ran both lanes at concurrency two under `max-iterations`. Luna completed in 48 minutes; the runner then marked it failed for write containment after reverting 1,858 paths outside the lineage directory. The glm lane, at max thinking, needed 56 minutes for its first angle; the conductor stopped it before its lineage end so the containment sweep could not revert the 932 files another session was editing in the same checkout. The synthesis was written from the artefacts on disk.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stop the glm lane early | The runner reverts every tracked file changed anywhere in the checkout when a lane ends; another session had 932 live edits, and a lost hour of GLM is cheaper than a lost afternoon of someone else's work |
| Synthesise now, rerun glm later | Luna's five angles plus glm's first give a usable backlog; the rerun belongs in a worktree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| luna lane | 5/5 iterations, ratios 0.86 to 0.68, `maxIterationsReached` |
| glm lane | 1/5 iterations, stopped by the conductor |
| `validate.sh --strict` | run at close-out |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The glm lane is incomplete.** Four angles remain; rerun in an isolated worktree.
2. **The runner's containment sweep is unsafe in a shared checkout.** It reverted 1,858 paths at the luna lane's end, overlapping another session's edits; fan-out lanes should run in a worktree of their own.
3. **GLM could not see the crops.** Its executor returned no pixels for image reads; it worked from measurements and notes.
<!-- /ANCHOR:limitations -->

---


