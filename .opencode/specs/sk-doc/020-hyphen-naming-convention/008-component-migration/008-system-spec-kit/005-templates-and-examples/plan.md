---
title: "Implementation Plan: Templates and examples (032 subtree 008 phase 005)"
description: "The system-spec-kit template surface contains underscore-bearing directory and file names in the examples and stress-test layouts, including level_1, level_2, level_3, level_3+, stress_test, and EXTENSION_GUIDE.md. This phase moves permitted template paths and updates generator, renderer, and documentation pointers while preserving tool-mandated manifest templates."
trigger_phrases:
  - "system-spec-kit templates and examples"
  - "level_1 template rename"
  - "stress_test template rename"
  - "EXTENSION_GUIDE rename"
  - "kebab-case phase 005"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/005-templates-and-examples"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned template-example execution"
    next_safe_action: "Execute the template path map after script callers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Templates and examples

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (Templates and examples) |
| **Change class** | Template layout and pointer closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Treat template directories, the stress-test template area, and the guide file as a semantic path map. Rewrite generator and manifest pointers together, then render each supported level into a temporary output and compare its structure with the baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 script path closure is complete.
- [ ] The template manifest and renderer inventory is captured with source paths and consumers.
- [ ] Tool-mandated manifest filenames are listed as explicit exemptions.

### Definition of Done
- [ ] All permitted template paths map to semantic targets.
- [ ] Generators and renderers use the target paths with no stale selector.
- [ ] Rendered examples retain expected structure and anchors.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Map level_1 -> level-1, level_2 -> level-2, level_3 -> level-3, level_3+ -> level-3+, stress_test -> stress-test, and EXTENSION_GUIDE.md -> extension-guide.md.
- Apply path changes to generator data and links only; preserve template file basenames that are tool contracts.
- Use rendered tree comparison to catch a selector or relative-link drift.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Inventory templates/examples, templates/stress_test, templates/manifest, and all references from create and renderer scripts.
- Capture one baseline render for each supported documentation level.

### Phase 2: Implementation
- Create the semantic template map and mark manifest/tool-mandated exemptions.
- Rename permitted directories/files and update manifest, generator, renderer, README, and example pointers.
- Render each supported level and reconcile path-derived frontmatter values without changing fields.

### Phase 3: Verification
- Run the template path scan and confirm no permitted underscore name remains.
- Compare rendered output file sets, anchor sets, and level markers with the baseline.
- Review old-path references and record tool-mandated or historical dispositions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory and classify every underscore-bearing template path, including actual directory counts. |
| REQ-002 | Review the semantic map for all level directories, stress_test, and EXTENSION_GUIDE.md. |
| REQ-003 | Run generator and renderer path-resolution checks against renamed templates. |
| REQ-004 | Compare changed names with the manifest, package, SKILL.md, and test-magic exemption list. |
| REQ-005 | Compare rendered example trees and anchors with baseline output. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 script tree | Internal | Required | Template setup callers must already use stable script paths. |
| Template manifest and renderer | Internal | Required | These are the source of truth for path selection. |
| Phase 006 references/assets | Internal | Downstream | Only template-local references are rewritten here. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop if a renderer selects the wrong level or a manifest template disappears. Revert directory/file moves and generator pointer edits together; retain baseline render receipts for diagnosis.
<!-- /ANCHOR:rollback -->

