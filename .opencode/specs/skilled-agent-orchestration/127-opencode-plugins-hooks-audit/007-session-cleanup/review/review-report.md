# Plugin Audit Review - session-cleanup

> **Iteration 2 cross-check (Opus 4.8):** 10 iteration-1 findings adjudicated (2 adjusted, 7 confirmed, 1 uncertain); 7 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

Three P1 issues undermine lifecycle cleanup: Claude invokes it at every response Stop rather than session teardown, OpenCode supplies no OpenCode session identity, and parent-first termination can let nested helpers escape. Additional P2 issues affect event compatibility, failure observability, git-hook guard accuracy, SessionStart parity, and log retention.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/session-cleanup.js` (Session-end MCP cleanup plugin) |
| Claude hook counterpart | .claude/settings.json, .opencode/scripts/session-cleanup.sh, .opencode/bin/worktree-guard.sh, .opencode/bin/check-git-hooks.sh |
| Verdict | REFINE |
| Findings | 0 P0 / 3 P1 / 6 P2 / 1 refinement (10 total) |

**Parity assessment:** Parity is poor. Both surfaces call the same shell script, but OpenCode invokes it at disposal without supplying an OpenCode identity, while Claude invokes it from a per-response Stop hook with a 10-second asynchronous budget versus OpenCode's synchronous 8-second budget. Claude alone wires the two SessionStart guards.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | parity | `.claude/settings.json:72` | Claude Stop runs process cleanup after each response, not only at session teardown | high |
| F2 | P1 | parity | `.opencode/plugins/session-cleanup.js:54` | OpenCode cleanup has no OpenCode session PID and is normally a no-op | high |
| F3 | P1 | bug | `.opencode/scripts/session-cleanup.sh:52` | Parent-first termination can reparent nested helpers before they are killed | high |
| F4 | P2 | bug | `.opencode/plugins/session-cleanup.js:47` | Claimed raw lifecycle-event compatibility does not read the raw event type | med |
| F5 | P2 | error | `.opencode/plugins/session-cleanup.js:53` | Subprocess failures and timeouts are silently discarded | high |
| F6 | P2 | bug | `.opencode/bin/check-git-hooks.sh:30` | Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath | high |
| F7 | P2 | bug | `.opencode/bin/check-git-hooks.sh:41` | Any symlink is accepted even when broken or pointed at the wrong hook | high |
| F8 | P2 | parity | `.claude/settings.json:50` | OpenCode has no counterpart for the Claude SessionStart safety guards | high |
| F9 | P2 | refinement | `.opencode/scripts/session-cleanup.sh:33` | Session cleanup log grows without a retention bound | high |
| F10 | refinement | refinement | `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43` | Tests cover only the no-PID fallback, not plugin lifecycle or process termination | high |

## Finding Detail

### F1 - Claude Stop runs process cleanup after each response, not only at session teardown
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.claude/settings.json:72`
- **Evidence:** The Stop hook at lines 72-80 invokes session-cleanup.sh. Claude Code Stop fires when the main agent finishes a response, while the OpenCode counterpart waits for server.instance.disposed/global.disposed; session-cleanup.sh lines 133-147 then SIGTERMs matching MCP descendants that the still-running Claude session may need on its next turn.
- **Impact:** MCP launchers and servers can be terminated between prompts in an otherwise live Claude session, causing transport reconnections, lost state, or intermittent failures. This is materially different from OpenCode's teardown-only behavior.
- **Proposed fix:** Remove process cleanup from the per-response Stop chain. Invoke it from a true session-exit hook if supported, or from the Claude launcher/wrapper using an exit trap; keep any genuinely per-response session-stop.js behavior separate.

### F2 - OpenCode cleanup has no OpenCode session PID and is normally a no-op
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/plugins/session-cleanup.js:54`
- **Evidence:** The plugin invokes the shared script without supplying an environment override. The script reads only CLAUDE_SESSION_PID at line 14 and, when it is absent, exits through the default-off fallback at lines 121-123. If OpenCode inherits a CLAUDE_SESSION_PID from an enclosing Claude process, the identity describes that outer Claude tree rather than the OpenCode session.
- **Impact:** Standalone OpenCode disposal does not perform session-scoped cleanup. Nested OpenCode execution can instead inspect and terminate matching descendants belonging to the enclosing Claude session.
- **Proposed fix:** Introduce a runtime-neutral cleanup PID input and have the plugin pass an API-derived OpenCode session/server root PID explicitly. Preserve CLAUDE_SESSION_PID only as the Claude-side compatibility input, with numeric and ownership validation.

### F3 - Parent-first termination can reparent nested helpers before they are killed
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/scripts/session-cleanup.sh:52`
- **Evidence:** append_descendants records each child before recursively recording its descendants at lines 52-55. The kill loop consumes that same order at lines 133-147. If a matched wrapper or launcher exits after its SIGTERM, its matched child can be reparented before the child's ancestry check, causing lines 138-140 to skip it as no longer descended from the session.
- **Impact:** Nested MCP servers can survive cleanup nondeterministically as orphans, especially when both a wrapper/launcher and its server command match is_target_command.
- **Proposed fix:** Terminate the captured process tree deepest-first, such as by iterating the descendants array in reverse. Preserve the live ancestry and process-identity checks before every signal.

