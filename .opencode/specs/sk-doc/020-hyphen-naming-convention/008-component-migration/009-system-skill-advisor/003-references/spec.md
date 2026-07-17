---
title: "Feature Specification: system-skill-advisor references"
description: "Rename the 15 snake_case Markdown reference files under system-skill-advisor/references to kebab-case and repair every link, path pointer, command example, and reference index that names them."
trigger_phrases:
  - "system-skill-advisor references naming"
  - "advisor reference file rename"
  - "kebab-case reference links"
  - "skill-advisor reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the references migration contract from the real tree"
    next_safe_action: "Execute the reference-file rename and link closure on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The reference tree has no snake_case directories and 15 snake_case Markdown filenames."
      - "Path-valued links change; code identifiers, MCP tool IDs, and frontmatter fields do not."
      - "Reference links crossing into the catalog or playbook phases are updated only as path pointers, not as content redesign."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor references

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/003-references |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The references tree contains 15 Markdown files with snake_case names across config/, decisions/, graph/, hooks/,
runtime/, and scoring/. The top-level skill docs, internal references, command examples, and links from catalog/playbook
content point at those exact paths. A filesystem-only rename would leave broken navigation and stale operator commands.

### Purpose
Rename the reference files to kebab-case and prove that every direct link and path-valued pointer resolves to the new
file without changing the reference content's identifiers or contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 15 reference files listed in the implementation plan, including db_path_policy.md,
  skill_advisor_hook.md, standalone_mcp_shape.md, and validation_baselines.md.
- Relative Markdown links, code-block paths, command examples, frontmatter path values, SKILL routing prefixes,
  README/INSTALL index entries, and cross-links from the advisor catalog/playbook.
- A repository-wide path scan bounded to consumers that name these reference files.

### Out of Scope
- Renaming reference directories, code identifiers, MCP tool IDs such as skill_graph_query, frontmatter fields,
  JSON/YAML/TOML keys, or prose terms that are not filesystem paths.
- Rewriting the reference content, changing runtime policy, or changing the feature-catalog/playbook roots owned by
  phases 005 and 006.
- Changelogs and completed history, which remain frozen except for the release evidence handled by phase 007.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/references/config/db_path_policy.md | Rename | db-path-policy.md |
| .opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md | Rename | deferred-decisions.md |
| .opencode/skills/system-skill-advisor/references/graph/{propagate_enhances,skill_graph_drift,skill_graph_extraction_plan,skill_graph_query_cookbook}.md | Rename | Kebab-case graph reference names |
| .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md | Rename | skill-advisor-hook.md |
| .opencode/skills/system-skill-advisor/references/runtime/{daemon_lease_contract,freshness_contract,legacy_tool_bridge,standalone_mcp_shape,tool_ids_reference}.md | Rename | Kebab-case runtime reference names |
| .opencode/skills/system-skill-advisor/references/scoring/{advisor_scorer,lane_weight_tuning,validation_baselines}.md | Rename | Kebab-case scoring reference names |
| .opencode/skills/system-skill-advisor/{SKILL,README,INSTALL_GUIDE}.md | Modify | Repair reference indexes and links |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reference inventory is complete | All 15 current snake_case reference files have one kebab-case target and no reference directory is renamed by this phase. |
| REQ-002 | Every reference link is repaired | Relative links, Markdown indexes, command examples, and path-valued frontmatter point to existing kebab-case files. |
| REQ-003 | Cross-surface pointers remain coherent | Links from the skill docs, catalog/playbook content, doctor/command assets, and other in-scope consumers resolve after sibling phase path maps are applied. |
| REQ-004 | Content contracts are preserved | Reference prose, tool IDs, JSON keys, frontmatter fields, and code examples change only where a literal filesystem path requires it. |
| REQ-005 | No stale live filename remains | A bounded old-name scan reports only intentional historical/explanatory mentions; no link or executable command uses an old path. |
| REQ-006 | Navigation and validation remain green | Markdown link checks and the relevant sk-doc/reference validation retain BASE counts and report no missing target. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 reference filenames are kebab-case and discoverable at their new paths.
- **SC-002**: Top-level docs, internal references, command examples, and cross-surface links have zero broken targets.
- **SC-003**: Runtime/tool identifiers and reference semantics are unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Catalog and playbook path maps | Cross-links may be temporarily inconsistent if phases are executed out of order | Use the frozen map and verify each cross-phase target against its planned kebab path. |
| Risk | A filename token is mistaken for an identifier | Tool dispatch or frontmatter matching can regress | Change only path segments in path contexts; preserve tokens such as skill_graph_query. |
| Risk | Historical changelog mentions are treated as live links | Frozen history is rewritten unnecessarily | Classify every old-name hit as live path, documentation example, or frozen history before editing. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record any old-name hit that is intentionally retained as a non-path identifier or
frozen historical mention so the final gate can distinguish it from a stale pointer.
<!-- /ANCHOR:questions -->
