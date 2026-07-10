# Fix Design - session-cleanup (reconciled)

> Two independent, code-verified fix designs per finding: **GPT-5.6-Sol (high)** and **Opus 4.8 (high)**, each re-read the real code. **AGREE** = both designed a fix (high confidence). **DISPUTED** = one model judges the finding a non-issue - your call before implementing.

## Summary

17 findings - 15 both-agree, 2 disputed.

## Cross-model notes

- **GPT-5.6-Sol:** Ordering dependencies: implement O4 and O7 before activating F2/O1; move lifecycle wiring to Claude SessionEnd and OpenCode dispose next; then apply F3, F5/F9, and startup-guard parity. F4 is not a supported-runtime bug and should be resolved by deleting the false raw-event claim, not by adding compatibility code. O3 is intentional shared-daemon behavior and must not be 'fixed' by widening session cleanup or enabling global orphan reaping by default. O5 resolves to one valid event string, one unsupported string, and a better canonical dispose hook. The smallest coherent design keeps one shared session-scoped shell script, explicit runtime-owned PID inputs, bounded diagnostics, and distinct runtime presentation paths.
- **Opus 4.8:** SHARED ROOT CAUSES: (1) O1 is the umbrella for F1+F2 — the subsystem is fully dormant because the harness never sets CLAUDE_SESSION_PID and the orphan-sweep default is off; fix per-runtime (OpenCode=real process.pid, Claude=orphan-sweeper in SessionEnd). (2) A single env-naming refactor (O4) plus explicit plugin env (F2+O7) plus optional detached spawn (O2) plus result/log handling (F5) are ONE coherent plugin+script change — land O4's neutral read-order in the script FIRST, then the plugin env override. (3) F6+F7 are one edit to check-git-hooks.sh; O6 is one edit to worktree-guard.sh; both guards are shared and, once F8 wires them into OpenCode, a single fix covers both runtimes. ORDERING: O4 (script reads neutral var) → F2/O7 (plugin passes it); F1 (move to SessionEnd) → O1 (activate orphan-sweep in that same SessionEnd hook); O5 (verify OpenCode event names) is a precondition for both F8's startup event and confidence in the disposal literals. NON-ISSUE / BY-DESIGN: O3 is not a bug in session-cleanup — detached daemons are intentionally released to pid1 under daemon re-election and bounded by idle self-exit + orphan sweeper; the fix is documentation plus ensuring that bound is active, not changing the descendant walk. CAUTION: enabling the orphan sweeper live (O1) before confirming it won't reap an adopted/bridged released daemon (O3) is the one real regression risk in this set — stage it dry-run first. TUI safety holds throughout: spawnSync default stdio 'pipe' captures guard/script output into the result rather than the OpenCode TUI, so no stdout-corruption is introduced by F5/F8; the script's own emit() prints to stdout (sh:30) but is only ever run via captured spawn, not inherited stdio.

## Per-finding fix designs

