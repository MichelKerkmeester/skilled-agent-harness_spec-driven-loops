---
title: "Implementation Plan: root and OpenCode infrastructure strays (020 phase 007 child 001)"
description: "Execution plan for the root and OpenCode infrastructure closure: classify candidates, apply semantic targets, close same-surface references, and hand off cross-skill edges."
trigger_phrases:
  - "root infrastructure closure implementation plan"
  - "OpenCode infrastructure naming plan"
  - "phase 007 child 001 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/001-root-and-opencode-infra-strays"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the root and OpenCode infrastructure implementation plan"
    next_safe_action: "Run the census and classify candidates on the pinned worktree"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - ".opencode/install_guides/"
      - "PUBLIC_RELEASE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The plan uses the phase 005 semantic rename/reference tooling and phase 006 frozen map"
      - "Symlink and shared-script edges are handed to sibling closure children"
---
# Implementation Plan: Root and OpenCode Infrastructure Strays

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Root and `.opencode` infrastructure (phase 007 child 001) |
| **Change class** | Semantic filesystem-name and reference closure |
| **Execution** | Isolated worktree pinned to BASE, using the frozen map |

### Overview
The phase will inventory root-level and `.opencode` infrastructure names that are not owned by one skill, classify each candidate against the 020 exemption boundary, and apply only explicit semantic source-to-target mappings. It will update same-surface path references and emit cross-skill symlink/shared-script edges for sibling closure phases.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 000 BASE and census evidence are pinned
- [ ] Phase 005 rename/reference tooling is available and dry-run capable
- [ ] Phase 006 provides a bijective candidate map with no unknown classifications
- [ ] The scoped root and `.opencode` path inventory is complete
- [ ] Tool-mandated, Python, generated, and frozen exclusions are identified before any target is selected

### Definition of Done
- [ ] Every scoped candidate has one classification and an explicit target or exemption reason
- [ ] Same-surface command, installer, shell, registry, and path-value references resolve
- [ ] Cross-skill edges are handed off without a partial link update
- [ ] The closure manifest is suitable for phase 008 `depends_on` declarations
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Candidate ledger**: enumerate root-level and `.opencode` infrastructure paths, then classify them with the 020 policy.
- **Semantic rename map**: pair each in-scope source with an explicit kebab-case target and collision evidence.
- **Reference closure**: scan command assets, installer scripts, shell sources, registries, and path-valued docs before moving a candidate.
- **Boundary handoff**: stop at symlink or shared-script edges owned by children 002 and 003, preserving the edge in the manifest.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE, the phase 006 map hash, and the phase 005 tool version.
- [ ] Enumerate root-level and `.opencode` candidates, including command assets and install-guide scripts.
- [ ] Identify exact-name contracts and exclusion surfaces before proposing targets.

### Phase 2: Implementation
- [ ] Classify every candidate and record an explicit semantic target for each rename.
- [ ] Resolve same-surface path references in command, install, shell, registry, and documentation consumers.
- [ ] Preserve tool-mandated names and route cross-skill symlink/shared-script edges to sibling children.

### Phase 3: Verification
- [ ] The candidate ledger has no unknown entries or duplicate source/target assignments.
- [ ] Collision checks pass for exact, case-folded, and NFC-normalized targets.
- [ ] Changed path references resolve and no excluded name changed.
- [ ] The child handoff records all boundaries and is consumable by phase 008 component children.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the root/infrastructure census with the frozen map; every candidate has exactly one class |
| REQ-002 | Run semantic-map collision checks and inspect leading-underscore and exact-name cases |
| REQ-003 | Run the rename-map reference checker over command assets, installers, shell sources, registries, and path-valued docs |
| REQ-004 | Compare the changed-path set with the exemption ledger; tool-mandated and Python names remain untouched |
| REQ-005 | Inspect the boundary ledger for every symlink/shared-script edge and confirm sibling ownership |
| REQ-006 | Review the closure manifest for source, target, consumer, evidence, and downstream dependency fields |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `000-worktree-baseline-and-census` | Baseline | Required before execution | No stable comparison or candidate inventory |
| `005-rename-and-reference-tooling` | Tooling | Required before execution | No semantic target or reference-closure proof |
| `006-inventory-and-frozen-map` | Map | Required before execution | Candidate scope can drift or duplicate |
| `002-cross-skill-symlink-closure` | Sibling closure | Handoff consumer | Cross-boundary pointers remain unresolved |
| `003-hoisted-shared-script-closures` | Sibling closure | Handoff consumer | Shared script references remain unresolved |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All execution changes land in path-scoped, dependency-closed commits on the pinned worktree. If a closure check fails, stop before the next target batch; revert the last path-scoped commit or discard the isolated worktree, leaving the frozen map and BASE unchanged.
<!-- /ANCHOR:rollback -->