### F4 - Claimed raw lifecycle-event compatibility does not read the raw event type
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/plugins/session-cleanup.js:47`
- **Evidence:** The comment at line 48 says some builds pass a raw event, but eventType at line 50 checks only the destructured event.type or input.event.type. A raw payload shaped as {type: "global.disposed"} has neither and is ignored.
- **Impact:** Cleanup silently fails on the raw event shape the plugin explicitly intends to support; a null or non-object argument can also fail during parameter destructuring before the guard runs.
- **Proposed fix:** Accept an undecorated input parameter with a safe default and normalize using input.event?.type ?? input.type before testing lifecycle values.

### F5 - Subprocess failures and timeouts are silently discarded
- **Severity / Category / Confidence:** P2 / error / high
- **Location:** `.opencode/plugins/session-cleanup.js:53`
- **Evidence:** spawnSync's return value is ignored at lines 54-57. Operational failures, nonzero exits, signals, and timeout errors are normally reported in the returned object rather than thrown, so the catch at lines 58-60 does not observe most failures.
- **Impact:** Missing scripts, unavailable bash, timeout termination, and cleanup failures are indistinguishable from successful cleanup, preventing diagnosis of leaked helpers.
- **Proposed fix:** Inspect result.error, result.status, and result.signal. Record failures in a bounded append-only debug log or plugin status state without writing to OpenCode stdout/stderr, while retaining fail-open teardown behavior.

### F6 - Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/bin/check-git-hooks.sh:30`
- **Evidence:** hook_target_dir is constructed as $repo_root/.git/hooks. In a linked worktree, $repo_root/.git is a file pointing into the common Git directory; repositories using core.hooksPath also do not install hooks at this hardcoded location.
- **Impact:** Linked-worktree sessions can receive false missing-hook warnings, while hooks installed in a configured custom directory are incorrectly reported absent.
- **Proposed fix:** Resolve the active hook directory with git rev-parse --git-path hooks, accounting for relative output, instead of deriving it from the worktree root.

### F7 - Any symlink is accepted even when broken or pointed at the wrong hook
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/bin/check-git-hooks.sh:41`
- **Evidence:** The guard only tests ! -L "$target". It never verifies that the symlink resolves, targets the corresponding versioned hook, or is executable, despite the file header describing a matching symlink check.
- **Impact:** A stale, broken, or misdirected symlink suppresses the warning even though the Git hook will not execute the intended repository script.
- **Proposed fix:** Resolve both the target symlink and expected source to canonical paths, compare them, and verify the resolved hook is executable; report mismatched and broken links alongside missing links.

### F8 - OpenCode has no counterpart for the Claude SessionStart safety guards
- **Severity / Category / Confidence:** P2 / parity / high
- **Location:** `.claude/settings.json:50`
- **Evidence:** Claude SessionStart invokes worktree-guard.sh and check-git-hooks.sh at lines 59-67. The reviewed OpenCode session-cleanup plugin exposes only a disposal event at lines 44-63, and no invocation of either guard exists in the OpenCode plugin directory.
- **Impact:** OpenCode sessions receive neither the shared-main-worktree collision warning nor the missing Git-hook warning, so the two runtime surfaces are behaviorally inconsistent at startup.
- **Proposed fix:** Add an OpenCode session.created counterpart that runs both guards with captured output, then surfaces warnings through system-context injection or a bounded log rather than writing directly to the TUI.

### F9 - Session cleanup log grows without a retention bound
- **Severity / Category / Confidence:** P2 / refinement / high
- **Location:** `.opencode/scripts/session-cleanup.sh:33`
- **Evidence:** emit appends every message to the default log selected at line 15, but the script has no size check or rotation. The related orphan-mcp-sweeper.sh implements a configurable maximum and rotation at lines 124-137.
- **Impact:** Repeated Stop/disposal events and per-process command logging can grow claude-stop-hook.log indefinitely.
- **Proposed fix:** Apply a configurable byte cap and bounded rotation before appending, reusing the retention pattern from orphan-mcp-sweeper.sh.

### F10 - Tests cover only the no-PID fallback, not plugin lifecycle or process termination
- **Severity / Category / Confidence:** refinement / refinement / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43`
- **Evidence:** The focused shell test at lines 43-67 forces CLAUDE_SESSION_PID to empty and validates only fallback mode selection. The other reviewed session-cleanup.vitest.ts tests database session-manager cleanup, not this plugin or shell process tree.
- **Impact:** Raw event handling, OpenCode identity propagation, valid-PID traversal, parent/child kill ordering, timeout reporting, and Claude/OpenCode lifecycle parity can regress without detection.
- **Proposed fix:** Add plugin tests with stubbed spawnSync for wrapped and raw events, plus isolated shell process-tree tests covering valid identity, deepest-first termination, reparenting, and bounded timeout/failure behavior.

## Files Reviewed

- `.opencode/plugins/session-cleanup.js`
- `.opencode/scripts/session-cleanup.sh`
- `.opencode/bin/worktree-guard.sh`
- `.opencode/bin/check-git-hooks.sh`
- `.claude/settings.json`
- `.opencode/skills/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts`
- `.opencode/scripts/orphan-mcp-sweeper.sh`
- `.opencode/plugins/mk-spec-memory.js`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts`
- `opencode.json`
