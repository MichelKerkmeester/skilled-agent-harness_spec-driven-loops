---
title: "Feature Specification: Phase 3: Runtime Integration [system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration/spec]"
description: "Make the CLI adoptable: runtime allowlists, warm-only hook integration policy, packaging/install steps, transport-down fallback guidance, and the dual-stack verification window."
trigger_phrases:
  - "cli runtime integration"
  - "spec-memory allowlist"
  - "hook fallback cli"
  - "dual-stack rollout"
  - "runtime integration phase"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/001-spec-memory-cli/003-runtime-integration"
    last_updated_at: "2026-06-06T12:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase after 002-hardening-and-tests ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-spec-memory-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-003-runtime-integration-scaffold"
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
| **Handoff Criteria** | CLI callable from at least Claude Code + one more runtime under allowlist; fallback guidance published; dual-stack window observations recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Dual-stack spec-memory CLI implementation: daemon-backed CLI alongside the MCP registration specification.

**Scope Boundary**: Adoption surfaces only — allowlists, hook policy, packaging, fallback docs, rollout observation. No CLI code changes (phase 1) and no new test suites (phase 2) beyond integration smoke checks.

**Dependencies**:
- 002-hardening-and-tests green (safety properties regression-locked before exposure to runtimes)
- Runtime configs: Claude allowlist patterns, Codex hooks.json, OpenCode plugin/Bash surface

**Deliverables**:
- Per-runtime allowlist entries for the spec-memory shim
- Hook integration policy: warm-only at prompt-time hooks, cold spawn confined to SessionStart/prewarm/cron
- Packaging/install steps and AGENTS.md/skill fallback guidance (MCP-transport-down → shell out to the CLI)
- Dual-stack verification window with rollback notes

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A working CLI that no runtime is permitted to call does not close the incident class that motivated this program: when the MCP transport dies mid-session, agents need a pre-authorized, documented shell path to the daemon — otherwise they are still locked out until restart.

### Purpose
Wire the CLI into every runtime's permission surface with a hook-safe usage policy, so transport-down recovery and hook/cron/CI access work the day the dual-stack window opens.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Allowlist entries: Claude Code `Bash(node .opencode/bin/spec-memory.cjs *)` pattern and equivalents for Codex (approval policy) and OpenCode (plugin/Bash surface)
- **Hook pairing (Claude Code, Codex)**: extend the existing spec-memory-serving hook adapters (`system-spec-kit/mcp_server/hooks/claude/{session-prime,compact-inject,session-stop}`, `hooks/codex/session-start`) with a CLI-backed path — warm-only with `--timeout-ms`, fail-open, engaged on MCP-transport-down and available as preferred transport where measurement favors it
- **Codex live-registration rewiring**: `.codex/hooks.json` currently invokes the CLAUDE hook scripts (compact-inject/session-prime/user-prompt-submit), not the Codex adapters this phase targets — rewire or verify-and-document ownership, and smoke the CLI path against the LIVE hook file, not only the template
- **OpenCode plugin (NEW)**: create the missing spec-memory plugin (`.opencode/plugins/` + a `plugin_bridges/` bridge following the mk-skill-advisor pattern) so OpenCode sessions get continuity surfaces and transport-down recovery via the CLI; memory access in OpenCode is currently MCP-only
- Hook policy publication: prompt-time hooks call warm-only with `--timeout-ms` (budget ≈40–46ms p95 warm; ceilings ~3s); cold spawn only from SessionStart/prewarm/cron contexts; stale/no-op fallback guidance for timeout cases
- Packaging: bin wiring + install steps; verify shim works from a fresh checkout
- Fallback ergonomics: AGENTS.md/skill guidance for detecting MCP-transport-down and shelling out; exit-75 retry semantics for callers
- Dual-stack verification window: MCP + CLI in concurrent real use; record observations; rollback note (CLI is additive — disable by removing allowlist entries)

### Out of Scope
- Gemini and Devin pairing — excluded per the program rule; both framework surfaces were removed end-to-end (Gemini #132, Devin #142), so neither is an acceptance blocker. Revisit only on operator direction
- OpenCode first-class `tools:` permission gate — upstream/product item, ACCEPTED out-of-scope by research; dual-stack does not need it
- Migration of the measured 93-file/1,041-reference MCP surface — future packet, separately gated
- MCP deregistration — standing non-goal of the program

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Runtime permission configs (Claude/Codex/OpenCode) | Modify | Allowlist the spec-memory shim |
| system-spec-kit/mcp_server/hooks/{claude,codex}/* | Modify | CLI-backed warm-only path in the spec-memory-serving hook adapters |
| Live runtime configs: `.claude/settings.local.json`, `.codex/hooks.json`, `.codex/settings.json` | Modify | Hook registration entries gaining the CLI path |
| MCP configs (diff-verified unchanged): `.codex/config.toml`, `.claude/mcp.json`, `opencode.json` | Verify | Dual-stack: registrations stay untouched |
| .opencode/plugins/ (new spec-memory plugin) + plugin bridge | Create | OpenCode plugin following the mk-skill-advisor bridge pattern |
| AGENTS.md / relevant skill guidance | Modify | Transport-down fallback + hook policy text |
| package.json / install docs | Modify | Bin exposure + install verification steps |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Claude Code allowlist entry works | A Claude session invokes `spec-memory` via Bash without a permission prompt |
| REQ-002 | Hook policy published and honored | Prompt-time hook examples use warm-only + timeout; cold-spawn examples confined to SessionStart/cron |
| REQ-003 | Transport-down fallback documented | Guidance names the detection signal and the exact CLI invocation; verified once against a stopped MCP transport |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Second-runtime allowlist (Codex or OpenCode) | Same smoke check passes in that runtime |
| REQ-005 | Dual-stack window observations recorded | At least one week of concurrent MCP+CLI use noted in the phase summary with zero corruption/contention incidents |
| REQ-006 | Hook pairing shipped for Claude Code and Codex | Each runtime's spec-memory hook adapter demonstrates the CLI path once with the MCP transport stopped (warm-only, fail-open, within hook ceiling) |
| REQ-007 | OpenCode spec-memory plugin shipped | Plugin loads in an OpenCode session and serves a continuity surface via the CLI bridge with MCP transport stopped |
| REQ-008 | Prompt-time dual-failure behavior pinned | With MCP stopped AND the spec-memory daemon socket absent/dead: hook warm-only path performs NO cold spawn, returns fail-open within the runtime hook timeout, and surfaces retryable status (exit 75 semantics) without blocking the prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Transport-down recovery demonstrated end-to-end (kill MCP transport → CLI path keeps continuity operations working)
- **SC-002**: At least two runtimes can call the CLI under their permission systems without manual approval
- **SC-003**: Dual-stack window closes with zero daemon-contention incidents attributable to the CLI
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime permission models differ | Allowlist syntax per runtime | Per-runtime patterns already inventoried in research (run-1 KQ3/KQ4) |
| Risk | Hook callers ignore the warm-only policy | Med — prompt-time stalls | `--timeout-ms` default + documented stale/no-op fallback; policy text in the hook guidance itself |
| Risk | Fresh-checkout install drift | Low | Install verification step in packaging docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The upstream OpenCode `tools:` gate stays tracked at the transition-program level (028 parent), not in this phase.
<!-- /ANCHOR:questions -->
