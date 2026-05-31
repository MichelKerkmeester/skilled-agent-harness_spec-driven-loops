# Changelog — 004: runtime-agnostic session-lifecycle scripts

**Shipped**: 2026-05-29 (95% — P2 doc refresh deferred)
**Commit**: `(see git history)`

## What Changed

- `.opencode/scripts/orphan-mcp-sweeper.sh`: multi-runtime preserve-tree — closes a hard-rule gap where the sweeper killed operator-owned `opencode run` MCP children
- `.opencode/scripts/claude-session-cleanup.sh` → `session-cleanup.sh`: renamed runtime-neutral with a back-compat shim
- `.opencode/scripts/git-hooks/post-commit`: neutral wiring
- `.claude/settings*.json`, `.gemini/settings.json`: Stop / SessionEnd wiring
- `.opencode/plugins/session-cleanup.js`: new OpenCode dispose bridge

## Why

The `.opencode/scripts/` session-lifecycle scripts were Claude-only (Claude-specific messaging + the orphan sweeper killing other runtimes' MCP children). Generalizing them lets all AI CLI runtimes (Claude, OpenCode, Codex, Gemini) share one lifecycle path safely.

## Verification

- Orphan sweeper preserves operator-owned `opencode run` children: PASS
- Session-cleanup rename + back-compat shim: PASS
- Cross-runtime wiring (Claude / OpenCode / Codex / Gemini): PASS
- Known limitation: P2 doc refresh (feature_catalog / playbook) deferred
