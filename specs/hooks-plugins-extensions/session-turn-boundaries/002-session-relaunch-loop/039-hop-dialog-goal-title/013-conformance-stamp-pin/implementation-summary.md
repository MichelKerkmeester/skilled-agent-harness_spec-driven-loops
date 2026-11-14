---
title: "Implementation Summary"
description: "The shared no-target conformance case now asserts the deferral stamp per runtime, so Claude dropping the stamp or Codex starting to stamp fails the suite."
trigger_phrases:
  - "conformance stamp pin implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin"
    last_updated_at: "2026-11-14T09:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Pinned the deferral stamp per runtime and saved the hole, three red runs and the green run"
    next_safe_action: "None. The commit is c69f278cfc with Commit-Id 0013980"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-conformance-stamp-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should Codex stamp its parked record? Not decided here. A later packet owns that change."
    answered_questions:
      - "Does the conformance suite fail when Claude stops stamping? Yes, after the helper change, proven by scratch/red-claude.txt."
      - "Does it fail when a runtime that should not stamp does? Yes, proven by scratch/red-unmarked.txt."
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
| **Spec Folder** | 013-conformance-stamp-pin |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared case `an arm leaves the record pending when no process below the loop is found` now states whether the runtime stamps the record. Claude must leave a `deferredAt` that parses as a time, and Codex must leave no `deferredAt` key. The rest of the record still equals the record before and no killer may be spawned.

### Phase 13: conformance-stamp-pin

Before this change `assertStillPending` removed `deferredAt` before its comparison for every runtime, so the case held no expectation about the stamp. Claude Stop writes it through `markParked` on the no-target path and Codex writes none. Either side could change and the suite stayed green.

The Claude entry of the adapter table now carries `stampsDeferred: true`, and the helper reads that mark instead of a runtime name. A runtime with the mark must leave a string stamp that `Date.parse` accepts. A runtime without it must leave no `deferredAt` key. Both branches still compare every other field with the record before and assert that no killer was spawned.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | Modified | Adds the `stampsDeferred` mark to the Claude entry, makes `assertStillPending` assert the stamp per runtime, and rewrites the comment above the helper |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change is to an assertion, so a new test cannot fail first in the usual way. The old helper was first shown blind to a removed Claude stamp in `scratch/hole.txt` with exit 0 and fail 0.

After the edit, three working-tree mutations each turned one case red, and each was reverted by editing the file back. Removing the `markParked` call at `claude/stop-arm.mjs:183` (`c69f278cfc`) failed the Claude case in `scratch/red-claude.txt` with exit 1. Setting the mark on the Codex entry failed the Codex case in `scratch/red-codex.txt` with exit 1. Taking the mark off the Claude entry failed the Claude case the other way in `scratch/red-unmarked.txt` with exit 1. With every mutation reverted, `scratch/green.txt` prints both cases passing with fail 0 and exit 0. The first failing run is saved in `scratch/red.txt`, with a note that an assertion change has no earlier red state.

The whole relaunch and OpenCode plugin suite ran last with `AI_SESSION_CHILD` and `OPENCODE_DB` unset. It printed tests 1550, pass 1550, fail 0, exit 0, saved to `scratch/suite.txt`, the same count as `scratch/baseline.txt`. The work is committed as `c69f278cfc` on 2026-11-14 with `Commit-Id` 0013980. It changes one file, and the orchestrator's own suite run gave 1550 of 1550, exit 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mark in the adapter table, not a runtime check in the helper | The table already holds each runtime's facts, so a later change to Codex is one mark and the helper stays generic |
| Assert a parseable time, never an exact value | The stamp comes from the clock, so an exact comparison would fail for a reason unrelated to the behavior |
| Assert the absence of the key for Codex | An empty string or an undefined value would pass a loose check while the record still carries a stamp field |
| Prove each branch by working-tree mutation | An assertion change cannot fail first, so each branch is shown red by the change it is meant to catch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `CASE` with the Claude stamp removed, old helper | PASS as the hole: tests 2, pass 2, fail 0, exit 0. `scratch/hole.txt` |
| `CASE` with the new helper and the Claude stamp removed | FAIL: exit 1, `✖ claude`, `AssertionError: a stamping runtime writes a string stamp`. `scratch/red.txt` and `scratch/red-claude.txt` |
| `CASE` with the mark set on Codex | FAIL: exit 1, `✖ codex`, `AssertionError: a stamping runtime writes a string stamp`. `scratch/red-codex.txt` |
| `CASE` with the mark taken off Claude | FAIL: exit 1, `✖ claude`, `AssertionError: a runtime that does not stamp adds no deferredAt key`. `scratch/red-unmarked.txt` |
| `CASE` with every mutation reverted | PASS: tests 2, pass 2, fail 0, exit 0, both cases `✔`. `scratch/green.txt` |
| `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` | PASS: tests 1550, pass 1550, fail 0, exit 0. `scratch/suite.txt`, the baseline count |
| `git diff --quiet HEAD -- .skilled/hooks/session-relaunch/claude .skilled/hooks/session-relaunch/codex .skilled/hooks/session-relaunch/lib` | PASS: exit 0, and `git status` lists only the test file under the test and source paths |
| `node --check .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` | PASS: exit 0 |
| Fix commit | `c69f278cfc` (`Commit-Id` 0013980) changes one file, `adapter-conformance.test.cjs`, with 15 insertions and 4 deletions |
| Orchestrator suite run | 1550 of 1550, exit 0 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | PASS: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex still does not stamp.** The case now pins that gap on purpose. Making Codex stamp belongs to a later packet, which changes the mark on one table entry.
2. **Commit-scoped proof landed after the build.** `git show --stat c69f278cfc` lists one file with 15 insertions and 4 deletions. The orchestrator's own suite run gave 1550 of 1550, exit 0.
3. **No live hop was run.** The tests drive the adapters in a sandbox, so a real Claude Stop that cannot arm was not exercised. The three Claude stamp tests in `claude-adapters.test.cjs` already cover that path.
<!-- /ANCHOR:limitations -->

---
