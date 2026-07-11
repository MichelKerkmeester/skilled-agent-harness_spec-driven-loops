---
title: "PLG-011 -- Session Cleanup Plugin"
description: "Manual scenario validating the session-cleanup OpenCode plugin startup guard and teardown sweep"
trigger_phrases:
  - "plg-001"
  - "session-cleanup plugin"
  - "session cleanup"
  - "opencode plugin dispose"
  - "startup guard warnings"
  - "session teardown sweep"
version: 1.0.0.0
---

# PLG-011 -- Session Cleanup Plugin

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`.opencode/plugins/session-cleanup.js` is an OpenCode plugin that runs bounded startup guards
on `session.created` and a session-scoped teardown sweep on `dispose()`, without ever writing
directly into the OpenCode TUI. On `session.created` it shells out (via `spawnSync`, bounded to
an 8 second timeout) to `.opencode/bin/worktree-guard.sh` and `.opencode/bin/check-git-hooks.sh`,
captures their combined stdout/stderr (bounded to 4096 bytes), and stores it keyed by session id.
It surfaces that captured warning exactly once, into the model's own context, through the
`experimental.chat.system.transform` hook rather than any direct TUI write. On `dispose()` it
shells out once to `.opencode/scripts/session-cleanup.sh`, always forcing
`SESSION_CLEANUP_PID=''`, `CLAUDE_SESSION_PID=''`, and `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=off` --
deliberately refusing to treat the OpenCode server's own PID as session ownership, since a
workspace-scoped server PID is not proof a given session owns a given descendant process tree.
It is the OpenCode-side analog of Claude Code's SessionStart/SessionEnd hook pair, and it calls
the exact same `.opencode/scripts/session-cleanup.sh` script that Claude Code's `SessionEnd` hook
invokes directly (see `.claude/settings.json`).

This scenario validates: (a) the plugin's own Node unit test suite passes for real against the
live source files, (b) a live invocation of the plugin factory reproduces the documented
startup-guard injection and dispose behavior end-to-end against the real repo scripts (not
mocked stand-ins), and (c) the Claude Code `SessionEnd` hook wiring in `.claude/settings.json`
targets the same underlying cleanup script the plugin's `dispose()` calls.

---

## 2. SCENARIO CONTRACT

- Preconditions:
  - Plugin file exists at `.opencode/plugins/session-cleanup.js` (198 lines).
  - Test file exists at `.opencode/plugins/tests/session-cleanup.test.cjs` (388 lines, `node:test`).
  - Shared shell scripts exist: `.opencode/scripts/session-cleanup.sh` (186 lines),
    `.opencode/bin/worktree-guard.sh` (41 lines), `.opencode/bin/check-git-hooks.sh` (97 lines).
  - Node supports the built-in `node:test` runner (verified on Node v22.23.1 in this run).
- Real user-facing trigger: OpenCode fires the `session.created` event when a new session starts
  and calls the plugin's returned `dispose()` hook when the session/server instance tears down;
  Claude Code fires its `SessionEnd` hook, wired in `.claude/settings.json` to run
  `bash .opencode/scripts/session-cleanup.sh || true` directly (no plugin layer on that side).
- Expected signals:
  - Unit suite: `# tests 13`, `# suites 3`, `# pass 13`, `# fail 0` from `node --test`.
  - Live event: `experimental.chat.system.transform` output contains
    `[session-cleanup] Startup safety warnings:` followed by the real `worktree-guard.sh` warning
    line when running on a shared (non-worktree) checkout branch.
  - Live dispose: `.opencode/scripts/session-cleanup.sh` emits `action=skip reason=no-session-pid`
    when invoked with the plugin's forced-empty session-PID env, and exits `0`.
  - Idempotency: a second `dispose()` call on the same plugin instance makes no further
    `spawnSync` call (unit-tested via call-count assertion; observed live as no additional
    cleanup-log line).
  - A second `experimental.chat.system.transform` call for the same session id returns an empty
    `system` array (the captured warning is consumed exactly once).
- Pass/fail definition: PASS if the unit suite is 100% green AND the live invocation reproduces
  the documented startup-guard injection plus the safe no-op dispose path with real subprocess
  output. FAIL if any unit test fails, if `dispose()` ever supplies a nonempty session PID derived
  from `process.pid`, or if the plugin writes into the OpenCode TUI/chat message stream directly
  instead of only through `experimental.chat.system.transform`.

---

## 3. TEST EXECUTION

### Commands

1. Run the plugin's Node unit test suite:

```bash
node --test .opencode/plugins/tests/session-cleanup.test.cjs
```

Expected: `# tests 13`, `# suites 3`, `# pass 13`, `# fail 0`.

