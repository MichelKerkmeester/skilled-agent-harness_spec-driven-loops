---
title: "Feature Specification: sk-git changelog verification (032 phase 008/012/005)"
description: "v4 already shipped sk-git version 1.3.2.0 and its changelog entry as part of the kebab pilot, covering the reference, asset, and manual-playbook renames. This read-only phase verifies that shipped release evidence matches the actual migration; benchmark (004) is not yet migrated on v4, so its changelog coverage is deferred until that phase executes."
trigger_phrases:
  - "sk-git changelog verification"
  - "032 sk-git version bump"
  - "migration changelog evidence"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Reconciled baseline - v4 shipped 1.3.2.0 + changelog for ref/asset/playbook renames"
    next_safe_action: "Verify shipped 1.3.2.0 entry vs the three surfaces; benchmark coverage deferred"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/changelog/"
      - "../001-references/checklist.md"
      - "../002-assets/checklist.md"
      - "../003-manual-testing-playbook/checklist.md"
      - "../004-benchmark/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git changelog verification

> Phase adjacency under the sk-git component parent: predecessor 004-benchmark; successor 006-skill-gate. This is a read-only evidence phase; it performs no filesystem rename.

> **RECONCILED — BASELINE UPDATE (v4 reconciliation, 2026-07-15).** Concurrent v4 work already shipped sk-git **version 1.3.2.0** and its changelog entry `changelog/v1.3.2.0.md` as part of the kebab pilot, covering the completed **references, assets, and manual-testing-playbook** renames. This phase therefore verifies an **already-shipped** entry (not one authored after siblings land). The **benchmark** surface (phase 004) is still snake on v4, so it is NOT part of the 1.3.2.0 entry; its changelog coverage is deferred until 004 executes (a later version bump). See the packet's v4-reconciliation-inventory.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/005-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 005 of the sk-git component migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

v4 already shipped sk-git **version 1.3.2.0** and its changelog entry `changelog/v1.3.2.0.md` as part of the kebab pilot. That entry records the completed reference, asset, and manual-testing-playbook renames. A shipped release note that mentions only a generic cleanup, the wrong source paths, or the wrong version would make the migration unauditable even if the filesystem state is correct, so it must be verified against the real evidence.

The purpose is to verify the **shipped** 1.3.2.0 changelog entry against the actual sibling-phase evidence. The phase checks that the entry names the reference, asset, and manual-testing-playbook work, states the exemption boundary, and matches the version exposed by SKILL.md and README.md; it performs no rename or content migration. The benchmark surface (phase 004) is still snake on v4 and is therefore NOT expected in this entry — its changelog coverage is deferred to a later version bump when 004 executes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify that the shipped .opencode/skills/sk-git/changelog/v1.3.2.0.md exists and has the correct version heading and migration summary.
- Compare the changelog entry with the 001-references, 002-assets, and 003-manual-testing-playbook SOL evidence and final maps. Benchmark (004) is still snake on v4 and is expected to be ABSENT from this entry; confirm the entry does not falsely claim benchmark coverage.
- Verify that SKILL.md and README.md expose version 1.3.2.0 consistently with the changelog.
- Verify that the entry identifies the kebab-case rule and the exemptions for Python scripts, Python package directories, and tool-mandated names.
- Confirm that the changelog does not claim work outside the sk-git component or claim that this read-only phase performed renames.

### Out of Scope
- Renaming or editing any sk-git file, directory, script, report, or changelog content.
- Creating a release, tag, commit, or version bump.
- Rewriting code identifiers, keys, fields, benchmark data, or frozen history.
- Validating sibling phases beyond consuming their evidence contracts; each sibling owns its own migration acceptance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/changelog/v1.3.2.0.md | Verify only | Confirm the migration entry, version heading, path map summary, and exemption statement. |
| .opencode/skills/sk-git/SKILL.md | Verify only | Confirm the exposed version matches the changelog. |
| .opencode/skills/sk-git/README.md | Verify only | Confirm the exposed version matches the changelog. |
| 001-references/checklist.md through 004-benchmark/checklist.md | Read only | Consume sibling evidence and compare the changelog claims with verified scope. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A changelog entry exists for the migration version. | changelog/v1.3.2.0.md exists, has a v1.3.2.0 heading, and is associated with the sk-git version 1.3.2.0. |
| REQ-002 | The entry matches the actual completed migration set. | It names the references, assets, and manual-testing-playbook surfaces and agrees with those three sibling evidence reports and maps. It does not claim benchmark coverage, which v4 has not yet migrated. |
| REQ-003 | The entry records the naming rule and exemption boundary. | It states kebab-case as the in-scope filesystem form and does not claim Python scripts, Python package directories, or tool-mandated names were renamed. |
| REQ-004 | Version consumers are consistent. | SKILL.md, README.md, and the changelog expose the same 1.3.2.0 version. |
| REQ-005 | This phase remains read-only. | The candidate report shows no file mutation, rename, content rewrite, or release action from phase 005. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shipped v1.3.2.0 changelog entry exists and accurately describes the three completed sibling migration phases (references, assets, manual-testing-playbook), without claiming benchmark coverage.
- **SC-002**: SKILL.md, README.md, and the changelog agree on version 1.3.2.0.
- **SC-003**: The changelog evidence contains no scope, exemption, or execution claim contradicted by sibling checklists.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on completed sibling evidence and the current sk-git version contract. Its main risks are a version mismatch, a changelog summary that omits the benchmark/profile map, or a claim that conflicts with the exemption boundary. The checklist requires exact version, surface, map, and no-mutation evidence.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The live version is now 1.3.2.0 — v4 shipped it as the patch-level release for the reference/asset/playbook kebab pilot. When benchmark (004) later executes, it will need its own version bump and changelog entry; that is out of scope for this phase, which only verifies the already-shipped 1.3.2.0 evidence.
<!-- /ANCHOR:questions -->
