---
title: "Implementation Summary"
description: "Skilled v4.0.0.13 now has a global release entry, Sessions That Hand Themselves Over. It leads with the in-session handover and also covers OpenCode 1 and 2 dual compatibility, the breaking sk-code-skilled rename and the smaller fixes merged since v4.0.0.12."
trigger_phrases:
  - "v4 0 0 13 changelog implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog"
    last_updated_at: "2026-10-20T17:00:00Z"
    last_updated_by: "worker"
    recent_action: "Wrote the v4.0.0.13 global release entry and validated it"
    next_safe_action: "Commit worktree 172 and merge it to main"
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.0.13.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-v4-0-0-13-changelog"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 015-v4-0-0-13-changelog |
| **Completed** | 2026-10-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the Skilled changelog now finds a v4.0.0.13 entry that opens with the in-session handover: a session near its context limit writes a handoff note and restarts fresh in the same terminal.

### Phase 15: v4-0-0-13-changelog

The entry, "v4.0.0.13, Sessions That Hand Themselves Over", uses the expanded format. Its In-Session Handover section covers the 80% nudge and the second reminder 5% later, the fresh session that claims the note, the five runtimes that hop on their own and the macOS notice when a hop gets stuck. The OpenCode 1 and 2 section covers the sixteen plugins loading on both versions and `cli-opencode` dispatching to the version it finds. The Framework Code Standards section covers the `sk-code-opencode` to `sk-code-skilled` rename with a bold Breaking line for the `OPENCODE` to `SKILLED` surface id. The glance list adds the deep-loop legacy row migration and the CI suites, and Upgrade Notes gives the shell line, the Hermes plugin, the Codex approval, the rename and the OpenCode pin.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/changelog/skilled/v4.0.0.13.md` | Created | The v4.0.0.13 global Skilled release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The entry was written through the sk-doc sk-create-changelog mode. The version check read the local and `origin/main` changelog folders and the tag list, found v4.0.0.12 as the highest with no v4.0.0.13 file or tag, and took the build bump. The scope sweep listed everything on main after the v4.0.0.12 commit `0ead854621`. Every handover fact was read back against the session-relaunch README before the validators ran.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| v4.0.0.13, a build bump | The highest local and upstream entry and tag is v4.0.0.12 and the release adds no new framework layer |
| The in-session handover is the headline | It is the largest user-visible change since v4.0.0.12 and the only one that changes how a session ends |
| Expanded format | The release carries a breaking surface id change and ten or more changes |
| The prompt-improver Haiku eligibility change was left out | It is too minor for a global entry |
| No GitHub release | None was asked for |
| No component changelog | `cli-opencode` v1.5.0.0 and `sk-code-skilled` v2.0.0.0 already exist |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py .skilled/changelog/skilled/v4.0.0.13.md` | PASS: VALID, 0 issues, rc 0 |
| `hvr_scan.py` on the entry | 0 hard blockers, mechanical ceiling 97/100. The 9 oxford-comma candidates are all clause joins, not series |
| `extract_structure.py` checklist | failed: 0 |
| `validate.sh` on this folder and the parent packet, `--strict` | RESULT: PASSED for both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No GitHub release was published.** The entry exists only in the repository until someone publishes a release for it.
2. **The entry is not yet on main.** It lives in worktree 172 until that worktree is committed and merged.
<!-- /ANCHOR:limitations -->

---
