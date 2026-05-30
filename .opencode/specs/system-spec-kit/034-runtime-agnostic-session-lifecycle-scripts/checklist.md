---
title: "Checklist: Runtime-agnostic session lifecycle scripts"
description: "QA verification for the runtime-agnostic lifecycle scripts packet."
trigger_phrases:
  - "runtime-agnostic lifecycle checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/034-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T11:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checklist authored"
    next_safe_action: "Verify items as phases complete"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:p0 -->
## P0 - Blockers (must pass)

- [x] CHK-001 Operator `opencode run` preserved — `preserve_reason` unit test returns `operator-opencode-preserve` (+ codex/gemini/devin); `build_session_trees` adds descendants to `session_tree_pids` → `live-session-tree` (REQ-001)
- [x] CHK-002 Claude `Stop` still triggers cleanup after the rename — wire points at `session-cleanup.sh`; shim also covers any old-name caller (REQ-002)
- [x] CHK-003 `bash -n` passes on every changed script (shellcheck not installed; `bash -n` used)
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## P1 - Required

- [x] CHK-004 `session-cleanup.sh` resolves session PID from CLAUDE/OPENCODE/CODEX/GEMINI then PPID — fallback chain test resolved to PPID when all unset (REQ-003)
- [x] CHK-005 `claude-session-cleanup.sh` shim execs `session-cleanup.sh` — verified rc=0 + skip line emitted (REQ-004)
- [x] CHK-006 Gemini `SessionEnd` appends cleanup; OpenCode dispose handler (mk-spec-memory.js) invokes cleanup (REQ-005)
- [x] CHK-007 Codex/Devin sweeper-fallback documented in the `session-cleanup.sh` header (REQ-005)
- [x] CHK-008 No unintended "Claude Code" references in shared logic — only intentional back-compat env var + shim remain (REQ-006)
- [x] CHK-009 `git mv` preserved history — commit shows `{claude-session-cleanup.sh => session-cleanup.sh}` rename
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## P2 - Nice to Have

- [x] CHK-010 `.opencode/scripts/README.md` updated to `session-cleanup.sh` + per-runtime wiring table (REQ-007). feature_catalog + playbook updates deferred (historical/secondary docs; tracked as follow-on).
- [x] CHK-011 `validate.sh --strict` on this packet exits 0
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:evidence -->
## Evidence Log

| Check | Evidence | Status |
|-------|----------|--------|
| (fill as completed) | | |
<!-- /ANCHOR:evidence -->
