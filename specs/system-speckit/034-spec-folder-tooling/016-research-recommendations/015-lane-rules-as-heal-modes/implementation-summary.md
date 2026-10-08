---
title: "Implementation Summary"
description: "Phase 15: lane-rules-as-heal-modes is planned and not built yet. This summary records what the build must deliver and prove."
trigger_phrases:
  - "lane rules as heal modes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes"
    last_updated_at: "2026-10-08T04:22:50Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-lane-rules-as-heal-modes"
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
| **Spec Folder** | 015-lane-rules-as-heal-modes |
| **Status** | Planned, not yet built |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned and has not yet been built. It will automate five deterministic lane rules (anchor wrap, link repoint, continuity placeholders, level from spec, header add) as permanent heal modes in `heal-spec-docs.cjs`, each with a derivability check that refuses when the evidence is missing or ambiguous. Modes will integrate into the `upgrade-legacy` repair pipeline and prove idempotence through tests, so future corpus-wide repairs need not hand-apply these rules again.

### Phase 15: lane-rules-as-heal-modes

When built, this phase will add five new modes to the healer: anchor-wrap detects documents with orphaned anchors and wraps them in their section boundaries; link-repoint finds broken links and updates them to correct targets (or removes just the link syntax); continuity-placeholders fills empty fields with standard text; level-from-spec reads the spec structure to set the correct level in frontmatter; header-add matches template signatures and adds missing headers. Each mode has a test that proves a second run changes nothing (idempotence), and per-folder validation after apply confirms safety.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modified | Add five new modes with derivability checks and discovery |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | Call new modes in repair sequence, record refusals in baseline |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-spec-docs.vitest.ts` | Create | Test each mode's positive, negative, and idempotence cases |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Document each mode and its derivability rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet built or tested. When built, the five modes will be verified by: unit tests for each mode covering positive cases (transformation applied), negative cases (refusal recorded), and idempotence cases (second run unchanged); integration tests showing all five modes run in sequence without contradicting each other; per-folder validation after apply confirming each packet remains valid; and the full test suite passing with no regressions in prior heal modes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Five modes, not one generic healer | Each transformation has different evidence and refusal conditions; a unified mode would silently skip some defects. Five separate modes make refusals explicit and debuggable. |
| Derivability checks block application | If evidence is missing or ambiguous, the mode refuses and records the refusal in the baseline, so a reviewer can follow up by hand. Silent skips hide failures. |
| Refusal recorded in baseline, not console | The baseline is read by the validator and by future runs; if refusals are console-only, a later operator won't know the transformation was attempted and failed. |
| Idempotence tested per-mode | A second run on a fixed packet should change nothing for each mode. If one mode undoes another's work, tests will catch it before corpus-wide apply. |
| Per-folder validation is the control | Touching many packets means validating each one after apply is mandatory. No bulk apply without per-folder checks that the structure is still correct. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Mode implementation | Five modes exist in heal-spec-docs.cjs with derivability checks | All modes callable and documented |
| Unit tests | `npx vitest run heal-spec-docs.vitest.ts` | 15+ tests passing (3+ per mode: positive, negative, idempotence) |
| Integration test | `npx vitest run upgrade-legacy.vitest.ts::all-modes-sequence` | All five modes run in order, zero contradictions |
| Per-folder validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` after apply | RESULT: PASSED for each packet |
| Full suite | `npm test` in system-spec-kit | No new failures, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Archived packets follow current-location semantics.** Phase 15 settled the archive policy: derived fields in an archived packet follow where it lives now, and archived prose never changes. A heal mode that edits structure only must follow the same rule, so the test matrix keeps its "archived packet (structure-only edits)" case.
2. **Boundary with anchor-repair-mode unclear.** Lane rule 2 (anchor-wrap) wraps anchors, and sibling SH-11 (anchor-repair-mode) handles collision detection and un-nesting. This plan does not describe duplicate numbering; verify the split at implementation time.
<!-- /ANCHOR:limitations -->

---


