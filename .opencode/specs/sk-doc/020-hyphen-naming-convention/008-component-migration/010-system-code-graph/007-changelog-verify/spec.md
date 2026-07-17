---
title: "Feature Specification: system-code-graph changelog verification (032 phase 007)"
description: "The system-code-graph release history currently ends at v1.3.0.0 and does not yet prove that the 032 filesystem migration was recorded. This read-only phase verifies the next append-only changelog entry, the matching version bump, the complete phase-001–006 rename scope, and the preserved exemption boundary without performing a rename."
trigger_phrases:
  - "system-code-graph changelog verification"
  - "system-code-graph naming version bump"
  - "032 system-code-graph phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification docs"
    next_safe_action: "Verify append-only release evidence after phases 001-006"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/changelog/"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure/checklist.md"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current system-code-graph release baseline is v1.3.0.0 in SKILL.md, INSTALL_GUIDE.md, and changelog/v1.3.0.0.md."
      - "This phase verifies release evidence only; it does not edit changelog history or perform filesystem renames."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: system-code-graph Changelog Verification

> Phase adjacency under the 010-system-code-graph parent: predecessor `006-manual-testing-playbook`; successor `008-skill-gate`. This is a read-only evidence phase; it performs no filesystem rename.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/007-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the system-code-graph component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current system-code-graph release history ends at v1.3.0.0, which predates the 032 kebab-case filesystem
migration. The subtree needs evidence that the complete package, script, reference, runtime, feature-catalog, and
manual-playbook rename set was recorded in an append-only release entry, with a version bump that agrees with the
skill's release metadata and with the exemptions that were deliberately preserved.

This phase reads the latest changelog and release-version consumers, compares them with the evidence from phases
001–006, and blocks the subtree when the entry is absent, incomplete, inconsistent, or history was rewritten. It
does not edit changelogs, rename paths, or repair migration references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The append-only system-code-graph changelog entry following `changelog/v1.3.0.0.md`, expected as
  `changelog/v1.4.0.0.md` unless the approved release-version evidence establishes a different next version.
- Version consumers that identify the current skill release, including `SKILL.md` and `INSTALL_GUIDE.md`, and their
  agreement with the new changelog version.
- Changelog coverage of the phase 001 package-boundary, phase 002 script, phase 003 reference, phase 004 runtime,
  phase 005 feature-catalog, and phase 006 manual-playbook results.
- Changelog coverage of path/reference closure, the `.py` and Python-package exemptions, tool-mandated names,
  generated/lockfile output, test-magic names, identifiers/data keys, and frozen history.
- Evidence that prior changelog entries and non-changelog migration surfaces were not rewritten by this phase.

### Out of Scope
- Any filesystem rename, reference rewrite, code change, version edit, or changelog-history rewrite.
- Inventing or repairing a release entry when the migration evidence is missing; that is a blocking finding for the
  owning migration or release phase.
- Other 032 component-migration subtrees and the central whole-repo gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/changelog/ | Read | Verify the next append-only entry and its version sequence |
| .opencode/skills/system-code-graph/SKILL.md | Read | Compare the release version and preserved naming contracts |
| .opencode/skills/system-code-graph/INSTALL_GUIDE.md | Read | Compare the published skill-version metadata and path examples |
| 001-*/checklist.md through 006-*/checklist.md | Read | Match the entry to each preceding phase's evidence |
| 007-changelog-verify/checklist.md | Read/Record | Record the version, scope, history, and mutation verdict |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify the code-graph version bump | The migration release entry follows v1.3.0.0 at the approved next version, expected v1.4.0.0, and the release-version consumers agree with that value. |
| REQ-002 | Verify the complete rename set is recorded | The entry identifies the package boundary, scripts, references, runtime, feature catalog, and manual-testing-playbook outcomes from phases 001–006. |
| REQ-003 | Verify migration evidence is specific | The entry ties the rename set to path/reference closure and the phase checklists, including zero-candidate results for conditional phases where applicable. |
| REQ-004 | Verify exemptions and frozen history | The entry states that Python files/package directories, tool-mandated names, generated/lockfile output, test-magic names, identifiers/data keys, and frozen changelog history were preserved. |
| REQ-005 | Preserve append-only history | Existing changelog entries are byte-for-byte unchanged and the migration entry is placed after the current history rather than rewriting it. |
| REQ-006 | Keep verification mutation-free | The phase-007 candidate diff contains no filesystem rename, non-changelog repair, or unrelated version change. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The latest system-code-graph changelog entry and release metadata show a matching migration version bump.
- **SC-002**: The entry accurately names all six preceding phase surfaces, reference closure, and the exemption boundary.
- **SC-003**: Prior history is unchanged and phase 007 performs no rename or migration repair.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is accepting a generic release note that does not prove the actual system-code-graph rename set or
that records a version unrelated to the migration. The checklist therefore pins the baseline and expected next
version, compares the entry with phases 001–006, and rejects rewritten history. A missing or mismatched entry blocks
this phase and routes the finding to the owning migration/release phase instead of being silently repaired here.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must confirm the approved next release version against the pinned baseline before judging
the entry; the default expectation is v1.4.0.0 after v1.3.0.0.
<!-- /ANCHOR:questions -->
