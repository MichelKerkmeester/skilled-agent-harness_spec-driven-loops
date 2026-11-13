# Verified findings for phase 008-review-advisories

Source: `../review/review-report.md` in the parent packet, the deep review of 2026-11-13. This file is the brief for this phase. The work packages come first, then each finding they cover. All nine findings are P2. The phase is built as four work packages, one dispatch each, in the order A, B, C, D. No two packages share a file.

All test paths below are relative to `.skilled/hooks/session-relaunch/` unless they start with `.opencode/`.

## Work packages

### WP-A. Claude start claim names its own event (R1-P1-001)
- Files: `claude/compact-pointer.mjs`, `tests/claude-adapters.test.cjs`.
- Must fail first: a payload with `source: "startup"` and no `hook_event_name` gets its claim emitted with `hookEventName: "SessionStart"`. Today it is emitted as `PostToolUse`.
- Guard tests that must keep passing: the existing startup claim tests that send `hook_event_name: "SessionStart"`, and the compaction pointer tests.

### WP-B. Note guard and goal reason in the core (R1-P2-002, R1-P2-003)
- Files: `lib/relaunch-core.cjs`, `tests/relaunch-core.test.cjs`.
- Must fail first, test 1: `recordGoalPacket` on a note whose status is `claimed` returns `false` and leaves the file bytes unchanged. Today it rewrites the note.
- Must fail first, test 2: for a Claude session whose active goal entry has an empty condition, `resolveGoalPacketResult` returns an empty packet with the reason `the active goal has no text to match a packet by`. Today the reason is `the active goal names no packet this hand-over can find`.
- Guard tests that must keep passing: `recordGoalPacket` on an open note still writes and returns `true`, and the existing reason tests for zero matches and for several matches.

### WP-C. Nudge text hardening and hop count (R2-P2-001, R2-P2-002, R3-P2-001)
- Files: `lib/nudge.cjs`, `tests/nudge.test.cjs`.
- Must fail first, test 1: `handoffText` with a `sessionId` or a `cwd` that contains a line break prints exactly one `session_id:` line and exactly one `cwd:` line, and no line of the printed frontmatter starts with text taken from after the line break. Today the value is printed raw.
- Must fail first, test 2: `commandPrefix('node /x/cli.js; echo hi')` returns the whole value as one quoted argument after `node `. Today it is returned unquoted.
- Must fail first, test 3: `hopLimitReached({ SKILLED_LOOP_HOPS: 'abc' })` returns `true`. Today it returns `false`, so the nudge asks for a handoff that `prepare` then refuses.
- Guard tests that must keep passing: `commandPrefix(nudge.CLI_COMMAND)` returns `nudge.CLI_COMMAND` unchanged, `commandPrefix` with a plain path still returns `node '<path>'`, `hopLimitReached` with an unset or empty `SKILLED_LOOP_HOPS` returns `false` below the cap, and every existing `handoffText` test.

### WP-D. OpenCode cleanup, record path contract and README line (R2-P2-003, R1-P2-004, R3-P2-002)
- Files: `.opencode/plugins/opencode-goal.js`, `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`, `.skilled/hooks/session-relaunch/README.md`.
- Must fail first, test 1: when the hand-over bind throws during `session.created`, the packet variable `SESSION_RELAUNCH_GOAL_PACKET` is unset afterwards. Today the delete is skipped.
- Contract test, may pass at once: a goal bound through the plugin for one session id is found by `resolveGoalPacketResult` from `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` with `runtime: 'opencode'` and the same session id. This pins the two copies of the record path to each other.
- README: line 19 says Claude Code uses `SessionStart` after a compaction. Change that sentence so it names both uses: after a compaction, and at startup for the claim of a hop whose start prompt is the goal command. One sentence, no other README change.
- Guard tests that must keep passing: every existing test in `opencode-goal-lifecycle.test.cjs`.

## Findings

### R1-P1-001. Start claim event name comes from payload inference
- **Evidence.** `claimAfterGoalStart` in `claude/compact-pointer.mjs` emits through `payloadEventName(payload, { runtime: 'claude' })`. `payloadEventName` in `lib/relaunch-core.cjs` returns the payload's `hook_event_name`, and without one it infers `UserPromptSubmit` for a string `prompt` and `PostToolUse` otherwise.
- **Verdict.** P2 after the final check. Claude Code names the event on every hook payload, so the wrong name needs a payload that Claude does not send. The path is still unpinned and untested.
- **The fix.** `claimAfterGoalStart` is reached only for `source: "startup"`, which is a `SessionStart` field. Emit under the literal `SessionStart` there. Do not change `payloadEventName` and do not change the compaction emit.

