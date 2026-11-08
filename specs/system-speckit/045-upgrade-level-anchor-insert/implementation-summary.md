---
title: "Implementation Summary: Insert Level 2 sections above the questions anchor on upgrade"
description: "Upgrading a Level 1 spec to Level 2 no longer puts the new sections inside the questions anchor, so the upgraded spec passes strict validation without a hand fix."
trigger_phrases:
  - "upgrade level anchor insert implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/045-upgrade-level-anchor-insert"
    last_updated_at: "2026-11-08T10:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Anchor-aware split shipped with its test"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "upgrade level anchor insert"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-upgrade-level-anchor-insert |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Upgrading a spec from Level 1 to Level 2 now leaves it valid. The new sections used to land inside the questions anchor, so strict validation failed until someone moved them by hand.

### Upgrade Keeps the Questions Anchor

When the line above the OPEN QUESTIONS heading is the questions anchor, the upgrade now inserts the Level 2 sections above that anchor and writes the anchor back directly above the renumbered heading. A spec without the anchor upgrades exactly as before.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh` | Modified | Anchor-aware split in both heading branches |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-level-sections.vitest.ts` | Modified | Asserts the anchor sits directly above the heading and after the L2 sections |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker on `opencode-go` made the change from a short literal brief, started with `PWD` set to the worktree and the repository-root line on top, and the main checkout's `git status` was unchanged after it. The orchestrator reviewed the diff, reran the tests and checked that the new test fails against the old code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the split only when that exact anchor line is present | It keeps the output for every other spec byte for byte |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `upgrade-level-sections.vitest.ts` | 4 of 4 pass |
| `test-upgrade-level.sh` | 14 of 14 pass |
| Fresh Level 1 packet upgraded to Level 2 | `validate.sh --strict` prints `RESULT: PASSED`, `ANCHORS_VALID` passing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only the Level 1 to Level 2 insertion changed.** Other upgrade steps insert at other headings and were not changed.
<!-- /ANCHOR:limitations -->

---
