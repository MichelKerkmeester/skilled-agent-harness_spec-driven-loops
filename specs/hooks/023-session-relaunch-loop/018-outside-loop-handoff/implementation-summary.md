---
title: "Implementation Summary"
description: "A session outside skilled-loop now keeps a handoff note at its threshold instead of hearing nothing, Claude Code points it back at the note after a compaction, and the hop history names every note nobody claimed."
trigger_phrases:
  - "outside loop handoff implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/018-outside-loop-handoff"
    last_updated_at: "2026-10-21T08:30:00Z"
    last_updated_by: "worker"
    recent_action: "Built the note-only nudge, keep, the compact pointer and the open-notes line, proved live"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/claude/compact-pointer.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-outside-loop-handoff"
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
| **Spec Folder** | 018-outside-loop-handoff |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session started without `skilled-loop` no longer runs into auto-compaction blind. At its threshold it writes the handoff note and keeps it. After a Claude compaction it is pointed back at the note, and the hop history shows what happened.

### Phase 18: outside-loop-handoff

Outside the loop the nudge says the session cannot relaunch and asks for the note, `/speckit:save` when a packet is bound, and `session-relaunch.cjs keep`. It never asks for `prepare`, which there could only stop the session. `keep` checks the note the way `prepare` does, writes a `note-kept` line, prints the `claim` and `complete` commands and exits 0. Once the session has an open note, further nudges stay quiet. On Claude Code, a new `SessionStart` hook reacts to `source: compact`: it resets the nudge level so the next fill asks again, and adds claim instructions for the session's open note, unless a prepared hop owns it. `history` and `/doctor:setup` add an `open notes:` line while any note is open, so the two orphaned figjam notes now show up.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Outside-loop decision and text, open-note silence, `claimCommandFor`, post-compaction seed text |
| `.skilled/hooks/session-relaunch/lib/hop-history.cjs` | Modified | `note-kept`, `openNotes`, `openNotesLine` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `keep`, shared note check, open-notes line |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Created | Post-compaction pointer |
| `hook-registry.json`, `.claude/settings.json`, `.claude/hooks/compact-pointer.mjs` | Modified / Created | Registration, render and mirror |
| Session-relaunch tests, Pi test, `hook-registration-sync.vitest.ts` | Modified | Nine updated, six added, binding count 99 |
| `doctor-setup.yaml`, `doctor-setup-presentation.txt` | Modified | Open-notes line |
| Concern, tests, hooks, OpenCode plugins, system-spec-kit and root READMEs; `/speckit:handoff`; feature catalog entry and index; Claude and Pi/OpenCode playbooks; `/doctor:setup` scenario | Modified | Docs |
| `v4.0.0.13.md`, `system-spec-kit/changelog/v2.8.5.0.md`, `system-spec-kit/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Modified / Created | Release notes, version and mirror |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cause came first. The figjam session's process tree showed `claude` started straight from `zsh` at 06:21 on 2026-10-20, three hours before the shell shim landed, and its transcripts showed `prepare` exiting 3. All five adapters call the shared nudge without a loop id, so one change in `nudge.cjs` covers them. The nine tests that pinned the old silence were updated and six were added. Removing the pointer's prepared-hop guard made its test fail, so the test catches it. A live Claude session outside the loop then ran in tmux with a 5% threshold. It wrote the note and ran `keep`. It also showed the re-nudge firing while the note was being written, which led to the open-note silence. After `/compact`, the pointer logged `compact-pointer`, reset the level, and the session claimed and completed the note. The history shows `note-kept`, `claimed` and `done`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new `keep` subcommand rather than changing `prepare` outside the loop | `/speckit:handoff` relies on `prepare` printing the manual command and exiting 3 there |
| Switch the text on the loop id inside `handoffText` | All five adapters already pass none, so no adapter needed an edit |
| The compaction pointer on Claude only | The operator's case was Claude; the other runtimes get the claim command from `keep` |
| An open note silences the nudge outside the loop | Outside the loop no record marks the work as done, and the live run showed the re-nudge |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Session-relaunch suite | PASS, 616/616 (baseline 610, plus 6) |
| Pi adapter suite | PASS, 40/40 |
| Hook registration sync test | PASS, 7/7 |
| Doctor tests | PASS, 406/406 |
| Hook registrations and runtime mirrors `--check` | PASS, 193 mirrors |
| Drift guards | PASS, warnings pre-existing |
| Live Claude run outside the loop, then `/compact` | PASS, `note-kept`, `claimed`, `done` |
| Touched docs | 0 issues, HVR blocker counts equal their base files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pointer is Claude-only.** Codex, Pi, OpenCode and Hermes sessions outside the loop rely on the claim command `keep` printed before compaction.
2. **`spec_folder` arrives empty.** No adapter receives the bound packet, so the model fills the field itself, as it does inside the loop.
3. **A running session cannot join the loop.** The session must be closed and started again from a shell that sourced the shim.
<!-- /ANCHOR:limitations -->

---
