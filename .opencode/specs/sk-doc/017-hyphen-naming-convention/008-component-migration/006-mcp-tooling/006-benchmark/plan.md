---
title: "Implementation Plan: mcp-tooling benchmark naming closure (017 phase 006)"
description: "This plan verifies the benchmark boundary, preserves the current .gitkeep-only baseline, and renames any real fixture, profile, storage-guide, or support path discovered at execution through an explicit map."
trigger_phrases:
  - "mcp-tooling benchmark implementation plan"
  - "benchmark artifact path census"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark execution plan"
    next_safe_action: "Confirm the zero-candidate baseline before any artifact operation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/benchmark/"
      - ".opencode/skills/mcp-tooling/benchmark/.gitkeep"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-tooling Benchmark Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling/benchmark |
| **Change class** | Census-first artifact rename or verified zero-candidate boundary |
| **Execution** | Frozen 017 rename map; no speculative file creation |

### Overview
The current benchmark directory contains only .gitkeep. The implementation therefore starts with a tracked and visible census. If the directory remains empty, the phase records the zero-candidate result and preserves .gitkeep. If fixtures, profiles, storage guides, or support artifacts are present at execution, only their in-scope filesystem names are mapped, renamed, and reference-repaired.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and map hash are recorded
- [ ] The benchmark census proves whether the directory is .gitkeep-only
- [ ] Any discovered artifact is classified before a target is selected
- [ ] Benchmark data keys, scenario IDs, generated output, and .gitkeep are marked preserved

### Definition of Done
- [ ] Zero candidates are recorded honestly, or every discovered candidate is renamed and classified
- [ ] Benchmark path references resolve
- [ ] The post-change scan has zero in-scope snake_case names
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Census boundary**: inspect all descendants of benchmark/ without creating fixtures or profiles.
- **Classification boundary**: classify each path as rename, exempt, frozen, generated, or tool-mandated.
- **Reference closure**: update benchmark documentation, loader paths, and path-valued metadata only when a real artifact moves.
- **Preservation boundary**: keep .gitkeep and benchmark content/keys/identities unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm a clean worktree
- [ ] Census benchmark/ and record the current .gitkeep-only inventory
- [ ] Capture any benchmark loader and documentation references

### Phase 2: Implementation
- [ ] If candidates exist, build their semantic source-to-target map
- [ ] Rename only discovered in-scope fixture/profile/storage-guide/support paths
- [ ] Update references to moved artifacts
- [ ] Preserve .gitkeep and all benchmark data semantics

### Phase 3: Verification
- [ ] Confirm the zero-candidate condition or complete candidate map
- [ ] Confirm no in-scope underscore remains under benchmark/
- [ ] Resolve all affected references and verify no speculative file was added
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | Benchmark descendants and .gitkeep preservation | find, git ls-files, rename-map checker |
| Reference | Loader, documentation, and path-valued metadata consumers | rg, path resolver |
| Semantics | Data keys, scenario IDs, and generated-output exclusions | focused diff and exemption scan |
| Boundary | Empty directory condition and no speculative files | tracked/untracked inventory |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 hub playbook closure | Internal | Required | Benchmark references may be stale |
| Frozen 017 rename map | Internal | Required if candidates exist | No safe artifact targets |
| Benchmark loader references | Internal | Conditional | Moved artifacts may be unreachable |
| .gitkeep preservation | Repository marker | Required | Empty benchmark boundary disappears |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Speculative artifact creation, candidate classification gap, broken loader reference, or .gitkeep mutation.
- **Procedure**: Revert the path-scoped benchmark change, restore the previous inventory, and rerun the zero-candidate or complete-map check.
<!-- /ANCHOR:rollback -->
