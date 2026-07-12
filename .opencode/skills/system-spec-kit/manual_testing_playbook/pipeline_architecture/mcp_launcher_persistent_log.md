---
title: "422 -- MCP Launcher Persistent Log"
description: "Manual check for the automated-test-backed launcher logging path that persists each launcher line to a durable file and rotates it once it grows past the configured size."
version: 3.6.0.2
---

# 422 -- MCP Launcher Persistent Log

## 1. OVERVIEW

This scenario verifies that the mk-spec-memory launcher writes its log lines to a persistent file instead of letting them vanish with the parent process, and that it rotates that file once it crosses the configured size cap. Without a durable launcher log, debugging daemon flap, relaunch decisions, and owner-disposal events after the fact was nearly impossible, because the only record lived in a transient parent's stderr.

The check is automated-test-backed. A human runs the launcher syntax check, the persistent-log unit suite, and a grep that proves the persist and rotation helpers are defined and wired into the log path. Together they confirm the launcher both appends each line and trims the file when it grows too large.

## 2. SCENARIO CONTRACT

- Objective: Confirm the launcher persists every log line to a durable file and rotates that file once it exceeds the configured maximum size.
- Real user request: `I keep losing the launcher logs when a session ends, so I can't tell why the daemon flapped. Is the launcher writing a real log file now, and does it stay a sane size?`
- Prompt: `Validate the mk-spec-memory launcher persistent log path and confirm log lines persist and rotation triggers past the size cap.`
- Expected execution process: Run the launcher syntax check, run the persistent-log unit tests, and grep for the persist and rotation helpers to confirm they are defined and called on the logging path.
- Expected signals: `node --check` exits cleanly for the launcher. `launcher-persistent-log.vitest.ts` passes including the append and rotation cases. `persistLauncherLogLine` and `shouldRotateLauncherLog` appear at their definitions and at the logging call site.
- Desired user-visible outcome: Launcher activity survives session end in a bounded, durable log that an operator can read to explain relaunch and disposal behavior.
- Pass/fail: PASS only when syntax, unit tests, and helper wiring all match expectations.

## 3. TEST EXECUTION

### Prompt

```text
Validate the mk-spec-memory launcher persistent log path and confirm log lines persist and rotation triggers past the size cap.
```

### Commands

1. `node --check .opencode/bin/mk-spec-memory-launcher.cjs`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-persistent-log.vitest.ts`
3. `rg -n "persistLauncherLogLine|shouldRotateLauncherLog" .opencode/bin/mk-spec-memory-launcher.cjs`

### Expected

- Command 1 exits with no syntax errors.
- Command 2 passes the persistent-log suite, including the line-append case and the size-based rotation case.
- Command 3 shows `persistLauncherLogLine` and `shouldRotateLauncherLog` at their definitions and at the logging call site that appends and conditionally rotates.

### Evidence

Shell transcript for all commands:

```text
$ node --check .opencode/bin/mk-spec-memory-launcher.cjs
[no stdout or stderr]
$ node --check .opencode/bin/mk-spec-memory-launcher.cjs; exit_code=$?; printf 'exit status: %s\n' "$exit_code"
exit status: 0

$ cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/launcher-persistent-log.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  15:06:38
   Duration  101ms (transform 17ms, setup 16ms, import 12ms, tests 4ms, environment 0ms)

$ rg -n "persistLauncherLogLine|shouldRotateLauncherLog" .opencode/bin/mk-spec-memory-launcher.cjs
129:  persistLauncherLogLine(`${new Date().toISOString()} [pid ${process.pid}] ${message}\n`);
163:function shouldRotateLauncherLog(currentSizeBytes, maxBytes) {
166:function persistLauncherLogLine(line) {
173:      if (shouldRotateLauncherLog(size, launcherLogMaxBytes())) {
1851:  persistLauncherLogLine,
1853:  shouldRotateLauncherLog,
```

### Pass / Fail

- **PASS**: the syntax check exited 0, the persistent-log suite passed with 9 tests, and the grep output shows both helpers at definitions plus the logging call path.

### Failure Triage

If the syntax check fails, inspect the helper placement and the CommonJS exports first. If the append case fails, confirm the launcher writes each line to the persistent file rather than only to stderr. If the rotation case fails, compare the size check in `shouldRotateLauncherLog` against the configured maximum and confirm the rotate branch runs when the file exceeds it. If grep cannot find the helpers, confirm both the definitions and the logging call site exist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/pipeline_architecture/mcp_launcher_persistent_log.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Primary implementation anchor |
| `mcp_server/tests/launcher-persistent-log.vitest.ts` | Regression or validation anchor |

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 422
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `pipeline_architecture/mcp_launcher_persistent_log.md`
