---
title: "Implementation Plan: system-code-graph references"
description: "Rename the seven reference Markdown files with an explicit path map, repair all top-level and relative links, and prove the already-compliant gold-query assets and reference contracts remain unchanged."
trigger_phrases:
  - "system-code-graph references implementation plan"
  - "code graph reference link closure"
  - "reference filename rename map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references implementation plan"
    next_safe_action: "Freeze seven-file reference map"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The seven reference-file targets are database-path-policy, code-graph-readiness-check, readiness-and-scope-fingerprint, launcher-lease, naming-conventions, ownership-boundary, and tool-surface."
      - "The two code-graph-gold-queries.json asset files are already compliant and remain outside the rename set."
---

# Implementation Plan: system-code-graph references

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references, path-aware documentation links, JSON asset references |
| **Framework** | sk-doc resource routing and Markdown link contracts |
| **Storage** | Version-controlled references tree and already-compliant gold-query assets |
| **Testing** | Rename-map check, Markdown/path resolution, reference discovery, content/hash parity |

### Overview
Use a bijective map for the seven reference files and update only filesystem path contexts in their consumers.
Reference keys and identifiers remain unchanged, while the two existing code-graph-gold-queries.json assets receive an
explicit already-compliant disposition rather than entering a mechanical underscore sweep.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Seven reference files, target names, and all reference consumers are pinned.
- [ ] Top-level, plugin bridge, relative reference, catalog, and playbook links are enumerated.
- [ ] Asset/template dispositions, reference discovery counts, and BASE content hashes are recorded.

### Definition of Done
- [ ] All seven reference files have kebab-case names and no stale live old paths.
- [ ] Every affected link and path pointer resolves.
- [ ] Reference keys, path-hint identifiers, fields, content, and already-compliant assets retain BASE semantics.
- [ ] No generated/template file was fabricated or hand-edited outside its owner.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed reference-file rename with path-only link rewriting.

### Key Components
- Reference groups: config/database_path_policy.md, readiness/*.md, and runtime/*.md.
- Consumers: SKILL, README, ARCHITECTURE, INSTALL_GUIDE, plugin bridge docs, reference cross-links, catalog, and playbook.
- Preserved boundaries: reference keys, path-hint identifiers, Markdown content, code/data identifiers, and compliant assets.

### Data Flow
The skill routes agents through path hints and supporting reference links, while operators navigate top-level and
cross-surface documentation. The map updates each reference filename and link target; it does not change the route
key, tool identity, or policy prose.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate the seven reference files and the two existing gold-query asset files.
- [ ] Scan top-level docs, plugin bridge docs, relative references, catalog, playbook, and external live consumers.
- [ ] Freeze targets, collision evidence, link counts, content hashes, and intentional old-name dispositions.

### Phase 2: Implementation
- [ ] Rename the seven reference files to database-path-policy.md, code-graph-readiness-check.md,
  readiness-and-scope-fingerprint.md, launcher-lease.md, naming-conventions.md, ownership-boundary.md, and tool-surface.md.
- [ ] Update all path-valued links and hints in the enumerated consumers.
- [ ] Preserve reference keys, path-hint identifiers, frontmatter, prose, code/data identifiers, and gold-query assets.

### Phase 3: Verification
- [ ] Scan for stale live old reference paths and resolve every affected Markdown/path link.
- [ ] Run reference discovery and documentation checks with BASE-equivalent counts.
- [ ] Compare content/hashes for preserved assets and non-path values.
- [ ] Hand off the reference map to the runtime/catalog/playbook phases and subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Seven reference files, assets, templates, collisions | rg, filesystem manifest, rename-map checker |
| Links | Top-level, relative, catalog, playbook, and plugin documentation | Markdown/path resolver |
| Discovery | Resource routing and path-hint resolution | targeted sk-doc/system-code-graph checks |
| Content | Reference prose, fields, identifiers, and assets | parser/hash comparison |
| Integration | Operator documentation and runtime reference pointers | focused documentation scans |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 package map | Internal | Required | Package-root prefixes can remain stale |
| Feature-catalog and playbook maps | Internal | Required | Cross-surface links cannot be fully closed |
| Frozen reference inventory | Internal | Required | Partial rename can leave broken relative links |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing reference target, broken link, discovery drift, changed route key, or asset/content hash drift.
- **Procedure**: Restore the seven-file map and path-only link edits in the isolated worktree, retain the old-name
  disposition ledger, and rerun the reference/link baseline before retrying.
<!-- /ANCHOR:rollback -->

