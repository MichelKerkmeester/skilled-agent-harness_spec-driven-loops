---
title: "Feature Specification: system-skill-advisor subtree skill gate"
description: "Aggregate the eight system-skill-advisor child-phase contracts and prove that the whole naming surface is kebab-clean within the program exemption boundary. This is a rollup gate with no new migration work."
trigger_phrases:
  - "system-skill-advisor skill gate"
  - "advisor subtree naming gate"
  - "kebab-case rollup verification"
  - "system-skill-advisor migration closure"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the subtree rollup-gate contract"
    next_safe_action: "Aggregate sibling evidence and run the scoped naming gate on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 008 performs no new rename or source migration."
      - "Every sibling phase must pass its own L2 checklist before the subtree gate can pass."
      - "The final scan is scope-aware: Python names, Python package directories, tool-mandated/generated/lockfile names, identifiers, keys, frozen history, and intentional non-path mentions are excluded."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor subtree skill gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/008-skill-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 008 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The six surface-migration phases can each appear green while a cross-phase path, an exempt name, a stale reference,
or an unrecorded changelog/version mismatch remains. The system-skill-advisor subtree needs one blocking rollup that
aggregates sibling evidence and scans the actual surface as a single naming boundary.

### Purpose
Accept the subtree only when every sibling contract passes, release evidence is present, and no in-scope snake_case
filesystem name or stale path reference remains outside the approved exemption set.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sibling phases 001–007 and their specs, plans, tasks, checklists, and any phase-specific decision record.
- The complete .opencode/skills/system-skill-advisor filesystem tree, including package root, scripts, references,
  hooks, feature catalog, manual playbook, changelog links, and runtime/docs consumers.
- Aggregated rename-map coverage, old-path scans, exemption classification, link/reference checks, discovery counts,
  compatibility/build evidence, and release evidence.

### Out of Scope
- New renames, source-code redesign, root-consumer policy changes, changelog authoring, or edits in other 020
  component subtrees.
- Changing Python filenames/package directories, tool-mandated/generated/lockfile names, identifiers/keys, frozen
  history, or intentional explanatory mentions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 001-mcp-server-dir-and-manifest-closure/ through 007-changelog-verify/ | Verify only | Aggregate sibling evidence and P0 results |
| .opencode/skills/system-skill-advisor/ | Verify only | Run the scope-aware subtree inventory and link/reference gate |
| 008-skill-gate/checklist.md | Evidence | Record the final rollup verdict and pinned receipts |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All sibling contracts are present and complete | Phases 001–007 each contain the required L2 docs, and any phase-specific decision record is present only where declared. |
| REQ-002 | Every sibling P0 check passes | The gate report links each sibling checklist, candidate SHA, BASE SHA, map hash, commands, exit codes, and discovery counts. |
| REQ-003 | The whole advisor surface is classified | Package, script, reference, hook, catalog, playbook, changelog, generated, tool-mandated, Python, and frozen names have no unknown bucket. |
| REQ-004 | No in-scope snake_case filesystem name remains | The scope-aware scan reports zero remaining in-scope snake_case names and zero stale live path references. |
| REQ-005 | Exemptions and intentional mentions are respected | Python/package/tool/generated/lockfile/frozen/identifier cases are excluded with evidence; retained old strings are classified as non-path mentions. |
| REQ-006 | Runtime and documentation closure is green | Link/reference checks, package/launcher smoke, script and scenario discovery, catalog/playbook validation, and version evidence retain BASE parity. |
| REQ-007 | The gate performs no new migration | The rollup diff contains evidence only; any newly discovered candidate is returned to the owning sibling phase and blocks this gate. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling phase P0 contracts are green with pinned, reviewable evidence.
- **SC-002**: The system-skill-advisor subtree has zero unclassified in-scope snake_case filesystem names and zero stale live path references.
- **SC-003**: The rollup proves runtime, documentation, scenario, catalog, playbook, and release evidence remain coherent.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | All sibling phases | One missing handoff invalidates the aggregate result | Fail closed and name the exact child/checklist that is incomplete. |
| Risk | Scope-aware scan overreaches into identifiers or exemptions | Valid Python/tool names are falsely reported as migration debt | Reconcile each hit against the program policy and frozen classification map. |
| Risk | A green leaf hides a cross-phase broken link | The subtree looks clean but users cannot navigate it | Run whole-surface link/reference checks after all leaf maps are applied. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The gate must use the centrally selected BASE SHA and rename-map hash and must fail if either receipt
is missing or if any sibling phase reports a new unresolved candidate.
<!-- /ANCHOR:questions -->
