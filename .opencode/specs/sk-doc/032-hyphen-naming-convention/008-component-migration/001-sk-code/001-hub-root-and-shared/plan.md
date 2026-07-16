---
title: "Implementation Plan: hub root and shared sk-code names (032 phase 008/001)"
description: "Plan for renaming the sk-code hub shared assets and references through the frozen semantic map, then repairing path consumers and symlink targets before behavior verification."
trigger_phrases:
  - "hub shared naming implementation plan"
  - "sk-code shared rename plan"
  - "shared workflow path migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase plan"
    next_safe_action: "Execute the shared rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/shared/references/"
      - ".opencode/skills/sk-code/shared/assets/"
      - ".opencode/skills/sk-code/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Hub root and shared sk-code names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/shared and hub path consumers |
| **Change class** | Filesystem rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen rename map |
| **Verification** | Rename-map checker, symlink manifest, markdown-link scan, routing checks |

### Overview

Use the phase 005 semantic source-to-target map to rename the shared reference and pattern files, then update every hub and surface path that points at them. The source workflow files and their symlink consumers are treated as one closure; code behavior, route keys, and exempt names remain unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The phase 006 frozen map identifies every shared candidate and its disposition.
- [ ] The cross-cutting handoff identifies the workflow symlink nodes and expected targets.
- [ ] The worktree is clean, pinned to BASE, and the baseline symlink/mode manifest is available.

### Definition of Done

- [ ] Every in-scope shared name is kebab-case and every old path reference is repaired.
- [ ] Shared source files, symlink consumers, and hub indexes resolve with their original semantics.
- [ ] Exemption and exact-name checks pass, with evidence recorded in checklist.md.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Semantic rename closure**: map the shared files individually; never substitute underscores mechanically.
- **Hub reference layer**: update SKILL.md, README.md, shared/README.md, and path-valued registry entries only where a filename changes.
- **Symlink layer**: preserve link type, relative target intent, and executable/mode metadata for the workflow links consumed by code-opencode and code-webflow.
- **Content boundary**: leave identifiers, JSON keys, frontmatter fields, and tool-mandated filenames untouched.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the frozen map, baseline manifest, and cross-cutting symlink closure.
- [ ] Capture the pre-change list of shared underscore names and all references to them.
- [ ] Confirm the hub root names are already compliant or explicitly exempt.

### Phase 2: Core Implementation

- [ ] Rename shared references: phase_detection, smart_routing, stack_detection, performance_loading_checklist, universal-debugging_checklist, universal-verification_checklist, workflow_debug, workflow_implement, and workflow_verify.
- [ ] Rename shared universal references: code_quality_standards, code_style_guide, error_recovery, and multi_agent_research.
- [ ] Rename assets/patterns/validation_patterns.js and wait_patterns.js.
- [ ] Update hub indexes, shared documentation, route resource paths, internal markdown links, and workflow symlink targets.

### Phase 3: Verification

- [ ] Compare the post-change path manifest with the frozen map and baseline.
- [ ] Resolve every workflow symlink and markdown link from the hub/shared closure.
- [ ] Exercise shared surface detection, fallback routing, and workflow loading.
- [ ] Confirm no exempt or tool-mandated file was renamed and no content key was changed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Shared candidate coverage | Rename-map scan reports one disposition per candidate and zero unknown rows. |
| Reference integrity | Search active markdown, JSON, and registry path values for old basenames; resolve every reported link. |
| Symlink integrity | Compare link count, link targets, and modes before and after; resolve both surface workflow links. |
| Routing parity | Run the existing shared routing/surface checks and compare route outcomes with the baseline. |
| Exemption safety | Inspect SKILL.md, metadata, Python/package, generated, tool-mandated, and frozen surfaces for unchanged names. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 phase 006 frozen map | Internal | Required before execution | Candidate ownership and target names are unknown. |
| 032 phase 007 shared closure handoff | Internal | Required before execution | Symlink ordering and cross-surface consumers may be missed. |
| 000 baseline manifests | Internal | Required before verification | Mode, link, and route parity cannot be proven. |
| 005 rename/reference tooling | Internal | Required before execution | Manual renames would violate the semantic-map contract. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, dangling symlink, unresolved active path, route drift, or exemption violation.
- **Procedure**: Stop the dependency-closed batch and revert only the phase-scoped rename/reference commit; restore from the frozen map and rerun the pre-change manifest before retrying.
<!-- /ANCHOR:rollback -->
