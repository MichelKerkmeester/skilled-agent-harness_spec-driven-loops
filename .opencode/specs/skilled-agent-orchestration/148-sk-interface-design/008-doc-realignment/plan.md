---
title: "Implementation Plan: doc realignment to the parity keystone"
description: "Plan for realigning the sk-interface-design feature catalog, playbook, and README, and the mcp-magicpath READMEs, to the post-007 parity reality, via fresh opus markdown agents."
trigger_phrases:
  - "doc realignment plan"
  - "parity keystone doc alignment plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/008-doc-realignment"
    last_updated_at: "2026-06-14T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the doc-realignment plan"
    next_safe_action: "Validate and commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-008-doc-realignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: doc realignment to the parity keystone

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs |
| **Framework** | sk-doc templates; fresh opus markdown agents |
| **Storage** | `.opencode/skills/{sk-interface-design,mcp-magicpath}/` |
| **Testing** | `validate_document.py`, `package_skill.py` |

### Overview
Realign the skill docs that predate the 007 keystone so they reflect the parity protocol, fidelity loop, and helper, single-sourced to `claude_design_parity.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 007 shipped; the new reality identified
- [x] Affected doc surfaces inventoried

### Definition of Done
- [x] All affected docs realigned and sk-doc valid
- [x] Both skills `package_skill.py` valid
- [x] No duplicated protocol content
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three fresh opus markdown agents, each scoped to a distinct doc surface (no overlap); the orchestrator reconciles shared files and validates.

### Key Components
- **Agent A**: sk-interface-design feature_catalog.
- **Agent B**: sk-interface-design manual_testing_playbook + README.
- **Agent C**: mcp-magicpath README + scripts README.

### Data Flow
Each agent reads the post-007 reality + its doc, realigns it pointing to the single-source protocol, self-validates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-interface-design feature_catalog | New parity section | add (Agent A) | validate_document, count |
| sk-interface-design manual_testing_playbook + README | New parity scenarios + mention | add (Agent B) | validate_document, count |
| mcp-magicpath README + scripts README | Parity mention + helper docs | add (Agent C) | validate_document |
| SKILL.md / graph-metadata (both) | Already carry 007 hooks | unchanged | package_skill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory affected doc surfaces; scaffold 008

### Phase 2: Core Implementation
- [x] Dispatch three fresh opus markdown agents (catalog; playbook+README; mcp-magicpath READMEs)
- [x] Confirm no shared-file collisions (agents scoped; orchestrator reconciles)

### Phase 3: Verification
- [x] `package_skill.py` both skills; counts reconciled
- [x] `validate.sh --strict` on the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Document | Each realigned doc | `validate_document.py` |
| Skill | Both skills valid | `package_skill.py` |
| Count | catalog/playbook index vs files | inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../007-claude-design-parity-build` | Internal | Green (complete) | No new reality to align to |
| Fresh opus markdown agents | Internal | Green | No authoring |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc fails validation.
- **Procedure**: Revert the doc changes (git); they are additive doc edits.
<!-- /ANCHOR:rollback -->
