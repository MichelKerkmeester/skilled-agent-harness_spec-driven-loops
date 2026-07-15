---
title: "Feature Specification: sk-git skill gate (017 phase 008/012/006)"
description: "The sk-git component needs a blocking rollup gate that aggregates the five sibling phase contracts and proves its complete tracked filesystem surface is kebab-clean within the 017 exemption boundary. This phase adds no migration work."
trigger_phrases:
  - "sk-git skill gate"
  - "017 sk-git naming rollup"
  - "sk-git subtree kebab-case gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-git rollup gate from the sibling phase contracts and full surface inventory"
    next_safe_action: "Run the rollup gate after phases 001 through 005 are accepted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/"
      - "../001-references/checklist.md"
      - "../002-assets/checklist.md"
      - "../003-manual-testing-playbook/checklist.md"
      - "../004-benchmark/checklist.md"
      - "../005-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git skill gate

> This is the final sk-git rollup phase under the component parent. It aggregates sibling evidence and performs no new rename or reference migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 006 of the sk-git component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Five sibling phases cover the sk-git references, assets, manual-testing-playbook, benchmark, and changelog evidence, but their individual green results do not prove that the whole skill surface is free of an in-scope snake_case filesystem name. A rollup must also reconcile already-compliant paths, exemptions, stale pointers, sibling scope, and the final version evidence.

The purpose is to provide that blocking rollup contract. The phase consumes sibling evidence, scans the entire tracked sk-git surface, confirms the exemption set is applied exactly, and reports whether the component is ready for the parent migration gate. It does not create a second rename map or perform new migration work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the final status and SOL evidence for phases 001-references, 002-assets, 003-manual-testing-playbook, 004-benchmark, and 005-changelog-verify.
- Reconcile the aggregate source-to-target dispositions, including the nine reference entries, three asset entries, 49 manual-playbook entries, two benchmark profile directories, and the changelog/version evidence.
- Scan every tracked filesystem path under .opencode/skills/sk-git for in-scope snake_case names, including root files, feature-catalog paths, scripts, changelog, and benchmark contents.
- Apply the 017 exemption boundary: Python scripts, Python package directories, tool-mandated names, keys/fields, and frozen content are not treated as failures.
- Verify that no stale active pointer or source/target duplicate remains and that the final changelog/version evidence is consistent.

### Out of Scope
- Any new rename, reference rewrite, code change, changelog edit, version bump, release, or commit.
- Repairing a sibling phase failure inside the gate; the gate reports the owning phase and evidence needed for correction.
- Files outside .opencode/skills/sk-git, other 017 component subtrees, or frozen history beyond read-only inspection.
- Treating underscores in content, identifiers, keys, fields, or exempt names as filesystem violations.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/ | Verify only | Scan the complete tracked naming surface and active path references. |
| 001-references/ through 005-changelog-verify/ | Read only | Consume sibling checklists, reports, maps, and version evidence. |
| 006-skill-gate/checklist.md | Authored contract | Define the blocking rollup acceptance checks; no runtime migration artifact is produced. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase is complete under its own blocking contract. | Phases 001 through 005 have passing P0 checks, pinned SOL reports, and no unresolved blocker or stray implementation artifact. |
| REQ-002 | The aggregate map is reconciled without unknown or duplicate dispositions. | The rollup lists the nine reference entries, three asset entries, 49 manual-playbook entries, two benchmark profile entries, and the changelog/version evidence with matching hashes/counts. |
| REQ-003 | The whole tracked sk-git surface is kebab-clean within the exemption set. | The all-path scan finds zero in-scope snake_case directories or files outside Python/package/tool-mandated/frozen exemptions. |
| REQ-004 | Active pointers and final version evidence are closed. | No stale in-scope source path resolves from active consumers; changelog, SKILL.md, and README.md version values agree. |
| REQ-005 | The gate performs no migration work. | The candidate report proves read-only inspection and contains no rename, content rewrite, version bump, release, or other tracked mutation. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five sibling phase contracts pass and their evidence is reconciled.
- **SC-002**: The complete tracked sk-git surface has zero in-scope snake_case filesystem names outside the 017 exemption set.
- **SC-003**: Active path references, source/target duplicates, aggregate map hashes, and version evidence are consistent.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The gate depends on every sibling SOL report and the final candidate commit. Its main risks are a false clean result caused by scanning only the assigned directories, misclassifying an exemption, or accepting a sibling report with stale counts. The checklist requires a complete tracked-path scan, sibling evidence hash reconciliation, and a no-mutation proof.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. A failure is routed back to the owning sibling phase with the exact path, evidence hash, and unmet check; the rollup does not repair it.
<!-- /ANCHOR:questions -->
