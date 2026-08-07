---
title: "Feature Specification: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration/spec]"
description: "Pairing per program rule: allowlists, code-graph hook adapters (Claude/Codex) gain the CLI warm path, OpenCode plugin bridge repaired via CLI/IPC transport + CLI fallback, docs, dual-stack window"
trigger_phrases:
  - "code-index runtime integration"
  - "002 003-runtime-integration"
  - "code-index phase 3"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/003-runtime-integration"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-code-index-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-002-003-runtime-integration-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: Runtime Integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned (not implemented) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-hardening-and-tests |
| **Successor** | None |
| **Handoff Criteria** | Transport-down drill passes end-to-end in ≥2 runtimes; plugin functional; window observations recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the code-index dual-stack CLI implementation (workstream 002-code-index-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: Pairing per program rule: allowlists, code-graph hook adapters (Claude/Codex) gain the CLI warm path, OpenCode plugin bridge repaired via CLI/IPC transport + CLI fallback, docs, dual-stack window

**Dependencies**:
- Research authority: `../000-code-index-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Predecessor phase `002-hardening-and-tests/` shipped

**Deliverables**:
- Allowlist entries per runtime for the code-index shim
- Hook pairing (Claude Code, Codex)
- OpenCode plugin

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A working code-index CLI no runtime calls does not close the transport-down class — and the existing OpenCode plugin bridge (mk-code-graph-bridge.mjs) is currently non-functional from post-extraction import drift.

### Purpose
Wire the CLI into every runtime per the program-wide pairing rule: hooks for Claude Code/Codex plus a working OpenCode plugin, all warm-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Allowlist entries per runtime for the code-index shim
- Hook pairing (Claude Code, Codex): the code-graph-serving session adapters (`system-spec-kit/mcp_server/hooks/claude/session-prime`, `hooks/codex/session-start`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open, engaged on MCP-transport-down
- OpenCode plugin: repair `mk-code-graph-bridge.mjs` via a CLI/IPC-backed transport (the in-process import-only fix tried in 026/008 was reverted — it armed a direct-DB dual-writer; the bridge must never initialize the memory DB in-process), then add CLI fallback to the bridge
- Docs: transport-down fallback guidance + maintenance-command policy (scan/apply/verify never from prompt-time hooks)
- Dual-stack verification window with rollback notes (CLI is additive)

### Out of Scope
- MCP removal or reference migration — standing program non-goals
- Gemini and Devin pairing — excluded per the program rule; both framework surfaces were removed end-to-end (Gemini #132, Devin #142), so neither is an acceptance blocker
- Work owned by sibling phases (CLI features → phase 1; test suites → phase 2)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Runtime hook adapters + plugin bridge + configs + docs | Modify/Create | Pairing per program rule |
| Live runtime configs: `.claude/settings.local.json`, `.codex/hooks.json`, `.codex/settings.json` | Modify | Hook registration entries gaining the CLI path |
| MCP configs (diff-verified unchanged): `.codex/config.toml`, `.claude/mcp.json`, `opencode.json` | Verify | Dual-stack: registrations stay untouched |
| .opencode/plugins/mk-code-graph.js + plugin_bridges/mk-code-graph-bridge.mjs | Repair/Modify | Fix import drift, then add CLI fallback |
| .codex/config.toml (stale DB-path note) | Modify | Correct the code-index DB default note to the skill-local path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook pairing shipped for Claude Code and Codex | Each runtime's code-graph hook adapter demonstrates the CLI path once with the MCP transport stopped (warm-only, fail-open, within hook ceiling) |
| REQ-002 | OpenCode plugin repaired + CLI fallback shipped | mk-code-graph plugin loads, bridge imports resolve, and it serves a context surface via the CLI with MCP transport stopped |
| REQ-005 | Prompt-time dual-failure behavior pinned | With MCP stopped AND the code-index daemon socket absent/dead: hook warm-only path performs NO cold spawn, returns fail-open within the runtime hook timeout, and surfaces retryable status (exit 75 semantics) without blocking the prompt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Allowlists in at least two runtimes | Promptless invocation smoke check passes in Claude Code + one more runtime |
| REQ-004 | Dual-stack window observations recorded | Concurrent MCP+CLI use noted with zero contention incidents |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Transport-down drill passes end-to-end in ≥2 runtimes; plugin functional; window observations recorded
- **SC-002**: MCP surface untouched throughout (dual-stack) — existing clients work unchanged
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 002-hardening-and-tests shipped | Phase cannot start | Phase ordering enforced by parent handoff criteria |
| Risk | Scope drift beyond the delta specs | Med | Research deltas are the binding scope authority; new work needs operator sign-off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Delta specifications are pinned in `../000-code-index-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
