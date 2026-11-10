---
title: "Implementation Summary: Provision private local commands in the form the primary checkout holds them"
description: "A provisioned worktree now holds each private local-* command in the form the primary checkout holds it, so the pre-commit mirror gate no longer blocks its commits."
trigger_phrases:
  - "provision private command links implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/worktree-lifecycle/006-provision-private-command-links"
    last_updated_at: "2026-11-08T10:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Form-preserving provisioning shipped with its test"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/worktree-naming.sh"
      - ".skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "provision private command links"
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
| **Spec Folder** | 006-provision-private-command-links |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A worktree you provision can commit again. Provisioning used to turn every private `local-*` command into an absolute link, and the mirror gate then blocked every commit there.

### Private Commands Keep Their Form

Provisioning now copies a private command file, recreates a relative mirror link with the same link text and shares a private folder through one absolute link. An edit to a copied file stays in its worktree, and an existing path is still never replaced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | `_wn_link_local_commands` recreates each entry by form |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | Asserts a real-file router, the relative mirror link and the folder link |
| `.skilled/skills/sk-git/SKILL.md` | Modified | Rule 8 describes the forms |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker on `opencode-go` made the change from a short literal brief, started with `PWD` set to the worktree and the repository-root line on top, and the main checkout's `git status` was unchanged after it. The orchestrator reviewed the diff, reran the tests and checked that the new test fails against the old code. The worker also force-added the fixture `.opencode` folder, because a global git exclude can ignore it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy files instead of linking them | The mirror generators walk real files, so a linked file reads as missing and its tracked mirror as extra |
| Keep folders as one shared link | Nothing walks into them as a file, and one copy avoids duplicating asset trees |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `worktree-naming.test.sh` | `PASS=174 FAIL=0` (171 before, plus the new assertions) |
| Same suite against the old function | `PASS=172 FAIL=2`: the router is a link and the mirror link text is absolute |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A copied file does not follow the primary.** Rerun `worktree-naming.sh provision` after removing the copy to pick up a newer primary version.
<!-- /ANCHOR:limitations -->

---
