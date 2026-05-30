---
title: "Implementation Summary: Runtime-agnostic session lifecycle scripts"
description: "Summary of making the lifecycle scripts runtime-agnostic (in progress)."
trigger_phrases:
  - "runtime-agnostic lifecycle summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/034-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T11:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Packet scaffolded; implementation starting"
    next_safe_action: "Execute Phase 1-5"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 034-runtime-agnostic-session-lifecycle-scripts |
| **Completed** | In progress |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- **`post-commit`** messaging neutralized ("next MCP launcher boot" / "next agent session") — mechanism was already runtime-neutral.
- **`orphan-mcp-sweeper.sh`** generalized: `build_claude_tree`/`claude_tree_pids` → `build_session_trees`/`session_tree_pids`; preserve regex now `claude|opencode|codex|gemini`; explicit operator-session preserves added for `opencode run`, `codex exec`, `gemini` (beside `devin --print`); preserve-reason string `live-claude-session-tree` → `live-session-tree`. **Closes the hard-rule gap** where an operator's `opencode run` MCP children were swept after 300s.
- **`claude-session-cleanup.sh` → `session-cleanup.sh`** (`git mv`, history preserved): multi-runtime session-PID fallback (`CLAUDE`/`OPENCODE`/`CODEX`/`GEMINI` → `PPID`), neutral log env (`SESSION_CLEANUP_LOG_PATH`, old var honored) + comments. A thin `claude-session-cleanup.sh` shim execs the renamed script.
- **Per-runtime wiring**: Claude `.claude/settings.local.json` `Stop` → `session-cleanup.sh`; Gemini `.gemini/settings.json` `SessionEnd` appends the cleanup call; OpenCode dispose handled by extending the existing `.opencode/plugins/mk-spec-memory.js` `global.disposed`/`server.instance.disposed` handler (no second plugin — reuses the existing dispose subscription). Codex/Devin documented as sweeper-covered (no session-end primitive).
- **Docs**: `.opencode/scripts/README.md` updated to the new name + per-runtime wiring table.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in increasing-risk order with verification gates between phases. Phases 1–3 (messaging + sweeper + rename/shim) were committed and pushed as a tested checkpoint (`22db61bc44`) before the riskier Phase 4 live-config wiring, because a parallel session was observed reverting operator-sensitive files this session. `git mv` preserved the cleanup script's history. The OpenCode dispose wiring reused the existing `mk-spec-memory.js` plugin rather than adding a second plugin (avoids two handlers racing on the same dispose event).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| REQ-001 opencode-run preserve | DONE — `preserve_reason` unit test: `opencode run`→`operator-opencode-preserve`, `codex exec`→`operator-codex-preserve`, `gemini`→`operator-gemini-preserve`, `devin`→`operator-devin-preserve` |
| REQ-002 Claude cleanup works | DONE — shim execs `session-cleanup.sh` (rc=0); Claude Stop wire points at canonical name |
| bash -n all scripts | DONE — sweeper, session-cleanup, shim all syntax-clean |
| Shim delegation | DONE — `claude-session-cleanup.sh` execs renamed script, skip path rc=0 |
| PID fallback chain | DONE — resolves CLAUDE/OPENCODE/CODEX/GEMINI → PPID |
| JSON configs valid | DONE — `.claude/settings.local.json` + `.gemini/settings.json` parse |
| OpenCode plugin valid | DONE — `node --check` clean |
| comment hygiene | DONE — all changed scripts rc=0 |
| validate.sh --strict (034) | DONE — exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Codex and Devin expose no session-end primitive; their MCP cleanup relies on the age-based `orphan-mcp-sweeper.sh`, not an on-exit hook.
<!-- /ANCHOR:limitations -->
