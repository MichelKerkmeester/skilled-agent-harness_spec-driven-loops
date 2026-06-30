---
title: "Feature Specification: Runtime-agnostic session lifecycle scripts"
description: "Make the session-lifecycle shell scripts work across all AI CLI runtimes (Claude Code, OpenCode, Codex, Gemini) instead of solely Claude Code: neutral messaging, rename the cleanup script, generalize the orphan sweeper's preserve-tree (closing a hard-rule gap where operator-owned `opencode run` MCP children were killed), and wire cleanup into each runtime via its real session-end mechanism."
trigger_phrases:
  - "runtime-agnostic session lifecycle scripts"
  - "session-cleanup orphan-sweeper multi-runtime"
  - "opencode run sweeper kill gap"
  - "de-claude lifecycle scripts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts"
    last_updated_at: "2026-05-30T11:35:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped + pushed all phases"
    next_safe_action: "Optional P2 doc refresh"
    blockers: []
    key_files:
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
      - ".opencode/scripts/session-cleanup.sh"
      - ".opencode/scripts/git-hooks/post-commit"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Feature Specification: Runtime-agnostic session lifecycle scripts

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (feature_catalog/playbook doc refresh deferred as P2 follow-on) |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
| **Parent Spec** | (standalone tooling packet) |
| **Handoff Criteria** | Lifecycle scripts carry no Claude-only assumptions in shared logic; the orphan sweeper preserves operator `opencode run` / `codex` / `gemini` sessions (never kills them); cleanup fires under every runtime that exposes a session-end mechanism; Claude Code behavior is unchanged. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The session-lifecycle shell scripts under `.opencode/scripts/` were written for Claude Code only. Three concrete problems:
1. **`orphan-mcp-sweeper.sh` has a hard-rule violation.** It builds a preserve-tree only for *Claude* processes (`pgrep -f '(^|/)(claude)( |$)|Claude Code'`). An operator running `opencode run` spawns MCP helpers that are NOT in that tree, so once they age past `ORPHAN_AGE_MIN_SEC` (300s) the sweeper kills them — directly violating the standing rule "never kill operator-owned `opencode run` sessions."
2. **`claude-session-cleanup.sh` is Claude-named and Claude-wired.** Its filename, env vars (`CLAUDE_SESSION_PID`), and the only hook that invokes it (`.claude/settings.local.json` Stop) are Claude-specific, so other runtimes get no MCP-descendant cleanup on session end.
3. **`post-commit` messaging** says "next Claude Code session" although the mechanism (invalidate code-graph DB, rely on the launcher to rescan) is runtime-neutral and fires under any runtime.

### Purpose
Make the shared lifecycle logic runtime-agnostic and stop naming Claude Code where the behavior is universal, while preserving Claude Code's working wiring and honoring the per-runtime reality that only some runtimes expose a session-end hook.

> **Already neutral (no change):** `git-hooks/pre-commit`, `install-git-hooks.sh`, `copy-skill-advisor-dist-data.sh` carry zero Claude-specific logic — confirmed by investigation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Neutralize Claude-only *messaging* in `post-commit`.
- Rename `claude-session-cleanup.sh` → `session-cleanup.sh` with a back-compat shim; generalize its session-PID + log env resolution across runtimes.
- Generalize `orphan-mcp-sweeper.sh`'s preserve-tree to all runtimes and add explicit operator-session preserves (`opencode run`, `codex exec`, `gemini`) — closing the kill gap.
- Wire cleanup into each runtime's real session-end mechanism: Claude `Stop` (move to committed settings), Gemini `SessionEnd`, OpenCode dispose plugin. Document that Codex/Devin (no session-end primitive) rely on the sweeper.
- Update live docs that reference the renamed script.

