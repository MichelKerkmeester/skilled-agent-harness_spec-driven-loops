---
title: "Implementation Plan: cli-external-orchestration hub root and shared boundary (020 phase 005.001)"
description: "Implementation plan for the cli-external-orchestration root/shared boundary: capture the live root census, protect exact router contracts, apply only owned path mappings, and keep playbook and benchmark ownership delegated."
trigger_phrases:
  - "cli-external hub root implementation plan"
  - "cli external shared boundary plan"
  - "cli-external phase 001 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub boundary plan"
    next_safe_action: "Capture the pinned root census"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions:
      - "A later execution census must re-check the absent shared/ boundary."
    answered_questions:
      - "The current root-owned map is empty; delegated playbook and benchmark paths remain outside it."
---
# Implementation Plan: cli-external-orchestration hub root and shared boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Direct `.opencode/skills/cli-external-orchestration/` children and optional `shared/` |
| **Change class** | Ownership census, bounded authored rename, root reference closure |
| **Execution** | Pinned BASE, disposition ledger, protected-name and routing checks |

### Overview
The plan starts with a direct-child census and records the current absence of `shared/`. It then evaluates only hub/shared-owned authored names, leaving all playbook, benchmark, and CLI component paths to their assigned phases. A zero-candidate owned map is valid when the census proves it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 020 scope/exemption record and component phase map are available.
- [ ] Candidate and BASE SHAs are pinned and the direct root census is captured.
- [ ] Each root child has an ownership and naming disposition before any rename.

### Definition of Done
- [ ] Owned root/shared names have unique kebab-case targets or the empty map is evidenced.
- [ ] Protected hub files and routing semantics are unchanged.
- [ ] Delegated paths remain untouched and root-owned references resolve.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a boundary ledger: path → owner → classification → target/reference action → evidence. This prevents a root-wide underscore substitution from crossing child-phase ownership.

### Key Components
- **Hub contract**: `SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, and metadata files.
- **Optional shared tree**: inspect only if present; do not create it.
- **Delegated trees**: root/component playbooks, benchmark, and CLI component assets remain in their child maps.

### Data Flow
Pinned root inventory → ownership/classification ledger → owned source-target map → targeted rename/reference update → routing and scope verification.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture root and optional shared inventories from BASE.
- [ ] Classify protected, delegated, generated, frozen, exempt, and owned authored names.
- [ ] Record the absence of `shared/` when absent and hash the disposition map.

### Phase 2: Implementation
- [ ] Rename only owned authored root/shared paths to explicit kebab-case targets.
- [ ] Update only root/shared path-valued references.
- [ ] Keep tool-mandated filenames, keys, identifiers, routing values, and delegated child trees unchanged.

### Phase 3: Verification
- [ ] Re-enumerate the boundary and prove every path has one disposition.
- [ ] Parse the routing files and verify existing modes/resources still resolve.
- [ ] Search for stale owned source paths and inspect the diff for delegated-scope leakage.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare direct-child/shared census with the ledger; fail on unknown or duplicate ownership |
| REQ-002 | Check each owned target for kebab-case and confirm no stale owned source path remains |
| REQ-003 | Parse `hub-router.json` and `mode-registry.json`; compare protected names and routing values with BASE |
| REQ-004 | Review the diff against all delegated playbook, benchmark, and component roots |
| REQ-005 | Resolve every root/shared-owned path reference from the candidate tree |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the 020 exemption and dependency-closure rules. Phases 002–006 may update paths beneath the hub, so their checklists must use this boundary record when distinguishing a root consumer from a root-owned candidate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the bounded root/shared rename and reference changes if a protected-name, collision, routing, or delegated-scope check fails. If the census finds an unexpected shared subtree, stop before mutation and amend the disposition map rather than widening the operation implicitly.
<!-- /ANCHOR:rollback -->

