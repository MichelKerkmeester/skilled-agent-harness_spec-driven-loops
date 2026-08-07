---
title: "Implementation Plan: deep-alignment filesystem names (020 phase 007/007)"
description: "Plan for renaming deep-alignment assets, catalog/playbook paths, and adapter/state references through a path-aware semantic map, then proving that embedded identifiers, authority keys, and read-only behavior remain unchanged."
trigger_phrases:
  - "deep-alignment implementation plan"
  - "alignment kebab-case rename plan"
  - "alignment adapter path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep alignment phase plan"
    next_safe_action: "Execute the deep alignment rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-alignment filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/deep-alignment/` |
| **Change class** | Alignment resource filesystem rename plus path-string repair |
| **Execution** | Isolated worktree using the pinned BASE, semantic path map, and key/identifier manifest |
| **Verification** | Authority routing, resource resolution, playbook parity, read-only checks, and key preservation |

### Overview

Rename the 15 alignment directory families and 68 underscore-bearing files using path-aware rows only. Repair path values in the embedded resource maps and adapter references, while keeping authority/lane keys, code-like identifiers, configuration keys, and the read-only tool boundary byte-stable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers all 15 directories and 68 files with explicit path-versus-identifier dispositions.
- [ ] BASE authority, lane, resource, playbook, and read-only tool-surface evidence is captured.
- [ ] Embedded code/data key inventories and dynamic adapter path references are listed.

### Definition of Done

- [ ] Alignment paths and active consumers are kebab-clean and resolvable.
- [ ] Four authority adapters, resource/playbook coverage, and state transitions match BASE.
- [ ] No identifier/key, authority name, tool contract, or read-only boundary changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Path layer**: rename assets, references, catalog/playbook categories, and leaf files through the semantic map.
- **Embedded-map layer**: update only strings that resolve to moved files; compare identifier, authority, lane, and key inventories separately.
- **Verification layer**: exercise each registered authority and the read-only guard with the renamed resources.
- **Content boundary**: preserve `SKILL.md`, data keys, frontmatter fields, authority names, state events, and generated output.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the alignment map, BASE path/key manifest, authority/resource inventory, and read-only baseline.
- [ ] Trace embedded path strings and dynamic adapter references; disposition all non-filesystem strings.

### Phase 2: Core Implementation

- [ ] Rename alignment asset, catalog, playbook, behavior-benchmark, and reference paths.
- [ ] Update path-valued resource maps, adapter links, Markdown links, indexes, and test inputs.
- [ ] Preserve authority/lane identifiers, JSON/YAML keys, tool names, generated output, and read-only permissions.

### Phase 3: Verification

- [ ] Resolve all old/new resource and adapter paths for the four authorities.
- [ ] Compare catalog/playbook coverage, state transitions, route outputs, and key inventories with BASE.
- [ ] Run read-only and alignment verification checks with non-zero authority/scenario discovery.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 15 directories and 68 files once, with path/key classifications and collisions. |
| Path integrity | Resolve asset/reference/catalog/playbook links and adapter/resource map path values. |
| Key preservation | Compare authority names, lane keys, embedded identifiers, JSON/YAML keys, and frontmatter fields with BASE. |
| Alignment parity | Exercise all four authorities, state transitions, route/verdict behavior, and read-only checks. |
| Exemption safety | Confirm SKILL.md, generated output, Python/package, tool names, database columns, and frozen history. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Frozen path/key map | Internal | Path strings cannot be separated safely from identifiers and keys. |
| Runtime path closure | Sibling | Alignment backend/resource consumers may remain stale. |
| BASE authority/read-only manifest | Internal | Adapter and permission parity cannot be proven. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed key/identifier, missing adapter resource, read-only violation, authority/scenario drift, or collision.
- **Procedure**: Revert only the alignment path batch, restore the path/key manifest, and rerun all authority and read-only checks before retrying.
<!-- /ANCHOR:rollback -->