### Out of Scope
- Forcing a session-end hook onto Codex/Devin (no safe primitive exists; the sweeper covers them).
- Editing historical spec packets that reference the old script name (provenance preserved; the compat shim covers runtime calls).
- A unified runtime-hook installer (possible follow-on).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/post-commit` | Modify | Neutral messaging ("next MCP launcher boot") |
| `.opencode/scripts/claude-session-cleanup.sh` | Rename → `session-cleanup.sh` + shim | Multi-runtime session-PID + log env; neutral comments |
| `.opencode/scripts/session-cleanup.sh` | Create (via rename) | Runtime-agnostic cleanup |
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Modify | Multi-runtime preserve-tree; operator-session preserves; closes opencode-run kill gap |
| `.claude/settings.json` | Modify | Move cleanup wire here (committed); point at `session-cleanup.sh`; de-dupe local override |
| `.gemini/settings.json` | Modify | Append cleanup to the existing `SessionEnd` command |
| `.opencode/plugins/session-cleanup.js` | Create | OpenCode dispose-event cleanup bridge |
| `.opencode/scripts/README.md` (+ feature_catalog, playbook) | Modify | Reflect new script name + multi-runtime behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sweeper never kills operator `opencode run` sessions | A dry-run with a live `opencode run` present logs `action=preserve reason=live-session-tree` for its MCP descendants; zero `action=kill` against them |
| REQ-002 | Claude Code cleanup keeps working | Claude `Stop` still triggers MCP-descendant cleanup after the rename (via shim or updated wire) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Cleanup script is runtime-neutral | `session-cleanup.sh` resolves the session PID from any runtime's env var (CLAUDE/OPENCODE/CODEX/GEMINI) then PPID; neutral comments + log filename |
| REQ-004 | Back-compat preserved | `claude-session-cleanup.sh` remains as a thin shim that execs `session-cleanup.sh` |
| REQ-005 | Cleanup wired per runtime by real capability | Claude `Stop` + Gemini `SessionEnd` invoke cleanup; OpenCode dispose plugin invokes cleanup; Codex/Devin documented as sweeper-covered |
| REQ-006 | No stray Claude-Code references in shared logic | `git grep -i "claude code"` over the changed scripts returns only intentional back-compat/Claude-specific lines |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Live docs updated | README + feature_catalog + playbook cite `session-cleanup.sh` and the multi-runtime behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `shellcheck` passes on all changed scripts.
- **SC-002**: Sweeper dry-run preserves a live `opencode run` MCP tree (REQ-001 proof).
- **SC-003**: Claude `Stop` cleanup verified working post-rename; Gemini `SessionEnd` + OpenCode plugin invoke cleanup.
- **SC-004**: `validate.sh --strict` on this packet exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing live hook configs (`.claude`, `.gemini`, OpenCode plugin) | A bad hook could kill live MCP servers mid-session | Cleanup is session-scoped (walks descendants of the ending session only); OpenCode plugin fires only on dispose; test each wire |
| Risk | Renaming a script referenced by a live hook | Cleanup silently stops firing | Back-compat shim + update the Claude wire in the same change |
| Risk | A parallel session reverts edits to operator-sensitive scripts | Lost work | Test-gated; scoped atomic commits (`git commit -F - -- <paths>`); re-verify HEAD after commit |
| Dependency | `shellcheck` available | Lint gate | If absent, fall back to `bash -n` syntax check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Session cleanup completes well within the runtime hook timeout (Claude Stop 10s, Gemini SessionEnd 10s) — it only walks one session's descendants.
- **NFR-P02**: The orphan sweeper's per-process `lsof` listener check is bounded; the full sweep stays under a few seconds on a typical process table.

### Reliability / Safety
- **NFR-S01**: Cleanup is best-effort and never blocks or fails session teardown (`|| true` at every wire; plugin swallows errors).
- **NFR-S02**: The sweeper NEVER kills a live operator session of any runtime (claude/opencode/codex/gemini/devin) — preserve-tree + explicit command preserves.
- **NFR-S03**: Renames preserve git history (`git mv`); a back-compat shim keeps any unupdated caller working.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Process / session boundaries
- **No session PID set**: cleanup falls back to the hook process PPID; if that too is missing it logs `action=skip` and exits 0.
- **Operator runs `opencode run` with aged MCP children**: preserved via `operator-opencode-preserve` + the live-session tree (was the bug).
- **Stale orphan from a crashed Codex/Devin session**: no session-end hook fires, but the age-based sweeper reclaims it (the intended fallback).

### Compatibility
- **Old name still referenced somewhere**: `claude-session-cleanup.sh` shim execs the renamed script, so nothing breaks.
- **Runtime with no dispose/stop primitive**: documented as sweeper-covered rather than force-wired.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low-to-moderate. The change is mechanical generalization (identifier rename + regex broadening + additive preserve cases) plus three small per-runtime wire edits and one new ~40-line plugin. No new abstractions; logic risk concentrated in the sweeper preserve-tree (covered by the `preserve_reason` unit test) and the live hook-config edits (covered by JSON-parse + syntax gates). Reversible via `git revert`; `git mv` keeps history.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Codex/Devin session-end coverage is intentionally deferred to the sweeper (no safe runtime primitive).
<!-- /ANCHOR:questions -->
