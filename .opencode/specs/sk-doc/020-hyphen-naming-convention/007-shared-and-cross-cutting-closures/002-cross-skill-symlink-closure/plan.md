---
title: "Implementation Plan: cross-skill symlink closure (020 phase 007 child 002)"
description: "Execution plan for the atomic symlink closure: inventory link edges, preflight target ownership and modes, update every pointer with its target, and prove no dangling link remains."
trigger_phrases:
  - "cross-skill symlink implementation plan"
  - "atomic symlink closure plan"
  - "phase 007 child 002 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/002-cross-skill-symlink-closure"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the cross-skill symlink implementation plan"
    next_safe_action: "Generate the link-node to target manifest on the pinned worktree"
    blockers: []
    key_files:
      - ".opencode/install_guides/install_scripts/"
      - ".opencode/skills/sk-doc/scripts/"
      - ".claude/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Atomicity and ordering are governed by the child decision record"
      - "Target content changes remain with the target-owning phase"
---
# Implementation Plan: Cross-Skill Symlink Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Cross-skill and shared-infrastructure symlinks (phase 007 child 002) |
| **Change class** | Atomic link-node, target, and reference closure |
| **Execution** | Isolated worktree pinned to BASE, with manifest preflight |

### Overview
The phase will build a reverse index from every symlink link-node to its resolved target, attach target ownership and frozen-map dispositions, and preflight relative-link rendering and mode preservation. The executor then treats each target plus all pointers as one closure; unresolved, colliding, or mode-changing edges abort before a partial update.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE, phase 006 map hash, and phase 005 reference-checker receipt are pinned
- [ ] The symlink manifest includes cross-skill, shared, install-guide, and runtime mirror edges
- [ ] Target ownership and exemption/frozen dispositions are known for every edge
- [ ] The atomicity decision in `decision-record.md` is accepted for execution
- [ ] The candidate closure can be isolated from component target-content work

### Definition of Done
- [ ] Every target move includes all link-nodes and path references in one closure
- [ ] Relative links resolve from each link-node and no link is dangling
- [ ] Link mode, target type, and executable bits match the preflight manifest
- [ ] Downstream component phases have stable closure identifiers and evidence
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Edge manifest**: capture the link path, raw link text, resolved target, target owner, target type, modes, and map disposition.
- **Reverse target index**: group all link-nodes by target so a target cannot move without its full pointer set.
- **Preflight transaction**: calculate every target and relative-link update, then abort on any missing edge, collision, or mode drift before writing.
- **Postflight proof**: resolve each link from its containing directory and compare identity, mode, and target type with the manifest.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE, the frozen map hash, and the reference-checker receipt.
- [ ] Enumerate symlink link-nodes and resolve targets without following through the manifest boundary.
- [ ] Record target ownership, target mode, executable bit, and frozen/exempt disposition.

### Phase 2: Implementation
- [ ] Group link-nodes by target and produce one closure record per affected target.
- [ ] Precompute relative link text and target moves from the link-node directory.
- [ ] Apply target and pointer updates as one dependency-closed batch, aborting before writes on any failed preflight.

### Phase 3: Verification
- [ ] Resolve every changed link from its own directory with no dangling target.
- [ ] Compare symlink mode, target type, target identity, and executable bits with the manifest.
- [ ] Run the reference checker and verify the downstream closure handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the tracked symlink inventory with the edge manifest and inspect link text, target, owner, and modes |
| REQ-002 | Inject an unresolved pointer or collision into a dry-run fixture and confirm preflight aborts before a write; inspect the candidate closure commit |
| REQ-003 | Resolve each link from its containing directory and compare mode `120000`, target type, and target executable bits |
| REQ-004 | Match every changed edge to the phase 006 map and run the phase 005 reference checker |
| REQ-005 | Review dispositions for tool-mandated, Python, generated, lockfile, changelog, archive, and completed-history links |
| REQ-006 | Verify stable closure identifiers, ordering constraints, and evidence are present for phase 008 consumers |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `000-worktree-baseline-and-census` | Baseline | Required before execution | Link modes and target identities lack a comparison point |
| `005-rename-and-reference-tooling` | Tooling | Required before execution | No closure preflight or pointer proof |
| `006-inventory-and-frozen-map` | Map | Required before execution | Target ownership and dispositions can drift |
| `001-root-and-opencode-infra-strays` | Sibling closure | Handoff input where root links are involved | Root link edges can be omitted |
| Target-owning phase 008 child | Component dependency | Required per target | Target content/path ownership is ambiguous |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a postflight resolution, mode comparison, or reference check fails, stop the closure batch and revert its path-scoped commit as a unit. Because the target and all link-nodes share one closure, rollback never rewrites only the pointer side; discard the isolated worktree if the candidate commit cannot be restored cleanly.
<!-- /ANCHOR:rollback -->
