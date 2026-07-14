---
title: "Feature Specification: cross-skill symlink closure (017 phase 007 child 002)"
description: "Symlink targets and link-nodes cross skill boundaries, so a target name change is safe only when every pointer, relative target string, and executable target mode moves as one dependency-closed operation."
trigger_phrases:
  - "cross-skill symlink closure"
  - "atomic symlink rename contract"
  - "hyphen naming symlink phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the cross-skill symlink closure contract and atomicity decision scope"
    next_safe_action: "Execute the symlink manifest preflight against the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/install_guides/install_scripts/install-spec-kit-memory.sh"
      - ".opencode/skills/sk-doc/scripts/validate_document.py"
      - ".opencode/skills/sk-code/code-opencode/references/workflow_debug.md"
      - ".claude/skills"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The closure includes link-nodes whose resolved targets cross skill or shared-infrastructure boundaries"
      - "A target move without every pointer update is a failed closure, not an acceptable intermediate state"
      - "Symlink content remains link text; target file content is owned by its target phase"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Cross-Skill Symlink Closure

> Child adjacency under the 007 parent (grouping order, not a runtime dependency): sibling `001-root-and-opencode-infra-strays`; shared script and active spec closures are `003-hoisted-shared-script-closures` and `004-active-specs-and-docs`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | Shared migration tooling / all affected skills |
| **Origin** | Child 002 of the 007 shared and cross-cutting dependency-closures phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The repository uses symlinks as cross-surface façades. For example, install-guide scripts point into skill scripts, `.opencode/skills/sk-doc/scripts/` points into create-* and shared script trees, and `.claude` mirrors the `.opencode` surface. If a target path changes while one link-node or relative target string stays stale, the tree becomes partially broken even when the target itself is valid.

This child defines a complete symlink-edge manifest and an atomicity/ordering contract: a target, all pointers to it, and the path references that select those pointers move together or the operation aborts before any partial update.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Symlink link-nodes and resolved targets that cross skill, runtime, or shared-infrastructure boundaries.
- Install-guide links such as `.opencode/install_guides/install_scripts/install-spec-kit-memory.sh` and the corresponding skill target.
- Skill façade links under `.opencode/skills/sk-doc/scripts/` and shared-reference links under `.opencode/skills/sk-code/**/references/`.
- Runtime mirror links such as `.claude/{commands,skills,specs,changelog}` when a target path participates in the closure.
- Relative-link text, target resolution, link mode `120000`, target executable-bit preservation, and all reference edges.
- A downstream manifest that gives component phases explicit closure dependencies.

### Out of Scope
- Content changes inside target files; the owning component child performs those changes.
- Non-symlink filesystem names without a symlink edge; children 001, 003, and 004 own those surfaces.
- Changelog or `z_archive/` content changes, even when their link-nodes are inventoried.
- Python `.py` files, Python import-package directories, tool-mandated names, generated/lockfile output, code identifiers, data keys, and frontmatter fields.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Symlink link-nodes in `.opencode/**` and `.claude/**` | Link update | Repoint every link in the closure to its mapped target |
| Resolved target paths owned by another skill | Target rename handoff | Move only with the owning target phase and the full pointer set |
| Symlink and reference manifests | Create/update evidence | Record link text, resolved target, mode, consumer, and disposition |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory every candidate symlink edge | The manifest records link path, stored link text, resolved target, target owner, link mode, target executable mode, and source-map disposition |
| REQ-002 | Enforce an atomic closure boundary | A target rename is committed only with every affected link-node and pointer updated; any unresolved edge aborts the batch before writes |
| REQ-003 | Preserve symlink semantics | Relative links remain relative to the link-node, link mode remains `120000`, target executable bits are preserved, and no link is dangling |
| REQ-004 | Use the frozen semantic map and reference checker | Every target/link pair points to a source or target in the phase 006 map, and the phase 005 checker reports zero unresolved edges |
| REQ-005 | Protect exempt and frozen link surfaces | Tool-mandated, Python, generated, lockfile, changelog, archive, and completed-history links remain in their approved disposition |
| REQ-006 | Publish a component-phase handoff | The manifest exposes stable closure identifiers, ordering constraints, and evidence for phase 008 `depends_on` declarations |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the tracked symlink manifest, **when** each link is resolved from its own directory, **then** every target has an owner and a frozen-map disposition.
- **SC-002**: **Given** a target with links in multiple skills, **when** one target name changes, **then** all link-nodes and relative link texts update in the same dependency-closed operation or no path changes are retained.
- **SC-003**: **Given** a relative symlink and an executable target, **when** the closure is checked, **then** relative resolution, mode `120000`, target exec bits, and target identity match the preflight manifest.
- **SC-004**: **Given** a failed collision, missing target, or unresolved pointer, **when** the batch preflight runs, **then** it fails closed before mutating the worktree.
- **SC-005**: **Given** a completed closure, **when** phase 005 reference checking runs, **then** no dangling symlink or stale link path remains and the closure handoff is complete.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Impact | Mitigation |
|-------------------|--------|------------|
| One target has link-nodes in several skill trees | A local rename leaves partial consumers | Build the reverse target-to-links index before any move and require atomic execution |
| Relative link text is rewritten from the wrong directory | The link appears valid but resolves to the wrong file | Resolve and re-render link text relative to each link-node, then test from the link directory |
| A symlink target is executable or a directory | Mode drift can break launchers or package layout | Capture target type and mode in the manifest and compare after the closure |
| Global `.claude` or changelog mirrors are treated as normal content | Frozen or runtime surfaces can be altered unintentionally | Classify mirror and frozen edges separately; move only the approved link-node closure |
| Phase 006 map or phase 005 checker is unavailable | Atomicity cannot be proven | Block execution until both receipts and hashes are recorded |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any link whose target ownership is ambiguous is a preflight failure and stays in the handoff ledger for the owning phase rather than being guessed.
<!-- /ANCHOR:questions -->
