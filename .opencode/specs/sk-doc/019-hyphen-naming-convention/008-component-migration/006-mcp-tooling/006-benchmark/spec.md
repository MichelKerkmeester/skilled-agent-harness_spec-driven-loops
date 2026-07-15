---
title: "Feature Specification: mcp-tooling benchmark naming closure (017 phase 006)"
description: "The mcp-tooling benchmark boundary is reserved for fixtures, profiles, and storage guides, but the current worktree contains only benchmark/.gitkeep and no snake_case benchmark artifact. This phase establishes the evidence-backed census rule, renames any discovered in-scope artifact paths, and repairs benchmark references without inventing files."
trigger_phrases:
  - "mcp-tooling benchmark naming"
  - "benchmark fixture profile kebab-case"
  - "017 mcp tooling phase 006"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 006 from the benchmark boundary census"
    next_safe_action: "Run the benchmark census and accept zero candidates or execute the mapped artifact closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/benchmark/"
      - ".opencode/skills/mcp-tooling/benchmark/.gitkeep"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-tooling Benchmark Naming Closure

> Phase adjacency under the 006-mcp-tooling parent: predecessor 005-manual-testing-playbook; successor 007-changelog-verify.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mcp-tooling benchmark directory is part of the naming surface, but it is currently empty apart from .gitkeep. A phase that assumes fixture, profile, or storage-guide names would fabricate scope and weaken the rename map; a phase that ignores newly present artifacts would leave the whole-surface gate incomplete.

This phase treats the benchmark directory as a census-and-closure boundary: preserve .gitkeep, rename every real in-scope artifact discovered at execution, update its references, and accept a zero-candidate result when the directory remains empty.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- .opencode/skills/mcp-tooling/benchmark/ and all real tracked or execution-visible descendants.
- Fixture, profile, storage-guide, scenario, and benchmark-support directory/file names if present at execution.
- Benchmark path references in mcp-tooling documentation, benchmark loaders, and path-valued metadata.
- The zero-candidate evidence for the current inventory, which contains only .gitkeep.

### Out of Scope
- Creating benchmark fixtures, profiles, storage guides, or scenario content.
- Renaming benchmark data keys, scenario IDs, JSON/YAML/TOML keys, frontmatter fields, or generated/lockfile output.
- The component-local catalog/playbook trees and changelog history.
- .gitkeep, which is a repository-preservation marker and already contains no snake_case segment.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/benchmark/ | Inspect/Modify | Census and rename any discovered in-scope artifact paths |
| .opencode/skills/mcp-tooling/benchmark/.gitkeep | Preserve | Keep the empty-directory marker unchanged |
| Benchmark path consumers | Modify if needed | Update path values and links for discovered renamed artifacts |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a complete benchmark census | The report proves the current directory contains only .gitkeep or lists every discovered fixture/profile/storage-guide candidate |
| REQ-002 | Rename discovered in-scope artifacts | Every discovered snake_case benchmark path has one semantic kebab target; no files are invented to make the phase non-empty |
| REQ-003 | Preserve benchmark data semantics | .gitkeep, scenario IDs, data keys, frontmatter fields, and generated/lockfile output remain unchanged |
| REQ-004 | Repair benchmark references | Every benchmark loader, documentation path, and path-valued metadata reference resolves after any artifact move |
| REQ-005 | Prove the boundary is complete | The post-change benchmark scan has zero in-scope snake_case names and records the zero-candidate condition when applicable |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The benchmark census is complete and honest about the current zero-artifact baseline.
- **SC-002**: Any discovered in-scope benchmark names are kebab-case with resolved references.
- **SC-003**: No benchmark content, key, scenario identity, or preservation marker is changed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is confusing an empty benchmark boundary with missing work and creating speculative artifacts. The mitigation is a non-zero-sensitive inventory that accepts exactly one .gitkeep as the current baseline. If artifacts appear before execution, the frozen map and collision scan must expand before any rename.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current census is a zero-candidate benchmark rename set beyond the preserved .gitkeep marker.
<!-- /ANCHOR:questions -->
