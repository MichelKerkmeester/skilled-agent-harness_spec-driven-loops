---
title: "Feature Specification: Phase 3: sk-git-integration-doc-and-router"
description: "Author references/gitkraken_mcp_integration.md (safety-scoped tool selection guide) and update sk-git's SKILL.md router, keyword triggers, references table, and rules so GitKraken MCP is used correctly and automatically when relevant."
trigger_phrases:
  - "gitkraken mcp integration doc"
  - "sk-git gitkraken router"
  - "gitkraken tool selection guide"
  - "phase 003 sk-git-integration-doc-and-router"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/003-sk-git-integration-doc-and-router"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase spec ahead of implementation"
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
    answered_questions:
      - "Mirror the github_mcp_integration.md structure exactly (Overview, Tool Selection Guide, Available Tools, Usage Examples, Error Handling, Related Resources) for consistency with the existing sibling doc"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: sk-git-integration-doc-and-router

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-utcp-config-registration |
| **Successor** | 004-advisor-routing-update |
| **Handoff Criteria** | New reference doc exists with the safety carve-out documented; `SKILL.md`'s router, keyword triggers, and references table all mention GitKraken; `validate.sh` passes on the phase folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Even after phase 002's registration, sk-git has no idea GitKraken MCP exists — nothing documents its tools, nothing routes intent to it, and nothing warns against using its local-mutation tools in place of sk-git's existing safety-gated Bash workflow.

### Purpose
Author a reference doc and extend sk-git's own router/rules so the AI both discovers and correctly uses GitKraken MCP: reaching for it on cross-platform/GitLens-shaped requests while keeping local git mutations on the existing Bash-based workflow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `references/gitkraken_mcp_integration.md`, mirroring `references/github_mcp_integration.md`'s structure.
- `SKILL.md` updates: a new `GITKRAKEN_MCP` intent signal, a `RESOURCE_MAP` entry, keyword triggers, a references-table row, and a safety rule.

### Out of Scope
- Advisor/`graph-metadata.json`/`explicit.ts` changes — covered by phase 004.
- `.utcp_config.json` — already done in phase 002.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/references/gitkraken_mcp_integration.md` | Create | Tool selection guide, safety carve-out, usage examples |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Router, triggers, references table, new rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: Author the reference doc
Structure mirrors `github_mcp_integration.md`: Overview, Tool Selection Guide (table: operation → tool → rationale), Available Tools (grouped table with `gitkraken.gitkraken_{tool_name}({...})` access pattern), Usage Examples (`call_tool_chain` TypeScript), Error Handling, Related Resources. Must explicitly document:
- The safety carve-out from phase 001 REQ-004 (local git mutations stay on Bash/sk-git workflow, not GitKraken MCP).
- The two forbidden app-internal tools (`app_tool_box`, `app_update_user_preferences`).
- `gitlens_start_review`/`gitlens_start_work` create worktrees internally — flagged as worktree-creation-adjacent, not auto-invoked without user intent.
- Cross-provider reach (GitHub/GitLab/Azure DevOps/Bitbucket/Jira) as the key differentiator from the existing GitHub-only MCP integration.

### REQ-002: Update SKILL.md's smart router
Add a `GITKRAKEN_MCP` entry to `INTENT_SIGNALS` (keywords: `gitkraken`, `gitlens`, `launchpad`, `commit composer`, `cross-platform pr`, `multi-provider issue`) and a matching `RESOURCE_MAP` entry pointing to `references/gitkraken_mcp_integration.md`. Add `gitkraken`, `gitlens` to the "Owned (route here)" keyword triggers list in §1.

### REQ-003: Add a references-table row
`references/gitkraken_mcp_integration.md` gets a row in §5 REFERENCES → Core Workflows, alongside `github_mcp_integration.md`, describing it as the cross-platform (multi-provider) counterpart.

### REQ-004: Add a safety rule
A new numbered item under §4 RULES → ✅ ALWAYS or ❌ NEVER (whichever fits the existing numbering) stating: local git mutations (commit, push, branch, checkout, worktree, stash) must go through the existing Bash-based sk-git workflow, never through GitKraken MCP's overlapping tools, even though those tools exist and are callable.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `references/gitkraken_mcp_integration.md` exists, structurally mirrors `github_mcp_integration.md`, and documents the safety carve-out and the two forbidden app-internal tools.
- **SC-002**: `SKILL.md`'s router, keyword triggers, references table, and rules all reference GitKraken MCP, with every numeric rule cross-reference in the file still resolving correctly after renumbering.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's verified tool inventory + safety decision | An unverified doc could invent tool names or omit the safety carve-out | Every tool name in the new doc traces to phase 001's `gk mcp --list-tools` capture |
| Dependency | Phase 002's registered `gitkraken` manual | Usage examples would reference an unregistered manual name | Phase 002 completed first; examples use the live `gitkraken.gitkraken_*` access pattern |
| Risk | Inserting a new numbered rule shifts every rule number after it, which can silently break existing cross-references elsewhere in `SKILL.md` | A stale cross-reference misleads a future reader to the wrong rule | Grepped the whole file for `ALWAYS #`/`NEVER #` style references and fixed the one found (`(see ALWAYS #11)` → `(see ALWAYS #13)`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:testing -->
## 8. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Phase folder + touched skill docs | `validate.sh` |
| Consistency grep | New rule text present in SKILL.md | `rg -n "GitKraken" .opencode/skills/sk-git/SKILL.md` |
| Structural mirror check | New doc vs. `github_mcp_integration.md` | Manual side-by-side section comparison |
<!-- /ANCHOR:testing -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: See `../002-utcp-config-registration/spec.md`
