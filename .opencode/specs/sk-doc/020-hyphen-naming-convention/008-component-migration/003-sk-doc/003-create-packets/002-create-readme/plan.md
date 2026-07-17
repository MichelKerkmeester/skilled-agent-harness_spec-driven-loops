---
title: "Implementation Plan: create-readme resource names"
description: "Execution plan for the create-readme install-guide and README resource rename/reference closure."
trigger_phrases:
  - "create-readme resource implementation plan"
  - "install guide template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-readme plan"
    next_safe_action: "Inventory install-guide and README consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-readme/assets/", ".opencode/skills/sk-doc/create-readme/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-readme resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-readme/` |
| **Change class** | Resource directory/template rename plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the install-guide directory, three assets, and five reference files from the actual packet inventory. Update all packet links and audit documentation after the filesystem move, with `.py` and tool-mandated names excluded.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Asset and reference inventories are captured.
- [ ] Install-guide and README resource domains are classified separately.
- [ ] Old path tokens and dynamic audit-helper consumers are identified.

### Definition of Done

- [ ] No in-scope snake_case resource path remains.
- [ ] All renamed links resolve and audit guidance points at the target names.
- [ ] Template payloads and Python code are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Assets**: rename install-guide and README template files.
- **References**: preserve domain separation while renaming install-guide and README directories/files.
- **Consumer closure**: update packet docs, examples, and audit-helper path documentation.
- **Boundary**: do not change placeholder names, frontmatter fields, or Python identifiers.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Freeze the directory/file map and consumer inventory.
- [ ] Record Python and mandated-name exemptions.

### Phase 2: Implementation

- [ ] Rename the install-guide directory and eight resource files.
- [ ] Update path-valued links and audit documentation.

### Phase 3: Verification

- [ ] Resolve every asset/reference link and search for stale old tokens.
- [ ] Check install-guide and README domain counts against BASE.
- [ ] Review content diff for accidental placeholder/key edits.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest parity and path census |
| REQ-002 | Domain-specific link resolution |
| REQ-003 | Old-token search and audit-reference review |
| REQ-004 | Exemption diff audit |
| REQ-005 | Template content comparison excluding path tokens |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared template links may be stale |
| `audit_readmes.py` | Python helper | Exempt | Filename cannot be changed |
| 001 convention policy | Naming authority | Required | Exemption boundary is undefined |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Link resolution fails, domain counts drift, or template payload content changes.
- **Procedure**: Revert the component-local rename/reference commit and restore the original install-guide/reference paths.
<!-- /ANCHOR:rollback -->
