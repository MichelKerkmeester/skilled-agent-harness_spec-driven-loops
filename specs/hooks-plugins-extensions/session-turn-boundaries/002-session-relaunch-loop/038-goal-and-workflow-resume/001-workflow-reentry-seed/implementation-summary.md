---
title: "Implementation Summary: A hop names the command to run again"
description: "The handoff note carries an Active command line, the sender releases a held deep-loop lock, and the receiver runs the command again and reads the goal of the folder it works."
trigger_phrases:
  - "workflow reentry seed implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/001-workflow-reentry-seed"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/commands/speckit/handoff.md"
      - ".skilled/hooks/session-relaunch/tests/nudge.test.cjs"
    session_dedup:
      fingerprint: "sha256:b0f16a790b724bfa1f760f3a2404e5fb393cfb15e3f29ba6336e73ff4fdf3252"
      session_id: "scaffold-001-workflow-reentry-seed"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-workflow-reentry-seed |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A session that hops in the middle of a command now tells its successor which command that was. The receiver runs it again with the same mode and arguments instead of working the task list by hand. It also reads the goal of the spec folder it resumes.

### Phase 1: workflow-reentry-seed

Before this phase the note had four prose sections and the receiver was told to continue the remaining work. Nothing named the running command, so an unattended `/speckit:complete` or a deep loop came back as an ordinary session.

The sender now writes an `Active command:` line under In-flight state, or `Active command: none`. It releases a held deep-loop lock first, because the command it names would otherwise wait up to an hour for that lock. The receiver runs the named command again and lets the command find its own step. A Codex sender also writes an `Active goal:` line, since Codex has no goal reader, and the receiver sets that goal again or tells you which goal to set.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Sender text asks for the Active command line, the lock release and, on Codex, the Active goal line. Receiver text reads the folder goal and runs the command again |
| `.skilled/commands/speckit/handoff.md` | Modified | The manual command teaches the same note line and steps |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Cases for each new line and step, and the existing note shape |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built it through `codex exec` at xhigh, test first: `scratch/red.txt` holds the failing run and `scratch/green.txt` the passing one. The orchestrator then changed one sentence: the receiver step named `create_goal`, which only Codex has, so it now also tells a receiver without it to name the goal to the operator. An independent Opus 5.5 review of the whole diff stalled after an hour and was stopped. The orchestrator finished the review from the experiments it left behind and by reading each change. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The command travels as a line in the note, not as a record field | The relaunch record format is frozen, and `claim` already prints the note body, so no code has to change to deliver it |
| The receiver runs the command again and does not claim a step | The commands detect their own state on disk. A step number in the note would go stale |
| The lock release is a sender step | A lock taken from the command line counts as held for an hour after its owner dies, so the receiver cannot clear it |
| The goal step names the folder goal | A receiver bound to a parent goal had nothing that sent it to the phase goal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` | PASS: 80 tests, 80 pass, 0 fail |
| The new cases before the change | FAIL as required, in `scratch/red.txt` |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs`, loop variables unset | PASS: 1471 tests, 1471 pass, 0 fail, exit 0 |
| Goal hook suites under `.skilled/hooks/goal` | PASS: 200 tests, 200 pass, 0 fail, exit 0 |
| Pi relaunch vitest file | PASS: 59 passed, exit 0 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The receiver is asked, not forced.** The steps are text a model follows. No hook checks that the command was run again.
2. **A `/loop` or a scheduled wakeup still ends with the sender.** It comes back only when the sender wrote it on the Active command line and the receiver acts on it.
3. **Codex still carries no goal by itself.** The Active goal line is a prose route until Codex has a goal reader.
<!-- /ANCHOR:limitations -->

---


