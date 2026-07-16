---
title: "Implementation Plan: sk-prompt hub root and shared boundary (032 phase 004.001)"
description: "Implementation plan for phase 001 of the sk-prompt kebab-case program: census the hub root/shared boundary, apply only owned path renames, preserve exact routing files, and hand delegated trees to their child phases."
trigger_phrases:
  - "sk-prompt hub root implementation plan"
  - "sk-prompt shared boundary plan"
  - "sk-prompt phase 001 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the bounded root/shared implementation plan"
    next_safe_action: "Capture the pinned root census before any filesystem operation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/README.md"
      - ".opencode/skills/sk-prompt/hub-router.json"
      - ".opencode/skills/sk-prompt/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "No shared/ directory is present in the current root inventory."
      - "manual_testing_playbook/ and benchmark/ are delegated child-phase surfaces."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: sk-prompt hub root and shared boundary

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Direct `.opencode/skills/sk-prompt/` children and an optional `shared/` subtree |
| **Change class** | Ownership census, bounded authored rename, root reference closure |
| **Execution** | Pinned BASE, disposition map, protected-name and routing checks |

### Overview
The plan starts with a direct-child census and records the current absence of `shared/`. It then evaluates only root/shared-owned authored names, leaving delegated playbook, benchmark, prompt-improve, and prompt-models paths to their assigned phases. A zero-candidate root/shared result is valid when the census proves it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-parent map and 032 scope/exemption record are available.
- [ ] Candidate and BASE SHAs are pinned, and the direct root census is captured.
- [ ] Each root child has an ownership and naming disposition before any rename.

### Definition of Done
- [ ] Owned root/shared names are mapped to unique kebab-case targets or the empty map is evidenced.
- [ ] Protected hub files and routing semantics are unchanged.
- [ ] Delegated paths are untouched and root/shared active references resolve.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a boundary ledger: path → owner → classification → target/reference action → evidence. The ledger prevents a root-wide underscore substitution from crossing child-phase ownership.

### Key Components
- **Hub contract**: `SKILL.md`, `hub-router.json`, `mode-registry.json`, metadata, and README entry points.
- **Optional shared tree**: inspect only if present; do not create it.
- **Delegated trees**: playbook, benchmark, prompt-improve, and prompt-models paths remain in their child maps.

### Data Flow
Pinned root inventory → ownership/classification ledger → owned path map → targeted rename/reference update → routing and scope verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture root and optional shared inventories from BASE.
- [ ] Classify protected, delegated, generated, exempt, and owned authored names.
- [ ] Record the absence of `shared/` when absent and hash the disposition map.

### Phase 2: Implementation
- [ ] Rename only owned authored root/shared paths to their explicit kebab-case targets.
- [ ] Update only root/shared path-valued references.
- [ ] Keep tool-mandated filenames, keys, identifiers, and delegated child trees unchanged.

### Phase 3: Verification
- [ ] Re-enumerate the boundary and prove every path has one disposition.
- [ ] Parse the routing files and verify the existing modes/resources still resolve.
- [ ] Search for stale owned source paths and inspect the diff for scope leakage.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the direct-child/shared census with the disposition ledger; fail on unknown or duplicate ownership |
| REQ-002 | Check each owned target for kebab-case and confirm no stale owned source path remains |
| REQ-003 | Parse `hub-router.json` and `mode-registry.json`; compare protected names and routing values with BASE |
| REQ-004 | Review the diff against the delegated child roots and confirm they are absent from the phase change set |
| REQ-005 | Resolve every root/shared path reference from the candidate tree |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the 032 exemption and dependency-closure rules. Phases 002–005 may update root references for paths they own, so their checklists must use this boundary record when distinguishing a root consumer from a root-owned candidate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the bounded root/shared rename and reference changes if a protected-name, collision, routing, or delegated-scope check fails. If the census finds an unexpected shared subtree, stop before mutation and amend the disposition map rather than widening the operation implicitly.
<!-- /ANCHOR:rollback -->
