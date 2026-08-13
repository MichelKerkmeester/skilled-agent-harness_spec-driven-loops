---
title: "Feature Specification: Cross-runtime goal hooks + dispatch-shape coverage + OpenCode symlink mirror"
description: "Port the OpenCode passive session-goal system to cli-devin, cli-cursor and cli-pi via a runtime-neutral goal hook concern, activate the dormant hard_rules for those CLIs in the dispatch hook, and mirror the OpenCode plugins into the unified hooks tree."
trigger_phrases:
  - "goal hooks cross runtime"
  - "goal hook devin cursor pi"
  - "dispatch shape coverage"
  - "opencode plugin symlinks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime"
    last_updated_at: "2026-07-29T07:06:08Z"
    last_updated_by: "claude"
    recent_action: "All 8 phase children complete; packet closed out"
    next_safe_action: "Commit phase 008 + parent metadata on skilled/v4"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Codex excluded from the goal port by operator choice."
      - "Port scope: full parity attempt, honest per-runtime tiers fixed by live probes."
      - "State model: one shared active-goal file for non-OpenCode runtimes."
      - "Workspace: directly on skilled/v4.0.0.0."
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
# Feature Specification: Cross-runtime goal hooks + dispatch-shape coverage + OpenCode symlink mirror

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Type** | Phase parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Completed** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` (direct, per operator choice) |
| **Authority** | `cli-external-orchestration`, with touches in the unified `.opencode/hooks/` tree and per-runtime configs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

OpenCode sessions have a passive session-goal system (`mk-goal.js` plugin + `/goal:goal-opencode` command): an operator sets an objective once and every turn carries an `[active_goal]` brief keeping the agent on-target. Claude Code has an upstream-native `/goal`. Devin, Cursor and Pi sessions on this repo have nothing — a goal set for the work does not survive into those runtimes at all.

Two adjacent gaps ride along. The dispatch preflight/audit hooks recognize only `opencode run` and `claude -p` (plus a Codex-local shape), so `cli-devin`/`cli-cursor`/`cli-pi`'s already-declared `hard_rules:` are unreachable dead weight — a `devin -p`, `cursor-agent`, or `pi -p` dispatch is never rule-checked or audited. And the unified `.opencode/hooks/` tree shows every runtime's adapters except OpenCode's, whose plugin files must physically live in `.opencode/plugins/`.

Purpose: one packet delivering (a) a runtime-neutral goal hook concern with per-runtime adapters at each runtime's honest capability tier, (b) shared dispatch-shape coverage activating the dormant hard rules, and (c) an OpenCode symlink mirror inside the hooks tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: a new `.opencode/hooks/goal/` concern (shared `active-goal.json` state, mk-goal-compatible injection rendering with a parameterized Role line, ported hardening + heuristic verifier, manage CLI mirroring the `/goal:goal-opencode` router contract), live capability probes fixing each runtime's parity tier before any adapter code, per-runtime adapters wired into `.devin/hooks.v1.json` / `.cursor/hooks.json` / `.pi/extensions/` symlinks, shared `DISPATCH_SHAPES` extension (devin/cursor/pi + Codex fold-in) with regression tests, browsability symlinks for the OpenCode plugins, and the documentation/rename-fallout cleanup around the goal system.

Out of scope: Codex goal support (operator-excluded), any change to `mk-goal.js`'s own per-session behavior or state, and the OpenCode command's contract (it stays the OpenCode manage surface).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Delivers |
|-------|--------|--------|----------|
| 001 | `001-goal-core-and-state/` | Complete | Runtime-neutral goal core, shared state file, manage CLI, tests |
| 002 | `002-capability-probes/` | Complete | Live per-runtime probes; the capability matrix that fixes 003-005's scope |
| 003 | `003-devin-goal-hooks/` | Complete | Devin adapters (UserPromptSubmit inject, SessionStart restore, Stop verify/continue per 002) |
| 004 | `004-cursor-goal-hooks/` | Complete | Cursor adapters (sessionStart inject, optional preToolUse refresh, sessionEnd verify) |
| 005 | `005-pi-goal-hooks/` | Complete | Pi extension (input-transform inject, session_start restore, turn-end verify per 002) |
| 006 | `006-dispatch-shape-coverage/` | Complete | Shared DISPATCH_SHAPES for devin/cursor/pi + Codex fold-in + severity-mapping resolution + tests |
| 007 | `007-opencode-plugin-symlinks/` | Complete | opencode/ symlink rows in hooks-tree concern folders + README/tree updates |
| 008 | `008-goal-docs-hygiene/` | Complete | Rename-fallout fixes, injection-contract entries, goal-cross-runtime docs, concern README |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Whether Devin's `Stop` hook supports a blocking/continue decision (resolved by phase 002 probes; determines 003's parity tier).
- Whether Pi's typed event surface offers a usable turn-end event for verify/continue (resolved by phase 002).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related -->
## RELATED DOCUMENTS

- `.opencode/plugins/mk-goal.js` — the reference implementation being ported.
- `.opencode/commands/goal/goal-opencode.md` — the OpenCode manage-surface contract the new CLI mirrors.
- `.opencode/skills/system-spec-kit/references/hooks/goal-plugin.md` — the existing goal-plugin contract (updated in phase 008).
- `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` — per-runtime goal routing rule (updated in phase 008).
- `.opencode/skills/system-spec-kit/references/hooks/injection-contract.md` — visibility taxonomy the new hooks register into.
- `.opencode/hooks/README.md` — the unified hooks tree gaining the `goal/` concern and `opencode/` symlink rows.
<!-- /ANCHOR:related -->
