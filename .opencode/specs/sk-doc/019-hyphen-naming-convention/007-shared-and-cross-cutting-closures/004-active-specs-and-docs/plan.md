---
title: "Implementation Plan: active specs and documents (017 phase 007 child 004)"
description: "Execution plan for active spec/document names: separate authored packets from generated and frozen state, preserve numeric phase-folder forms, close document links and path values, and strict-validate every touched packet."
trigger_phrases:
  - "active specs documents implementation plan"
  - "spec document naming closure plan"
  - "phase 007 child 004 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/007-shared-and-cross-cutting-closures/004-active-specs-and-docs"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the active spec/document implementation plan"
    next_safe_action: "Census active authored packets and classify generated/frozen paths"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/019-hyphen-naming-convention/"
      - ".opencode/specs/system-code-graph/"
      - ".opencode/specs/system-deep-loop/"
      - ".opencode/specs/system-speckit/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Compliant three-digit phase folders are preserved"
      - "Only path-derived frontmatter values change; fields and data keys stay unchanged"
---
# Implementation Plan: Active Specs and Documents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Active `.opencode/specs/**` packets and authored documents (phase 007 child 004) |
| **Change class** | Spec/document filesystem-name and link closure |
| **Execution** | Isolated worktree pinned to BASE, with per-packet validation receipts |

### Overview
The phase will inventory active authored spec packets and document paths, separate them from archives, changelogs, generated research/review state, scratch output, and tool-owned names, then apply semantic targets only to the remaining candidates. It will update markdown links and path-valued continuity/frontmatter references and strict-validate every touched packet before handoff.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE, phase 005 tooling, and phase 006 map hash are pinned
- [ ] Active, archived, generated, frozen, and tool-mandated spec surfaces are identified
- [ ] Numeric phase-folder compliance is encoded as an explicit non-rename rule
- [ ] Touched packet levels and required document sets are known
- [ ] Path-valued frontmatter and markdown reference consumers are discoverable

### Definition of Done
- [ ] Every active candidate has one classification and an explicit semantic target or exemption
- [ ] All changed document links, path values, and continuity pointers resolve
- [ ] Every touched packet passes strict validation with its required docs intact
- [ ] The handoff lists packets, evidence, and cross-closure dependencies for phase 008
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Scope classifier**: distinguish active authored packets from `z_archive/`, changelogs, completed history, generated state, research/review archives, scratch, Python, and tool-owned surfaces.
- **Structural guard**: accept phase folders matching `^[0-9]{3}-[a-z0-9-]+$` and never derive a rename from the numeric prefix alone.
- **Document closure**: map document sources to markdown links, relative references, packet pointers, and other path-valued frontmatter consumers.
- **Packet verifier**: run strict validation per touched packet and attach the receipt to the closure handoff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE, map hash, and reference-checker receipt.
- [ ] Census active spec folders and documents and mark archived/generated/frozen boundaries.
- [ ] Record packet levels, required docs, and numeric phase-folder exemptions.

### Phase 2: Implementation
- [ ] Assign semantic targets to in-scope active document/folder candidates.
- [ ] Update markdown links, relative references, continuity packet pointers, and path-valued frontmatter.
- [ ] Hand symlink/shared-script edges to children 002/003 and preserve fields, keys, code identifiers, and generated state.

### Phase 3: Verification
- [ ] The active candidate ledger has no unknown or duplicate source/target entries.
- [ ] All changed document links and path values resolve with no stale source path.
- [ ] Every touched packet passes strict validation and the handoff records the evidence.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the active spec/document census with the frozen map and confirm each path has one classification |
| REQ-002 | Run positive/negative structural fixtures for numeric phase folders and snake_case names |
| REQ-003 | Run markdown-link and path-value resolution across every changed packet; inspect continuity pointers |
| REQ-004 | Run `validate.sh --strict` for every touched packet and compare required Level 2/3 files and anchors |
| REQ-005 | Compare changed paths against archive/generated/Python/tool-mandated dispositions |
| REQ-006 | Verify packet-level receipts and cross-closure dependencies in the phase handoff |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `000-worktree-baseline-and-census` | Baseline | Required before execution | Active/frozen classification lacks a stable baseline |
| `005-rename-and-reference-tooling` | Tooling | Required before execution | Links and path values cannot be closed systematically |
| `006-inventory-and-frozen-map` | Map | Required before execution | Structural and generated dispositions can drift |
| System-spec-kit strict validator | Verification | Required per touched packet | Broken packet structure can reach phase 008 |
| Children 002 and 003 | Cross-closure handoff | Required when edges appear | Symlink/shared-script references remain unresolved |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert each packet/document closure in its path-scoped commit if link resolution or strict validation fails. Restore the packet and its path-valued references together; do not roll back a document filename while retaining the updated continuity or markdown links. Discard the isolated worktree if a clean packet-level rollback is not possible.
<!-- /ANCHOR:rollback -->
