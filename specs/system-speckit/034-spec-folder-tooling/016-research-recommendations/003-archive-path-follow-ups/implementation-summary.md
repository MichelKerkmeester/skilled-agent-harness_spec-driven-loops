---
title: "Implementation Summary"
description: "This phase is planned and not yet built. Phase 15 delivered archive re-derivation; this phase adds validator integration and tool alignment."
trigger_phrases:
  - "archive path follow ups implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
    last_updated_at: "2026-10-08T04:22:41Z"
    last_updated_by: "claude"
    recent_action: "Planned archive path follow-ups"
    next_safe_action: "Implement per tasks.md"
    blockers: []
    key_files: []
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
| **Spec Folder** | 003-archive-path-follow-ups |
| **Status** | Planned, not yet built |
| **Level** | 2 |
| **Created** | 2026-10-08 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Will Be Built

This phase is planned and not yet built. Phase 15 already delivered the core archive re-derivation that calls repair-derived.cjs --roots <moved folder> --apply after archive and restore.

This phase builds:
1. A fixture test that archives a real packet with metadata, restores it, and validates with `validate.sh --strict` to confirm the round-trip works.
2. Alignment of all four repair tools (repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, upgrade-legacy.mjs) on current-location semantics in their code and documentation.
3. Updated comments and READMEs reflecting the agreed-upon policy.

### Files to Change (not yet modified)

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modify | Add fixture test |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Clarify current-location policy |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md` | Modify | Document archive scope |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Align with current-location |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` | Modify | Verify alignment |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Pin archive policy in test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Will Be Delivered

1. Audit each tool for archive policy mentions and disagreements.
2. Update comments and documentation to align all four on current-location semantics.
3. Add a fixture test that runs archive, restore, and strict validation in one workflow.
4. Run the full test suite to verify no regressions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions Made

| Decision | Why |
|----------|-----|
| Phase 15's re-derive is sufficient for the archive move | `archive.sh` now calls `repair-derived.cjs` after moving a packet, so paths are re-derived before tools disagree |
| Current-location semantics for archives | Phase 14 research recommended this; validator enforces it; git history keeps provenance |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

| Check | Verification | Status |
|-------|--------------|--------|
| Fixture test passes | `npm test -- archive-track.vitest.ts` shows archive-then-validate test passing | Unmet |
| All four tools agree on policy | Grep for "archive\|FROZEN\|z_archive" in repair-derived.cjs, heal-spec-docs.cjs, migrate-generated-json.ts, upgrade-legacy.mjs shows consistent comments | Unmet |
| Full suite passes | `npm test` in runtime/cli shows 0 failures | Unmet |
| No regressions in other tests | Same test run shows no new failures compared to baseline | Unmet |
<!-- /ANCHOR:verification -->

---


