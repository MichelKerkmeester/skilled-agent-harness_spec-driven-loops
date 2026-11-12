---
title: "Implementation Summary: Claude's fill is measured only against a known window"
description: "The Claude window resolver now returns no window when no setting and no model marker names one, the nudge stays quiet for that session and logs the skip once, and a window command shown by /doctor:setup names the two settings that supply a window."
trigger_phrases:
  - "claude window unknown implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/004-claude-window-unknown"
    last_updated_at: "2026-11-12T12:39:36Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase after one correction pass and an SWE review"
    next_safe_action: "Verify nothing; phase closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/context-usage.cjs"
      - ".skilled/hooks/session-relaunch/claude/context-nudge.mjs"
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/commands/doctor/assets/doctor-setup.yaml"
    session_dedup:
      fingerprint: "sha256:c70be382a8f2f7b5d92a14d03995310c0b204603954112edc5f7223f09f13e32"
      session_id: "scaffold-004-claude-window-unknown"
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
| **Spec Folder** | 004-claude-window-unknown |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude session whose window nobody configured is no longer measured against an assumed 200,000 tokens. The resolver returns no window, the nudge stays quiet, and the log records the skip once for that session. `/doctor:setup` now shows the window the nudge measures against, or the two settings that supply one.

### Phase 4: claude-window-unknown

Before this phase a session without `autoCompactWindow`, without `SESSION_RELAUNCH_WINDOW_TOKENS` and without a `[1m]` model name was measured against 200,000 tokens. A session with a larger real window was then nudged far too early. You could not see which window was in use.

The resolver now answers `null` for that case and the hook treats it as unknown. Auto-compaction stays the fallback for such a session. To get the nudge back, set `autoCompactWindow` in the Claude settings or `SESSION_RELAUNCH_WINDOW_TOKENS` in the environment. `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs window` prints the window in use or names both settings, and `/doctor:setup` shows that line. The README row now says the variable is read from the environment only, which the old row did not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | `resolveWindow` returns `null` instead of the 200,000-token default, and the default constant is gone |
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Modified | Stays quiet on an unknown window and logs `context-nudge-skipped` with `reason=window-unknown` once per session |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Adds `markWindowUnknown`, which stores a mark in the session's nudge state file and answers true only on the call that writes it |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | Adds the `window` command, which prints the configured window or names both settings and rejects any argument with exit 2 |
| `.skilled/hooks/session-relaunch/README.md` | Modified | The window row states the environment-only source and the unknown-window outcome, and the command paragraph names `window` |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modified | One informational step runs the `window` command after the last-session-hop step |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | The result block and its notes carry the Claude context window line |
| `.skilled/commands/doctor/setup.md` | Modified | One sentence names the window line |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modified | Adds the no-setting and no-marker case and turns three 200,000 expectations into `null` |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Adds the skipped-nudge case and the once-per-session case |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Adds the `markWindowUnknown` case |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Adds the two `window` cases and the command name in the unknown-subcommand list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna built the change through `codex exec` in two passes, each test first, and the orchestrator reran every command outside the builder's sandbox, which blocks `ps`. The four new cases failed before the fix: `scratch/red.txt` records 4 tests, 0 pass and 4 fail. The orchestrator wired the `window` command into the three `/doctor:setup` files and added the two why-comments. SWE reviewed the diff read-only through Devin and returned CONDITIONAL with one P1 and two P2. The P1 was that the skip line was appended on every tool call to a log with no size bound, which the orchestrator had also found by reading the hook. All three were fixed in the second pass, with `scratch/red-2.txt` (5 tests, 3 fail). The final runs are `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree` on branch `worktrees/351-session-relaunch-review-remediation`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An unknown window stays quiet instead of guessing a size | A fill measured against a guessed size nudges at the wrong moment, and auto-compaction still protects the session |
| The doctor hint is a `window` command in the relaunch CLI | `/doctor:setup` already shows the last session hop from that CLI, so one more informational step needed no new script |
| The skip is logged once per session | The hook runs on every tool call and `relaunch.log` has no size bound, so a line per call would grow it without limit |
| The once-per-session mark lives in the nudge state file | That file already exists per session, so no new file type was needed, and any later state write may drop the mark at the cost of one more line |
| The unconfigured line says `none configured` | The command has no model name, so on a `[1m]` model the word unknown would be wrong while the nudge still runs against one million tokens |
| The Pi and OpenCode window readers stay as they are | Both read the window from their runtime and never used the Claude default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on `context-usage.test.cjs`, `claude-adapters.test.cjs`, `session-relaunch-cli.test.cjs` and `nudge.test.cjs` | PASS: 318 tests, 318 pass, 0 fail, exit 0, in `scratch/green.txt` |
| The new cases before each fix | FAIL as required: 4 tests, 4 fail in `scratch/red.txt`, and 5 tests, 3 fail in `scratch/red-2.txt` |
| `node --check` on `context-usage.cjs`, `nudge.cjs`, `session-relaunch.cjs` and `context-nudge.mjs` | PASS: each exit 0 |
| `session-relaunch.cjs window` in an empty directory with an empty home | PASS: one line naming `autoCompactWindow` and `SESSION_RELAUNCH_WINDOW_TOKENS`, exit 0. With the variable set to 500000 it prints `Claude context window: 500000 tokens`. With an argument it exits 2 |
| `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: 852 tests, 852 pass, 0 fail, exit 0, in `scratch/green-full.txt` (846 after phase 003) |
| `node --test .opencode/plugins/tests/session-relaunch.test.cjs` | PASS: 65 tests, 65 pass, 0 fail, exit 0, in `scratch/green-opencode.txt` |
| Pi vitest suite | PASS: 59 passed, exit 0 |
| Doctor files | PASS: `doctor-setup.yaml` parses, `rg -c 'session-relaunch.cjs window'` prints 1, and `doctor-setup-orphan-line.test.cjs` passes 1 of 1 |
| SWE review through Devin, read-only | CONDITIONAL with one P1 and two P2, all three fixed in the second pass |
| Second SWE review through Devin, read-only, on the later passes | PASS with two P2 on `lib/nudge.cjs`, both confirmed and fixed. A later state write erased the unknown-window mark, and the state reader threw `ENOTDIR` when the runtime directory is a regular file, where the unchanged checkout reads level 0. `scratch/red-3.txt` records 75 tests, 73 pass, 2 fail, and the file then ran 75 of 75 |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A session on a 200,000-token model with no setting gets no nudge.** This is the intended trade. Set `autoCompactWindow` or `SESSION_RELAUNCH_WINDOW_TOKENS` to turn the nudge on for it. `/doctor:setup` names both.
2. **The `window` command cannot see the session's model.** On a `[1m]` model with nothing configured it prints `none configured`, and its last sentence says such a model uses one million tokens.
3. **Each session with an unknown window leaves one small nudge state file.** The mark is written to `nudge-<session>.json` in the per-user state directory, where before only a nudged session had that file.
4. **The mark is written without a lock.** `markWindowUnknown` reads the state file and writes it back. A withdraw that lands between the two can lose its re-arm grant for that session. The second review named it. It stays, because no nudge state write takes a lock.
<!-- /ANCHOR:limitations -->

---