2. Exercise the real plugin factory end-to-end (`session.created` -> injection preview ->
   `session.deleted` -> `dispose()` -> repeat `dispose()`), scoping the cleanup log to a scratch
   path and never supplying a real session PID:

```bash
cat > /tmp/live-session-cleanup.mjs <<'EOF'
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const REPO_ROOT = process.cwd();
const PLUGIN_PATH = resolve(REPO_ROOT, '.opencode/plugins/session-cleanup.js');
const plugin = (await import(pathToFileURL(PLUGIN_PATH).href)).default;

const hooks = await plugin({ directory: REPO_ROOT });

console.log('--- session.created event (real worktree-guard.sh + check-git-hooks.sh) ---');
await hooks.event({ event: { type: 'session.created', properties: { info: { id: 'live-demo-session' } } } });

console.log('--- experimental.chat.system.transform (injection preview) ---');
const output = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'live-demo-session' }, output);
console.log(JSON.stringify(output, null, 2));

console.log('--- second transform call for same session (must be empty: injected once) ---');
const output2 = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'live-demo-session' }, output2);
console.log(JSON.stringify(output2, null, 2));

console.log('--- session.deleted event (clears in-memory state) ---');
await hooks.event({ event: { type: 'session.deleted', properties: { info: { id: 'live-demo-session' } } } });

console.log('--- dispose() (real session-cleanup.sh, forced no-session-pid safe path) ---');
await hooks.dispose();

console.log('--- second dispose() call (must be idempotent no-op) ---');
await hooks.dispose();

console.log('DONE');
EOF
SESSION_CLEANUP_LOG_PATH=/tmp/session-cleanup-live.log node /tmp/live-session-cleanup.mjs
```

Expected: the injection preview contains `[session-cleanup] Startup safety warnings:` and the
real `[worktree-guard] ...` line; the second transform call for the same session id returns an
empty `system` array; the scratch log file contains `action=skip reason=no-session-pid` after
`dispose()`.

3. Confirm the Claude Code `SessionEnd` wiring calls the same script the plugin's `dispose()`
   calls:

```bash
grep -n "session-cleanup.sh" .claude/settings.json
```

Expected: the `SessionEnd` hook command is `bash .opencode/scripts/session-cleanup.sh || true`,
matching `CLEANUP_SCRIPT` in the plugin source (`join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh')`).

### Env-Flip Checks (kill switches and overrides)

- `SPECKIT_WORKTREE_GUARD=off` before step 2 -> the startup guard's `worktree-guard.sh` half
  prints nothing; if `check-git-hooks.sh` also has nothing to report, no `system` entry is pushed.
- `SPECKIT_GIT_HOOKS_GUARD=off` -> silences the `check-git-hooks.sh` half only.
- `SESSION_CLEANUP_LOG_PATH` / `CLAUDE_SESSION_CLEANUP_LOG_PATH` (first wins) -> redirects both
  the real script's own append log away from the default `~/.local/share/session-cleanup.log`.
- `SESSION_CLEANUP_LOG_MAX_BYTES` / `CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES` -> log rotation
  threshold (defaults to 10 MiB in both the plugin and the script); a non-positive-integer value
  falls back silently to the default.
- `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` -> irrelevant on the OpenCode plugin path since `dispose()`
  always forces it to `off`; it only affects a direct/manual invocation of
  `.opencode/scripts/session-cleanup.sh` with no session PID available, i.e. the Claude Code
  `SessionEnd` hook path or an ad hoc shell run.

---

## 4. EVIDENCE

Preconditions observed:

```text
.opencode/plugins/session-cleanup.js: 198 lines.
.opencode/plugins/tests/session-cleanup.test.cjs: 388 lines.
.opencode/scripts/session-cleanup.sh: 186 lines.
.opencode/bin/worktree-guard.sh: 41 lines.
.opencode/bin/check-git-hooks.sh: 97 lines.
node --version: v22.23.1
```

Command:

```bash
node --test .opencode/plugins/tests/session-cleanup.test.cjs
```

Real output (TAP, trimmed to per-suite summaries and the final tally; all 13 subtests ran `ok`):

```text
TAP version 13
# Subtest: session-cleanup plugin lifecycle
    ok 1 - uses canonical dispose once and keeps process signaling disabled
    ok 2 - runs captured startup guards and injects warnings once per session
    ok 3 - caps startup warning output before system-context injection
    ok 4 - records one bounded diagnostic for nonzero exit
    ok 5 - records one bounded diagnostic for launch error
    ok 6 - records one bounded diagnostic for signal exit
    1..6
ok 1 - session-cleanup plugin lifecycle
# Subtest: session-cleanup shell contracts
    ok 1 - prefers neutral configuration and terminates descendants deepest-first
    ok 2 - does not claim the workspace-scoped server pid as session ownership
    ok 3 - warns for every shared-checkout branch
    ok 4 - resolves the effective hooks path and rejects invalid symlinks
    ok 5 - all modified shell scripts pass bash syntax validation
    1..5
ok 2 - session-cleanup shell contracts
# Subtest: session-cleanup live process tree
    ok 1 - collects the live descendant tree and terminates it deepest-first
    ok 2 - never signals a reparented matched process outside the session subtree
    1..2
ok 3 - session-cleanup live process tree
1..3
# tests 13
# suites 3
# pass 13
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 811.480459
```

