---
title: "Implementation Plan: mcp-code-mode references and assets (017 component 011 phase 003)"
description: "Apply a four-entry semantic rename map to the mcp-code-mode reference and asset files, then resolve all active links and pointers from the skill guides, templates, scripts, and cross-references."
trigger_phrases:
  - "mcp-code-mode references assets implementation plan"
  - "mcp-code-mode phase 003 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references-assets plan"
    next_safe_action: "Inventory active links to the four files"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-code-mode references and assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | mcp-code-mode/references and mcp-code-mode/assets |
| **Change class** | Four Markdown filename renames and active link closure |
| **Execution** | Isolated worktree pinned to BASE; semantic map required |

### Overview
The current surface has four permitted snake_case Markdown filenames. The plan renames those exact paths and updates the active link graph so the skill guide, README, references, templates, scripts, and manual pointers remain navigable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The four source paths and their target paths are recorded
- [ ] All active consumers and relative-link roots are inventoried
- [ ] Frozen history and content identifiers are separated from path values

### Definition of Done
- [ ] The four files have their kebab-case target names
- [ ] Active link resolution has zero broken links and zero stale source paths
- [ ] Exempt content and frozen changelog history are unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Current path | Target path |
|--------------|-------------|
| references/naming_convention.md | references/naming-convention.md |
| references/tool_catalog.md | references/tool-catalog.md |
| assets/config_template.md | assets/config-template.md |
| assets/env_template.md | assets/env-template.md |

The reference closure covers SKILL.md, README.md, references/configuration.md, references/architecture.md,
references/workflows.md, the two renamed assets, and scripts/update.sh. The checker must classify historical changelog
mentions and underscore-bearing tool names as non-path or frozen dispositions.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the four-entry map and collect every active link or path-valued hit.
- Record the relative-link base for each consumer and mark frozen changelog hits.

### Phase 2: Implementation
- Rename the two reference files and two asset files.
- Rewrite active links, router lists, script messages, and cross-references with the same map.
- Preserve underscore-bearing tool names, content keys, frontmatter fields, and historical changelog paths.

### Phase 3: Verification
- Resolve all Markdown links from the skill surface.
- Search for stale active source filenames and confirm every remaining hit has a documented disposition.
- Compare the changed path set to the four-entry map and record the evidence.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Rename-map and filesystem census show exactly four source-to-target pairs |
| REQ-002 | Active Markdown/path scan reports zero stale source paths and zero broken links |
| REQ-003 | Relative links among references and assets resolve from each new file location |
| REQ-004 | Main guide, README, reference docs, and update script use final paths |
| REQ-005 | Diff and disposition ledger preserve identifiers, keys, fields, Python paths, and frozen history |
| REQ-006 | Candidate report pins the map hash, link report, stale-hit report, and exit codes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the 017 exemption policy, phase 001's package-root closure, the semantic rename/reference checker, and a Markdown link resolver. The manual-playbook links that point into this surface remain in the consumer inventory but their scenario-file renames belong to phase 005.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore the four source filenames and reverse the same link map. Re-run the link resolver from the restored paths; no
tool-call names, data keys, or frozen changelog content needs rollback because those are outside the change.
<!-- /ANCHOR:rollback -->
