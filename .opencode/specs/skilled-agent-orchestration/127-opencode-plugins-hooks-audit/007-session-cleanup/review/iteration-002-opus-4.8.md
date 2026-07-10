# Iteration 2 - Opus 4.8 (high) cross-check - session-cleanup

> **Executor:** Claude Opus 4.8 (`claude-opus-4-8 --effort high`, plan mode) via cli-claude-code through account2, read-only, 2026-07-10.
> **Purpose:** independently verify iteration-1 (GPT-5.6-Sol-Fast) findings and surface issues the first pass missed.

## Net assessment

9 of 10 prior findings hold (F10 only partially verified); I downgraded F1 P1→P2 and F2 P1→P2 and F5 P2→refinement after confirming the whole cleanup path is inert by default. Root cause (new O1): nothing in the repo sets CLAUDE_SESSION_PID and the orphan sweep defaults off, so both the Claude Stop hook and the OpenCode disposal plugin log-and-skip — the leak this component targets is not actually prevented. Also new: synchronous spawnSync contradicts the 'never blocks teardown' claim (O2), detached daemons are structurally unreachable by the descendant walk (O3), Claude-named env/log leak onto the OpenCode surface (O4), unverified OpenCode event strings (O5), a main/master-only worktree-guard gap (O6), and ambient-env foreign-PID risk (O7).

**Prior findings adjudicated:** 10 - 2 adjusted, 7 confirmed, 1 uncertain. **New findings this pass:** 7.

**Parity (Opus view):** Parity is poor and, more importantly, both surfaces are effectively dormant by default. Structural divergences remain: Claude runs cleanup per-response from Stop with async:true/10s while OpenCode runs it at disposal with synchronous spawnSync/8s (blocking, despite the 'never blocks' comment); Claude wires the two SessionStart safety guards but OpenCode has no startup counterpart (F8); and OpenCode reuses Claude-named identity/log surfaces (O4). Beneath all of it, neither path performs real cleanup unless an external launcher supplies CLAUDE_SESSION_PID or the operator opts into the orphan sweep — so the surfaces are 'consistently non-functional' more than consistently behaving.

## 1. Verification of iteration-1 findings

| Prior ID | GPT sev | Opus verdict | Opus sev | Adjudication note |
|----------|---------|--------------|----------|-------------------|
| F1 | P1 | **adjusted** | P2 | CONFIRMED structurally: the Claude Stop hook (.claude/settings.json:78) fires when the main agent finishes a response, not at session teardown, and it invokes session-cleanup.sh every time. But the practical 'kills helpers per-response' harm is near-nil in the default config: session-cleanup.sh:14 reads CLAUDE_SESSION_PID and grep across the repo shows NOTHING sets/exports it (only the vitest forces it to ''); Claude Code delivers session identity via stdin JSON, not a CLAUDE_SESSION_PID env var. Absent the var the script takes the no-op fallback (sh:121-123). So F1's real teeth only appear IF an external launcher exports CLAUDE_SESSION_PID pointing at a PID whose descendants are the live MCP servers — then per-response Stop would SIGTERM them mid-session. Parity observation valid; severity downgraded P1→P2 pending that launcher's existence. |
| F2 | P1 | **confirmed** | P2 | CONFIRMED: session-cleanup.js:54-57 calls spawnSync with no `env` key, so the child inherits process.env with no OpenCode identity injected. session-cleanup.sh:14 reads only CLAUDE_SESSION_PID; absent it hits the fallback at sh:121-123 and, with SPECKIT_STOP_HOOK_ORPHAN_SWEEP defaulting 'off' (sh:24,115-118), emits 'action=skip' and exits 0. The OpenCode disposal cleanup is therefore a no-op by default. Downgraded P1→P2 because the sweep is opt-in-by-design (ENV_REFERENCE documents CLAUDE_SESSION_PID as 'often unavailable'). |
| F3 | P1 | **confirmed** | P2 | CONFIRMED (timing-dependent): append_descendants records parent-before-children (DFS pre-order, sh:52-55) and the kill loop consumes that order (sh:134-148), so a matched launcher is SIGTERM'd before its matched child. mk-spec-memory-launcher.cjs:12,211-212 shows the launcher spawns a child MCP/model process (non-detached mode = descendant). If the launcher exits before the loop reaches the child, the child reparents to init and is_descendant_of_session (sh:86-101) returns false → 'skip-kill reason=ancestry-not-confirmed' (sh:139) → the child LEAKS, defeating the script's purpose. Reverse (deepest-first) iteration fixes it. Downgraded P1→P2: racy (SIGTERM is async; parent may not have reaped yet) and only bites non-detached nesting. |
| F4 | P2 | **confirmed** | refinement | CONFIRMED: session-cleanup.js:50 computes eventType = event?.type ?? input?.event?.type. For a raw payload shaped {type:'global.disposed'}, the destructured `event` param is undefined and input?.event?.type is undefined, so the raw form the comment at js:48 promises to support is silently ignored. Fix: add `?? input?.type`. Low real-world stakes (depends on an OpenCode build variant that may not exist), so refinement not P2. |
| F5 | P2 | **adjusted** | refinement | CONFIRMED-but-downgraded: spawnSync's return is discarded (js:54-57); spawnSync reports timeouts/spawn-failures/nonzero exits in the returned object (.error/.status/.signal) rather than throwing, so the catch at js:58-60 almost never fires and an 8s timeout or bash-missing failure is invisible. However the plugin is explicitly best-effort ('never block or fail teardown', js:37), and session-cleanup.sh already logs to its own file, so this is an observability refinement, not a P2 error. |
| F6 | P2 | **confirmed** | P2 | CONFIRMED: check-git-hooks.sh:30 hardcodes hook_target_dir=$repo_root/.git/hooks where repo_root=git rev-parse --show-toplevel (sh:24). In a linked worktree $repo_root/.git is a FILE (gitdir pointer), so .git/hooks does not exist and every hook fails the `[ ! -L ]` test at sh:41 → ALL hooks falsely reported missing on every worktree session (this repo uses sk-git worktrees heavily). core.hooksPath is likewise ignored. Fix: `git rev-parse --git-path hooks`. Confirmed P2 (warn-only, so non-fatal, but noisy false positives). |
| F7 | P2 | **confirmed** | refinement | CONFIRMED: check-git-hooks.sh:41 tests only `[ ! -L "$target" ]`. `test -L` is true for a symlink even when dangling, and it never checks the link resolves to the corresponding versioned hook or is executable, despite the header (sh:4-6) describing a 'matching symlink' check. A broken or wrong-target symlink is accepted as installed. Under-warning, low blast radius → refinement. |
| F8 | P2 | **confirmed** | P2 | CONFIRMED: .claude/settings.json:59-67 runs worktree-guard.sh and check-git-hooks.sh at SessionStart; the OpenCode plugin (session-cleanup.js:44-63) handles only disposal events and has no session-created/startup counterpart invoking either guard. OpenCode operators get no worktree/hook-drift warnings. Parity gap, P2. |
| F9 | P2 | **confirmed** | refinement | CONFIRMED: session-cleanup.sh emit (sh:27-35) appends unconditionally with no size cap or rotation, while the sibling orphan-mcp-sweeper.sh implements LOG_MAX_BYTES + 3-generation rotation (orphan-mcp-sweeper.sh:112-137). Low-volume (a few lines/invocation) but unbounded, especially on Claude where Stop fires per-response. Refinement. |
| F10 | refinement | **uncertain** | refinement | PARTIALLY VERIFIED: I confirmed launcher-stop-hook-orphan-sweep.vitest.ts:36 forces CLAUDE_SESSION_PID:'' (i.e. exercises only the no-PID fallback branch) but did not read the full file's other cases. The claim that no test covers plugin lifecycle event dispatch or deepest-first/reparenting process-tree termination is plausible and consistent with the fallback-only fixture. Refinement. |

