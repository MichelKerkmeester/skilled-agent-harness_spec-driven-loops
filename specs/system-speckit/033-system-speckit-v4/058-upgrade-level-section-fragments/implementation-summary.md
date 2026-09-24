---
title: "Implementation Summary"
description: "upgrade-level.sh now adds whole sections, puts a new document's level marker under its H1 and stamps it with the packet's identity, so a freshly upgraded packet passes strict validation instead of failing with malformed docs."
trigger_phrases:
  - "implementation summary"
  - "upgrade level section fragments"
  - "upgrade-level validation evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/058-upgrade-level-section-fragments"
    last_updated_at: "2026-09-24T05:26:00Z"
    last_updated_by: "generate-context"
    recent_action: "Made level upgrades add whole sections and validate"
    next_safe_action: "Continue with the phase-map sync normalization phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts"
    session_dedup:
      fingerprint: "sha256:251bcb288da78d3f9d3b13f4e59d0cf14d3892c5aaddb56208c1ea306dfff856"
      session_id: "scaffold-058-upgrade-level-section-fragments"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 058-upgrade-level-section-fragments |
| **Completed** | 2026-09-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Upgrading a packet's level no longer leaves it malformed. A level 1 packet upgraded to 2 or to 3 now passes strict validation straight away; before this change both failed with 2 errors and docs that needed rewriting by hand.

### Whole sections, not changed lines

The script still renders each template at the old and the new level, but it now compares them section by section and adds only the whole `## ` sections the new level has and the packet lacks, with their anchors and sub-headings. Lines that merely changed between the renders, such as the frontmatter title and the level row, are no longer injected. One heading key now ignores a leading number whether or not the heading has one, which is why a level 3 spec now receives its executive summary.

### New documents that validate

A document the upgrade creates, `acceptance-criteria.md` or a missing `implementation-summary.md`, gets its level marker under its H1 instead of inside its YAML frontmatter, and is stamped with the packet's identity the way `create.sh` stamps a new packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modified | Section-level fragments, marker placement, identity stamp |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts` | Created | Upgrades fresh packets and checks their shape and identity |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GPT-6 Luna executor wrote the section derivation and its test from a brief; its first attempt stopped on its own patch error and wrote nothing, and the retried brief said that was not a halt. Reviewing the result against strict validation found the marker and identity defects, which a MiMo v2.6 Pro executor fixed from two short literal briefs. The orchestrator reviewed each diff, ran every check, and ran the new tests against the previous script as the negative control.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare whole `## ` sections | A line diff cannot tell an added section from a changed line |
| Keep a fragment's anchors in the callers | Stripping leading comments would drop the first section's opening anchor |
| Fix the marker and identity defects in this phase | Without them an upgraded packet still failed strict validation, the failure this phase exists to end |
| Leave the level 3 template's own anchor layout alone | The upgraded file follows the template; changing the template is a separate decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on the script | PASS |
| `test-upgrade-level.sh` | PASS, 14 of 14 |
| `upgrade-level-sections.vitest.ts` | PASS, 3 of 3 |
| New tests against the previous script | 3 FAIL, as intended |
| Strict validation of fresh packets upgraded to 2 and to 3 | PASS both; the previous script FAILED both with 2 errors |
| `validate.sh --strict` on this phase | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The executive summary lands inside the metadata anchor at level 3.** The level 2 to 3 step inserts it before `## 1.`, which sits below that anchor's opening line. Anchor validation passes, and the placement is unchanged by this phase.
2. **Packets upgraded earlier are not repaired.** Phase 050 was rewritten by hand at the time; any other upgraded packet keeps whatever the old script left.
<!-- /ANCHOR:limitations -->

---
