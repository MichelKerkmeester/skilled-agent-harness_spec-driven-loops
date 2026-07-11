---
title: "Feature Specification: 008-tier-d-documentation-execution (F4 + F6 + F37)"
description: "Execute the Tier D items from 007 deferred-decisions.md that have a clear actionable path: F4 .devin/hooks.v1.json migration, F6 OLD hook location deprecation banners, F37 catalog/playbook cross-reference table."
trigger_phrases:
  - "tier d execution"
  - "008 devin hooks migration"
  - "f4 f6 f37 execution"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/008-tier-d-documentation-execution"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded 008"
    next_safe_action: "Execute F4"
    blockers: []
    key_files:
      - ".devin/hooks.v1.json"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: 008-tier-d-documentation-execution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
007 deferred-decisions.md documented 5 Tier D items (F4, F6, F35, F36, F37) with rationale. Three have clear actionable paths once a human approves runtime config changes (F4, F6, F37). The other two (F35, F36) are recommended status-quo per the doc. The user asked to continue with remaining work.

### Purpose
Execute F4 (Devin hooks migration), F6 (OLD location deprecation banners), F37 (catalog/playbook cross-reference table). Leave F35 and F36 as status-quo per their recommendations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**F4 Devin hooks migration**: Update `.devin/hooks.v1.json` to point to NEW paths.
- UserPromptSubmit → `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` (skill-routing concern, belongs in system-skill-advisor)
- SessionStart → `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` (code-graph readiness concern, belongs in system-code-graph)
- Pivot from 007 deferred-decisions.md plan: the original plan said "build session-start.js at NEW system-skill-advisor location", but SessionStart is conceptually a code-graph hook (per its source-of-truth `// MODULE: Devin SessionStart Hook — Code Graph Startup Context` plus its `code-graph-boundary.js` import). The correct NEW location is system-code-graph, where a compiled artifact already exists.

**F6 OLD location deprecation banners**: Add deprecation banners to 3 existing OLD hook READMEs.
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md`
- Note: `system-spec-kit/mcp_server/hooks/devin/README.md` does not exist; will create with deprecation banner.

**F37 catalog/playbook cross-reference table**: Add a new section to `manual_testing_playbook.md` documenting the catalog group ↔ playbook category mapping with 1-to-many plus many-to-1 entries explicit.

### Out of Scope
- F35 catalog TOC renumber (status quo per deferred-decisions.md §5)
- F36 hooks-and-plugin file renumber (status quo per deferred-decisions.md §6)
- Any change to OLD hook source files (deprecation is documentation-only)
- Deletion of OLD hook location (90-day migration window must elapse first)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.devin/hooks.v1.json` | Modify | F4: migrate both hook entries to NEW paths |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md` | Modify | F6: add 2026-05-16 deprecation banner |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Modify | F6: same |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md` | Modify | F6: same |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/README.md` | Create | F6: missing file, create with deprecation banner |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Modify | F37: add cross-reference table section |
| `.opencode/skills/system-skill-advisor/references/deferred-decisions.md` | Modify | Mark F4/F6/F37 as Done with link to 008 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `.devin/hooks.v1.json` UserPromptSubmit points to system-skill-advisor NEW dist | `grep -c "system-skill-advisor.*user-prompt-submit"` returns 1 |
| REQ-002 | `.devin/hooks.v1.json` SessionStart points to system-code-graph NEW dist | `grep -c "system-code-graph.*session-start"` returns 1 |
| REQ-003 | All 4 OLD hook READMEs carry the 2026-05-16 deprecation banner | `grep -lr "DEPRECATED 2026-05-16"` returns 4 paths |
| REQ-004 | Playbook root carries the catalog ↔ playbook cross-reference table | new section visible with mapping rows for all 7 catalog groups |
| REQ-005 | deferred-decisions.md F4/F6/F37 status updated to Done | grep shows "Done as of 008" markers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on this child passes
- **SC-002**: `.devin/hooks.v1.json` parses as valid JSON post-edit
- **SC-003**: All 9 packets (parent + 001-008) pass strict-validate
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `.devin/hooks.v1.json` edit breaks Devin runtime | High | Validate JSON parses post-edit; both NEW paths verified to exist; commit clean diff so rollback is single-file |
| Risk | OLD location consumers beyond visible runtime configs (test harnesses, internal scripts) | Medium | Deprecation banner is documentation-only; OLD files remain functional. 90-day window lets maintainers find any unseen consumers. |
| Dependency | system-code-graph dist contains session-start.js | Green | Verified at `.opencode/skills/system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` (8657 bytes, 2026-05-16) |
| Dependency | system-skill-advisor dist contains user-prompt-submit.js | Green | Verified at `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/devin/user-prompt-submit.js` (7002 bytes, 2026-05-16) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. F35 and F36 stay status quo per deferred-decisions.md §5 plus §6 recommendations.
<!-- /ANCHOR:questions -->
