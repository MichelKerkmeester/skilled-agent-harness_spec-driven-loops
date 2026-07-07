---
title: "Implementation Plan: Cross-skill decoupling + zero-table §1 + terse arch conform"
description: "Three-phase doc cleanup applied via targeted Edit + full Write rewrites."
trigger_phrases:
  - "005 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/005-cross-skill-documentation-decoupling"
    last_updated_at: "2026-05-16T12:33:24Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 3-phase plan"
    next_safe_action: "Execute Phase 1"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0050000000000000000000000000000000000000000000000000000000000006"
      session_id: "005-cross-skill-documentation-decoupling-plan"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-Skill Decoupling

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | system-spec-kit strict-validate (for the spec packet) |
| **Storage** | n/a (doc edits only) |
| **Testing** | grep sweeps + strict-validate |

### Overview
Phase 1 decouples 3 spec-kit docs via targeted Edit calls. Phase 2 zeros §1 tables via targeted Edit calls on 3 READMEs. Phase 3 fully rewrites 2 ARCHITECTURE.md files to match the spec-kit canonical template. Phase 4 scaffolds this packet, strict-validates, commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 1 inventory complete (26 cross-skill refs catalogued)
- [x] Phase 2 inventory complete (8 Section 1 tables across 3 READMEs)
- [x] Phase 3 template shape agreed (spec-kit becomes canonical post §5/§6 deletion)
- [x] User decisions locked (spec folder, voice rule, table policy, conform depth)

### Definition of Done
- [x] All 7 skill files edited per spec §3
- [x] Cross-skill grep returns 0 in 3 spec-kit files
- [x] Section 1 table count is 0 in each of 3 READMEs
- [x] Three ARCHITECTURE.md files have identical 9-row section list + same anchor names
- [x] Advisor + code-graph ARCHITECTURE.md each ≤220 lines
- [ ] Strict-validate child 005 exits 0
- [ ] Commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-phase doc edits + new spec packet. No new abstractions.

### Key Components
- spec-kit/ARCHITECTURE.md post-rewrite is the canonical 8-section template
- sed + Edit + Write for surgical to wholesale changes
- grep verification before commit

### Data Flow
Plan inventory → targeted Edits / Writes → grep + line-count verification → strict-validate packet → commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory cross-skill refs (26 hits) and Section 1 tables (8 across 3 READMEs)
- [x] Reverse-engineer spec-kit/ARCHITECTURE shape as canonical template

### Phase 2: Core Implementation
- [x] Phase 1 spec-kit/README.md: rewrite §1 OVERVIEW, drop sibling refs
- [x] Phase 1 spec-kit/mcp_server/README.md: scrub frontmatter + inline refs
- [x] Phase 1 spec-kit/ARCHITECTURE.md: full rewrite to canonical 8-section template
- [x] Phase 2 advisor/README.md: zero §1 tables
- [x] Phase 2 code-graph/README.md: zero §1 tables
- [x] Phase 3 advisor/ARCHITECTURE.md: full rewrite, terse target ≤210 lines
- [x] Phase 3 code-graph/ARCHITECTURE.md: full rewrite, terse target ≤220 lines

### Phase 3: Verification
- [x] grep cross-skill terms across 3 spec-kit docs returns 0
- [x] §1 table count is 0 in each of 3 READMEs
- [x] ARCHITECTURE section list identical across 3 files
- [x] Line-count check: advisor/code-graph ARCHITECTURE each ≤220 lines
- [ ] Strict-validate this packet exit 0
- [ ] Fill implementation-summary
- [ ] Commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Cross-skill terms across 3 spec-kit docs | `grep -niE` |
| Table count | Section 1 of 3 READMEs | `awk` + `grep -c` |
| Em-dash count | spec-kit/README.md | `grep -c '—'` |
| Strict-validate | Child 005 packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| spec-kit/ARCHITECTURE post-rewrite | Internal | Done | Template anchor for Phase 3 |
| Phase 1 exploration | Internal | Done | Inventory data |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh fails or grep sweep still shows cross-skill refs
- **Procedure**: `git checkout -- <files>` per touched skill file; packet folder stays for re-attempt
<!-- /ANCHOR:rollback -->