### R1-P2-002. `recordGoalPacket` has no open-status guard
- **Evidence.** `recordGoalPacket` in `lib/relaunch-core.cjs` reads, parses and rewrites the note under `withAppendLock` without checking `frontmatter.status`. `claimHandoff`, `completeHandoff` and `supersedeClaimed` check the status inside the same lock.
- **Verdict.** Confirmed by reading the function.
- **The fix.** Inside the lock, return `false` without writing when `frontmatter.status` is not `open`.

### R1-P2-003. Empty goal text is reported as a missing packet
- **Evidence.** `claudeGoalPacketResult` in `lib/relaunch-core.cjs` derives `headline` from the goal entry's condition. With an empty headline no candidate can match, the headline search returns nothing, and the reason reads `the active goal names no packet this hand-over can find`.
- **The fix.** When the goal entry is active and `headline` is empty, return an empty packet with the reason `the active goal has no text to match a packet by`, before the candidate and headline searches.

### R1-P2-004. OpenCode record path is derived in two places
- **Evidence.** `goalRecordFor` in `lib/relaunch-core.cjs` builds `<state dir>/<sha256(session id)>.json` by hand for OpenCode. The plugin builds the same path in `.opencode/plugins/opencode-goal.js`. A change to one side resolves to no goal with no log line.
- **The fix.** No source change. A contract test binds through the plugin and reads through the relaunch core, so a drift fails a test.

### R2-P2-001. Session id and cwd reach the note template raw
- **Evidence.** `handoffText` in `lib/nudge.cjs` prints `session_id: ${sessionValue}` and `cwd: ${cwd}` into the frontmatter the model is told to write. A value with a line break adds a frontmatter line.
- **The fix.** In `handoffText`, remove every C0 control character and DEL from the session id and the cwd before they are printed. A value changed this way no longer matches the real session or folder, and `prepare` refuses that note.

### R2-P2-002. `commandPrefix` trusts any value starting with `node `
- **Evidence.** `commandPrefix` in `lib/nudge.cjs` returns a value matching `/^node\s/` unquoted. Its output is printed into text the model is told to run. Every caller in the repository passes a constant today.
- **The fix.** Return the value unchanged only when it is `node`, one run of spaces, and one argument that is either a single-quoted string without a quote inside or made only of letters, digits and `_ / . @ : + -`. Quote anything else as one path, as the last line of the function already does.

### R2-P2-003. OpenCode packet variable survives a throwing bind
- **Evidence.** The `session.created` branch in `.opencode/plugins/opencode-goal.js` awaits `bindRelaunchGoal` and then deletes `process.env[RELAUNCH_GOAL_PACKET_ENV]`. Nothing guards the delete. The Pi receiver deletes in `finally`.
- **Verdict.** Confirmed by reading the code. `bindRelaunchGoal` is documented as never throwing, so the reach is small.
- **The fix.** Put the bind in `try` and the delete in `finally`. The error still propagates as it does today.

### R3-P2-001. The nudge and `prepare` disagree on an invalid hop count
- **Evidence.** `hopLimitReached` in `lib/nudge.cjs` reads `SKILLED_LOOP_HOPS` through `switchNumber` with a fallback of 0. `prepare` in `bin/session-relaunch.cjs` exits 2 on a value that is not a non-negative integer.
- **The fix.** In `hopLimitReached`, a `SKILLED_LOOP_HOPS` that is set, not empty, and not a non-negative integer counts as the limit reached, so the nudge stays quiet. Do not merge the two parsers and do not edit `bin/session-relaunch.cjs`.

### R3-P2-002. README trigger summary omits the startup claim
- **Evidence.** `README.md` line 19 says Claude Code uses `SessionStart` after a compaction. The section "Goal In A Claude Receiver" of the same file documents the startup claim.
- **Verdict.** Confirmed by reading the line.
- **The fix.** One sentence, as the work package says.
