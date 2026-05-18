---
title: "System Code Graph README Update"
description: "Audit and update authored README files inside the system-code-graph skill using sk-doc README template variants."
trigger_phrases:
  - "013 readmes update"
  - "system code graph readmes"
  - "sk-doc readme templates"
  - "mk-code-index readme update"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/016-system-code-graph-readmes-update"
    last_updated_at: "2026-05-14T17:49:15Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-013"
    recent_action: "Updated authored system-code-graph README files and hit git index sandbox block"
    next_safe_action: "Stage and commit scoped files when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/database/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/utils/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tests/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-013-readmes-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Packet 010 was observed at scan time and marked complete, so current README terminology uses mk-code-index, mk_code_index and mcp__mk_code_index__*."
      - "Twelve README files were found under system-code-graph. Eight authored skill READMEs were edited; four untracked node_modules dependency READMEs were audited but not rewritten."
      - "No README files exist under references, feature_catalog or manual_testing_playbook subfolders."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System Code Graph README Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The system-code-graph skill READMEs were inconsistent after extraction and the packet 010 MCP rename. The root README still read like a code-folder README, the database README was blank, several code-section READMEs omitted current apply-mode or `mk-code-index` details, and some validation or related-resource links pointed at stale paths.

### Purpose

Align authored system-code-graph README files to sk-doc's skill and code-folder README templates, refresh current MCP naming and leave a packet-local audit trail.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read sk-doc README guidance and apply the matching template variant per README location.
- Audit every `README*` file under `.opencode/skills/system-code-graph/`.
- Edit authored system-code-graph README files only.
- Update current MCP naming to `mk-code-index`, `mk_code_index` and `mcp__mk_code_index__*` where runtime docs describe current behavior.
- Create this 013 Level 1 packet and validation evidence.

### Out of Scope

- Top-level repository `README.md`, handled by packet 015.
- Parallel packet folders 011 and 014.
- Source code, schemas, JavaScript, TypeScript or JSON config changes.
- Third-party `node_modules` dependency READMEs.
- Live MCP child restarts or process management.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/README.md` | Modify | Convert skill-root README to the sk-doc skill README profile. |
| `.opencode/skills/system-code-graph/mcp_server/database/README.md` | Modify | Replace blank file with code-section database artifact README. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Modify | Refresh handler topology, apply-mode coverage and `mk-code-index` namespace. |
| `.opencode/skills/system-code-graph/mcp_server/lib/README.md` | Modify | Refresh library topology, recovery modules and validation commands. |
| `.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md` | Modify | Refresh utility README structure, validation command and related links. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md` | Modify | Refresh stress test map, links and validation command. |
| `.opencode/skills/system-code-graph/mcp_server/tests/README.md` | Modify | Refresh automated test map and validation command. |
| `.opencode/skills/system-code-graph/mcp_server/tools/README.md` | Modify | Refresh MCP dispatch README, active tool list and namespace guidance. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/016-system-code-graph-readmes-update/` | Create | Track this README-only packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stay README-only outside the packet docs | `git diff --name-only` contains only the 013 packet and system-code-graph README files. |
| REQ-002 | Use the correct sk-doc README template variant | Work list classifies each authored README as skill-root or code-section and maps it to `skill_readme_template.md` or `readme_code_template.md`. |
| REQ-003 | Respect packet 010 MCP rename status | Current runtime docs use `mk-code-index`, `mk_code_index` and `mcp__mk_code_index__*`; legacy `system_code_graph` appears only as explicit historical rename context. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Audit all READMEs under system-code-graph | Implementation summary records 12 found files and distinguishes eight authored READMEs from four third-party dependency READMEs. |
| REQ-005 | Validate README structure | sk-doc `validate_document.py --type readme --blocking-only` exits 0 for each edited authored README. |
| REQ-006 | Validate packet docs | `validate.sh --strict` exits 0 for the 013 packet. |
| REQ-007 | Attempt scoped staging and commit | BLOCKED: `git add` failed because the sandbox denied `.git/index.lock` creation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root skill README follows the sk-doc skill README profile and no longer reads as the `mcp_server/` code README.
- **SC-002**: Each authored subdirectory README has current purpose, structure, boundaries, validation and related-resource sections.
- **SC-003**: Local README links resolve.
- **SC-004**: Current MCP naming reflects packet 010 status at scan time.
- **SC-005**: The 013 packet captures per-file template classification and diff counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 010 rename status | README namespace could drift if the rename had not landed. | Read packet 010 implementation summary before editing; it showed 100% completion. |
| Risk | `node_modules` README files under the skill subtree | Rewriting third-party dependency docs would create vendor noise. | Audit them, classify as dependency READMEs and leave untouched. |
| Risk | Parallel dirty worktree | Accidental commit pollution. | Stage only the 013 packet and the eight edited system-code-graph README files. |
| Risk | Missing `mcp_server/README.md` | Related links could point at a non-existent parent README. | Point related links to existing root, sibling and child READMEs only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
