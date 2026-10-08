---
title: "Implementation Summary"
description: "Phase 5: healer-phrase-seeding is planned and not built yet. This summary records what the build must deliver and prove."
trigger_phrases:
  - "healer phrase seeding implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding"
    last_updated_at: "2026-10-08T04:22:42Z"
    last_updated_by: "template-author"
    recent_action: "Planned the phase"
    next_safe_action: "Build against goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-healer-phrase-seeding"
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
| **Spec Folder** | 005-healer-phrase-seeding |
| **Completed** | 2026-10-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is planned but not yet built. When built, it will stop the upgrade path from writing any trigger phrase that phrase-judge rejects, so healers never write what the checker refuses.

### Phase 5: healer-phrase-seeding

**Status**: Planned

The implementation will delete TEMPLATE_DEFAULTS from heal-spec-docs.cjs and refill an empty list with the exact `seededPhrases` output from template-phrase-cleanup.mjs. It will also make `inferTriggerPhrases` in frontmatter-migration.ts emit only phrases the judge admits. Tests will pin the healer to the seeder and grade every phrase the upgrade writes.

### Files to be Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Delete TEMPLATE_DEFAULTS, refill from the slug seeder |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | Export `seededPhrases` |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | `inferTriggerPhrases` emits no rejected phrase |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modify | Pin healer output to the seeder |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Grade every phrase the upgrade writes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Will Be Delivered

When this phase is built, it will be verified through:
- Running Vitest test suites for both modified test files
- Running `validate.sh --strict` on this spec packet
- Grep checks to ensure TEMPLATE_DEFAULTS is removed from active code paths
- Manual tracing of one empty-list and one missing-key document through the upgrade path
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Decisions

| Decision | Status |
|----------|--------|
| Empty trigger_phrases list fallback | Decided 2026-10-08 by the operator: refill with the exact slug-seeder output |
| TEMPLATE_DEFAULTS | Decided 2026-10-08 by the operator: deleted, not pinned |
| Scope | Decided 2026-10-08 by the operator: widened to `inferTriggerPhrases` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification Checklist

When complete, this phase will verify:

| Check | Target |
|-------|--------|
| Unit tests | create-root-numbering.vitest.ts and upgrade-legacy.vitest.ts pass |
| Spec validation | validate.sh --strict on this packet passes |
| Code quality | No references to TEMPLATE_DEFAULTS in active code paths |
| Convention compliance | The upgrade writes no phrase in any negative judge class |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Not Yet Applicable

This is a planned phase. Limitations and unknowns are tracked in spec.md and acceptance-criteria.md.
<!-- /ANCHOR:limitations -->

---


