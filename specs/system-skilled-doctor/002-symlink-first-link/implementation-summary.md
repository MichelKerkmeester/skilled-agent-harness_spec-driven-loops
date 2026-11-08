---
title: "Implementation Summary: Link everything on the first symlink run and keep its relative links ignored"
description: "One /doctor:symlink link on a new project now links every entry and keeps git status clean. It used to need a second run, and the relative links it made showed as untracked."
trigger_phrases:
  - "symlink first link implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/002-symlink-first-link"
    last_updated_at: "2026-11-08T10:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned-target check and ignore lines shipped with tests"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/symlink-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "symlink first link"
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
| **Spec Folder** | 002-symlink-first-link |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Linking Skilled into a new project now takes one run. The first `link` used to leave the runtime folders half linked, and the links a second run added showed up in `git status`.

### One Run Links Everything

A relative link inside a runtime folder, such as `.claude/skills` pointing at `.skilled/skills`, is now planned when the same run creates its target, so it no longer waits for a second run. Each such link gets an ignore line, so nothing new shows in `git status`. The ignore line goes only to a link whose target the plan creates or that already resolves into the checkout. An alias to the project's own content, such as `.skilled/specs -> ../specs`, stays visible so the project can commit it. A link whose target the project lacks and the plan does not create is still skipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modified | `planCreates` and the host-relative branch of `planMergeTree` |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modified | The first-link and second-plan tests |
| `SETUP.md` | Modified | No more run-twice or leave-uncommitted notes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker on `opencode-go` made the change from a short literal brief, started with `PWD` set to the worktree and the repository-root line on top, and the main checkout's `git status` was unchanged after it. The orchestrator reviewed the diff, reran the tests, checked that the new tests fail against the old engine and ran one real link on an empty project.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Count a planned `mkdir` only as an exact match | An empty folder does not create what is under it, so an alias to a deeper path would dangle |
| Ignore a relative link only when its target is machine-local | A link into the checkout breaks for a teammate without one. An alias to the project's own folder works for everyone, so it stays committable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Symlink engine and contract tests | 52 of 52 pass |
| Same tests against the old engine | The two new tests fail |
| Doctor suite | 1,071 of 1,071 pass (1,069 before plus the two new tests) |
| One real link on an empty project | `check` `linked-merge` everywhere, 0 missing children, `git status` empty, unlink leaves only `.git` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Order matters.** A runtime alias counts on the core `.skilled` entry being planned first, which the manifest does today.
<!-- /ANCHOR:limitations -->

---
