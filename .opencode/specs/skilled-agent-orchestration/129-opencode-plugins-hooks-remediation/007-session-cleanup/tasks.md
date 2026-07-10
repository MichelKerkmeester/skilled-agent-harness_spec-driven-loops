---
title: "Tasks: session-cleanup remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "session-cleanup remediation"
  - "session-cleanup fixes"
  - "session-cleanup bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/007-session-cleanup"
    last_updated_at: "2026-07-10T11:42:16.907Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 17 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/session-cleanup.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: session-cleanup remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the session-cleanup test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] Claude Stop runs process cleanup after each response, not only at session teardown (`.claude/settings.json:72`)
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Claude Code has a real SessionEnd hook (fires on clear/logout/exit) — that is the true parity to OpenCode disposal. Move ONLY the process-cleanup invocation to SessionEnd; leave the per-response speckit continuity hook (session-stop.js) in Stop where it belongs.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [ ] T004 [P1 (GPT P1 / Opus P2)] OpenCode cleanup has no OpenCode session PID and is normally a no-op (`.opencode/plugins/session-cleanup.js:54`)
    - Source: iteration-1 F2, Opus verdict: confirmed · fix-design: both models agree
    - Fix: The OpenCode plugin runs inside the OpenCode server process, which is the parent of the MCP helper children it spawns. So `process.pid` IS a valid, safe session-scoped root. Pass it explicitly via a runtime-neutral env var (see O4) that the script reads before the CLAUDE_* alias.
    - REVIEW-FLAG (correct the design before implementing): process.pid is NOT session-scoped - PluginInput is workspace/server-scoped and carries no session identity. This is the one real 'kill the wrong process' hazard. Gate behind proven ownership + dry-run staging; land O4 (neutral read-order) and O7 (blank CLAUDE_SESSION_PID) first.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [ ] T005 [P1 (GPT P1 / Opus P2)] Parent-first termination can reparent nested helpers before they are killed (`.opencode/scripts/session-cleanup.sh:52`)
    - Source: iteration-1 F3, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Terminate deepest-first. Because pre-order DFS always lists a parent before its descendants, iterating the descendants array in reverse guarantees every child is signalled before its parent, eliminating the reparent-before-kill window. Keep the identity re-check.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)

### P2 - minor bugs

- [ ] T006 [P2 (GPT P2 / Opus refinement)] Claimed raw lifecycle-event compatibility does not read the raw event type (`.opencode/plugins/session-cleanup.js:47`)
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: DISPUTED (GPT calls non-issue)
    - Fix: Add the raw fallback to the normalization chain.
    - REVIEW (doc-only): The plugin already uses the documented event({event}) shape; the code comment claiming raw-event compatibility is simply false. Fix = delete the false claim (no behavior change).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
- [ ] T007 [P2 (GPT P2 / Opus refinement)] Subprocess failures and timeouts are silently discarded (`.opencode/plugins/session-cleanup.js:53`)
    - Source: iteration-1 F5, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Capture the result and, on failure, append a single bounded line to a plugin debug log file (never stdout/stderr — OpenCode TUI). Retain fail-open (wrap all logging in try). The script itself already logs each kill action to its own rotated log (see F9), so this only needs to catch spawn-level failures.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [ ] T008 [P2] Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath (`.opencode/bin/check-git-hooks.sh:30`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Ask git for the real hooks directory, which honors both worktree layout and core.hooksPath.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [ ] T009 [P2 (GPT P2 / Opus refinement)] Any symlink is accepted even when broken or pointed at the wrong hook (`.opencode/bin/check-git-hooks.sh:41`)
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: For each versioned hook, verify the target is a symlink AND resolves (`-e`) AND (canonically) points at the corresponding source hook AND is executable; classify results into missing / broken / mismatched and report each bucket.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [ ] T010 [P2] OpenCode has no counterpart for the Claude SessionStart safety guards (`.claude/settings.json:50`)
    - Source: iteration-1 F8, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Add an OpenCode startup handler (in this plugin or a sibling startup plugin) that runs both guards with captured output (stdio 'pipe', never inherit → no TUI writes), then surfaces the captured stderr via experimental.chat.system.transform (system-context injection) or a bounded log file.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [ ] T011 [P2 (GPT P2 / Opus refinement)] Session cleanup log grows without a retention bound (`.opencode/scripts/session-cleanup.sh:33`)
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Port the sweeper's rotation pattern verbatim: a LOG_MAX_BYTES config (env-overridable), an is_positive_int guard, and a rotate_log_if_needed that rolls .1/.2/.3, called at the top of emit() before appending.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
- [ ] T012 [P2 · Opus-new] Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2) (`.opencode/scripts/session-cleanup.sh:121-124`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Two independent activation paths, chosen per runtime by what is provably safe: (a) OpenCode — supply a real session-scoped PID via process.pid (F2/O4/O7), which fully activates precise cleanup with zero cross-session risk; (b) Claude — the harness won't expose the session PID and PPID-guessing was deliberately banned (029), so the only safe activation is the orphan-ONLY sweeper. Enable it via the SessionEnd hook (from F1) exporting SPECKIT_STOP_HOOK_ORPHAN_SWEEP, starting at 'dry-run' to observe, then 'live'.
    - REVIEW-FLAG (correct the design before implementing): Keep Claude orphan sweeping in dry-run until the O3 detached-daemon-adoption survival check is proven live.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)

