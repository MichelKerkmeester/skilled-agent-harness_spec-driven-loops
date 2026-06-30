---
title: "Implementation Summary: Runtime-agnostic session lifecycle scripts [system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts/implementation-summary]"
description: "Summary of making the session-lifecycle scripts runtime-agnostic across all AI CLI runtimes."
trigger_phrases:
  - "runtime-agnostic lifecycle summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T12:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped + pushed; docs reconciled"
    next_safe_action: "Optional P2 doc refresh"
    blockers: []
    key_files: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-runtime-agnostic-session-lifecycle-scripts |
| **Completed** | 2026-05-30 |
| **Level** | 2 |
| **Commit** | `b9a4b74962` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The session-lifecycle shell scripts now work across every AI CLI runtime instead of solely Claude Code, and the orphan sweeper no longer kills an operator's `opencode run` MCP children.

### Orphan sweeper generalization

`orphan-mcp-sweeper.sh` previously preserved only a Claude process tree, so an operator's `opencode run` helpers were swept after 300s. It now builds a live-session tree across `claude|opencode|codex|gemini` (`build_session_trees` / `session_tree_pids`) and explicitly preserves `opencode run`, `codex exec`, and `gemini` operator commands alongside `devin --print`. This closes the hard-rule gap.

### Runtime-agnostic cleanup

`claude-session-cleanup.sh` became `session-cleanup.sh` (via `git mv`): it resolves the session PID from whichever runtime env var is set (`CLAUDE`/`OPENCODE`/`CODEX`/`GEMINI`) and falls back to PPID, with a neutral log env and comments. A thin `claude-session-cleanup.sh` shim execs the renamed script so existing callers keep working.

### Per-runtime wiring + messaging

Cleanup is wired into each runtime's real session-end mechanism (Claude Stop, Gemini SessionEnd, a new OpenCode dispose plugin); Codex/Devin have no session-end primitive and rely on the sweeper. `post-commit` messaging is now runtime-neutral.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modified | Multi-runtime preserve-tree; operator-session preserves; closes opencode-run kill gap |
| `.opencode/scripts/claude-session-cleanup.sh` → `session-cleanup.sh` | Renamed | Runtime-agnostic session-PID + log env |
| `.opencode/scripts/claude-session-cleanup.sh` | Created | Back-compat shim execs the renamed script |
| `.opencode/scripts/git-hooks/post-commit` | Modified | Neutral messaging |
| `.claude/settings.local.json` | Modified | Stop hook → session-cleanup.sh |
| `.gemini/settings.json` | Modified | SessionEnd appends cleanup |
| `.opencode/plugins/session-cleanup.js` | Created | OpenCode dispose-event cleanup |
| `.opencode/scripts/README.md` | Modified | New name + per-runtime wiring table |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in increasing-risk order (messaging → sweeper → rename/shim → per-runtime wiring → docs) with `bash -n` / `node --check` / `preserve_reason` unit-test gates between phases. After a parallel session repeatedly reverted operator-sensitive script edits, all changes were re-applied and committed atomically with a scoped pathspec (`b9a4b74962`), and HEAD content was re-verified after the commit. `git mv` preserved the cleanup script's history. The OpenCode dispose path shipped as a dedicated `session-cleanup.js` plugin after confirming the originally-planned target plugin did not exist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Generalize the sweeper preserve-tree to all runtimes | Closes the hard-rule violation where operator `opencode run` MCP children were swept after 300s |
| Rename cleanup script + keep a back-compat shim | Reflects runtime-agnostic reality; shim keeps existing wiring and any unupdated caller working |
| New `session-cleanup.js` plugin for the OpenCode dispose path | OpenCode has no JSON SessionEnd hook; the dispose event is its real session-end equivalent |
| Document Codex/Devin as sweeper-covered, not force-wired | Neither exposes a safe session-end primitive; a forced hook could kill live MCP servers |
| Hand-author the 034 docs to template conformance | `create.sh` auto-branched and misplaced the folder via the `specs` symlink; manual authoring was the safe path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 opencode-run preserve | PASS — `preserve_reason` unit test: opencode/codex/gemini/devin all → `operator-*-preserve` |
| REQ-002 Claude cleanup works | PASS — Stop wire → `session-cleanup.sh`; shim execs renamed script (rc=0) |
| Syntax | PASS — `bash -n` on sweeper/cleanup/shim/post-commit; `node --check` on session-cleanup.js |
| Multi-runtime PID fallback | PASS — CLAUDE/OPENCODE/CODEX/GEMINI → PPID |
| JSON configs valid | PASS — `.claude/settings.local.json` + `.gemini/settings.json` parse |
| Comment hygiene | PASS — all changed scripts rc=0 |
| git mv history | PASS — commit shows the rename |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex and Devin have no session-end primitive.** Their orphaned MCP helpers are reclaimed by the age-based `orphan-mcp-sweeper.sh`, not an on-exit hook.
2. **`feature_catalog` + `manual_testing_playbook` still reference the old script name.** Deferred as a P2 follow-on; the README and all live wiring are updated.
<!-- /ANCHOR:limitations -->
