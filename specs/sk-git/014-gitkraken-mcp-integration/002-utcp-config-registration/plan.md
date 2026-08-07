---
title: "Implementation Plan: Phase 2: utcp-config-registration"
description: "Plan for adding the gitkraken manual_call_template to .utcp_config.json."
trigger_phrases:
  - "gitkraken utcp config plan"
  - "phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/002-utcp-config-registration"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase plan ahead of implementation"
    next_safe_action: "Apply the .utcp_config.json edit"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-utcp-config-registration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: utcp-config-registration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON configuration (Code Mode UTCP manual registry) |
| **Framework** | UTCP `manual_call_templates` array, `mcp` call_template_type |
| **Storage** | `.utcp_config.json` at repo root |
| **Testing** | `python3 -m json.tool` validity check; manual diff review |

### Overview
Append one new object to the `manual_call_templates` array in `.utcp_config.json`, using the `npx -y @gitkraken/gk mcp` stdio form resolved in phase 001. This is a single-file, additive-only edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Config shape resolved (phase 001 REQ-003)
- [x] Placement convention identified (alongside existing manuals)

### Definition of Done
- [x] `.utcp_config.json` parses as valid JSON
- [x] `gitkraken` entry present with the exact resolved shape
- [x] No other entries modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive JSON edit — no schema change, no new file.

### Key Components
- **`manual_call_templates` array**: existing list of MCP/tool registrations Code Mode discovers via `list_tools()`/`search_tools()`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `.utcp_config.json` immediately before editing (Four Laws: READ FIRST)

### Phase 2: Core Implementation
- [x] Add the `gitkraken` object to `manual_call_templates`

### Phase 3: Verification
- [x] Validate JSON parses
- [x] Confirm diff is scoped to the single new entry
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | Whole file | `python3 -c "import json; json.load(open('.utcp_config.json'))"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 config-shape decision | Internal | Green | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: JSON becomes invalid after the edit, or Code Mode fails to list the new manual.
- **Procedure**: Revert the single added object via `git checkout -- .utcp_config.json` (uncommitted) or a follow-up commit removing the entry; no other state is affected since this is additive-only.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