## 2. New findings (missed by iteration 1)

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| O1 | P2 | bug | `.opencode/scripts/session-cleanup.sh:121-124` | Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2) | high |
| O2 | refinement | parity | `.opencode/plugins/session-cleanup.js:54` | Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync | high |
| O3 | refinement | bug | `.opencode/bin/mk-spec-memory-launcher.cjs:211` | Detached daemon MCP children are structurally unreachable by the descendant walk | med |
| O4 | refinement | parity | `.opencode/scripts/session-cleanup.sh:15` | OpenCode surface reuses Claude-named env and default log path | high |
| O5 | refinement | parity | `.opencode/plugins/session-cleanup.js:52` | OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy | low |
| O6 | refinement | bug | `.opencode/bin/worktree-guard.sh:37` | worktree-guard only warns on main/master, missing shared-checkout sessions on other branches | med |
| O7 | refinement | error | `.opencode/plugins/session-cleanup.js:54` | spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID | low |

### Detail

#### O1 - Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2)
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/scripts/session-cleanup.sh:121-124`
- **Evidence:** Repo-wide grep shows nothing assigns/exports CLAUDE_SESSION_PID (only ENV_REFERENCE docs it as 'the no-session-pid case' and the vitest sets it ''). With the var absent, the script takes run_orphan_sweep_fallback (sh:105-119), and SPECKIT_STOP_HOOK_ORPHAN_SWEEP defaults 'off' (sh:24) → emits 'action=skip' and exits 0. On Claude the Stop hook (settings.json:78) thus logs-and-skips; on OpenCode the plugin spawns the same script with no env (js:54) → same skip. Both the session-scoped killer AND the orphan sweeper are inert unless the operator provides CLAUDE_SESSION_PID or opts into the sweep.
- **Impact:** The MCP-helper leak this component exists to prevent is not actually prevented in the shipped default config on either surface; the elaborate ancestry-proof logic never runs.
- **Proposed fix:** Either (a) have the Claude launcher / OpenCode plugin supply a real session/root PID via env (js should pass {env:{...process.env, CLAUDE_SESSION_PID: <derived>}}), or (b) default the orphan-sweep to at least 'dry-run' so the path is exercised and observable, and document that with neither, cleanup is a deliberate no-op.

#### O2 - Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync
- **Severity / Category / Confidence:** refinement / parity / high
- **Location:** `.opencode/plugins/session-cleanup.js:54`
- **Evidence:** js:37 documents 'Best-effort and bounded: it never blocks or fails teardown,' yet the event handler calls the synchronous spawnSync (js:54-57) with timeout:8000 inside `async event`. Awaiting nothing, it blocks the disposal event callback for up to 8s of wall-clock.
- **Impact:** Session/server teardown can stall up to 8s; contradicts the stated non-blocking contract and diverges from the Claude side which runs the equivalent hook with async:true (settings.json:80).
- **Proposed fix:** Use an async child (child_process.spawn / execFile with a bounded timeout, not awaited, or a detached fire-and-forget) so disposal is not held on the sweep; or drop the 'never blocks' claim.

#### O3 - Detached daemon MCP children are structurally unreachable by the descendant walk
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/bin/mk-spec-memory-launcher.cjs:211`
- **Evidence:** The launcher spawns its daemon with `detached: true` (mk-spec-memory-launcher.cjs:211) in daemon mode; a detached child becomes a session leader reparented away from the launcher. session-cleanup.sh discovers targets only via `pgrep -P` descent from SESSION_PID (sh:47-59) and re-proves ancestry up to SESSION_PID (sh:86-101). A daemon reparented to init/1 is never a descendant, so it can never be matched or killed by this script.
- **Impact:** The processes most prone to leaking (long-lived detached daemons) are exactly the ones the session-scoped killer cannot reap; only the default-off orphan sweeper could, compounding O1.
- **Proposed fix:** Document that detached daemons are intentionally out of scope for the session-scoped path and rely on the orphan sweeper, and ensure at least one of the two mechanisms is active by default.

