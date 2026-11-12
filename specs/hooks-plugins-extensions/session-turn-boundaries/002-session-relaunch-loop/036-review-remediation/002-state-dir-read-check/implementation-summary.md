---
title: "Implementation Summary: Relaunch state is read only from a checked directory"
description: "Reading a relaunch record or the nudge state now applies the same real-directory and owner check as writing one, and consume drops a handoff path outside the handoffs directory, so a redirected state directory can no longer steer a hop."
trigger_phrases:
  - "state dir read check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/002-state-dir-read-check"
    last_updated_at: "2026-11-12T10:34:02Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase after one follow-up pass and an SWE review"
    next_safe_action: "Verify nothing; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"
    session_dedup:
      fingerprint: "sha256:83b8bd5522683966a5c776f000a1fc4952ba5762008ba6aac56598494c3ecbc7"
      session_id: "scaffold-002-state-dir-read-check"
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
| **Spec Folder** | 002-state-dir-read-check |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A relaunch record behind a symlinked or foreign-owned state directory now reads as no record, so it can no longer approve a hop or name a note. `consume` also refuses a `handoff` path outside the repository's handoffs directory before it reads the file. The write path already had this check, and the read path now shares it.

### Phase 2: state-dir-read-check

Before this phase only the write path checked that the state directory was a real directory owned by you. Every read went straight to the file, so anyone who could replace the directory with a symlink could plant a record that `should-relaunch` approved. `consume` then read whatever file the record named.

One helper, `inspectStateDir`, now answers for both paths. A directory that exists and fails the check reads as empty, and you see one line on stderr that names it. `consume` takes no lock and removes nothing there. A missing directory still reads as empty without the line. The nudge state file goes through the same check, which the review of this phase added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Adds `inspectStateDir`, has `ensureStateDir` and `readRelaunchFile` call it, and exports it |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `consume` skips an unsafe state directory and passes `record.handoff` through `handoffPathWithinRepo`, logging `handoff-outside-dropped` |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | `readStateFile` returns its empty state for an unsafe state directory |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modified | Adds the symlinked-directory, foreign-owner and missing-directory read case |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Adds the symlinked-directory case for `should-relaunch` and `consume` and the outside-handoff case, and creates the handoffs directory in one existing case |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Adds the symlinked-directory nudge state case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built the change through `codex exec` in two passes, each test first, and the orchestrator reran every command outside the builder's sandbox, which blocks `ps`. Both adversarial cases failed before the fix: `scratch/red.txt` records 3 tests, 0 pass and 3 fail, with a symlinked record read back, a hop approved behind a symlinked directory and a handoff outside the handoffs directory read and printed. SWE reviewed the diff read-only through Devin and returned PASS with three P2. The nudge state reader and the two comment gaps were fixed in the second pass, with `scratch/red-2.txt` (1 test, 1 fail). The third P2, a lock directory created inside an unsafe state directory, moved to phase 006, which reworks `withAppendLock`. The final runs are `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One helper answers for the read and the write path | Two copies of the check would drift, and the write path keeps creating the directory while the read path never does |
| The refusal goes to stderr, not to the hook log | The hook log lives in the directory that failed the check, so it cannot be appended there |
| A missing directory reads as empty without a message | A first run has no state directory yet, and that is not a fault |
| `consume` drops a rejected handoff and still removes the record | The record is spent either way, and the wrapper declines the hop because the note state reads as missing |
| A handoff in a missing handoffs directory is dropped too | The containment helper rejects it, and the wrapper already declines a hop whose note is missing |
| The nudge state reader joined the phase | The review found it reads the same directory without the check, and the packet objective covers every read of that directory this phase can reach |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on `relaunch-core.test.cjs`, `session-relaunch-cli.test.cjs` and `nudge.test.cjs` | PASS: 369 tests, 369 pass, 0 fail, exit 0, in `scratch/green.txt` |
| The three new cases before the fix | FAIL as required: 3 tests, 0 pass, 3 fail in `scratch/red.txt`, and the nudge case 1 fail in `scratch/red-2.txt` |
| `node --check` on `relaunch-core.cjs`, `session-relaunch.cjs` and `nudge.cjs` | PASS: exit 0 |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 831 tests, 831 pass, 0 fail, exit 0, in `scratch/green-full.txt` (827 after phase 001) |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass, 0 fail, exit 0, in `scratch/green-opencode.txt` |
| Pi vitest suite | PASS: 59 passed, exit 0 |
| SWE review through Devin, read-only | PASS with three P2: two fixed here, one moved to phase 006 |
| Second SWE review through Devin, read-only, on the later passes | One P2 on this phase's nudge state reader: the directory check sat outside its `try`, so a runtime directory that is a regular file made it throw. Fixed in the second review pass of phase 004, with `004-claude-window-unknown/scratch/red-3.txt` |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Other files in the state directory are still read without the check.** The hop history file and the kill lock files live in the same directory and are read directly. Neither can approve a hop or name a note. They were outside the finding and stay as they are.
2. **A lock directory can still appear inside an unsafe state directory.** `withAppendLock` creates its lock before the callback's own check refuses. Phase 006 changes that function and carries the fix.
3. **The log entry name is the same for an outside path and a missing handoffs directory.** Both are logged as `handoff-outside-dropped`, because the containment helper rejects both and `consume` does not tell them apart.
<!-- /ANCHOR:limitations -->

---


