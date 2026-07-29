---
title: "Implementation Plan: Phase 9: command-surface"
description: "Deleted the code-graph doctor route, stripped graph tool grants from the deep commands and create assets, and re-rendered the compiled command contracts from their compiler-owned sources rather than hand-editing them."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/009-command-surface"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-009-command-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: command-surface

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
| **Language/Stack** | Markdown command docs + YAML route assets + compiled contracts |
| **Framework** | OpenCode command surface (doctor, deep, create) |
| **Storage** | None |
| **Testing** | compiled-route guard (drift check), command asset integrity check |

### Overview
Deleted the code-graph doctor route and its manifest entry, cleared graph tool ids from the deep commands' allowed-tools and prose, and cleared boilerplate from the create assets. The key finding was that the compiled contracts' allowlists are compiler-owned: they are generated from sources, so the sources were fixed first and the contracts re-rendered, rather than hand-editing outputs that the next sync would overwrite.
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
Source-first contract regeneration: fix compiler-owned allowlists at the source, then re-render compiled contracts so source and output never drift.

### Key Components
- **Doctor route**: `doctor-code-graph.yaml` + `_routes.yaml` entry + `mcp-doctor.sh` + `doctor-mcp-*.yaml`
- **Deep commands**: `deep/*.md` allowed-tools and prose + `deep/assets/compiled/*.contract.md`
- **Create assets**: `create/assets/*.yaml` boilerplate

### Data Flow
No command routes to, grants, or documents a removed tool; every compiled contract matches a re-rendered source and the route guard reports no drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is a decommission of a command route plus allowlist regeneration. The compiler-owned allowlist was the hidden source of the drift risk.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| doctor route | Diagnosed the removed subsystem | Deleted + manifest entry removed | router resolves only existing assets |
| compiled contracts | Generated from sources | Re-rendered from fixed sources | route guard reports no drift |
| deep command allowlists | Granted graph tools | Source fixed, contracts regenerated | no graph tool id in allowed-tools |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identified that compiled-contract allowlists are compiler-owned (the hidden source of drift)

### Phase 2: Core Implementation
- [x] Deleted `doctor-code-graph.yaml` and removed its `_routes.yaml` entry
- [x] Cleared `mcp-doctor.sh` and `doctor-mcp-*.yaml` of the server
- [x] Removed graph tool ids from `deep/*.md` allowed-tools and prose
- [x] Cleared `create/assets/*.yaml` boilerplate
- [x] Fixed allowlists at source, then re-rendered compiled contracts

### Phase 3: Verification
- [x] Compiled-route guard passes with no drift after regeneration
- [x] Doctor router lists only routes that resolve; no command grants a removed tool
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Automated | compiled-contract drift | route guard |
| Automated | command asset referential integrity | integrity check |
| Manual | doctor router resolution | route manifest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 replacement routing | Internal | Green | Search-guidance text in command docs points somewhere real |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A command must re-grant the tool (not expected).
- **Procedure**: Restore the doctor route asset and manifest entry from git history and re-render contracts from the original sources.
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
