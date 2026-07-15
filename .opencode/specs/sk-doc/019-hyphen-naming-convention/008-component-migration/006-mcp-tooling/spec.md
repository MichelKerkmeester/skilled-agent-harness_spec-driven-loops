---
title: "Feature Specification: mcp-tooling component naming migration (017 component parent)"
description: "The mcp-tooling surface contains snake_case directory and file names across its hub-level support material, three component packets, manual-testing playbooks, and benchmark boundary. This phased packet defines the independent rename and reference-rewrite scopes needed to make that surface kebab-clean while preserving tool-mandated names, Python exemptions, and component behavior."
trigger_phrases:
  - "mcp-tooling kebab-case migration"
  - "mcp tooling component naming"
  - "017 mcp-tooling phase map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the mcp-tooling component phase map from the surface census"
    next_safe_action: "Execute the selected mcp-tooling child phase against the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/mode-registry.json"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/"
      - ".opencode/skills/mcp-tooling/mcp-figma/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list; detailed plans, tasks, checklists, and decisions live in child folders. -->

# Feature Specification: mcp-tooling Component Naming Migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Branch** | sk-doc/0042-017-authoring |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling |
| **Predecessor** | 005-cli-external-orchestration |
| **Successor** | 007-system-deep-loop |
| **Handoff Criteria** | All eight child phase contracts pass their blocking checks and the mcp-tooling surface is ready for the whole-repo gate |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mcp-tooling hub still uses snake_case filesystem names in component-local catalogs, manual-testing trees, root playbook material, and documentation references. The three bridges are largely independent, so a single broad rename would mix unrelated dependency closures and make it difficult to prove that tool-mandated names, path-derived metadata, and component routing remain intact.

This phased packet divides the mcp-tooling naming work into one hub/shared phase, three component phases, two support-surface phases, a changelog verification phase, and a final rollup gate. Each child owns its filesystem names and reference closure; the migration itself is executed later by the implementation worker.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hub-root routing and any physically present shared support assets or references.
- The mcp-chrome-devtools, mcp-click-up, and mcp-figma component trees.
- The hub-level manual-testing-playbook tree and benchmark boundary.
- Append-only changelog verification for the rename set and version bump.
- A rollup gate proving the subtree contains no remaining in-scope snake_case filesystem name.

### Out of Scope
- Python .py files and Python import-package directories, which keep their required snake_case form.
- SKILL.md, mode-registry.json, package manifests, and other tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, and frontmatter field names.
- Any other 017 component-migration subtree or the execution of the migration during this authoring pass.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| .opencode/skills/mcp-tooling/ | Modify | 001 | Rename root/shared candidates and update hub path references |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/ | Modify | 002 | Rename component documentation and playbook paths |
| .opencode/skills/mcp-tooling/mcp-click-up/ | Modify | 003 | Rename catalog, playbook, reference, and index paths |
| .opencode/skills/mcp-tooling/mcp-figma/ | Modify | 004 | Rename catalog, playbook, asset, reference, and helper paths |
| .opencode/skills/mcp-tooling/manual_testing_playbook/ | Modify | 005 | Rename hub-level scenario and category paths |
| .opencode/skills/mcp-tooling/benchmark/ | Inspect/Modify | 006 | Rename any discovered fixture, profile, or storage-guide paths |
| .opencode/skills/mcp-tooling/changelog/ | Append only | 007 | Verify or add the migration entry and version bump without rewriting history |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. Detailed plans, tasks, checklists, and any phase-specific decision record live in the child folders.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | 001-hub-root-and-shared/ | Hub root and shared support naming plus route-reference closure | Planned |
| 002 | 002-mcp-chrome-devtools/ | Chrome DevTools component names and references | Planned |
| 003 | 003-mcp-click-up/ | ClickUp catalog, playbook, reference, and index names | Planned |
| 004 | 004-mcp-figma/ | Figma catalog, playbook, asset, reference, and helper names | Planned |
| 005 | 005-manual-testing-playbook/ | Hub-level manual-testing-playbook scenarios and category directory | Planned |
| 006 | 006-benchmark/ | Benchmark artifact census and safe path renames | Planned |
| 007 | 007-changelog-verify/ | Append-only changelog entry and version-bump verification | Planned |
| 008 | 008-skill-gate/ | Subtree rollup and whole-surface kebab-case gate | Planned |

### Phase Transition Rules

- Each child phase must pass its checklist contract before its rename closure is accepted.
- A child may update only its assigned surface; shared routing changes are recorded in phase 001.
- Phase 008 is the final gate for this subtree and performs verification only.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Hub root path consumers and tool-name exemptions are classified | Phase 001 checklist and route-resolution evidence |
| 002 | 003 | Chrome component rename map and reference closure are complete | Phase 002 checklist and link/reference scan |
| 003 | 004 | ClickUp catalog/playbook closure is complete | Phase 003 checklist and catalog/playbook scan |
| 004 | 005 | Figma component closure is complete | Phase 004 checklist and transport smoke checks |
| 005 | 006 | Hub-level playbook names and links are clean | Phase 005 checklist and Markdown-link scan |
| 006 | 007 | Benchmark inventory is classified, including the current zero-candidate baseline | Phase 006 checklist and benchmark census |
| 007 | 008 | Changelog entry and version bump match the completed rename set | Phase 007 checklist and append-only history check |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. The child scopes, exemption boundary, and current benchmark zero-candidate condition are fixed by the surface census and the 017 program decisions.
<!-- /ANCHOR:questions -->
