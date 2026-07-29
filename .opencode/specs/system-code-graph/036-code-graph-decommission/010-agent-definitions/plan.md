---
title: "Implementation Plan: Phase 10: agent-definitions"
description: "Stripped code-graph tool grants and search-routing prose from the eight agent definitions across all four runtime mirrors (OpenCode, Claude, Codex, Pi), and reduced the wedged-daemon fallback prose to the spec-memory daemon only."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/010-agent-definitions"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-010-agent-definitions"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: agent-definitions

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
| **Language/Stack** | Markdown (OpenCode/Claude/Pi) + TOML (Codex) |
| **Framework** | Agent definitions across four runtime mirrors |
| **Storage** | None |
| **Testing** | frontmatter/TOML parse, mirror parity diff |

### Overview
Removed graph tool grants and graph-first search prose from all eight agent definitions across the four regular-file mirrors (`.opencode`, `.claude`, `.codex`, `.pi`), keeping the three Markdown mirrors and the TOML mirror equivalent in intent. The wedged-daemon fallback prose was reduced to the spec-memory daemon only, matching the already-migrated `.claude` wording. `.cursor/agents/` is symlinked and needed no edit.
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
Four-mirror parity edit: each agent is a regular-file projection in `.opencode`, `.claude`, `.codex`, and `.pi`; `.cursor` is symlinked and follows automatically.

### Key Components
- **8 agents × 4 mirrors**: tool-grant lists and search-routing prose
- **Wedged-daemon fallback**: reduced to the spec-memory daemon only

### Data Flow
No agent in any runtime grants or documents a removed tool; the four mirrors carry equivalent intent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is a decommission of agent tool grants and routing prose across mirrors.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| agent tool grants | Granted graph tools | Removed in all 4 mirrors | no graph tool id in any definition |
| search-routing prose | Preferred structural search | Rewritten to name the replacement | prose names the phase 002 path |
| wedged-daemon fallback | Listed the removed daemon | Reduced to spec-memory daemon | matches migrated `.claude` wording |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerated the eight agents and confirmed the four regular-file mirrors (`.cursor` symlinked)

### Phase 2: Core Implementation
- [x] Removed graph tool grants from all eight agents in `.opencode`, `.claude`, `.codex`, `.pi`
- [x] Rewrote search-routing prose to name the replacement path
- [x] Reduced wedged-daemon fallback prose to the spec-memory daemon only

### Phase 3: Verification
- [x] Markdown frontmatter and TOML parse cleanly
- [x] Mirror parity: equivalent tool grants across the four runtimes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | frontmatter (Markdown) + TOML | runtime parsers |
| Manual | mirror parity diff across 4 runtimes | diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 replacement routing | Internal | Green | Supplies the guidance text that replaces graph-first search |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An agent must re-grant the tool (not expected).
- **Procedure**: Restore the grants and prose from git history across all four mirrors.
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
