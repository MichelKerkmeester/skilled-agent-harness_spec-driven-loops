---
title: "Implementation Plan: markdown agent rename"
description: "Rename create documentation agent identity to markdown agent across runtime mirrors and references."
trigger_phrases:
  - "markdown agent rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/003-markdown-agent-rename"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented markdown agent rename across runtime mirrors and create-command references"
    next_safe_action: "Run final verification and save continuity"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: markdown agent rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation and OpenCode runtime metadata |
| **Framework** | OpenCode skills, agents, commands |
| **Storage** | Repository files |
| **Testing** | Exact search, file existence checks, spec validation |

### Overview
Rename create documentation agent identity to markdown agent across runtime mirrors and references.
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
- [x] Verification searches passing
- [x] Docs updated and validation run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first documentation maintenance with exact reference verification.

### Key Components
- **Spec docs**: define phase scope and acceptance criteria.
- **Resource map**: records read/write paths and verification commands.

### Data Flow
Implementation reads current docs, applies scoped file changes, then verifies references and records evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Documentation paths | Source of routing and usage guidance | Update in scope | Exact path search |
| Runtime references | Agent and command routing docs | Update where applicable | Exact identity search |

Required inventories:
- Same-class producers: run exact searches listed in resource-map.md.
- Consumers of changed paths: inspect search hits before editing.
- Matrix axes: runtime surface, command surface, skill docs, root docs.
- Algorithm invariant: do not change command names when only agent identity is in scope.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Review resource-map.md
- [x] Inventory current files
- [x] Confirm out-of-scope surfaces

### Phase 2: Core Implementation
- [x] Locate runtime create.md files.
- [x] Search requested scopes for agent identity references.
- [x] Classify each match as agent identity or command reference.

### Phase 3: Verification
- [x] Run exact searches
- [x] Run spec validation
- [x] Record handoff notes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search | References and identities | rg |
| File | Expected paths | test or directory listing |
| Validation | Spec folder | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Previous phase handoff | Internal | Planned | Later phases may reference stale paths. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Search or validation failures after implementation.
- **Procedure**: Revert only files changed in this phase, then rerun exact searches.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Parent packet -> Phase 1 -> Phase 2 -> Phase 3
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Current phase | Prior handoff when listed | Next phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-60 minutes |
| Core Implementation | Medium | 1-3 hours |
| Verification | Medium | 30-60 minutes |
| **Total** | | **2-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git status reviewed
- [ ] Change scope confirmed
- [ ] Verification command ready

### Rollback Procedure
1. Revert phase files from git.
2. Re-run exact searches.
3. Re-run spec validation.
4. Document any unresolved references.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-only git rollback.
<!-- /ANCHOR:enhanced-rollback -->
