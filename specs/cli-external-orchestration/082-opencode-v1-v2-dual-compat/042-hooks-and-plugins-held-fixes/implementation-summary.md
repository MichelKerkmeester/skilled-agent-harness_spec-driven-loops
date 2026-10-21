---
title: "Implementation Summary"
description: "All sixteen hook and plugin findings phase 039 held are fixed, each with a test that fails when its fix is reverted, and the two cache fixes are measured before and after."
trigger_phrases:
  - "hooks and plugins held fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes"
    last_updated_at: "2026-10-21T04:53:46Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All sixteen findings fixed and verified; suites and live scenarios green"
    next_safe_action: "Merge main, push to main, record CI"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-042-hooks-and-plugins-held-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-hooks-and-plugins-held-fixes |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All sixteen findings that phase 039 held are fixed: seven P1 and nine P2, across the relaunch killer, the post-edit secret scrubber, the task-dispatch loop guard, the git hook installer, the route-guard adapters, the shared stdin reader and four OpenCode plugins. Each fix ships with a test that fails when the fix is reverted.

### Phase 42: hooks-and-plugins-held-fixes

Review rounds sharpened several fixes beyond their first version. The relaunch killer now compares a per-arm identity rather than an arm time. The bearer scrubber recognises alphabet-only base64. The loop-count lock went from a stale-age takeover to a dead-owner rule under an exclusive break lock. The advisor queue gained a deadline that holds even when a slot frees at the boundary.