Live invocation command (real plugin factory, real `spawnSync`, no test overrides, log path
scoped to a scratch file):

```bash
SESSION_CLEANUP_LOG_PATH=/tmp/session-cleanup-live.log node /tmp/live-session-cleanup.mjs
```

Real captured stdout:

```text
--- session.created event (real worktree-guard.sh + check-git-hooks.sh) ---
--- experimental.chat.system.transform (injection preview) ---
{
  "system": [
    "[session-cleanup] Startup safety warnings:\n[worktree-guard] This top-level session is running on the shared 'skilled/v4.0.0.0' checkout, not an isolated worktree. Concurrent AI sessions here can collide (shared working tree + MCP databases). To isolate next time, launch via: bash .opencode/bin/worktree-session.sh <runtime>. (silence: SPECKIT_WORKTREE_GUARD=off)"
  ]
}
--- second transform call for same session (must be empty: injected once) ---
{
  "system": []
}
--- session.deleted event (clears in-memory state) ---
--- dispose() (real session-cleanup.sh, forced no-session-pid safe path) ---
--- second dispose() call (must be idempotent no-op) ---
DONE
```

Real content of `/tmp/session-cleanup-live.log` after the run (written by the real
`session-cleanup.sh`, invoked once by `dispose()`, taking the safe no-session-pid branch because
the plugin always forces `SESSION_CLEANUP_PID`/`CLAUDE_SESSION_PID` to `''`):

```text
2026-07-11T14:40:06+0200 action=skip reason=no-session-pid
```

The `check-git-hooks.sh` half of the startup guard produced no output in this run (no invalid
hook symlinks in this checkout), so only the `worktree-guard.sh` warning appears in the injected
text -- consistent with the plugin joining only non-empty guard outputs (`session-cleanup.js:144-151`).

Claude Code `SessionEnd` wiring command:

```bash
grep -n "session-cleanup.sh" .claude/settings.json
```

Real output:

```text
143:            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && bash .opencode/scripts/session-cleanup.sh || true'",
```

This is the same `.opencode/scripts/session-cleanup.sh` path the plugin's `runCleanup()` resolves
to via `CLEANUP_SCRIPT = join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh')`
(`session-cleanup.js:30`), confirming both runtimes converge on one cleanup script.

---

## 5. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Plugin source: `.opencode/plugins/session-cleanup.js`
- Plugin unit test: `.opencode/plugins/tests/session-cleanup.test.cjs`
- Cleanup script (session-scoped descendant sweep): `.opencode/scripts/session-cleanup.sh`
- Startup guard (worktree isolation warning): `.opencode/bin/worktree-guard.sh`
- Startup guard (git hooks symlink integrity): `.opencode/bin/check-git-hooks.sh`
- Claude Code hook wiring: `.claude/settings.json` (`SessionEnd` hook)

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: PLG-011
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins-and-hooks/session-cleanup-plugin.md

---

## 7. PASS/FAIL

PASS

The plugin's Node unit test suite ran clean: `# tests 13`, `# suites 3`, `# pass 13`, `# fail 0`,
`# cancelled 0`, covering lifecycle dispose-once behavior, captured startup-guard injection and
one-shot consumption, bounded warning truncation, bounded diagnostics on nonzero-exit/launch-error/
signal-exit, static shell contracts (neutral config, deepest-first kill order, no-`process.pid`
ownership claim, per-branch worktree warning, hook-symlink resolution, `bash -n` syntax validity),
and two live process-tree tests that spawn real process trees and confirm deepest-first
termination plus reparented-orphan non-interference. The separate live invocation reproduced the
documented behavior end-to-end against the real repo scripts (not mocked): the startup guard
correctly captured and injected the real `worktree-guard.sh` warning for this shared checkout
exactly once, the second `dispose()` call made no further subprocess call, and
`.opencode/scripts/session-cleanup.sh` took the safe no-session-pid branch and logged
`action=skip reason=no-session-pid`, exiting `0`. The Claude Code `SessionEnd` wiring in
`.claude/settings.json` was confirmed to target the identical `.opencode/scripts/session-cleanup.sh`
path the plugin's `dispose()` resolves to.
