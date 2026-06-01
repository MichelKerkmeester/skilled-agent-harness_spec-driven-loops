---
title: "Changelog: Runtime-agnostic session lifecycle scripts [006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts]"
description: "The session-lifecycle shell scripts now work across every AI CLI runtime instead of solely Claude Code, and the orphan sweeper no longer kills an operator's opencode run MCP children."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling`

### Summary

The session-lifecycle shell scripts now work across every AI CLI runtime instead of solely Claude Code, and the orphan sweeper no longer kills an operator's `opencode run` MCP children. The cleanup script was renamed from `claude-session-cleanup.sh` to `session-cleanup.sh` with a back-compat shim so existing callers keep working, and it resolves the session PID from whichever runtime env var is set. Cleanup is wired into each runtime's real session-end mechanism.

### Added

- Orphan sweeper generalized to multi-runtime preserve-tree that builds a live session tree across claude, opencode, codex, and gemini
- Operator-session preserves added for opencode run, codex exec, gemini, and devin, closing the hard-rule gap where these were incorrectly swept after 300 seconds
- Back-compat shim created at claude-session-cleanup.sh that execs the renamed session-cleanup.sh so existing callers keep working
- README updated to reflect the new script name and a per-runtime wiring table

### Changed

- post-commit messaging neutralized to remove Claude-specific language
- cleanup script renamed from claude-session-cleanup.sh to session-cleanup.sh via git mv to preserve history, multi-runtime PID fallback and neutral log env and comments added
- Claude settings.local.json Stop hook updated to point to session-cleanup.sh
- Gemini settings.json SessionEnd appends the cleanup call
- OpenCode session-cleanup.js plugin added for the dispose event

### Fixed

- Multi-runtime session-PID fallback resolves correctly from CLAUDE, OPENCODE, CODEX, or GEMINI env vars down to PPID

### Verification

- REQ-001 opencode-run preserve unit test PASS, preserve_reason maps opencode/codex/gemini/devin all to operator-*-preserve
- REQ-002 Claude cleanup PASS, Stop wire to session-cleanup.sh, shim execs renamed script with rc=0
- Syntax checks PASS, bash -n on sweeper/cleanup/shim/post-commit, node --check on session-cleanup.js
- Multi-runtime PID fallback PASS, CLAUDE/OPENCODE/CODEX/GEMINI correctly fall back to PPID
- JSON configs valid PASS, .claude/settings.local.json and .gemini/settings.json parse correctly
- Comment hygiene PASS, all changed scripts return rc=0
- git mv history PASS, commit shows the rename

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modified | Multi-runtime preserve-tree, operator-session preserves, closes opencode-run kill gap |
| `.opencode/scripts/claude-session-cleanup.sh → session-cleanup.sh` | Renamed | Runtime-agnostic session-PID + log env |
| `.opencode/scripts/claude-session-cleanup.sh` | Created | Back-compat shim execs the renamed script |
| `.opencode/scripts/git-hooks/post-commit` | Modified | Neutral messaging |
| `.claude/settings.local.json` | Modified | Stop hook to session-cleanup.sh |
| `.gemini/settings.json` | Modified | SessionEnd appends cleanup |
| `.opencode/plugins/session-cleanup.js` | Created | OpenCode dispose-event cleanup |
| `.opencode/scripts/README.md` | Modified | New name + per-runtime wiring table |

### Follow-Ups

- Codex and Devin have no session-end primitive. Their orphaned MCP helpers are reclaimed by the age-based orphan-mcp-sweeper.sh, not an on-exit hook.
- feature_catalog and manual_testing_playbook still reference the old script name. Deferred as a P2 follow-on. The README and all live wiring are updated.