### F1 [P1 (GPT P1 / Opus P2)] Claude Stop runs process cleanup after each response, not only at session teardown
`.claude/settings.json:72` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. .claude/settings.json:72-83 wires `bash .opencode/scripts/session-cleanup.sh` into the Stop hook, which Claude Code fires at the end of EVERY assistant response — not at session teardown. The OpenCode counterpart (session-cleanup.js:52) fires only on disposal. The plugin comment (js:31) reinforces the wrong mental model ('Claude's Stop hook' treated as the session-end equivalent). If ever activated with a real session PID, session-cleanup.sh:130-148 would SIGTERM the session's own still-needed MCP helper descendants after each turn, then they'd have to respawn for the next turn.
- Fix approach: Claude Code has a real SessionEnd hook (fires on clear/logout/exit) — that is the true parity to OpenCode disposal. Move ONLY the process-cleanup invocation to SessionEnd; leave the per-response speckit continuity hook (session-stop.js) in Stop where it belongs.
- Exact change: In .claude/settings.json: keep the `node .../session-stop.js` command in the Stop hook, but split the compound Stop command so `bash .opencode/scripts/session-cleanup.sh || true` is removed from Stop and placed in a new `SessionEnd` hook block (matcher "", same `cd $CLAUDE_PROJECT_DIR` wrapper, timeout ~10, no `async` needed since teardown). Also correct the plugin doc comment (js:31-35) so it no longer equates Claude Stop with session end.
- Acceptance: Trigger multiple responses in one Claude session: session-cleanup log shows NO cleanup entries per-response; only one cleanup entry appears when the session ends (clear/exit). session-stop.js still runs each response.
- Side effects / parity: OpenCode plugin already fires on disposal (correct) — only the comment needs the parity note. Confirm Claude Code version in use supports SessionEnd; if not, fall back to a launcher exit-trap wrapper that runs the script once. No other consumer invokes session-cleanup.sh.
- Test: Add a settings-schema/lint assertion (or manual playbook step) that session-cleanup.sh appears under SessionEnd and NOT under Stop; extend the shell test harness to assert the script is idempotent when invoked once at teardown.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.claude/settings.json:72-80` invokes `session-cleanup.sh` from `Stop`, while Claude Code defines `Stop` as a per-turn event and `SessionEnd` as the once-per-session termination event. The installed Claude Code 2.1.206 supports `SessionEnd`. Consequently `.opencode/scripts/session-cleanup.sh:133-147` can terminate helpers that the continuing session needs.
- Fix approach: Separate per-turn bookkeeping from process teardown. Keep `session-stop.js` on `Stop`; run process cleanup synchronously from `SessionEnd` while the Claude process and its descendant relationships still exist.
- Exact change: In `.claude/settings.json`, remove `bash .opencode/scripts/session-cleanup.sh` from the `Stop` command without removing `session-stop.js`. Add a `SessionEnd` hook invoking only `session-cleanup.sh`, with the existing bounded timeout and without `async:true`. Pair this with O1 so the hook receives `SESSION_CLEANUP_PID`.
- Acceptance: Two consecutive responses in one Claude session do not invoke process cleanup. Exiting, clearing, or otherwise terminating the session invokes it exactly once, before the Claude root exits.
- Side effects / parity: Requires Claude Code with `SessionEnd` support, satisfied by installed 2.1.206. OpenCode should use its plugin `dispose` hook, not emulate Claude `Stop`.
- Test: Add a hook-configuration test using marker scripts: two simulated `Stop` dispatches must call only `session-stop.js`; one `SessionEnd` dispatch must call cleanup once and propagate no cleanup failure into Claude shutdown.

---

### F2 [P1 (GPT P1 / Opus P2)] OpenCode cleanup has no OpenCode session PID and is normally a no-op
`.opencode/plugins/session-cleanup.js:54` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: confirmed. session-cleanup.js:54 calls spawnSync with no `env`; session-cleanup.sh:14 reads only CLAUDE_SESSION_PID; OpenCode never sets it, so the script hits the default-off fallback (sh:121-123) and no-ops. This is the OpenCode face of O1.
- Fix approach: The OpenCode plugin runs inside the OpenCode server process, which is the parent of the MCP helper children it spawns. So `process.pid` IS a valid, safe session-scoped root. Pass it explicitly via a runtime-neutral env var (see O4) that the script reads before the CLAUDE_* alias.
- Exact change: In session-cleanup.js spawnSync opts add `env: { ...process.env, SESSION_CLEANUP_PID: String(process.pid), CLAUDE_SESSION_PID: '' }` (blanking CLAUDE_SESSION_PID also fixes O7). In session-cleanup.sh:14 change to `SESSION_PID="${SESSION_CLEANUP_PID:-${CLAUDE_SESSION_PID:-}}"` (O4).
- Acceptance: Run an OpenCode session that spawns MCP helpers, then dispose: the cleanup log shows `action=start session_pid=<opencode pid> descendants=N` and `action=kill ...` for the session's helpers — not `action=skip reason=no-session-pid`.
- Side effects / parity: Requires the O4 neutral-var read to land in the script first (ordering dependency). Claude side keeps working via the CLAUDE_SESSION_PID alias. Verify OpenCode runs one server process per session (not a shared multiplexed server) so process.pid is a per-session root; if shared, scope to the session's own subtree instead.
- Test: Plugin unit test stubbing spawnSync to assert env carries SESSION_CLEANUP_PID===String(process.pid) and CLAUDE_SESSION_PID==='' on a disposal event; shell test asserting a non-empty SESSION_CLEANUP_PID drives descendant collection.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/plugins/session-cleanup.js:54-57` launches the shared script without an explicit PID environment, while `.opencode/scripts/session-cleanup.sh:14` reads only `CLAUDE_SESSION_PID` and `.opencode/scripts/session-cleanup.sh:121-123` exits through the default-off fallback when it is absent.
- Fix approach: Treat the OpenCode host process as the teardown root and pass its PID explicitly through the runtime-neutral input introduced by O4. Run cleanup from the canonical plugin `dispose` hook so the PID still owns its helpers.
- Exact change: Change the plugin factory to register `dispose`. Its cleanup runner must pass `{...process.env, SESSION_CLEANUP_PID:String(process.pid), CLAUDE_SESSION_PID:''}` and the neutral log path to `session-cleanup.sh`. Do not infer the PID from an event payload or ambient Claude variable.
- Acceptance: At OpenCode disposal, the script logs `session_pid=<OpenCode process.pid>`, reaches the descendant walk, terminates only matching descendants, and does not take the no-PID branch.
- Side effects / parity: Depends on O4's neutral variable and O7's environment sanitization. Claude continues through the compatibility alias or the launcher-provided neutral value.
- Test: Add a plugin integration test with an isolated descendant fixture and injected runner: assert the child environment contains the host PID, clears `CLAUDE_SESSION_PID`, and invokes cleanup once from `dispose`.

---

### F3 [P1 (GPT P1 / Opus P2)] Parent-first termination can reparent nested helpers before they are killed
`.opencode/scripts/session-cleanup.sh:52` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. append_descendants (sh:47-59) does pre-order DFS: it records `parent` (sh:53) before recursing into its children (sh:54). The kill loop consumes that same order (sh:134). SIGTERMing an intermediate wrapper before its child lets the child reparent to init; the pre-kill re-check is_descendant_of_session (sh:138) then correctly fails and the loop skip-kills the now-orphaned child (sh:139), leaking it.
- Fix approach: Terminate deepest-first. Because pre-order DFS always lists a parent before its descendants, iterating the descendants array in reverse guarantees every child is signalled before its parent, eliminating the reparent-before-kill window. Keep the identity re-check.
- Exact change: In session-cleanup.sh, change the kill loop (sh:134) from `for pid in "${descendants[@]}"` to iterate indices in reverse, e.g. `for ((i=${#descendants[@]}-1; i>=0; i--)); do pid="${descendants[i]}"; ...`. No change to is_target_command / is_descendant_of_session logic.
- Acceptance: Build a real 3-level process tree (root→wrapper→helper) rooted at a test SESSION_PID; run the script; assert the helper receives SIGTERM before the wrapper and no matched helper survives with ppid==1.
- Side effects / parity: None on Claude/OpenCode parity — single shared script. Reverse iteration is O(n) same cost.
- Test: Shell process-tree test asserting deepest-first kill order and zero surviving matched descendants after a wrapper exits mid-sweep.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/scripts/session-cleanup.sh:52-55` appends a child before recursively appending its descendants, and `.opencode/scripts/session-cleanup.sh:133-147` iterates that parent-first array. A terminated parent can reparent its children before their live ancestry checks.
- Fix approach: Keep the existing snapshot and per-signal identity checks, but consume the preorder array in reverse so deeper descendants receive SIGTERM before their ancestors.
- Exact change: Replace the forward PID loop at `.opencode/scripts/session-cleanup.sh:134` with a reverse index loop over `descendants`. Do not remove `is_target_command`, `is_descendant_of_session`, or the immediate command lookup.
- Acceptance: For a root -> matching launcher -> matching helper tree, the log records the helper's TERM before the launcher's TERM, and neither kill is skipped because the parent exited first.
- Side effects / parity: Shared automatically by Claude and OpenCode. Ordering changes only when multiple matching generations exist.
- Test: Extend the shell tests with a controlled nested process tree whose parent exits on TERM. Assert deepest-first signal markers and verify an unrelated sibling process remains alive.

---

### F4 [P2 (GPT P2 / Opus refinement)] Claimed raw lifecycle-event compatibility does not read the raw event type
`.opencode/plugins/session-cleanup.js:47` — **Status: DISPUTED (GPT calls non-issue)**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. session-cleanup.js:49-50: `input = arguments[0]`, `eventType = event?.type ?? input?.event?.type`. A raw payload `{ type: 'global.disposed' }` has no `.type` on the destructured `event` (undefined) and no `input.event.type`, so `input.type` is never consulted and the event is ignored — contradicting the comment at js:48.
- Fix approach: Add the raw fallback to the normalization chain.
- Exact change: session-cleanup.js:50 → `const eventType = event?.type ?? input?.event?.type ?? input?.type;`. Optionally give the handler signature a safe default `async event(input = {})` and derive `event` from `input.event` to avoid relying on `arguments`.
- Acceptance: Unit test: handler invoked with `{ type: 'global.disposed' }` (raw) triggers the spawn; invoked with `{ event: { type: 'global.disposed' } }` (wrapped) also triggers; invoked with `{ type: 'unrelated' }` does not.
- Side effects / parity: None; strictly widens acceptance. Claude side unaffected (no JS event shape).
- Test: Add the three-shape plugin dispatch test above.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Non-issue for the supported OpenCode API. `.opencode/plugins/session-cleanup.js:47` already uses the documented hook shape `event({event})`; the current OpenCode `Hooks.event` contract accepts `{event: Event}`, not a raw event. The unsupported raw-build claim at `.opencode/plugins/session-cleanup.js:48-50` is misleading, but adding `input.type` is unnecessary compatibility code.
- Fix approach: Conform to the actual wrapped-event contract and remove the inaccurate compatibility claim rather than expanding behavior for an unverified payload.
- Exact change: After F8 retains an event handler for `session.created`, define it as `async event({event})` and read only `event?.type`. Remove the `arguments` access and raw-payload comment at `.opencode/plugins/session-cleanup.js:48-50`.
- Acceptance: Documented wrapped `session.created` payloads work; malformed or raw payloads fail open without throwing; no code claims raw payload support.
- Side effects / parity: No Claude-side change. Tests and fixtures should use the real `{event:{type,properties}}` shape.
- Test: Add a wrapped-event fixture and malformed-input fixture. Do not encode an unsupported raw-event contract in tests.

---

### F5 [P2 (GPT P2 / Opus refinement)] Subprocess failures and timeouts are silently discarded
`.opencode/plugins/session-cleanup.js:53` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. session-cleanup.js:54-57 ignores spawnSync's return object. spawnSync reports operational failures via `result.error` (e.g. ENOENT bash, ETIMEDOUT) and script failures via `result.status`/`result.signal` rather than throwing, so the catch at js:58-60 observes almost nothing.
- Fix approach: Capture the result and, on failure, append a single bounded line to a plugin debug log file (never stdout/stderr — OpenCode TUI). Retain fail-open (wrap all logging in try). The script itself already logs each kill action to its own rotated log (see F9), so this only needs to catch spawn-level failures.
- Exact change: session-cleanup.js: `const r = spawnSync(...)`; if `r.error || (r.status && r.status !== 0) || r.signal`, do a best-effort `fs.appendFileSync(<SESSION_CLEANUP_LOG_PATH or ~/.local/share/session-cleanup-plugin.log>, oneLine)` inside its own try/catch. Default stdio stays 'pipe' so guard output is captured, not painted to the TUI.
- Acceptance: Point the plugin at a nonexistent script path or a script that exits 1: the plugin does not throw, teardown proceeds, and the debug log gains one failure line; stdout/stderr stay clean.
- Side effects / parity: Log target should reuse the neutral SESSION_CLEANUP_LOG_PATH (O4) and honor F9 rotation. Claude side already gets outcomes via the script's own log.
- Test: Plugin test stubbing spawnSync to return `{status:1}` and `{error:new Error('ENOENT')}`; assert no throw and one appended log line each.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/plugins/session-cleanup.js:53-60` ignores the `spawnSync` result. Nonzero status, signal termination, and timeout errors are usually returned rather than thrown, so the catch observes only exceptional invocation failures.
- Fix approach: Use one asynchronous bounded process runner that captures output, awaits completion during disposal, and records launch, timeout, signal, and nonzero-exit failures to a bounded file without writing to OpenCode stdout or stderr.
- Exact change: Replace `spawnSync` with an `execFile`/`spawn` Promise helper using an 8-second deadline, bounded captured output, and explicit exit/error handling. Append one sanitized diagnostic record to the neutral cleanup log for failures; retain fail-open behavior and never throw from `dispose`.
- Acceptance: Success is silent to the TUI. ENOENT, timeout, signal exit, and status 1 each produce one bounded diagnostic containing operation, code/signal, and timeout state, while disposal resolves.
- Side effects / parity: Use F9's log cap for both shell and plugin diagnostics. Guard subprocesses added by F8 should use the same non-TUI execution discipline.
- Test: Inject runners that succeed, reject, exit nonzero, receive a signal, and exceed the deadline. Assert diagnostics and that every hook Promise resolves.

---

### F6 [P2] Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath
`.opencode/bin/check-git-hooks.sh:30` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. check-git-hooks.sh:30 hardcodes `hook_target_dir="$repo_root/.git/hooks"`. In a linked worktree `$repo_root/.git` is a file pointing into the common gitdir, so the path is wrong; repos with core.hooksPath install hooks elsewhere entirely, so the guard warns falsely or misses real gaps.
- Fix approach: Ask git for the real hooks directory, which honors both worktree layout and core.hooksPath.
- Exact change: Replace sh:30 with `hook_target_dir="$(git -C "$repo_root" rev-parse --git-path hooks 2>/dev/null || true)"`; if the returned path is relative, resolve it against `$repo_root` (git may emit a repo-relative path). Guard against empty result (exit 0).
- Acceptance: In a linked worktree and in a repo with `core.hooksPath` set, the guard resolves to the same directory install-git-hooks.sh writes to and reports missing/present correctly; in a normal checkout behavior is unchanged.
- Side effects / parity: Must stay consistent with install-git-hooks.sh — verify the installer also resolves via `git rev-parse --git-path hooks` (or update it in the same pass) so guard and installer agree on target. This guard is shared by both runtimes' SessionStart chains (Claude now, OpenCode after F8), so a single fix covers both.
- Test: Add a shell test creating a temp repo with `git config core.hooksPath` and a temp linked worktree; assert the guard targets the git-resolved hooks dir in each.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/bin/check-git-hooks.sh:24-30` obtains the worktree root but constructs `$repo_root/.git/hooks`. In linked worktrees `.git` is a file, and `core.hooksPath` can redirect hooks elsewhere. `.opencode/scripts/install-git-hooks.sh:26-29` already demonstrates the correct repository pattern.
- Fix approach: Ask Git for the effective hook path and normalize relative output exactly as the installer does.
- Exact change: Replace `.opencode/bin/check-git-hooks.sh:30` with `git -C "$repo_root" rev-parse --git-path hooks`; if the result is relative, prefix it with `$repo_root`. Fail open when resolution returns empty.
- Acceptance: The guard inspects the common hook directory in a linked worktree and the configured directory when `core.hooksPath` is relative or absolute.
- Side effects / parity: Keeps the guard aligned with `.opencode/scripts/install-git-hooks.sh:26-29`; update both together if path-resolution policy later changes.
- Test: Create temporary repositories covering a normal checkout, linked worktree, relative `core.hooksPath`, and absolute `core.hooksPath`; assert guard and installer resolve the same target directory.

---

### F7 [P2 (GPT P2 / Opus refinement)] Any symlink is accepted even when broken or pointed at the wrong hook
`.opencode/bin/check-git-hooks.sh:41` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: confirmed. check-git-hooks.sh:41 only tests `! -L "$target"`. A symlink that is dangling, points at the wrong file, or is non-executable passes as 'installed', contradicting the header's promise of a 'matching symlink' check.
- Fix approach: For each versioned hook, verify the target is a symlink AND resolves (`-e`) AND (canonically) points at the corresponding source hook AND is executable; classify results into missing / broken / mismatched and report each bucket.
- Exact change: In the loop (sh:36-44): after the `! -L` check, also test `[ ! -e "$target" ]` (broken link) and compare canonical paths of `$target`'s resolution vs `$hook_source_dir/$name` (mismatch), and `[ ! -x "$target" ]`. Accumulate into separate arrays (missing/broken/mismatched) and print each named group in the warning (sh:46-48). Use a portable canonicalizer (macOS stock has no `readlink -f`): a small `cd "$(dirname "$l")" && printf '%s/%s' "$(pwd -P)" "$(basename ...)"` helper, or compare the one-level `readlink "$target"` against the known relative form the installer writes.
- Acceptance: Create a dangling symlink, a symlink to the wrong hook, and a non-executable one under the hooks dir; the guard names each in the appropriate category; a correct symlink is silent.
- Side effects / parity: Shared guard → both runtimes benefit. macOS portability is the main constraint (no GNU readlink -f); flag in review. Keep the installer's symlink form (relative vs absolute) as the comparison baseline.
- Test: Shell test seeding valid/broken/mismatched/non-exec symlinks and asserting the categorized warning output.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/bin/check-git-hooks.sh:35-43` considers every symlink valid solely because `-L` succeeds. Broken, redirected, and non-executable links therefore pass despite the matching-symlink contract documented at `.opencode/bin/check-git-hooks.sh:5-9`.
- Fix approach: Validate link existence, canonical destination equality, and executability, while keeping the guard advisory.
- Exact change: For every expected hook, classify the target as missing/non-symlink, broken, mismatched, or non-executable. Resolve the target and expected source to canonical paths with a portable helper, compare them, and require `-x` on the resolved target. Emit one bounded warning listing names and reasons.
- Acceptance: Only a symlink resolving to the corresponding versioned hook and executable through that link passes. Broken, wrong-target, regular-file, and non-executable cases warn.
- Side effects / parity: The installer at `.opencode/scripts/install-git-hooks.sh:55-56` already makes sources executable and creates direct links, so valid installations remain clean.
- Test: Add a table-driven shell test for correct absolute and relative links, broken links, wrong links, regular files, and non-executable sources.

---

### F8 [P2] OpenCode has no counterpart for the Claude SessionStart safety guards
`.claude/settings.json:50` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: confirmed. .claude/settings.json:59-67 runs worktree-guard.sh and check-git-hooks.sh at SessionStart; the OpenCode session-cleanup plugin only handles disposal (js:52) and no OpenCode code invokes either guard, so OpenCode sessions get no safety warnings.
- Fix approach: Add an OpenCode startup handler (in this plugin or a sibling startup plugin) that runs both guards with captured output (stdio 'pipe', never inherit → no TUI writes), then surfaces the captured stderr via experimental.chat.system.transform (system-context injection) or a bounded log file.
- Exact change: In session-cleanup.js add handling for OpenCode's session-created/startup event (verify the exact event name — same taxonomy uncertainty as O5): spawnSync each guard with `{ cwd: REPO_ROOT, timeout: 5000 }` (default 'pipe'); collect `result.stderr`; if non-empty, either append to the neutral log or expose via a `experimental.chat.system.transform` hook that prepends the warnings once. Do not write to process.stdout/stderr.
- Acceptance: Start an OpenCode session on the shared checkout with a missing git-hook symlink: the worktree/hook warnings appear via injected system context or the bounded log, and nothing corrupts the TUI.
- Side effects / parity: Depends on verifying the real OpenCode startup event name (couple to O5). Reuses the SAME two guard scripts as Claude — so F6/F7/O6 fixes apply to both surfaces automatically. Consider a separate small plugin to keep 'session-cleanup' single-purpose.
- Test: Plugin test stubbing spawnSync for both guards on a startup event; assert both are invoked with captured (not inherited) stdio and warnings routed to the log/transform, not stdout.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. Claude runs both guards from `.claude/settings.json:50-68`; `.opencode/plugins/session-cleanup.js:44-63` currently exposes only disposal-event cleanup and has no session-start guard path.
- Fix approach: Run both guards on OpenCode `session.created`, capture their output, and inject warnings once into that session's system context. Never inherit their stderr into the TUI.
- Exact change: Retain an `event({event})` hook for `session.created`. Run `worktree-guard.sh` and `check-git-hooks.sh` with cwd set to the plugin factory's `worktree` or `directory`, capture bounded stdout/stderr, and store nonempty warning text keyed by `event.properties.info.id`. Add `experimental.chat.system.transform` to append and consume those warnings for the matching `sessionID`; log execution failures instead of printing.
- Acceptance: A shared-checkout or invalid-hook condition appears once in OpenCode system context, never on process stdout/stderr. A clean linked worktree produces no injected warning.
- Side effects / parity: Claude retains its `SessionStart` commands. The shared shell guards remain the behavior source for both runtimes; only presentation differs.
- Test: Add plugin tests for clean and warning-producing stubs, session-ID isolation, once-only injection, output caps, and assertions that no stdout/stderr writer is called.

---

### F9 [P2 (GPT P2 / Opus refinement)] Session cleanup log grows without a retention bound
`.opencode/scripts/session-cleanup.sh:33` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. session-cleanup.sh emit() (sh:27-35) appends to LOG_PATH with no size cap or rotation; the sibling orphan-mcp-sweeper.sh already implements exactly this via rotate_log_if_needed + LOG_MAX_BYTES (sh:124-137).
- Fix approach: Port the sweeper's rotation pattern verbatim: a LOG_MAX_BYTES config (env-overridable), an is_positive_int guard, and a rotate_log_if_needed that rolls .1/.2/.3, called at the top of emit() before appending.
- Exact change: In session-cleanup.sh add `LOG_MAX_BYTES="${SESSION_CLEANUP_LOG_MAX_BYTES:-${CLAUDE_SESSION_CLEANUP_LOG_MAX_BYTES:-10485760}}"`, an `is_positive_int` helper, and a `rotate_log_if_needed` mirroring orphan-mcp-sweeper.sh:124-137; call it inside emit() (sh:31-34) before the append.
- Acceptance: Pre-fill the log above the cap, run the script: the log rotates to .1 and the active file restarts; below the cap it appends normally.
- Side effects / parity: Env name should follow the neutral naming from O4 (SESSION_CLEANUP_LOG_MAX_BYTES) with the CLAUDE_* alias. Both runtimes share this script → one fix. Note: emit() unconditionally prints to stdout (sh:30) too — acceptable for OpenCode because the plugin captures stdout via 'pipe' (not inherited), but confirm no code path runs the script with inherited stdio into the TUI.
- Test: Shell test writing >LOG_MAX_BYTES then asserting rotation files appear and the active log is truncated.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/scripts/session-cleanup.sh:27-34` appends every emitted line without checking file size. `.opencode/scripts/orphan-mcp-sweeper.sh:124-137` has the required bounded-rotation pattern.
- Fix approach: Rotate before appending using a validated configurable byte cap and a small fixed number of generations.
- Exact change: Add `SESSION_CLEANUP_LOG_MAX_BYTES` with a conservative default, accepting a legacy Claude alias if one is documented. Before each file append, rotate `.2` to `.3`, `.1` to `.2`, and the active file to `.1` when its byte count exceeds the cap. Rotation failures remain fail-open.
- Acceptance: With a tiny configured cap, repeated emissions create at most the active file plus three generations, and the active file does not grow indefinitely.
- Side effects / parity: Applies to both runtimes and to F5 diagnostics. Add the neutral variable and alias to `ENV_REFERENCE.md`.
- Test: Run the script repeatedly against a temporary log with a tiny cap; assert generation count, retained recent records, and successful execution when rotation is denied.

---

### O1 [P2 · Opus-new] Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2)
`.opencode/scripts/session-cleanup.sh:121-124` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: med
- Root cause: confirmed. Repo-wide, nothing sets/exports CLAUDE_SESSION_PID (only ENV_REFERENCE + the vitest which forces it ''), and changelog 007-021/029 documents that the harness never provides it by design. With the var absent the script takes run_orphan_sweep_fallback (sh:105-119), and SPECKIT_STOP_HOOK_ORPHAN_SWEEP defaults 'off' (sh:24) → total no-op on BOTH runtimes. This is the shared root cause under F1/F2.
- Fix approach: Two independent activation paths, chosen per runtime by what is provably safe: (a) OpenCode — supply a real session-scoped PID via process.pid (F2/O4/O7), which fully activates precise cleanup with zero cross-session risk; (b) Claude — the harness won't expose the session PID and PPID-guessing was deliberately banned (029), so the only safe activation is the orphan-ONLY sweeper. Enable it via the SessionEnd hook (from F1) exporting SPECKIT_STOP_HOOK_ORPHAN_SWEEP, starting at 'dry-run' to observe, then 'live'.
- Exact change: OpenCode: the F2 env override activates path (a). Claude: in the new SessionEnd hook (F1) prefix `SPECKIT_STOP_HOOK_ORPHAN_SWEEP=dry-run` (then `live` after validation) rather than flipping the script default, so the change is scoped to the hook, not global. Do NOT flip sh:24's default globally.
- Acceptance: OpenCode disposal logs real descendant kills (F2 acceptance). Claude SessionEnd logs `action=orphan-sweep mode=dry-run` then, once trusted, `mode=live` with orphan reaps — and never touches a live sibling session.
- Side effects / parity: Enabling the orphan sweeper interacts with daemon re-election (O3): released daemons reparent to pid1 and are meant to be adopted by a new session; the sweeper reaps ownerless MCP by age (300s). Verify the sweeper does not reap a released-but-adoptable daemon before enabling 'live' — gate on O3 review. This is why I recommend dry-run first, not a default flip.
- Test: Extend launcher-stop-hook-orphan-sweep.vitest.ts with a case asserting the SessionEnd hook passes the flag; add an integration check that a bridged/adopted daemon is NOT reaped by the sweeper.

**GPT-5.6-Sol** — risk: high · confidence: high
- Root cause: Confirmed. `.opencode/scripts/session-cleanup.sh:121-124` defaults to a no-op without identity; `.claude/settings.json:78` supplies none; `.opencode/plugins/session-cleanup.js:54-57` supplies none; and `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:31-67` tests only the no-PID branch. Defaulting the global orphan sweeper to live would weaken the deliberate safety boundary.
- Fix approach: Activate session-scoped cleanup by supplying authoritative roots, not by enabling global process reaping. OpenCode passes `process.pid`; the recommended Claude launcher exports its exec-stable shell PID before `exec claude`.
- Exact change: Implement F2 for OpenCode. In `.opencode/bin/worktree-session.sh`, export `SESSION_CLEANUP_PID=$$` before all existing `exec "$RUNTIME"` paths so `exec` preserves that PID for Claude. Move Claude cleanup to `SessionEnd` per F1. Keep `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` default-off for direct launches lacking an authoritative root.
- Acceptance: OpenCode disposal and Claude sessions launched through `worktree-session.sh` both take the session-scoped path with a live root PID. A direct Claude launch with no identity remains a logged safe no-op rather than guessing ancestry.
- Side effects / parity: Touches the shared launcher as the Claude identity producer. Document that direct Claude launches do not receive process cleanup unless another trusted launcher supplies `SESSION_CLEANUP_PID`; detached shared daemons remain outside this path.
- Test: Add launcher integration tests proving the PID survives `exec` for fake Claude and OpenCode runtimes, plus end-to-end cleanup tests proving each runtime targets only descendants of its own root.

---

### F10 [refinement] Tests cover only the no-PID fallback, not plugin lifecycle or process termination
`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. launcher-stop-hook-orphan-sweep.vitest.ts:31-68 only forces CLAUDE_SESSION_PID='' and asserts fallback mode selection; it never exercises the plugin's event dispatch, env injection, or the shell descendant walk / kill ordering / identity re-check.
- Fix approach: Add two test layers: (1) a plugin unit test with stubbed spawnSync covering wrapped/raw/non-matching events (F4), env carrying SESSION_CLEANUP_PID and blanked CLAUDE_SESSION_PID (F2/O7), and failure inspection (F5); (2) isolated shell process-tree tests using real short-lived sleep trees rooted at a synthetic SESSION_PID covering descendant collection, deepest-first order (F3), reparent skip via is_descendant_of_session, and bounded timeout/failure.
- Exact change: New vitest (e.g. session-cleanup-plugin.vitest.ts) importing the plugin factory and stubbing node:child_process.spawnSync; new shell test (or vitest driving bash) building `sleep`-based trees whose process names match is_target_command patterns (via a renamed stub binary), asserting kill order and skip-on-reparent.
- Acceptance: New tests fail against current code (proving they exercise the gaps) and pass after F2/F3/F4/F5 land.
- Side effects / parity: Keep the existing fallback test; update it if O4 renames env (it sets CLAUDE_SESSION_PID which stays valid as alias). Process-tree tests must be hermetic (own subtree, cleanup in afterEach) to avoid touching real MCP helpers.
- Test: This finding IS the test work.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43-67` forces an empty PID and covers only fallback mode. The repository has no focused `session-cleanup` plugin lifecycle test, and the cited database session-manager tests exercise a different subsystem.
- Fix approach: Add focused tests at the plugin, shell-process, guard, and hook-wiring boundaries rather than overloading the fallback test.
- Exact change: Create `.opencode/plugins/tests/session-cleanup.test.cjs` for plugin lifecycle/environment/diagnostics/injection behavior. Expand the existing Vitest shell suite or add a sibling suite for PID precedence, target classification, reverse-order termination, identity rechecks, and log rotation. Add dedicated guard tests for F6, F7, and O6.
- Acceptance: The suite fails under the current event-only, ambient-env, parent-first implementation and passes only after the designed lifecycle, identity, ordering, and parity behavior exists.
- Side effects / parity: Tests must use isolated fake process trees and never scan or signal real developer MCP processes. Dependency injection or fake executables should be limited to test seams.
- Test: Required matrix: `dispose` once; wrapped `session.created`; warning injection; timeout/nonzero runner; neutral/legacy PID precedence; leaked-PID rejection; deepest-first TERM; unrelated sibling preservation; log cap; linked/custom hook paths.

---

### O2 [refinement · Opus-new] Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync
`.opencode/plugins/session-cleanup.js:54` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. session-cleanup.js:37 claims 'never blocks or fails teardown', but js:54-57 uses synchronous spawnSync with timeout:8000 inside `async event`, so the disposal callback is held up to 8s of wall-clock. The claim is inaccurate; the behavior is bounded-blocking.
- Fix approach: Prefer minimal + honest: keep the bounded synchronous spawn (teardown tolerates ≤8s and synchronous completion guarantees kills finish before the process exits) and correct the comment to 'bounded (≤8s), best-effort'. Only if teardown latency is unacceptable, switch to a detached, unref'd `spawn` with stdio 'ignore' (which would make 'never blocks' literally true but forfeits synchronous result inspection — then rely on the script's own rotated log per F9 for outcomes).
- Exact change: Recommended: edit the js:37 comment to 'Best-effort and bounded: waits at most ~8s and never throws.' Keep spawnSync. (Alternative, if chosen: replace spawnSync with `const c = child_process.spawn('bash',[...],{cwd,detached:true,stdio:'ignore',env:{...}}); c.on('error',logToFile); c.unref();`.)
- Acceptance: Recommended path: comment matches behavior; disposal returns within the 8s bound. Alternative path: disposal returns immediately and the detached cleanup still completes (verify child survives parent exit via detached session).
- Side effects / parity: If the detached alternative is chosen it composes with F5 (result inspection moves to the script's log) and O7 (still pass explicit env). Keep whichever path consistent with the F5 decision.
- Test: Timing assertion that the event handler returns within the bound (recommended) or near-immediately with a detached child (alternative).

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/plugins/session-cleanup.js:37` claims teardown is never blocked, but `.opencode/plugins/session-cleanup.js:54-57` calls synchronous `spawnSync` with an 8-second timeout inside an async hook, blocking the JavaScript event loop for its full duration.
- Fix approach: Use asynchronous child-process I/O but await it from the canonical `dispose` hook with a strict deadline. Fire-and-forget is incorrect at process teardown because the host may exit before cleanup runs.
- Exact change: Replace `spawnSync` with the bounded Promise runner described in F5 and update the comment to state that cleanup is fail-open and may delay disposal by at most the configured timeout. Do not use a detached cleanup child.
- Acceptance: A deliberately slow cleanup does not block unrelated event-loop timers, disposal waits no longer than the configured deadline, and the child is terminated and diagnosed on timeout.
- Side effects / parity: Combines with F5 and O5. Claude `SessionEnd` remains synchronously bounded because descendant identity must be checked before Claude exits.
- Test: Use a slow fake executable plus a short interval heartbeat; assert the heartbeat advances while cleanup runs and `dispose` resolves after success or the deadline.

---

### O3 [refinement · Opus-new] Detached daemon MCP children are structurally unreachable by the descendant walk
`.opencode/bin/mk-spec-memory-launcher.cjs:211` — **Status: DISPUTED (GPT calls non-issue)**

**Opus 4.8** — risk: low · confidence: med
- Root cause: confirmed but largely by-design, not a defect in the walk. mk-spec-memory-launcher.cjs:209-212 spawns the daemon with `detached:true` under daemon re-election (on by default); a released/detached daemon reparents to pid1 and is intentionally out of the SESSION_PID subtree, so session-cleanup.sh's pgrep -P descent (sh:47-59) structurally cannot reach it. The launcher comment (cjs:197-205) states this is deliberate: released daemons are bounded by idle self-exit and the orphan sweeper.
- Fix approach: Document the boundary in session-cleanup.sh (detached daemons are intentionally out of scope for the session-scoped path; they are reclaimed by daemon idle self-exit + the orphan sweeper), and ensure at least one of those two bounds is actually active — i.e. confirm the idle self-exit timeout exists and couple to O1's orphan-sweep activation so the leak is genuinely bounded.
- Exact change: Add a short WHY comment near session-cleanup.sh's descendant walk noting detached daemons are handled by idle-exit + orphan sweeper, not this path. No code change to the walk. In O1, treat 'orphan sweeper active' as the safeguard for this class and verify the daemon's idle self-exit bound in mk-spec-memory-launcher.cjs.
- Acceptance: A detached daemon left after a session end is reclaimed within its idle-exit window (or by the orphan sweeper once O1 enables it); the documented contract matches observed behavior.
- Side effects / parity: Reinforces O1's caution: the orphan sweeper must not reap a released daemon that a live session has adopted/bridged — verify before enabling live sweep. Comment hygiene: durable WHY only, no packet/spec ids.
- Test: Integration: start a detached daemon, end the owner, confirm it is NOT killed by session-cleanup.sh and IS bounded by idle-exit; and that an adopted daemon survives the sweeper.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Non-issue: intentional architecture. `.opencode/bin/mk-spec-memory-launcher.cjs:197-205` explicitly releases re-election-enabled daemons, reparents them, and relies on idle self-exit/orphan lifecycle management. `.opencode/bin/mk-spec-memory-launcher.cjs:209-212` makes that daemon detached. A session-scoped cleanup must not kill a shared released daemon.
- Fix approach: Keep detached shared daemons out of descendant cleanup. Clarify the boundary and verify their independent idle/lease cleanup rather than broadening the session walk.
- Exact change: No process-killing change. Update the shared cleanup documentation/header to state that it handles attached per-session helpers only and that detached re-election daemons are intentionally governed by launcher idle/lease logic and the separately opt-in orphan sweeper.
- Acceptance: Ending one session terminates its attached helper transports but leaves an adopted/released shared daemon available to another session; the daemon still exits under its existing idle policy when unused.
- Side effects / parity: Do not enable the orphan sweeper live by default as part of this fix. Review all three daemon launchers for the same documented ownership model.
- Test: Add or retain lifecycle tests proving detached daemon survival across owner disposal, adoption by a second client, and eventual idle exit; add a session-cleanup test proving a detached fixture is not targeted.

---

### O4 [refinement · Opus-new] OpenCode surface reuses Claude-named env and default log path
`.opencode/scripts/session-cleanup.sh:15` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed. When invoked from OpenCode the shared script still reads the Claude-named CLAUDE_SESSION_PID (sh:14) and logs to CLAUDE_SESSION_CLEANUP_LOG_PATH defaulting to '.local/share/claude-stop-hook.log' (sh:15); the plugin passes no override (js:54).
- Fix approach: Introduce runtime-neutral names read first, with the CLAUDE_* names kept as back-compat aliases; the OpenCode plugin sets the neutral vars.
- Exact change: session-cleanup.sh:14 → `SESSION_PID="${SESSION_CLEANUP_PID:-${CLAUDE_SESSION_PID:-}}"`; sh:15 → `LOG_PATH="${SESSION_CLEANUP_LOG_PATH:-${CLAUDE_SESSION_CLEANUP_LOG_PATH:-${HOME:-/tmp}/.local/share/session-cleanup.log}}"` (or keep the claude-stop-hook.log default for pure back-compat and only override the neutral var from the plugin). Plugin (js) sets SESSION_CLEANUP_PID and optionally SESSION_CLEANUP_LOG_PATH in the spawn env.
- Acceptance: OpenCode run logs to the neutral path with SESSION_CLEANUP_PID honored; a legacy caller setting only CLAUDE_SESSION_PID / CLAUDE_SESSION_CLEANUP_LOG_PATH still works unchanged.
- Side effects / parity: Update ENV_REFERENCE.md to document neutral vars + aliases. The existing vitest sets CLAUDE_SESSION_PID='' / CLAUDE_SESSION_CLEANUP_LOG_PATH=/dev/null — still valid via alias; add neutral-var cases. This is the enabling change for F2/F5/F9/O7 env naming.
- Test: Shell test asserting SESSION_CLEANUP_PID takes precedence over CLAUDE_SESSION_PID, and CLAUDE_* still works when the neutral var is unset.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/scripts/session-cleanup.sh:14-15` exposes only `CLAUDE_SESSION_PID` and `CLAUDE_SESSION_CLEANUP_LOG_PATH`, with a Claude-specific default log, even though `.opencode/plugins/session-cleanup.js:54` invokes the script for OpenCode.
- Fix approach: Make neutral names authoritative and retain Claude names only as compatibility aliases.
- Exact change: Resolve PID as `SESSION_CLEANUP_PID` first, then `CLAUDE_SESSION_PID`. Resolve the log as `SESSION_CLEANUP_LOG_PATH` first, then `CLAUDE_SESSION_CLEANUP_LOG_PATH`, then a neutral `~/.local/share/session-cleanup.log` default. Update comments, emitted terminology, and `ENV_REFERENCE.md`; do not remove aliases.
- Acceptance: Neutral values win when both are set, legacy Claude-only configuration still works, and an OpenCode invocation no longer defaults to a `claude-stop-hook.log` path.
- Side effects / parity: F2 and O7 must explicitly set the neutral PID. Claude launcher and `SessionEnd` hook should use the neutral name while preserving existing operator overrides.
- Test: Add a precedence matrix for neutral-only, legacy-only, both-conflicting, and neither-set environments, asserting selected PID and log path.

---

### O5 [refinement · Opus-new] OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy
`.opencode/plugins/session-cleanup.js:52` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: low
- Root cause: confirmed as unverified assertion. session-cleanup.js:52 fires only on 'server.instance.disposed' or 'global.disposed'; these strings are hardcoded, not derived from any imported OpenCode constant, and cannot be confirmed against OpenCode's real emitted event taxonomy from within this repo.
- Fix approach: Verify the strings against OpenCode's published event schema/constants; add a bounded, non-stdout dev-log that records the observed eventType once per session (behind SESSION_CLEANUP_DEBUG) so the real disposal event name can be confirmed empirically, then keep/adjust the matched strings.
- Exact change: Add an env-gated (SESSION_CLEANUP_DEBUG) branch in the event handler that appends the observed `eventType` to the neutral log (fs.appendFileSync, try-wrapped) for one confirming run; cross-check OpenCode's event names in its plugin API docs/source and update the two literals if they differ. Keep F4's raw/wrapped normalization.
- Acceptance: With debug on, the log shows the actual disposal event string emitted by the installed OpenCode; the matched literals equal it.
- Side effects / parity: Same event-taxonomy uncertainty blocks F8's startup event name — resolve both together against the same verified schema. External dependency: OpenCode version may change event names; consider matching a suffix (e.g. endsWith('.disposed')) as a more robust alternative.
- Test: Manual/observational (debug log) plus a plugin test asserting the matched set; if a suffix match is adopted, unit-test it against sample event names.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed refinement, but narrower than reported. The current OpenCode event schema includes `server.instance.disposed`; `global.disposed` is not in the current generated `Event` union. More importantly, the plugin API exposes a canonical `Hooks.dispose` callback, while `.opencode/plugins/session-cleanup.js:52` manually approximates teardown through event strings.
- Fix approach: Use `dispose` as the cleanup lifecycle contract and reserve `event` for the verified `session.created` guard behavior from F8.
- Exact change: Remove cleanup handling for both disposal strings from `.opencode/plugins/session-cleanup.js:52-61`. Register an idempotent async `dispose` function that invokes the bounded cleanup runner once. Keep only verified event types needed for startup guards.
- Acceptance: Cleanup runs once when OpenCode disposes the plugin even if no disposal event is delivered; `server.instance.disposed` or arbitrary raw events cannot cause duplicate cleanup.
- Side effects / parity: Align plugin comments and `.opencode/plugins/README.md` with `dispose`. Other plugins may still legitimately consume `server.instance.disposed`; this change should not globally remove that valid event.
- Test: Call the plugin's `event` hook with `server.instance.disposed` and verify no cleanup, then call `dispose` twice and verify the idempotent runner executes once.

---

### O6 [refinement · Opus-new] worktree-guard only warns on main/master, missing shared-checkout sessions on other branches
`.opencode/bin/worktree-guard.sh:37` — **Status: both models agree**

**Opus 4.8** — risk: med · confidence: high
- Root cause: confirmed. worktree-guard.sh:32-34 already returns early when inside a linked worktree, so at sh:36 the session is provably a top-level shared checkout — yet sh:37 only warns when the branch is 'main'/'master'. A shared-checkout session on any other branch (e.g. the current skilled/v4.0.0.0) has the identical collision risk (shared working tree + MCP databases) but is silently allowed. The risk is the shared tree, not the branch label.
- Fix approach: Warn whenever the session is on a non-linked-worktree checkout regardless of branch (the early-return at sh:32-34 already excludes isolated worktrees). Provide an optional configurable allowlist for operators who intentionally run on a shared long-lived branch.
- Exact change: Remove the `if [ "$branch" = main/master ]` gate (sh:37); always emit the warning at that point, including the actual branch name in the message. Optionally add `SPECKIT_WORKTREE_GUARD_BRANCHES` (comma list) to suppress specific branches, and keep the existing SPECKIT_WORKTREE_GUARD=off and AI_SESSION_CHILD=1 escapes (sh:20,23).
- Acceptance: Starting a top-level session on any branch of the shared checkout prints the warning; inside a linked worktree it stays silent; SPECKIT_WORKTREE_GUARD=off and AI_SESSION_CHILD=1 still silence it.
- Side effects / parity: More frequent warnings for operators who deliberately work on the shared checkout — mitigated by the existing off switch and the optional allowlist. Shared guard → applies to Claude now and OpenCode after F8. No divergence between runtimes.
- Test: Shell test: temp repo on a non-main branch top-level → warns; temp linked worktree → silent; allowlist/off env → silent.

**GPT-5.6-Sol** — risk: low · confidence: high
- Root cause: Confirmed. `.opencode/bin/worktree-guard.sh:31-34` correctly identifies a non-linked primary checkout, but `.opencode/bin/worktree-guard.sh:36-39` warns only for branch names `main` or `master`. The current shared checkout on `skilled/v4.0.0.0` therefore receives no warning despite the same collision risk.
- Fix approach: Base the warning solely on primary/shared-checkout topology, not branch naming.
- Exact change: After excluding non-repositories, linked worktrees, and `AI_SESSION_CHILD=1`, always emit the warning when `git_dir == common_dir`. Keep the current branch only as diagnostic text and replace wording that assumes it is main.
- Acceptance: Primary checkouts warn on `main`, `master`, feature, release, and detached HEAD states; linked worktrees remain silent on every branch.
- Side effects / parity: More top-level sessions will warn by design. `SPECKIT_WORKTREE_GUARD=off` remains the explicit opt-out, and F8 makes the corrected warning visible in OpenCode.
- Test: Create primary and linked checkout fixtures on main, feature, and detached states; assert warning depends only on topology plus existing child/opt-out suppressions.

---

### O7 [refinement · Opus-new] spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID
`.opencode/plugins/session-cleanup.js:54` — **Status: both models agree**

**Opus 4.8** — risk: low · confidence: high
- Root cause: confirmed and safety-relevant. session-cleanup.js:54-57 passes no `env`, so spawnSync inherits process.env verbatim. If OpenCode was launched from a shell that exported CLAUDE_SESSION_PID for a different (Claude) session, session-cleanup.sh would treat that foreign PID as the session root and SIGTERM that other session's descendants — a cross-session kill.
- Fix approach: Have the plugin set the neutral identity var explicitly AND blank the inherited CLAUDE_SESSION_PID so no leaked value is honored. Combined with O4's read-order (neutral first, then CLAUDE_* alias), this fully removes ambient-env influence.
- Exact change: session-cleanup.js spawnSync env (same edit as F2): `env: { ...process.env, SESSION_CLEANUP_PID: String(process.pid), CLAUDE_SESSION_PID: '' }`. The blanked alias ensures a leaked CLAUDE_SESSION_PID cannot be picked up by sh:14's fallback.
- Acceptance: Export a bogus CLAUDE_SESSION_PID in the launching shell, run an OpenCode disposal: the script uses SESSION_CLEANUP_PID (OpenCode's own pid), never the foreign value; no foreign-session process is signalled.
- Side effects / parity: Depends on O4 read-order landing. Does not affect Claude (its SessionEnd hook still sets/inherits its own path). Verify no other legitimate consumer relies on the plugin propagating an inherited CLAUDE_SESSION_PID (none found).
- Test: Plugin test asserting spawn env has CLAUDE_SESSION_PID==='' and SESSION_CLEANUP_PID===String(process.pid) even when process.env.CLAUDE_SESSION_PID is set to a foreign value.

**GPT-5.6-Sol** — risk: med · confidence: high
- Root cause: Confirmed. `.opencode/plugins/session-cleanup.js:54-57` supplies no `env`, so Node inherits all ambient variables. Because `.opencode/scripts/session-cleanup.sh:14` trusts `CLAUDE_SESSION_PID`, an OpenCode process launched from a contaminated shell can target a foreign Claude process tree.
- Fix approach: Treat session identity as caller-owned security-sensitive input and overwrite both neutral and legacy PID variables in the OpenCode child environment.
- Exact change: Construct the child environment explicitly from `process.env`, then set `SESSION_CLEANUP_PID=String(process.pid)` and `CLAUDE_SESSION_PID=''`. Never use an inherited PID as fallback on the OpenCode path. Pass explicit cwd and neutral log configuration at the same boundary.
- Acceptance: When the parent environment contains a live foreign `CLAUDE_SESSION_PID` and conflicting `SESSION_CLEANUP_PID`, the child receives only the OpenCode host PID and the foreign tree is untouched.
- Side effects / parity: Must land before or with F2/O1 activation. Claude retains alias compatibility inside the script, but OpenCode deliberately masks the alias.
- Test: Start the plugin test with a foreign PID canary in both ambient variables; inspect the spawned environment and assert the canary process remains alive after disposal.

---

