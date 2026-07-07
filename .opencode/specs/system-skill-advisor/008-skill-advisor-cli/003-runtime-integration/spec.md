---
title: "Feature Specification: Phase 3: Runtime Integration [system-skill-advisor/008-skill-advisor-cli/003-runtime-integration/spec]"
description: "Pairing per program rule: prompt-submit advisor-brief hooks (Claude/Codex) gain the CLI warm path under the <60ms cache-hit p95 bar (D4), mk-skill-advisor plugin bridge gains CLI fallback, config compatibility (D7), doctor routes, docs"
trigger_phrases:
  - "skill-advisor runtime integration"
  - "003 003-runtime-integration"
  - "skill-advisor phase 3"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-cli/003-runtime-integration"
    last_updated_at: "2026-06-06T15:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded in planned state"
    next_safe_action: "Run speckit:plan on this phase when its predecessor ships"
    blockers: []
    key_files:
      - "spec.md"
      - "../000-skill-advisor-cli-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-003-003-runtime-integration-scaffold"
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
| **Handoff Criteria** | Transport-down drill passes in ≥2 runtimes within budget; plugin fallback works; docs published |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the skill-advisor dual-stack CLI implementation (workstream 003-skill-advisor-cli), paired with runtime hooks and the OpenCode plugin per the program-wide pairing rule.

**Scope Boundary**: Pairing per program rule: prompt-submit advisor-brief hooks (Claude/Codex) gain the CLI warm path under the <60ms cache-hit p95 bar (D4), mk-skill-advisor plugin bridge gains CLI fallback, config compatibility (D7), doctor routes, docs

**Dependencies**:
- Research authority: `../000-skill-advisor-cli-research/research/research.md` (GO verdict, delta specs, measurements) — premise, do not relitigate
- Predecessor phase `002-hardening-and-tests/` shipped

**Deliverables**:
- Hook pairing (Claude Code, Codex)
- OpenCode plugin
- Config compatibility

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor brief sits on the prompt-submit critical path in every runtime; pairing it with the CLI must respect the measured budget — the one-shot native bridge (824.8ms) stays banned.

### Purpose
Wire the skill-advisor CLI into every runtime per the program-wide pairing rule without regressing the prompt-time budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hook pairing (Claude Code, Codex): the UserPromptSubmit advisor-brief adapters (`system-skill-advisor/hooks/{claude,codex}/user-prompt-submit`) gain a CLI-backed warm-only path with `--timeout-ms`, fail-open; one-shot native bridge per prompt remains banned (824.8ms measured) — D4
- OpenCode plugin: `mk-skill-advisor-bridge.mjs` gains CLI fallback (bridge currently probes MCP; add the CLI path for transport-down)
- Config compatibility: MCP registrations across OpenCode/Codex/Claude stay unchanged (CLI is additive) — D7
- Doctor routes: add CLI checks to doctor:skill-advisor + skill-budget surfaces
- Allowlists + docs: transport-down fallback guidance; Gate-2 caller guidance (when skill_advisor.py legacy facade vs new CLI)

### Out of Scope
- Gemini and Devin pairing — excluded per the program rule; both framework surfaces were removed end-to-end (Gemini #132, Devin #142), so neither is an acceptance blocker. Revisit only on operator direction
- MCP removal or reference migration — standing program non-goals
- Work owned by sibling phases (CLI features → phase 1; test suites → phase 2)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Runtime hook adapters + plugin bridge + configs + docs | Modify/Create | Pairing per program rule |
| Live runtime configs: `.claude/settings.local.json`, `.codex/hooks.json`, `.codex/settings.json` | Modify | Hook registration entries gaining the CLI path |
| MCP configs (diff-verified unchanged): `.codex/config.toml`, `.claude/mcp.json`, `opencode.json` | Verify | Dual-stack: registrations stay untouched |
| .opencode/plugins/mk-skill-advisor.js + plugin_bridges/mk-skill-advisor-bridge.mjs | Modify | CLI fallback path in the working bridge |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook pairing shipped for Claude Code and Codex | Each runtime's advisor hook demonstrates the CLI path once with MCP stopped, under THREE separate checks: (a) cache-hit p95 <60ms, (b) warm-daemon non-cache call within a stated ceiling, (c) cold/transport-down path fails open within the runtime hook timeout |
| REQ-002 | OpenCode plugin CLI fallback shipped | Plugin serves the advisor brief via the CLI bridge with MCP transport stopped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Configs untouched | MCP registrations unchanged across all three runtime configs (OpenCode/Codex/Claude), diff-verified |
| REQ-004 | Doctor + Gate-2 guidance updated | doctor routes exercise the CLI; AGENTS/skill guidance names when to use facade vs CLI |
| REQ-005 | Prompt-time dual-failure behavior pinned | With MCP stopped AND the skill-advisor daemon socket absent/dead: hook warm-only path performs NO cold spawn, returns fail-open within the runtime hook timeout, and surfaces retryable status (exit 75 semantics) without blocking the prompt |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Transport-down drill passes in ≥2 runtimes within budget; plugin fallback works; docs published
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

- None blocking. Delta specifications are pinned in `../000-skill-advisor-cli-research/research/research.md`; remaining detail is planning-level.
<!-- /ANCHOR:questions -->