### Refinements

- [ ] T013 [refinement] Tests cover only the no-PID fallback, not plugin lifecycle or process termination (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43`)
    - Source: iteration-1 F10, Opus verdict: uncertain · fix-design: both models agree
    - Fix: Add two test layers: (1) a plugin unit test with stubbed spawnSync covering wrapped/raw/non-matching events (F4), env carrying SESSION_CLEANUP_PID and blanked CLAUDE_SESSION_PID (F2/O7), and failure inspection (F5); (2) isolated shell process-tree tests using real short-lived sleep trees rooted at a synthetic SESSION_PID covering descendant collection, deepest-first order (F3), reparent skip via is_descendant_of_session, and bounded timeout/failure.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F10)
- [ ] T014 [refinement · Opus-new] Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Prefer minimal + honest: keep the bounded synchronous spawn (teardown tolerates ≤8s and synchronous completion guarantees kills finish before the process exits) and correct the comment to 'bounded (≤8s), best-effort'. Only if teardown latency is unacceptable, switch to a detached, unref'd `spawn` with stdio 'ignore' (which would make 'never blocks' literally true but forfeits synchronous result inspection — then rely on the script's own rotated log per F9 for outcomes).
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [ ] T015 [RECLASSIFIED: by-design] Detached daemon MCP children are structurally unreachable by the descendant walk (`.opencode/bin/mk-spec-memory-launcher.cjs:211`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. Re-election deliberately detaches shared daemons for adoption; the descendant walk is correct. Make Opus's caveat a HARD GATE: prove an adopted/released daemon is not reaped before O1 flips the orphan sweeper live.
- [ ] T016 [refinement · Opus-new] OpenCode surface reuses Claude-named env and default log path (`.opencode/scripts/session-cleanup.sh:15`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Introduce runtime-neutral names read first, with the CLAUDE_* names kept as back-compat aliases; the OpenCode plugin sets the neutral vars.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [ ] T017 [refinement · Opus-new] OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy (`.opencode/plugins/session-cleanup.js:52`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Verify the strings against OpenCode's published event schema/constants; add a bounded, non-stdout dev-log that records the observed eventType once per session (behind SESSION_CLEANUP_DEBUG) so the real disposal event name can be confirmed empirically, then keep/adjust the matched strings.
    - REVIEW-FLAG (correct the design before implementing): Use the canonical Hooks.dispose callback (it exists in the installed API) instead of guessing global.disposed / server.instance.disposed strings.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)
- [ ] T018 [refinement · Opus-new] worktree-guard only warns on main/master, missing shared-checkout sessions on other branches (`.opencode/bin/worktree-guard.sh:37`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Warn whenever the session is on a non-linked-worktree checkout regardless of branch (the early-return at sh:32-34 already excludes isolated worktrees). Provide an optional configurable allowlist for operators who intentionally run on a shared long-lived branch.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O6)
- [ ] T019 [refinement · Opus-new] spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Have the plugin set the neutral identity var explicitly AND blank the inherited CLAUDE_SESSION_PID so no leaked value is honored. Combined with O4's read-order (neutral first, then CLAUDE_* alias), this fully removes ambient-env influence.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O7)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Re-run the session-cleanup test suite; confirm green
- [ ] T021 Verify each fixed finding no longer reproduces
- [ ] T022 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/007-session-cleanup/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