#### O4 - OpenCode surface reuses Claude-named env and default log path
- **Severity / Category / Confidence:** refinement / parity / high
- **Location:** `.opencode/scripts/session-cleanup.sh:15`
- **Evidence:** When invoked from the OpenCode plugin the shared script still reads CLAUDE_SESSION_PID (sh:14) and logs to CLAUDE_SESSION_CLEANUP_LOG_PATH defaulting to '.local/share/claude-stop-hook.log' (sh:15). The plugin passes no override (js:54).
- **Impact:** OpenCode cleanup activity is mislabeled under Claude-named files/vars, hurting operability and making the parity story harder to reason about; also means an OpenCode operator can't scope its identity input independently.
- **Proposed fix:** Introduce runtime-neutral names (e.g. SESSION_CLEANUP_PID / SESSION_CLEANUP_LOG_PATH) with CLAUDE_* as back-compat aliases, and have the plugin set the neutral var.

#### O5 - OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy
- **Severity / Category / Confidence:** refinement / parity / low
- **Location:** `.opencode/plugins/session-cleanup.js:52`
- **Evidence:** The handler fires only on eventType 'server.instance.disposed' or 'global.disposed' (js:52). These strings are asserted, not derived from any imported OpenCode constant, and I could not confirm them against OpenCode's actual emitted event names within audit scope.
- **Impact:** If the true disposal event type differs, the plugin silently never runs — a third independent way (alongside O1/F2) the OpenCode cleanup could be dead.
- **Proposed fix:** Verify against OpenCode's event schema/constants; log the observed eventType at least once (bounded, non-stdout) during development to confirm the strings match a real emitted event.

#### O6 - worktree-guard only warns on main/master, missing shared-checkout sessions on other branches
- **Severity / Category / Confidence:** refinement / bug / med
- **Location:** `.opencode/bin/worktree-guard.sh:37`
- **Evidence:** After confirming it is NOT inside a linked worktree (sh:32-34), the guard warns only when branch is 'main' or 'master' (sh:37). A top-level session on the shared checkout on any other branch (e.g. the current 'skilled/v4.0.0.0') shares the same working tree and MCP databases and carries the identical collision risk the guard describes (sh:38), yet receives no warning.
- **Impact:** The exact hazard the guard exists to flag (concurrent sessions on the shared checkout) goes unwarned for the common case of a feature branch checked out on main's working tree.
- **Proposed fix:** Warn whenever git_dir==common_dir (not a linked worktree) regardless of branch name, or make the branch allowlist configurable; the collision risk is about the shared tree, not the branch label.

#### O7 - spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID
- **Severity / Category / Confidence:** refinement / error / low
- **Location:** `.opencode/plugins/session-cleanup.js:54`
- **Evidence:** The plugin passes no `env`, so spawnSync inherits process.env verbatim (js:54-57). If OpenCode is launched from a shell that exported CLAUDE_SESSION_PID for a different (e.g. Claude) session, session-cleanup.sh would treat that foreign PID as the session root and walk/kill its descendants.
- **Impact:** Cross-session interference is possible, though bounded by is_descendant_of_session's live-ancestry re-proof (sh:86-101), so it can only touch processes genuinely descended from the inherited PID — still surprising and hard to diagnose.
- **Proposed fix:** Explicitly set (or clear) the session-identity env var when spawning from the plugin rather than inheriting whatever leaked into the shell.

