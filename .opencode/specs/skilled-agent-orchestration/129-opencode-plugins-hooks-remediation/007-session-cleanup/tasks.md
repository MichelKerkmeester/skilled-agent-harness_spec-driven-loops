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
    last_updated_at: "2026-07-10T09:27:08.451Z"
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
    - Source: iteration-1 F1, Opus verdict: adjusted
    - Fix: Remove process cleanup from the per-response Stop chain. Invoke it from a true session-exit hook if supported, or from the Claude launcher/wrapper using an exit trap; keep any genuinely per-response session-stop.js behavior separate.
- [ ] T004 [P1 (GPT P1 / Opus P2)] OpenCode cleanup has no OpenCode session PID and is normally a no-op (`.opencode/plugins/session-cleanup.js:54`)
    - Source: iteration-1 F2, Opus verdict: confirmed
    - Fix: Introduce a runtime-neutral cleanup PID input and have the plugin pass an API-derived OpenCode session/server root PID explicitly. Preserve CLAUDE_SESSION_PID only as the Claude-side compatibility input, with numeric and ownership validation.
- [ ] T005 [P1 (GPT P1 / Opus P2)] Parent-first termination can reparent nested helpers before they are killed (`.opencode/scripts/session-cleanup.sh:52`)
    - Source: iteration-1 F3, Opus verdict: confirmed
    - Fix: Terminate the captured process tree deepest-first, such as by iterating the descendants array in reverse. Preserve the live ancestry and process-identity checks before every signal.

### P2 - minor bugs

- [ ] T006 [P2 (GPT P2 / Opus refinement)] Claimed raw lifecycle-event compatibility does not read the raw event type (`.opencode/plugins/session-cleanup.js:47`)
    - Source: iteration-1 F4, Opus verdict: confirmed
    - Fix: Accept an undecorated input parameter with a safe default and normalize using input.event?.type ?? input.type before testing lifecycle values.
- [ ] T007 [P2 (GPT P2 / Opus refinement)] Subprocess failures and timeouts are silently discarded (`.opencode/plugins/session-cleanup.js:53`)
    - Source: iteration-1 F5, Opus verdict: adjusted
    - Fix: Inspect result.error, result.status, and result.signal. Record failures in a bounded append-only debug log or plugin status state without writing to OpenCode stdout/stderr, while retaining fail-open teardown behavior.
- [ ] T008 [P2] Git-hook guard hardcodes a hooks directory invalid for linked worktrees and custom hooksPath (`.opencode/bin/check-git-hooks.sh:30`)
    - Source: iteration-1 F6, Opus verdict: confirmed
    - Fix: Resolve the active hook directory with git rev-parse --git-path hooks, accounting for relative output, instead of deriving it from the worktree root.
- [ ] T009 [P2 (GPT P2 / Opus refinement)] Any symlink is accepted even when broken or pointed at the wrong hook (`.opencode/bin/check-git-hooks.sh:41`)
    - Source: iteration-1 F7, Opus verdict: confirmed
    - Fix: Resolve both the target symlink and expected source to canonical paths, compare them, and verify the resolved hook is executable; report mismatched and broken links alongside missing links.
- [ ] T010 [P2] OpenCode has no counterpart for the Claude SessionStart safety guards (`.claude/settings.json:50`)
    - Source: iteration-1 F8, Opus verdict: confirmed
    - Fix: Add an OpenCode session.created counterpart that runs both guards with captured output, then surfaces warnings through system-context injection or a bounded log rather than writing directly to the TUI.
- [ ] T011 [P2 (GPT P2 / Opus refinement)] Session cleanup log grows without a retention bound (`.opencode/scripts/session-cleanup.sh:33`)
    - Source: iteration-1 F9, Opus verdict: confirmed
    - Fix: Apply a configurable byte cap and bounded rotation before appending, reusing the retention pattern from orphan-mcp-sweeper.sh.
- [ ] T012 [P2 · Opus-new] Whole session-cleanup subsystem is dormant by default on BOTH runtimes (this is the root cause behind F1/F2) (`.opencode/scripts/session-cleanup.sh:121-124`)
    - Source: Opus iteration-2 (new)
    - Fix: Either (a) have the Claude launcher / OpenCode plugin supply a real session/root PID via env (js should pass {env:{...process.env, CLAUDE_SESSION_PID: <derived>}}), or (b) default the orphan-sweep to at least 'dry-run' so the path is exercised and observable, and document that with neither, cleanup is a deliberate no-op.

### Refinements

- [ ] T013 [refinement] Tests cover only the no-PID fallback, not plugin lifecycle or process termination (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts:43`)
    - Source: iteration-1 F10, Opus verdict: uncertain
    - Fix: Add plugin tests with stubbed spawnSync for wrapped and raw events, plus isolated shell process-tree tests covering valid identity, deepest-first termination, reparenting, and bounded timeout/failure behavior.
- [ ] T014 [refinement · Opus-new] Plugin comment claims 'never blocks teardown' but uses synchronous spawnSync (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new)
    - Fix: Use an async child (child_process.spawn / execFile with a bounded timeout, not awaited, or a detached fire-and-forget) so disposal is not held on the sweep; or drop the 'never blocks' claim.
- [ ] T015 [refinement · Opus-new] Detached daemon MCP children are structurally unreachable by the descendant walk (`.opencode/bin/mk-spec-memory-launcher.cjs:211`)
    - Source: Opus iteration-2 (new)
    - Fix: Document that detached daemons are intentionally out of scope for the session-scoped path and rely on the orphan sweeper, and ensure at least one of the two mechanisms is active by default.
- [ ] T016 [refinement · Opus-new] OpenCode surface reuses Claude-named env and default log path (`.opencode/scripts/session-cleanup.sh:15`)
    - Source: Opus iteration-2 (new)
    - Fix: Introduce runtime-neutral names (e.g. SESSION_CLEANUP_PID / SESSION_CLEANUP_LOG_PATH) with CLAUDE_* as back-compat aliases, and have the plugin set the neutral var.
- [ ] T017 [refinement · Opus-new] OpenCode disposal event-type strings are unverified against the real lifecycle taxonomy (`.opencode/plugins/session-cleanup.js:52`)
    - Source: Opus iteration-2 (new)
    - Fix: Verify against OpenCode's event schema/constants; log the observed eventType at least once (bounded, non-stdout) during development to confirm the strings match a real emitted event.
- [ ] T018 [refinement · Opus-new] worktree-guard only warns on main/master, missing shared-checkout sessions on other branches (`.opencode/bin/worktree-guard.sh:37`)
    - Source: Opus iteration-2 (new)
    - Fix: Warn whenever git_dir==common_dir (not a linked worktree) regardless of branch name, or make the branch allowlist configurable; the collision risk is about the shared tree, not the branch label.
- [ ] T019 [refinement · Opus-new] spawnSync inherits ambient env → risk of acting on a foreign/stale CLAUDE_SESSION_PID (`.opencode/plugins/session-cleanup.js:54`)
    - Source: Opus iteration-2 (new)
    - Fix: Explicitly set (or clear) the session-identity env var when spawning from the plugin rather than inheriting whatever leaked into the shell.

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
