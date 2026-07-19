---
title: "Implementation Plan: hoisted shared script closures (020 phase 007 child 003)"
description: "Execution plan for shared scripts consumed by multiple skills: construct the consumer graph, select semantic targets, update every script reference, preserve exemptions and modes, and publish component dependencies."
trigger_phrases:
  - "shared script closure implementation plan"
  - "hoisted script naming plan"
  - "phase 007 child 003 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the hoisted shared-script implementation plan"
    next_safe_action: "Build the shared-script consumer graph on the pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/"
      - ".opencode/skills/sk-doc/scripts/"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The phase owns only multi-skill closures; one-skill scripts are delegated to phase 008"
      - "Python `.py` names and Python package directories remain exempt"
---
# Implementation Plan: Hoisted Shared Script Closures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Shared script roots and their multi-skill consumers (phase 007 child 003) |
| **Change class** | Semantic script-name and dependency-closure update |
| **Execution** | Isolated worktree pinned to BASE, using the frozen map and reference checker |

### Overview
The phase will inventory shared script roots, build a reverse consumer graph, and select only scripts whose references cross two or more skill subtrees. It will update the script and every static/dynamic consumer in one closure, preserve Python and tool-mandated exemptions, and hand off symlink edges to child 002 and single-skill scripts to phase 008.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE, phase 005 tooling, and phase 006 map hash are pinned
- [ ] Shared script roots and façade paths are enumerated
- [ ] Consumer ownership can be resolved for imports, `require`, `source`, registries, fixtures, and test commands
- [ ] Python/package, tool-mandated, generated, lockfile, and frozen exclusions are classified
- [ ] Component-owned scripts have a downstream owner before this phase starts

### Definition of Done
- [ ] Every selected script has at least two skill consumers or an explicit closure exception
- [ ] Every consumer path is updated and verified
- [ ] Executable bits and symlink dependencies are preserved
- [ ] The handoff gives phase 008 stable closure dependencies and evidence
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared-script inventory**: enumerate `shared/scripts/`, `scripts/shared/`, and equivalent shared roots.
- **Consumer graph**: map each script to skill owners and to import, `require`, `source`, registry, fixture, and test edges.
- **Semantic target map**: assign explicit kebab-case targets only to non-exempt names and run collision checks.
- **Closure executor**: update script names and all consumers together; coordinate link-nodes with child 002.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE, map hash, and reference-checker receipt.
- [ ] Enumerate shared script roots and identify non-exempt candidate filenames.
- [ ] Resolve consumer ownership across skill trees and mark one-skill delegations.

### Phase 2: Implementation
- [ ] Create the shared-script consumer graph and semantic source-to-target map.
- [ ] Update imports, `require`, `source`, registries, fixtures, test commands, and path-valued configuration.
- [ ] Preserve Python/package exemptions, executable bits, and symlink handoffs.

### Phase 3: Verification
- [ ] Every selected script has multi-skill consumer evidence and one closure record.
- [ ] Static and dynamic consumer dispositions are complete with no stale source path.
- [ ] Script syntax, test discovery, executable modes, and phase handoff checks pass.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare shared-script inventory with the consumer graph and verify at least two skill subtrees per selected script |
| REQ-002 | Inspect semantic target map and run exact/casefold/NFC collision checks |
| REQ-003 | Run the reference checker and exercise imports, `require`, `source`, registries, fixtures, and test commands |
| REQ-004 | Compare changed names/modes with the exemption and symlink manifests; run `node --check`/`bash -n` for affected non-Python scripts |
| REQ-005 | Review one-skill delegation records against phase 008 ownership |
| REQ-006 | Verify closure identifiers, consumers, evidence, and ordering in the downstream handoff |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `000-worktree-baseline-and-census` | Baseline | Required before execution | No stable script or test-discovery comparison |
| `005-rename-and-reference-tooling` | Tooling | Required before execution | Dynamic consumers and path references cannot be dispositioned |
| `006-inventory-and-frozen-map` | Map | Required before execution | Script scope and targets can drift |
| `002-cross-skill-symlink-closure` | Sibling closure | Handoff consumer | Shared façade links cannot be closed atomically |
| Phase 008 component script children | Handoff consumers | Required per delegated script | Single-skill closures lack an owner |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-scoped shared-script closure commit as a unit if syntax, reference, discovery, or mode checks fail. Do not revert a script filename without its consumer updates; if the closure cannot be restored cleanly, discard the isolated worktree and replay from BASE.
<!-- /ANCHOR:rollback -->
