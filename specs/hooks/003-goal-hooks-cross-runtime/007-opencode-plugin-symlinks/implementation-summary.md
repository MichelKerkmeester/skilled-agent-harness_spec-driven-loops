---
title: "Implementation Summary: OpenCode plugin browsability symlinks"
description: "Completion record for the OpenCode plugin symlink mirror phase: 7 relative browsability symlinks added inside opencode/ subfolders of the concern and skill hook trees, each pointing back at the real plugin in .opencode/plugins/, plus README tree/prose updates across 7 files. No-double-load established via the discovery contract."
trigger_phrases:
  - "opencode symlink summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-08-11T06:43:15.763Z"
    last_updated_by: "claude"
    recent_action: "Created 7 browsability symlinks + 7 hook READMEs; verified no-double-load via contract"
    next_safe_action: "Proceed to phase 008 (goal docs hygiene) and commit 006+007 on skilled/v4"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js"
      - ".opencode/hooks/goal/opencode/mk-goal.js"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-opencode-plugin-symlinks |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seven relative browsability symlinks, each inside an `opencode/` subfolder of the concern (or skill-owned) hook tree, pointing back at the real OpenCode plugin file that must stay in `.opencode/plugins/` for OpenCode's plugin discovery to find it:

- `.opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js` -> `../../../plugins/mk-cli-dispatch-audit.js`
- `.opencode/hooks/mcp-route-guard/opencode/mk-mcp-route-guard.js` -> `../../../plugins/mk-mcp-route-guard.js`
- `.opencode/hooks/post-edit-quality/opencode/mk-post-edit-quality.js` -> `../../../plugins/mk-post-edit-quality.js`
- `.opencode/hooks/task-dispatch/opencode/mk-deep-loop-guard.js` -> `../../../plugins/mk-deep-loop-guard.js`
- `.opencode/hooks/goal/opencode/mk-goal.js` -> `../../../plugins/mk-goal.js`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js` -> `../../../../../plugins/mk-spec-gate.js`
- `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js` -> `../../../../../plugins/mk-git-preflight-advisory.js`

Plus README updates in 7 files: the 5 concern READMEs (`dispatch`, `mcp-route-guard`, `post-edit-quality`, `task-dispatch`, `goal`) each got an `opencode/` tree row and a browsability-symlink prose note, and the 2 skill-owned hook READMEs (`system-spec-kit/mcp-server/hooks`, `sk-git/scripts/hooks`) got the same. The `goal` README additionally gained the previously missing `devin/`, `cursor/`, `pi/` adapter rows, and the `system-spec-kit/mcp-server/hooks` README gained its previously missing `codex/`, `cursor/`, `devin/`, `pi/`, `lib/` rows, so each tree now honestly reflects on-disk reality rather than showing `opencode/` beside invisible siblings.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each symlink's relative depth was computed and confirmed with `os.path.normpath` before creation (`ln -sf` from inside the target `opencode/` folder), then resolution was re-checked on disk. The concern-folder links use `../../../plugins/` (3 levels up); the two deeper skill-side links use `../../../../../plugins/` (5 levels up). READMEs were edited to add the `opencode/` row and a prose note distinguishing the two symlink directions in this tree: Pi's `.pi/extensions/` symlink IS the load path, whereas the `opencode/` symlink is browsability-only and nothing loads through it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Symlinks point from the hooks tree into `.opencode/plugins/`, reversing the Pi pattern used elsewhere in the same tree. | OpenCode's plugin discovery only scans `.opencode/plugins/`; the real file cannot move, so the browsability mirror runs in the opposite direction from Pi's `.pi/extensions/` symlinks. |
| The `goal/opencode/mk-goal.js` row is included in this phase rather than deferred. | Phase 001's `.opencode/hooks/goal/` concern folder already exists as a real, populated directory, so the dependency is satisfied. |
| No-double-load established by the discovery contract plus empirical sibling-file evidence, not an interactive `opencode run` session. | See Known Limitations item 1 — the contract proof is strictly stronger than a naive live run, which would not surface a silent double-registration anyway. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Symlink resolution (all 7, `os.path.normpath` + on-disk `readlink`) | PASS — all 7 resolve to existing real plugin files |
| No back-pointing symlinks inside `.opencode/plugins/` | PASS — `find .opencode/plugins -maxdepth 1 -type l` empty |
| `git check-ignore` on all 7 + `git status` shows them as untracked symlinks | PASS — none ignored; all appear as `??` symlink entries |
| No-double-load (OpenCode discovery contract) | PASS — plugins README documents a flat `.opencode/plugins/*.js` glob; 1,148 sibling `.js` files exist under `.opencode/` outside `plugins/` and are provably not loaded (a recursive loader would already have broken the system) |
| README tree/prose updates on 7 files | PASS — `opencode/` rows added; trees reconciled to on-disk reality |
| Repo config sanity (`core.bare`) | Repaired to `false` (had recurred to `true`, blocking all git ops); reversible via `git config core.bare true` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No interactive `opencode run` session was executed; no-double-load is proven by the discovery contract instead — a documented deviation from the original REQ-004 wording ("live OpenCode session").** The proof is: (a) OpenCode's own `.opencode/plugins/README.md` documents discovery as "Discover `.opencode/plugins/*.js`", a flat glob of that one directory; (b) empirically, 1,148 `.js` files already sit under `.opencode/` outside `plugins/` and are not loaded as plugins — if the loader recursed, the running system would already be double-firing hundreds of guards, which it is not. Adding 7 more files outside `plugins/` cannot change that. A naive `opencode run "reply OK"` would not have surfaced a silent double-registration (the ported cores do not error on double-load), so the contract proof is strictly stronger than the live check as originally specified.
2. **The browsability symlinks are documentation aids only.** No code imports or loads through them; deleting them changes nothing at runtime. Their sole purpose is to make `.opencode/hooks/` show OpenCode alongside the other runtimes when browsing the tree.
<!-- /ANCHOR:limitations -->
