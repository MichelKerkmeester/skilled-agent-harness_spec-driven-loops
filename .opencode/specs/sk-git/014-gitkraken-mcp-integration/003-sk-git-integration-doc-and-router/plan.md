---
title: "Implementation Plan: Phase 3: sk-git-integration-doc-and-router"
description: "Plan for authoring the GitKraken MCP reference doc and updating sk-git's SKILL.md router, triggers, references table, and safety rules."
trigger_phrases:
  - "gitkraken mcp doc plan"
  - "sk-git router update plan"
  - "phase 003 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/003-sk-git-integration-doc-and-router"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase plan ahead of implementation"
    next_safe_action: "Write the reference doc, then update SKILL.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/gitkraken_mcp_integration.md"
      - ".opencode/skills/sk-git/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-sk-git-integration-doc-and-router"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: sk-git-integration-doc-and-router

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documentation (spec-kit doc frontmatter + sk-git's own router pseudocode) |
| **Framework** | sk-git's Smart Router (INTENT_SIGNALS/RESOURCE_MAP pattern), matching `references/github_mcp_integration.md`'s structure |
| **Storage** | `.opencode/skills/sk-git/references/`, `.opencode/skills/sk-git/SKILL.md` |
| **Testing** | `validate.sh` on the phase folder; grep-based consistency checks against SKILL.md |

### Overview
Write one new reference doc and make four scoped edits to `SKILL.md` (intent signal, resource map, keyword triggers, references table, one new safety rule), all grounded in phase 001's verified tool inventory and resolved safety decision. This is documentation-and-router work — no runtime code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Tool inventory verified (phase 001)
- [x] Safety carve-out decision resolved (phase 001 REQ-004)
- [x] `.utcp_config.json` manual registered (phase 002)

### Definition of Done
- [x] `gitkraken_mcp_integration.md` created, mirroring `github_mcp_integration.md`'s section structure
- [x] `SKILL.md` router/triggers/references/rules updated per REQ-002 through REQ-004
- [x] `validate.sh` passes on the phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror-and-extend: copy the existing `github_mcp_integration.md` section shape, populate it with GitKraken-specific content, then extend `SKILL.md`'s existing router data structures (`INTENT_SIGNALS`, `RESOURCE_MAP`, keyword-trigger lists) with one more entry each — the same pattern the file already uses for `WORKSPACE_SETUP`/`COMMIT`/`FINISH`/`SHARED_PATTERNS`.

### Key Components
- **Reference doc**: tool selection guide (when to use GitKraken MCP vs. local git vs. GitHub MCP vs. `gh` CLI), available-tools table grouped by category, usage examples, error handling, safety carve-out section.
- **Router extension**: `GITKRAKEN_MCP` intent in `INTENT_SIGNALS` with weight comparable to existing intents (4, matching `WORKSPACE_SETUP`/`COMMIT`/`FINISH`); `RESOURCE_MAP["GITKRAKEN_MCP"] = ["references/gitkraken_mcp_integration.md"]`.
- **Safety rule**: one new numbered rule under §4 RULES cross-referencing the new doc, so the discipline is enforced at two levels (the reference doc's own Tool Selection Guide, and SKILL.md's authoritative rules list).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `github_mcp_integration.md` and `SKILL.md` immediately before editing (Four Laws: READ FIRST)

### Phase 2: Core Implementation
- [x] Write `references/gitkraken_mcp_integration.md` (REQ-001)
- [x] Add `GITKRAKEN_MCP` to `INTENT_SIGNALS` and `RESOURCE_MAP` in `SKILL.md` (REQ-002)
- [x] Add `gitkraken`/`gitlens` to the "Owned" keyword-triggers list in §1 (REQ-002)
- [x] Add the references-table row in §5 (REQ-003)
- [x] Add the local-git-mutation safety rule in §4 RULES (REQ-004)

### Phase 3: Verification
- [x] Run `validate.sh` on the phase folder
- [x] Grep-confirm the new rule text and router entries exist in `SKILL.md`
- [x] Manually diff the new doc's section headers against `github_mcp_integration.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Phase folder | `validate.sh` |
| Consistency grep | SKILL.md edits | `rg -n "GitKraken\|gitkraken\|gitlens" .opencode/skills/sk-git/SKILL.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 tool inventory + safety decision | Internal | Green | N/A |
| Phase 002 `.utcp_config.json` registration | Internal | Green | Usage examples would reference an unregistered manual name |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate.sh` fails, or the new SKILL.md router entries break existing intent scoring for `WORKSPACE_SETUP`/`COMMIT`/`FINISH`.
- **Procedure**: Revert the new reference doc and the four `SKILL.md` edit sites via `git diff`/`git checkout -- <file>` (uncommitted); re-apply incrementally, validating after each edit site.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
