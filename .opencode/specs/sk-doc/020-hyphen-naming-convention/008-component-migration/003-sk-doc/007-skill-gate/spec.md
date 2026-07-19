---
title: "Feature Specification: sk-doc subtree rollup gate"
description: "The sk-doc component phases need one blocking rollup that aggregates their evidence and proves the whole naming surface is kebab-clean under the 020 exemption boundary. This phase adds no migration work; it verifies every sibling phase and the final subtree census."
trigger_phrases:
  - "sk-doc skill gate"
  - "sk-doc naming rollup"
  - "020 sk-doc subtree gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-doc rollup gate docs"
    next_safe_action: "Aggregate sibling evidence and run the final census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/", "../001-hub-root-and-shared/checklist.md", "../003-create-packets/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc subtree rollup gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/007-skill-gate` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-doc surface is split across direct component phases and eleven nested create-packet phases. Individual green reports do not prove that every in-scope snake_case filesystem name has been handled, that zero-row phases are accounted for, or that an exemption was not used to hide a missed rename.

The outcome is a blocking, read-only rollup gate that requires every sibling checklist to pass and proves the complete `.opencode/skills/sk-doc` surface is kebab-clean outside the explicit exemption set.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Aggregate evidence from direct phases 001, 002, 004, 005, 006, and their checklists.
- Aggregate evidence from nested create-packet leaves 001 through 011.
- Verify the subtree census for non-exempt snake_case filesystem names, excluding Python `.py`, Python package directories, tool-mandated names, keys, and frozen surfaces.
- Confirm zero-row evidence for root benchmark and create-diff phases and changelog/version evidence from phase 006.

### Out of Scope

- Any new rename, reference edit, code change, script change, or changelog edit.
- Reclassifying a path without an amendment to the owning phase.
- Surfaces outside `.opencode/skills/sk-doc` and historical/frozen content excluded by 001.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/` | Verify only | Run the whole-surface naming census and reference checks |
| Direct/nested phase checklists and reports | Read/aggregate | Confirm every sibling acceptance contract has evidence |
| `007-skill-gate/` | Documentation only | Store the rollup contract; no migration work is performed |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every executable sibling phase is green | Direct leaves 001, 002, 004, 005, 006 and nested leaves 001-011 have passing checklist evidence |
| REQ-002 | Zero-row phases are accounted for | Root benchmark and create-diff reports prove their empty/zero-row baselines |
| REQ-003 | The whole sk-doc surface is kebab-clean in scope | Final census finds no in-scope snake_case filesystem name outside the exemption set |
| REQ-004 | Exemptions are explicit and complete | Python files/package dirs, tool-mandated names, keys, and frozen surfaces are classified rather than ignored |
| REQ-005 | Changelog/version evidence is synchronized | Phase 006 passes and the release entry agrees with `SKILL.md` and sibling scope |
| REQ-006 | The gate itself performs no migration | The phase diff contains only rollup documentation/evidence, not rename or code changes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every executable sk-doc child phase has a passing, evidence-pinned checklist.
- **SC-002**: The final whole-surface census has zero unclassified or in-scope snake_case filesystem names.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All sibling evidence | Missing phase can hide a stale path | Require an explicit evidence row for every leaf |
| Risk | Exemption overreach | Real snake_case debt is accepted | Reconcile every exemption with 001 and a concrete path class |
| Risk | Zero-row phase is skipped | Surface coverage is incomplete | Require pinned empty-census reports |
| Risk | Rollup performs a repair | Scope and evidence become ambiguous | Keep gate read-only and return findings to owner phase |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. A final census finding must block the gate and route back to the owning phase; it must not be fixed inside the rollup.
<!-- /ANCHOR:questions -->
