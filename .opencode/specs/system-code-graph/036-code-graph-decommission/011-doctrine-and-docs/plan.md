---
title: "Implementation Plan: Phase 11: doctrine-and-docs"
description: "Rewrote project doctrine that mandated structural code search (Mandatory Tools table, Code Search Decision Tree, MCP roster, daemon fallback ladder in AGENTS.md/CLAUDE.md), removed the root README coverage, deleted the dedicated setup guide, and updated the bin/lib READMEs."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/011-doctrine-and-docs"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-011-doctrine-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: doctrine-and-docs

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
| **Language/Stack** | Markdown doctrine + README + install guides |
| **Framework** | Root instruction files (AGENTS.md/CLAUDE.md symlink), install-guides, bin/lib READMEs |
| **Storage** | None |
| **Testing** | `rg --hidden --no-ignore` sweep, symlink inode check |

### Overview
Rewrote the doctrine that mandated the code graph: the Mandatory Tools table, Code Search Decision Tree, MCP server roster, and daemon fallback ladder now state the truth (a 4-server roster and a Grep-based search tree). The root README's subsystem coverage was removed, the dedicated setup guide was deleted with its index entry, and the bin/lib READMEs were updated. AGENTS.md and CLAUDE.md are the same file via symlink, so the instruction file was edited once.
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
Doctrine rewrite in the present tense (no migration narrative), single-edit of a symlinked instruction file, and removal of a dedicated setup guide plus its index entry.

### Key Components
- **Doctrine**: AGENTS.md (= CLAUDE.md via symlink) — Mandatory Tools, Code Search Decision Tree, MCP roster, daemon fallback ladder, Quick Reference
- **Claude directive**: `.claude/CLAUDE.md` search-routing
- **Guides/READMEs**: root `README.md`, install-guides index + `SET-UP - Code Graph.md`, `bin/README.md`, `bin/lib/README.md`

### Data Flow
A reader following the Code Search Decision Tree reaches a tool that exists; no instruction file or README references the removed subsystem.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is a doctrine rewrite for a decommission. The symlink single-edit rule is the main structural risk.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| AGENTS.md / CLAUDE.md | Mandated the removed tool | Rewritten (4-server roster, Grep search tree) | edited once; symlink inode unchanged |
| setup guide + index | Documented the subsystem | Guide deleted, index entry removed | install-guides index resolves |
| bin/lib READMEs | Documented launcher/CLI/bridge | Updated | no reference to removed subsystem |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed AGENTS.md and CLAUDE.md share one inode (edit once)

### Phase 2: Core Implementation
- [x] Rewrote Mandatory Tools table, Code Search Decision Tree, MCP roster, daemon fallback ladder, Quick Reference in AGENTS.md
- [x] Rewrote the `.claude/CLAUDE.md` search-routing directive
- [x] Removed root README subsystem coverage
- [x] Deleted `SET-UP - Code Graph.md` and removed its install-guides index entry
- [x] Updated `bin/README.md` and `bin/lib/README.md`

### Phase 3: Verification
- [x] `rg --hidden --no-ignore` sweep: no instruction file or README references the removed subsystem
- [x] AGENTS.md and CLAUDE.md remain the same inode with one set of edits
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | doctrine + README + guide sweep | `rg --hidden --no-ignore` |
| Manual | symlink inode check | `ls -i` / `readlink` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 replacement routing | Internal | Green | The rewritten decision tree names a real replacement path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Doctrine must reference the subsystem again (not expected).
- **Procedure**: Restore the doctrine sections and setup guide from git history (edit the symlinked file once).
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
