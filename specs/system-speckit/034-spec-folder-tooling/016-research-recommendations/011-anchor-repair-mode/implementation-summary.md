---
title: "Implementation Summary"
description: "Anchor repair mode is planned and not built yet. This summary records what the build must deliver and prove."
trigger_phrases:
  - "anchor repair mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode"
    last_updated_at: "2026-10-08T04:22:47Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-anchor-repair-mode"
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
| **Spec Folder** | 011-anchor-repair-mode |
| **Status** | Planned, not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned and has not yet been built. It will add an anchor-repair mode that fixes three kinds of anchor defects found across the corpus: glued template pairs, fenced duplicates and the systematic nesting of the questions anchor in 549 spec.md files. The mode will integrate into the `upgrade-legacy` repair pipeline with proper dry-run, collision detection and atomic writes. The marker-only un-nesting also runs on archived documents, as decided by the operator on 2026-10-08.

### Phase 11: anchor-repair-mode

The anchor-repair mode detects and fixes three defect classes: glued template copies in one document, duplicate anchors split by code fence boundaries, and the systematic nesting of the questions anchor that wraps L2 and L3 sections. The mode is called from `upgrade-legacy.mjs` as one repair step, only when a document needs it. It performs dry-run correctly (no file writes, findings on stdout), checks suffix collisions when numbering ambiguous duplicates and writes changes atomically.

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Add anchor-repair mode with fence awareness and collision detection |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Call anchor-repair as one repair step, and run the un-nesting move on archived packets |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Allow exactly the archived un-nesting move |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-spec-docs.vitest.ts` | Create | Add tests for all three defect classes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet tested or shipped. When built, the fix will be verified by: unit tests on all three defect types, dry-run tests verifying no file writes, batch testing on 50+ documents with strict validation, and the full CLI suite passing with no regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fence-aware pairing | Code fences delimit their own content; anchors inside should never pair with anchors outside. Naive position-based logic breaks this invariant. |
| Collision detection before numbering | Suffix collisions are subtle defects that surface late, in retrieval failures. Early detection prevents them by checking existing suffixes. |
| Dry-run writes nothing | Dry-run is a contract. Writing leftovers breaks the contract, confuses operators and violates the principle that dry-run is side-effect-free. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Defect detection | `npx vitest run heal-spec-docs.vitest.ts` | All three defect class tests pass |
| Dry-run test | Run mode with --dry-run on fixture documents | No files written, findings on stdout |
| Batch validation | `validate.sh --strict` on 50 documents after apply | All documents pass ANCHORS_VALID |
| Full suite | `npx vitest run runtime/cli/tests` | No new test failures, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 1 dependency** The fixed template must be available before un-nesting can work. Phase 1 (SH-01) must ship first.
2. **Phase 13 waits** Phase 13 makes nesting an error only after this phase lands.
<!-- /ANCHOR:limitations -->

---


