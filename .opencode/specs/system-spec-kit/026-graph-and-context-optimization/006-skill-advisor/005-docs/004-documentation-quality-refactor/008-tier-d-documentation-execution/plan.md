---
title: "Implementation Plan: 008-tier-d-documentation-execution"
description: "Sequential execution of F4 hooks migration, F6 deprecation banners, F37 cross-reference table."
trigger_phrases:
  - "008 tier d plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/008-tier-d-documentation-execution"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored plan"
    next_safe_action: "Begin F4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 008-tier-d-documentation-execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config + Markdown |
| **Framework** | n/a |
| **Storage** | n/a |
| **Testing** | validate.sh --strict, JSON.parse on .devin/hooks.v1.json |

### Overview
Three small edits: 1 JSON config (Devin hooks), 4 markdown READMEs (3 modify + 1 create with deprecation banner), 1 markdown table (playbook cross-reference). Plus update deferred-decisions.md to mark items Done.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] NEW hook paths verified to exist
- [x] OLD READMEs catalogued (3 existing, 1 missing)
- [x] deferred-decisions.md provides target text for banners

### Definition of Done
- [ ] .devin/hooks.v1.json updated and parses
- [ ] 4 OLD READMEs carry deprecation banner
- [ ] Playbook root carries cross-reference table
- [ ] deferred-decisions.md F4/F6/F37 marked Done
- [ ] validate.sh --strict passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Atomic runtime-config edit (F4) plus documentation edits (F6, F37). No source code changes. No build step.

### Key Components
- `.devin/hooks.v1.json` (Devin runtime config)
- 4 OLD hook READMEs (system-spec-kit/mcp_server/hooks/*)
- `manual_testing_playbook.md` (playbook root)
- `references/deferred-decisions.md` (status update)

### Data Flow
n/a
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold 008 packet
- [x] Pre-flight: NEW hook paths exist, OLD READMEs catalogued

### Phase 2: Implementation
- [ ] F4: read .devin/hooks.v1.json, update both command strings to NEW paths, verify JSON parses
- [ ] F6: add deprecation banner to 3 existing READMEs (claude, codex, gemini)
- [ ] F6: create new README at system-spec-kit/mcp_server/hooks/devin/ with deprecation banner
- [ ] F37: add cross-reference table section to playbook root
- [ ] Update deferred-decisions.md to mark F4/F6/F37 status as Done

### Phase 3: Verification
- [ ] validate.sh --strict on 008
- [ ] node -e "JSON.parse(...)" on .devin/hooks.v1.json
- [ ] grep counts confirm all 4 READMEs carry banner
- [ ] Playbook cross-reference table renders (visual check)
- [ ] Refresh parent metadata + impl-summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON parse | .devin/hooks.v1.json | `node -e "JSON.parse(...)"` |
| Path-exists | New hook paths | `ls` |
| Strict validate | 008 packet | validate.sh --strict |
| Manual | Playbook table render | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| NEW hook artifacts exist | Internal | Green | Required for F4 |
| OLD READMEs exist (3 of 4) | Internal | Green | F4 banner targets ready; devin/README missing — create new |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: .devin/hooks.v1.json edit breaks Devin runtime (operator reports hook silently failing)
- **Procedure**: `git checkout HEAD -- .devin/hooks.v1.json` to revert to OLD paths. Devin reload picks up restored config.
<!-- /ANCHOR:rollback -->
