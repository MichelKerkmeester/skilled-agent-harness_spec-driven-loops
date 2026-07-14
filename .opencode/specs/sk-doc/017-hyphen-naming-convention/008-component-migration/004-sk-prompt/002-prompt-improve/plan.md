---
title: "Implementation Plan: prompt-improve asset and reference names (017 phase 004.002)"
description: "Implementation plan for phase 002 of the sk-prompt kebab-case program: rename six prompt-improve asset/reference files, update active consumers, and prove the packet resource map remains resolvable."
trigger_phrases:
  - "prompt-improve asset and reference implementation plan"
  - "sk-prompt phase 002 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the prompt-improve asset/reference implementation plan"
    next_safe_action: "Build the six-entry path map from the pinned packet tree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/README.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/"
      - ".opencode/skills/sk-prompt/prompt-improve/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Playbook, benchmark, and changelog paths are excluded from the phase map."
---
# Implementation Plan: prompt-improve asset and reference names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-prompt/prompt-improve/` assets and references |
| **Change class** | Kebab-case filesystem rename plus active path-reference closure |
| **Execution** | Isolated worktree pinned to BASE; semantic map, not text substitution |

### Overview
The packet has six concrete underscore-separated Markdown filenames: three format guides and three core references.
The implementation keeps the existing resource keys and prose semantics, renames the files, then updates only active
path-valued references in the packet and its router documentation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 root boundary and the pinned baseline are available.
- [ ] The six source paths and their kebab-case targets are recorded.
- [ ] Playbook, benchmark, changelog, and tool-mandated exclusions are marked in the map.

### Definition of Done
- [ ] All six source paths have moved to their mapped targets.
- [ ] Active resource maps, Markdown links, and path-valued references resolve.
- [ ] Prompt-improve identifiers, data keys, and workflow behavior are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a path-segment rename map followed by an active-reference sweep. Match exact filesystem names, not underscore tokens in code identifiers or data keys.

### Key Components
- **Format assets**: `format_guide_json.md`, `format_guide_markdown.md`, and `format_guide_yaml.md` become `format-guide-json.md`, `format-guide-markdown.md`, and `format-guide-yaml.md`.
- **Core references**: `depth_framework.md`, `design_generation_patterns.md`, and `patterns_evaluation.md` become their hyphenated equivalents.
- **Consumers**: `SKILL.md`, `README.md`, resource-loading tables, router maps, and packet-local active links.

### Data Flow
Six-entry map → filesystem rename → active reference rewrite → resource-map/path resolution → stale-source and scope audit.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001 handoff and capture the prompt-improve tree at BASE.
- [ ] Enumerate the six source paths and record exclusions for playbook, benchmark, changelog, and exact names.

### Phase 2: Implementation
- [ ] Rename the three format-guide assets and three core reference files.
- [ ] Update `SKILL.md`, `README.md`, and active packet-local path references.
- [ ] Preserve resource keys, framework names, content keys, and frontmatter fields.

### Phase 3: Verification
- [ ] Confirm all six target files exist and no in-scope source path remains.
- [ ] Resolve every active link and resource-map path; inspect frozen changelog hits separately.
- [ ] Compare the diff against the phase boundary and record the map hash.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Enumerate assets and references and compare exact source/target pairs |
| REQ-002 | Search active packet docs for old names and resolve all new Markdown/resource paths |
| REQ-003 | Parse any touched JSON metadata and compare router/resource keys before and after |
| REQ-004 | Review the diff and disposition ledger for delegated, frozen, generated, and tool-mandated names |
| REQ-005 | Run the packet link/reference checks and confirm the rename map is bijective |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase inherits the 017 naming convention and depends on `001-hub-root-and-shared` for ownership boundaries. It must leave `004-manual-testing-playbook`, `005-benchmark`, and `006-changelog-verify` their documented inputs and does not require a package install because the change is Markdown path metadata.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Rollback is a git revert of the path-scoped rename/reference commit(s). If a target collision or unresolved link appears,
abort before commit and restore the worktree to the pre-phase map; no generated output or data store is changed.
<!-- /ANCHOR:rollback -->
