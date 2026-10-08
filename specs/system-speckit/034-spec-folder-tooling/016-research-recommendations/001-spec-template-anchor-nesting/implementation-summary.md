---
title: "Implementation Summary"
description: "Spec template anchor nesting is planned and not built yet. This summary records what the build must deliver and prove."
trigger_phrases:
  - "spec template anchor nesting implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting"
    last_updated_at: "2026-10-08T04:22:39Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-spec-template-anchor-nesting"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-spec-template-anchor-nesting |
| **Status** | Planned, not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned and has not yet been built. It will fix the spec.md template so the questions anchor wraps only the questions, not the NFR, edge-cases and complexity sections. This restores anchor-based retrieval and merges to working order for new scaffolds.

### Phase 1: spec-template-anchor-nesting

The fix will move the questions anchor opener from line 184 (before NFR) to line 303+ (directly above Open Questions), eliminating anchor nesting. The golden snapshot test will be updated to assert anchor pairing and no nesting for every level.

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Modify | Add per-level anchor openers and move closers for all four levels |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Modify | Add anchor assertions and regenerate snapshots |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modify | Capture new snapshot output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet tested or shipped. When built, the fix will be verified by: snapshot test passing with new assertions, manual scaffolding passing strict validation, and the full CLI suite passing with no regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the anchor at the template level, not in individual packets | The template is the producer. Fixing it at the source means all new scaffolds inherit the fix |
| Regenerate snapshots and add assertions | Snapshot tests must pass and the new assertions ensure the fix stays in place for future changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Snapshot test | `npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | All tests pass with noNesting assertions |
| Validation L2/L3/L3+ | `validate.sh --strict` on test packets | ANCHORS_VALID: pass, exit 0 |
| Full suite | `npx vitest run runtime/cli/tests` | No new test failures, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **549 existing spec.md files carry the old layout** The un-nesting of those documents is handled by phase 11 (SH-11, anchor-repair-mode), which depends on this phase's fixed template.
<!-- /ANCHOR:limitations -->

---
