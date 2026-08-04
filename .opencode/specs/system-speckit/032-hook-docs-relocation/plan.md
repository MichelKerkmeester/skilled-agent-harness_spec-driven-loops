---
title: "Implementation Plan: Hook Reference Docs Relocation"
description: "Verify ownership, relocate four hook docs to their owning trees, repoint every consumer, audit links, and validate strictly."
trigger_phrases:
  - "hook relocation plan"
  - "injection contract move"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-hook-docs-relocation"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Executed the placement, relocation, and consumer-repoint phases"
    next_safe_action: "No follow-up required; packet verification is complete"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-system-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hook Reference Docs Relocation

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- The plan names the simplest viable approach, affected surfaces, and verification path.
- Phases match the stated scope; no setup theater that does not change the outcome.
FAILURE MODES:
- Moving before ownership evidence, missing consumers, and stale relative links.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs; git rename tracking |
| **Framework** | system-spec-kit skill tree, unified .opencode/hooks tree, system-skill-advisor hooks tree |
| **Storage** | None |
| **Testing** | grep sweeps, wikilink validation, validate.sh strict |

### Overview
Prove ownership of the four hook reference docs, move each into the tree that owns the behavior it documents, repoint every in-repo consumer from the old to the new path, audit relative links inside the moved docs, then prove by grep that the old path is gone from live content and validate the packet strictly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Four docs inventoried with purpose notes
- [x] Candidate owner trees identified with initial evidence
- [x] Placement matrix complete with per-doc owner evidence

### Definition of Done
- [x] All four docs at new paths, old paths gone
- [x] Zero live references to the old path strings
- [x] Strict validation exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ownership-based documentation relocation: each document moves next to the code or sibling docs it describes; consumers repoint; verification proves no residue.

### Key Components
- `.opencode/hooks/` — unified hook home; receives injection-contract.md at root and goal-plugin.md under goal/
- `system-skill-advisor/hooks/` — adapter owner; receives the two advisor hook contracts
- `system-spec-kit/references/hooks/` — emptied and removed
- Consumer files across skills, runtimes, and AGENTS.md — repointed

### Data Flow
A reader seeking a hook contract now starts in the tree that owns the hook: `.opencode/hooks/` for cross-runtime injection and the goal plugin, `system-skill-advisor/hooks/` for advisor adapters. No reader needs to know system-spec-kit internal layout to find hook contracts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| system-spec-kit/references/hooks/ | Hosts four foreign-owned docs | Empty and remove | test -e fails on old paths |
| .opencode/hooks/ | Unified hook tree, README points at foreign path | Receive two docs, repoint README | test -f at new paths; grep README |
| system-skill-advisor/hooks/ | Adapter tree with claude/ lib/ pi/ | Receive two advisor contracts | test -f at new paths |
| system-spec-kit SKILL.md, README, feature-catalog, changelog, ENV-REFERENCE, mcp-server hook READMEs, plugin-bridges README, constitutional | Consumers of the old path | Repoint text | grep old path string = zero |
| .cursor/hooks/README.md, AGENTS.md | Consumers of the old path | Repoint text | grep old path string = zero |
| Moved docs internal links | Relative to old location | Rewrite relative links | wikilink check + manual audit |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] T001 Inventory the four docs with purpose notes and owner candidates
- [x] T002 Build the placement matrix: per doc, owner tree, behavior evidence, decision
- [x] T003 Enumerate every live consumer of the old path strings via repo-wide grep

### Phase 2: Implementation
- [x] T004 Move the four docs with git mv
- [x] T005 Rewrite relative links inside the moved docs
- [x] T006 Repoint every consumer file
- [x] T007 Update AGENTS.md directive-capsule pointer

### Phase 3: Verification
- [x] T008 Grep sweep: old path strings absent from live content
- [x] T009 Wikilink and relative-link audit on moved docs
- [x] T010 validate.sh --strict on the packet, fix any errors
- [x] T011 Confirm scoped git status and no unrelated changes
- [x] T012 Record evidence in checklist and summary, close the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residue sweep | Old path strings repo-wide | grep -r for both old path forms, excluding .git and z_archive |
| Existence | New paths present, old paths absent | test -f / test -e |
| Links | Moved docs internal navigation | SPECKIT_VALIDATE_LINKS=true validation, relative-path audit |
| Static | Packet compliance | validate.sh --strict (exit 0) |
| Scope | No unrelated changes | git status scoped review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git | Internal | Green | Rename tracking and scope proof unavailable |
| system-spec-kit skill validation | Internal | Green | Leaf manifest drift undetected |
| grep / rg | Internal | Green | Residue proof impossible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any consumer breakage, validation failure, or operator disapproval of the new homes.
- **Procedure**: git revert the move commit (or git mv back), then restore the consumer repoints from the same revert. The four docs keep their content; only paths change.
<!-- /ANCHOR:rollback -->
