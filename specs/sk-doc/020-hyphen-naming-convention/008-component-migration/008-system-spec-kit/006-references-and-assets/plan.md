---
title: "Implementation Plan: References and assets (020 subtree 008 phase 006)"
description: "The system-spec-kit reference and asset surfaces contain a broad set of underscore-bearing Markdown filenames, plus MCP documentation and curated benchmark report files. This phase renames permitted reference/asset files and updates links and pointers while keeping tool-mandated names, generated artifacts, Python files, keys, and frozen history within their exemptions."
trigger_phrases:
  - "system-spec-kit references and assets"
  - "reference filename kebab-case"
  - "asset filename rename"
  - "benchmark_report rename"
  - "kebab-case phase 006"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/006-references-and-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned reference-asset execution"
    next_safe_action: "Execute the reference and asset file map after template pointers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: References and assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (References and assets) |
| **Change class** | Reference and asset filename closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Build a per-file semantic map for active references and assets, then update link and pointer consumers in the same dependency-closed batches. Keep a disposition ledger for generated, tool-mandated, and frozen names so the final gate can distinguish stale active links from allowed history.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 template pointers are stable.
- [ ] Reference and asset inventories are captured with the observed 42 and four counts.
- [ ] MCP documentation and benchmark report classifications are recorded.

### Definition of Done
- [ ] All permitted reference/asset filenames use kebab-case.
- [ ] Active links, maps, indexes, and path-valued metadata resolve.
- [ ] Every non-renamed underscore file has a documented exemption or frozen/generated disposition.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use basename-level semantic mappings such as daemon_cli_reference.md -> daemon-cli-reference.md, environment_variables.md -> environment-variables.md, and benchmark_report.md -> benchmark-report.md.
- Rewrite Markdown links and path-valued metadata through the same map; never change field names, keys, prose identifiers, or historical evidence.
- Run a link resolver over active references and record every excluded path.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate all underscore-bearing files under references and assets and classify by active, generated, tool-mandated, or frozen role.
- Enumerate MCP reference docs and benchmark reports and inspect their index links.

### Phase 2: Implementation
- Create the per-file map and collision report.
- Rename permitted reference/asset files and update resource maps, Markdown links, indexes, README pointers, and path-valued frontmatter.
- Record generated/lockfile/tool/history dispositions without rewriting them.

### Phase 3: Verification
- Run active Markdown-link and path-pointer resolution from the system-spec-kit root.
- Re-run the candidate scan and review all remaining underscore basenames against the disposition ledger.
- Compare changed names with key/field and frozen-content exemptions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory report has 42 reference, four asset, MCP documentation, and seven benchmark-report dispositions. |
| REQ-002 | Map review proves each permitted target is kebab-case and collision-free. |
| REQ-003 | Run Markdown-link, resource-map, README, index, script, and frontmatter path checks. |
| REQ-004 | Audit generated, tool-mandated, Python, key, field, and frozen exclusions. |
| REQ-005 | Central link checker reports zero broken active links and zero unknown old paths. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 template tree | Internal | Required | Template links and resource maps must have stable targets. |
| Markdown/link resolver | Internal | Required | A filename move is incomplete if links remain broken. |
| Phase 008 and 009 content trees | Internal | Downstream | Catalog/playbook links are excluded from this phase and handed off. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop on any unresolved link, collision, or ambiguous generated classification. Revert each reference/asset file with its link and index updates; do not repair by changing frontmatter fields or historical content.
<!-- /ANCHOR:rollback -->

