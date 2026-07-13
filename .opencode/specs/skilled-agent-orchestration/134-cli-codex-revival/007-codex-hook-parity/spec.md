---
title: "Feature Specification: Codex hook/plugin parity for cli-codex"
description: "Give every Claude hook and OpenCode plugin a correct Codex 0.144.2 match via thin codex adapters over runtime-neutral cores, installed into the user-global hooks file and verified live."
trigger_phrases: ["Codex hook parity", "cli-codex hooks", "codex parity adapters"]
importance_tier: important
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T17:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 spec after the Codex 0.144.2 capability spike"
    next_safe_action: "Implement the eight portable Codex guard adapters over their neutral cores"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Codex hook/plugin parity for cli-codex
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Capability spike complete; implementation in progress |
| **Created** | 2026-07-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-codex-hook-adapter-layer/spec.md` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Child 004 shipped only the four Codex session-lifecycle adapters (SessionStart, UserPromptSubmit, Stop, PreCompact). Claude runs roughly fourteen hooks across eight events and OpenCode mirrors them as plugins, so Codex has no match for the tool-level guards (spec-gate, dispatch lint and audit, post-edit quality, code-graph freshness), the extra SessionStart guards (worktree, git-hooks, dist-staleness), the Stop completion sentinel, or session cleanup. Codex therefore runs sessions without the safety and continuity guardrails the other two runtimes enforce.
### Purpose
Give every Claude hook and OpenCode plugin a correct Codex match: build a thin Codex adapter over each existing runtime-neutral core where Codex has the surface, document honestly where it does not, install the result where Codex actually reads it, and verify each with both fixture and live checks.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Thin `runtime/hooks/codex/` adapters over the six guard cores plus the two CLI-dispatch cores.
- Wiring the four runtime-neutral shell/Python session scripts into Codex lifecycle events.
- Codex-native handling for the two guards whose Claude surface does not exist under Codex.
- An idempotent installer that merges the versioned repo hook set into user-global `~/.codex/hooks.json`.
- Fixture (stdin-pipe) plus live `codex exec` verification and a cli-codex manual testing playbook.
### Out of Scope
- Rewriting any runtime-neutral hook core, Claude hook, or OpenCode plugin.
- Defining `.codex/config.toml` `[profiles.*]` for `codex exec -p` agent dispatch.
### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `<skill>/runtime/hooks/codex/**` | Create | Thin Codex guard adapters over neutral cores. |
| `.codex/hooks.json` | Modify | Versioned source-of-truth hook registration. |
| `.opencode/bin/install-codex-hooks.mjs` | Create | Idempotent merge into `~/.codex/hooks.json`. |
| `cli-codex/manual_testing_playbook/**` | Create | Per-hook manual verification steps. |
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Every ported adapter reuses its neutral core unchanged | Diff shows no behavioral change to any core; adapter only translates payload and response. |
| REQ-002 | Adapters fail open | Empty or malformed stdin and internal errors exit 0 with no crash. |
| REQ-003 | Hooks reach the runtime surface | The installer merges into `~/.codex/hooks.json`, preserving Superset entries; a live session fires the new events. |
### P1 - Required
| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-004 | Deny-capable guards block under Codex | spec-gate-enforce and dispatch-preflight-lint emit `permissionDecision: deny` and a live tool call is blocked. |
| REQ-005 | Honest scope for non-portable guards | The dormant route-guard state and the folded task-dispatch surface are documented, not faked. |
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- Each Claude hook and OpenCode plugin has a Codex adapter, a documented Codex-native equivalent, or a documented capability gap.
- Every adapter passes a fixture smoke and fails open; a representative set is confirmed live under `codex exec`.
- Neutral cores, Claude hooks, and OpenCode plugins remain byte-unchanged.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Hooks run on every Codex session | A broken adapter degrades all sessions | Fail-open by construction; additive wiring; live smoke before closeout. |
| Risk | `~/.codex/hooks.json` is user-global machine config | Overwrites Superset or user entries | Installer backs up first and merges, never replaces. |
| Dependency | Codex 0.144.2 hook contract | Wrong envelope silently no-ops | Pinned in the decision record from the binary schema and a live probe. |
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None blocking. Live deny-behavioral confirmation is folded into the Phase 5 test matrix; capability is already settled from the 0.144.2 binary schema (see `decision-record.md`).
<!-- /ANCHOR:questions -->
