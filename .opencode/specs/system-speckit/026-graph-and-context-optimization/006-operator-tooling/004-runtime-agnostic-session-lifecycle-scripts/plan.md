---
title: "Implementation Plan: Runtime-agnostic session lifecycle scripts"
description: "How to make the lifecycle scripts runtime-agnostic safely: neutral messaging, rename+shim, generalize the sweeper preserve-tree (close the opencode-run kill gap), and per-runtime cleanup wiring by real capability."
trigger_phrases:
  - "runtime-agnostic lifecycle plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T11:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Captured apply plan"
    next_safe_action: "Start with post-commit messaging (lowest risk)"
    blockers: []
    key_files: [".opencode/scripts/orphan-mcp-sweeper.sh"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (lifecycle scripts, git hooks); JS (OpenCode plugin); JSON (runtime hook configs) |
| **Framework** | `.opencode/scripts/` lifecycle tooling + per-runtime hook configs |
| **Testing** | `shellcheck` / `bash -n`; sweeper `--dry-run --verbose` against a live `opencode run`; hook smoke per runtime |

### Overview
Make shared lifecycle logic runtime-agnostic in increasing-risk order: messaging (cosmetic) → sweeper preserve-tree (additive safety, closes the kill gap) → rename + shim → per-runtime wiring (live configs). Claude Code behavior is preserved throughout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each script's Claude-specificity classified (functional vs cosmetic) by investigation
- [x] Per-runtime session-end capability mapped (Claude Stop, Gemini SessionEnd, OpenCode dispose plugin, Codex/Devin none)
- [x] All script references inventoried for rename safety

### Definition of Done
- [ ] shellcheck clean on changed scripts
- [ ] Sweeper preserves a live `opencode run` tree (dry-run proof)
- [ ] Cleanup wired per runtime; Claude unchanged
- [ ] Live docs updated; validate.sh --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime detection by env-var fallback chain + multi-runtime process-tree preservation; cleanup invoked by each runtime's native session-end event, with the sweeper as the cross-runtime safety net.

### Key Components
- **session-cleanup.sh** (renamed): session-scoped MCP-descendant TERM, PID resolved from any runtime's env var.
- **orphan-mcp-sweeper.sh**: scans all MCP processes; preserves every live session tree (claude|opencode|codex|gemini) + explicit operator commands.
- **Per-runtime wires**: Claude `.claude/settings.json` Stop; Gemini `.gemini/settings.json` SessionEnd; OpenCode `.opencode/plugins/session-cleanup.js` dispose.

### Data Flow
Session ends → runtime fires its session-end event → cleanup walks that session's MCP descendants and TERMs them. Orphans missed by any runtime (Codex/Devin, crashes) → swept later by the age-based sweeper, which now preserves all live operator trees.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Messaging (cosmetic, reversible)
- [ ] `post-commit` L5 + L70: "next Claude Code session" → "next MCP launcher boot / next agent session"

### Phase 2: Sweeper generalization (additive safety — closes REQ-001)
- [ ] Rename `build_claude_tree`/`claude_tree_pids` → `build_session_trees`/`session_tree_pids`
- [ ] L284 regex → `(^|/)(claude|opencode|codex|gemini)( |$)|Claude Code`
- [ ] `preserve_reason()`: add `*"opencode run"*`, `*"codex exec"*`, `*"gemini"*` preserves beside `devin --print`
- [ ] Rename preserve string `live-claude-session-tree` → `live-session-tree`

### Phase 3: Rename + generalize cleanup
- [ ] `git mv claude-session-cleanup.sh session-cleanup.sh`
- [ ] PID fallback chain (Claude first → unchanged for Claude); `SESSION_CLEANUP_LOG_PATH` env (honor old var); neutral comments + log filename
- [ ] Create `claude-session-cleanup.sh` thin shim → `exec session-cleanup.sh`

### Phase 4: Per-runtime wiring
- [ ] Claude: move cleanup wire into committed `.claude/settings.json` Stop → `session-cleanup.sh`; de-dupe local override
- [ ] Gemini: append `bash .opencode/scripts/session-cleanup.sh || true` to `.gemini/settings.json` SessionEnd command
- [ ] OpenCode: create `.opencode/plugins/session-cleanup.js` running cleanup on dispose (verify it can't fire mid-session)
- [ ] Document Codex/Devin sweeper-fallback in the script header + packet

### Phase 5: Docs + verify
- [ ] Update README + feature_catalog + playbook to the new name
- [ ] shellcheck; sweeper dry-run proof; per-runtime smoke; validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Lint | changed scripts | shellcheck / bash -n |
| Hard-rule (REQ-001) | sweeper vs live `opencode run` | `--dry-run --verbose`, assert preserve |
| Back-compat | shim path | run `claude-session-cleanup.sh`, assert it execs the new script |
| Per-runtime smoke | Claude Stop, Gemini SessionEnd, OpenCode dispose | trigger each, confirm cleanup log line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| shellcheck | Tooling | Optional | Fall back to `bash -n` |
| Parallel-session stability | Environment | Volatile this session | Re-verify HEAD after each scoped commit |
<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

- Phase 1 (messaging) — independent; no dependants.
- Phase 2 (sweeper) — independent; closes REQ-001 on its own.
- Phase 3 (rename + shim) — must precede Phase 4 wiring (the wires point at the renamed script).
- Phase 4 (per-runtime wiring) — depends on Phase 3.
- Phase 5 (docs + verify) — depends on Phases 1–4.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Estimate |
|-------|----------|
| 1 Messaging | ~10m |
| 2 Sweeper | ~35m |
| 3 Rename + shim | ~25m |
| 4 Per-runtime wiring | ~45m |
| 5 Docs + verify | ~30m |
| **Total** | **~2.5h** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## 9. ENHANCED ROLLBACK

- All changes are `git revert`-able as a single commit; no data migration.
- `git mv` preserves history, so the rename reverses cleanly.
- The back-compat shim means even a partial rollback (script renamed but a wire missed) keeps cleanup functioning.
- Per-runtime config edits are isolated JSON additions — revert one runtime's wire without affecting others.

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- All changes are `git revert`-able; `git mv` preserves history so the rename reverses cleanly.
- The shim means even a partial rollback (script renamed, a wire missed) keeps cleanup functioning.
<!-- /ANCHOR:rollback -->
