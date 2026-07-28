---
title: "Implementation Plan: Phase 8: deep-loop-and-skill-surface"
description: "Cleared code-graph references from the remaining skills (deep-loop, cli-external-orchestration, sk-doc, sk-code, mcp-code-mode), updated the mcp-code-mode route-guard code and tests, and removed the skills index table row."
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
    packet_pointer: "system-code-graph/036-code-graph-decommission/008-deep-loop-and-skill-surface"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-008-deep-loop-and-skill-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: deep-loop-and-skill-surface

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
| **Language/Stack** | Markdown docs + TypeScript route-guard code |
| **Framework** | OpenCode skills tree |
| **Storage** | None |
| **Testing** | mcp-code-mode route-guard suite |

### Overview
Swept the remaining skills for code-graph references, handling the three forms differently: rewrote prose, corrected routing data (skills index table, CLI skill listings), and updated actual route-guard code in `mcp-code-mode` along with its tests. Replaced worked examples in `sk-doc` so they keep teaching their original point without naming a removed skill, and removed graph steps from `sk-code` checklists and playbooks.
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
Three-form sweep: prose rewrite, routing-data correction, and live route-guard code update with tests.

### Key Components
- **Prose**: `system-deep-loop` docs and tool grants, `sk-code` checklists/playbooks
- **Routing data**: skills index table (`skills/README.md`), `cli-external-orchestration` roster listings
- **Live code**: `mcp-code-mode` route-guard source + tests
- **Examples**: `sk-doc` worked examples

### Data Flow
No surviving skill routes to, documents, or guards the removed subsystem; the mcp-code-mode suite stays green.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a `fix_bug` finding; this is a decommission sweep across the skill tree. The route-guard code change is the only live-code surface.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| mcp-code-mode route guard | Guarded a removed route | Updated code + tests | suite green before and after |
| skills index table | Listed the removed skill | Row removed | roster count consistent |
| skill docs/examples | Named graph tools | Rewritten/replaced | live-surface sweep clean |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventoried the three reference forms (prose, routing data, live code) across the skill tree

### Phase 2: Core Implementation
- [x] Cleared graph tool ids from `system-deep-loop` docs and grants
- [x] Updated `mcp-code-mode` route-guard code and tests
- [x] Replaced `sk-doc` worked examples that used the skill
- [x] Removed graph steps from `sk-code` checklists and playbooks
- [x] Updated `cli-external-orchestration` skill roster listings
- [x] Removed the skills index table row in `skills/README.md`

### Phase 3: Verification
- [x] mcp-code-mode suite green after the route-guard update
- [x] Live-surface sweep of the skills tree returns no reference outside the removed folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | mcp-code-mode route-guard | vitest |
| Manual | live-surface sweep of skills tree | `rg --hidden --no-ignore` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 replacement routing | Internal | Green | Gives doc edits a real target to point at |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A skill must reference the subsystem again (not expected).
- **Procedure**: Restore the removed prose/routing rows and route-guard entries from git history.
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
