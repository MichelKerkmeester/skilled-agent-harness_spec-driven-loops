---
title: "Implementation Plan: Phase 3: runtime-deregistration"
description: "Removed the mk_code_index MCP server registration from every runtime config surface plus the Claude PostToolUse hook and local Bash allowlist, so no runtime attempts to spawn the launcher."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/003-runtime-deregistration"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-003-runtime-deregistration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: runtime-deregistration

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON / TOML / Markdown config files |
| **Framework** | OpenCode / Claude / Codex / Pi runtime configs |
| **Storage** | None |
| **Testing** | `rg --hidden --no-ignore` sweep + JSON/TOML parse |

### Overview
Resolved the `.mcp.json` and `.cursor/mcp.json` symlinks to their real target (`.claude/mcp.json`) so each real file was edited once, then removed the `mk_code_index` server block from every runtime config and stripped the Claude PostToolUse freshness hook plus the local Bash allowlist entry. `.codex/config.toml` was already clean. Verified with a `--no-ignore` sweep returning no `mk_code_index` hit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-file surgery across five registration surfaces plus two hook/allowlist entries.

### Key Components
- **Runtime configs**: `opencode.json`, `.claude/mcp.json` (reached also via `.mcp.json` and `.cursor/mcp.json` symlinks), `.codex/config.toml`, `.pi/mcp.json`
- **Hook/allowlist**: `.claude/settings.json` PostToolUse entry, `.claude/settings.local.json` `code-index.cjs` entry

### Data Flow
With the blocks removed, no runtime resolves a launcher path for `mk_code_index`, so session start no longer attempts to spawn it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable: this phase is a decommission registration sweep, not a `fix_bug` finding. No producer/helper/policy behavior change; the change is removal of registration entries.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime configs | Registered the server | Removed | `rg --hidden --no-ignore mk_code_index` clean |
| PostToolUse hook / allowlist | Pointed into the skill folder | Removed | hook manifest + allowlist omit the entry |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resolved symlinks (`.mcp.json`, `.cursor/mcp.json` → `.claude/mcp.json`) and enumerated the real files
- [x] Confirmed `.codex/config.toml` already clean

### Phase 2: Core Implementation
- [x] Removed `mk_code_index` block from `opencode.json`
- [x] Removed block from `.claude/mcp.json` (covers the two symlinks)
- [x] Removed block from `.pi/mcp.json`
- [x] Removed PostToolUse freshness hook from `.claude/settings.json`
- [x] Removed `code-index.cjs` from `.claude/settings.local.json` allowlist

### Phase 3: Verification
- [x] `rg --hidden --no-ignore` sweep returns no `mk_code_index` in configs
- [x] JSON and TOML parse cleanly after edits
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Config sweep across all surfaces | `rg --hidden --no-ignore` |
| Parse | JSON / TOML validity | runtime parsers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 decision record | Internal | Green | Ratified the removal this phase executes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A runtime needs the server back (not expected; the decommission is the intended end state).
- **Procedure**: Re-add the `mk_code_index` registration block from git history into the relevant config file.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