| Finding | Fix | Commits | Test |
|---------|-----|---------|------|
| b05-relaunch-lib-N01 (P1) | `killer.cjs` unarms timeout, hop-cap and stale records only when their `armId` still matches; `arm()` stamps a fresh `randomUUID()` | `557e83052b`, `89f6699fe2` | `.skilled/hooks/session-relaunch/tests/killer.test.cjs`, `relaunch-core.test.cjs` |
| b10-hooks-quality-screen-task-012 (P1) | `post-edit-router.cjs` `BEARER_SCHEME_PATTERN` redacts `Bearer <token>` when the run has a digit or symbol, or is 16+ characters with mixed case | `f7afb8c441`, `e71517445a`, `039fa4d2f2`, `a6b8ce1049` | `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` |
| b10-hooks-quality-screen-task-016 (P1) | `dispatch-guard.cjs` `resolveCommandConfigPath` accepts a config only when its realpath sits inside the project realpath | `324a6b6cc0` | `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` |
| b10-hooks-quality-screen-task-017 (P1) | `dispatch-guard.cjs` serialises the loop-count update under a per-session `pid token` lock; the owner record is hard-linked into place with the lock, a dead lock is removed only under a `.break` mutex, and no write happens without the lock | `9dcf3168db`, `b7a43d9cd5`, `8709743b3d`, `6dfa3257dc` | `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs` |
| b11-hooks-shared-and-small-011 (P1) | `install-hooks.sh` resolves the hooks folder with `git rev-parse --git-path hooks` | `b773d87964` | `.skilled/hooks/git/install-hooks.test.sh` |
| b11-hooks-shared-and-small-016 (P1) | Cursor `mcp-route-guard.mjs` resolves the child guard from its own folder via `import.meta.url` | `a91c17d44b` | `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` |
| b11-hooks-shared-and-small-N01 (P1) | `hook-adapter-shared.cjs` `readStdin` keeps at most `MAX_STDIN_BYTES` (64 MiB) and resolves `''` past it | `ba48e3f040` | `.skilled/hooks/shared/hook-adapter-shared.test.cjs` |
| b02-plugins-rest-007 (P2) | `session-relaunch.js` caches the flags file on mtime, ctime, size and inode | `f62953677e`, `e2ada51448`, `cb8619244e` | `.opencode/plugins/tests/session-relaunch.test.cjs` |
| b02-plugins-rest-012 (P2) | `system-spec-gate.js` keys id-less events to `guardCore.UNKNOWN_SESSION_ID` | `015c39c1b4` | `.opencode/plugins/tests/system-spec-gate.test.cjs` |
| b02-plugins-rest-N03 (P2) | `system-skill-advisor.js` reuses file digests while mtime, ctime, size and inode are unchanged | `ae0d20a062`, `b7824acede` | `.opencode/plugins/tests/system-skill-advisor.test.cjs` |
| b02-plugins-rest-N04 (P2) | `system-skill-advisor.js` runs at most two advisor children; queued lookups fail open at a monotonic deadline or on session deletion | `7deeac6287`, `1df4dddee0`, `84f93e097c`, `6bd8cfab2a` | `.opencode/plugins/tests/system-skill-advisor.test.cjs` |
| b02-plugins-rest-N05 (P2) | `session-cleanup.js` runs the startup guards as concurrent async children; the first transform awaits them, bounded by 8 s plus a 250 ms kill grace | `8c42fd499d`, `410696410c` | `.opencode/plugins/tests/session-cleanup.test.cjs` |
| b05-relaunch-lib-002 (P2) | `hop-history.cjs` reads `last` as a non-negative count | `f32f7786c9` | `.skilled/hooks/session-relaunch/tests/hop-history.test.cjs` |
| b10-hooks-quality-screen-task-009 / -010 (P2) | Codex and Devin `post-edit-quality.cjs` take the first string field in `FILE_PATH_FIELDS` | `2c4801c55d` | `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`, `devin/post-edit-quality.test.cjs` |
| b11-hooks-shared-and-small-018 (P2) | Route-guard core `mcp-route-guard.cjs` uses the shared `isTruthy` for its kill switch | `fd7149c106` | `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/killer.cjs`, `relaunch-core.cjs`, `hop-history.cjs`, `README.md` | Modified | Arm identity and hop count |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, `codex/post-edit-quality.cjs`, `devin/post-edit-quality.cjs` | Modified | Bearer redaction and path-field pick |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` | Modified | Config containment and the loop-count lock |
| `.skilled/hooks/git/install-hooks.sh` | Modified | Hooks folder from git |
| `.skilled/hooks/git/install-hooks.test.sh` | Created | Linked worktree and `core.hooksPath` cases |
| `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs`, `lib/mcp-route-guard.cjs` | Modified | Child path and kill switch |
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modified | Stdin byte cap |
| `.opencode/plugins/session-relaunch.js`, `system-spec-gate.js`, `system-skill-advisor.js`, `session-cleanup.js` | Modified | The five plugin findings |
| Tests beside each file, plus `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` (created) | Modified or Created | One failing-first test per finding |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek v4.1 flash writer made each change from a one-change brief in the worktree `worktrees/184-hooks-and-plugins-held-fixes`. Luna (gpt-6-luna, max, read-only) reviewed every commit, and each P1 it raised was fixed and reviewed again. Each fix's source was reverted on its own and its test watched fail; the results are in `scratch/mutation/revert-checks.txt`. The four touched plugin scenarios ran live on OpenCode v1 and on v2 in standalone mode, never against the shared v2 service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A 64 MiB stdin cap | The largest real payloads measured were about 68 KB of tool input, 234 KB of tool result and a 26 MB tracked file, so the cap sits well above any real hook input and an over-cap read fails open |
| Lock staleness by owner death, not age | Age cannot prove a slow owner is gone; only unreadable content falls back to the 10 s window |
| The owner record hard-linked into place | A lock visible before its owner was written looked abandoned to a contender while its creator was paused |
| A `.break` mutex instead of rename-claim takeover | A renamed live lock had to be linked back, and a contender could create a lock in that gap, giving two owners |
| A timed-out lock acquisition skips the update (`persisted:false`) | An unlocked write would race the holder and lose an increment; failing open keeps the dispatch unblocked |
| Two concurrent advisor children, FIFO, with a queue deadline | Bounds process fan-out without letting a queued lookup outlive the bridge timeout |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite (`.opencode/plugins/tests`, tap) | PASS 503/503 (baseline 481) |
| Hook node:test (29 files, tap) | PASS 852/852 (baseline 836) |
| Hook vitest | PASS 217/217 (baseline 217) |
| Battery unit | PASS 51/51 (baseline 51) |
| `install-hooks.test.sh` | PASS 4 (new) |
| Mutation: each fix reverted | Every new test fails; see `scratch/mutation/revert-checks.txt` |
| Advisor signature timing | median 2.181 ms before, 0.235 ms after (`scratch/perf/advisor-signature.txt`) |
| Relaunch flags timing | median 87.765 ms before, 7.753 ms after, per 2000 calls (`scratch/perf/relaunch-flags.txt`) |
| Live scenarios v1 and v2 | session-cleanup, session-relaunch, system-skill-advisor (with killswitch) and system-spec-gate all exit 0 (`scratch/live-runs/`) |
| Luna review (gpt-6-luna max, read-only) | Six rounds; final round PASS on every change, no open P0 or P1 (`scratch/luna/`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A reused pid delays a lock break.** A dead owner whose pid an unrelated process has taken looks alive, so acquisition waits out its 2 s timeout and skips the update until the pid frees.
2. **A crashed breaker leaves a narrow race.** If a process dies holding the `.break` lock, two contenders retiring it can interleave so one removes the other's fresh break lock. Returning null after the retirement narrows the window but does not close it.
3. **The flags and digest caches trust stat identity.** A same-size rewrite that changes no mtime, ctime, size or inode within one timestamp tick is served stale until the next change.
4. **Three comment-accuracy notes from the last review stay open.** The lock temp-file sweep comment says age proves a temp is not in flight, when age only makes it eligible (a paused creator then skips its update). The break-lock comment says a break lock is never moved out from under a contender, which needs the dead-breaker exception. The bearer comment omits the 8-character run floor and the 16-character case threshold. The lock change used its fourth and last review round, so these are left for a reviewed follow-up.
5. **CI does not run the hook node:test files.** The 29 `.skilled/hooks` node:test files and `install-hooks.test.sh` run only locally; adding them to a workflow is follow-up work.
<!-- /ANCHOR:limitations -->
